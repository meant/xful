var Controller = function(){
	var this_ = this;
	this.module = {};
	this.m_name = {};
	this.service = {};
	this.model = {};
	this.service = {};
	this.viewType = false;
	this.keyColumn = {};
	this.skipRepository = false;
	this.upsert = false;
	this.init = function(app,module,m_name,option){
		this.m_name = m_name;
		this.model = require('mongoose').model(this.m_name);
		this.keyColumn = this.getId();
		
		var service = require('./service');
		this.service = new service();
		this.service.init(this.model);
		
		if(option){
			if(option.viewType != null)
				this.viewType = option.viewType;
			if(option.skipRepository != null)
				this.skipRepository = option.skipRepository;
			if(option.upsert != null)
				this.upsert = option.upsert;
		}
		
		if(module){
			this.module = module;
			this.module.init(this,this.service);
		}else{
			this.module = null;
		}
		var format_str = ".:format";
		if(this.viewType){
			format_str = "";
		}
		
		app.get('/'+m_name+format_str, this.list);
		app.post('/'+m_name+format_str, this.create);
		app.get('/'+m_name+'/new'+format_str, this.createForm);
		app.get('/'+m_name+'/:id/edit'+format_str, this.updateForm);
		app.put('/'+m_name+'/:id'+format_str, this.update);
		app.del('/'+m_name+'/:id'+format_str, this.del);
		app.get('/'+m_name+'/:id'+format_str, this.read);
		app.get('/'+m_name+'/', this.home);
	};
	this.buildView = function(req,res,view){
		var resultFunc = function(inputdata){
			var callback = function(arg){
				var result = arg;
				var fotmat_str = (this_.viewType)?this_.viewType:req.params.format;
				switch(fotmat_str){
				case 'json' :
					result = {result:result};
					res.header('Content-Type','application/json;charset=utf-8');
					res.send(JSON.stringify(result));
					break;
				case 'xml' :
					var jsonxml = require('jsontoxml');
					var resultxml = [];
					if(result instanceof Array){
						for(var m = 0 ; m < result.length ; m ++){
							resultxml.push({item:result[m]});
						}
					}
					result = {result:resultxml};
					var xml = jsonxml(JSON.stringify(result));
					xml='<?xml version="1.0" encoding="UTF-8"?>'+xml;
					res.header('Content-Type','text/xml');
					res.send(xml);
					break;
				default :
					res.render(this_.model.modelName+'/'+view, { title: 'Express' });
					break;
				}
			};
			
			
			if(this_.module && eval('this_.module.'+view)){
				eval('this_.module.'+view+'(req,inputdata,null,callback)');
			}
			else{
				callback(inputdata);
			}
			
		};
		return resultFunc;
	};
	this.list = function(req,res){
		console.log("list//");
		var modelTree = this_.getModelTree(req, res);
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.list(arg,this_.buildView(req,res,'list'));
			}else{
				this_.buildView(req,res,'list')(arg);
			}
		};
		
		if(this_.module && this_.module.list){
			modelTree = this_.module.list(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.read = function(req,res){
		console.log("read//");
		var modelTree = this_.getModelTree(req, res);
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.read(this_.getKeyCondition(req.params.id),this_.buildView(req,res,'read'));
			}else{
				this_.buildView(req,res,'read')(arg);
			}
		};
		
		if(this_.module && this_.module.read){
			modelTree = this_.module.read(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.create = function(req,res){
		console.log("create//");
		var modelTree = this_.getModelTree(req, res,'POST');
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.create(arg,this_.buildView(req,res,'create'));
			}else{
				this_.buildView(req,res,'create')(arg);
			}
		};
		
		if(this_.module && this_.module.create){
			modelTree = this_.module.create(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.createForm = function(req,res){
		console.log("createForm//");
		var modelTree = this_.getModelTree(req, res);
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.createForm(arg,this_.buildView(req,res,'createForm'));
			}else{
				this_.buildView(req,res,'createForm')(arg);
			}
		};
		
		if(this_.module && this_.module.createForm){
			modelTree = this_.module.createForm(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.update = function(req,res){
		console.log("update//");
		var modelTree = this_.getModelTree(req, res,'POST');
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.update(this_.getKeyCondition(req.params.id), arg,this_.buildView(req,res,'update'), this_.upsert);
			}else{
				this_.buildView(req,res,'update')(arg);
			}
		};
		
		if(this_.module && this_.module.update){
			modelTree = this_.module.update(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.updateForm = function(req,res){
		console.log("updateForm//");
		var modelTree = this_.getModelTree(req, res);
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.updateForm(this_.getKeyCondition(req.params.id),arg,this_.buildView(req,res,'updateForm'));
			}else{
				this_.buildView(req,res,'updateForm')(arg);
			}
		};
		
		if(this_.module && this_.module.updateForm){
			modelTree = this_.module.updateForm(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.del = function(req,res){
		console.log("del//");
		var modelTree = this_.getModelTree(req, res);
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.del(this_.getKeyCondition(req.params.id),this_.buildView(req,res,'del'));
			}else{
				this_.buildView(req,res,'del')(arg);
			}
		};
		
		if(this_.module && this_.module.del){
			this_.module.del(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	this.home = function(req,res){
		console.log("home//");
		var modelTree = this_.getModelTree(req, res);
		
		var callBack = function(arg,skipRepository){
			if(!this_.skipRepository && !skipRepository){
				this_.service.home(arg,this_.buildView(req,res,'home'));
			}else{
				this_.buildView(req,res,'home')(arg);
			}
		};
		
		if(this_.module && this_.module.home){
			modelTree = this_.module.home(req,modelTree,callBack);
		}else{
			callBack(modelTree);
		}
		
	};
	
	this.getModelTree = function(req,res,method){
		var param = '';
		if(!method || method=="GET"){
			param = req.query;
		}else{
			param = req.body;
		}
		
		var modelTree = JSON.parse(JSON.stringify(this.model.schema.paths));
		
		var i = 0 ;
		for (var key in modelTree) {
			if(param[key] && param[key].length>0){
				modelTree[key] = param[key];
			}
			else {
				delete modelTree[key];
			}
			i+=1;
		}
		
		if(param.$skip){
			modelTree.$skip = param.$skip;
		}
		if(param.$limit){
			modelTree.$limit = param.$limit;
		}
		if(param.$sort){
			modelTree.$sort = param.$sort;
			modelTree.$order = param.$order;
		}
			
			
		return modelTree;
	};
	
	this.getId = function(){
//		console.log("schema="+JSON.stringify(this.model.schema));
		var modelTree = this.model.schema.paths;
		var id_str = '_id';
		for (var key in modelTree) {
			if(modelTree[key].options.xful_id){
				id_str = key;
				break;
			}
		}
		return id_str;
	};
	
	this.$F = function(caller) {
		var f = arguments.callee.caller;
		if (caller)
			f = f.caller;
		var pat = /^function\s+([a-zA-Z0-9_]+)\s*\(/i;
		pat.exec(f);
		var func = new Object({});
		func.name = RegExp.$1;
		return func;
	};
	
	this.getKeyCondition = function(id){
		return JSON.parse('{"'+this_.keyColumn+'":"'+id+'"}');
	};
	
};
module.exports = Controller;