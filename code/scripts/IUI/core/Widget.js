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
		},
		initialize: function(options){
			
			IUI.Class.prototype.initialize.apply(this,arguments);	
			
			this.$element=$(this.options.element)
			this.element=this.$element[0];
			this.makeUI();	
			if(this.options.datamart){
				IUI.DataMart.bindWidget(this.options.datamart,this);
			}
			this.observableModel=new IUI.ObservableModel(this.options,this._handleOptionChange.bind(this),this._observedOptions)
			this.onInitialize();	
		},
		_handleOptionChange: function(key, value){
			this['_handle'+key+'Change'](value);
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
			this.$element.replaceWith(this._detachedSpan);
		},
		attach: function(){
			this._detachedSpan.replaceWith(this.$element);
		},
		_processOptions: function(wrapper){
			
			IUI.behaviors.extractStyleFromObject(wrapper,this.options);			
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
				this.validationList.concat(this.options.validations);			
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
			this.element.iuiWidget=this;
			this.$element=$(wrapper);
			this.onRender();
		},
		onRender:function(){
			
		},
		_onValidate: function(result){
			var that=this;
			if(!result.valid){
				this.$element.addClass('i-ui-invalid');
				setTimeout(function(){
					that.$element.removeClass('i-ui-invalid');
				},200);
			}
		},
		validate: function(validator){
			return this._validate(this.value(),validator);
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
				return this.element.innerText=val;
			}
			return this.element.innerText;
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