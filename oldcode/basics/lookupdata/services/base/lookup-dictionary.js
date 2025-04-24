/**
 * Created by wui on 7/21/2015.
 */

(function(angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';
	
	function LookupDictionary(ignoreUpperOrLowerCase) {
		this.data = {};
		this.ignore = ignoreUpperOrLowerCase;
	}

	LookupDictionary.prototype.add = function (key, value) {
		var isSuccess = false;
		if (this.ignore) {
			key = key.toLowerCase();
		}
		if (!this.data[key]) {
			this.data[key] = value;
			isSuccess = true;
		}
		return isSuccess;
	};

	LookupDictionary.prototype.get = function (key) {
		if (this.ignore) {
			key = key.toLowerCase();
		}
		return this.data[key];
	};

	LookupDictionary.prototype.remove = function (key) {
		var isSuccess = false;
		if (this.ignore) {
			key = key.toLowerCase();
		}
		if (this.has(key)) {
			this.data[key] = null;
			delete this.data[key];
			isSuccess = true;
		}
		return isSuccess;
	};

	LookupDictionary.prototype.update = function (key, value) {
		if (this.ignore) {
			key = key.toLowerCase();
		}
		this.data[key] = value;
	};

	LookupDictionary.prototype.has = function (key) {
		if (this.ignore) {
			key = key.toLowerCase();
		}
		return this.data[key] ? true : false;
	};

	LookupDictionary.prototype.clear = function () {
		this.data = {};
	};

	LookupDictionary.prototype.getLast = function () {
		var keysArr = Object.keys(this.data);
		return this.data[keysArr[keysArr.length -1]];
	};

	LookupDictionary.prototype.each = function (iterator) {
		for (var name in this.data) {
			if (this.data.hasOwnProperty(name)) {
				iterator(this.data[name], name);
			}
		}
	};

	angular.module(moduleName).factory('BasicsLookupdataLookupDictionary', [
		function () {
			return LookupDictionary;
		}
	]);

	// todo: old code using it, delete later.
	$.extend(true, window, {
		'Platform': {
			'Lookup': {
				'Dictionary': LookupDictionary
			}
		}
	});

})(angular);