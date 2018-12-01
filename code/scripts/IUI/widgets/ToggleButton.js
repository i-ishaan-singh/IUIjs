(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Button'],factory);
	
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