/*!
 * IUI JavaScript Web Framework Library v1.0.0
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
	
	IUIClass.prototype._observedOptions=['enable','isattached'];
	
	IUIClass.prototype.bindModels=function(boundOptions){
		this.__processOptionMapping();
		this.optionsModel=new IUI.OptionsModel(this.options,this._handleOptionChange.bind(this),this._observedOptions,boundOptions);
		if(this.options.model){
				IUI.ObservableModel.bindModels(this.optionsModel,this.options.model,this._optionModelMapping);
		}
	}
	
	IUIClass.prototype.__processOptionMapping=function(){
		var _mappings=IUI.behaviors.getObservableMapping(this.options),
			length=_mappings.length;
		if(length){
			for(var i=0;i<length;++i){
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
	
	IUI._observableRegex=/::.+::/g;
	
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
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{});
		options.element=element;	
		options.container=container;
		options.model=model;		
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
	
		
	IUI.WidgetBuilder=WidgetBuilder;
	
/* ------- END : IUI.WidgetBuilder.js -----------*/


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('DataMart',['IUI-core','WidgetBuilder','Validator'],factory);
	
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
		events:IUI.Class.prototype.events.concat(['fetch','binding','bound']),
		options:{
			autofetch: false,
			data:[]
		},
		state:{
			fetched:false
		},
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this.preserve=this.options.preserve;
			this.name=this.options.name;
			if(this.options.autofetch){
				this.fetch();
			}
			bindDataMart(this);
		},		
		fetch: function(){
			this.data=this.options.data;				
			this.trigger('fetch',{data:this.data});
			this.state.fetched=true;
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
	define('Widget',['IUI-core','WidgetBuilder','DataMart','Validator','Behaviors'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){
	
	/**
	*	The base Framework Class for all the Widgets which are created by WidgetBuilder.
	*/
	var Widget=IUI.Class.extend({
		name: 'Widget',		
		template: '',
		classType: 'Widget',
		classList: ['i-ui-widget'],
		events:IUI.Class.prototype.events.concat(['validate']),
		validationList: [],
		_observedOptions:['enable','isattached'],
		_optionModelMapping:[],
		load: function(options){
			if(typeof options.validations === "string"){
				options.validations=options.validations.split(',').map(function(elem){return elem.trim()})
			}
			this.boundModelOptions={
				validator: this._validate.bind(this)
			}
		},
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);	
			
			this.$element=$(this.options.element)
			this.element=this.$element[0];
			this.makeUI();	
			if(this.options.datamart){
				IUI.DataMart.bindWidget(this.options.datamart,this);
			}
			this.bindModels(this.boundModelOptions);
			this.onInitialize();	
		},
		_handleOptionChange:function(key,value){
			if(key in this.element.style){
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
		onInitialize: function(){
			
		},
		onDataFetch:function(data){
			
		},
		dataBinding:function(data){
			
		},		
		dataBound:function(data){
			
		},
		_bindDataMart: function(dataMart){
			this.dataMart=dataMart;
			dataMart._bind({
				fetch:this.onDataFetch.bind(this),
				binding:this.dataBinding.bind(this),
				databound:this.dataBound.bind(this)
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
				return this;
			}
		},
		attach: function(){
			if(this._detachedSpan && this._detachedSpan.parent().length){
				this._detachedSpan.after(this.$element);
				this._detachedSpan.detach();
			}
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
		onTemplateAttach:function(wrapper){
			//Override it to extract children to variables or to process children of templare before processing options or element;
		},
		makeUI: function(){
			var wrapper=document.createElement("DIV");
			
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
			
			
			this.model=model || {};
			for(var key in model){
				if(list && (list.indexOf(key)===-1)){
					continue;
				}
				
				Object.defineProperty(this._data,key,{
					value: this.model[key],
					writable: true
    			});
				
				Object.defineProperty(this.model,key,{	
					set: (function(key){
						return function(value){
							var valid=validator(value);
							if(_data[key]!==value && valid.valid){
								_data[key]=value;
								_handleChange(key,value);
							}
						}
					})(key),
					get: (function(key){
						return function(){
							return _data[key];
						}
					})(key)
				});
			}
		},
		
		_handleChange: function(key,value,sender){
			(this.handler) && (this.handler(key,value,sender));
		}
	});
	
	
	ObservableModel.bindModels=function bindModels(optionsModel, containerModel,mappingArray){
		optionsModel.bindConainerModel(containerModel,mappingArray);
		containerModel.bindOptionModel(optionsModel,mappingArray);
	}
	
	
	IUI.ObservableModel=ObservableModel;
	


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
					for(var a in obj.mappedAttributes){
						
						if(obj.isExclusive){
							obj.model.lastUpdatedBy=this._uid;
							obj.model.model[obj.mappedAttributes[a]]=value;
						}
					}
				}			
			}
		},
		bindConainerModel: function(containerModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels={});
			for(var i=0;i<length;++i){
				var obj={
					model: containerModel,
					mappedAttributes:[],
					isExclusive:mappingArray[i].isExclusive 
				}
				mapping=mappingArray[i].mappings;
				for(var maps in mapping){
					if(typeof containerModel.model[mapping[maps]] !== "undefined"){
						obj.mappedAttributes.push(mapping[maps]);
					}
				}
				options=mappingArray[i].optionAttribute;
				this.model[options]=IUI.Template.render(mappingArray[i].template,containerModel.model);
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
			var boundModels=this.boundModels,length;
			if(boundModels.length){
				var length=boundModels.length;				
				for(var i=0;i<length;++i){
					var obj=boundModels[i];
					if(obj.model._uid===this.lastUpdatedBy){
						delete this.lastUpdatedBy;
						continue;
					}
					var result=IUI.Template.render(obj.template,this.model);			
					obj.model.model[obj.optionAttribute]=result;
				}			
			}
		},
		bindOptionModel: function(optionModel,mappingArray){
			var mapping,options,length=mappingArray.length;
			(this.boundModels) || (this.boundModels=[]);
			for(var i=0;i<length;++i){
				var obj={
					model: optionModel,
					optionAttribute:mappingArray[i].optionAttribute,
					template:mappingArray[i].template
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
	define('ContainerUI',['IUI-core','Widget'],factory);
	
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
		events:IUI.Widget.prototype.events.concat(['create']),
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
			if(this.options.async){
				this._create=this._createAsync;
			}			
			var _elem=$(this.options.element || document.createElement('div'));
			if(_elem.length===1 && !Array.isArray(this.options.element)){
				this.element=_elem[0];
				this.$element=_elem;
			}else{
				this.element=document.createElement('div');
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
		_handleOptionChange:function(key,value){
			if(key in this.element.style){
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
		_create: function(elements){
			var length=elements.length;
			for(var i=0;i<elements.length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
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
			}			
		},
		_createAsync: function(elements){
			var length=elements.length;
			for(var i=0;i<elements.length;++i){
				var elem=elements[i];
				if(elem.tagName === "STOP") return;
				setTimeout((function(elem){return function(){
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
				}})(elem).bind(this));
			}			
		},
		_itterateCommandToAllComponents: function(command){
			var args=Array.prototype.slice.call(arguments,1);
			for(var c in this.containers){
				var container=this.containers[c];
				container[command].apply(container,args);
			}
			for(var w in this.widgets){
				var widget=this.widgets[w];
				widget[command].apply(widget,args);
			}
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
			if(tagName!=='BODY' && tagName!=='DIV'){
				var elem=document.createElement('div');
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
				IUI.behaviors.extractFromObject(subcontainer,this.options,['subconatiner-attribute']);	
				this.options.subcontainerOptions.element=subcontainer;
				this.options.subcontainerOptions.model=this.options.model;
				this.subcontainer=new IUI.ContainerUI(this.options.subcontainerOptions);
				this.subcontainer.makeUI();
				this.subcontainer.bindModels();
				$($(this.element).siblings()).appendTo(subcontainer);
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
		},
		_appendSubContainer: function(){
			this.$element.after(this.subcontainer);
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
	define('Sidebar',['IUI-core','Container','Layout'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Sidebar=IUI.uiContainers.Layout.extend({
		name:'Sidebar',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-sidebar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-sidebar-subcontainer']),
		_observedOptions:['width'],
		options: {
			width: '10em',
			position: 'left'
		},
		_handlewidthChange:function(value){
			this.subcontainer.style.width='calc( 100% - '+value+')';
		},
		_appendSubContainer: function(){
			if(this.options.position==="left"){			
				this.$element.after(this.subcontainer);
			}else if(this.options.position==="right"){
				this.$element.before(this.subcontainer);
			}else{
				throw new Error('Wrongly positioned sidebar');
			}
		},
		processSubcontainer:function(subcontainer){
			subcontainer.style.width='calc( 100% - '+this.options.width+')';
		}
	});
	
	IUI.WidgetBuilder.plugin(Sidebar);


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
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-navbar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-navbar-subcontainer']),
		_observedOptions:['height'],
		options: {
		},
		_handleheightChange:function(value){
			this.subcontainer.style.height='calc( 100% - '+value+')';
		},
		processSubcontainer:function(subcontainer){
			subcontainer.style.height='calc( 100% - '+(this.options.height || '0px')+')';
		}
	});
	
	IUI.WidgetBuilder.plugin(Navbar);


});
(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define('Footer',['IUI-core','Container','Navbar'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Footer=IUI.uiContainers.Navbar.extend({
		name:'Footer',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-footer']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-footer-subcontainer']),
		_appendSubContainer: function(){
			this.$element.before(this.subcontainer);
		},
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
			this.createOverlay();	
			this._attachEvents();			
		},
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
			autohide: true
		},
		_processInitialPopupStyle:function(){
			var $anchor=$(this.options.anchor);
			
			if($anchor.length===0) return;
			
			var _anchor=$anchor[0], _rect=_anchor.getClientRects(),direction=this.options.direction;
			if(_rect.length){
				var rect=_rect[0];
				var placements=this.options.placement.split(' ');
				for(var placement in placements){
					var place=placements[placement];
					if(place==="top"){
						if(direction==='down'){
							this._initialPopupStyle.top=rect.top;
						}else{
							this._initialPopupStyle.bottom=rect.bottom-rect.height;
						}
					}else{
						if(direction==='down'){
							this._initialPopupStyle.top=rect.top+rect.height;
						}else{
							this._initialPopupStyle.bottom=rect.bottom;
						}						
					}
					
					if(place==="right"){
						this._initialPopupStyle.left=rect.left+rect.width+1;
					}else{
						this._initialPopupStyle.left=rect.left+1;
					}
				}
				if(!this.options.width){
					this._initialPopupStyle.width=rect.width-2;
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
			IUI.behaviors.extractStyleFromObject(this.element,this._initialPopupStyle);
			if(!this._isAttached){
				$(overlayContainer).append(this.element);
				this._isAttached=true;
			}
			this.show();
			this._popupOpen=true;
			$(this.element).animate(this.options.animateObjectOpen,300,function(){
				if(this.options.autohide){
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
		close: function(e){
			if(!this._popupOpen || (e && $(e.target).is(this.element))){
				$('html').off('mouseup.'+this._uid);
				$('html').one('mouseup.'+this._uid,this.close);
				return;
			}
			var that=this;
			$(this.element).animate(this.options.animateObjectClose,300,function(){
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
				var _element=$(this.contents).detach();
				_element.appendTo(this.element);
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
			value:''
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
			this._attachEvents();
			this.value(this.options.value);
		},
		onTemplateAttach:function(wrapper){
			this.input=$(wrapper.children[0]);
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
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);			
			this._attachEvents();
		},
		_processOptions: function(wrapper){
			IUI.Widget.prototype._processOptions.apply(this,arguments);		
			this.options.text=(this.element && this.element.innerHTML) || this.options.text;
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
		},
		initialize: function(){
			IUI.Widget.prototype.initialize.apply(this,arguments);		
			this.button=this.$element.find('.i-ui-switch-button');
			this._attachEvents();
		},
		_handleClick: function(e){
			if(this.$element.hasClass('i-ui-switch-active')){
				this.$element.removeClass('i-ui-switch-active');
			}else{
				this.$element.addClass('i-ui-switch-active');				
			}
		},
		_attachEvents: function(){
			var that=this;
			this.$element.on('click','.i-ui-switch-button',this._handleClick.bind(this));
		},
		value: function(val){
			if(typeof val === "undefined"){
				return this.$element.hasClass('i-ui-switch-active');
			}else{
				this.$element.toggleClass('i-ui-switch-active',val);				
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
			this.trigger('toggle',{value:this.value()});
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
		_processOptions: function(wrapper){
			this.options.value=(this.element && this.element.innerHTML) || this.options.text;
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
		initialize: function(){
			
			this.options.checked=(this.options.checked===true || this.options.checked==="true" || this.options.checked==="checked");			
			IUI.Widget.prototype.initialize.apply(this,arguments);		
		},
		onTemplateAttach:function(wrapper){
			this.input=wrapper.children[0];
		},
		_processOptions: function(wrapper){
			IUI.Widget.prototype._processOptions.apply(this,arguments);
			this.label=new IUI.uiWidgets.FormLabel({text: this.options.text});
			$(wrapper).append(this.label.$element);
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
				this.step=Number(this.options.step);				
			},
			
			events: InputBox.prototype.events.concat(['spin']),
			
			options: {
				step: 1,
				value: 0,
				decimal: false,
				precision:2
			},			
			_handleSpinStart: function(e){
				var that=this, step=this.step;
				
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
				var textAttribute=this.options.textAttribute, idAttribute=this.options.idAttribute;
				if(options.element && !options.data){
					var _data=[];
					$(options.element).find('option').each(function(idx,elem){
						var obj={}
							obj[textAttribute]=elem.innerHTML;
							obj[idAttribute]=elem.id;
						_data.push(obj);
					});
					options.data=_data;
				}
				InputBox.prototype.initialize.apply(this,arguments);		
			},
			_createPopup:function(data){
					var textAttribute=this.options.textAttribute, idAttribute=this.options.idAttribute;
					
					var dataMapper=function(_data,idx){
						var elem=document.createElement('div');
						$(elem).addClass('i-ui-list-item');
						if(_data[idAttribute]){
							elem.id=_data[idAttribute];
						}
						elem.innerHTML=_data[textAttribute];
						elem._uiDataIndex=idx;
						return elem;
					}
					
					if(this.popup){
						this.popup.setContents(data.map(dataMapper))
						this.popup.options.animateObjectOpen.height=2*data.length+'em'
					}else{
						this.popup=IUI.createOverlay({
							anchor: this.element,
							contents: data.map(dataMapper),
							button: this.element.querySelector('.i-ui-dropbutton-container'),
							maxHeight: '15em',
							height: (2*this.options.data.length)+'em'
						});
					}
			},
			onDataFetch: function(e){
				var data=e.data;
				this._createPopup(data);
				this.options.data=data;
			},
			onRender: function(){
				this._createPopup(this.options.data);
			},
			options: {			
				textAttribute: 'text',
				idAttribute: 'id'
			},
			_attachEvents: function(){
				var that=this;
				InputBox.prototype._attachEvents.apply(this,arguments);
				$(this.popup.element).on('click','.i-ui-list-item',function(e){
					var index=e.currentTarget._uiDataIndex;
					if(typeof index !== "undefined"){
						that.value(that.options.data[index][that.options.textAttribute]);
						that.trigger('change',{value:that.options.data[index] });
					}
				}.bind(this));
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
			_handlevalueChange: function(value){
				IUI.Widget.prototype._handlevalueChange.apply(this,arguments);
				
			}
			,value: function(val){
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
		'OptionModel',
		'ContainerModel',
		'Container',
		'Layout',
		'Sidebar',
		'Navbar',
		'Footer',
		'Widget',
		'ContainerUI',
		'Overlay',
		'InputBox',
		'Button',
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
			model: model
		})
		
		var uiContainer= new IUI.ContainerUI(options);
	
		uiContainer.makeUI();
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
