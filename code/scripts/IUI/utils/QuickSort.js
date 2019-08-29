(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Utils'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var originalIndexArr;
	
	var _defaultComparator = function(a,b){	
		return (a - b)*this.multiplier;
	}
	
	var _defaultStringComparator = function(a,b){	
		return (a<b?(-1):(a === b?(0):(1)))*this.multiplier;
	}
	
	var _defaultBooleanComparator = function(a,b){	
		return ((!a === !b)?0:((!a)?-1:1))*this.multiplier;
	}
	
	var _getStringComparatorForField = function(field, multiplier){
		return function(a,b){	
			return multiplier*(a[field]<b[field]?(-1):(a[field] === b[field]?(0):(1))); 
		}
	}
	
	var _getNumberComparatorForField = function(field, multiplier){
		return function(a,b){	
			return multiplier*(a[field] - b[field]);
		}
	}
	
	var _getBooleanComparatorForField = function(field, multiplier){
		return function(a,b){	
			return multiplier*((!a[field] === !b[field])?0:((!a[field])?-1:1));
		}
	}
	

	var negateComparator = function(comparator){
		return function(){
			return -(comparator.apply(this, arguments));
		}
	}
	
	var _sort = function(array, startIndex, endIndex, comparator){
		
		if(startIndex >= endIndex){
			return;
		}
		var _index = startIndex, pivot = endIndex, _temp, noswap;
		
		for(var i= startIndex; i < endIndex; ++i){
			
			if(comparator(array[i], array[i+1]) < 0 && i+1 < endIndex ){
				_temp 			= array[i];
				array[i] 		= array[i+1];
				array[i+1] 	= _temp;	
				noswap=false;
			}
			
			if(comparator(array[i], array[pivot]) < 0){
				_temp 			= array[i];
				array[i] 		= array[_index];
				array[_index] 	= _temp;
				_index++;
			}	
			
		}
		
			_temp 			= array[_index];
			array[_index]	= array[pivot];
			array[pivot] 	= _temp;
			
		if(noswap /*_index === startIndex */){
		return;
		}
		
		_sort(array, startIndex, _index - 1, comparator);
		_sort(array, _index + 1, endIndex  , comparator);
		
		return array;
	}
	
	
	var getComparator = function(options){
		var multiplier=(options.desc?-1:1);
		if(typeof options === 'undefined'){
			return _defaultComparator.bind({multiplier:multiplier});
		}
		if(options.comparator){
			return options.comparator.bind({multiplier:multiplier});
		}
		
		if(options.field){
			if(!options.dataType || options.dataType === 'number'){
				return _getNumberComparatorForField(options.field, multiplier);
			}else  if(options.dataType === 'boolean'){
				return _getBooleanComparatorForField(options.field, multiplier);
			}else{
				return _getStringComparatorForField(options.field, multiplier);
			}			
		}else{
			if(!options.dataType || options.dataType === 'number'){
				return _defaultComparator.bind({multiplier:multiplier});
			}else  if(options.dataType === 'boolean'){
				return _defaultBooleanComparator.bind({multiplier:multiplier});
			}else{
				return _defaultStringComparator.bind({multiplier:multiplier});
			}
		}
		
		
	}


	var getSortIndexArrayForGroupByField = function(array, field){
		var startIndex=0, arr=[];
		var currentObj=array[0][field];
		for(var i=0;i<array.length;++i){
			if(currentObj !== array[i][field]){
				arr.push({
					startIndex: startIndex,
					endIndex: i-1
				});
				startIndex = i;
				currentObj = array[i][field];
			}
		}
		arr.push({
			startIndex: startIndex,
			endIndex: array.length-1
		});
				
		return arr;
	}
	
	var quickSort = function(array, comparator, options){
	
		if(comparator && typeof comparator !== 'function'){
			options = comparator;
			comparator=null;
		}		
		options = options || {};
		
		if(options.constructor === Array){
			quickSort(array, comparator, options[0]);
			
			for(var i=1;i<options.length;++i){
				
				var _indexArr = getSortIndexArrayForGroupByField(array, options[i-1].field);
				for(var j=0; j<_indexArr.length; ++j){
					options[i].startIndex = _indexArr[j].startIndex;
					options[i].endIndex = _indexArr[j].endIndex;
					quickSort(array, comparator, options[i]);
				}
			}
			
			return array;
		}
		
		comparator = comparator || getComparator(options);
		
		return _sort(array, (options.startIndex || 0), (options.endIndex || array.length-1), comparator);
		
	}

	IUI.registerUtil('quickSort', quickSort);
	

});