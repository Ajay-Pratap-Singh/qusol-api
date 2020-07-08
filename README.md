# API Documentation

JSON object is expected in POST requests

## POST /register

```bash

"username",
"email",
"password"

```

## POST /login

```bash

"username_or_email",
"password"

```
## Note 
after ```POST /login``` you will get jwt token in response body named ``` jwt``` .
while sending requests to authorized routes include a request header with format ```Bearer {token}```. 





