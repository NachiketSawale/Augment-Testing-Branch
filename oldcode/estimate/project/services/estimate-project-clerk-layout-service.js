/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'estimate.project';

	/**
     * @ngdoc controller
     * @name schedulingScheduleClerkLayoutService
     * @function
     *
     * @description
     * This service provides standard layout for grid / form of  estimate Project clerk entity.
     **/
	angular.module(moduleName).service('estimateProjectClerkLayoutService', estimateProjectClerkLayoutService);

	estimateProjectClerkLayoutService.$inject = ['platformUIConfigInitService', 'estimateProjectContainerInformationService', 'estimateProjectTranslationService'];
	/* jshint -W040 */ // remove the warning that possible strict voilation
	function estimateProjectClerkLayoutService(platformUIConfigInitService, estimateProjectContainerInformationService, estimateProjectTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: estimateProjectContainerInformationService.getEstimateProjectClerkLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Estimate.Project',
				typeName: 'EstimateProjectHeader2ClerkDto'
			},
			translator: estimateProjectTranslationService
		});
	}
})(angular);