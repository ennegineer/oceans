# import dependencies
from flask import Flask, jsonify, render_template
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

# # Trawler route
# @app.route("/<int:mmsi>")
# def trawlersroute(mmsi):
#     print("Server received request for trawlers...")
#     # write a statement that finds all the items in the db and sets it to a variable
#     mmsi_entry = list(trawlers.find({"mmsi": mmsi}))
#     return mmsi_entry



if __name__ == "__main__":
    app.run()
