({
    baseUrl: "./code/scripts/IUI",
	paths:{
		'IUI-core':'./IUI-core',
		'IUI':'./IUI',
		'Behaviors':'./core/Behaviors',
		'WidgetBuilder':'./core/WidgetBuilder',
		'Widget':'./core/Widget',
		'Validator':'./core/Validator',
		'ContainerUI':'./core/ContainerUI',
		'Overlay':'./core/Overlay',
		'Container':'./containers/Container',
		'DataMart':'./core/DataMart',
		'InputBox':'./widgets/InputBox',
		'Button':'./widgets/Button',
		'ToggleButton':'./widgets/ToggleButton',
		'SubmitButton':'./widgets/SubmitButton',
		'FormLabel':'./widgets/FormLabel',
		'Radio':'./widgets/Radio',
		'NumericInputBox':'./widgets/NumericInputBox',
		'DropDown':'./widgets/DropDown',
		'ComboBox':'./widgets/ComboBox',
		'Form':'./containers/Form',
		'RadioGroup':'./containers/RadioGroup'
	},	
	shim:{
		"IUI-core": {
			exports: "IUI" 
		}
	},
	name: "IUI",
    out: "./build/IUI.all.js"
})