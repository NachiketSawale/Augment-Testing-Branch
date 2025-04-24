/**
 * Created by joshi on 19.01.2016.
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleCodeLookupService
	 * @function
	 *
	 * @description
	 * estimateRuleCodeLookupService provides all lookup data for estimate module RuleCode lookup
	 */
	angular.module(moduleName).factory('estimateRuleCodeLookupService', ['$http', '$q', 'basicsLookupdataLookupDescriptorService', 'cloudCommonGridService',
		function ( $http, $q, basicsLookupdataLookupDescriptorService, cloudCommonGridService) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estRuleCodeItems:[]
			};

			let getEstRuleCodeItems = function(){
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/treeWithoutFilter');
			};

			// get flatten rules
			let getFlattenRule = function getFlattenRule(data){
				let output = [];
				return cloudCommonGridService.flatten(data, output, 'EstRules');
			};

			// get data list of the estimate RuleCode items
			service.getList = function getList() {
				if(lookupData.estRuleCodeItems.length >0){
					return lookupData.estRuleCodeItems;
				}
				else{
					getEstRuleCodeItems().then(function(response){
						lookupData.estRuleCodeItems = getFlattenRule(response.data);
						return lookupData.estRuleCodeItems;
					});
				}
			};

			// get data list of the estimate RuleCode items
			service.getListAsync = function getListAsync() {
				if(lookupData.estRuleCodeItems && lookupData.estRuleCodeItems.length >0){
					return $q.when(lookupData.estRuleCodeItems);
				}
				else{
					return getEstRuleCodeItems().then(function(response){
						lookupData.estRuleCodeItems = getFlattenRule(response.data);
						return lookupData.estRuleCodeItems;
					});
				}
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value) {
				let item = {};
				let list = lookupData.estRuleCodeItems;
				if (list && list.length > 0) {
					for (let i = 0; i < list.length; i++) {
						if (list[i].Code === value) {
							item = list[i];
							break;
						}
					}
				}
				return item;
			};

			// get list of the estimate RuleCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if(lookupData.estRuleCodeItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if(!lookupData.estRuleCodeItemsPromise) {
						lookupData.estRuleCodeItemsPromise = service.getListAsync();
					}
					return lookupData.estRuleCodeItemsPromise.then(function(data){
						lookupData.estRuleCodeItemsPromise = null;
						lookupData.estRuleCodeItems = getFlattenRule(data);
						return service.getItemById(value);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function(){
				getEstRuleCodeItems().then(function(response){
					lookupData.estRuleCodeItems = getFlattenRule(response.data);
					return lookupData.estRuleCodeItems;
				});
			};

			// General stuff
			service.reload = function(){
				service.loadLookupData();
			};

			service.getEstRuleCodeItems = function(){
				return lookupData.estRuleCodeItems;
			};
			return service;
		}]);
})();
