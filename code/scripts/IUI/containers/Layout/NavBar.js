define(['IUI-core','Container','Layout'],function(IUI){

	var Navbar=IUI.uiContainers.Layout.extend({
		name:'Navbar',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-navbar']),
		subContainerClassList: IUI.uiContainers.Layout.prototype.subContainerClassList.concat(['i-ui-navbar-subcontainer']),
		_observedOptions:['height'],
		options: {
		},
		_handleheightChange:function(value){
			this.subcontainer.style.height='calc( 100% - '+value+')';
		},
		processSubcontainer:function(subcontainer){
			subcontainer.style.height='calc( 100% - '+(this.options.height || '0px')+')';
		}
	});
	
	IUI.WidgetBuilder.plugin(Navbar);


});