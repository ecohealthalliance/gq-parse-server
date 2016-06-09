# localparse

Run parse-server with verbose logging

## Create settings.json
```
{
  "serverURL": "http://localhost:1337/parse",
  "databaseURI": "mongodb://localhost:27017/localparse",
  "cloud": "./cloud/main.js",
  "appId": "localParse",
  "appName": "LocalParse",
  "masterKey": "secret",
  "push": {
    "ios": {
      "pfx": "./certs/PushProductionCert.p12",
      "bundleId": "com.super.cool.project",
      "production": false
    },
    "android": {
      "senderId": "03124141234",
      "apiKey": "asdfasdfasfasasdfasd"
    }
  }
}
```

## Certs

See https://github.com/ParsePlatform/parse-server/wiki/Push


## Installation
```
git clone https://github.com/dan-nyanko/localparse#master
npm install
```

## Start
```
npm start
```
