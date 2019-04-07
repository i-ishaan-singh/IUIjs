(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','DataItem','Validator'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

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
		events:IUI.Class.prototype.events.concat(['fetch','change']),
		options:{
			autofetch: false,
			data:[],
			schema:{
				idField: 'id',
				textField: 'text'
			}
		},
		state:{
			fetched:false
		},
		addAt: function(index, dataItem){
			if(dataItem.constructor !== IUI.DataItem){
				dataItem=this._processData([dataItem])[0];
			}
			if(this.state.fetched){
				this.data.splice(index,0,dataItem);
				this.trigger('change',{data:this.data, item:dataItem, index: index, type:'add'});
			}else{
				this.options.data.splice(index,0,dataItem);
			}
		},
		get: function(id){
			var _field=this.options.schema.idField;
			if(typeof id === 'object'){
				id = id[_field];
			}
			return this.data.filter(function(elem){
				return elem[_field]===id;
			});
		},
		_remove: function(dataItem){
			var index=this.data.indexOf(dataItem);
			if( index!==-1){
				var _item=this.data.splice(index,1)[0];
				this.trigger('change',{data:this.data, item:_item, index: index, type:'remove'})
			}
		},
		remove: function(dataItem){
			if(dataItem.constructor !== IUI.DataItem){
				dataItem = this.get(dataItem);
			}
			
			if(dataItem.constructor === Array){
				var _length=dataItem.length;
				for(var i=0;i<_length;++i){
					this._remove(dataItem[i]);
				}
			}else{
				this._remove(dataItem);
			}
			
		},
		add: function(dataItem){
			if(dataItem.constructor !== IUI.DataItem){
				dataItem=this._processData([dataItem])[0];
			}
			if(this.state.fetched){
				this.data.push(dataItem)
				this.trigger('change',{data:this.data, item:dataItem, type:'add'});
			}else{
				this.options.data.add(dataItem);
			}
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
		_handleDataItemChange: function(e){
			
		},
		_makeObjectFromRawData: function(rawData){
			var _temp={};
			_temp[this.options.schema.idField]=rawData;
			_temp[this.options.schema.textField]=rawData;
			return _temp;
		},
		_processData: function(data){
			var _data=[],
				_dataLength=data.length;
			for(var i=0;i<_dataLength;++i){
				
				//If the object is preprocessed, leave the object.
				if(data[i].constructor === IUI.DataItem){
					_data.push(data[i]);
					continue;
				}
				//If raw string array is passed, data first needs to be converted to object for use by widget.
				if(typeof data[i] !== 'object'){
					data[i]=this._makeObjectFromRawData(data[i]);
				}
				
				
				_data.push(new IUI.DataItem({
					data: data[i],
					change: this._handleDataItemChange
				}));
			}
			debugger;
			return _data;
		},
		fetch: function(){
			this.data=this._processData(this.options.data);				
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