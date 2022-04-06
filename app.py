# import dependencies
from flask import Flask, jsonify, render_template, redirect
from flask_pymongo import PyMongo

#################################################
# Flask Setup
#################################################

# Create an app
app = Flask(__name__)
app._static_folder = 'static'

#################################################
# Database Setup
#################################################
# Create connection variable
app.config["MONGO_URI"] = "mongodb://localhost:27017/oceans_db"
# conn = "mongodb://localhost:27017/oceans_db"
# Pass connection to the pymongo instance.
# client = pymongo.MongoClient(conn)
mongo = PyMongo(app)

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

# 'analysis' direct route
@app.route("/direct")
def direct():
    print("Loading Fish...")
    return render_template('direct.html')

# 'analysis' indirect route
@app.route("/indirect")
def indirect():
    print("Loading Trash...")
    return render_template('indirect.html')

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

# Specific Trawler route
@app.route("/api/trawler/<int:mmsi>")
def trawlersroute(mmsi):
    print("Server received request for trawlers...")
    try:
        # Find one record of data from the mongo database
        print(mmsi)
        mmsi_entry = mongo.db.trawlers.find({"mmsi": mmsi}, {"_id": 0})
        
        # print(jsonify(list(mmsi_entry)))
        return jsonify(list(mmsi_entry)).data
    except Exception as e:
        print(e)
        return redirect("/data", code=302)
    
# Trawler route
@app.route("/api/trawlers")
def alltrawlers():
    print("Server received request for trawlers...")
    print(mongo.db)
    try:
        # Find one record of data from the mongo database
        print(mongo.db)
        trawlers = mongo.db.trawlers.find({},{"_id": 0})
        print(trawlers[0])
        return jsonify(list(trawlers)).data
    except Exception as e:
        print(e)
        return redirect("/data", code=302)

# All Debris route
@app.route("/api/marinedebris")
def marinedebris():
    print("Server received request for marine debris...")
    try:
        # Find one record of data from the mongo database
        debris = mongo.db.debris.find({},{"_id": 0, "master_item_id": 0})
        print(debris[0])
        return jsonify(list(debris)).data
    except Exception as e:
        print(e)
        return redirect("/data", code=302)

# Specified Debris route
@app.route("/api/marinedebris/<material>")
def specmarinedebris(material):
    print("Server received request for marine debris...")
    try:
        # Find one record of data from the mongo database
        debris = mongo.db.debris.find({"material": material},{"_id": 0, "master_item_id": 0})
        print(debris[0])
        return jsonify(list(debris)).data
    except Exception as e:
        print(e)
        return redirect("/data", code=302)

if __name__ == "__main__":
    app.run()
