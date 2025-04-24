/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc controller
	 * @name resourceCertificatedPlantLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource certificate plant entity.
	 **/
	angular.module(moduleName).service('resourceCertificatedPlantLayoutService', ResourceCertificatedPlantLayoutService);

	ResourceCertificatedPlantLayoutService.$inject = ['platformUIConfigInitService', 'resourceCertificateContainerInformationService', 'resourceCertificateConstantValues', 'resourceCertificateTranslationService'];

	function ResourceCertificatedPlantLayoutService(platformUIConfigInitService, resourceCertificateContainerInformationService, resourceCertificateConstantValues, resourceCertificateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceCertificateContainerInformationService.getCertificatedPlantLayout(),
			dtoSchemeId: resourceCertificateConstantValues.schemes.certificatedPlant,
			translator: resourceCertificateTranslationService
		});
	}
})(angular);