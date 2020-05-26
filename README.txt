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



	