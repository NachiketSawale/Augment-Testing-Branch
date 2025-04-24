/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParameterPrjParamStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for project estimate parameter container
	 */
	angular.module(moduleName).factory('estimateParameterPrjParamStandardConfigurationService', ['platformUIStandardConfigService', 'estimateParameterPrjParamTranslationService', 'platformSchemaService', 'estimateParameterPrjParamUIConfigurationService',

		function (platformUIStandardConfigService, estimatePrjParamTranslationService, platformSchemaService, estimateParamUIConfigurationService) {
			let BaseService = platformUIStandardConfigService;
			let estimateParamDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'EstPrjParamDto', moduleSubModule: 'Estimate.Parameter'} );
			function EstimatePrjParamUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}
			EstimatePrjParamUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimatePrjParamUIStandardService.prototype.constructor = EstimatePrjParamUIStandardService;
			let estimatePrjParamDetailLayout = estimateParamUIConfigurationService.getEstimatePrjParamDetailLayout();
			return new BaseService( estimatePrjParamDetailLayout, estimateParamDomainSchema.properties, estimatePrjParamTranslationService);
		}
	]);
})();
