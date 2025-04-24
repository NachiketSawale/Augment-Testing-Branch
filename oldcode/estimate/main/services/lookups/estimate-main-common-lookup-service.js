/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCommonLookupService
	 * @function
	 *
	 * @description
	 * estimateMainCommonLookupService
	 */
	angular.module(moduleName).factory('estimateMainCommonLookupService', ['cloudCommonGridService',
		function (cloudCommonGridService) {

			let service = {};

			service.getSearchData = function getSearchData(filterParams, cacheData, childProp, parentProp, isTree){
				let searchFunc = function(item) {
					let code = {},
						description = {};

					// eslint-disable-next-line no-prototype-builtins
					if(isTree && item.hasOwnProperty(childProp)){
						item[childProp] = [];
					}

					// eslint-disable-next-line no-prototype-builtins
					if (item.hasOwnProperty(filterParams.codeProp) && item[filterParams.codeProp] !== null) {
						code = item[filterParams.codeProp].toLowerCase();
					}

					if (filterParams.descriptionProp && _.get(item, filterParams.descriptionProp) !== null) {
						let desc = _.get(item, filterParams.descriptionProp) || _.get(item, 'Description');
						description = desc ? desc.toLowerCase() : '';
					}

					if (filterParams.isSpecificSearch) {
						if (filterParams.field === filterParams.descriptionProp){
							return _.startsWith(description, filterParams.searchValue.toLowerCase());
						}
						return _.startsWith(code, filterParams.searchValue.toLowerCase());
					} else {
						return _.includes(code, filterParams.searchValue.toLowerCase()) || _.includes(description, filterParams.searchValue.toLowerCase());
					}
				};

				let existItems = [];
				if(isTree) {
					_.each(angular.copy(cacheData), function (item) {
						let itemList = [];
						let tempList1 = [];
						let tempList2 = [];
						tempList1.push(item);
						cloudCommonGridService.flatten(tempList1, tempList2, childProp);
						let existList = _.filter(tempList2, searchFunc);
						if (existList && existList.length > 0) {
							angular.forEach(existList, function (existItem) {
								cloudCommonGridService.getParentItems(existItem, itemList, parentProp, tempList2);
								existItem[childProp] = [];
								existItems.push(existItem);
							});
							itemList = _.filter(itemList, function(i){
								// eslint-disable-next-line no-prototype-builtins
								return i && i.hasOwnProperty('Id');
							});
							existItems = existItems.concat(_.uniqBy(itemList, 'Id'));
							return item;
						}
					});
				}
				else {
					existItems = _.filter(_.uniq(cacheData, 'Id'), searchFunc);
				}

				return _.uniq(existItems, 'Id');
			};

			service.getDefaults = function getDefaults(configDefaults){
				let defaults = {
					lookupType: configDefaults.lookupType,
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: 'configDefaults.uuid',
					columns: [
						{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
						{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityDescription' },
						{ id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'quantity', name$tr$: 'cloud.common.entityQuantity'},
						{ id: 'qtyuom', field: 'UoMFk', name: 'UomFk', width: 120, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
							formatterOptions: {lookupType: 'uom', displayMember: 'Unit' }}
					],
					width: 660,
					height: 200,
					treeOptions: {
						parentProp: configDefaults.parentProp,
						childProp: configDefaults.childProp,
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
					title: { name: configDefaults.name },
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						return searchValue;
					},
					onDataRefresh: configDefaults.onDataRefresh
				};

				return defaults;
			};

			return service;
		}]);
})();

