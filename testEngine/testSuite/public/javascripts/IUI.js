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
	define('IUI-core',factory);
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
		this.onInitialize.apply(this,arguments);
	}

	
	IUIClass.prototype.load=function(){
		
	}
	IUIClass.prototype.onInitialize=function(){
		
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
			this.onInitialize.apply(this,arguments);
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
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Template',['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var _templateToFunctionWrapper=function(key,index,str){
		var _key=key.slice(2,-2);		
		return (index?'"+':'')+'(function(){ return '+_key+' })()'+((index+key.length===str.length)?'':'+"');
	}
	
	
	
	var Template=function Template(){
		
	};
	
	Template.render=function(template,object,options){
		var _string="";
		if(options && options.attrString){
			_string=options.attrString;
		}else{			
			for(var attr in object){
				_string=_string+'var '+attr+'=model.'+attr+'; ';			
			}			
		}
		_string='(function(model){ '+_string+' return '+template+'; })';
		return (eval(_string))(IUI.deepExtend(object));
		
	}
	
	
	Template.extractTemplateObject=function(string){
			var _matches=string.match(IUI._observableRegex),_template,lastMatch,firstMatch,exclusive;
			string=string.trim();
				if(_matches && _matches.length>0){
					_template=string.replace(IUI._observableRegex,_templateToFunctionWrapper);
//.replace(/'/g,'\\\'').replace(/"/g,'\\"')
					lastMatch=_matches[_matches.length-1],
					firstMatch=_matches[0];
					_template=((string.indexOf(firstMatch)===0)?'':'"')+_template+((string.lastIndexOf(lastMatch)+lastMatch.length===string.length)?'':'"');
					exclusive=_matches[0].length==string.length;
					return { template:_template,mappings:_matches.map(function(elem){ return elem.slice(2,-2).trim(); }), isExclusive:exclusive };
		}
			return { template:string};
	
	}
	
	
	

	IUI.Template=Template;
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Behaviors',['IUI-core','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var behaviors={};
	
	behaviors.delegateDOMEvent=function(e){
		var obj={originalEvent:e};
		if(this.value){
			obj.value=this.value()
		}
		obj.target=this;
		this.trigger(e.type,obj);
	}
	
	behaviors.extractStyleFromObject=function(element,object){
		for(var attr in object){
			if(attr in element.style){					//Need to make efficient
				element.style[attr]=object[attr];
			}
		}	
	}
	
	var extractionMap={
		
		style: function(element,attr,value){
			if(attr in element.style){					//Need to make efficient
					element.style[attr]=value;
			}
		},
		'ii-attibute': function(element,attr,value){
			if(attr.match(IUI.iiAttributeRegex)){
				$(element).attr(attr,value);
			}
		},
		'subconatiner-attribute': function(element,attr,value,object){
			(object.subcontainerOptions) || (object.subcontainerOptions={});
			if(attr.match(IUI.subcontainerRegex)){
				object.subcontainerOptions[attr.slice(13)]=value;
				//delete object[attr];
			}
		},
		
		
	}
	
	
	behaviors.extractFromObject=function(element,object,list){
		for(var attr in object){
			for(var item in list){
				extractionMap[list[item]](element,attr,object[attr],object);
			}
		}	
	}
	
	behaviors.getObservableMapping=function(object){
		var _matchedObservers=[],templateObject;
		for(var attr in object){
			if(typeof object[attr] === "string"){	
					var templateObject=IUI.Template.extractTemplateObject(object[attr]);
					if(templateObject.mappings){
						if(object.model && object.model.model){
							object[attr]=IUI.Template.render(templateObject.template, object.model.model);
						}
						templateObject._uid=IUI.getUID();
						templateObject.optionAttribute=attr;
						//console.log(templateObject)
						_matchedObservers.push(templateObject);
					}
				}
			}
		
		return _matchedObservers;	
	}
	
	behaviors.filterStyleFromObject=function(object){
		var _obj={};
		for(var attr in object){
			if(attr in document.body.style){
				_obj[attr]=object[attr];
			}
		}
		return _obj;		
	}
	
	IUI.behaviors=behaviors;

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('WidgetBuilder',['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

/* ------ IUI.WidgetBuilder.js ----------------- */

	var _extractAttribute=function(object,attribute){
		object[attribute.name]=attribute.value;
		return object;
	}
	
	IUI.uiWidgets={}
	IUI.uiContainers={}
	
	
	/**
	* The basic Object which will hold all the API's related to creation of the Widgets and ContainerUI's
	*/	
	var WidgetBuilder={
		widgetList:{},
		containerList:{}
	};
	
	/**
	* This API Bounded with the Widget Class is used to create new Widgets from the DOM Elements
	* @param {Element} element - The DOM Element from where the options are extracted while creation of the UI.
	* @param {Element} container - the container in which the widget is contained.
	*/
	var _buildWidget=function(element,container,model){
		
		if( container && container.classType==='ObservableModel'){
			model=container;
			container=undefined;
		}
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{
			element : element,
			container : container,
			model : model 
		});
		
		if(options.submodel){
			options.model = options.model[submodel];
		}
		
		return new this(options);
	}
	
	/**
	* This API plugs' in the Extended Widgets and ContainerUI's to the WidgetBuilder.
	*/
	WidgetBuilder.plugin=function(widget){
		var tagName=widget.prototype.name;
		if(tagName){
			if(widget.prototype.classType==="ContainerUI"){
				IUI.uiContainers[tagName]=widget;
				WidgetBuilder.containerList[String(tagName).toUpperCase()]=_buildWidget.bind(widget);
			}else{
				IUI.uiWidgets[tagName]=widget;
				WidgetBuilder.widgetList[String(tagName).toUpperCase()]=_buildWidget.bind(widget);
			}
		}
	}
	
	WidgetBuilder.alias=function xalias(existingWidget, newName){
		existingWidget = String(existingWidget).toUpperCase();
		newName = String(newName).toUpperCase();
		
		if(WidgetBuilder.containerList[existingWidget]){
			WidgetBuilder.containerList[newName]=WidgetBuilder.containerList[existingWidget]
		}else if(WidgetBuilder.widgetList[existingWidget]){
			WidgetBuilder.widgetList[newName]=WidgetBuilder.widgetList[existingWidget]
		}else{
			throw new Error(existingWidget+' Not Found');
		}
	}

	
	IUI.WidgetBuilder=WidgetBuilder;
	
/* ------- END : IUI.WidgetBuilder.js -----------*/


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('DataItem',['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var DataItem=IUI.Class.extend({
		classType: 'DataItem',
		events:IUI.Class.prototype.events.concat(['change']),
		options:{
			data:{}
		},
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this.dataAttributes=[];
			this._data=options.data;
			for(var attr in options.data){
				if(options.data.hasOwnProperty(attr)){
					this[attr]=options.data[attr];
					this.dataAttributes.push(attr);
				}
			}
			delete this.options;
		},
		set: function(key,value){
			this[key]=value;
			this._data[key]=value;
			var changed={}
			changed[key]=value;
			this.trigger('change',{changed:changed, model: this});
		},
		get: function(key){
			return this[key];
		}
		
	});
	
	
	IUI.DataItem=DataItem;

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('DataMart',['IUI-core','DataItem','Validator'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var bindDataMart=function(dataMart){
		var name=dataMart.name;
		if(DataMart._widgetBindings[name] && DataMart._widgetBindings[name].length){
			var length=DataMart._widgetBindings[name].length;
			for(var i=0;i<length;++i){
				DataMart._widgetBindings[name][i](dataMart);
			}
			if(dataMart.state.fetched)
				dataMart.trigger('fetch',{data:dataMart.data});
			
			if(dataMart.persist){
				DataMart._dataBindings[name]=dataMart;
				DataMart._widgetBindings[name]=[];
			}else{
				delete DataMart._widgetBindings[name];
			}
		}else{
			DataMart._dataBindings[name]=dataMart;
		}
	}
	
	
	var DataMart=IUI.Class.extend({
		classType: 'DataMart',
		events:IUI.Class.prototype.events.concat(['fetch','change']),
		options:{
			autofetch: false,
			data:[],
			schema:{
				idField: 'id',
				textField: 'text',
				model:{	}
			}
		},
		state:{
			fetched:false
		},
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this.persist=this.options.persist;
			this.name=this.options.name || IUI.getUID();
			this._validateSchema();
			if(this.options.autofetch){
				this.fetch();
			}
			bindDataMart(this);
		},
		
		_validateSchema: function(){
			if(Object.keys(this.options.schema.model)){
				this.options.schema.model[this.options.schema.idField] = {dataType: 'string'};
				this.options.schema.model[this.options.schema.textField] = {dataType: 'string'};
			}
		},
		addAt: function(index, dataItem){
			if(dataItem.constructor !== IUI.DataItem){
				dataItem=this._processData([dataItem])[0];
			}
			if(this.state.fetched){
				this.data.splice(index,0,dataItem);
				this.trigger('change',{data:this.data, item:dataItem, index: index, type:'add'});
			}else{
				this.options.data.splice(index,0,dataItem);
			}
		},
		get: function(id){
			var _field=this.options.schema.idField;
			if(typeof id === 'object'){
				id = id[_field];
			}
			return this.data.filter(function(elem){
				return elem[_field]===id;
			});
		},
		_remove: function(dataItem){
			var index=this.data.indexOf(dataItem);
			if( index!==-1){
				var _item=this.data.splice(index,1)[0];
				this.trigger('change',{data:this.data, item:_item, index: index, type:'remove'})
			}
		},
		remove: function(dataItem){
			if(dataItem.constructor !== IUI.DataItem){
				dataItem = this.get(dataItem);
			}
			
			if(dataItem.constructor === Array){
				var _length=dataItem.length;
				for(var i=0;i<_length;++i){
					this._remove(dataItem[i]);
				}
			}else{
				this._remove(dataItem);
			}
			
		},
		add: function(dataItem){
			if(dataItem.constructor !== IUI.DataItem){
				dataItem=this._processData([dataItem])[0];
			}
			if(this.state.fetched){
				this.data.push(dataItem)
				this.trigger('change',{data:this.data, item:dataItem, type:'add'});
			}else{
				this.options.data.add(dataItem);
			}
		},
		_handleDataItemChange: function(e){
			
		},
		sort: function(sortOptions){
			if(!this.state.fetched){
				this.options.sort = sortOptions;
			}
			
			if(typeof sortOptions === 'undefined'){
				sortOptions={field:  this.options.schema.idField, dataType: this.options.schema.model[this.options.schema.idField].dataType};
			}
			if(Array.isArray(sortOptions)){
				for(var i=0;i<sortOptions.length;++i){
					(sortOptions[i].dataType) || (sortOptions[i].dataType=this.options.schema.model[sortOptions[i].field]?this.options.schema.model[sortOptions[i].field].dataType:'string');
				}
			}else{
				(sortOptions.dataType) || (sortOptions.dataType=this.options.schema.model[sortOptions.field]?this.options.schema.model[sortOptions.field].dataType:'string');
			}
			
			this.data=IUI.utils.quickSort(this.data, sortOptions);		
			this.trigger('change',{data:this.data});
		},
		_makeObjectFromRawData: function(rawData){
			var _temp={};
			_temp[this.options.schema.idField]=rawData;
			_temp[this.options.schema.textField]=rawData;
			return _temp;
		},
		_processData: function(data){
			var _data=[],
				_dataLength=data.length;
			for(var i=0;i<_dataLength;++i){
				
				//If the object is preprocessed, leave the object.
				if(data[i].constructor === IUI.DataItem){
					_data.push(data[i]);
					continue;
				}
				//If raw string array is passed, data first needs to be converted to object for use by widget.
				if(typeof data[i] !== 'object'){
					data[i]=this._makeObjectFromRawData(data[i]);
				}
				
				
				_data.push(new IUI.DataItem({
					data: data[i],
					change: this._handleDataItemChange
				}));
			}
			
			return _data;
		},
		setData: function(data){
			if(this.state.fetched){
				var _data =this._processData(data);
				this.trigger('change',{data:_data});
				this.data=_data;							
			}else{
				this.data=data;
			}
		},
		fetch: function(data){
			this.data=this._processData(data || this.data || this.options.data);				
			this.state.fetched=true;
			this.trigger('fetch',{data:this.data});
		}		
		
	});
	
	DataMart.bindWidget=function(name,widget){
		
		if(DataMart._dataBindings[name]){
			widget._bindDataMart(DataMart._dataBindings[name]);
			if(DataMart._dataBindings[name].state.fetched)
				DataMart._dataBindings[name].trigger('fetch',{data:DataMart._dataBindings[name].data});
			
			if(!DataMart._dataBindings[name].persist){
				delete DataMart._dataBindings[name];
			}
		}else{
			if(!DataMart._widgetBindings[name]){
				DataMart._widgetBindings[name]=[]
			}
			DataMart._widgetBindings[name].push(widget._bindDataMart.bind(widget));		
		}
	}
	
	DataMart._dataBindings={};
	
	DataMart._widgetBindings={};

	IUI.DataMart=DataMart;
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ContainerUI',['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
	
	var _isWidgets=function(elem){
		return typeof IUI.WidgetBuilder.widgetList[elem.tagName] !== "undefined";
	};
	
	var _elemToWidget=function(elem){
		var widget=IUI.WidgetBuilder.widgetList[elem.tagName](elem,this.$element[0]);
		if(widget.options.id){
			this.widgets[widget.options.id]=widget;
		}
		return widget;
	};
	
	/**
	* Base class for All the Custom Tags which will be enclosing other HTML Elements
	*/
	var ContainerUI=IUI.Class.extend({
		classType:'ContainerUI',
		classList:['i-ui-container'],
		tagName: 'DIV',
		events:IUI.Class.prototype.events.concat(['create']),
		options:{
			async: false
		},
		load: function(options){
			(options.async) && (options.async=JSON.parse(options.async));
		},
		initialize: function(options){
			this.widgets=[];
			this.containers=[];			
			IUI.Class.prototype.initialize.apply(this,arguments);
			if(this.options.renderif && Object.keys(this.options.model.model).indexOf(this.options.renderif) === -1){
				$(this.options.element).replaceWith('<span class="ghost-span">');
				return;
			}
			if(this.options.async){
				this._create=this._createAsync;
			}			
			var _elem=$(this.options.element || document.createElement(this.tagName));
			if(_elem.length===1 && !Array.isArray(this.options.element)){
				this.element=_elem[0];
				this.$element=_elem;
			}else{
				this.element=document.createElement(this.tagName);
				this.$element=$(this.element);
				this.$element.append(_elem);
			}
			
		},
		_onCreateWidget: function(widget){
			//Override this API to process the newly created Widgets/Containers;
		},
		getContainerById: function(id){
			if(typeof this.containers[id] !== "undefined"){
				return this.containers[id];
			}
			var length=this.containers.length;
			for(var i=0;i<length;++i){
				var container=this.containers[i].getContainerById(id)
				if(container){
					return container;
				}
			}
		},
		getWidgetById: function(id){
			if(typeof this.widgets[id] !== "undefined"){
				return this.widgets[id];
			}
			var length=this.containers.length;
			for(var i=0;i<length;++i){
				var widget=this.containers[i].getWidgetById(id)
				if(widget){
					return widget;
				}
			}
		},
		_handleOptionChange:function(key,value){
			if(this.element && key in this.element.style){
				this.element.style[key]=value;
			}else if(key.match(IUI.iiAttributeRegex)){
				this.$element.attr(key,value);
			}
			IUI.Class.prototype._handleOptionChange.apply(this,arguments);						
		},
		_handleisattachedChange: function(value){
			if(value){
				this.attach();
			}else{
				this.detach();
			}
		},
		detach:function(){
			if(this.$element.parent().length){
			(this._detachedSpan) || (this._detachedSpan=$('<span>'));
				this.$element.after(this._detachedSpan);
				this.$element.detach();
			return this;
			}
		},
		attach: function(){
			if(this._detachedSpan && this._detachedSpan.parent().length){
				this._detachedSpan.after(this.$element);
				this._detachedSpan.detach();
			}
		},
		_render: function(elem){
				if($(elem).hasClass('i-ui-widget') || $(elem).hasClass('i-ui-container')){
					return; 
				}
				
				if(typeof IUI.WidgetBuilder.containerList[elem.tagName] !== "undefined"){		
					var container=IUI.WidgetBuilder.containerList[elem.tagName](elem,this.element,this.options.model);
					if(container.options.id){
						this.containers[container.options.id]=container;
					}
					this.containers.push(container);
					this._onCreateWidget(container);
				}else if(typeof IUI.WidgetBuilder.widgetList[elem.tagName] !== "undefined"){
					
					var widget=IUI.WidgetBuilder.widgetList[elem.tagName](elem,this.element,this.options.model);
					if(widget.options.id){
						this.widgets[widget.options.id]=widget;
					}
					this.widgets.push(widget);
					this.trigger('create',{widget: widget});
					this._onCreateWidget(widget);
				}else{
					(elem.children) && (this._create(elem.children));
				}
		},
		_create: function(elements){
			var length=elements.length;
			for(var i=0;i<elements.length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
				this._render(elem);
			}			
		},
		_createAsync: function(elements){
			var length=elements.length, _render=this._render;
			for(var i=0;i<elements.length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
				setTimeout((function(elem){
					_render(elem)
				})(elem));
			}			
		},
		_itterateCommandToAllComponents: function(command){
			var args=Array.prototype.slice.call(arguments,1);
			for(var c in this.containers){
				var container=this.containers[c];
				(container[command]) && (container[command].apply(container,args));
			}
			for(var w in this.widgets){
				var widget=this.widgets[w];
				(widget[command]) && (widget[command].apply(widget,args));
			}
		},
		destroy: function(val){
			this._itterateCommandToAllComponents('destroy');
		},
		enable: function(val){
			this._itterateCommandToAllComponents('enable',val);
		},
		_processOptions: function(wrapper){
			IUI.behaviors.extractFromObject(wrapper,this.options,['style','ii-attibute']);			
			if(typeof this.options.class === "string"){
				$(wrapper).addClass(this.options.class.split(' '));	
			}
			if(this.options.id){
				wrapper.id=this.options.id;
			}
			if(this.options.disabled && this.options.disabled !== 'false'){
				this.options.enable=false;
				$(wrapper).addClass('i-ui-disabled');
			}
			if(this.options.validations){
				this.validationList=this.validationList.concat(this.options.validations);			
			}			
			
		},
		makeUI: function(){
			var tagName=this.element.tagName;
			if(tagName!=='BODY' && tagName!==this.tagName){
				var elem=document.createElement(this.tagName);
				$($(this.element).children()).appendTo(elem);
				$(this.element).replaceWith($(elem));
				this.element=elem;
				this.$element=$(elem);
			}
			this._processOptions(this.element);
			this._create(this.element.children);
			this.$element.addClass(this.classList);				
			if(IUI.domAccessibility){
				this.element.uiContainer=this;
			}
			this.element.onDOMAppend = this.onDOMAppend;
		},
		_findAndMakeWidgets:function(){
			this.widgets=[];
			var allElements=Array.prototype.slice.call(this.$element.find('*')),
				widgetList=allElements.filter(_isWidgets).map(_elemToWidget,this);
			Array.prototype.push.apply(this.widgets,widgetList);
		}
	});
	
	IUI.ContainerUI=ContainerUI;
	
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Plugable',['IUI-core','ContainerUI'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var plugList={};
	


	var Plugable =  IUI.ContainerUI.extend({
		events: IUI.ContainerUI.prototype.events.concat(['plug', 'activate']),
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this._extractPlugOptions();
		},
		onInitialize: function(){
			(this.options.plugto) && (this._plugTo(this.options.plugto));
		},
		_extractPlugOptions: function(){
			var _plugOptions={}, options=this.options;
			Object.keys(options).forEach(function(_key){
				if(_key.indexOf('plug-')===0){
					_plugOptions[_key.slice(5)]=options[_key];
				}
			});
			this._plugOptions = _plugOptions;
		},
		plug: function(widget){
			
		},
		_plugTo: function(plugName){
			var that=this;
			if(plugList[plugName]){
				plugList[plugName].plugs.forEach(function(_plug){
					that.plug(_plug);
				});				
				plugList[plugName].plugable.push(this);
			}else{
				plugList[plugName]={
					plugs:[],
					plugable: [this]
				}
			}
		},
		unplug: function(){
			var that=this;
			if(this.options.plugto){
				plugList[this.options.plugto].plugable.forEach(function(_plugable, idx, list){
					if(_plugable === that){
						list.splice(idx,1);
						return false;
					}
				});
			}
		},
		destroy: function(){
			this.unplug();
			IUI.ContainerUI.prototype.destroy.apply(this,arguments);	
		}	
	});
	
	Plugable.registerPlug = function(name, widget){
		if(plugList[name]){
			plugList[name].plugable.forEach(function(_plugable){
				_plugable.plug(widget);
			});
			plugList[name].plugs.push(widget);
		}else{
			plugList[name]={
				plugs:[widget],
				plugable: []
			}
			
		}
	}
	IUI.Plugable=Plugable;

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Widget',['IUI-core','WidgetBuilder','DataMart','Validator','Behaviors','Plugable'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){
	
	IUI.persistantAttributes=['src'];
	/**
	*	The base Framework Class for all the Widgets which are created by WidgetBuilder.
	*/
	var Widget=IUI.Class.extend({
		name: 'Widget',		
		template: '',
		classType: 'Widget',
		tagName: 'DIV',
		classList: ['i-ui-widget'],
		events:IUI.Class.prototype.events.concat(['validate']),
		validationList: [],
		_observedOptions:['enable','isattached'],
		_optionModelMapping:[],
		load: function(options){
			if(typeof options.validations === "string"){
				options.validations=options.validations.split(',').map(function(elem){return elem.trim()})
			}
			if(typeof options.escapehtml === "string"){
				options.escapehtml=JSON.parse(options.escapehtml);
			}
			if(typeof options.isattached === "string"  && !options.isattached.match(IUI._observableRegex)){
				options.isattached=JSON.parse(options.isattached);
			}
			if(typeof options.enable === "string"  && !options.enable.match(IUI._observableRegex)){
				options.enable=JSON.parse(options.enable);
			}
			this.boundModelOptions={
				validator: this._validate.bind(this)
			}
		},
		initialize: function(options){
			this._initPromise = $.Deferred();
			IUI.Class.prototype.initialize.apply(this,arguments);	
			if(this.options.renderif && Object.keys(this.options.model).indexOf(this.options.renderif) === -1){
				$(this.options.element).replaceWith('<span class="ghost-span">');
				return;
			}
			this.$element=$(this.options.element)
			this.element=this.$element[0];
			this.bindModels(this.boundModelOptions);
			if(this.options.datamart){
				IUI.DataMart.bindWidget(this.options.datamart,this);
			}else if(this.options.data){

				this._processModelData();
			}
			this.makeUI();	
			if(!this.options.isattached){
				this.detach();
			}
			if(!this.options.enable){
				this.enable(false);
			}
			this._initPromise.resolve();
			delete this._initPromise;
			if(this.options.plug){
				IUI.Plugable.registerPlug(this.options.plug, this);
			}			
		},
		_handledataChange: function(){

			this._processModelData();
		},
		_processModelData: function(){
			if(typeof this.options.data === 'string'){
				return;
			}else 
				if(typeof this.options.data === 'object'){
					if(!this.dataMart){
						var dataMart = new IUI.DataMart({
							idField : this.options.idField,
							textField : this.options.textField,
							data : this.options.data,
							autofetch: true
						});
						IUI.DataMart.bindWidget(dataMart.name,this);
					}else{
						this.dataMart.setData(this.options.data);
					}
				}			
		},
		_handleOptionChange:function(key,value){

			if(IUI.persistantAttributes.indexOf(key) !== -1){
				this.$element.attr(key, value);
				
			}else if(key in this.element.style){
				this.element.style[key]=value;
				
			}else if(key.match(IUI.iiAttributeRegex)){
				this.$element.attr(key,value);
				
			}
			IUI.Class.prototype._handleOptionChange.apply(this,arguments);
			
			
		},
		_handleenableChange: function(value){
			this.enable(value);
		},
		_handleisattachedChange: function(value){
			if(value){
				this.attach();
			}else{
				this.detach();
			}
		},
		_cleanUp: function(){
			
		},
		onDataFetch:function(dataObject){
			
		},
		onDataChange: function(dataObject){
			
			
		},
		_bindDataMart: function(dataMart){
			this.dataMart=dataMart;
			
			dataMart._bind({
				fetch: function(dataObject){
					var that=this;
					if(that._initPromise){
						that._initPromise.done(function(){
							that._cleanUp();
							that.onDataFetch(dataObject)
						});
					}else{
							that._cleanUp();
						that.onDataFetch(dataObject)
					}
				}.bind(this),
				change: function(dataObject){
					var that=this;
					if(that._initPromise){
						that._initPromise.done(function(){
							that.onDataChange(dataObject)
						});
					}else{
						that.onDataChange(dataObject)
					}
				}.bind(this)
			});			
		},
		_preprocessElement: function(wrapper){
			Array.prototype.slice.call(this.element.style).forEach(function(elem){
					wrapper.style[elem]=this.element.style[elem];
			},this);			
		},
		detach:function(){
			if(this.$element.parent().length){
			(this._detachedSpan) || (this._detachedSpan=$('<span>'));
				this.$element.after(this._detachedSpan);
				this.$element.detach();
				this.options.isattached= false;
				return this;
			}
		},
		attach: function(){
			if(this._detachedSpan && this._detachedSpan.parent().length){
				this._detachedSpan.after(this.$element);
				this._detachedSpan.detach();
				this.options.isattached = true;
			}
		},
		_processOptions: function(wrapper){
			var options=this.options;
			IUI.behaviors.extractFromObject(wrapper,this.options,['style','ii-attibute']);			
			if(typeof this.options.class === "string"){
				$(wrapper).addClass(this.options.class.split(' '));	
			}
			IUI.persistantAttributes.forEach(function(_attr){
				if(options[_attr] && !options[_attr].match(IUI._observableRegex)){
					$(wrapper).attr(_attr,options[_attr])
				}
			});
			
			if(this.options.id){
				wrapper.id=this.options.id;
			}
			if(this.options.disabled && this.options.disabled !== 'false'){
				this.options.enable=false;
				$(wrapper).addClass('i-ui-disabled');
			}
			if(this.options.validations){
				this.validationList=this.validationList.concat(this.options.validations);			
			}			
		},
		onTemplateAttach:function(wrapper){
			//Override it to extract children to variables or to process children of templare before processing options or element;
		},
		makeUI: function(){
			var wrapper=document.createElement(this.tagName);
			
			$(wrapper).addClass(this.classList);
			wrapper.innerHTML=this.template;
			this.onTemplateAttach(wrapper);
			this._processOptions(wrapper);
			
			
			if(this.element){
				this._preprocessElement(wrapper);				
				$(this.element).replaceWith($(wrapper));
			}
			this.element=wrapper;
			if(IUI.domAccessibility){
				this.element.iuiWidget=this;
			}
			this.element.onDOMAppend = this.onDOMAppend;
			this.$element=$(wrapper);
			this.onRender();
		},
		onRender:function(){
			
		},
		_onValidate: function(result){
			var that=this;
			if(!result.valid){
				clearTimeout(this.invalidTimeout);
				this.$element.addClass('i-ui-invalid');
				this.invalidTimeout=setTimeout(function(){
					that.$element.removeClass('i-ui-invalid');
				},200);
			}else{
				this.$element.removeClass('i-ui-invalid');
			}
		},
		validate: function(validator){
			var validObject=this._validate(this.value(),validator);
			clearTimeout(this.invalidTimeout);
			return validObject;
		},
		_validate: function(value,validator){
			var valid=true,
				rules=[],
				_validator=validator || IUI.Validator,
				length=this.validationList.length;
			for(var i=0;i<length;i++){
				var rule=this.validationList[i];
					_valid=_validator.validate(rule,value);
				if(!_valid){
					rules.push(rule);
				}
				valid=valid && _valid;
			}
			var validObject={valid: valid,rules:rules};
			this._onValidate(validObject);
			this.trigger('validate',validObject);
			return validObject;			
		},
		enable: function(val){
			if(typeof val !== 'undefined'){
				val=JSON.parse(val);
				this.$element.toggleClass('i-ui-disabled',!val);
				//debugger;
			//	this.options.enable = val;
			}else{
				return !this.$element.hasClass('i-ui-disabled');
			}
			
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				return this.element.innerHTML=val;
			}
			return this.element.innerHTML;
		},
		options:{
			enable: true,
			isattached: true,
			escapehtml: false			
		}
		
	});
	
	IUI.Widget=Widget;
	IUI.WidgetBuilder.plugin(Widget);
	
/* ------- END : IUI.Widgets.js -----------*/


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Validator',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var validator;
	
	Validator=function Validator(){
		this._validationRules={}
	}
	
	Validator.prototype.addRule=function addRule(rule,handler){
		if(typeof this._validationRules[rule] === 'undefined'){
			this._validationRules[rule]=[];
		}
		this._validationRules[rule].push(handler);
	}
	
	Validator.prototype.validate=function validateByRule(rule,object){
		var length, valid=true;
		if(typeof this._validationRules[rule] !== 'undefined'){
			length=this._validationRules[rule].length;
			for(var i=0;i<length;++i){
				valid = valid && this._validationRules[rule][i](object);
			}
		}
		return valid;
	}
	
	
	validator=new Validator();
	Validator._validationRules=validator._validationRules;
	Validator.addRule=validator.addRule;
	Validator.validate=validator.validate;
	
	IUI.Validator=Validator;
	
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ObservableModel',['IUI-core','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var validator= function(){
		return {valid:true};
	}
	var ObservableModel=IUI.Class.extend({
		classType: 'ObservableModel',
		initialize: function(model,handler,list,options){
			this._uid=IUI.getUID();
			//IUI.Class.prototype.initialize.call(this,options);
			options=((options) || ({}));
			if(typeof handler === "object"){
				list=handler;
				delete handler;
			}	
			
			var _data={},
				_handleChange=this._handleChange.bind(this);
			if((options.shouldValidate===false || !options.validator)){
				validator = validator;
			}
			this._data=_data;
			this.handler=handler;
			
			var that=this, _modelUpdating=false;
			this.model=model || {};
			
			Object.defineProperty(this.model,'__update',{
				value: function(_newModel){
					_modelUpdating=true;
					var _keys=[], that=this;
					Object.keys(_newModel).forEach(function(key){
						that[key]=_newModel[key];				
						_keys.push(key);
					});
					_keys.forEach(function(key){
						_handleChange(key,_newModel[key]);
					});
					
					_modelUpdating=false;
				},
				enumerable: false
    		});
				
			
			Object.keys(model).forEach(function(key){
				if(list && (list.indexOf(key)===-1)){
					return;
				}else if(typeof that.model[key] === 'function'){
					return;
				}
				
				Object.defineProperty(that._data,key,{
					value: that.model[key],
					writable: true
    			});
				
				Object.defineProperty(that.model,key,{	
					set: function(value){
							var valid=validator(value);
							if(_data[key]!==value && valid.valid){
								_data[key]=value;
								(_modelUpdating) || (_handleChange(key,value));
							}
						},
					get: function(){
							return _data[key];
						}
				});
			});
	
		},
		
		_handleChange: function(key,value,sender){
			var that=this;

			setTimeout(function(){
				(that.handler) && (that.handler(key,value,sender));
			})
		}
	});
	
	
	ObservableModel.bindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.bindConainerModel(containerModel,mappingArray);
		containerModel.bindOptionModel(optionsModel,mappingArray);
	}
		
	ObservableModel.unbindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.unbindConainerModel(containerModel,mappingArray);
		containerModel.unbindOptionModel(optionsModel,mappingArray);
	}
	
	
	IUI.ObservableModel=ObservableModel;
	


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Utils',['IUI-core'],factory);
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var _utilities={}
	
	IUI.registerUtil = function(name, handler){
		Object.defineProperty(_utilities, name,{
			value: handler,
			writable: false
		});	
	}
	
	IUI.utils=_utilities;

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('OptionModel',['IUI-core','ObservableModel','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var OptionsModel=IUI.ObservableModel.extend({
		ModelType: 'OptionsModel',
		_handleChange: function(key,value,sender){
			//console.log('in Options Model'+ this._uid);
			IUI.ObservableModel.prototype._handleChange.apply(this,arguments);
			var boundModels=this.boundModels[key],length;
			if(boundModels){
				var length=boundModels.length;
				for(var i=0;i<length;++i){
					var obj=boundModels[i];
					(obj.model.modelLastUpdatedBy)||(obj.model.modelLastUpdatedBy = {});
					(obj.model.modelLastUpdatedBy[obj._uid]) || (obj.model.modelLastUpdatedBy[obj._uid]={})
					var _modelLastUpdated= obj.model.modelLastUpdatedBy[obj._uid];
					for(var a in obj.mappedAttributes){
						if(obj.isExclusive){
							(_modelLastUpdated[obj.mappedAttributes[a]]) || (_modelLastUpdated[obj.mappedAttributes[a]]=[]);
							if(_modelLastUpdated[obj.mappedAttributes[a]].indexOf(this._uid)===-1){
								_modelLastUpdated[obj.mappedAttributes[a]].push(this._uid);
								if(obj.model.model[obj.mappedAttributes[a]]!==value)
									obj.model.model[obj.mappedAttributes[a]]=value;
							}
						}
					}
				}			
			}
		},
		unbindConainerModel: function(optionModel,mappingArray){
			var length = mappingArray.length, keys;
			var uids={
				
			};
			for(var i=0;i<length;++i){
				(uids[mappingArray[i].optionAttribute]) || (uids[mappingArray[i].optionAttribute] =[])
				uids[mappingArray[i].optionAttribute].push( mappingArray[i]._uid);
			}
			keys=Object.keys(uids)
			for(var i in keys){
				
				this.boundModels[keys[i]]=this.boundModels[keys[i]].filter(function(elem){
					if(uids[keys[i]].indexOf(elem._uid) !== -1){
						return false;
					}
					return true;
				});	
				
				
			}
				
		},
		bindConainerModel: function(containerModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels={});
			for(var i=0;i<length;++i){
				var obj={
					model: containerModel,
					mappedAttributes:[],
					isExclusive:mappingArray[i].isExclusive,
					_uid: mappingArray[i]._uid
				}
				mapping=mappingArray[i].mappings;
				for(var maps in mapping){
					if(typeof containerModel.model[mapping[maps]] !== "undefined"){
						obj.mappedAttributes.push(mapping[maps]);
					}
				}
				options=mappingArray[i].optionAttribute;
				(this.boundModels[options]) || (this.boundModels[options]=[]);
				this.boundModels[options].push(obj);				
			}
		}
	});

		
	IUI.OptionsModel=OptionsModel;
	
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ContainerModel',['IUI-core','ObservableModel','Template'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var ContainerModel=IUI.ObservableModel.extend({
		ModelType: 'ContainerModel',
		
		_handleChange: function(key,value,sender){
			//console.log('in Container Model'+ this._uid);
			IUI.ObservableModel.prototype._handleChange.apply(this,arguments);
			var boundModels=this.boundModels,length, that=this;
			if(boundModels.length){
				var length=boundModels.length;				
				for(var i=0;i<length;++i){
					var obj=boundModels[i];
					
					/*(this.lastUpdatedBy) || (this.lastUpdatedBy={});
					(this.modelLastUpdatedBy) || (this.modelLastUpdatedBy={});
					(this.modelLastUpdatedBy[obj._uid]) || (this.modelLastUpdatedBy[obj._uid]={});
					
					(this.modelLastUpdatedBy[obj._uid][obj.optionAttribute]) || (this.modelLastUpdatedBy[obj._uid][obj.optionAttribute]=[])
					if(this.modelLastUpdatedBy[obj._uid][obj.optionAttribute].indexOf(this.uid)===-1){
						this.modelLastUpdatedBy[obj._uid][obj.optionAttribute].push(this.uid);*/
						var result=IUI.Template.render(obj.template,this.model);	
						obj.model.model[obj.optionAttribute]=result;
/*					}
					
					clearTimeout(this.lastUpdateClearTimeout);
					this.lastUpdateClearTimeout=setTimeout(function(){
						delete that.lastUpdatedBy;
						delete that.modelLastUpdatedBy;
					});*/
				}			
			}
		},
		unbindOptionModel: function(optionModel,mappingArray){
			var length = mappingArray.length;
			var uids=[];
			for(var i=0;i<length;++i){
				uids.push( mappingArray[i]._uid);
			}
			this.boundModels=this.boundModels.filter(function(elem){
				if(uids.indexOf(elem._uid) !== -1){
					return false;
				}
				return true;
			});		
		},
		bindOptionModel: function(optionModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels=[]);
			for(var i=0;i<length;++i){
				var obj={
					model: optionModel,
					optionAttribute:mappingArray[i].optionAttribute,
					template:mappingArray[i].template,
					_uid: mappingArray[i]._uid
				}
				mapping=mappingArray[i].mappings;
				this.boundModels.push(obj);		
			}
		}	
	});
	
	IUI.ContainerModel=ContainerModel;
	
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Container',['IUI-core','ContainerUI'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Container=IUI.ContainerUI.extend({
		name:'Container',
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this.bindModels();
			this._beforeRender();
			this.makeUI();		
			this._afterRender();
		},
		_beforeRender:function(){
		},
		_afterRender:function(){
		}
	});
	
	IUI.WidgetBuilder.plugin(Container);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('DataBoundContainer',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var DataBoundContainer=IUI.uiContainers.Container.extend({
		name:'DataBoundContainer',
		initialize: function(){
			this._initPromise=$.Deferred();
			IUI.uiContainers.Container.prototype.initialize.apply(this,arguments);
		},
		onInitialize: function(){
			this._initPromise.resolve();
			delete this._initPromise;
		},		
		makeUI: function(){
			if(this.options.datamart){
				IUI.DataMart.bindWidget(this.options.datamart,this);
			}
			IUI.uiContainers.Container.prototype.makeUI.apply(this,arguments);
			this._attachEvents();
		},
		_bindDataMart: function(dataMart){
			this.dataMart=dataMart;
			
			dataMart._bind({
				fetch: function(dataObject){
					var that=this;
					if(that._initPromise){
						that._initPromise.done(function(){
							that._cleanUp();
							that.onDataFetch(dataObject)
						});
					}else{
						that._cleanUp();
						that.onDataFetch(dataObject)
					}
				}.bind(this),
				change: function(dataObject){
					var that=this;
					if(that._initPromise){
						that._initPromise.done(function(){
							that.onDataChange(dataObject)
						});
					}else{
						that.onDataChange(dataObject)
					}
				}.bind(this)
			});			
		},
		onDataFetch:function(dataObject){
			
		},
		_cleanUp: function(){
			
		},
		onDataChange: function(dataObject){
			
			
		},
		_attachEvents: function(){
			
		}
	});
	
	IUI.WidgetBuilder.plugin(DataBoundContainer);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('VerticalScroller',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var VerticalScroller=IUI.uiContainers.Container.extend({
		name:'VerticalScroller',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-verticalscroller']),
		options: {
			height: '15rem',
			autohide: true,
			scrollinside:false,
			nativescrollbar: false,
		},
		load: function(options){
			IUI.uiContainers.Container.prototype.load.apply(this,arguments);
			(options.autohide) && (options.autohide=JSON.parse(options.autohide));
			(options.nativescrollbar) && (options.nativescrollbar=JSON.parse(options.nativescrollbar));
			(options.scrollinside) && (options.scrollinside=JSON.parse(options.scrollinside));
			
		},
		_beforeRender: function(){
		},
		_handlerWrapperMouseover: function(){
			this.downArrow.css({
				display: 'block'
			});
			this.upArrow.css({
				display: 'block'
			});
			
			
			
			this.downArrow.animate({
				opacity: 1,
				bottom: -this.downArrowOffset
			},50);
			
			this.upArrow.animate({
				opacity: 1,
				top: -this.upArrowOffset
			},50);
		},
		_handlerWrapperMouseout: function(e){
			if($.contains(e.currentTarget,e.relatedTarget)){
				return;
			}
			var that=this;
			this.downArrow.animate({
				opacity: 0,
				bottom: 0
			},50,function(){
				that.downArrow.css({
					display: 'none'
				});
			});
			
			this.upArrow.animate({
				opacity: 0,
				top: 0
			},50,function(){
				that.upArrow.css({
					display: 'none'
				});
			});
		},
		_handleScrollUp: function(e){
			var that=this;
			
			this._scrollInterval=setInterval(function(){
				var _val=that.element.scrollTop;
				that.element.scrollTop=_val-5;
				if(that.element.scrollTop===0){
					clearInterval(that._scrollInterval);
				}
			},50);
		},
		_handleScrollDown: function(e){
			var that=this;
			
			this._scrollInterval=setInterval(function(){
				var _val=that.element.scrollTop;
				that.element.scrollTop=_val+5;
				if(that.element.scrollTop===_val){
					clearInterval(that._scrollInterval);
				}
			},50);
						
		},
		_handleScrollEnd: function(e){
			clearInterval(this._scrollInterval);
		},
		_afterRender: function(){
			this.wrapper=this.$element.wrap('<div class="i-ui-scroller-wrapper">').parent();			
			if(this.options.nativescrollbar){
				this.$element.css({'overflow-y':'auto'})
				return;
				
			}
			
			this.upArrow=$('<div class="i-ui-scroller-up-arrow"><i class="i-ui-widget-icon fa fa-caret-up" aria-hidden="true"></i></div>').css({position: 'absolute'});
			this.downArrow=$('<div class="i-ui-scroller-down-arrow"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div>').css({position: 'absolute'});
			this.wrapper.prepend(this.upArrow);
			this.wrapper.append(this.downArrow);
			
			
			if(this.options.autohide){
				this.upArrow.css({
					opacity: 0,
					top: 0,
					display: 'none'
					
				});
				this.downArrow.css({
					opacity: 0,
					bottom: 0,
					display: 'none'
				})
				this.wrapper.on('mouseover.verticalscroller',this._handlerWrapperMouseover.bind(this));
				this.wrapper.on('mouseout.verticalscroller',this._handlerWrapperMouseout.bind(this));
			}
			
			
			if(this.options.scrollinside){
				this.wrapper.addClass('i-ui-inset-scrollable');
				this.downArrowOffset=0;
				this.upArrowOffset=0;
			}else{
				this.downArrowOffset=this.downArrow.height();
				this.upArrowOffset=this.upArrow.height();
			}
			
			
			this.upArrow.on('mouseover.verticalscroller',this._handleScrollUp.bind(this));
			this.upArrow.on('mouseout.verticalscroller',this._handleScrollEnd.bind(this));
			this.downArrow.on('mouseover.verticalscroller',this._handleScrollDown.bind(this));
			this.downArrow.on('mouseout.verticalscroller',this._handleScrollEnd.bind(this));
			
			
			
			
			
		}
		
	});
	
	IUI.WidgetBuilder.plugin(VerticalScroller);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('QuickSort',['IUI-core','Utils'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var originalIndexArr;
	
	var _defaultComparator = function(a,b){	
		return (a - b)*this.multiplier;
	}
	
	var _defaultStringComparator = function(a,b){	
		return (a<b?(-1):(a === b?(0):(1)))*this.multiplier;
	}
	
	var _defaultBooleanComparator = function(a,b){	
		return ((!a === !b)?0:((!a)?-1:1))*this.multiplier;
	}
	
	var _getStringComparatorForField = function(field, multiplier){
		return function(a,b){	
			return multiplier*(a[field]<b[field]?(-1):(a[field] === b[field]?(0):(1))); 
		}
	}
	
	var _getNumberComparatorForField = function(field, multiplier){
		return function(a,b){	
			return multiplier*(a[field] - b[field]);
		}
	}
	
	var _getBooleanComparatorForField = function(field, multiplier){
		return function(a,b){	
			return multiplier*((!a[field] === !b[field])?0:((!a[field])?-1:1));
		}
	}
	

	var negateComparator = function(comparator){
		return function(){
			return -(comparator.apply(this, arguments));
		}
	}
	
	var _sort = function(array, startIndex, endIndex, comparator){
		
		if(startIndex >= endIndex){
			return;
		}
		var _index = startIndex, pivot = endIndex, _temp, noswap;
		
		for(var i= startIndex; i < endIndex; ++i){
			
			if(comparator(array[i], array[i+1]) < 0 && i+1 < endIndex ){
				_temp 			= array[i];
				array[i] 		= array[i+1];
				array[i+1] 	= _temp;	
				noswap=false;
			}
			
			if(comparator(array[i], array[pivot]) < 0){
				_temp 			= array[i];
				array[i] 		= array[_index];
				array[_index] 	= _temp;
				_index++;
			}	
			
		}
		
			_temp 			= array[_index];
			array[_index]	= array[pivot];
			array[pivot] 	= _temp;
			
		if(noswap /*_index === startIndex */){
		return;
		}
		
		_sort(array, startIndex, _index - 1, comparator);
		_sort(array, _index + 1, endIndex  , comparator);
		
		return array;
	}
	
	
	var getComparator = function(options){
		var multiplier=(options.desc?-1:1);
		if(typeof options === 'undefined'){
			return _defaultComparator.bind({multiplier:multiplier});
		}
		if(options.comparator){
			return options.comparator.bind({multiplier:multiplier});
		}
		
		if(options.field){
			if(!options.dataType || options.dataType === 'number'){
				return _getNumberComparatorForField(options.field, multiplier);
			}else  if(options.dataType === 'boolean'){
				return _getBooleanComparatorForField(options.field, multiplier);
			}else{
				return _getStringComparatorForField(options.field, multiplier);
			}			
		}else{
			if(!options.dataType || options.dataType === 'number'){
				return _defaultComparator.bind({multiplier:multiplier});
			}else  if(options.dataType === 'boolean'){
				return _defaultBooleanComparator.bind({multiplier:multiplier});
			}else{
				return _defaultStringComparator.bind({multiplier:multiplier});
			}
		}
		
		
	}


	var getSortIndexArrayForGroupByField = function(array, field){
		var startIndex=0, arr=[];
		var currentObj=array[0][field];
		for(var i=0;i<array.length;++i){
			if(currentObj !== array[i][field]){
				arr.push({
					startIndex: startIndex,
					endIndex: i-1
				});
				startIndex = i;
				currentObj = array[i][field];
			}
		}
		arr.push({
			startIndex: startIndex,
			endIndex: array.length-1
		});
				
		return arr;
	}
	
	var quickSort = function(array, comparator, options){
	
		if(comparator && typeof comparator !== 'function'){
			options = comparator;
			comparator=null;
		}		
		options = options || {};
		
		if(options.constructor === Array){
			quickSort(array, comparator, options[0]);
			
			for(var i=1;i<options.length;++i){
				
				var _indexArr = getSortIndexArrayForGroupByField(array, options[i-1].field);
				for(var j=0; j<_indexArr.length; ++j){
					options[i].startIndex = _indexArr[j].startIndex;
					options[i].endIndex = _indexArr[j].endIndex;
					quickSort(array, comparator, options[i]);
				}
			}
			
			return array;
		}
		
		comparator = getComparator(options);
		
		return _sort(array, (options.startIndex || 0), (options.endIndex || array.length-1), comparator);
		
	}

	IUI.registerUtil('quickSort', quickSort);
	

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Row',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Row=IUI.uiContainers.Container.extend({
		name:'Row',
		tagName: 'tr',
		classList: ['i-ui-row']
	});
	
	IUI.WidgetBuilder.plugin(Row);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Popover',['IUI-core','Container','Plugable'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var PopOver=IUI.Plugable.extend({
		name:'PopOver',
		initialize: function(){
			var that=this;
			Plugable.prototype.initialize.apply(this,arguments);	
			this.bindModels();
			this._beforeRender();
			this.$element.children().wrapAll('<div>');
			this.popup = IUI.createOverlay({
				contents: this.$element.children(),
				button: $(this.options.button),
				height: this.options.height,
				width: this.options.width,
				direction: this.options.direction,
				placement: this.options.placement,
				autoclose: this.options.autoclose
			});
			this.wrapper=this.popup.element;
			this.$wrapper=this.popup.$element;
			if(this.options.autopen == 'true'){
				this.popup.open();
			}
			this.makeUI();					
			this._afterRender();
			this._attachEvents();
		},
		makeUI: function(){
			if($(this.element).parent().length)
				this.element.outerHTML='<span class="ghost-span"></span>';
			this.element=null;
		},
		options:{
			height: '15em',
			width: '50%',
			direction: 'down',
			placement: 'top',
			autoclose: true,
			autoopen: true,
			'plug-event':'click'
		},
		plug: function(widget){
			var that=this;
			this.popup._initPromise.done(function(){	
				widget.$element.on(that.options['plug-event'], function(e){
					that.popup.options.anchor=e.currentTarget;
					that.trigger('activate',{
						widget: widget					
					});
					that.popup.open();
				});
			});
			
		},
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-popover-container']),
		_beforeRender:function(){
			
		},
		_afterRender:function(){
			
		},
		_attachEvents: function(){
			
		}
		
	});
	
	IUI.WidgetBuilder.plugin(PopOver);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ContextMenu',['IUI-core','Popover'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var ContextMenu=IUI.uiContainers.PopOver.extend({
		name:'ContextMenu',
		initialize: function(options){
			var that=this;
			options.button=null;
			this.element=options.element;
			setTimeout(function(){
				IUI.uiContainers.PopOver.prototype.initialize.call(that,options);	
			});
			
		},
		options:{
			height: '20em',
			width: '15em',
			direction: 'down',
			placement: 'top',
			autoclose: true,
			autoopen: false
		},
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-popover-container']),
		_beforeRender:function(){
			
		},
		_afterRender:function(){
			
		},
		classList: IUI.uiContainers.PopOver.prototype.classList.concat(['i-ui-context-menu']),
		_attachEvents: function(){
			var that=this;
			IUI.uiContainers.PopOver.prototype._attachEvents.apply(this,arguments);	
			
			$(this.options.container).on('mousedown',function(e){
				
				that.popup.closeImmediate(e);
			});
			$(this.options.container).on('contextmenu',function(e){
				if(e.which === 3){
					e.preventDefault();
					that.popup.setClientRectangle([{
						right:e.originalEvent.x,
						left:e.originalEvent.x,
						top:e.originalEvent.y,
						bottom:e.originalEvent.y,
						height:0,
						width:0
					}]);
					that.popup.open();
					e.stopPropagation();
				}
			});
			
		
		}
		
	});
	
	IUI.WidgetBuilder.plugin(ContextMenu);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Layout',['IUI-core','Container','ContainerUI'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Layout=IUI.ContainerUI.extend({
		name:'Layout',
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this._beforeRender();
			this.makeUI();		
			this.bindModels();
			this._afterRender();
		},
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-layout']),
		subContainerClassList: ['i-ui-subcontainer'],
		makeUI: function(){
			var tagName=this.element.tagName;
			if(tagName!=='BODY' && tagName!=='DIV'){
				var layout=document.createElement('div'),
				subcontainer=document.createElement('div');
				$($(this.element).siblings()).appendTo(subcontainer);
				IUI.behaviors.extractFromObject(subcontainer,this.options,['subconatiner-attribute']);	
				this.options.subcontainerOptions.element=subcontainer;
				this.options.subcontainerOptions.model=this.options.model;
				this._subcontainer=new IUI.ContainerUI(this.options.subcontainerOptions);
				this._subcontainer.makeUI();
				this._subcontainer.bindModels();
				$($(this.element).children()).appendTo(layout);
				
				$(this.element).replaceWith($(layout));
				this.element=layout;
				this.$element=$(layout);
				this.subcontainer=subcontainer;
				this._appendSubContainer()
				this.processSubcontainer(subcontainer);
			}
			this._create(this.element.children);
			this._processOptions(this.element);
			//this._create(this.element.children);
			this.$element.addClass(this.classList);	
			if(this.options.id){
				this.subcontainer.id=this.options.id+'-subcontainer';
			}
			$(this.subcontainer).addClass(this.subContainerClassList);
			if(IUI.domAccessibility){
				this.element.uiContainer=this;
			}
			this.element.onDOMAppend = this.onDOMAppend;
		},
		_appendSubContainer: function(){
			this.$element.before(this.subcontainer);
		},
		getContainerById: function(id){
			var container=IUI.ContainerUI.prototype.getContainerById.apply(this,arguments);	
			if(!container){
				return this._subcontainer.getContainerById(id);
			}
			return container;
		},
		_beforeRender:function(){
			
		},
		_afterRender:function(){
			
		},
		processSubcontainer:function(subcontainer){
			
		}
	});
	
	IUI.WidgetBuilder.plugin(Layout);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('View',['IUI-core','ContainerUI'],factory);
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
	var viewPromiseMap = {
		
	}

	var viewContexts = {
		default:{
			view: {},
			viewport: {}
		}
	}
	
	var View = IUI.ContainerUI.extend({
		name:'View',
		events: IUI.ContainerUI.prototype.events.concat(['render','append']),
		initialize: function(options){
			this._uid=IUI.getUID();
			$(options.element).removeAttr('viewmodel').removeAttr('name').removeAttr('datamart').removeAttr('eventgroup')
				.addClass('i-ui-exhibit');
			if(options.name){
				viewContexts[options.context || this.options.context].view[options.name]=this;
			}	
			this.name = options.name;
			if(options.templateurl){
				var that=this, _arguments=arguments;
				var _clone = $(options.element).clone().empty();
				_clone.load(options.templateurl, function(){
					that.template = '<container'+_clone[0].outerHTML.slice(5,-5)+'container>'
					IUI.ContainerUI.prototype.initialize.apply(that,_arguments);	
					that.makeUI();
					that.bindModels();
				});
			}else{
				this.template = '<container'+options.element.outerHTML.slice(5,-5)+'container>';
				IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
				this.makeUI();
				this.bindModels();
			}
		},	
		options:{
			context: 'default'
		},
		_honorViewPromise: function(){
			var _name = IUI.View.getName(this),
				viewPromise = viewPromiseMap[_name] || viewPromiseMap[this._uid];
			if( viewPromise ){
				IUI.View.renderViewInViewport(this, viewPromise);
				delete viewPromiseMap[_name];
				delete viewPromiseMap[this._uid];
			}
		},
		_handleviewmodelChange:function(value){
			if(!this.bound && typeof value === 'string'){
				IUI.ViewModel.bindView(value, this);
				this.bound=true;
			}else if(typeof value == 'object'){
				this._modelReady = true;
				this._honorViewPromise();
			}
		},
		render:function(){
			this.container=IUI.makeUI(this.template, this.options.viewmodel);
			this.$el=this.container.$element;
			this.trigger('render');
		},
		bindModels: function(){
			IUI.ContainerUI.prototype.bindModels.apply(this,arguments);
			if(typeof this.options.viewmodel === 'undefined'){
				this.options.viewmodel = this.options.model;
				this._modelReady = true;
				this._honorViewPromise();
			}if(typeof this.options.viewmodel == 'string'){
				if(this.options.viewmodel.match(IUI._observableRegex)){
					return;
				}else if(!this.bound){
					IUI.ViewModel.bindView(this.options.viewmodel, this);
					this.bound=true;
				}
			}else if(typeof this.options.viewmodel == 'object'){
				this._modelReady = true;
				this._honorViewPromise();
			}
		},
		_bindViewModel: function(viewModel){
			viewModel.boundViews.push(this);
			this.options.viewmodel = viewModel.model;
			this._modelReady = true;
			this._honorViewPromise();
		},
		makeUI: function(){
			if($(this.element).parent().length)
				this.element.outerHTML='<span class="ghost-span"></span>';
			this.element=null;
		},
		destroy: function(){
			this.container.destroy();
			this.container.$element.remove();
			this.container=null;
			this.$el=null;
			this.bound=false;
		}
		
	});
	
	
	IUI.View = function(options){
		this._initialize(options);
	}
	
	IUI.View.prototype._initialize = function(options){
		this.template = options.template;
	}
	
	
	IUI.View.prototype._initialize = function(options){
		this.template = options.template;
	}
	
	IUI.View.getView = function(viewName){
		if(typeof viewName === 'object'){
			if(viewName.constructor === View){
					return viewName;
			}else{
				return;
			}			
		}
		
		var _name=viewName.split(':'),
			name = _name[0],
			context = _name[1];
			
		return viewContexts[context || 'default'].view[name];	
	}
	IUI.View.getViewport = function(viewportName){
		
		if(typeof viewportName === 'object'){
			if(viewportName.constructor === IUI.uiContainers.Viewport){
				return viewportName;
			}else{
				return;
			}
		}
		
		var _name=viewportName.split(':'),
			name = _name[0],
			context = _name[1];
			
		return viewContexts[context || 'default'].viewport[name];	
	}
	
	IUI.View.registerViewport = function(viewport){
		var context = viewport.options.context,
			name = viewport.options.name;
			
		if(name){
			viewContexts[context].viewport[name]=viewport;	
		}
	}
	
	IUI.View.getName = function(view){
		if(view.options.name){
			return view.options.name + ':' +view.options.context;
		}else{
			return view._uid;
		}
	}
	
	
	IUI.View.renderViewInViewport = function(view , viewport){
		_view = IUI.View.getView(view);
		_viewport = IUI.View.getViewport(viewport);
		if(_view && _view._modelReady){
			if(!_view.$el){
				_view.render();
			}
			if(_viewport){
				_viewport.$element.children().detach();
				_viewport.$element.append(_view.$el);
				_viewport._currentView=_view;
				_view.trigger('append');
			}
		}else if(_view){
			viewPromiseMap[IUI.View.getName(_view)] = viewport;
		}else{
			if(typeof view === 'string'){
				var _name=view.split(':'),
					name = _name[0],
					context = _name[1] || 'default';
				}
			viewPromiseMap[name+':'+context] = viewport;
		}
		
	}
	
	
	
	
	IUI.WidgetBuilder.plugin(View);

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Exhibit',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Exhibit=IUI.uiContainers.Container.extend({
		name:'Exhibit',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-exhibit'])
	});
	
	IUI.WidgetBuilder.plugin(Exhibit);


});
(function (factory) {
  if(typeof define === "function" && define.amd) {    
	define('Viewport',['IUI-core','Exhibit', 'View'],factory);
  } else {
    factory(window.IUI);
  }
})(function(IUI){



	var Viewport = IUI.uiContainers.Exhibit.extend({
		name: 'Viewport',
		classList: IUI.uiContainers.Exhibit.prototype.classList.concat(['i-ui-Viewport']),
		options:{
			context : 'default',
			destroyViews : false
		},
		initialize: function(options){
			IUI.uiContainers.Exhibit.prototype.initialize.apply(this, arguments);
			IUI.View.registerViewport(this);
			this.oldViews={};
			if(this.options.defaultview){
				IUI.View.renderViewInViewport(this.options.defaultview, this);
			}
		}

	});
	

	
	IUI.WidgetBuilder.plugin(Viewport);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ViewModel',['IUI-core','DataItem','Validator'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var bindViewModel=function(viewModel){
		var name=viewModel.name;
		if(ViewModel._viewBindings[name] && ViewModel._viewBindings[name].length){
			var length=ViewModel._viewBindings[name].length;
			for(var i=0;i<length;++i){
				ViewModel._viewBindings[name][i](viewModel.model);
			}
			if(viewModel.persist){
				ViewModel._modelBindings[name]=viewModel;
				ViewModel._viewBindings[name]=[];
			}else{
				delete ViewModel._viewBindings[name];
			}
		}else{
			ViewModel._modelBindings[name]=viewModel;
		}
	}
	
	var ViewModel=IUI.Class.extend({
		classType: 'ViewModel',
		options:{
			persist: true
		},
		initialize: function(options){
			this.boundViews=[];
			this.persist=options.persist;
			this.name=options.name;
			this.model=options.model;
			bindViewModel(this);
		},
		updateModel: function(_newModel){
			if(this.model.__update){
				this.model.__update(_newModel);
			}else{
				this.model=_newModel;
				this.boundViews.forEach(function(view){
						view.options.viewmodel=_newModel;
				});
			}
		}
	});
	
	ViewModel.bindView=function(name,view){
		
		if(ViewModel._modelBindings[name]){
			view._bindViewModel(ViewModel._modelBindings[name]);
			if(!ViewModel._modelBindings[name].persist){
				delete ViewModel._modelBindings[name];
			}
		}else{
			if(!ViewModel._viewBindings[name]){
				ViewModel._viewBindings[name]=[]
			}
			ViewModel._viewBindings[name].push(view._bindViewModel.bind(view));		
		}
	}
	
	ViewModel._modelBindings={};
	
	ViewModel._viewBindings={};

	IUI.ViewModel=ViewModel;
});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Sidebar',['IUI-core','Container','Layout'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Sidebar=IUI.uiContainers.Layout.extend({
		name:'Sidebar',
		classList: IUI.uiContainers.Layout.prototype.classList.concat(['i-ui-sidebar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-sidebar-subcontainer']),
		_observedOptions:['width'],
		initialize: function(options){
			if($(options.element).index() === ($(options.container).children().length -1 ) ){
				this.options.position = 'right';
			}
			IUI.uiContainers.Layout.prototype.initialize.apply(this, arguments);
			
		},
		options: {
			width: '10em',
			position: 'left'
		},
		_handlewidthChange:function(value){
			$(this.subcontainer).css('padding-'+this.options.position,value);
		},
		_appendSubContainer: function(){
			this.$element.before(this.subcontainer);
			this.$element.addClass('i-ui-'+this.options.position+'-sidebar')
		},
		processSubcontainer:function(subcontainer){
			$(subcontainer).css('padding-'+this.options.position,this.options.width);
		}
	});
	
	IUI.WidgetBuilder.plugin(Sidebar);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Grid',['IUI-core','DataBoundContainer'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Grid=IUI.uiContainers.DataBoundContainer.extend({
		name:'Grid',
		tagName: 'div',		
		classList: ['i-ui-grid'],
		options:{
			sortable: false,
			scrollable: false
		},
		load: function(options){
			options.sortable=options.sortable === 'true';
		},
		_getHeaderTemplate: function(elem){
			var headerPrefix='',
				headerSufix='',
				headerTag='HeaderCell',
				classList=['i-ui-grid-header'];
				
			if((elem.attributes.sortable?(elem.attributes.sortable.value === 'true'):this.options.sortable)){
				headerTag='ContainerHeaderCell';
				headerSufix='</division><div class="i-ui-sort-icon-container"><i class="sort-arrow-desc fa fa-arrow-up"></i><i class="sort-arrow-asc fa fa-arrow-down"></div></i>'
				headerPrefix='<division>'
				classList.push('i-ui-sortable');
			}
			return '<'+headerTag+' '+(elem.attributes.field?('field=\''+elem.attributes.field.value+'\''):'')+' class=\''+classList.join(' ')+'\'>'+headerPrefix+(elem.attributes.title?elem.attributes.title.value:'')+headerSufix+'</'+headerTag+'>';
		},
		_extractRowTemplate: function(){
			var columns=this.element.getElementsByTagName('column'),
				headerTemplate = '<row class="i-ui-grid-thead">',
				rowTemplate = '<row class="i-ui-grid-tbody">',
				cols='',
				that=this;

			Array.prototype.slice.call(columns).forEach(function(elem){
				var col=$('<col></col>');
				if($(elem).attr('width')){
					col.css('width',$(elem).attr('width'));
					$(elem).attr('width',null);
				}
				headerTemplate = headerTemplate+that._getHeaderTemplate(elem);
				if(elem.innerHTML.indexOf('<')!==0){
					rowTemplate = rowTemplate+elem.outerHTML.replace(/title="(.*?)"/g,'').replace(/column/g,'Cell');
				}else{
					rowTemplate = rowTemplate+elem.outerHTML.replace(/title="(.*?)"/g,'').replace(/column/g,'ContainerCell');
				}
				cols=cols+col[0].outerHTML;
				elem.outerHTML='';
				that.hasConfig = true;
			});
			this.headerTemplate = headerTemplate + '</row>'
			this.rowTemplate = rowTemplate + '</row>'
			this.cols=$('<colgroup>'+cols+'</colgroup>');
			
		},
		onDataFetch: function(dataObject){
			var _length=dataObject.data.length;
				items=[];
			for(var i=0;i<_length;++i){
				var _item=dataObject.data[i].__items || IUI.makeUI(this.rowTemplate,dataObject.data[i]);
				dataObject.data[i].__items = _item;
				this.tbody.append(_item.$element);
				items.push(_item);
			}
			this.items=items;
		},
		onDataChange: function(dataObject){
			
			if(dataObject.type==="add"){
				var _item=dataObject.item.__items || IUI.makeUI(this.rowTemplate,dataObject.item);
				if(typeof dataObject.index ==='undefined'){
					dataObject.item.__items = _item;
					this.tbody.append(_item.$element);
					this.items.push(_item);
				}else{
					this.tbody.children().eq(dataObject.index).after(_item.$element);
					this.items.splice(dataObject.index,0,_item);	
				}
			}else if(dataObject.type==="remove"){
				this.tbody.children().eq(dataObject.index).remove();				
			}else{
				this._cleanUp();
				this.onDataFetch(dataObject);
			}
		},
		_cleanUp: function(){
			this.tbody.children().detach();
		},
		makeUI: function(){
			this._extractRowTemplate();
			IUI.uiContainers.DataBoundContainer.prototype.makeUI.apply(this,arguments);
			if(this.hasConfig){
				this.$element.children().remove();
				if(this.options.scrollable == 'true'){
					this.element.innerHTML='<div class="i-ui-grid-thead-container"><table>'+this.cols[0].outerHTML+'<thead></thead></table></div><div class="i-ui-grid-tbody-container"><table>'+this.cols[0].outerHTML+'<tbody></tbody></table></div>'
				}else{
					this.element.innerHTML='<table>'+this.cols[0].outerHTML+'<thead></thead><tbody></tbody></table></div>'
				}
				this._header=IUI.makeUI(this.headerTemplate,this.options.model);
				this.$element.find('thead').append(this._header.$element);
				this.tbody=this.$element.find('tbody');
			}
		},
		sort: function(sortObject){
			if(this.dataMart){
				console.time('sort');
				this.dataMart.sort(sortObject);
				console.timeEnd('sort');
				this._sortObject=sortObject;
			}
		},
		_handleSortClick: function(e){
			
				this._sortObject=this._sortObject || [];
			var sortDesc;
			
			if($(e.target).hasClass('sort-arrow-desc')){
				sortDesc=true;
			}else if($(e.target).hasClass('sort-arrow-asc')){
				sortDesc=false;
			}

			var _field=$(e.currentTarget).closest('th').data('field');

			if(e.currentTarget.sortDesc==sortDesc){	
				this._sortObject.splice(this._sortObject.indexOf(e.currentTarget.sortObject),1);
				e.currentTarget.sortObject=null;
				e.currentTarget.sortDesc=null;	
			}else{
				e.currentTarget.sortDesc=sortDesc;
				e.currentTarget.sortObject = e.currentTarget.sortObject || this._sortObject[this._sortObject.push({field:_field}) - 1];
				e.currentTarget.sortObject.desc=sortDesc;
			}
			
			this.sort(this._sortObject.slice());			
			
			
		},
		_attachEvents: function(){
			IUI.uiContainers.DataBoundContainer.prototype._attachEvents.apply(this,arguments);
			if(this.options.sortable){
				this.$element.on('click','.i-ui-sort-icon-container',this._handleSortClick.bind(this))
			}
		}
		
	});
	
	IUI.WidgetBuilder.plugin(Grid);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Navbar',['IUI-core','Container','Layout'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Navbar=IUI.uiContainers.Layout.extend({
		name:'Navbar',
		classList: IUI.uiContainers.Layout.prototype.classList.concat(['i-ui-navbar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-navbar-subcontainer']),
		_observedOptions: ['height'],
		_handleheightChange:function(value){
			$(this.subcontainer).css('padding-top',value);
		},
		processSubcontainer:function(subcontainer){
			$(subcontainer).css('padding-top',this.options.height);
		}
	});
	
	IUI.WidgetBuilder.plugin(Navbar);
	IUI.WidgetBuilder.alias('Navbar','Header')

});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Footer',['IUI-core','Container','Navbar'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){


	var Footer=IUI.uiContainers.Layout.extend({
		name:'Footer',
		classList: IUI.uiContainers.Layout.prototype.classList.concat(['i-ui-footer']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-footer-subcontainer']),
		_observedOptions: ['height'],
		_handleheightChange:function(value){
			$(this.subcontainer).css('padding-bottom',value);
		},
		processSubcontainer:function(subcontainer){
			$(subcontainer).css('padding-bottom',this.options.height);
		}
	});

	
	IUI.WidgetBuilder.plugin(Footer	);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Overlay',['IUI-core'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var overlayContainer,overlayUid=1;
		overlayContainer=document.createElement('DIV');
		$(overlayContainer).addClass('i-ui-overlay-container');
		document.body.appendChild(overlayContainer);
		
		
	var Overlay=IUI.Class.extend({
		classType: 'Overlay',
		classList: ['i-ui-overlay','i-ui-hidden'],
		initialize: function(options){
			var that=this;
			that._initPromise = $.Deferred();
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this._uid='_uid'+(overlayUid++);
			this.hide=this.hide.bind(this);
			this.open=this.open.bind(this);
			this.close=this.close.bind(this);
			this.options.animateObjectOpen.height=this.options.height || this.options.animateObjectOpen.height;
			this.contents=this.options.contents;
			this._initialPopupStyle=IUI.behaviors.filterStyleFromObject(this.options);
			this._initialPopupStyle.height=0;
			this._initialPopupStyle.display='block';
			this.options.animateObjectClose.height=this.options.animateObjectClose.height || 0;
			if(typeof this._initialPopupStyle.width === "undefined" ){
					this._anchorWidth=true;
			}
			this.clientRectSet=!!this.options.clientrectangle;
			
			setTimeout(function(){
				that.createOverlay();
				that._attachEvents();
				that._initPromise.resolve();
				delete that._initPromise;
			});	
		},
		events: ['opening','open','close','closing'],
		options:{
			lazy: false,
			anchor:'body',
			direction: 'down',
			placement: 'bottom',
			height: '2em',
			classList:[],
			button: null,
			buttonBehavior: 'click',
			animateObjectClose:{},
			animateObjectOpen:{},
			autoclose: true,
			clientrectangle: null,
			pointeropening: null
		},
		setClientRectangle: function(clientrectangle){
			this.options.clientrectangle=clientrectangle
			this.clientRectSet=!!clientrectangle;
			
		},
		_processInitialPopupStyle:function(){
			
			if(this.clientRectSet){
				_rect=this.options.clientrectangle;
			}else{
				var $anchor=$(this.options.anchor);
				if($anchor.length===0) $anchor=$('body');
				var _anchor=$anchor[0], _rect=_anchor.getClientRects();
			}
			
			var direction=this.options.direction;
			
			if(_rect.length){
				var rect=_rect[0];
				var placements=this.options.placement.split(' ');
				var _placeVertical = placements[0] || 'center';
				var _placeHorizontal = placements[1] || 'center';
					if(_placeVertical==="top"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.top;
						}else{
							this._initialPopupStyle.bottom=$(window).innerHeight()	-  rect.top;
						}
					}else if(_placeVertical==="bottom"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.bottom;
						}else{
							this._initialPopupStyle.bottom=$(window).innerHeight()	 - rect.bottom;
						}						
					}else if(_placeVertical==="center"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.top - rect.width/2;
						}else{
							this._initialPopupStyle.bottom=rect.top - rect.width/2;
						}						
					}else{
						this._initialPopupStyle.left=_placeVertical;
					}
					
					if(!this.options.width){
						this._initialPopupStyle.width=rect.width-2;
					}

					
					if(_placeHorizontal === "right"){
						this._initialPopupStyle.left=rect.right;
					}else if(_placeHorizontal === "left"){
						this._initialPopupStyle.right=$(window).innerWidth() - rect.left;
					}else if(_placeHorizontal === "center"){
						this._initialPopupStyle.left=rect.left + rect.width/2;
					}else{
						this._initialPopupStyle.left=_placeHorizontal;
					}
					
					if(this.options.pointeropening){
						if(this.options.pointeropening === "flip"){
							
								if(_placeHorizontal === "left"){
								this._initialPopupStyle.right = this._initialPopupStyle.right - this._initialPopupStyle.width;
							}else if(_placeHorizontal === "center"){
								this._initialPopupStyle.left = this._initialPopupStyle.left - this._initialPopupStyle.width;
							}
							
						}else if(this.options.pointeropening === "center"){
							
							if(_placeHorizontal === "left"){
								this._initialPopupStyle.right = this._initialPopupStyle.right - this._initialPopupStyle.width/2;
							}else if(_placeHorizontal === "center"){
								this._initialPopupStyle.left = this._initialPopupStyle.left - this._initialPopupStyle.width/2;
							}
							
						}
					
						
					}
			}	
		},
		bindButton: function(button,behavior){
			var $button=$(button)
			if($button.length){
				var events;
				if(behavior==='click'){
					events='click';
				}else if(behavior==='hover'){
					events='mouseover';
				}
				$button.on(events,this.open);
			}
		},
		open: function(){
			if(this._popupOpen){
				return;
			}
			this._processInitialPopupStyle();
			$(this.element).css(this._initialPopupStyle);
			if(!this._isAttached){
				$(overlayContainer).append(this.element);
				this._isAttached=true;
			}
			this.show();
			this._popupOpen=true;
			this.trigger('opening');
			$(this.element).animate(this.options.animateObjectOpen,300,function(){
				this.trigger('open');
				if(this.options.autoclose){
					$('html').off('mouseup.'+this._uid);
					$('html').one('mouseup.'+this._uid,this.close);
				}
			}.bind(this));
		},
		show: function(){
			$(this.element).removeClass('i-ui-hidden');
		},
		hide: function(){
			$(this.element).addClass('i-ui-hidden');
		},
		closeImmediate: function(e){
			if(!this._popupOpen || (e && $(e.target).is(this.element))){
				$('html').off('mouseup.'+this._uid);
				$('html').one('mouseup.'+this._uid,this.close);
				return;
			}
			this.trigger('closing');
			$(this.element).css(this.options.animateObjectClose);
			this.trigger('close');
			this.hide();
			this._popupOpen=false;
		},
		close: function(e){
			if(!this._popupOpen || (e && $(e.target).is(this.element))){
				$('html').off('mouseup.'+this._uid);
				$('html').one('mouseup.'+this._uid,this.close);
				return;
			}
			var that=this;
			this.trigger('closing');
			$(this.element).animate(this.options.animateObjectClose,300,function(){
				that.trigger('close');
				that.hide();
				that._popupOpen=false;
			});
		},
		setContents: function(contents){
			this.contents=contents;
			var _element=$(this.contents).detach();
			this.element.innerHTML=''
			_element.appendTo(this.element);
			
		},
		_attachEvents:function(){
			this.bindButton(this.options.button,this.options.buttonBehavior);
			
		},
		createOverlay: function(){
			this.element=document.createElement('DIV');
			if(this.contents){
				$(this.contents).before($('<span class="ghost-span">'));
				var _element=$(this.contents).detach();
				_element.appendTo(this.element);
				this.contents = IUI.makeUI(this.element, this.options.model);
			}
			$(this.element).addClass(this.classList.concat(this.options.classlist));
			this.element.uiOverlay=this;
			this.height=this.options.height;
			if(!this.options.lazy){
				$(overlayContainer).append(this.element);
				this._isAttached=true;
			}
		}		
	});
	
	
	IUI.createOverlay=function(options){
		return new Overlay(options);
	}


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('InputBox',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var InputBox=IUI.Widget.extend({
		name:'InputBox',
		template: '<input class="i-ui-input"></input>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-inputbox']),
		events:IUI.Widget.prototype.events.concat(['change']),
		options:{
			validateoninput: true,
			validateonblur: true,
			value:'',
			type: 'text'
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
		load: function(options){
			IUI.Widget.prototype.load.apply(this,arguments);
			(options.validateoninput) && (options.validateoninput=JSON.parse(options.validateoninput));
			(options.validateonblur) && (options.validateonblur=JSON.parse(options.validateonblur));
			if(typeof options.validateoninput === "undefined"){
				this.boundModelOptions.shouldValidate=this.options.validateoninput;
			}else{
				this.boundModelOptions.shouldValidate=options.validateoninput;
			}
		},
		onInitialize: function(){		
			IUI.Widget.prototype.onInitialize.apply(this,arguments);
			this._attachEvents();
			this.value(this.options.value);
		},
		onTemplateAttach:function(wrapper){
			this.input=$(wrapper.children[0]);
			this.input.attr('type',this.options.type);
		},
		_attachEvents: function(){
			var that=this;
			
				$(this.input).on('input',function(e){
					if(that.options.validateoninput && !that._validate(e.target.value).valid){
						e.target.value=that.options.value;
						e.stopImmediatePropagation();
						e.preventDefault();
						return false;
					}else{
						that.options.value=e.target.value;
					}
				});
			$(this.input).on('change',IUI.behaviors.delegateDOMEvent.bind(this));
		},
		value: function(val){
			if(typeof val !== 'undefined'){	// && this._validate(val).valid
				this.options.value=val;
				return this.input.val(val);
			}
			return this.input.val();
		}
	});
	
	IUI.WidgetBuilder.plugin(InputBox);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Button',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Button=IUI.Widget.extend({
		name:'Button',
		template: '<span class="i-ui-noselect"></span>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-button']),
		events:IUI.Widget.prototype.events.concat(['click']),
		options:{
			text: 'Button',
		},
		initialize: function(options){
			(options.text) || (options.text=(options.element && options.element.innerHTML) || this.options.text);
			IUI.Widget.prototype.initialize.apply(this,arguments);			
			this._attachEvents();
		},
		_handletextChange: function(value){
			this.element.children[0].innerHTML=value;
		},
		_processOptions: function(wrapper){
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
			wrapper.children[0].innerHTML=this.options.text;
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('click',IUI.behaviors.delegateDOMEvent.bind(this));
		},
		value: function(val){
			return this.options.text;
		}
	});
	
	IUI.WidgetBuilder.plugin(Button);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Cell',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){	
	
	var Cell=IUI.Widget.extend({
		name:'Cell',
		tagName: 'TD',
		classList: ['i-ui-cell'],
		load: function(options){
			IUI.Widget.prototype.load.apply(this,arguments);		
			options.value=(options.element && options.element.innerHTML) || options.template || (options.field?'::'+options.field+'::':(new Error('No Field Value to bind with')));			
		},
		_processOptions: function(wrapper){
			wrapper.innerHTML=this.options.value;
			delete this.options.text;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		options:{
			text: ''
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(Cell);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Division',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Division=IUI.Widget.extend({
		name:'Division',
		classList: ['i-ui-div'],
		load: function(options){
			if(options.tagname){
				this.tagName=options.tagname;
			}
			options.value=(options.element && options.element.innerHTML);
			IUI.Widget.prototype.load.apply(this,arguments);
		},
		_processOptions: function(wrapper){
			wrapper.innerHTML=this.options.value;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(Division);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('HeaderCell',['IUI-core','Cell'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){
	
	var HeaderCell=IUI.uiWidgets.Cell.extend({
		name:'HeaderCell',
		tagName: 'Th',
		classList: IUI.uiWidgets.Cell.prototype.classList.concat(['i-ui-header-cell']),
		load: function(options){
			options.value=(options.element && options.element.innerHTML) || options.template || options.field || '';
			IUI.Widget.prototype.load.apply(this,arguments);		
		},
		_processOptions: function(wrapper){
			wrapper.innerHTML=this.options.value;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		}
	});
	
	IUI.WidgetBuilder.plugin(HeaderCell);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ContainerCell',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){	
	
	var ContainerCell=IUI.uiContainers.Container.extend({
		name:'ContainerCell',
		tagName: 'TD',
		classList: ['i-ui-cell']
	});
	
	IUI.WidgetBuilder.plugin(ContainerCell);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ContainerHeaderCell',['IUI-core','Container','Cell'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){	
	
	var ContainerHeaderCell=IUI.uiContainers.Container.extend({
		name:'ContainerHeaderCell',
		tagName: 'TH',
		classList: IUI.uiWidgets.Cell.prototype.classList.concat(['i-ui-header-cell']),
		makeUI: function(){
			IUI.uiContainers.Container.prototype.makeUI.apply(this,arguments);
			this.$element.data('field', this.options.field);
		}
	});
	
	IUI.WidgetBuilder.plugin(ContainerHeaderCell);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ListView',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var ListView=IUI.Widget.extend({
		name:'ListView',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-listview']),
		ignoredAttributes: ['template'],
		onDataFetch:function(dataObject){
			var _length=dataObject.data.length, options=this.options, container= this.container;
				items=[];
			requestAnimationFrame(function(){
				for(var i=0;i<_length;++i){
					var _item=IUI.makeUI(options.template,dataObject.data[i]);
					container.append(_item.$element);
					items.push(_item);
				}				
			});
			
			this.items=items;
		},		
		onDataChange: function(dataObject){
			if(dataObject.type==="add"){
				var _item=IUI.makeUI(this.options.template,dataObject.item);
				if(typeof dataObject.index ==='undefined'){
					this.container.append(_item.$element);
					this.items.push(_item);
				}else{
					this.container.children().eq(dataObject.index).after(_item.$element);
					this.items.splice(dataObject.index,0,_item);	
				}
			}else if(dataObject.type==="remove"){
				this.container.children().eq(dataObject.index).remove();				
			}else{
				this._cleanUp();
				this.onDataFetch(dataObject);
			}
		},
		onTemplateAttach: function(element){
			IUI.Widget.prototype.onTemplateAttach.apply(this,arguments);	
			this.container = this.containerSelector?$(element).find(this.containerSelector):$(element);
		},
		_processOptions: function(wrapper){
			if(!this.options.template){
				this.options.template=(this.element && this.element.innerHTML);
				this.options.template='<container class="'+this.options.listclass+'">'+this.options.template+'</container>';
			}
			
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		_cleanUp: function(){
			this.container.children().detach();
		},
		options:{
			text: '',
			listclass: 'i-ui-list-item'
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(ListView);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('PageListView',['IUI-core','ListView'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
	var PageListView=IUI.uiWidgets.ListView.extend({
		name:'PageListView',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-page-listview']),
		template: '<div class="i-ui-page-container"></div>',
		containerSelector: '.i-ui-page-container',
		initialize: function(options){
			var container=$();
			$(options.element).append(container);
			options.container=container;
			IUI.uiWidgets.ListView.prototype.initialize.apply(this, arguments);
			this.$element.append('<i class="fa fa-caret-right i-ui-icon scroll-right"></i>');
			this.$element.prepend('<i class="fa fa-caret-left i-ui-icon scroll-left"></i>');	
			this._attachEvents();
		},
		options:{
			text: '',
			listclass: 'i-ui-page-list-item'
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
		_scrollRight: function(){
			var _scrollLeft = this.container.scrollLeft(),
				width=0,
				first = this.container.children().eq(0);
				
				while(width <  _scrollLeft){
					width = width + first.outerWidth(true);
					first = first.next();
				}

				this.container.scrollLeft(width + first.outerWidth(true));

		},
		_scrollLeft: function(){
			var _scrollLeft = this.container.scrollLeft(),
				_scrollWidth = this.container.width(),
				width=0,
				last = this.container.children().eq(0);
				
				while(width <  _scrollLeft + _scrollWidth){
					width = width + last.outerWidth(true);
					last = last.next();
				}
				
				if(!last.length){
					this.container.scrollLeft(_scrollLeft - this.container.children().eq(this.container.children().length - 1).outerWidth(true));	
				}else{					
					var offset = (_scrollLeft + _scrollWidth) - width + last.prev().outerWidth();
					this.container.scrollLeft(_scrollLeft - offset);
				}
		},
		_attachEvents: function(){
			var that=this;
			
			this.$element.find('.scroll-right').on('click', function(){
				that._scrollRight();
			});
			this.$element.find('.scroll-left').on('click', function(){
				that._scrollLeft();
			});
		}
	});
	
	IUI.WidgetBuilder.plugin(PageListView);



});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Switch',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Switch=IUI.Widget.extend({
		name:'Switch',
		template: '<div class="i-ui-switch-button"></div>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-switch']),
		events:IUI.Widget.prototype.events.concat(['click','toggle']),
		options:{
			value: false
		},
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);		
			this.button=this.$element.find('.i-ui-switch-button');
			this._attachEvents();
			this.value(this.options.value);
		},
		_handleClick: function(e){
			if(this.$element.hasClass('i-ui-switch-active')){
				this.options.value=false;
				this.$element.removeClass('i-ui-switch-active');
				
			}else{
				this.options.value=true;
				this.$element.addClass('i-ui-switch-active');				
			}
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('click','.i-ui-switch-button',this._handleClick.bind(this));
		},
		_handlevalueChanle: function(val){
			return this.value(val);
		},
		value: function(val){
			if(typeof val === "undefined"){
				return this.$element.hasClass('i-ui-switch-active');
			}else{
				this.$element.toggleClass('i-ui-switch-active',val);
				this.options.value=val;
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(Switch);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Slider',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Slider=IUI.Widget.extend({
		name:'Slider',
		template: '<div class="i-ui-slider-bar"></div><div class="i-ui-slider-button"></div>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-slider']),
		events:IUI.Widget.prototype.events.concat(['change']),
		options:{
			min: 0,
			max: 255,
			value: 0,
			step: 1
		},
		load: function(options){
			(options.min) && (options.min=Number(options.min));
			(options.max) && (options.max=Number(options.max));
			(options.step) && (options.step=Number(options.step));
			
		},
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);		
			this.button=this.$element.find('.i-ui-slider-button');
			this.sliderY=0;
			this._attachEvents();
		},
		_handleMouseDown: function(e){
			this.buttonWidth=this.button.outerWidth();
			this.sliderWidth=this.$element.width();
			this.elementMinX=this.element.offsetLeft;
			this.$element.addClass('i-ui-active');
			this.elementMaxX=this.elementMinX+this.element.offsetWidth;
			if(!this._sliding){
				this._sliding=true;
				$('body').on('mousemove.slider',this._handleMouseMove.bind(this));
				$('body').on('mouseup.slider',this._handleMouseUp.bind(this));
			}		
		},
		_handleMouseMove: function(e){			
			var that=this;
			
			if(this._mouseExceedCondition) return;
			
			var actualMovement=(this.sliderWidth-this.buttonWidth), movementRatio=(actualMovement/this.sliderWidth), movementX=e.originalEvent.movementX, actualValues=(this.options.max-this.options.min) ;
			
			var deltaValue=(movementX/this.sliderWidth)*actualValues;
			
			
			this.sliderY=this.sliderY+movementX;
			var value=Math.floor(((this.sliderY-(this.buttonWidth/2))/actualMovement)*actualValues);;
			if(value<this.options.min){
				value=this.options.min;
			}else if(value>this.options.max){
				value=this.options.max;
			}
			this.options.value=value;
			console.log(this.options.value);
			
			if(this.sliderY>(this.sliderWidth - Math.floor(this.buttonWidth/2))){
				this.sliderY=(this.sliderWidth - this.buttonWidth/2);
				this.$element.one('mouseover.slider','.i-ui-slider-button',function(){
					that._mouseExceedCondition=false;
				});
				this._mouseExceedCondition=true;
			}
			if(this.sliderY<Math.floor(this.buttonWidth/2)){
				this.sliderY=this.buttonWidth/2;
				this._mouseExceedCondition=true;
				this.$element.one('mouseover.slider','.i-ui-slider-button',function(){
					that._mouseExceedCondition=false;
				});
			}
			$(this.button).css('left',this.sliderY);			
		},
		_handleMouseUp: function(e){
			if(this._sliding){
				this._sliding=false;
				$('body').off('mousemove.slider');				
				$('body').off('mouseup.slider');
				this.$element.removeClass('i-ui-active');
			}
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('mousedown','.i-ui-slider-button',this._handleMouseDown.bind(this));
			this.$element.on('mouseup.slider','.i-ui-slider-button',this._handleMouseUp.bind(this));
			
		},
		value: function(val){
			if(typeof val === "undefined"){
				return this.$element.hasClass('i-ui-slider-active');
			}else{
				this.$element.toggleClass('i-ui-slider-active',val);				
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(Slider);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ToggleButton',['IUI-core','Button'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var ToggleButton=IUI.uiWidgets.Button.extend({
		name:'ToggleButton',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-button','i-ui-togglebutton']),
		events:IUI.Widget.prototype.events.concat(['click','toggle']),
		options:{
			text: 'ToggleButton',
		},
		toggle: function(value){
			this.$element.toggleClass('i-ui-active',value);
			this.options.value = this.$element.hasClass('i-ui-active');
			this.trigger('toggle',{value:this.value()});
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
		_attachEvents: function(){
			var that=this;
			
			var _delegateEvent=IUI.behaviors.delegateDOMEvent.bind(this);
			
			this.$element.on('click',function(e){
				that.toggle();
				_delegateEvent(e);
			});
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				val=JSON.parse(val);
				this.$element.toggleClass('i-ui-active',val);
			}else{
				return this.$element.hasClass('i-ui-active');
			}
		}
	});
	
	IUI.WidgetBuilder.plugin(ToggleButton);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('SubmitButton',['IUI-core','Button'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var SubmitButton=IUI.uiWidgets.Button.extend({
		name:'SubmitButton',
		template: '<span class="i-ui-noselect"></span><button style="display:none;"></button>',
		options:{
			text: 'Submit',
		},
		_attachEvents: function(){
			var that=this;
			var _delegateEvent=IUI.behaviors.delegateDOMEvent.bind(this)
			this.$element.on('click',function(e){
				_delegateEvent(e);
				e.stopPropagation();
				$(that.element.children[1]).trigger(e);
			});
		},
		value: function(val){
			return this.options.text;
		}
	});
	
	IUI.WidgetBuilder.plugin(SubmitButton);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('FormLabel',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var FormLabel=IUI.Widget.extend({
		name:'FormLabel',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-formlabel']),
		load: function(options){
			options.value=(options.element && options.element.innerHTML) || options.text;
			IUI.Widget.prototype.load.apply(this,arguments);		
		},
		_processOptions: function(wrapper){
			wrapper.innerText=this.options.value;
			delete this.options.text;
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
		},
		options:{
			text: ''
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				return this.element.innerHTML=val;
			}
			return this.element.innerHTML;
		},
		_handlevalueChange: function(value){
			this.value(value);
		},
	});
	
	IUI.WidgetBuilder.plugin(FormLabel);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Radio',['IUI-core','Widget'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Radio=IUI.Widget.extend({
		name:'Radio',
		template: '<input type="radio" class="i-ui-radio-button"></input>',
		classList: IUI.Widget.prototype.classList.concat(['i-ui-radio']),
		options:{
			value: 'radio',
			checked:false
		},
		load: function(options){
			IUI.Widget.prototype.load.apply(this,arguments);
			options.text=options.text ||(options.element && options.element.innerHTML);
		},
		initialize: function(){
			this.options.checked=(this.options.checked===true || this.options.checked==="true" || this.options.checked==="checked");			
			IUI.Widget.prototype.initialize.apply(this,arguments);		
		},
		_handlevalueChange: function(val){
			this.input.value=val;
		},
		onTemplateAttach:function(wrapper){
			this.input=wrapper.children[0];
		},
		_processOptions: function(wrapper){
			IUI.Widget.prototype._processOptions.apply(this,arguments);
			this.labelcontainer=IUI.makeUI('<div><FormLabel text="'+this.options.text+'"></FormLabel></div>', this.options.model);
			$(wrapper).append(this.labelcontainer.widgets[0].$element);
			this.input.value=this.options.value;
			if(this.options.group){
				this.input.name=this.options.group
			}
			this.input.checked=this.options.checked;
		},
		checked: function(val){
			if(typeof val !== 'undefined'){
				return wrapper.children[0].checked=val;
			}
			return wrapper.children[0].checked;
		},
		value: function(val){
			if(typeof val !== 'undefined'){
					return this.input.value=val;
			}
			return this.input.value;
		}
	});
	
	IUI.WidgetBuilder.plugin(Radio);



});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('NumericInputBox',['IUI-core','InputBox'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var InputBox=IUI.uiWidgets.InputBox,
		SPINNERS_SELECTOR=".i-ui-spinner",		
		NumericInputBox=InputBox.extend({
			
			name:'NumericInputBox',
			
			template: '<input class="i-ui-input"></input><div class="i-ui-spinner-container"><div class="i-ui-spinner i-ui-spinner-up"><i class="i-ui-widget-icon fa fa-caret-up" aria-hidden="true"></i></div><div class="i-ui-spinner i-ui-spinner-down"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			
			classList: IUI.Widget.prototype.classList.concat(['i-ui-numericinputbox']),
			
			validationList: ['numeric'],
			
			initialize: function(){
				this._handleSpinStart=this._handleSpinStart.bind(this);	
				this._handleSpinEnd=this._handleSpinEnd.bind(this);		
				InputBox.prototype.initialize.apply(this,arguments);		
			},
			
			events: InputBox.prototype.events.concat(['spin']),
			
			options: {
				step: 1,
				value: 0,
				decimal: false,
				precision:2
			},			
			_handleSpinStart: function(e){
				var that=this, step=Number(this.options.step);
				
				if($(e.currentTarget).hasClass('i-ui-spinner-down')){
					step=-step;
				}				
				$(this.element).addClass('i-ui-active');
				if(this._interval){
					clearInterval(this._interval);
					delete this._interval;
				}
				this._interval=setInterval(function(){
					var value;
					value=that._formatNumber(Number(that.input.val())+step);
					that.input.val(value);
					that.trigger('spin',{value:value});
				},50);
			},
			_formatNumber: function(val){
				if(this.options.decimal){
					val=(val).toFixed(this.options.precision);
				}else{
					val=parseInt(val);
				}
				return val;
			},
			_handleSpinEnd:function(e){
				if(this._interval){
					clearInterval(this._interval);
					this.trigger('change',{value:Number(this.input.val())});
					this.options.value=this.input.val();
					this.$element.removeClass('i-ui-active');
					delete this._interval;
				}				
			},
			_attachEvents: function(){
				InputBox.prototype._attachEvents.apply(this,arguments);	
				this.$element.on('mousedown',SPINNERS_SELECTOR,this._handleSpinStart);
				this.$element.on('mouseup mouseleave',SPINNERS_SELECTOR ,this._handleSpinEnd);
			},
			value: function(val){
				if(typeof val !== "undefined"){
					val=this._formatNumber(Number(val));
				}				
				return  Number(InputBox.prototype.value.call(this,val));
			}
		});
	
	IUI.WidgetBuilder.plugin(NumericInputBox);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('ComboBox',['IUI-core','InputBox'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var InputBox=IUI.uiWidgets.InputBox,		
		Combobox=InputBox.extend({
			
			name:'Combobox',
			
			template: '<input tabindex="-1" class="i-ui-input"></input><div class="i-ui-dropbutton-container"><div class="i-ui-dropbutton"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			
			
			classList: IUI.Widget.prototype.classList.concat(['i-ui-combobox']),
			initialize: function(options){
				var _templateExtras='';
				if(options.datamart){
					$(options.element).removeAttr('datamart');
					_templateExtras=_templateExtras+' datamart="'+options.datamart+'" ';
					delete options.datamart;
				}
				if(options.data){
					$(options.element).removeAttr('data');
					_templateExtras=_templateExtras+' data="'+options.data+'" ';
					delete options.data;
				}
				
				this.tagTemplate ='<listview class="i-ui-dropdown-list" '+_templateExtras+'><division class="i-ui-option-item" ii-id="::'+(options.idfield||this.options.idfield)+'::">::'+(options.textfield||this.options.textfield)+'::</division></listview>'
				InputBox.prototype.initialize.apply(this,arguments);		
			},
			_createPopup:function(){
				var _elem=this.$element;
				this.popup=IUI.createOverlay({
					anchor: this.element,
					contents: this.tagTemplate,
					model: this.options.model,
					button: this.element.querySelector('.i-ui-dropbutton-container'),
					maxHeight: '15em',
					height: '15em',
					pointeropening: 'center',
					opening: function(){
						_elem.addClass('i-ui-active');
					},
					close: function(){
						_elem.removeClass('i-ui-active');
					}							
				});
			},
			onRender: function(){	
				this._createPopup();
			},
			options:{
				idfield: 'id',
				textfield: 'text',
			},
			_getDataMart: function(){
				return this.popup.contents.widgets[0].dataMart;
			},
			_attachEvents: function(){
				var that=this;
				InputBox.prototype._attachEvents.apply(this,arguments);
				this.popup._initPromise.then(function(){
					
					$(that.popup.element).on('click','.i-ui-list-item',function(e){
						var index=$(e.currentTarget).index(),
							dataMart=that._getDataMart();
						if(dataMart){
							that.value(dataMart.data[index][that.options.textfield]);
							that.trigger('change',{value:dataMart.data[index]});
						}
					});
				});
			},
		});
	
	IUI.WidgetBuilder.plugin(Combobox);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('DropDown',['IUI-core','ComboBox'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Combobox=IUI.uiWidgets.Combobox,		
		DropDown=Combobox.extend({
			name:'DropDown',
			classList: IUI.Widget.prototype.classList.concat(['i-ui-dropdown']),
			template: '<input tabindex="-1" class="i-ui-input" style="display:none;"><div tabindex="-1" class="i-ui-input i-ui-display"></div><div class="i-ui-dropbutton-container"><div class="i-ui-dropbutton"><i class="i-ui-widget-icon fa fa-caret-down" aria-hidden="true"></i></div></div>',
			value: function(val){
				if(typeof val !== 'undefined'){	// && this._validate(val).valid
					this.options.value=val;
					this.element.querySelector('.i-ui-display').innerText=val;
					return this.input.val(val);
				}
				return this.input.val();
			}

		});
	
	IUI.WidgetBuilder.plugin(DropDown);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Form',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Form=IUI.uiContainers.Container.extend({
		name:'IForm',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-form']),
		_beforeRender:function(){	
			this._widgetAttributeValueMap={};
		},
		_onCreateWidget: function(widget){
			if(widget.options.formattribute && typeof widget.value === "function" ){
				this._widgetAttributeValueMap[widget.options.formattribute]=widget.value.bind(widget);
			}
		},
		getJSON: function(){
			var _JSON={};
			for(var attribute in this._widgetAttributeValueMap){
				_JSON[attribute]=this._widgetAttributeValueMap[attribute]();
			}
			return _JSON;
		},
		setJSON: function(obj){
			for(var attribute in obj){
				if(this._widgetAttributeValueMap[attribute]){
					this._widgetAttributeValueMap[attribute](obj[attribute]);
				}
			}
		},
		value: function(obj){
			if(obj){
				return this.setJSON(obj);
			}
			return this.getJSON();
		}
	});
	
	IUI.WidgetBuilder.plugin(Form);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('RadioGroup',['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var RadioGroup=IUI.uiContainers.Container.extend({
		name:'RadioGroup',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-radiogroup']),
		options:{
			group: 'group',
			orientation: 'vertical'
		},
		events:['change'],
		_handlevalueChange:function(value){
			if(this.value()!==value)
				this.value(value);
		},
		_beforeRender:function(){
			var radios=this.element.querySelectorAll('Radio');
			for (var i = 0; i < radios.length; i++) {
				var item = radios[i];
					item.setAttribute('group',this.options.group);
			}
			this.group=this.options.group;	
			if(this.options.orientation==="vertical"){
				this.classList.push('i-ui-vertical-radiogroup');
			}else{
				this.classList.push('i-ui-horizontal-radiogroup');
			}
		},
		_afterRender: function(){
			if(this.options.value){
				this.value(this.options.value);
			}
			this._attachEvents();
		},
		_onCreate: function(widget){
			if(widget.options.formattribute && typeof widget.value === "function" ){
				this._widgetAttributeValueMap[widget.options.formattribute]=widget.value.bind(widget);
			}
		},
		value: function(val){
			var selectedRadio;
			if(typeof val !== "undefined"){
				selectedRadio=this.element.querySelector('input[value="'+val+'"]');
				if(selectedRadio){
					selectedRadio.checked=true;
					this.options.value=val;
				}
			}else{
				selectedRadio=this.element.querySelector(':checked');
				if(selectedRadio){
					return selectedRadio.value;
				}else{
					return null;
				}
			}
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('change','input',function(e){
				that.options.value=e.target.value;
				IUI.behaviors.delegateDOMEvent.call(that,e);
			});
		}
	});
	
	IUI.WidgetBuilder.plugin(RadioGroup);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('IUI',['IUI-core',
		'Behaviors',
		'WidgetBuilder',	
		'Validator',
		'ObservableModel',
		'Utils',
		'OptionModel',
		'ContainerModel',
		'DataBoundContainer',
		'Container',
		'VerticalScroller',
		'QuickSort',
		'Row',
		'Popover',
		'ContextMenu',
		'Layout',
		'View',
		'Viewport',
		'ViewModel',
		'Sidebar',
		'Grid',
		'Navbar',
		'Footer',
		'Widget',
		'ContainerUI',
		'Overlay',
		'InputBox',
		'Button',
		'Cell',
		'Division',
		'HeaderCell',
		'ContainerCell',
		'ContainerHeaderCell',
		'ListView',
		'PageListView',
		'Switch',
		'Slider',
		'ToggleButton',
		'SubmitButton',
		'FormLabel',
		'Radio',
		'NumericInputBox',
		'ComboBox',
		'DropDown',
		'Exhibit',
		'Form',
		'RadioGroup'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
	IUI.Validator.addRule('numeric',function(value){
		return !isNaN(Number(value));
	});
		
	IUI.Validator.addRule('email',function(value){
		var emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailExp.test(value);
	});
	
	IUI.Validator.addRule('noScript',function(value){
		var scriptExp = /(<|>)/g;
		return !scriptExp.test(value);
	});	
		
	IUI.makeUI=function makeUI(elem,model){
		var uiContainer;
		
		if(elem && (elem.constructor.toString() === ({}).constructor.toString() || elem.classType==="ObservableModel")){
			model=elem;
			elem=null;
		}
		if(model && model.classType!=="ObservableModel"){
			model=new IUI.ContainerModel(model);			
		}
		(elem) || (elem='body');
		var element=$(elem)[0];
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{
			element: element,
			model: model
		})
		if(typeof IUI.WidgetBuilder.containerList[element.tagName] !== "undefined"){		
			uiContainer=IUI.WidgetBuilder.containerList[element.tagName](element,null,options.model);
		}else{
			uiContainer= new IUI.ContainerUI(options);
			uiContainer.makeUI();	
		}
		return uiContainer;
	}
	
	var _extractAttribute=function(object,attribute){
		object[attribute.name]=attribute.value;
		return object;
	}
	
	IUI.makeUIAsync=function makeUI(elem,model){
		if(elem && (elem.constructor === Object || elem.classType==="ObservableModel")){
			model=elem;
			elem=null;
		}
		if(model && model.classType!=="ObservableModel"){
			model=new IUI.ContainerModel(model);			
		}
		(elem) || (elem='body');
		var element=$(elem)[0];
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{
			element: element,
			model: model,
			async: true
		})
		
		var uiContainer= new IUI.ContainerUI(options);		
		uiContainer.makeUI();
		return uiContainer;
	}
	
	
	return IUI;

});
