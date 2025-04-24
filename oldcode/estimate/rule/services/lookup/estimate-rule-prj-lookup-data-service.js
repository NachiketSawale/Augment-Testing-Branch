/**
 * Created by Joshi on 18.01.2016.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateRulePrjLookupDataService
	 * @function
	 *
	 * @description
	 * This is the data service for estimate project rule code lookup
	 * */
	angular.module('estimate.rule').factory('estimateRulePrjLookupDataService', ['platformLookupDataServiceFactory','ServiceDataProcessArraysExtension',
		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {
			let estRulePrjLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'estimate/rule/', endPointRead: 'tree'},
				tree:{
					parentProp: 'EstRuleFk',
					childProp: 'EstRules',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true},
				dataProcessor: [new ServiceDataProcessArraysExtension(['EstRules'])],
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function () {

						}
					}
				]
			};
			let container =  platformLookupDataServiceFactory.createInstance(estRulePrjLookupDataServiceConfig);
			let service = container.service;

			return service;
		}]);
})(angular);
