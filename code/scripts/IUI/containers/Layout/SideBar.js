(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Layout'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Sidebar=IUI.uiContainers.Layout.extend({
		name:'Sidebar',
		classList: IUI.uiContainers.Layout.prototype.classList.concat(['i-ui-sidebar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-sidebar-subcontainer']),
		_observedOptions:['width'],
		initialize: function(options){
			if($(options.element).index() === ($(options.container).children().length -1 ) ){
				this.options.position = 'right';
			}
			IUI.uiContainers.Layout.prototype.initialize.apply(this, arguments);
			
		},
		options: {
			width: '10em',
			position: 'left'
		},
		_handlewidthChange:function(value){
			$(this.subcontainer).css('padding-'+this.options.position,value);
		},
		_appendSubContainer: function(){
			this.$element.before(this.subcontainer);
			this.$element.addClass('i-ui-'+this.options.position+'-sidebar')
		},
		processSubcontainer:function(subcontainer){
			$(subcontainer).css('padding-'+this.options.position,this.options.width);
		}
	});
	
	IUI.WidgetBuilder.plugin(Sidebar);


});