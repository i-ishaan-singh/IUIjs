(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
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
			if(this.options.placeholder){
				this.input.attr('placeholder',this.options.placeholder);
			}
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