(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Plugable'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var PopOver=IUI.Plugable.extend({
		name:'PopOver',
		initialize: function(){
			var that=this;
			Plugable.prototype.initialize.apply(this,arguments);	
			this.bindModels();
			this._beforeRender();
			this.$element.children().wrapAll('<div>');
			this.popup = IUI.createOverlay({
				contents: this.$element.children(),
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
		makeUI: function(){
			if($(this.element).parent().length)
				this.element.outerHTML='<span class="ghost-span"></span>';
			this.element=null;
		},
		options:{
			height: '15em',
			width: '50%',
			direction: 'down',
			placement: 'top',
			autoclose: true,
			autoopen: true,
			'plug-event':'click'
		},
		plug: function(widget){
			var that=this;
			this.popup._initPromise.done(function(){	
				widget.$element.on(that.options['plug-event'], function(e){
					that.popup.options.anchor=e.currentTarget;
					that.trigger('activate',{
						widget: widget					
					});
					that.popup.open();
				});
			});
			
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