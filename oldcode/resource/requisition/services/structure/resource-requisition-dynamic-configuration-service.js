/**
 * Created by cakiral on 21/01/2021.
 */
(function (angular) {

	/*global angular*/
	'use strict';
	 var moduleName = 'resource.requisition';

	/***
	 * @description
	 * resourceRequisitionDynamicConfigurationService is the config service for resource Requisition container.
	 */
	angular.module(moduleName).factory('resourceRequisitionDynamicConfigurationService', [
		'resourceRequisitionDynamicConfigurationServiceFactory',
		function (resourceRequisitionDynamicConfigurationServiceFactory) {
			return resourceRequisitionDynamicConfigurationServiceFactory.getService('resourceRequisitionUIStandardService', 'resourceRequisitionValidationService');
		}
	]);
})(angular);
