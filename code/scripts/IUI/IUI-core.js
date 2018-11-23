/*!
 * IUI JavaScript Web Framework Library v1.0.0
 *
 * Copyright (c) 2018 Ishaan Singh
 * Released under the MIT license
 * https://github.com/ishaananuraag/IUIjs/blob/master/LICENSE
 *
 * Date: 2018-01-20T17:24Z
 */
 define(function(){

/* ------ IUI.js ----------------- */
	
	var IUI={};
	
	var _uid=1;
	
	IUI.Event=function IUIEvent(name){
		
		this.type=name;
		this._isPropogationStopped=false;
		
		this.stopPropagation=function(){
			this._isPropogationStopped=true;
		}		
		
	}

/* ------- END : IUI.js -----------*/

/* ------ IUI.EventGroup.js ----------------- */

	/**
	* This Class keeps the events(eventGroup) and iuiClass instances and binds It with each other whenever the other is created.
	* @param {Object} options - Object containing the name of the eventGroup and events in form of {eventName:handler}
	*/
	var EventGroup=function EventGroup(options){
		
		this.name=options.name;
		delete options.name;
		
		this.events=options;
		
		this.persist=options.persist || false;		
		EventGroup.bindEvent(this);
	}
	
	/**
	* Object to store the mapping of the events to bind whenever the class is created for it.
	*/
	EventGroup._eventBindings={};
	
	/**
	* Object to store the mapping of the class's bind API to bind whenever the class is created for it.
	*/
	EventGroup._classBindings={};

	
	EventGroup.bindEvent=function(eventGroup){
		var name=eventGroup.name;
		if(EventGroup._classBindings[name]){
			EventGroup._classBindings[name](eventGroup.events);
			if(eventGroup.persist){
				EventGroup._eventBindings[name]=eventGroup;
			}
		}else{
			EventGroup._eventBindings[name]=eventGroup;
		}
	}
	
	EventGroup.bindClass=function(name,iuiClass){
		
		if(EventGroup._eventBindings[name]){
			iuiClass._bind(EventGroup._eventBindings[name].events);
			if(!EventGroup._eventBindings[name].persist){
				delete EventGroup._eventBindings[name];
			}
		}else{
			EventGroup._classBindings[name]=iuiClass._bind.bind(iuiClass);		
		}
	}
	
	IUI.EventGroup=EventGroup;
	
/* ------- END : IUI.EventGroup.js -----------*/

/* ------ IUI.core.js ----------------- */

	
	var _getKeys = function(obj) {
		if (!(typeof obj === 'function' || typeof obj === 'object' && !!obj)) return [];
		var keys = [];
		for (var key in obj) if(obj.hasOwnProperty(key)) {keys.push(key)};
		return keys;
	};

	var _extendObject=function(obj) {
		var length = arguments.length;
		if ( obj == null) return obj;
		var keys=_getKeys(obj), l=keys.length, newObj={};
		for (var i = 0; i < l; i++) {
			var _obj=obj[keys[i]];
			if(typeof _obj === "object" && Array.isArray(_obj)){
				_obj=Array.prototype.slice.call(_obj);
			}else if(_obj && typeof _obj === "object" && _obj.constructor===Object){
				_obj=_extendObject(_obj);
			}
			newObj[keys[i]] =_obj ;
		}
	  
		for (var index = 1; index < length; index++) {
			var source = arguments[index],
				keys = _getKeys(source),
				l = keys.length;
			for (var i = 0; i < l; i++) {
				var key = keys[i];
				newObj[key] = source[key];
			}
		}
		return newObj;
    };
	

	function IUIClass(){	
		this.initialize.apply(this,arguments);
	}

	
	IUIClass.prototype.load=function(){
		
	}
	
	IUIClass.prototype.initialize=function(options){
		this.load(options);
		this.options=_extendObject((this.options) || ({}),options);	
		
		this._handlers={};		
		this._bind(this.options);
		if(this.options.eventgroup){
			IUI.EventGroup.bindClass(this.options.eventgroup,this);
		}
		for(var attr in this){
			var attribute=this[attr];
			if(typeof attribute === "object" && attribute!=="options"){
				if(Array.isArray(attribute)){
					this[attr]=Array.prototype.slice.call(attribute);
				}else{
					this[attr]=_extendObject(this[attr]);
				}
			}
		}
	}

	IUIClass.prototype.events=[];
	
	/**
	* Basic IUI Bind function, It iterates over all the events in the Events array and bind the respective handlers from the options. 
	* @param {Array} events - List of events the Class will handle.
	* @param {Object} handlers - object containing the handlers in the form of {eventname: handler}.
	*/
	IUIClass.prototype._bind=function(handlers){
		var events=this.events;
		for(var e in events){
			
			var name=events[e].split('.');
			
			if(handlers[name[0]]){
				
				if(typeof this._handlers[name[0]] === 'undefined'){
					this._handlers[name[0]]=[];
				}
				
				this._handlers[name[0]].push({handler: handlers[name[0]], _ns:name[1]});
				
			}
		}
	
	}
	
	/**
	* This function takes the handler attached with the event and processes it to get the handler of the function
	* @param {String|Function} _handler - it can be a function, statement, or a function String.
	* @param {Object} e - the IUI Event object; 
	**/
	var _getHandlerFunction=function(_handler,e){
		if(typeof _handler === 'function'){
			return _handler;
		}else if(typeof _handler === 'string'){
			if(typeof window[_handler] === 'function'){
				return window[_handler];
			}else if(_handler.indexOf('function')===0){
				eval('_handler='+_handler);
			}else{
				_handler=new Function(_handler);
			}
			return _handler;			
		}		
	}

	
	/**
	* This API will trigger the bounded handlers attached with the events.
	* The handlers can be function, Reference to the function or statement
	*/
	IUIClass.prototype.trigger=function(name,dataObject){
		
		if(this._handlers[name]){
			var e=new IUI.Event(name),
				handlers=this._handlers[name];
				e=_extendObject(e,dataObject);
				e.target=this;
			for(var i in handlers){
				var _handler=handlers[i].handler,
					returnVal;
				if(!(e._isPropogationStopped || returnVal === false)){
					var _function=_getHandlerFunction(_handler,e)
					returnVal=_function.call(this,e)
				}
			}
		}		
	}
	
	/**
	*
	* This API clones the prototype of the Given Class to__proto__ of new Class, and adds new properties to the new Class .
	* @param {Object} newProperties - properties which will be added to the Extended class.
	*/
	IUIClass.extend=function(newProperties){
		
		var IUIClass=function(){
			this.initialize.apply(this,arguments);
		};
		
		_getKeys(this.prototype).forEach(function(key){
			var value=this.prototype[key];
			if(typeof value === "object"){
				if(Array.isArray(value)){
					value=Array.prototype.slice.call(value);
				}else{
					value=_extendObject(value);
				}
			}
			IUIClass.prototype[key]=value
		},this);
				
		
		IUIClass.extend=arguments.callee;		
				
		for(var property in newProperties){
			var type = typeof newProperties[property];
			
			if(typeof newProperties[property] === "object" && !Array.isArray(newProperties[property])){
				IUIClass.prototype[property]=_extendObject(IUIClass.prototype[property] || ({}),newProperties[property]);
			}else{
				IUIClass.prototype[property]=newProperties[property];
			}						
		}
		
		return IUIClass;
	}

	IUI.Class=IUIClass;
	
	IUI.getUID=function(){
		return 'uid_'+_uid++;
	}
	/**************************************************/
	
	IUI.deepExtend=_extendObject;
	
	IUI._observableRegex=/::.+::/g;
	
	return IUI;
});