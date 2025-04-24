(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantDataService is the data service for all plants related functionality.
	 */
	const moduleName = 'resource.plantestimate';
	let plantEstimateModule = angular.module(moduleName);

	plantEstimateModule.service('resourcePlantEstimateEquipmentDataService', ResourcePlantEstimateEquipmentDataService);

	ResourcePlantEstimateEquipmentDataService.$inject = ['_', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'platformRuntimeDataService',
		'basicsCompanyNumberGenerationInfoService', 'cloudDesktopSidebarService'];

	function ResourcePlantEstimateEquipmentDataService(_, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor, platformRuntimeDataService,
		basicsCompanyNumberGenerationInfoService, cloudDesktopSidebarService) {
		let self = this;

		var plantEstimateEquipmentDataOptions = {
			flatRootItem: {
				module: plantEstimateModule,
				serviceName: 'resourceEquipmentPlantDataService',
				entityNameTranslationID: 'resource.equipment.entityPlant',
				entityInformation: {
					module: 'Resource.PlantEstimate',
					entity: 'EquipmentPlant',
					specialTreatmentService: null
				},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plant/',
					endRead: 'filtered',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						if(!filterRequest.furtherFilters) {
							filterRequest.furtherFilters = [];
						}
						filterRequest.furtherFilters.push({Token: 'RestrictToPlantEstimate', Value: 'true' });
					},
					endDelete: 'multidelete',
					usePostForRead: true
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'Plants',
						moduleName: 'cloud.desktop.moduleDisplayNamePlantEstimation',
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EquipmentPlantDto',
					moduleSubModule: 'Resource.Equipment'
				}), {
					processItem: function (item) {
						item.HasToGenerateCode = false;
						if(item && item.BelongsToDifferentDivision) {
							platformRuntimeDataService.readonly(item, true);
						}
						else if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('resourceEquipmentNumberInfoService').hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
							platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
							item.HasToGenerateCode = true;
						}
					}
				}],
				translation: {
					uid: 'resourceEquipmentPlantDataService',
					title: 'resource.equipment.entityPlant',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'},
						{header: 'resource.equipment.entityLongDescription', field: 'LongDescriptionInfo'}],
					dtoScheme: {
						typeName: 'EquipmentPlantDto',
						moduleSubModule: 'Resource.Equipment'
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						customOption: null
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(plantEstimateEquipmentDataOptions, self);
		let service = serviceContainer.service;

		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'EquipmentPlantDto',
			moduleSubModule: 'Resource.Equipment',
			validationService: 'resourcePlantEstimateEquipmentValidationService'
		});

		service.navigateTo = function navigateTo(item, triggerfield) {
			if(triggerfield === 'EstAssemblyFk'){
				if(item.plantFk){
					cloudDesktopSidebarService.filterSearchFromPKeys([item.plantFk]);
				}
			}
		}

		return service;
	}
})(angular);
