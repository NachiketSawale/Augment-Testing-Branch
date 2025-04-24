/**
 * Created by baf on 07.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.catalog');

	/**
	 * @ngdoc service
	 * @name resourceCatalogPriceIndexDataService
	 * @description pprovides methods to access, create and update resource catalog priceIndex entities
	 */
	myModule.service('resourceCatalogPriceIndexDataService', ResourceCatalogPriceIndexDataService);

	ResourceCatalogPriceIndexDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceCatalogConstantValues', 'resourceCatalogDataService'];

	function ResourceCatalogPriceIndexDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceCatalogConstantValues, resourceCatalogDataService) {
		var self = this;
		var resourceCatalogPriceIndexServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceCatalogPriceIndexDataService',
				entityNameTranslationID: 'resource.catalog.resourceCatalogPriceIndexEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/catalog/priceindex/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceCatalogDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceCatalogConstantValues.schemes.priceIndex)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceCatalogDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PriceIndices', parentService: resourceCatalogDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceCatalogPriceIndexServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceCatalogPriceIndexValidationService'
		}, resourceCatalogConstantValues.schemes.priceIndex));
	}
})(angular);
