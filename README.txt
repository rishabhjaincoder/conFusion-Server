first we have installed the express generator using 
	npm install -g express-generator
	here -g means we are installing this globally

then we created a express project using express generator like this
	express conFusionServer // this will create a express project 
	cd <in this directory>
	npm install // this will install all the modules required and mentioned in the package.json file

now,
	in this project we want to build a full fledged application using express and mongoose
	and here we are using the existing conFusion node project and continue.

we have copied the model "dish wala model" into this project from node mongoose project

now,
	we have installed mongoose and mongoose-currency in the project by typing
		npm install mongoose mongoose-currency --save
		// mongoose currency adds another schema type which is currency, mongoose already have
			number string and many more schema types but not currency type	

after doing all the code work we will put this json data into the postman's head as a json data
and then perform all the opeations that are needed to check out application


-->  this is for dishes model
	{
		"name":"Rishabh",
		"image":"images/rishabh.png",
		"category": "mains",
		"label": "hot",
		"price": "4.99",
		"featured": "true",
		"description": "this is a test for the mongoose server",
		"comments": [
			{
				"rating": 5,
				"comment": "no comments",
				"author": "Mr. Rishabh Jain",
				"date": "2012-10-16T17:57:28.556094Z"
			},
			{
				"rating": 2,
				"comment": "what is comments",
				"author": "Mr. Naman Bansal",
				"date": "2012-10-16T17:57:28.556094Z"
			},
			{
				"rating": 5,
				"comment": "why is` comments",
				"author": "Mr. Rishi Goel",
				"date": "2012-10-16T17:57:28.556094Z"
			}
		]
	}


-->  this is for promotions model
 {
      "name": "Weekend Grand Buffet",
      "image": "images/buffet.png",
      "label": "New",
      "price": "19.99",
      "description": "Featuring . . .",
      "featured": false
}

-->  this is for leaders model
{
      "name": "Peter Pan",
      "image": "images/alberto.png",
      "designation": "Chief Epicurious Officer",
      "abbr": "CEO",
      "description": "Our CEO, Peter, . . .",
      "featured": false
}


=======================================================================================================
Authentication
--> basic Authentication
	here we have updated the app.js file and added basic Authentication for our application
	and we have to supply will username and password in order to get the data that i want from the server

--> cookies
	express generator has already required the cookie-parser, if not then install it by
		npm install cookie-parser --save
	
	and we have done minor changes in the app.js file and checked that it the postman

--> Sessions 
	first we need to install express-session and session-file-store using command
		npm install express-session session-file-store --save

	required these both things

	set up the session by session.use({<many parameters in here>})

	change cookieParser with session everywhere and you are good to go

--> session part 2
	here we will be creating login register and logout facility for user

	create a model named user.js in model folder for storing user's data 

	and then go to user router that the express generator has already created and edit that file

	then bring / router and /users before the auth, so that user can be Authenticated

	then check all the endpoints on postman
=======================================================================================================
Authentication using passport

	install passport,passport local, passport local mongoose in the application by typing
		npm install passport passport-local passport-local-mongoose --save

	then in user.js file import passportlocalmongoose and do all the changes

	create a new file named authenicate.js in the root folder and do the things

	then in user.js router file do the changes

	then do changes in auth function after requiring authenicate.js and passport

	and check if its working or not
	
=======================================================================================================
Authentication using Tokens

	first install 
		npm install passport-jwt jsonwebtoken --save

	add a file config.js in the root folder and add configuration for our server

	then import passport-jwt in the authenicate.js file and do all the changes

	then we will be creating and passing the tokken to the user in users router login wala part

	now open app.js file and require config and do other changes

	now in all the routes import authenicate.js file

	now to set different Authentication on different users, we need to make changes to each
		router end point 

	in the postman copy the token string that you got after login and then in header in Authentication write
		bearer <paste the string>


=======================================================================================================
Mongoose population

	in the user.js model file update the user schema, add few fields like firstname lastname etc

	now in dishes.js model modify the author field in comment schema and make reference to the User schema

	now we will do changes in the dishrouter by using .populate('comments.author')
	and when adding a comment then fetch current user and then store it in req.body.author
		like this  ->          req.body.author = req.user._id;
		and do minor changes in the dishrouter.js file

	now we have to do minor changes in users.js router signup field	
		we are inserting first name and the lastname, when user signups

	before turning on the server, we have to delete existing users from users collection
		as they does not contain firstname and lastname, use these commands
		->		use conFusion;
		->		db.users.drop();           // this will drop all the documents within a collection
		->		db.users.find().pretty();   // to view content of the users collection
			// but in our case this will return nothing as our collection is empty
	
	now check the application using postman

	-> for posting a dish, include this in body
		{
		"name":"Rishabh",
		"image":"images/rishabh.png",
		"category": "mains",
		"label": "hot",
		"price": "4.99",
		"featured": "true",
		"description": "this is a test for the mongoose server",
		"comments": []
	}
	
	here we haven't added the comments field as we will add this through 
			/dishes/1413432424/comments
	and in all the requests we have to add Authentication header containing
			bearer <token_string>

=======================================================================================================
creating admin and giving permissions

	first create a new user using signup option and then signup admin using username "admin"
	
	after creating admin account using signup, admin : false by default, so we need to make it 
			true behind the scenes, use mongo repl and write command
			->	db.users.update({"username":"admin"},{$set: {"admin":"true"}})
			-> check if the admin has become true or not by
				-> db.users.find().pretty();

	--> now assignment part



	
=======================================================================================================
week 4 ------------------------------------ HTTPS --------------------------------------------

	in the bin folder/ we will be going to create our private key and the certificate for HTTPS server
		using command line tool "OPENSSL"

	for downloading and installing open ssl these are the various links
	-> https://wiki.openssl.org/index.php/Binaries
	// i used this link
	-> https://blog.didierstevens.com/2015/03/30/howto-make-your-own-cert-with-openssl-on-windows/
	-> https://www.faqforge.com/windows/use-openssl-on-windows/
	-> http://www.selfsignedcertificate.com/

	// do all these things in cmd not power shell
	then in bin folder inside root create private key using command
		openssl genrsa 1024 > private.key
	now we will create cert.csr file
		openssl req -new -key private.key -out cert.csr
	now from cert.csr we will generate distribution certificate like this
		openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem

	now after all these commands we have created 3 files in the bin folder 
		cert.csr	 certificate.pem	 private.key

	now we will edit the www file in the bin folder

	after configurating the secure server in www, we have to update app.js, so that if a request
		come to insecure port, it will be redirected to secure port!

	now test using https://localhost:3443/ in browser
	and this will redirect insecure url to secure url



=======================================================================================================
Upload Files 

	first install multer in order to upload files using
		npm install multer --save

	Create a new file in the routes folder named uploadRouter.js and configure this

	now we will go to app.js and configure uploadRouter there

	now test postman to upload images files
		in the postman settings, turn SSL certificate verification -> OFF , so that 
		postman will not verify our certificate which we have created using OPENSSL 
		and we can use https there

	imp: in the postman body option and form data and in the key write "imageFile", coz
		in the uploadRouter we have configured the key named "imageFile"

	{
    "fieldname": "imageFile",
    "originalname": "68916873_1385118898332463_6640642394557513728_o.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "public/images",
    "filename": "68916873_1385118898332463_6640642394557513728_o.jpg",
    "path": "public\\images\\68916873_1385118898332463_6640642394557513728_o.jpg",
    "size": 182830
	}     
// this we will get in response after uploading a file

=======================================================================================================
CORS
	first install cors node module using
		npm install cors --save

	in routes folder create a New file named cors.js and configure cors module here!

	now upload the exported methods from the cors.js file in all the routes

	after applying cors.cors and cors.corsWithOptions in all the routes, then you are good to go

	now go to postman and check wheather its working or not
	-> send a get request on localhost:3000/dishes and you will recieve a header named
			access control allow origin with a value * (wildcard), this is because we have used 
			cors.cors on get router 
			-> this means any origin can access this resourse
	
	-> now after loginin as an admin and putting the token in the Authentication header with the value
		bearer <token> , we will include a header named origin, which in our case is https://localhost:3443
			note:   here we are sending a delete request to dishes using http, which is
				localhost:3000/dishes   <DELETE> request
	-> now we have 2 headers in the request 
		1) Authentication header with token_string
		2) origin header with origin url (note: in brower, we dont need to explicitely add this as this is done automatically by the browser)	

		now after sending the request, in response we get a header named 
			access control allow origin with a value https://localhost:3443
			coz we have defined this in our whitelist, so it didn't throw an error

	-> to send a preflight,
		now select the select options in the postman and the url types is
			https://localhost:3443/dishes
			-> and add origin in the header set to https://localhost:3443
			-> you will notice that this will return no content but in header it will return 2 fields		
				1) Access-Control-Allow-Methods : GET,HEAD,PUT,PATCH,POST,DELETE
					// these are the methods that server is willing to accept
				2) Access-Control-Allow-Origin : https://localhost:3443

=======================================================================================================
OAuth and user Authentication
	we will be using oauth 2 and try to implement it in our express application
	
	you need to register your express application on facebook and you should have an account on facebook


	-> in developers.facebook.com create an app named conFusion
	-> in settings>basic select "add platform" and add a website 
			https://localhost:3443
	-> then in settings>advanced  turn "native or desktop app" option ON.
		and save the changes
	-> then in settings>basic , in "App Domain" field write
			https://localhost:3443/                (note:  add / in the last)
	
	in the exercise instruction, there is a file named index.html, download that file and
		add that file in public folder (note: delete previous index.html file)

	in line 34 of updated index.html file, replace a string client id with the actual
		client if from facebook (note: scripts in this file is provided by the facebook)
	
	now, we have to install passport facebook token node module by this command
			npm install passport-facebook-token --save

	in config.js file add a property named facebook and add clientId and clientSecret there

	in user.js model add a new field named facebookId 

	in authenicate.js file add a facebook token strategy

	after that in users.js route, we need to create a new route

	now startup the server and test our application on browser
	-> go to https://localhost:3443/index.html and signup using facebook account,
		and in response you will get an object from facebook contain all the info like]
			accessToken, userId, etc
	-> copy the accessToken from the ctrl + shift + i 
		"EAAMsZA2I3S1gBAIxzmVXFbcjsanKKuS8q1vdWFDZBRGSevAxalnTQcPHLKA2YgIYIN8EUlejiRdg5ZC7C0mo4p9HEZCaL0YnMxbY5ZASDM1XdVhSlJBrdUyEhUXFD89qCb4XzW42idjKWpK94MNC9GUS9eMQYMgZCPnJFqFVdoHInxiDApXJnpZBEyUDjYnXr0ZD"
		right now this is now access key
	-> now as we got our access token , we can go to postman and send this to server to obtain json web token

	-> now in postman do a GET request on https://localhost:3443/users/facebook/token and 
		


		[**	
		
		include a Authentication header named Authentication 
		and value should be Bearer <accessToken> (note:  in the Bearer, B should be capital)
		
										OR
		
		include a header named access_token with value : <accessToken> 
		(note: here there is no need to write Bearer, just add the access token)
		
										OR
		
		pass access_token as a parameters like this
		https://localhost:3443/users/facebook/token?access_token=EAAMsZA2I3S1gBAIxzmVXFbcjsanKKuS8q1vdWFDZBRGSevAxalnTQcPHLKA2YgIYIN8EUlejiRdg5ZC7C0mo4p9HEZCaL0YnMxbY5ZASDM1XdVhSlJBrdUyEhUXFD89qCb4XzW42idjKWpK94MNC9GUS9eMQYMgZCPnJFqFVdoHInxiDApXJnpZBEyUDjYnXr0ZD
			
		**]	



	-> now after sending this request, we will recieve a json web token, copy that and now we can perform
		the normal user operations.
		token->     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWQwMDAxMjc2MjQ1MTIwMzhkYzhiNDMiLCJpYXQiOjE1OTA2ODk4MTAsImV4cCI6MTU5MDY5MzQxMH0.rBBJBD3HlVaYMf-gABA9TaxWB4vMasPfuDHgPWXoBGI
			(in our case, this is the token that we have recieved)
	
