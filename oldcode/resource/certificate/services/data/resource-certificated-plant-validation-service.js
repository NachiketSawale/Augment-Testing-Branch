/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc service
	 * @name resourceCertificatedPlantValidationService
	 * @description provides validation methods for resource certificate plant entities
	 */
	angular.module(moduleName).service('resourceCertificatedPlantValidationService', ResourceCertificatedPlantValidationService);

	ResourceCertificatedPlantValidationService.$inject = ['platformValidationServiceFactory', 'resourceCertificateConstantValues', 'resourceCertificatedPlantDataService'];

	function ResourceCertificatedPlantValidationService(platformValidationServiceFactory, resourceCertificateConstantValues, resourceCertificatedPlantDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceCertificateConstantValues.schemes.certificatedPlant, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceCertificateConstantValues.schemes.certificatedPlant)
			},
			self,
			resourceCertificatedPlantDataService);
	}
})(angular);
