# import dependencies
from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine
import pymongo
#################################################
# Database Setup
#################################################
# Create connection variable
conn = "mongodb://localhost:27017"
# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)
# connect to mongoDB and collection
db = client.oceans_db
trawlers = db.trawlers
eutrophic = db.eutrophic

#################################################
# Flask Setup
#################################################

# Create an app
app = Flask(__name__)
app._static_folder = 'static'


#################################################
# Flask Routes
#################################################
@app.route("/")
def home():
    print("Server received request for 'Home' page...")

    return render_template('index.html')

# 'key' route
@app.route("/key")
def key():
    print("Loading Key...")
    return render_template('key.html')

# 'sources' route
@app.route("/sources")
def sources():
    print("Loading Sources...")
    return render_template('sources.html')
    
# 'data' route
@app.route("/data")
def data():
    print("Loading Data...")
    return render_template('data.html')

# 'data' route
@app.route("/process")
def process():
    print("Loading Process...")
    return render_template('process.html')

# Trawler route
@app.route("/api/trawler/<int:mmsi>")
def trawlersroute(mmsi):
    print("Server received request for trawlers...")
    # write a statement that finds all the items in the db and sets it to a variable
    mmsi_entry = jsonify({'trawlers': list(mmsi)})
    # list(trawlers.find({"mmsi": mmsi}))
    return mmsi_entry

# Trawler route
@app.route("/api/trawlers")
def alltrawlers():
    print("Server received request for trawlers...")
    # write a statement that finds all the items in the db and sets it to a variable
    all_trawlers = jsonify({'trawlers': list(all)})
    # list(trawlers.find())
    return all_trawlers


if __name__ == "__main__":
    app.run()
