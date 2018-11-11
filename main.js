require(['./IUI/IUI.js',
		'./IUI/core/Behaviors.js',
		'./IUI/core/WidgetBuilder.js',
		'./IUI/core/Widget.js',
		'./IUI/core/ContainerUI.js',
		'./IUI/core/Overlay.js',
		'./IUI/widgets/InputBox.js',
		'./IUI/widgets/Button.js',
		'./IUI/widgets/ToggleButton.js',
		'./IUI/widgets/SubmitButton.js',
		'./IUI/widgets/FormLabel.js',
		'./IUI/widgets/Radio.js',
		'./IUI/widgets/NumericInputBox.js',
		'./IUI/widgets/DropDown.js',
		'./IUI/widgets/ComboBox.js',
		'./IUI/containers/Container.js',
		'./IUI/containers/Form.js',
		'./IUI/containers/RadioGroup.js'],function(IUI){
	
	window.IUI=IUI;
	
	console.time('UI creation');
	var containerUI=IUI.makeUI();
	console.timeEnd('UI creation');
	var form=containerUI.containers['ui-form'];
	
	new IUI.EventGroup({
		name :"form-events",
		click: function(e){
			alert(JSON.stringify(form.value()));
		}
	});

});