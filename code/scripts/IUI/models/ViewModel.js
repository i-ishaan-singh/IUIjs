(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','DataItem','Validator'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var bindViewModel=function(viewModel){
		var name=viewModel.name;
		if(ViewModel._viewBindings[name] && ViewModel._viewBindings[name].length){
			var length=ViewModel._viewBindings[name].length;
			for(var i=0;i<length;++i){
				ViewModel._viewBindings[name][i](viewModel.model);
			}
			if(viewModel.persist){
				ViewModel._modelBindings[name]=viewModel;
				ViewModel._viewBindings[name]=[];
			}else{
				delete ViewModel._viewBindings[name];
			}
		}else{
			ViewModel._modelBindings[name]=viewModel;
		}
	}
	
	var ViewModel=IUI.Class.extend({
		classType: 'ViewModel',
		options:{
			persist: true
		},
		initialize: function(options){
			this.boundViews=[];
			this.persist=options.persist;
			this.name=options.name;
			this.model=options.model;
			bindViewModel(this);
		},
		updateModel: function(_newModel){
			if(this.model.__update){
				this.model.__update(_newModel);
			}else{
				this.model=_newModel;
				this.boundViews.forEach(function(view){
						view.options.viewmodel=_newModel;
				});
			}
		}
	});
	
	ViewModel.bindView=function(name,view){
		
		if(ViewModel._modelBindings[name]){
			view._bindViewModel(ViewModel._modelBindings[name]);
			if(!ViewModel._modelBindings[name].persist){
				delete ViewModel._modelBindings[name];
			}
		}else{
			if(!ViewModel._viewBindings[name]){
				ViewModel._viewBindings[name]=[]
			}
			ViewModel._viewBindings[name].push(view._bindViewModel.bind(view));		
		}
	}
	
	ViewModel._modelBindings={};
	
	ViewModel._viewBindings={};

	IUI.ViewModel=ViewModel;
});