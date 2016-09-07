# gq-parse-server

Custom parse-server for GoodQuestion app:
 - Babel transpiler
 - cloud code
 - S3 adapter
 - custom AmazonSES email templates

## Create settings.json
```
{
  "verbose": true,
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
    "module": "parse-server-amazon-ses-email-adapter",
    "options": {
      fromAddress: 'Your Name <noreply@supercoolapp.com>',
      accessKeyId: 'Your AWS IAM Access Key ID',
      secretAccessKey: 'Your AWS IAM Secret Access Key',
      region: 'Your AWS Region',
      "templates" : {}
    }
  }
}
```

## Certs

See https://github.com/ParsePlatform/parse-server/wiki/Push

## S3 Adapter

See https://github.com/parse-server-modules/parse-server-s3-adapter

## AmazonSES Email Adapter

See https://github.com/ecohealthalliance/parse-server-amazon-ses-email-adapter

## Installation
```
git clone https://github.com/ecohealthalliance/gq-parse-server/#master
npm install
```

## Start
```
npm start
```
### Start in Development mode
```
npm run dev
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
