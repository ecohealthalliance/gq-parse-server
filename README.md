# example-parse-server

Example of running parse-server with:
 - verbose logging
 - Babel transpiler
 - cloud code
 - S3 adapter
 - custom mailgun templates

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
      "bundleId": "com.cool.super.project",
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
  },
  "emailAdapter": {
    "module": "parse-server-mailgun",
    "options": {
      "fromAddress": "project.super@cool.com",
      "domain": "cool.com",
      "apiKey": "asdfasdfasdfasdfadsfdasdfasdfasdfas",
      "templates" : {}
    }
  }
}
```

## Certs

See https://github.com/ParsePlatform/parse-server/wiki/Push

## S3 Adapter

See https://github.com/parse-server-modules/parse-server-s3-adapter

## Mailgun Adapter

See https://github.com/sebsylvester/parse-server-mailgun

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
  -H 'X-Parse-Application-Id: localParse' \
  -H 'X-Parse-Master-Key: secret' \
  -H 'Content-Type: application/json' \
  -d '{"message": "hello"}' \
  http://localhost:1337/parse/functions/echo
````
