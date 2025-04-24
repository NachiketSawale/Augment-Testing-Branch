/**
 * Created by baf on 05.07.2023
 */

(function (angular) {
	'use strict';
	const myModule = angular.module('resource.plantpricing');

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingPricelistTypeDataService
	 * @description provides methods to access, create and update resource plantpricing pricelistType entities
	 */
	myModule.service('resourcePlantpricingPricelistTypeDataService', ResourcePlantpricingPricelistTypeDataService);

	ResourcePlantpricingPricelistTypeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourcePlantpricingConstantValues'];

	function ResourcePlantpricingPricelistTypeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                      basicsCommonMandatoryProcessor, resourcePlantpricingConstantValues) {
		const self = this;
		const resourcePlantpricingPricelistTypeServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourcePlantpricingPricelistTypeDataService',
				entityNameTranslationID: 'resource.plantpricing.pricelistTypeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/plantpricing/pricelisttype/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{typeName: 'PricelistTypeDto',
					moduleSubModule: 'Resource.Plantpricing'}
				)],
				entityRole: {
					root: {
						itemName: 'PricelistTypes',
						moduleName: 'cloud.desktop.moduleDisplayNameResourcePlantpricing',
						useIdentification: true
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'resource.Plantpricing',
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'resourcePlantpricingPricelistTypeDataService',
					title: 'resource.plantpricing.pricelistTypeEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: resourcePlantpricingConstantValues.schemes.pricelistType
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourcePlantpricingPricelistTypeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantpricingPricelistTypeValidationService'
		}, resourcePlantpricingConstantValues.schemes.pricelistType));
	}
})(angular);
