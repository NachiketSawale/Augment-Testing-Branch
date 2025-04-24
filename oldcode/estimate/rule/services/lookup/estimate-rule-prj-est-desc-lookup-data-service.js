/**
 * Created by Joshi on 01.12.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.rule';
	/**
	 * @ngdoc service
	 * @name estimateRulePrjEstDescLookupDataService
	 * @function
	 *
	 * @description
	 * estimateRulePrjEstDescLookupDataService is the data service for estimate project rules description list
	 */
	angular.module(moduleName).factory('estimateRulePrjEstDescLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		'estimateMainService', 'ServiceDataProcessArraysExtension',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, estimateMainService, ServiceDataProcessArraysExtension) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateRulePrjEstDescLookupDataService', {
				valMember: 'Code',
				dispMember: 'DescriptionInfo.Description',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '9f56786aa4a841eabc4a3c8f316a2100',
				filter: function() {
					return estimateMainService.getSelectedProjectId();
					// return $injector.get('estimateMainService').getSelectedProjectId();
				}
			});

			let estRulePrjEstRuleDescLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/', endPointRead: 'lookuplist'},
				filterParam: 'projectId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['PrjEstRule'])],
				tree: { parentProp: 'PrjEstRuleFk', childProp: 'PrjEstRule' ,
					incorporateDataRead: function incorporateDataRead(readItems, data) {
						let result = readItems.EstRulesEntities;
						result = result.concat(readItems.PrjEstRulesEntities);
						let cnt = 0;
						angular.forEach(result, function(item){
							item.MainId = angular.copy(item.Id);
							item.Id = ++cnt;
						});
						serviceContainer.data.sortByColumn(result);
						return serviceContainer.data.handleReadSucceeded(result, data);
					}}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(estRulePrjEstRuleDescLookupDataServiceConfig);

			let estRulePrjEstDescService = serviceContainer.service;

			estRulePrjEstDescService.getPrjEstRuleList = function getPrjEstRuleList() {
				serviceContainer.data.setFilter(function() {
					return estimateMainService.getSelectedProjectId();
				});
				return estRulePrjEstDescService.getList({ lookupType: 'estimate/rule/projectestimaterule/' });
			};

			return estRulePrjEstDescService;
		}]);
})(angular);
