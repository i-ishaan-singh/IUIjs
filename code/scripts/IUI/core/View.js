(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','ContainerUI'],factory);
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	
	var viewPromiseMap = {
		
	}

	var viewContexts = {
		default:{
			view: {},
			viewport: {}
		}
	}
	
	var View = IUI.ContainerUI.extend({
		name:'View',
		events: IUI.ContainerUI.prototype.events.concat(['render','append']),
		initialize: function(options){
			this._uid=IUI.getUID();
			$(options.element).removeAttr('viewmodel').removeAttr('name').removeAttr('datamart').removeAttr('eventgroup')
				.addClass('i-ui-exhibit');
			if(options.name){
				viewContexts[options.context || this.options.context].view[options.name]=this;
			}	
			this.name = options.name;
			this._initPromise=$.Deferred();
			if(options.templateurl){
				var that=this, _arguments=arguments;
				var _clone = $(options.element).clone().empty();
				_clone.load(options.templateurl, function(){
					that.template = '<container'+_clone[0].outerHTML.slice(5,-5)+'container>'
					IUI.ContainerUI.prototype.initialize.apply(that,_arguments);	
					that.makeUI();
					that.bindModels();
					that._initPromise.resolve();
				});
			}else{
				this.template = '<container'+options.element.outerHTML.slice(5,-5)+'container>';
				IUI.ContainerUI.prototype.initialize.apply(this,arguments);	
				this.makeUI();
				this.bindModels();
				this._initPromise.resolve();
			}
		},	
		options:{
			context: 'default'
		},
		_honorViewPromise: function(){
			var _name = IUI.View.getName(this),
				viewPromise = viewPromiseMap[_name] || viewPromiseMap[this._uid];
			if( viewPromise ){
				IUI.View.renderViewInViewport(this, viewPromise);
				delete viewPromiseMap[_name];
				delete viewPromiseMap[this._uid];
			}
		},
		_handleviewmodelChange:function(value){
			if(!this.bound && typeof value === 'string'){
				IUI.ViewModel.bindView(value, this);
				this.bound=true;
			}else if(typeof value == 'object'){
				this._modelReady = true;
				this._honorViewPromise();
			}
		},
		render:function(){
			this.container=IUI.makeUI(this.template, this.options.viewmodel);
			this.$el=this.container.$element;
			this.trigger('render');
		},
		bindModels: function(){
			IUI.ContainerUI.prototype.bindModels.apply(this,arguments);
			if(typeof this.options.viewmodel === 'undefined'){
				this.options.viewmodel = this.options.model;
				this._modelReady = true;
				this._honorViewPromise();
			}if(typeof this.options.viewmodel == 'string'){
				if(this.options.viewmodel.match(IUI._observableRegex)){
					return;
				}else if(!this.bound){
					IUI.ViewModel.bindView(this.options.viewmodel, this);
					this.bound=true;
				}
			}else if(typeof this.options.viewmodel == 'object'){
				this._modelReady = true;
				this._honorViewPromise();
			}
		},
		_bindViewModel: function(viewModel){
			viewModel.boundViews.push(this);
			this.options.viewmodel = viewModel.model;
			this._modelReady = true;
			this._honorViewPromise();
		},
		makeUI: function(){
			if($(this.element).parent().length)
				this.element.outerHTML='<span class="ghost-span"></span>';
			this.element=null;
		},
		destroy: function(){
			this.container.destroy();
			this.container.$element.remove();
			this.container=null;
			this.$el=null;
			this.bound=false;
		}
		
	});
	

	IUI.View = function(){
		
	}
	
	IUI.View.getView = function(viewName){
		if(typeof viewName === 'object'){
			if(viewName.constructor === View){
					return viewName;
			}else{
				return;
			}			
		}
		
		var _name=viewName.split(':'),
			name = _name[0],
			context = _name[1];
			
		return viewContexts[context || 'default'].view[name];	
	}
	IUI.View.getViewport = function(viewportName){
		
		if(typeof viewportName === 'object'){
			if(viewportName.constructor === IUI.uiContainers.Viewport){
				return viewportName;
			}else{
				return;
			}
		}
		
		var _name=viewportName.split(':'),
			name = _name[0],
			context = _name[1];
			
		return viewContexts[context || 'default'].viewport[name];	
	}
	
	IUI.View.registerViewport = function(viewport){
		var context = viewport.options.context,
			name = viewport.options.name;
			
		if(name){
			viewContexts[context].viewport[name]=viewport;	
		}
	}
	
	IUI.View.getName = function(view){
		if(view.options.name){
			return view.options.name + ':' +view.options.context;
		}else{
			return view._uid;
		}
	}
	
	
	IUI.View.renderViewInViewport = function(view , viewport){
		_view = IUI.View.getView(view);
		_viewport = IUI.View.getViewport(viewport);
		if(_view && _view._modelReady){
			if(!_view.$el){
				_view.render();
			}
			if(_viewport){
				_viewport.$element.children().detach();
				_viewport.$element.append(_view.$el);
				_viewport._currentView=_view;
				_view._initPromise.then(function(){
					_view.trigger('append');					
				});
			}
		}else if(_view){
			viewPromiseMap[IUI.View.getName(_view)] = viewport;
		}else{
			if(typeof view === 'string'){
				var _name=view.split(':'),
					name = _name[0],
					context = _name[1] || 'default';
				}
			viewPromiseMap[name+':'+context] = viewport;
		}
		
	}
	
	
	
	
	IUI.WidgetBuilder.plugin(View);

});