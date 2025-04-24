/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.plantpricing');

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingPricelistDataService
	 * @description pprovides methods to access, create and update resource plantpricing pricelist entities
	 */
	myModule.service('resourcePlantpricingPricelistDataService', ResourcePlantpricingPricelistDataService);

	ResourcePlantpricingPricelistDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourcePlantpricingConstantValues', 'resourcePlantpricingPricelistTypeDataService'];

	function ResourcePlantpricingPricelistDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourcePlantpricingConstantValues, resourcePlantpricingPricelistTypeDataService) {

		var self = this;
		var resourcePlantpricingPricelistServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourcePlantpricingPricelistDataService',
				entityNameTranslationID: 'resource.plantpricing.pricelistEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'resource/plantpricing/pricelist/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/plantpricing/pricelist/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourcePlantpricingPricelistTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourcePlantpricingConstantValues.schemes.pricelist)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourcePlantpricingPricelistTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Pricelists', parentService: resourcePlantpricingPricelistTypeDataService}
				},
				translation: {
					uid: 'resourcePlantpricingPricelistDataService',
					title: 'resource.plantpricing.pricelistEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: resourcePlantpricingConstantValues.schemes.pricelist
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourcePlantpricingPricelistServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantpricingPricelistValidationService'
		}, resourcePlantpricingConstantValues.schemes.pricelist));
	}
})(angular);
