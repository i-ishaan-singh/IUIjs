(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','ContainerUI'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var PopOver=IUI.ContainerUI.extend({
		name:'PopOver',
		initialize: function(){
			IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
			this.bindModels();
			this._beforeRender();
			this.popup=IUI.createOverlay({
							contents: this.element,
							button: $(this.options.button),
							height: this.options.height,
							width: this.options.width,
							direction: this.options.direction,
							placement: this.options.placement,
							autoclose: this.options.autoclose
			});
			this.wrapper=this.popup.element;
			this.$wrapper=this.popup.$element;
			if(this.options.autopen == 'true'){
				this.popup.open();
			}
			this.makeUI();					
			this._afterRender();
			this._attachEvents();
		},
		options:{
			height: '15em',
			width: '50%',
			direction: 'down',
			placement: 'top',
			autoclose: false,
			autoopen: true
		},
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-popover-container']),
		_beforeRender:function(){
			
		},
		_afterRender:function(){
			
		},
		_attachEvents: function(){
			
		}
		
	});
	
	IUI.WidgetBuilder.plugin(PopOver);


});