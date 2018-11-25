define(['IUI-core','Widget'],function(IUI){

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