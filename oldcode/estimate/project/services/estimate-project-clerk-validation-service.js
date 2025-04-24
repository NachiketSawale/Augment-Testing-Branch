/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'estimate.project';

	/**
     * @ngdoc service
     * @name estimateProjectClerkValidationService
     * @description provides validation methods for estimate project clerk entities
     */
	angular.module(moduleName).service('estimateProjectClerkValidationService', estimateProjectClerkValidationService);

	estimateProjectClerkValidationService.$inject = ['platformValidationServiceFactory', 'estimateProjectClerkDataService'];

	/* jshint -W040 */ // remove the warning that possible strict voilation
	function estimateProjectClerkValidationService(platformValidationServiceFactory, estimateProjectClerkDataService) {
		let self = this;
		let schemeInfo = {typeName: 'EstimateProjectHeader2ClerkDto', moduleSubModule: 'Estimate.Project'};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
		},
		self,
		estimateProjectClerkDataService);
	}

})(angular);
