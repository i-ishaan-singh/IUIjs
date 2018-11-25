define(['IUI-core','Container'],function(IUI){

	var Exhibit=IUI.uiContainers.Container.extend({
		name:'Exhibit',
		classList: IUI.uiContainers.Container.prototype.classList.concat(['i-ui-exhibit'])
	});
	
	IUI.WidgetBuilder.plugin(Exhibit);


});