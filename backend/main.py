from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import requests
import time
from scorecalc import add_to_db
import random
import json
from psycopg2 import sql

load_dotenv()
DB_URL = os.getenv("DB_URL")

# Example DB_URL: "postgresql://username:password@hostname:port/database_name"
# Sample DB_URL: "postgresql://user:password@localhost:5432/mydatabase"
# conn = psycopg2.connect(DB_URL)
# db_pool = pool.SimpleConnectionPool(1, 10, DB_URL)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"
                   , "https://starrailproject-fe.vercel.app"
                   , "https://stylla.moe"
                   , "https://star.stylla.moe"
                   , "https://www.stylla.moe"
                   ],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

route_url = "https://api.mihomo.me/sr_info_parsed/{UID}?l={LANG}"
raw_route = "https://api.mihomo.me/sr_info/{UID}"
# raw_route = "https://hsr20.hakush.in/char/"

uid_example = "600505603"
lang_example = "en"

alt_route = "https://enka.network/api/uid/{UID}"

# @contextmanager
# def get_db_conn():
#     conn = db_pool.getconn()
#     try:
#         yield conn
#     finally:
#         db_pool.putconn(conn)

def get_conn():
    conn = psycopg2.connect(
        DB_URL,
        ssl_mode='require',
        connect_timeout=10
    )
    try:
        yield conn
    finally:
        conn.close()
        
@app.get("/srd/{uid}")
def sr_info_parsed(uid: str):
    url = route_url.format(UID=uid, LANG=lang_example)
    response = requests.get(url)
    try:
        return response.json()
    except json.JSONDecodeError as e:
        print("Failed to parse JSON:", e)
        print("Raw response:", response.text[:200])


@app.get("/srd_raw/{uid}")
def sr_info_raw(uid: str):
    url = raw_route.format(UID=uid)
    response = requests.get(url)
    try:
        return response.json()
    except ValueError:
        return {"error": "Invalid JSON response"}
    
@app.get("/test/{char_id}")
def test(char_id: str):
    test_url = "https://hsr20.hakush.in/char/{char_id}"
    url = test_url.format(char_id=char_id)
    response = requests.get(url)
    return response.json()

@app.get("/srdr/{uid_start}/{uid_end}")
def sr_info_parsed_range(uid_start: str, uid_end: str):
    result = {}
    rate_delay = 0.05
    uid = int(uid_start)
    while uid <= int(uid_end):
        url = route_url.format(UID=uid, LANG=lang_example)
        response = requests.get(url)

        #validate response
        print("UID: ", uid)
        print("Status Code: ", response.status_code)
        if response.status_code == 429:
            print("Rate Limit Exceeded, delaying request for ", rate_delay, " seconds")
            rate_delay *= 2
            time.sleep(rate_delay)
            continue
            
        if response.status_code == 404:
            print("404 Error: ", uid)
            uid += 1
            continue

        if response.status_code != 200:
            print("Weird Error: ", response.status_code)
            uid += 1
            continue

        rate_delay = 0.05
        result[uid] = response.json()
        uid += 1
    return result

@app.get("/sr_alt/{uid}")
def sr_info_alt(uid: str):
    url = alt_route.format(UID=uid)
    response = requests.get(url)
    print(response.json())
    return response.json()

@app.get("/rankings/{limit}")
def get_rankings(limit: int):
    with get_conn() as conn:
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM rankings ORDER BY rank LIMIT %s", (limit,))
                result = cur.fetchall()
                return result
        except Exception as e:
            print(f"Error with get_rankings: {e}")
    return None

@app.get("/get_lb/{lb_name}/{page}/{lim}")
def get_lb (lb_name: str, page: int, lim: int):
    with get_conn() as conn:
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT * FROM leaderboard WHERE character_name = %s ORDER BY score DESC LIMIT %s OFFSET %s",
                    (lb_name, lim, (page-1)*lim)
                )
                result = cur.fetchall()
                return result
        except Exception as e:
            print(f"Error with get_lb: {e}")
    return None

@app.get("/get_lb_first/{lb_name}")
def get_lb_first(lb_name: str):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM leaderboard WHERE character_name = %s ORDER BY score DESC LIMIT 1",
                (lb_name,)
            )
            result = cur.fetchall()
            return result
    return None

@app.get("/get_lb_count/{lb_name}")
def get_lb_count (lb_name: str):
    with get_conn() as conn:
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT COUNT(*) FROM leaderboard WHERE character_name = %s",
                    (lb_name,)
                )
                result = cur.fetchall()
                return result
        except Exception as e:
            print(f"Error with get_lb_count: {e}")
    return None


class Score(BaseModel):
    player_id: int
    username: str
    score: int

@app.post("/add-score", status_code=201)
def add_score(score: Score):
    print("Adding score: ", score)
    with get_conn() as conn:
        try:
            # SQL query to insert data
            insert_query = sql.SQL("""
                INSERT INTO scores (player_id, name, score)
                VALUES (%s, %s, %s)
                ON CONFLICT (player_id) 
                DO UPDATE SET 
                    name = EXCLUDED.name, 
                    score = EXCLUDED.score;
                """)
            cur = conn.cursor()
            # Execute query with data from the request body
            cur.execute(insert_query, (score.player_id, score.username, score.score))
            conn.commit()

            return {"message": "Score added successfully"}
        except Exception as e:
            print(f"Error adding score: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
    
# @app.post("/add-lb", status_code=201)
# def 

@app.get("/")
def home():
    return {"message": "Honkai Star Rail Ranking API is running!"}










class Add(BaseModel):
    uid: str

@app.post("/add")
def add(add: Add):
    with get_conn() as conn:
        uid = add.uid
        delay = 0.05
        response = None
        while response is None:
            try:
                url = route_url.format(UID=uid, LANG=lang_example)
                response = requests.get(url)

                if response.status_code == 429:
                    print("Rate Limit Exceeded, delaying request for ", delay, " seconds")
                    time.sleep(delay)
                    delay *= 2
                    response = None
                    continue

                if response.status_code == 404:
                    print("404 Error: ", uid)

            except Exception as e:
                print("Error with UID: ", uid, " Error: ", e)

        if response.status_code == 200:
            print("Adding UID: ", uid)
            cur = conn.cursor()
            add_to_db(response.json(), conn, cur)

        else:
            print("Error with UID: ", uid, " Status Code: ", response.status_code)


















queue = []

def get_uid(queue, queueIndex, region_list, region_bounds, included):
    # if queueIndex < len(queue):
    #     included[queue[queueIndex]] = True
    #     return (queue[queueIndex], queueIndex + 1, region_list, region_bounds, included)
    
    # random.seed(12312424)
    index = random.randint(0, len(region_list) - 1)
    region = region_list[index]
    bounds = region_bounds[index]
    uid = random.randint(region*100000000 + bounds[0], region*100000000 + bounds[1])

    # stop = 0

    # while uid in included:
    #     index = random.randint(0, len(region_list) - 1)
    #     region = region_list[index]
    #     bounds = region_bounds[index]
    #     uid = random.randint(region*100000000 + bounds[0], region*100000000 + bounds[1])
    #     stop += 1
    #     if stop > 100:
    #         print("Stopping after 100 iterations")
    #         return (None, None, region_list, region_bounds, included)

    # included[uid] = True
    return (uid, queueIndex, region_list, region_bounds, included)

# @app.get("/mass_add/{count}")
# def mass_add( count: int):

#     queueIndex = 0
#     region_list = [1,6,7,8]
#     region_bounds = [
#         [0, 20000000],
#         [0, 5000000],
#         [0, 5000000],
#         [0, 17000000]
#     ]
#     included = {}


#     for i in range(0, count):
#         delay = 1
#         uid, queueIndex, region_list, region_bounds, included = get_uid(queue, queueIndex, region_list, region_bounds, included)
#         if uid is None:
#             print("Stopped at ", i)
#             break
#         response = None
#         while response is None:
#             try:
#                 url = route_url.format(UID=uid, LANG=lang_example)
#                 response = requests.get(url)

#                 if response is None or not hasattr(response, 'status_code'):
#                     print("Weird Error: ", uid)
#                     break

#                 if response.status_code == 429:
#                     print("Rate Limit Exceeded, delaying request for ", delay, " seconds")
#                     time.sleep(delay)
#                     response = None
#                     continue

#                 if response.status_code == 404:
#                     print("404 Error: ", uid)
#                     break

#             except Exception as e:
#                 print("Error with UID: ", uid, " Error: ", e)
#                 response = None
#                 break

#         if not response:
#             print("Response is None for UID: ", uid)
#             continue

#         if response.status_code == 200:
#             print("Adding UID: ", uid)
#             add_to_db(response.json(), conn, cur)

#         else:
#             print("Error with UID: ", uid, " Status Code: ", response.status_code)


