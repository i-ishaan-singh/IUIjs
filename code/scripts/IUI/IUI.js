(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core',
		'Behaviors',
		'WidgetBuilder',	
		'Validator',
		'ObservableModel',
		'OptionModel',
		'ContainerModel',
		'Container',
		'VerticalScroller',
		'Layout',
		'Sidebar',
		'Navbar',
		'Footer',
		'Widget',
		'ContainerUI',
		'Overlay',
		'InputBox',
		'Button',
		'Switch',
		'Slider',
		'ToggleButton',
		'SubmitButton',
		'FormLabel',
		'Radio',
		'NumericInputBox',
		'ComboBox',
		'DropDown',
		'Exhibit',
		'Form',
		'RadioGroup'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
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
		
	IUI.makeUI=function makeUI(elem,model){
		if(elem && (elem.constructor === Object || elem.classType==="ObservableModel")){
			model=elem;
			elem=null;
		}
		if(model && model.classType!=="ObservableModel"){
			model=new IUI.ContainerModel(model);			
		}
		(elem) || (elem='body');
		var element=$(elem)[0];
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{
			element: element,
			model: model
		})
		
		var uiContainer= new IUI.ContainerUI(options);
	
		uiContainer.makeUI();
		return uiContainer;
	}
	
	var _extractAttribute=function(object,attribute){
		object[attribute.name]=attribute.value;
		return object;
	}
	
	IUI.makeUIAsync=function makeUI(elem,model){
		if(elem && (elem.constructor === Object || elem.classType==="ObservableModel")){
			model=elem;
			elem=null;
		}
		if(model && model.classType!=="ObservableModel"){
			model=new IUI.ContainerModel(model);			
		}
		(elem) || (elem='body');
		var element=$(elem)[0];
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{
			element: element,
			model: model,
			async: true
		})
		
		var uiContainer= new IUI.ContainerUI(options);		
		uiContainer.makeUI();
		return uiContainer;
	}
	
	
	return IUI;

});