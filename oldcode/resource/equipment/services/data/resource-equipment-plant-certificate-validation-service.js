/**
 * Created by cakiral on 23.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantCertificateValidationService
	 * @description provides validation methods for resource equipment plantCertificate entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantCertificateValidationService', ResourceEquipmentPlantCertificateValidationService);

	ResourceEquipmentPlantCertificateValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantCertificateDataService'];

	function ResourceEquipmentPlantCertificateValidationService(platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentPlantCertificateDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.plantCertificate, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.plantCertificate),
				periods: [ { from: 'ValidFrom', to: 'ValidTo'} ]
			},
			self,
			resourceEquipmentPlantCertificateDataService);
	}
})(angular);
