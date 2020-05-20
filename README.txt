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


	