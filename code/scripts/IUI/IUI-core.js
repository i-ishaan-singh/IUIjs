/*!
 * IUI JavaScript Web Framework Library v1.0.1
 *
 * Copyright (c) 2018 Ishaan Singh
 * Released under the MIT license
 * https://github.com/ishaananuraag/IUIjs/blob/master/LICENSE
 *
 * Date: 2018-12-01T12:03Z
 */
 (function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(factory);
  } else {
    window.IUI=factory();
  }
})(function(){
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
			var _bindings=EventGroup._classBindings[name];
			for(var a in _bindings){
				_bindings[a](eventGroup.events);
			}
			delete EventGroup._classBindings[name];
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
			if(EventGroup._classBindings[name]){
				EventGroup._classBindings[name].push(iuiClass._bind.bind(iuiClass));		
			}else{
				EventGroup._classBindings[name]=[iuiClass._bind.bind(iuiClass)];
			}
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

	var _isObject = function(_obj){
		return _obj && typeof _obj === "object" && _obj.constructor===Object
	}
	
	var _extendObject=function(obj) {
		var length = arguments.length;
		if ( obj == null) return obj;
		
		var keys=_getKeys(obj), l=keys.length, newObj={};
		
		for (var i = 0; i < l; i++) {
			var _obj=obj[keys[i]];
			if(typeof _obj === "object" && Array.isArray(_obj)){
				_obj=Array.prototype.slice.call(_obj);
			}else if(_isObject(_obj)){
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
				if(newObj[key] && (_isObject(source[key]) && _isObject(newObj[key]))){
					newObj[key]=_extendObject(newObj[key],source[key]);
				}else{
					newObj[key] = source[key];
				}
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
			if(typeof attribute === "object" && attr!=="options"){
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
	
	IUIClass.prototype.on=function on(event,handler){
		var _events=event.split(IUI.spaceRegex), obj={};
		
		for(var e in _events){
			obj[_events[e]]=handler;
		}
		this._bind(obj);
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
	var _extend;
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
				
		
		IUIClass.extend=_extend;		
				
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
	
	_extend=IUIClass.extend;
	
	IUIClass.prototype._optionModelMapping= [];
	IUIClass.prototype.ignoredAttributes= [];
	
	IUIClass.prototype._observedOptions=['enable','isattached'];
	
	IUIClass.prototype.bindModels=function(boundOptions){
		this.__processOptionMapping();
		this.optionsModel=new IUI.OptionsModel(this.options,this._handleOptionChange.bind(this),this._observedOptions,boundOptions);
		if(this.options.model){
				IUI.ObservableModel.bindModels(this.optionsModel,this.options.model,this._optionModelMapping);
		}
	}
	
	IUIClass.prototype.destroy=function(boundOptions){
		if(this.options.model){
				IUI.ObservableModel.unbindModels(this.optionsModel,this.options.model,this._optionModelMapping);
		}
	}
	
	IUIClass.prototype.__processOptionMapping=function(){
		var _mappings=IUI.behaviors.getObservableMapping(this.options),
			length=_mappings.length;
		if(length){
			for(var i=0;i<length;++i){
				if(this.ignoredAttributes.indexOf(_mappings[i].optionAttribute) !== -1){
					continue;
				}
				this._optionModelMapping.push(_mappings[i]);
				if(this._observedOptions.indexOf(_mappings[i].optionAttribute)===-1){
					this._observedOptions.push(_mappings[i].optionAttribute);
				}
			}
		}
	}
	
	
	IUIClass.prototype._handleOptionChange= function(key, value){
		if(this['_handle'+key+'Change']){
			this['_handle'+key+'Change'](value);
		}
	}
	
	
	IUI.Class=IUIClass;
	
	IUI.getUID=function(){
		return 'uid_'+_uid++;
	}
	/**************************************************/
	IUI.domAccessibility=true;
	
	IUI.setDOMAccessibility=function(value){
		IUI.domAccessibility=value;		
	}
	
	IUI.deepExtend=_extendObject;
	
	IUI._observableRegex=/::.*?::/g;
	
	IUI.subcontainerRegex=/subcontainer-\S+/g;
	
	IUI.iiAttributeRegex=/ii-\S+/g;
	
	IUI.spaceRegex=/(\ )+/g;
	return IUI;
});