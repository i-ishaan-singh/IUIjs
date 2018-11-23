require.config({
	baseUrl: "./scripts/IUI",
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
		var _a=[{text:'Summner'},{text:'Winter'},{text:'Autunm'},{text:'Moonsoon'}],season=[];
		
		for(var i=0;i<100;++i){
			season.push(_a[i%4]);
		}
		var _b=[{text:'North Indian'},{text:'South Indian'},{text:'Punjabi'},{text:'Chinese'}], food=[];
		
		for(var i=0;i<100;++i){
			food.push(_b[i%4]);
		}
		var seasonsDataMart=new IUI.DataMart({
			name: 'season-mart',
			data: season
		});
		var foodDataMart=new IUI.DataMart({
			name: 'food-mart',
			data: food
		});
		seasonsDataMart.fetch();
		console.time('UI creation');
		window.obj={
			firstName:'Ishaan',
			lastName:'Singh'
		};
		var containerUI=IUI.makeUI(window.obj);
		console.timeEnd('UI creation');
		console.log(containerUI);
		var form=containerUI.containers['ui-form'];
		
		new IUI.EventGroup({
			name :"form-events",
			click: function(e){
				alert(JSON.stringify(form.value()));
			}
		});
		
		foodDataMart.fetch();
		console.timeEnd('ishaan');

});
