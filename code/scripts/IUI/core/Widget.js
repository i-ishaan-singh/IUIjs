define(['IUI-core','WidgetBuilder','DataMart','Validator','Behaviors'],function(IUI){
	
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
			(this._detachedSpan) || (this._detachedSpan=$('<span>'));
			(this.$element.parent().length) && (this.$element.replaceWith(this._detachedSpan));
			return this;
		},
		attach: function(){
			(this._detachedSpan && this._detachedSpan.parent().length) && (this._detachedSpan.replaceWith(this.$element));
		},
		_processOptions: function(wrapper){
			IUI.behaviors.extractFromObject(wrapper,this.options,['style','ii-attibute']);			
			if(this.options.class){
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