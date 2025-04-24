(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantDataService is the data service for all plants related functionality.
	 */
	var moduleName = 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantDataService', ['$injector', '$translate', '$http', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'platformRuntimeDataService',
		'basicsCompanyNumberGenerationInfoService','platformGenericStructureService', 'platformPermissionService',
		'permissions', 'resourceEquipmentConstantValues', 'cloudDesktopSidebarService', '_',
		function ($injector, $translate, $http, platformDataServiceFactory,
			platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor, platformRuntimeDataService,
			basicsCompanyNumberGenerationInfoService, platformGenericStructureService, platformPermissionService,
			permissions, resourceEquipmentConstantValues, cloudDesktopSidebarService, _) {

			var factoryOptions = {
				flatRootItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantDataService',
					entityNameTranslationID: 'resource.equipment.entityPlant',
					entityInformation: {
						module: 'Resource.Equipment',
						entity: 'EquipmentPlant',
						specialTreatmentService: null
					},
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plant/',
						endRead: 'filtered',
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
							if (groupingFilter) {
								filterRequest.groupingFilter = groupingFilter;
							}
						},
						endDelete: 'multidelete',
						usePostForRead: true
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'Plants',
							codeField: 'Code',
							descField: 'DescriptionInfo.Translated',
							moduleName: 'cloud.desktop.moduleDisplayNameEquipment',
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

			if(platformPermissionService.hasRead('86669bb5495346cfb2086463b29863da')) {
				factoryOptions.flatRootItem.sidebarSearch.options.customOption = {
					label: $translate.instant('resource.equipment.onlyThisDivision'),
					label$tr$: 'resource.equipment.onlyThisDivision',
					domain: 'boolean',
					key: 'RestrictToCurrentDivision',
					value: true
				};
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			var service = serviceContainer.service;

			serviceContainer.data.Initialised = true;
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'EquipmentPlantDto',
				moduleSubModule: 'Resource.Equipment',
				validationService: 'resourceEquipmentPlantValidationService'
			});

			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
				else if (item && triggerField === 'Code') {
					let Code = '';
					if (_.isObject(item)) {
						Code = item[triggerField];
					} else if (_.isString(item)) {
						Code = item;
					}
					return $http.get(serviceContainer.data.httpReadRoute + 'getitembyCode?code=' + Code).then(function (response) {
						if (!response || !response.data) {
							return [];
						} else {
							cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
						}
					});
				}
				else if (triggerField === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
					const ids = item.Ids.split(',');
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
			};

			service.createDeepCopy = function createDeepCopy() {
				var command = {
					Action: 4,
					Plants: [service.getSelected()]
				};

				$http.post(globals.webApiBaseUrl + 'resource/equipment/plant/execute', command).then(function (response) {
						serviceContainer.data.handleOnCreateSucceeded(response.data.Plants[0], serviceContainer.data);
					},
					function (/* error */) {
					});
			};

			service.canDelete = function canDelete() {
				var createButton = true;
				var selectedPlant = service.getSelected();

				if (selectedPlant !== undefined && selectedPlant !== null) {
					if (selectedPlant.CanDelete === false) {
						createButton = false;
					} else {
						createButton = true;
					}
				} else {
					createButton = false;
				}
				return createButton;
			};

			service.asyncGetById = function asyncGetById(id) {
				var identifcationData = {
					Id: id
				};
				return $http.post(globals.webApiBaseUrl + 'resource/equipment/plant/getById', identifcationData).then(function (response) {
					return response.data;
				});
			};

			service.deleteEntities = function deleteEntities(entities) {
				var platformModalService = $injector.get('platformModalService');
				var modalOptions = {
					headerTextKey: moduleName + '.confirmDeleteTitle',
					bodyTextKey: $translate.instant(moduleName + '.confirmDeletePlantHeader'),
					showYesButton: true,
					showNoButton: true,
					iconClass: 'ico-question'
				};
				return platformModalService.showDialog(modalOptions).then(function (result) {
					if (result.yes) {
						serviceContainer.data.deleteEntities(entities, serviceContainer.data);
					}
				});
			};

			service.registerSelectionChanged (function (e, item){
				if(item){
					service.setReadOnly(item.BelongsToDifferentDivision);
				}
			});


			service.setReadOnly = function setReadOnly (isreadonly) {
				if (isreadonly) {
					platformPermissionService.restrict(
						[
							resourceEquipmentConstantValues.uuid.container.businessPartnerList,
							resourceEquipmentConstantValues.uuid.container.businessPartnerDetails,
							resourceEquipmentConstantValues.uuid.container.controllingUnitList,
							resourceEquipmentConstantValues.uuid.container.controllingUnitDetails,
							resourceEquipmentConstantValues.uuid.container.fixedAssetList,
							resourceEquipmentConstantValues.uuid.container.fixedAssetDetails,
							resourceEquipmentConstantValues.uuid.container.meterReadingList,
							resourceEquipmentConstantValues.uuid.container.meterReadingDetails,
							resourceEquipmentConstantValues.uuid.container.plantList,
							resourceEquipmentConstantValues.uuid.container.plantDetails,
							resourceEquipmentConstantValues.uuid.container.plantAccessoryList,
							resourceEquipmentConstantValues.uuid.container.plantAccessoryDetails,
							resourceEquipmentConstantValues.uuid.container.plantAllocationList,
							resourceEquipmentConstantValues.uuid.container.plantAllocationDetails,
							resourceEquipmentConstantValues.uuid.container.plantAssignmentList,
							resourceEquipmentConstantValues.uuid.container.plantAssignmentDetails,
							resourceEquipmentConstantValues.uuid.container.plantCatalogCalcList,
							resourceEquipmentConstantValues.uuid.container.plantCatalogCalcDetails,
							resourceEquipmentConstantValues.uuid.container.plantComponentList,
							resourceEquipmentConstantValues.uuid.container.plantComponentDetails,
							resourceEquipmentConstantValues.uuid.container.plantDocumentList,
							resourceEquipmentConstantValues.uuid.container.plantDocumentDetails,
							resourceEquipmentConstantValues.uuid.container.plantLocationList,
							resourceEquipmentConstantValues.uuid.container.plantLocationDetails,
							resourceEquipmentConstantValues.uuid.container.plantMaintenanceList,
							resourceEquipmentConstantValues.uuid.container.plantMaintenanceDetails,
							resourceEquipmentConstantValues.uuid.container.plantPictureList,
							resourceEquipmentConstantValues.uuid.container.plantPricesList,
							resourceEquipmentConstantValues.uuid.container.plantPricesDetails,
							resourceEquipmentConstantValues.uuid.container.plantCertificationList,
							resourceEquipmentConstantValues.uuid.container.plantCostVList,
							resourceEquipmentConstantValues.uuid.container.plantCostVDetails,
							resourceEquipmentConstantValues.uuid.container.plantComponentMaintSchemaList,
							resourceEquipmentConstantValues.uuid.container.plantComponentMaintSchemaDetail,
							resourceEquipmentConstantValues.uuid.container.plantPlantLocation2List,
							resourceEquipmentConstantValues.uuid.container.plantPlantLocation2Detail,
							resourceEquipmentConstantValues.uuid.container.plantPoolJobPlantLocationList,
							resourceEquipmentConstantValues.uuid.container.plantPoolJobLocationDetail,
							resourceEquipmentConstantValues.uuid.container.Plant2ClerkList,
							resourceEquipmentConstantValues.uuid.container.Plant2ClerkDetail,
							resourceEquipmentConstantValues.uuid.container.plant2EstimatePriceListList,
							resourceEquipmentConstantValues.uuid.container.plant2EstimatePriceListDetails
						],
						permissions.read);
				} else {
					platformPermissionService.restrict(
						[
							resourceEquipmentConstantValues.uuid.container.businessPartnerList,
							resourceEquipmentConstantValues.uuid.container.businessPartnerDetails,
							resourceEquipmentConstantValues.uuid.container.controllingUnitList,
							resourceEquipmentConstantValues.uuid.container.controllingUnitDetails,
							resourceEquipmentConstantValues.uuid.container.fixedAssetList,
							resourceEquipmentConstantValues.uuid.container.fixedAssetDetails,
							resourceEquipmentConstantValues.uuid.container.meterReadingList,
							resourceEquipmentConstantValues.uuid.container.meterReadingDetails,
							resourceEquipmentConstantValues.uuid.container.plantList,
							resourceEquipmentConstantValues.uuid.container.plantDetails,
							resourceEquipmentConstantValues.uuid.container.plantAccessoryList,
							resourceEquipmentConstantValues.uuid.container.plantAccessoryDetails,
							resourceEquipmentConstantValues.uuid.container.plantAllocationList,
							resourceEquipmentConstantValues.uuid.container.plantAllocationDetails,
							resourceEquipmentConstantValues.uuid.container.plantAssignmentList,
							resourceEquipmentConstantValues.uuid.container.plantAssignmentDetails,
							resourceEquipmentConstantValues.uuid.container.plantCatalogCalcList,
							resourceEquipmentConstantValues.uuid.container.plantCatalogCalcDetails,
							resourceEquipmentConstantValues.uuid.container.plantComponentList,
							resourceEquipmentConstantValues.uuid.container.plantComponentDetails,
							resourceEquipmentConstantValues.uuid.container.plantDocumentList,
							resourceEquipmentConstantValues.uuid.container.plantDocumentDetails,
							resourceEquipmentConstantValues.uuid.container.plantLocationList,
							resourceEquipmentConstantValues.uuid.container.plantLocationDetails,
							resourceEquipmentConstantValues.uuid.container.plantMaintenanceList,
							resourceEquipmentConstantValues.uuid.container.plantMaintenanceDetails,
							resourceEquipmentConstantValues.uuid.container.plantPictureList,
							resourceEquipmentConstantValues.uuid.container.plantPricesList,
							resourceEquipmentConstantValues.uuid.container.plantPricesDetails,
							resourceEquipmentConstantValues.uuid.container.plantCertificationList,
							resourceEquipmentConstantValues.uuid.container.plantCostVList,
							resourceEquipmentConstantValues.uuid.container.plantCostVDetails,
							resourceEquipmentConstantValues.uuid.container.plantComponentMaintSchemaList,
							resourceEquipmentConstantValues.uuid.container.plantComponentMaintSchemaDetail,
							resourceEquipmentConstantValues.uuid.container.plantPlantLocation2List,
							resourceEquipmentConstantValues.uuid.container.plantPlantLocation2Detail,
							resourceEquipmentConstantValues.uuid.container.plantPoolJobPlantLocationList,
							resourceEquipmentConstantValues.uuid.container.plantPoolJobLocationDetail,
							resourceEquipmentConstantValues.uuid.container.Plant2ClerkList,
							resourceEquipmentConstantValues.uuid.container.Plant2ClerkDetail,
							resourceEquipmentConstantValues.uuid.container.plant2EstimatePriceListList,
							resourceEquipmentConstantValues.uuid.container.plant2EstimatePriceListDetails
						]);
				}
			};

			return service;
		}]);
})(angular);
