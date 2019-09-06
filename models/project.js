const config = require('../config.json')
    , AWS = require('aws-sdk')
AWS.config.credentials = {
 "accessKeyId": config.awsAccessKey,
 "secretAccessKey": config.awsSecretKey
}
const db = new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })


module.exports = {
  all: function() {
    return new Promise(function (resolve, reject) {
      var params = {
       TableName: 'gisida-projects',
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

  add: function() {
    var _self = this
    return new Promise(function (resolve, reject) {
    var project = Object.assign({}, sampleProject)
    var id = _self.makeId()
    project.id =  `ona.${id}`
    var params = {
     TableName: 'gisida-projects',
     Item: project
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

  edit: function(project) {
    return new Promise(function (resolve, reject) {
      var params = {
        TableName: 'gisida-projects',
        Item: project
      }
      console.log(params)
      db.put(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
     })
   })
  },

  get: function(id) {
    return new Promise(function (resolve, reject) {
      var params = {
      TableName: 'gisida-projects',
        Key: {
          'id': id
        }
      }
      db.get(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          if (data.Item) {
            console.log('has item')
           resolve(data)
          } else {
            console.log('new project')
           resolve({
             Item: {
               id: id,
               project: projectTemplate
             }
           })
          }
        }
     })
   })
  },


  getProjectObj: function(id) {
    return new Promise(function (resolve, reject) {
      var params = {
      TableName: 'gisida-projects',
        Key: {
          'id': id
        }
      }
      db.get(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          if (data.Item) {
            console.log('has item')
           resolve(data)
          } else {
            console.log('new project')
           resolve({
             Item: {
               id: id,
               project: projectTemplate
             }
           })
          }
        }
     })
   })
  },

  delete: () =>  {
    console.log('delete project')
    return true
  },

  makeId: function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text
  }

}


const projectTemplate = {
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
    "appIcon": "/gisida/assets/img/gisida-logo.png",
    "appName": "Project Name",
    "appNameDesc": "Project description",
    "appColor": "#009688",
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
