/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.certificate';

	/**
	 * @ngdoc service
	 * @name resourceCertificateDocumentValidationService
	 * @description provides validation methods for resource certificate document entities
	 */
	angular.module(moduleName).service('resourceCertificateDocumentValidationService', ResourceCertificateDocumentValidationService);

	ResourceCertificateDocumentValidationService.$inject = ['platformValidationServiceFactory', 'resourceCertificateConstantValues', 'resourceCertificateDocumentDataService'];

	function ResourceCertificateDocumentValidationService(platformValidationServiceFactory, resourceCertificateConstantValues, resourceCertificateDocumentDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceCertificateConstantValues.schemes.certificateDoc, {
			// mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceCertificateConstantValues.schemes.certificateDoc)
		},
		self,
		resourceCertificateDocumentDataService);
	}
})(angular);
