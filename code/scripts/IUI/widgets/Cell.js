(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
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