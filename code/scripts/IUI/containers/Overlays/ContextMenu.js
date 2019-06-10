(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Popover'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var ContextMenu=IUI.uiContainers.PopOver.extend({
		name:'ContextMenu',
		initialize: function(options){
			var that=this;
			options.button=null;
			this.element=options.element;
			setTimeout(function(){
				IUI.uiContainers.PopOver.prototype.initialize.call(that,options);	
			});
			
		},
		options:{
			height: '20em',
			width: '15em',
			direction: 'down',
			placement: 'top',
			autoclose: true,
			autoopen: false
		},
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-popover-container']),
		_beforeRender:function(){
			
		},
		_afterRender:function(){
			
		},
		classList: IUI.uiContainers.PopOver.prototype.classList.concat(['i-ui-context-menu']),
		_attachEvents: function(){
			var that=this;
			IUI.uiContainers.PopOver.prototype._attachEvents.apply(this,arguments);	
			
			$(this.options.container).on('mousedown',function(e){
				
				that.popup.closeImmediate(e);
			});
			$(this.options.container).on('contextmenu',function(e){
				if(e.which === 3){
					e.preventDefault();
					that.popup.setClientRectangle([{
						right:e.originalEvent.x,
						left:e.originalEvent.x,
						top:e.originalEvent.y,
						bottom:e.originalEvent.y,
						height:0,
						width:0
					}]);
					that.popup.open();
					e.stopPropagation();
				}
			});
			
		
		}
		
	});
	
	IUI.WidgetBuilder.plugin(ContextMenu);


});