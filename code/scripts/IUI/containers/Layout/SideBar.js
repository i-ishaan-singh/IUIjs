(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container','Layout'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var Sidebar=IUI.uiContainers.Layout.extend({
		name:'Sidebar',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-sidebar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-sidebar-subcontainer']),
		_observedOptions:['width'],
		options: {
			width: '10em',
			position: 'left'
		},
		_handlewidthChange:function(value){
			this.subcontainer.style.width='calc( 100% - '+value+')';
		},
		_appendSubContainer: function(){
			if(this.options.position==="left"){			
				this.$element.after(this.subcontainer);
			}else if(this.options.position==="right"){
				this.$element.before(this.subcontainer);
			}else{
				throw new Error('Wrongly positioned sidebar');
			}
		},
		processSubcontainer:function(subcontainer){
			subcontainer.style.width='calc( 100% - '+this.options.width+')';
		}
	});
	
	IUI.WidgetBuilder.plugin(Sidebar);


});