UploadIt
========
An Image Backup Server 

Test Deployment
===============

Here is how you make a test deployment:

 ```
Make sure ImageMagick is installed on your system.
On Ubuntu
$ apt-get install imagemagick
On Mac OS X
$ brew install imagemagick
On CentOS
$ yum install imagemagick
$ git clone https://github.com/haricm/UploadIt.git 
$ cd UploadIt
$ mkdir -p data/db
$ mongod --dbpath data/db
Copy config.js file in to config folder
Open new console tab
$ mkdir -p public/images/uploaded
$ mkdir certs
$ openssl genrsa -out certs/privatekey.pem 1024
$ openssl req -new -key certs/privatekey.pem -out certs/certrequest.csr
$ openssl x509 -req -in certs/certrequest.csr -signkey certs/privatekey.pem -out certs/certificate.pem
$ npm install
$ node app.js
Start using application. When you create an account make sure you enter valid email address. You will have to click activation link from your mail id to activate your account.
 ```

