define(['../IUI-core.js'],function(IUI){

/* ------ IUI.WidgetBuilder.js ----------------- */

	var _extractAttribute=function(object,attribute){
		object[attribute.name]=attribute.value;
		return object;
	}
	
	IUI.uiWidgets={}
	IUI.uiContainers={}
	
	
	/**
	* The basic Object which will hold all the API's related to creation of the Widgets and ContainerUI's
	*/	
	var WidgetBuilder={
		widgetList:{},
		containerList:{}
	};
	
	/**
	* This API Bounded with the Widget Class is used to create new Widgets from the DOM Elements
	* @param {Element} element - The DOM Element from where the options are extracted while creation of the UI.
	* @param {Element} container - the container in which the widget is contained.
	*/
	var _buildWidget=function(element,container){
		var options=Array.prototype.slice.call(element.attributes).reduce(_extractAttribute,{});
		options.element=element;	
		options.container=container || document.body;			
		return new this(options);
	}
	
	/**
	* This API plugs' in the Extended Widgets and ContainerUI's to the WidgetBuilder.
	*/
	WidgetBuilder.plugin=function(widget){
		var tagName=widget.prototype.name;
		if(tagName){
			if(widget.prototype.classType==="ContainerUI"){
				IUI.uiContainers[tagName]=widget;
				WidgetBuilder.containerList[String(tagName).toUpperCase()]=_buildWidget.bind(widget);
			}else{
				IUI.uiWidgets[tagName]=widget;
				WidgetBuilder.widgetList[String(tagName).toUpperCase()]=_buildWidget.bind(widget);
			}
		}
	}
	
		
	IUI.WidgetBuilder=WidgetBuilder;
	
/* ------- END : IUI.WidgetBuilder.js -----------*/


});