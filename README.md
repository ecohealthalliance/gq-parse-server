# example-parse-server

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
  },
  "filesAdapter": {
    "module": "parse-server-s3-adapter",
    "options": {
      "accessKey": "asdfasdfasdfasdf",
      "secretKey": "asdfasdfasdfasdfadsfdasdfasdfasdfas",
      "bucket": "my-bucket",
      "region": "us-east-1"
    }
  }
}
```

## Certs

See https://github.com/ParsePlatform/parse-server/wiki/Push

## S3 Adapter

See https://github.com/parse-server-modules/parse-server-s3-adapter


## Installation
```
git clone https://github.com/dan-nyanko/example-parse-server#master
npm install
```

## Start
```
npm start
```

## Test Cloud Code
```
curl -X POST \
  -H "X-Parse-Application-Id: localParse" \
  -H "X-Parse-Master-Key: secret" \
  -H "Content-Type: application/json" \
  http://localhost:1337/parse/functions/hello
````
