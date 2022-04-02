# import dependencies
from flask import Flask, jsonify, render_template
import pymongo
import config

#################################################
# Database Setup
#################################################
# Create connection variable
conn = config.uri
# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# connect to mongoDB and collection
db = client.oceans_db
trawlers = db.trawlers

#################################################
# Flask Setup
#################################################

# Create an app
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    print("Server received request for 'Home' page...")
    # write a statement that finds all the items in the db and sets it to a variable
    boots = list(trawlers.find({"mmsi": 1252339803566}))
    print(boots)

    return render_template('index.html', trawler=boots)


# Trawler route
@app.route("/<int:mmsi>")
def trawlersroute(mmsi):
    print("Server received request for trawlers...")
    # write a statement that finds all the items in the db and sets it to a variable
    mmsi_entry = list(trawlers.find({"mmsi": mmsi}))
    print(mmsi)
    return mmsi_entry



if __name__ == "__main__":
    app.run()
