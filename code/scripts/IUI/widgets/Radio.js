(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
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