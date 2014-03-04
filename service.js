var Service = function() {
	this.model={};
	this.init = function(model){
		console.log('service init');
		this.model = model;
	};
	this.list = function(modelTree,returnFunc){
		var skip_limit = {
				
		};
		if(modelTree.$skip){
			skip_limit.skip = modelTree.$skip;
		}
		if(modelTree.$limit){
			skip_limit.limit = modelTree.$limit;
		}
		if(modelTree.$sort){
			console.log('sort='+'{"'+modelTree.$sort+'":' + modelTree.$order+'}');
			skip_limit.sort = JSON.parse('{"'+modelTree.$sort+'":' + modelTree.$order+'}');
		}
		
		delete modelTree["$skip"];
		delete modelTree["$limit"];
		delete modelTree["$sort"];
		delete modelTree["$order"];
		
		this.model.find(modelTree, null,skip_limit,function(err, docs) {
			if(err){
				console.log(err);
				returnFunc(null);
			}else{
				if(returnFunc){
					returnFunc(docs);
				}
			}
		});
	};
	
	this.read = function(condition,returnFunc){
//		var mongoose = require('mongoose');
		this.model.findOne(condition, function(err, data) {
			if(err){
				console.log(err);
				returnFunc(null);
			}else{
				if(returnFunc){
					returnFunc(data);
				}
			}
		});
	};
	
	this.create = function(modelTree,returnFunc){
		delete modelTree["_id"];
		
		var newModel = new this.model(modelTree);
		newModel.save(function(err,product,numberAffected){
			if(err){
				console.log(err);
				returnFunc(null);
			}else{
				console.log('created');
				if(returnFunc){
					returnFunc(product);
				}
			}
		});
	};
	
	this.update = function(condition, modelTree,returnFunc,upsert){
		delete modelTree["_id"];
		
		console.log('update');
		console.log('condition='+JSON.stringify(condition));
		console.log('modelTree='+JSON.stringify(modelTree));
		
//		var newmodel = new this.model();
		
		this.model.findOneAndUpdate(condition,modelTree,{upsert : upsert},function(err,raw){
			if(err){
				console.log(err);
				returnFunc(null);
			}else{
				console.log('updated='+JSON.stringify(raw));
				if(returnFunc){
					returnFunc(raw);
				}
			}
		});
	};
	
	this.createForm = function(modelTree,returnFunc){
		return returnFunc(modelTree);
	};
	
	this.updateForm = function(condition,modelTree,returnFunc){
		this.model.findOne(condition, function(err, data) {
			if(err){
				console.log(err);
				returnFunc(null);
			}else{
				if(data !=null){
					for (var key in modelTree) {
						if(modelTree[key] && modelTree[key].length>0 && key != '_id'){
							data[key] = modelTree[key];
						}
					}
				}
				
				if(returnFunc){
					returnFunc(data);
				}
			}
		});
	};
	
	this.del = function(condition, returnFunc){
		this.model.remove(condition, function(err, data) {
			if(err){
				console.log(err);
				returnFunc(null);
			}else{
				if(returnFunc){
					returnFunc(data);
				}
			}
		});
	};
	
	this.home = function(modelTree,returnFunc){
		returnFunc({});
	};
	
	
};
module.exports = Service;