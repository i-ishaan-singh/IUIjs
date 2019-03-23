(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var DataBoundContainer=IUI.uiContainers.Container.extend({
		name:'DataBoundContainer',
		makeUI: function(){
			if(this.options.datamart){
				IUI.DataMart.bindWidget(this.options.datamart,this);
			}
			IUI.uiContainers.Container.prototype.makeUI.apply(this,arguments);
		},
		_bindDataMart: function(dataMart){
			this.dataMart=dataMart;
			dataMart._bind({
				fetch:this.onDataFetch.bind(this),
				change:this.onDataChange.bind(this)
			});			
		},
		onDataFetch:function(dataObject){
			
		},
		onDataChange: function(dataObject){
			
			
		},
	});
	
	IUI.WidgetBuilder.plugin(DataBoundContainer);


});