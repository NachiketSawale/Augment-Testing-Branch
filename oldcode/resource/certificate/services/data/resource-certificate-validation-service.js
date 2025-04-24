/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc service
	 * @name resourceCertificateValidationService
	 * @description provides validation methods for resource certificate certificate entities
	 */
	angular.module(moduleName).service('resourceCertificateValidationService', ResourceCertificateValidationService);

	ResourceCertificateValidationService.$inject = ['platformValidationServiceFactory', 'resourceCertificateConstantValues', 'resourceCertificateDataService'];

	function ResourceCertificateValidationService(platformValidationServiceFactory, resourceCertificateConstantValues, resourceCertificateDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceCertificateConstantValues.schemes.certificate, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceCertificateConstantValues.schemes.certificate)
		},
		self,
		resourceCertificateDataService);
	}
})(angular);
