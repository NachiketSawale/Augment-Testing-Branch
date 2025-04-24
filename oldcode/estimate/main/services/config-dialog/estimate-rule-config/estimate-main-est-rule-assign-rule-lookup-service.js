/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainEstRuleAssignRuleLookupService
     * @function
     *
     * @description
     * estimateMainEstRuleAssignRuleLookupService provides all lookup data for estimate rule assign dialog Rule lookup
     */
	angular.module(moduleName).factory('estimateMainEstRuleAssignRuleLookupService', [
		'$http', '$injector', '$q', 'basicsLookupdataLookupDescriptorService', 'cloudCommonGridService',
		function ( $http, $injector, $q, basicsLookupdataLookupDescriptorService, cloudCommonGridService) {

			// Object presenting the service
			let service = {};
			let lineItemContextId = -1;

			// private code
			let lookupData = {
				estRuleItems:[],
				estRuleItemsTree: []
			};

			let getEstRuleCodeItems = function(){
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/treeByLineItemContext', { MdcLineItemContextFk: lineItemContextId } );
			};

			// get flatten rules
			let getFlattenRule = function getFlattenRule(data){
				let output = [];
				return cloudCommonGridService.flatten(data, output, 'EstRules');
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList() {
				let defer = $q.defer();
				if(lookupData.estRuleItems.length >0){
					defer.resolve(lookupData.estRuleItems);
				}
				else{
					getEstRuleCodeItems().then(function(response){
						lookupData.estRuleItemsTree = angular.copy(response.data);
						lookupData.estRuleItems = getFlattenRule(response.data);
						defer.resolve(lookupData.estRuleItems);
					});
				}
				return defer.promise;
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync() {
				if(lookupData.estRuleItems && lookupData.estRuleItems.length >0){
					return $q.when(lookupData.estRuleItems);
				}
				else{
					return getEstRuleCodeItems().then(function(response){
						lookupData.estRuleItemsTree = angular.copy(response.data);
						lookupData.estRuleItems = getFlattenRule(response.data);
						return lookupData.estRuleItems;
					});
				}
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value) {
				let item = null;
				let list = lookupData.estRuleItems;
				if(list && list.length>0){
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item;
			};

			// get list of the estimate RuleCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if(lookupData.estRuleItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if(!lookupData.estRuleCodeItemsPromise) {
						lookupData.estRuleCodeItemsPromise = service.getListAsync();
					}
					return lookupData.estRuleCodeItemsPromise.then(function(data){
						lookupData.estRuleCodeItemsPromise = null;
						lookupData.estRuleItems = getFlattenRule(data);
						return service.getItemById(value);
					});
				}
			};

			service.getItemByKey = service.getItemByIdAsync;

			// estimate look up data service call
			service.loadLookupData = function(){
				getEstRuleCodeItems().then(function(response){
					lookupData.estRuleItemsTree = angular.copy(response.data);
					lookupData.estRuleItems = getFlattenRule(response.data);
					return lookupData.estRuleItems;
				});
			};

			// General stuff
			service.reload = function(){
				clear();

				let rootAssignTypeConfig = $injector.get('estimateMainEstRuleDataService').getRootAssignConfig();
				if (!_.isEmpty(rootAssignTypeConfig)){
					lineItemContextId = rootAssignTypeConfig.LineitemcontextFk;
				}
				service.loadLookupData();
			};

			service.getEstRuleCodeItems = function(){
				return lookupData.estRuleItems;
			};

			function getSearchListFn(value) {
				let defer = $q.defer();

				let searchRs = [];
				let listAsync = service.getList();

				listAsync.then(function(list){
					if (list && list.length > 0) {
						if (value) {
							let filterParams = {
								'codeProp': 'Code',
								'descriptionProp': 'DescriptionInfo.Translated',
								'isSpecificSearch': null,
								'searchValue': value
							};
							// searchRs = $injector.get('estimateMainCommonLookupService') .getSearchData(filterParams, list, 'EstRules', 'EstRuleFk', false);
							searchRs = $injector.get('estimateMainCommonLookupService') .getSearchData(filterParams, lookupData.estRuleItemsTree, 'EstRules', 'EstRuleFk', true);

							defer.resolve(searchRs);
						} else {
							searchRs = list;
							defer.resolve(searchRs);
						}
					}
				});

				return defer.promise;
				// return $q.when(searchRs);
			}

			service.getSearchList = function getSearchList(searchString/* , displayMember, scope, searchSettings */){
				return getSearchListFn(searchString);
			};

			function clear(){
				lineItemContextId = -1;

				// private code
				lookupData = {
					estRuleItems:[],
					estRuleItemsTree: []
				};
			}

			return service;
		}]);
})();
