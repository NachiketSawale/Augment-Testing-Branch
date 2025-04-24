/**
 * Created by Joshi on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name controllingStructureUnitLookupDataService
	 * @function
	 *
	 * @description
	 * controllingStructureUnitLookupDataService is the data service for all controlling unit related functionality.
	 */
	angular.module('basics.lookupdata').factory('controllingStructureUnitLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'controllingStructureImageProcessor',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, controllingStructureImageProcessor) {

			var controllingUnitLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'controlling/structure/', endPointRead: 'tree'},
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(mainItemId) {
					if (mainItemId) {
						return '?mainItemId=' + mainItemId;
					} else {
						return '?mainItemId=';
					}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['ControllingUnits']), controllingStructureImageProcessor],
				tree: {parentProp: 'ControllingunitFk', childProp: 'ControllingUnits'}
			};

			return platformLookupDataServiceFactory.createInstance(controllingUnitLookupDataServiceConfig).service;
		}]);
})(angular);
