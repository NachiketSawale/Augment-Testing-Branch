(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentEurolistDataService
	 * @function
	 *
	 * @description
	 * resourcePlantEstimateEquipmentEurolistDataService is the data service for all plants related functionality.
	 */
	const moduleName = 'resource.plantestimate';
	const resourceModule = angular.module(moduleName);
	resourceModule.service('resourcePlantEstimateEquipmentEurolistDataService', ResourcePlantEstimateEquipmentEurolistDataService);

	ResourcePlantEstimateEquipmentEurolistDataService.$inject = ['_', 'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		'resourcePlantEstimateConstantValues', 'resourcePlantEstimateEquipmentEurolistReadonlyProcessor', 'resourcePlantEstimateEquipmentDataService'];

	function ResourcePlantEstimateEquipmentEurolistDataService(_, platformDataServiceFactory, mandatoryProcessor,
	  resourcePlantEstimateConstantValues, resourcePlantEstimateEquipmentEurolistReadonlyProcessor, resourcePlantEstimateEquipmentDataService
	) {
		const self = this;

		let creationDataExtension = {};
		let initCreationDataExtension = function initCreationDataExtension() {
			creationDataExtension = {PKey2: null, PKey3: null};
		};
		const factoryOptions = {
			flatLeafItem: {
				module: resourceModule,
				serviceName: 'resourcePlantEstimateEquipmentEurolistDataService',
				entityNameTranslationID: 'resource.equipment.entityResourcePlantEstimateEquipmentEurolist',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/planteurolist/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourcePlantEstimateEquipmentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourcePlantEstimateEquipmentDataService.getSelected();
							creationData.PKey1 = selected.Id;
							angular.extend(creationData, creationDataExtension);
							initCreationDataExtension();
						},
						handleCreateSucceeded: function (response) {
							console.log(response);
						}
					}
				},
				dataProcessor: [resourcePlantEstimateEquipmentEurolistReadonlyProcessor],
				entityRole: {
					leaf: {itemName: 'PlantEurolist', parentService: resourcePlantEstimateEquipmentDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(factoryOptions, self);
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourcePlantEstimateEquipmentEurolistValidationService'
		}, resourcePlantEstimateConstantValues.schemes.plantCatalogCalc));

		self.SetCreationParameter = function (catalogFk, catalogRecordFk) {
			creationDataExtension.PKey2 = catalogFk;
			creationDataExtension.PKey3 = catalogRecordFk;
		};
	}
})(angular);
