(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Container'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var DataBoundContainer=IUI.uiContainers.Container.extend({
		name:'DataBoundContainer',
		initialize: function(){
			this._initPromise=$.Deferred();
			IUI.uiContainers.Container.prototype.initialize.apply(this,arguments);
		},
		onInitialize: function(){
			this._initPromise.resolve();
			delete this._initPromise;
		},		
		makeUI: function(){
			if(this.options.datamart){
				IUI.DataMart.bindWidget(this.options.datamart,this);
			}
			IUI.uiContainers.Container.prototype.makeUI.apply(this,arguments);
			this._attachEvents();
		},
		_bindDataMart: function(dataMart){
			this.dataMart=dataMart, that=this;
			
			dataMart._bind({
				fetch: function(dataObject){
					if(that._initPromise){
						that._initPromise.done(function(){
							that.onDataFetch(dataObject)
						});
					}else{
						that.onDataFetch(dataObject)
					}
				},
				change: function(dataObject){
					if(that._initPromise){
						that._initPromise.done(function(){
							that.onDataChange(dataObject)
						});
					}else{
						that.onDataChange(dataObject)
					}
				}
			});			
		},
		onDataFetch:function(dataObject){
			
		},
		onDataChange: function(dataObject){
			
			
		},
		_attachEvents: function(){
			
		}
	});
	
	IUI.WidgetBuilder.plugin(DataBoundContainer);


});