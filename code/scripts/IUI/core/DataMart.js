define(['IUI-core','WidgetBuilder','Validator'],function(IUI){

	var bindDataMart=function(dataMart){
		var name=dataMart.name;
		if(DataMart._widgetBindings[name] && DataMart._widgetBindings[name].length){
			var length=DataMart._widgetBindings[name].length;
			for(var i=0;i<length;++i){
				DataMart._widgetBindings[name][i](dataMart);
			}
			if(dataMart.state.fetched)
				dataMart.trigger('fetch',{data:dataMart.data});
			
			if(dataMart.persist){
				DataMart._dataBindings[name]=dataMart;
				DataMart._widgetBindings[name]=[];
			}else{
				delete DataMart._widgetBindings[name];
			}
		}else{
			DataMart._dataBindings[name]=dataMart;
		}
	}

	
	
	var DataMart=IUI.Class.extend({
		classType: 'DataMart',
		events:IUI.Class.prototype.events.concat(['fetch','binding','bound']),
		options:{
			autofetch: false,
			data:[]
		},
		state:{
			fetched:false
		},
		initialize: function(options){
			IUI.Class.prototype.initialize.apply(this,arguments);		
			this.preserve=this.options.preserve;
			this.name=this.options.name;
			if(this.options.autofetch){
				this.fetch();
			}
			bindDataMart(this);
		},		
		fetch: function(){
			this.data=this.options.data;				
			this.trigger('fetch',{data:this.data});
			this.state.fetched=true;
		}
		
		
	});
	
	DataMart.bindWidget=function(name,widget){
		
		if(DataMart._dataBindings[name]){
			widget._bindDataMart(DataMart._dataBindings[name]);
			if(DataMart._dataBindings[name].state.fetched)
				DataMart._dataBindings[name].trigger('fetch',{data:DataMart._dataBindings[name].data});
			if(!DataMart._dataBindings[name].persist){
				delete DataMart._dataBindings[name];
			}
		}else{
			if(!DataMart._widgetBindings[name]){
				DataMart._widgetBindings[name]=[]
			}
			DataMart._widgetBindings[name].push(widget._bindDataMart.bind(widget));		
		}
	}
	
	DataMart._dataBindings={};
	
	DataMart._widgetBindings={};

	IUI.DataMart=DataMart;
});