/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('controlling.revrecognition').service('controllingRevenueRecognitionHeaderConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'controllingRevenueRecognitionUILayout',
		'controllingRevenueRecognitionTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, controllingRevenueRecognitionUILayout,
			controllingRevenueRecognitionTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'PrrHeaderDto', moduleSubModule: 'Controlling.RevRecognition'} );
			if (domainSchema) {
				domainSchema = domainSchema.properties;
				domainSchema.CompanyPeriodFkStartDate = {domain: 'dateutc'};
				domainSchema.CompanyPeriodFkEndDate = {domain: 'dateutc'};
			}
			

			return new BaseService(controllingRevenueRecognitionUILayout, domainSchema, controllingRevenueRecognitionTranslationService);
		}]);
})();
