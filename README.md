xful
===========

Description
-----------

Simple RESTful Service Builder with Mongoose

Installation
------------

Simplest way to install `xful` is to use [npm](http://npmjs.org), just `npm
install xful` which will download xful and all dependencies.

Simple usage
-----------

    var xful = require('xful');
    mongoose.connect('mongodb://localhost/orgo');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log('connection successful...');
		
		//building Mongoose model
		var Member = new mongoose.Schema({
			member_id : {type:String, unique: true, xful_id: true},	//define unique id for rest service
			image : String,
			desc : String,
			push_id : String,
			updated : Date
		},{ strict: false });
		xful.Model.member = mongoose.model('member', Member, 'member');
		
		//building Member controller
		var memberController = new xful.Controller();
		var m_member = require('./routes/member');	//build user service(optional)
		memberController.init(app,m_member,'member',{
			viewType : 'json',
			upsert : true
		});
	});
	
	Now, You can call the REST request for the Member Service(create,update,delete,list,read)
	