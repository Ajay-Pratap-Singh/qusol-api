# API Documentation

JSON object is expected in POST requests

## POST /register

```bash

"username",
"email",
"password",
"confirm_password"

```

## POST /login

```bash

"username_or_email",
"password"

```
## Note 
after ```POST /login``` you will get response header named ``` Authorization``` with includes a string ```Bearer {token}```. while sending each request include a request header with same format. 





