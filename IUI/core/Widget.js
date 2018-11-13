define(['../IUI-core.js','../core/WidgetBuilder.js','../core/Validator.js'],function(IUI){

	/* ------ IUI.Widgets.js ----------------- */

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
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);			
			this.$element=$(this.options.element)
			this.element=this.$element[0];
			this.makeUI();	
			this.onInitialize();	
		},
		onInitialize: function(){
			
		},
		_preprocessElement: function(wrapper){
			Array.prototype.slice.call(this.element.style).forEach(function(elem){
					wrapper.style[elem]=this.element.style[elem];
			},this);	
			
		},
		_processOptions: function(wrapper){
			IUI.behaviors.extractStyleFromObject(wrapper,this.options);			
			if(this.options.class){
				wrapper.classList.add.apply(wrapper.classList,this.options.class.split(' '));	
			}
			if(this.options.id){
				wrapper.id=this.options.id;
			}
			if(this.options.disabled && this.options.disabled !== 'false'){
				this.options.enable=false;
				wrapper.classList.add('i-ui-disabled');
			}
			if(this.options.validations){
				if(typeof this.options.validations === "string"){
					this.validationList=this.validationList.concat(this.options.validations.split(',').map(function(elem){return elem.trim()}));
				}else if(Array.isArray(this.options.validations)){
					this.validationList.concat(this.options.validations);
				}
				
			}
			
		},
		onTemplateAttach:function(wrapper){
			//Override it to extract children to variables or to process children of templare before processing options or element;
		},
		makeUI: function(){
			var wrapper=document.createElement("DIV");
			
			wrapper.classList.add.apply(wrapper.classList,this.classList);
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
				this.element.classList.add('i-ui-invalid');
				setTimeout(function(){
					that.element.classList.remove('i-ui-invalid');
				},200);
			}
		},
		validate: function(value){
			var valid=true,
				rules=[],
				length=this.validationList.length;
			for(var i=0;i<length;i++){
				var rule=this.validationList[i];
					_valid=IUI.Validator.validate(rule,value);
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
				this.element.classList.toggle('i-ui-disabled',!val);
			}else{
				return !this.element.classList.contains('i-ui-disabled');
			}
			
		},
		value: function(val){
			if(typeof val !== 'undefined'){
				return this.element.innerText=val;
			}
			return this.element.innerText;
		},
		options:{
			enable: true			
		}
		
	});
	
	IUI.Widget=Widget;
	IUI.WidgetBuilder.plugin(Widget);
	
/* ------- END : IUI.Widgets.js -----------*/


});