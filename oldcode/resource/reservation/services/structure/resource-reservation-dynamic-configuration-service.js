/**
 * Created by cakiral on 21/01/2021.
 */
(function (angular) {

	/*global angular*/
	'use strict';
	 var moduleName = 'resource.reservation';

	/***
	 * @description
	 * resourceReservationDynamicConfigurationService is the config service for resource reservation container.
	 */
	angular.module(moduleName).factory('resourceReservationDynamicConfigurationService', [
		'basicsCommonDynamicStructureServiceFactory',
		function (basicsCommonDynamicStructureServiceFactory) {
			return basicsCommonDynamicStructureServiceFactory.getService('resourceReservationStructureLayoutService');
		}
	]);
})(angular);
