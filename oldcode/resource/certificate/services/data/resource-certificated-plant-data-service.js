/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.certificate');

	/**
	 * @ngdoc service
	 * @name resourceCertificatedPlantDataService
	 * @description pprovides methods to access, create and update resource certificate plant entities
	 */
	myModule.service('resourceCertificatedPlantDataService', ResourceCertificatedPlantDataService);

	ResourceCertificatedPlantDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceCertificateConstantValues', 'resourceCertificateDataService'];

	function ResourceCertificatedPlantDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceCertificateConstantValues, resourceCertificateDataService) {
		var self = this;
		var resourceCertificatedPlantServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceCertificatedPlantDataService',
				entityNameTranslationID: 'resource.certificate.resourceCertificatedPlantEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/certificate/certificatedplant/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceCertificateDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceCertificateConstantValues.schemes.certificatedPlant)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceCertificateDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CertificatedPlants', parentService: resourceCertificateDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceCertificatedPlantServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceCertificatedPlantValidationService'
		}, resourceCertificateConstantValues.schemes.certificatedPlant));
	}
})(angular);
