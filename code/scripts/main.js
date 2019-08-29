require.config({
	baseUrl: "./scripts/IUI",
	paths:{
		'jquery': '../jquery',
		'text': '../text',
		'IUI-core':'./IUI-core',
		'IUI':'./IUI',
		'Behaviors':'./core/Behaviors',
		'WidgetBuilder':'./core/WidgetBuilder',
		'View':'./core/View',
		'Template':'./core/Template',
		'Plugable':'./core/Plugable',
		'ObservableModel':'./core/ObservableModel',
		'DataBoundContainer':'./core/DataBoundContainer',
		'OptionModel':'./models/OptionModel',
		'ViewModel':'./models/ViewModel',
		'ContainerModel':'./models/ContainerModel',
		'Widget':'./core/Widget',
		'Utils':'./core/Utils',
		'Validator':'./core/Validator',
		'ContainerUI':'./core/ContainerUI',
		'Overlay':'./core/Overlay',
		'QuickSort':'./utils/QuickSort',
		'Container':'./containers/Container',
		'Viewport':'./containers/Viewport',
		'VerticalScroller':'./containers/VerticalScroller',
		'Row':'./containers/Row',
		'Popover':'./containers/Overlays/Popover',
		'ContextMenu':'./containers/Overlays/ContextMenu',
		'Layout':'./containers/Layout/Layout',
		'Sidebar':'./containers/Layout/Sidebar',
		'Navbar':'./containers/Layout/Navbar',
		'Footer':'./containers/Layout/Footer',
		'ContainerCell':'./containers/ContainerCell',
		'ContainerHeaderCell':'./containers/ContainerHeaderCell',
		'Grid':'./containers/DataBoundContainers/Grid',
		'DataItem':'./core/DataItem',
		'DataMart':'./core/DataMart',
		'InputBox':'./widgets/InputBox',
		'Slider':'./widgets/Slider',
		'Switch':'./widgets/Switch',
		'Button':'./widgets/Button',
		'Division':'./widgets/Division',
		'HeaderCell':'./widgets/HeaderCell',
		'Cell':'./widgets/Cell',
		'ListView':'./widgets/ListView',
		'PageListView':'./widgets/PageListView',
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
require(['jquery'],function(){
	console.timeEnd('DOMRENDER');
	require(['IUI'],function(IUI){
		var form;
		window.$=$;
		window.IUI=IUI;
		console.log('Number of elements before render : '+$('body *').length)
		var _a=[{text:'Summner '},{text:'Winter'},{text:'Autunm'},{text:'Moonsoon'}],season=[];
		
		for(var i=0;i<100;++i){
			season.push(_a[i%4]);
		}
		var _b=[{text:'North Indian North Indian'},{text:'South Indian'},{text:'Punjabi'},{text:'Chinese'}], food=[];
		
		for(var i=0;i<100;++i){
			food.push(_b[i%4]);
		}

		var seasonsDataMart=new IUI.DataMart({
			name: 'season-mart',
			data: season,
			schema:{
				idField: 'text',
			},
			persist: true
		});
		
		var name=['ishaan','ravi','priya','nikita','abira','rahul','saurabh','yogeshwar','tanay','adil'];
		var surname=['singh','more','bharti','ikhar','rouchoudhry','padalkar','shak','karad','narkhade','ustad'];
		
		var arr=[];
		
		for(var l=0;l<200;++l){
			arr.push({key: name[Math.floor(Math.random()*name.length)],value:surname[Math.floor(Math.random()*surname.length)]});
		}
		
		
		
		var gridDataMart=new IUI.DataMart({
			name: 'gridMart',
			data: arr,
			schema:{
				idField: 'key'
			}
		});
		
		gridDataMart.fetch();
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
			theme: '#7c9a70 wheat',
			formColor: 'lightblue',
			sliderValue: 0,
			dropDownData: season
		};
		new IUI.EventGroup({
			name :"form-events",
			click: function(e){
				alert(JSON.stringify(form.value()));
			}
		});
		//IUI.setDOMAccessibility(false);
		
	
		
		var containerUI=IUI.makeUI(obj);
			new IUI.ViewModel({
			name: 'ishaan-model',
			model: window.obj
		});
		console.timeEnd('UI creation');
		//console.log(containerUI);
		//form=containerUI.getContainerById('ui-form');
		new IUI.EventGroup({
			name :"toggle-events",
			toggle: function(e){
				alert('toggled');
			},
			persist: true
		});
		
		
		new IUI.EventGroup({
			name :"change-validation-events",
			change: function(e){
				this.validate();
			},
			persist: true
		});
		
		foodDataMart.fetch();
		console.log('Number of elements before render : '+$('body *').length)
		console.timeEnd('ishaan');

});
});
