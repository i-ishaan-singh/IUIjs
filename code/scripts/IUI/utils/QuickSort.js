(function (factory) {
   if(typeof define === "function" && define.amd) {    
	define(['IUI-core','Utils'],factory);
	
  } else {
    factory(window.IUI);
  }
})(function(IUI){

	var _defaultComparator = function(a,b){	
		return a - b;
	}
	
	var _defaultStringComparator = function(a,b){	
		return a.toLocaleString().localeCompare(b);
	}
	
	var _defaultBooleanComparator = function(a,b){	
		return (!a === !b)?0:((!a)?-1:1);
	}
	
	var _getStringComparatorForField = function(field){
		return function(a,b){	
			return a[field].toLocaleString().localeCompare(b[field]);
		}
	}
	
	var _getNumberComparatorForField = function(field){
		return function(a,b){	
			return a[field] - b[field];
		}
	}
	
	var _getBooleanComparatorForField = function(field){
		return function(a,b){	
			return (!a[field] === !b[field])?0:((!a[field])?-1:1);
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
		
		var _index = startIndex, pivot = endIndex, _temp;
		
		for(var i= startIndex; i < endIndex; ++i){
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
		
		_sort(array, startIndex, _index - 1, comparator);
		_sort(array, _index + 1, endIndex  , comparator);
		
		return array;
	}
	
	
	var getComparator = function(options){
		if(typeof options === 'undefined'){
			return _defaultComparator;
		}
		if(options.comparator){
			return options.comparator;
		}
		
		if(options.field){
			if(!options.dataType || options.dataType === 'number'){
				return _getNumberComparatorForField(options.field);
			}else  if(options.dataType === 'boolean'){
				return _getBooleanComparatorForField(options.field);
			}else{
				return _getStringComparatorForField(options.field);
			}			
		}else{
			if(!options.dataType || options.dataType === 'number'){
				return _defaultComparator;
			}else  if(options.dataType === 'boolean'){
				return _defaultBooleanComparator;
			}else{
				return _defaultStringComparator;
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
			}
		}
		arr.push({
			startIndex: startIndex,
			endIndex: array.length-1
		});
				
		return arr;
	}
	
	var quickSort = function(array, comparator, options){
	
		if(typeof comparator !== 'function'){
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
		
		comparator = getComparator(options);
		
		return _sort(array, (options.startIndex || 0), (options.endIndex || array.length-1), (options.desc?negateComparator(comparator):comparator));
		
	}

	IUI.registerUtil('quickSort', quickSort);
	

});