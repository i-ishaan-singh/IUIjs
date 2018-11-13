define(['./IUI-core.js',,
		'./core/Behaviors.js',
		'./core/WidgetBuilder.js',		
		'./core/Validator.js',
		'./core/Widget.js',
		'./core/ContainerUI.js',
		'./core/Overlay.js',
		'./widgets/InputBox.js',
		'./widgets/Button.js',
		'./widgets/ToggleButton.js',
		'./widgets/SubmitButton.js',
		'./widgets/FormLabel.js',
		'./widgets/Radio.js',
		'./widgets/NumericInputBox.js',
		'./widgets/DropDown.js',
		'./widgets/ComboBox.js',
		'./containers/Container.js',
		'./containers/Form.js',
		'./containers/RadioGroup.js'],function(IUI){

	
	IUI.Validator.addRule('numeric',function(value){
		return !isNaN(Number(value));
	});
		
	IUI.Validator.addRule('email',function(value){
		var emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailExp.test(value);
	});
	
	IUI.Validator.addRule('noScript',function(value){
		var scriptExp = /(<|>)/g;
		return scriptExp.test(value);
	});	
		
	IUI.makeUI=function makeUI(elem){
		
		(elem) || (elem='body')
		var uiContainer= new IUI.ContainerUI({
			element: elem
		});		
		uiContainer.makeUI();
		return uiContainer;
	}

	return IUI;

});