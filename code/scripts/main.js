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
	}
});
console.time('ishaan');
require(['IUI'],function(IUI){
	
		window.IUI=IUI;
		var _a=[{text:'Summner North Indian North Indian North Indian'},{text:'Winter'},{text:'Autunm'},{text:'Moonsoon'}],season=[];
		
		for(var i=0;i<100;++i){
			season.push(_a[i%4]);
		}
		var _b=[{text:'North Indian North Indian'},{text:'South Indian'},{text:'Punjabi'},{text:'Chinese'}], food=[];
		
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
			lastName:'Singh',
			mycolor: 'red',
			theme: 'darkgrey lightgrey',
			formColor: 'lightblue',
			sliderValue: 0
		};
		new IUI.EventGroup({
			name :"form-events",
			click: function(e){
				alert(JSON.stringify(form.value()));
			}
		});
		//IUI.setDOMAccessibility(false);
		var containerUI=IUI.makeUI(window.obj);
		console.timeEnd('UI creation');
		console.log(containerUI);
		var form=containerUI.getContainerById('ui-form');
		
		new IUI.EventGroup({
			name :"change-validation-events",
			change: function(e){
				this.validate();
			},
			persist: true
		});
		
		foodDataMart.fetch();
		console.timeEnd('ishaan');

});
