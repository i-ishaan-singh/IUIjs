({
    baseUrl: "./code/scripts/IUI",
	paths:{
		'IUI-core':'./IUI-core',
		'IUI':'./IUI',
		'Behaviors':'./core/Behaviors',
		'WidgetBuilder':'./core/WidgetBuilder',
		'Template':'./core/Template',
		'ObservableModel':'./core/ObservableModel',
		'OptionModel':'./models/OptionModel',
		'ContainerModel':'./models/ContainerModel',
		'Widget':'./core/Widget',
		'Validator':'./core/Validator',
		'ContainerUI':'./core/ContainerUI',
		'Overlay':'./core/Overlay',
		'Container':'./containers/Container',
		'VerticalScroller':'./containers/VerticalScroller',
		'Popover':'./containers/Overlays/Popover',
		'ContextMenu':'./containers/Overlays/ContextMenu',
		'Layout':'./containers/Layout/Layout',
		'Sidebar':'./containers/Layout/Sidebar',
		'Navbar':'./containers/Layout/Navbar',
		'Footer':'./containers/Layout/Footer',
		'DataMart':'./core/DataMart',
		'InputBox':'./widgets/InputBox',
		'Slider':'./widgets/Slider',
		'Switch':'./widgets/Switch',
		'Button':'./widgets/Button',
		'ToggleButton':'./widgets/ToggleButton',
		'SubmitButton':'./widgets/SubmitButton',
		'FormLabel':'./widgets/FormLabel',
		'Radio':'./widgets/Radio',
		'NumericInputBox':'./widgets/NumericInputBox',
		'DropDown':'./widgets/DropDown',
		'ComboBox':'./widgets/ComboBox',
		'Exhibit':'./containers/Exhibit',
		'Form':'./containers/Form',
		'RadioGroup':'./containers/RadioGroup'
	},	
	shim:{
		"IUI": {
			exports: "IUI" 
		}
	},
	name: "IUI",
    out: "./build/IUI.all.js"
})