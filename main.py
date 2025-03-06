from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os
from pydantic import BaseModel
import requests
import time
from scorecalc import add_to_db

load_dotenv()
DB_URL = os.getenv("DB_URL")

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

route_url = "https://api.mihomo.me/sr_info_parsed/{UID}?lang={LANG}"
uid_example = "600505603"
lang_example = "en"

alt_route = "https://enka.network/api/uid/{UID}"

@app.get("/srd/{uid}")
def sr_info_parsed(uid: str):
    url = route_url.format(UID=uid, LANG=lang_example)
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
    cur.execute("SELECT * FROM rankings ORDER BY rank LIMIT %s", (limit,))
    result = cur.fetchall()
    return result

# [from, to)
@app.get("/get_lb/{lb_name}/{page}/{lim}")
def get_lb (lb_name: str, page: int, lim: int):
    cur.execute("SELECT * FROM leaderboard WHERE character_name = %s ORDER BY score DESC LIMIT %s OFFSET %s", (lb_name, lim, (page-1)*lim))
    result = cur.fetchall()
    return result

@app.get("/get_lb_count/{lb_name}")
def get_lb_count (lb_name: str):
    try:
        cur.execute("SELECT COUNT(*) FROM leaderboard WHERE character_name = %s", (lb_name,))
        result = cur.fetchall()
    
    except Exception as e:
        print(f"Error: {e}")

    return result


class Score(BaseModel):
    player_id: int
    username: str
    score: int

@app.post("/add-score", status_code=201)
def add_score(score: Score):
    print("Adding score: ", score)
    try:
        # SQL query to insert data
        insert_query = sql.SQL("""
            INSERT INTO scores (player_id, username, score)
            VALUES (%s, %s, %s)
            ON CONFLICT (player_id) 
            DO UPDATE SET 
                username = EXCLUDED.username, 
                score = EXCLUDED.score;
            """)
        # Execute query with data from the request body
        cur.execute(insert_query, (score.player_id, score.username, score.score))
        conn.commit()

        return {"message": "Score added successfully"}
    except Exception as e:
        # Rollback in case of error
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
# @app.post("/add-lb", status_code=201)
# def 

@app.get("/")
def home():
    return {"message": "Honkai Star Rail Ranking API is running!"}










class Add(BaseModel):
    uid: str

@app.post("/add")
def add(add: Add):
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
        add_to_db(response.json(), conn, cur)

    else:
        print("Error with UID: ", uid, " Status Code: ", response.status_code)


@app.get("/mass_add/{uid_start}/{uid_end}")
def mass_add( uid_start: str, uid_end: str):
    for uid in range(int(uid_start), int(uid_end)):

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
                    break

            except Exception as e:
                print("Error with UID: ", uid, " Error: ", e)
                break

        if response.status_code == 200:
            print("Adding UID: ", uid)
            add_to_db(response.json(), conn, cur)

        else:
            print("Error with UID: ", uid, " Status Code: ", response.status_code)