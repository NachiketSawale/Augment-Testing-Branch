(function () {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of logistic entities
	 */
	angular.module(moduleName).service('logisticJobUIStandardService', LogisticJobUIStandardService);

	LogisticJobUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobConstantValues',
		'logisticJobContainerInformationService', 'logisticJobTranslationService','platformSchemaService', 'platformUIStandardConfigService'];

	function LogisticJobUIStandardService(platformUIConfigInitService, logisticJobConstantValues,
	                                      logisticJobContainerInformationService, logisticJobTranslationService,platformSchemaService, platformUIStandardConfigService) {
		let servData = {
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobLayout(),
			dtoSchemeId: logisticJobConstantValues.schemes.job,
			translator: logisticJobTranslationService,
			entityInformation: {module: angular.module(moduleName), moduleName: 'Logistic.Job', entity: 'Job'}
		};
		platformUIConfigInitService.createUIConfigurationService(servData);
		let attrDomains = platformSchemaService.getSchemaFromCache(servData.dtoSchemeId);
		return new platformUIStandardConfigService(servData.layout, attrDomains.properties, logisticJobTranslationService);


	}
})();
