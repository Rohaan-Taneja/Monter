so , hi , this is the github repo for MONTER assignment

to start the server 
npm start

5 api's are defined 

1)  for registering user - api (http://localhost:8000/api/v1/users/register)
 data in json can be given is
{
    "email" : "your email",
    "username" : "pappu",
    "password" : "01125532553"
}

2) when you register , a link will be given to your on your given email , on clciking that you'll be verified , and after that you can add more details ,
   by hitting below api request on postman

   http://localhost:8000/api/v1/users/AddDetails

   and data can be as follow in json -

   {
    "email" : "same as above email",
    "location": "delhi",
    "age": "22",
    "Work_Details" : "student"
  }


3) after this you can test the login route by sending this api (http://localhost:8000/api/v1/users/login)
   data can be in this json format -
   {
    "email" : "same as above email",
    "password" : "01125532553"
    }

4)after login , you can test logout route by sending this api call(http://localhost:8000/api/v1/users/logout)

5) at last if you want to get the user details of the current user from cokies , you run this api (http://localhost:8000/api/v1/users/getuserinfor_fromcookie)

   thats it , thank you for reading











   
