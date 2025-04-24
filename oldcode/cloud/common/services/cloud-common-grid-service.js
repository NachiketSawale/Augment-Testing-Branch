/**
 * Created by joshi on 28.01.2015.
 */

(function () {

	'use strict';
	/**
	 * @ngdoc service
	 * @name cloudCommonGridService
	 * @function
	 *
	 * @description
	 * cloudCommonGridService is the data service for grid related common functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('cloud.common').factory('cloudCommonGridService', ['platformObjectHelper', function (platformObjectHelper) {

		var service = {};
		var parentFk = -1;

		// get root parentItem of the given item object
		service.getRootParentItem = function(item, mainList, parentProp){
			var parentItem;
			var currItem = item;
			while(currItem && currItem[parentProp] !== null) {
				var currParent = _.find(mainList, {Id : currItem[parentProp]});
				currItem = currParent;
			}
			parentItem = currItem;
			return parentItem;
		};

		// get root parent Id of the given item object
		service.getRootParentFk = function(item, mainList, parentProp){
			var parentFk;
			var currItem = item;
			while(currItem && currItem[parentProp] !== null) {
				var currParent = _.find(mainList, {Id : currItem[parentProp]});
				currItem = currParent;
			}
			parentFk = currItem.Id;
			return parentFk;
		};

		//get parentFk for the given item object
		service.getParentFk = function(item, mainItemList, childProp){
			var pItem = {};
			if(item[childProp] !== null && mainItemList && mainItemList.length > 0){
				pItem = _.find(mainItemList, {Id : item[childProp]});
				if(pItem && pItem.nodeInfo.level !== 0){
					service.getParentFk(pItem);
				}
				else{
					parentFk = pItem.Id;
				}
			}
			else{
				parentFk = item.Id;
			}
			return parentFk;
		};

		//get parentItems of entity
		service.getParentItems = function getParentItems(input, output, parentProp, mainItemList){
			var pItem = {};

			if(input[parentProp] !== null && mainItemList && mainItemList.length > 0){
				pItem = _.find(mainItemList, {Id : input[parentProp]});
				if(pItem &&  pItem[parentProp] !== null){
					output.push(pItem);
					service.getParentItems(pItem, output, parentProp, mainItemList );
				}
				else{
					output.push(pItem);
				}
			}
			else{
				output.push(input);
			}
			return output;
		};
		
		//get flatten list of direct children or subitem of the object
		service.getDirectChildren = function getDirectChildren(item, childProp, parentProp){
			var childList = [];
			var list =[];
			if(item){
				if (item.hasOwnProperty(childProp) && item.childProp !== null) {
					service.flatten(item[childProp], childList, childProp);
					if(childList.length > 0){
						angular.forEach(childList, function(cl){
							if(item.Id === cl[parentProp]){
								list.push(cl);
							}
						});
					}
				}
			}
			return list;
		};

		//get flatten list of all children or subitems of the object
		service.getAllChildren = function getAllChildren(item, childProp){
			var childList = [];
			if(item){
				if (item.hasOwnProperty(childProp) && item[childProp] !== null) {
					service.flatten(item[childProp], childList, childProp);
				}
			}
			return childList;
		};

		//flatten array of objects
		service.flatten = function flatten(input, output, childProp) {
			var i;
			for (i = 0; i < input.length; i++) {
				output.push(input[i]);
				if (input[i][childProp] && input[i][childProp].length > 0) {
					service.flatten(input[i][childProp], output, childProp);
				}
			}
			return output;
		};

		//sorting for heirarchical list
		// input - list of items and fieldName - field to sort
		service.sortTree = function sortTree(items, field, childProp) {
			service.sortList(items, field);
			_.forEach(items, function(item) {
				if (item[childProp] && item[childProp].length > 0) {
					service.sortTree(item[childProp], field, childProp);
				}
			});
		};

		//sorting for flat list
		// input - list of items and fieldName - field to sort
		service.sortList = function sortList(items, field) {
			items.sort(function (a, b) {
				var valueA = platformObjectHelper.getValue(a, field);
				var valueB = platformObjectHelper.getValue(b, field);

				if (valueA === null || valueA === '') {
					return 1;
				}
				if (valueB === null || valueB === '') {
					return -1;
				}
				var a1 = ('' + valueA).toLowerCase();
				var b1 = ('' + valueB).toLowerCase();

				// Special case: if both values are integers do a integer comparison instead of a string comparison.
				// First check if the values are valid positive integers
				var aIsValidInt = /^\d+$/.test(valueA);
				var bIsValidInt = /^\d+$/.test(valueB);

				if(aIsValidInt && !bIsValidInt){
					return -1; // Only first value is valid integer
				}
				else if(!aIsValidInt && bIsValidInt){
					return 1;  // Only second value is valid integer
				}
				else if(aIsValidInt && bIsValidInt){
					// Both values are valid integers -> do numeric comparison
					a1 = parseInt(valueA, 10);
					b1 = parseInt(valueB, 10);
				}

				if (a1 < b1) {
					return -1;
				}
				if (a1 > b1) {
					return 1;
				}
				return 0;
			});
		};

		/**
		 * @ngdoc function
		 * @name addPrefixToProperties
		 * @function
		 * @description Adds the given prefix to all keys of the given original object and returns a copy of this object with the prefixed keys
		 * @param {Object} original object whose keys are to be prefixed
		 * @param {String} prefix that's to be added to the keys of the copied renamed object
		 * @returns {Object} copy of the original whose keys are prefixed
		 */
		service.addPrefixToKeys = function addPrefixToKeys(original, prefix){

			if(angular.isUndefined(original) || original === null || !angular.isString(prefix)){
				return original;
			}

			var renamed = {};
			var renamedKey;

			_.each(original, function(value, key) {
				renamedKey = prefix + '.' + key;
				renamed[renamedKey] = value;
			});

			return renamed;
		};

		return service;
	}]);
})();



