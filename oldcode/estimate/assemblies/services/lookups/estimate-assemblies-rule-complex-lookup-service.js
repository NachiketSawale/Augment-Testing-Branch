/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateAssemblyRuleComplexLookupService
	 * @function
	 *
	 * @description
	 * estimateRuleComplexLookupService provides all lookup data for estimate Rules complex lookup
	 */
	angular.module(moduleName).factory('estimateAssembliesRuleComplexLookupService', ['$http', '$q', '$injector','_', 'estimateMainCommonLookupService',
		function ( $http, $q, $injector, _, estimateMainCommonLookupService) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estRuleFlatItems:[], // flat item list
				estRuleItems:[] // tree item list, nested
			};

			function getEstRuleItems(){
				return $http.get(globals.webApiBaseUrl + 'estimate/rule/estimaterule/list');
			}

			// build tree data
			function buildDataToTree(flatList) {
				let context = {
					treeOptions:{
						parentProp : 'EstRuleFk',
						childProp : 'EstRules'
					},
					IdProperty: 'Id'
				};
				return $injector.get('basicsLookupdataTreeHelper').buildTree(flatList, context);
			}

			// get data list of the estimate RuleCode items in tree format
			function getList() {
				return lookupData.estRuleItems; // tree list
			}
			function getFlatList() {
				// let list = lookupData.estRuleItems;
				// let output = [];
				// if(list && list.length>0){
				// cloudCommonGridService.flatten(list, output, 'CustomEstRules');
				// }
				return lookupData.estRuleFlatItems;
			}

			service.filterRuleIsForBoQ = function filterRuleByBoq(rules){
				return _.filter(rules, {IsForEstimate : true});
			};

			service.clearChildren = function(rules){
				if(angular.isArray(rules)){
					_.forEach(rules, function(item){
						item.EstRules = null;
					});
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync() {
				return getEstRuleItems().then(function(response){
					service.clearChildren(response.data);
					lookupData.estRuleFlatItems = service.filterRuleIsForBoQ(_.sortBy(response.data, ['Sorting', 'Code']));
					lookupData.estRuleItems = service.filterRuleIsForBoQ(buildDataToTree(lookupData.estRuleFlatItems));
					return lookupData.estRuleItems;
				});
			};

			service.getItemById = function getItemById(id) {
				return _.find(getFlatList(), {'Id': id}) || {};
			};

			// get list of the estimate RuleCode item by Id
			service.getItem4ChangeSequence = function getItem4ChangeSequence(value) {
				if(!value){return;}
				let items = [];
				let list = getFlatList();
				if(list && list.length>0){
					// list = cloudCommonGridService.flatten(list, output, 'CustomEstRules');
					for (let i = 0; i < list.length; i++) {
						for (let j = 0; j < value.length; j++) {
							if (list[i].Code === value[j].Code) {
								items.push(list[i]);
								break;
							}
						}
					}
				}
				items = _.sortBy(items, ['Code']);
				return _.uniq(items, 'Code');
			};

			// get list of the estimate RuleCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if(lookupData.estRuleItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if(!lookupData.estRuleItemsPromise) {
						lookupData.estRuleItemsPromise = service.getListAsync();
					}

					return lookupData.estRuleItemsPromise.then(function(){
						lookupData.estRuleItemsPromise = null;
						return service.getItemById(value);
					});
				}
			};

			service.refresh = function () {
				return service.getListAsync();
			};

			function getIconValuesByIds(ids) {
				return _.map(getFlatList().filter(function(e) {
					return _.includes(ids, e.Id);
				}), 'Icon');
			}

			// clear lookup data
			service.clear = function(){
				lookupData.estRuleItems = [];
			};

			function getSearchList(value) {
				let list = getList();
				let searchRs = [];
				if (list && list.length > 0) {
					if (value) {
						let filterParams = {
							'codeProp': 'Code',
							'descriptionProp': 'DescriptionInfo.Translated',
							'isSpecificSearch': null,
							'searchValue': value
						};
						searchRs = estimateMainCommonLookupService.getSearchData(filterParams, list, 'EstRules', 'EstRuleFk', true);
					} else {
						searchRs = list;
					}
				}

				return $q.when(searchRs);
			}

			return angular.extend(service, {
				getSearchList: getSearchList,
				getList: getList,
				getFlatList: getFlatList,
				getIconValuesByIds: getIconValuesByIds
			});
		}]);
})();
