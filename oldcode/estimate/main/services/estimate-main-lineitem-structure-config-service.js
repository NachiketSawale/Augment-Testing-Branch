/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainLineitemStructureConfigService', [
		'estimateCommonDynamicConfigurationServiceFactory', 'estimateMainDynamicConfigurationService',
		function (estimateCommonDynamicConfigurationServiceFactory, estimateMainDynamicConfigurationService) {
			let service = estimateCommonDynamicConfigurationServiceFactory.getService('estimateMainStandardConfigurationService', 'estimateMainValidationService');
			service.getDtoScheme = estimateMainDynamicConfigurationService.getDtoScheme;
			service.getStandardConfigForListView = estimateMainDynamicConfigurationService.getStandardConfigForLineItemStructure;
			return service;
		}
	]);
})(angular);
