/**
 * Created by ford on 6/2/2015.
 */
var RIBExtensions;
(function (ext) {
	'use strict';

	/**
	 *
	 * @param pred
	 * @returns {*}
	 */
	function getComparer(pred) {
		var comp;
		if (isFunction(pred)) {
			comp = pred;
		} else if (isObject(pred)) {
			comp = function (ite) {
				for (var p in pred) {
					if (ite.hasOwnProperty(p) && ite[p] === pred[p]) {
						return true;
					}
				}
				return false;
			};
		} else if (isString(pred)) {
			comp = function (ite) {
				if (typeof ite === 'object') {
					for (var p in ite) {
						if (ite[p] === pred) {
							return true;
						}
					}
				} else if (isString(pred)) {
					return ite === pred;
				}
				return false;
			};
		}
		if (!comp) {
			throw new Error('No comparer available.');
		}
		return comp;
	}

	function isFunction(o) {
		return typeof o === 'function';
	}

	function isString(o) {
		return typeof o === 'string';
	}

	function isObject(o) {
		return typeof o === 'object';
	}

	/**
	 *
	 * @param path
	 * @param value
	 * @param obj
	 */
	ext.setNestedProp = function setNestedProp(path, value, obj) {
		var schema = obj;  // a moving reference to internal objects within obj
		var pList = path.split('.');
		var len = pList.length;
		for (var i = 0; i < len - 1; i++) {
			var elem = pList[i];
			if (!schema[elem]) {
				schema[elem] = {};
			}
			schema = schema[elem];
		}
		schema[pList[len - 1]] = value;
	};
	/**
	 *
	 * @param o
	 * @param s
	 * @param defaultVal
	 * @returns {*}
	 */
	ext.getNestedProp = function getNestedProp(o, s, defaultVal) {
		if (isString(o)) {
			throw new Error('First parameter must be an object.');
		}
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		var result = o;
		for (var i = 0, n = a.length; i < n; ++i) {
			var k = a[i];
			if (result && k in result) {
				result = result[k];
			} else {
				result = o === undefined || o === null ? defaultVal : o;
			}
		}
		return isFunction(result) ? result.call(o) : result;
	};

	ext.move = function arrayMove(arr, old_index, new_index) {
		if (new_index >= arr.length) {
			var k = new_index - arr.length;
			while ((k--) + 1) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr; // for testing purposes
	};
	ext.moveUp = function arrayMoveUp(arr, value, by) {
		var index = arr.indexOf(value),
			newPos = index - (by || 1);

		if (index === -1)
			throw new Error('Element not found in array');

		if (newPos < 0)
			newPos = 0;

		arr.splice(index, 1);
		arr.splice(newPos, 0, value);
	};
	ext.moveDown = function moveDown(arr, value, by) {
		var index = arr.indexOf(value),
			newPos = index + (by || 1);

		if (index === -1)
			throw new Error('Element not found in array');

		if (newPos >= this.length)
			newPos = this.length;

		arr.splice(index, 1);
		arr.splice(newPos, 0, value);
	};
	ext.extend = function arrayExtend(arrTo, arrFrom) {
		if (!Array.isArray(arr)) {
			throw new Error('Argument is not an array.');
		}
		for (var i = 0; i < arr.length; i++) {
			arrTo.push(arr[i]);
		}
	};
	// if(!Array.prototype.forEach){
	//    Array.prototype.forEach = function forEach(fn /*, thisp*/) {
	//        var len = this.length;
	//        if (!isFunction(fn))
	//            throw new TypeError();
	//
	//        var thisp = arguments[1];
	//        for (var i = 0; i < len; i++)
	//        {
	//            if (i in this) {
	//                var res = fn.call(thisp, this[i], i, this);
	//            }
	//            if(res){break;}
	//        }
	//    };
	// }
	// if(!Array.prototype.find && Array.prototype.forEach){
	//    Array.prototype.find = function find(pred){
	//        var self = this;
	//        var comp = getComparer(pred);
	//        var res;
	//
	//        self.forEach(function(item,i){
	//            if(comp(item)){
	//                res = item;
	//                return true;
	//            }
	//        });
	//        return res;
	//    }
	// }
	// if(!Array.prototype.findAll && Array.prototype.forEach){
	//    Array.prototype.findAll = function findAll(pred){
	//        var self = this;
	//        var comp = getComparer(pred);
	//        var resArray = new Array();
	//        self.forEach(function(item){
	//            if(comp(item)){
	//                resArray.push(item);
	//            }
	//        });
	//        return resArray;
	//    }
	// }
	// if(!Array.prototype.findDeep){
	//    Array.prototype.findDeep = function findDeep(pred){
	//        throw new Error('Not implemented yet!');
	//    }
	// }
	// if(!Array.prototype.findIndex && Array.prototype.forEach){
	//    Array.prototype.findIndex = function findIndex(pred){
	//        var self = this;
	//        var comp = getComparer(pred);
	//        var resIndex = -1;
	//        self.forEach(function(item,i){
	//            if(comp(item)){
	//                resIndex = i;
	//                return false;
	//            }
	//        });
	//        return resIndex;
	//    };
	// }
	ext.contains = function contains(arr, pred) {
		var comp = getComparer(pred);
		var res = false;
		arr.forEach(function (item) {
			if (comp(item)) {
				res = true;
				return;
			}
		});
		return res;
	};

})(RIBExtensions || (RIBExtensions = {}));



