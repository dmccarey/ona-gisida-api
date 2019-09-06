const config = require('../config.json')
    , AWS = require('aws-sdk')
AWS.config.credentials = {
 "accessKeyId": config.awsAccessKey,
 "secretAccessKey": config.awsSecretKey
}
const db = new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })



module.exports = {
  all: () => {
    console.log('getting all layers')
    return true
  },

  add: function() {
    console.log(this)
    var layer = Object.assign({}, sampleLayer)
    layer.id = this.makeId()
    var params = {
     TableName: 'gisida-layers',
     Item: layer
   }
     db.put(params, function(err, data) {
       if (err) {
         console.log(err)
         return err

       } else {
         console.log(data)
         return data
      }
   })
  },

  edit: function(layer) {
    return new Promise(function (resolve, reject) {
      var params = {
      TableName: 'gisida-layers',
      Item: layer
      }
      db.put(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
     })
   })
  },

  delete: () => {
    console.log('delete layer')
    return true
  },

  get: function(id) {
    return new Promise(function (resolve, reject) {
      var params = {
      TableName: 'gisida-layers',
        Key: {
          'id': id
        }
      }
      console.log(params)
      db.get(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          if (data.Item) {
            resolve(data.Item.layer)
          } else {
            reject(err)
          }
        }
     })
   })
  },

  getLayerObj: function(id) {
    return new Promise(function (resolve, reject) {
      var params = {
      TableName: 'gisida-layers',
        Key: {
          'id': id
        }
      }
      db.get(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data.Item)
        }
     })
   })
  },

  view: function(id, host) {
    console.log(id, host)
    return new Promise(function (resolve, reject) {
      var params = {
      TableName: 'gisida-layers',
        Key: {
          'id': id
        }
      }
      db.get(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          console.log(data)
          var store = projectConfig
          var apiUrl = config.prodApiUrl
          if (host.includes('localhost')) {
            apiUrl = config.devApiUrl
          }
          if (data.Item) {
            store.LAYERS = [`${apiUrl}layer/${id}`]
            store.APP.mapConfig.center = data.Item.center
            store.APP.mapConfig.zoom = data.Item.zoom
            resolve(store)
          } else {
            store.LAYERS = []
            store.APP.mapConfig.center = [20, 20]
            store.APP.mapConfig.zoom = 2
            resolve(store)
          }
        }
     })
   })
  },

  all: function() {
    return new Promise(function (resolve, reject) {
      var params = {
       TableName: 'gisida-layers',
       IndexName: 'account-index',
       KeyConditionExpression: 'account = :pkey',
       ExpressionAttributeValues: {
        ':pkey': 'ona'
       }
      }
       db.query(params, function(err, data) {
         if (err) {
           reject(err)
         } else {
           resolve(data)
         }
       })
    })
  },

  makeId: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text
  }

}


const projectConfig = {
  "APP": {
    "mapConfig": {
      "container": "map",
      "style": "mapbox://styles/mapbox/light-v9",
      "center": [
        20,
        20
      ],
      "zoom": 2
    },
    "accessToken": "pk.eyJ1Ijoib25hIiwiYSI6ImNqZmIxbncyNDNzODQyd3BubDhoOGhob2YifQ.4REao5V_2NlvgKOtX046Gw",
    "appIcon": "/assets/img/gisida-logo.png",
    "appName": "GISIDA",
    "appNameDesc": "This is a demo site for Gisida",
    "appColor": "darkslategrey",
    "layersPath": "/layers"
  },
  "STYLES": [
    {
      "label": "Light",
      "url": "mapbox://styles/mapbox/light-v9"
    },
    {
      "label": "Streets",
      "url": "mapbox://styles/mapbox/streets-v9"
    },
    {
      "label": "Satellite",
      "url": "mapbox://styles/mapbox/satellite-v9"
    },
    {
      "label": "Satellite Streets",
      "url": "mapbox://styles/mapbox/satellite-streets-v9"
    }
  ],
  "LAYERS": []
}

const layerTemplate = {
 "visible": true,
 "label": "Label to describe the layer",
 "source": {
  "join": [],
  "data": "",
  "type": "",
  "layer": "",
  "url": ""
 },
 "type": "",
 "aggregate": {},
 "popup": {},
 "property": "malaria",
 "categories": {},
 "radius-range": [],
 "category": "Indicators",
 "credit": "Source of layer data",
 "join-key": {}
}
