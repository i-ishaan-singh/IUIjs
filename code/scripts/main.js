require.config({
	baseUrl: "./scripts/IUI",
	paths:{
		'IUI-core':'./IUI-core',
		'IUI':'./IUI',
		'Behaviors':'./core/Behaviors',
		'WidgetBuilder':'./core/WidgetBuilder',
		'ObservableModel':'./core/ObservableModel',
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
	}
});
console.time('ishaan');
require(['IUI'],function(IUI){
		window.IUI=IUI;
		var seasonsDataMart=new IUI.DataMart({
			name: 'season-mart',
		data: [{text:'Summner'},{text:'Winter'},{text:'Autunm'},{text:'Moonsoon'}]
		});
		seasonsDataMart.fetch();
		console.time('UI creation');
		var containerUI=IUI.makeUI();
		console.timeEnd('UI creation');
		console.log(containerUI);
		var form=containerUI.containers['ui-form'];
		
		new IUI.EventGroup({
			name :"form-events",
			click: function(e){
				alert(JSON.stringify(form.value()));
			}
		});
		console.timeEnd('ishaan');

});
