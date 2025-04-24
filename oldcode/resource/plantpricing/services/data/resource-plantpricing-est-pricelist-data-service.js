/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.plantpricing');

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingEstPricelistDataService
	 * @description pprovides methods to access, create and update resource plantpricing estPricelist entities
	 */
	myModule.service('resourcePlantpricingEstPricelistDataService', ResourcePlantpricingEstPricelistDataService);

	ResourcePlantpricingEstPricelistDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourcePlantpricingConstantValues', 'resourcePlantpricingPricelistTypeDataService'];

	function ResourcePlantpricingEstPricelistDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourcePlantpricingConstantValues, resourcePlantpricingPricelistTypeDataService) {
		var self = this;
		var resourcePlantpricingEstPricelistServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourcePlantpricingEstPricelistDataService',
				entityNameTranslationID: 'resource.plantpricing.estPricelistEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/plantpricing/estpricelist/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourcePlantpricingPricelistTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourcePlantpricingConstantValues.schemes.estPricelist)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourcePlantpricingPricelistTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'EstPricelists', parentService: resourcePlantpricingPricelistTypeDataService}
				},
				translation: {
					uid: 'resourcePlantpricingEstPricelistDataService',
					title: 'resource.plantpricing.estPricelistEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: resourcePlantpricingConstantValues.schemes.estPricelist
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourcePlantpricingEstPricelistServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantpricingEstPricelistValidationService'
		}, resourcePlantpricingConstantValues.schemes.estPricelist));
	}
})(angular);
