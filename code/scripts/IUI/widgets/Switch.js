(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Widget'],factory);
	
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