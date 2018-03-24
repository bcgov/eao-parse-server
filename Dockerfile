FROM node:latest

RUN mkdir parse

ADD . /parse
WORKDIR /parse
RUN npm install

ENV APP_ID setYourAppId
ENV MASTER_KEY setYourMasterKey
ENV DATABASE_URI setMongoDBURI
ENV JAVASCRIPT_KEY setJavascriptKey

ENV PUBLIC_SERVER_URL setPublicServerUrl

ENV MAIL_SERVER_USER setMailServerUser
ENV MAIL_SERVER_PASSWORD setMailServerPassword
ENV MAIL_SERVER_HOST setMailServerHost
ENV MAIL_SERVER_PORT setMailServerPort

# Optional (default : 'parse/cloud/main.js')
# ENV CLOUD_CODE_MAIN cloudCodePath

# Optional (default : '/parse')
# ENV PARSE_MOUNT mountPath

EXPOSE 1337

# Uncomment if you want to access cloud code outside of your container
# A main.js file must be present, if not Parse will not start

# VOLUME /parse/cloud               

CMD [ "npm", "start" ]
