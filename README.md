# parse-server

Parse-server for EAO's Inspection App

### For Local Development

* Make sure you have at least Node 4.3. `node --version`
* Clone this repo and change directory to it.
* `npm install`
* Install and run mongo locally
* Run the server with: `npm start`
* By default it will use a path of /parse for the API routes.  To change this, or use older client SDKs, run `export PARSE_MOUNT=/1` before launching the server.

# Using it

Before using it, you can access a test page to verify if the basic setup is working fine [http://localhost:1337/test](http://localhost:1337/test).
Then you can use the REST API, the JavaScript SDK, and any of our open-source SDKs:

Example request to a server running locally:

```curl
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
  http://localhost:1337/parse/classes/GameScore
  
curl -X POST \
  -H "X-Parse-Application-Id: myAppId" \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:1337/parse/functions/hello
```

Example using it on iOS (Swift):
```swift
//in your AppDelegate

Parse.initializeWithConfiguration(ParseClientConfiguration(block: { (configuration: ParseMutableClientConfiguration) -> Void in
  configuration.server = "https://<# Your Server URL #>/parse/" // '/' important after 'parse'
  configuration.applicationId = "<# Your APP_ID #>"
}))
```
