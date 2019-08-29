(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','WidgetBuilder','DataMart','Validator','Behaviors','Plugable'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){
	
	IUI.persistantAttributes=['src', 'onabort','onautocomplete','onautocompleteerror','onblur','oncancel','oncanplay','oncanplaythrough','onchange','onclick','onclose','oncontextmenu','oncuechange','ondblclick','ondrag','ondragend','ondragenter','ondragexit','ondragleave','ondragover','ondragstart','ondrop','ondurationchange','onemptied','onended','onerror','onfocus','oninput','oninvalid','onkeydown','onkeypress','onkeyup','onload','onloadeddata','onloadedmetadata','onloadstart','onmousedown','onmouseenter','onmouseleave','onmousemove','onmouseout','onmouseover','onmouseup','onmousewheel','onpause','onplay','onplaying','onprogress','onratechange','onreset','onresize','onscroll','onseeked','onseeking','onselect','onshow','onsort','onstalled','onsubmit','onsuspend','ontimeupdate','ontoggle','onvolumechange','onwaiting','accesskey','accesskey' , 'autocapitalize' , 'contenteditable' ,  'dir' , 'draggable' , 'hidden' , 'inputmode' , 'is','itemid' , 'itemprop' , 'itemref' , 'itemscope' , 'itemtype' , 'lang' , 'slot' , 'spellcheck  ' , 'style' , 'tabindex' , 'title','target'];
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