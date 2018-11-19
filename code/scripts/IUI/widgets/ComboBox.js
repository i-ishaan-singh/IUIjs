define(['IUI-core','DropDown'],function(IUI){

	var DropDown=IUI.uiWidgets.DropDown,		
		Combobox=DropDown.extend({
			name:'Combobox',
			classList: IUI.Widget.prototype.classList.concat(['i-ui-combobox']),
		});
	
	IUI.WidgetBuilder.plugin(Combobox);


});