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
import random
import json

load_dotenv()
DB_URL = os.getenv("DB_URL")

# Example DB_URL: "postgresql://username:password@hostname:port/database_name"
# Sample DB_URL: "postgresql://user:password@localhost:5432/mydatabase"
conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://starrailproject-fe.vercel.app"],  # Frontend URL
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
    cur.execute("SELECT * FROM rankings ORDER BY rank LIMIT %s", (limit,))
    result = cur.fetchall()
    return result

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
            INSERT INTO scores (player_id, name, score)
            VALUES (%s, %s, %s)
            ON CONFLICT (player_id) 
            DO UPDATE SET 
                name = EXCLUDED.username, 
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


















queue = [600441727,
600441727,
600441727,
600441727,
702462688,
700850571,
700920040,
802656936,
603283509,
603283509,
600574027,
600574027,
105177941,
604946466,
105253591,
600355703,
115512837,
603038525,
815590475,
112643444,
700444407,
700444407,
700031788,
108279067,
102007956,
602060452,
102759671,
700439076,
700439076,
601309522,
602529384,
108827401,
108827401,
800029463,
700716849,
700716849,
700716849,
111217980,
115079191,
600288997,
600288997,
600288997,
700467545,
701046053,
601541779,
119101303,
701245962,
701024654,
701024654,
809893088,
100205879,
100205879,
100205879,
119705166,
119705166,
105198672,
104718703,
702130064,
702097820,
702097820,
102512184,
105655179,
105655179,
802031668,
100468858,
100468858,
805108232,
100473846,
101571826,
101571826,
101571826,
104650836,
113287177,
602671578,
107334575,
700099913,
801375922,
801205090,
813603291,
601734956,
601371241,
604468122,
117163414,
810197735,
110018964,
104182126,
104182126,
100018184,
700485832,
106793169,
703628785,
804488734,
804488734,
110229988,
103088876,
602437380,
700381170,
117447530,
600352014,
702216462,
117003067,
803460202,
803460202,
112692666,
112692666,
107230807,
107230807,
107230807,
109812577,
110981546,
101337043,
807111104,
801418991,
801418991,
801418991,
109707822,
109707822,
804523194,
110482635,
603097120,
603097120,
804435225,
102195101,
117185732,
701758930,
101989739,
101989739,
701227099,
116102981,
804327898,
114032713,
600793765,
114334658,
113145210,
107656491,
107656491,
800531752,
800531752,
111468714,
111468714,
603757415,
603757415,
100358802,
600158581,
603193773,
802484728,
105732186,
105732186,
102741522,
102741522,
600806411,
600013134,
702391973,
116510745,
116510745,
116750808,
116750808,
103680736,
103680736,
103680736,
601247023,
704160162,
113924436,
104152510,
104152510,
106039784,
106039784,
602597349,
110715954,
113158464,
113158464,
602998163,
112646974,
100238964,
100238964,
107693784,
103110305,
114036600,
114036600,
117437129,
117437129,
105850488,
700789691,
703960246,
703344513,
800193312,
701046798,
111232888,
104004855,
600718892,
600718892,
109609130,
700710287,
113535580,
113535580,
113535580,
600305615,
118189837,
602757456,
600842689,
600842689,
600998472,
101061157,
105335987,
703142838,
109879176,
107068049,
118452878,
604810647,
604810647,
604810647,
114457982,
115683524,
115464788,
115464788,
106246841,
804854318,
700530579,
600125130,
600125130,
108296081,
800920317,
800920317,
100581129,
701292684,
602423080,
700776093,
601680764,
702304168,
702304168,
117386401,
701718948,
105800072,
801560018,
801560018,
801560018,
800862489,
101213807,
703772269,
104485256,
700791523,
700911466,
700911466,
700948400,
802745304,
703932620,
703932620,
101329157,
100673755,
803152278,
803152278,
601609906,
812895209,
700000544,
112300943,
100060323,
100060323,
100060323,
602442007,
701150648,
701150648,
800263858,
800263858,
800263858,
704180164,
600856687,
600856687,
600856687,
105953999,
116934700,
701956753,
600377005,
600377005,
107383494,
107383494,
114286179,
114286179,
800575414,
702341488,
113644489,
701631586,
603723376,
810882326,
701668210,
700937775,
702053491,
600279257,
809148180,
601217533,
800067009,
602559674,
603646975,
700612252,
700612252,
601236820,
600356572,
600356572,
103701966,
600424270,
600424270,
802204949,
107642016,
107286194,
107286194,
603158737,
600131483,
600131483,
601108204,
603190698,
700441288,
112763807,
600071908,
600071908,
601268994,
602240539,
701292752,
701292752,
701292752,
701292752,
600827189,
116808110,
700246970,
118670890,
811557260,
811557260,
108635138,
117897639,
117897639,
808871531,
601726694,
601278169,
601225759,
603744528,
603744528,
603744528,
701737009,
701737009,
700890468,
810250725,
103489364,
103489364,
100267644,
100267644,
100267644,
100263649,
100263649,
100263649,
100263649,
108539959,
108539959,
700288736,
110586267,
110586267,
110490165,
110490165,
110490165,
603432325,
114840546,
117289666,
600704113,
800138192,
102382199,
811277635,
602669429,
602669429,
100126800,
100881725,
116543051,
102471654,
102471654,
703308652,
111713542,
701652671,
103693231,
113295980,
101635477,
101635477,
108882356,
102908077,
601529087,
601797615,
601492262,
701979690,
701979690,
108115161,
101753306,
700304095,
105746976,
702894497,
603892694,
701049399,
108690929,
101316495,
110144102,
110505636,
703795881,
808607726,
700121922,
700121922,
703621091,
103325462,
602006446,
602006446,
101850967,
701422530,
807068385,
807068385,
112126417,
112126417,
112126417,
109012823,
604840077,
602696375,
113253532,
800642940,
101383264,
700496470,
700496470,
601185951,
701150632,
601881137,
110017370,
115793261,
118120067,
600293646,
602801291,
600000881,
110440301,
110440301,
112401483,
114379431,
106977140,
600030857,
700023453,
700023453,
701828442,
601886230,
702726189,
702726189,
104269061,
702574798,
803183343,
702517218,
802332688,
600163937,
701511995,
103309466,
103309466,
803349744,
802738015,
804765306,
111811046,
700977887,
109024142,
702024251,
802732726,
100007419,
603272523,
809242759,
809242759,
102829042,
102829042,
700774628,
700774628,
106249763,
110619494,
110619494,
603073202,
114193438,
107024153,
600361009,
600361009,
800820645,
801712760,
604852209,
700987615,
700987615,
600327250,
701328702,
701328702,
603565180,
104070502,
700355254,
110011932,
600073383,
600073383,
602657244,
602632416,
806064696,
600081741,
600081741,
801724175,
702160823,
105917826,
106721570,
811513506,
602196769,
809461190,
809461190,
700257580,
800195900,
800195900,
800195900,
601935740,
103921616,
103921616,
103921616,
108669865,
108669865,
600042401,
114857731,
801263341,
105332830,
105332830,
600311286,
113799337,
104123787,
600406664,
600209154,
804081298,
108164509,
108164509,
108164509,
801098257,
602560198,
602560198,
101652615,
808901320,
601200844,
104032751,
100598185,
602062495,
602726525,
103657767,
701324949,
601300973,
601300973,
600519034,
102141476,
109314756,
118968593,
807313605,
802822247,
109350441,
100151448,
703110054,
703110054,
700167407,
111844416,
111844416,
700134391,
112316557,
117799809,
102044133,
105489242,
600049726,
109328338,
601221734,
107817737,
101297565,
101297565,
110966644,
701471443,
106975727,
800627742,
800627742,
107843459,
103115261,
103115261,
106335644,
701333072,
112359184,
704305074,
600270030,
600270030,
111802758,
115572577,
115572577,
115572577,
601125676,
103162203,
600421828,
803786624,
600075279,
114477333,
114443753,
114443753,
105333501,
700559381,
700448896,
700448896,
700479985,
800719304,
800719304,
702907316,
702978250,
702978250,
602519809,
103259778,
103259778,
702323334,
702323334,
702323334,
701077984,
701077984,
701077984,
110993519,
600292776,
103308018,
103308018,
100107310,
110137031,
110137031,
110137031,
600445947,
700930735,
802228959,
815937750,
100088420,
801778769,
801778769,
801778769,
114562315,
603696090,
100593149,
109855566,
109855566,
600293290,
810246694,
810246694,
113709447,
113709447,
102466912,
108360963,
601561519,
601561519,
701370785,
701370785,
114400470,
114400470,
701372183,
701372183,
602013636,
602013636,
602013636,
107601211,
701124542,
701156204,
701156204,
601227744,
107790803,
700001184,
805179295,
809120734,
800064956,
700082007,
600571290,
700103753,
114286507,
106373918,
115262802,
115262802,
812379592,
118525401,
103114872,
603428964,
603428964,
603396498,
603396498,
801627815,
100202117,
101514002,
108647325,
108647325,
803120706,
118113902,
118113902,
704211802,
704211802,
704211802,
105976074,
104474858,
106165572,
110670113,
600224098,
602132399,
601228927,
113759561,
803021427,
102639965,
117885417,
113210241,
104538479,
103075190,
103075190,
702652772,
702652772,
700740861,
603952782,
603952782,
803635107,
803635107,
703158312,
703158312,
800045022,
702870899,
805265652,
601554148,
603918395,
603918395,
704328745,
704328745,
101797869,
600713082,
114249277,
802261735,
701007131,
701007131,
115583213]

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


