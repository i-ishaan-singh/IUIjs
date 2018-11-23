define(['IUI-core',
		'Behaviors',
		'WidgetBuilder',		
		'Validator',
		'ObservableModel',
		'Widget',
		'ContainerUI',
		'Overlay',
		'InputBox',
		'Button',
		'ToggleButton',
		'SubmitButton',
		'FormLabel',
		'Radio',
		'NumericInputBox',
		'DropDown',
		'ComboBox',
		'Form',
		'RadioGroup'],function(IUI){

	
	IUI.Validator.addRule('numeric',function(value){
		return !isNaN(Number(value));
	});
		
	IUI.Validator.addRule('email',function(value){
		var emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailExp.test(value);
	});
	
	IUI.Validator.addRule('noScript',function(value){
		var scriptExp = /(<|>)/g;
		return !scriptExp.test(value);
	});	
		
	IUI.makeUI=function makeUI(elem){
		
		(elem) || (elem='body')
		var uiContainer= new IUI.ContainerUI({
			element: elem
		});		
		uiContainer.makeUI();
		return uiContainer;
	}
	//window.IUI=IUI;
	return IUI;

});