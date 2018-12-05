const MongoClient = require('mongodb').MongoClient;

class MongoDB {
  constructor(serverURL, dbName) {
    this.serverURL = serverURL;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  connect() {
    let self = this;
    return new Promise(function(resolve, reject) {
      MongoClient.connect(
        self.serverURL,
        function(err, client) {
          if (err) {
            reject(err);
          } else {
            self.client = client;
            self.db = client.db(self.dbName);
            resolve(self);
          }
        }
      );
    });
  }

  validateOpenedConnection(errorCallback) {
    if (!this.client || !this.db) {
      errorCallback(new Error('MongoDB connection not opened'));
    }
  }

  insert(collectionName, records) {
    let self = this;
    return new Promise(function(resolve, reject) {
      const collection = self.db.collection(collectionName);
      collection.insertMany(
        records,
        self.defaultCallback.bind(self, resolve, reject)
      );
    });
  }

  select(collectionName,criteria={}) {
    let self = this;
    return new Promise(function(resolve, reject) {
      const collection = self.db.collection(collectionName);
      collection.find(criteria).toArray(self.defaultCallback.bind(self, resolve, reject));
    });
  }

  disconnect() {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.validateOpenedConnection(reject);
      self.client.close();
      resolve();
    });
  }

  defaultCallback(resolve, reject, err, results) {
    if (err) {
      reject(err);
    } else {
      resolve(results);
    }
  }
}

module.exports = MongoDB;