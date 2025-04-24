(function (angular) {
	'use strict';
	const equipmentModule = angular.module('resource.equipment');
	/**
	 * @ngdoc service
	 * @name resourceEquipmentContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	equipmentModule.service('resourceEquipmentContainerInformationService', ResourceEquipmentContainerInformationService);

	ResourceEquipmentContainerInformationService.$inject = [
		'_',
		'$injector',
		'platformLayoutHelperService',
		'platformContextService',
		'platformObjectHelper',
		'resourceCommonContextService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'resourceCommonContainerInformationService',
		'resourceCommonLayoutHelperService',
		'resourceEquipmentConstantValues',
		'resourceWotLookupConfigGenerator',
		'platformSourceWindowGridDragService',
		'platformDragdropService',
		'resourceEquipmentFilterLookupDataService',
		'resourceCommonDragDropService'
	];

	function ResourceEquipmentContainerInformationService(
		_,
		$injector,
		platformLayoutHelperService,
		platformContextService,
		platformObjectHelper,
		resourceCommonContextService,
		basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService,
		resourceCommonContainerInformationService,
		resourceCommonLayoutHelperService,
		resourceEquipmentConstantValues,
		resourceWotLookupConfigGenerator,
		platformSourceWindowGridDragService,
		platformDragdropService,
		resourceEquipmentFilterLookupDataService,
		resourceCommonDragDropService
	) {
		let self = this;
		let dynamicConfigurations = {};
		const guids = resourceEquipmentConstantValues.uuid.container;
		let masterDataContext = resourceCommonContextService.getMasterDataContext();

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'resource-equipment-self-eurolist-filter',
				fn: function (eurolist, entity) {
					return eurolist.Id !== entity.Id;  // Rubric for equipment
				}
			},
			{
				key: 'resource-equipment-category-by-rubric-filter',
				fn: function (rubricCategory /* , entity */) {
					return rubricCategory.RubricFk === 30; // Rubric for equipment
				}
			},
			{
				key: 'plant-master-without-root-filter',
				serverSide: true,
				serverKey: 'equipment-plant-filter',
				fn: function (plantLookup, related) {

					const filterParams = resourceEquipmentFilterLookupDataService.getFilterParams(plantLookup);
					filterParams.excludePlantFk = plantLookup.PlantFk;
					return filterParams;
				}
			},
			{
				key: 'equipment-plant-only-unassigned-filter',
				serverSide: true,
				serverKey: 'equipment-plant-only-unassigned-filter',
				fn: function (plantLookup, related) {
					const filterParams = resourceEquipmentFilterLookupDataService.getFilterParams(plantLookup);
					filterParams.excludePlantFk = plantLookup.PlantFk;
					filterParams.FilterKey = 'equipment-plant-only-unassigned-filter';

					return filterParams;
				}
			},
			{
				key: 'plant-master-project-context-filter',
				serverSide: true,
				serverKey: 'project-with-context',
				fn: function (currentItem) {
					return { PrjContextId: currentItem.ProjectContextFk };
				},
			},
			{
				key: 'etm-plant-controllingunit-project-context-filter',
				serverKey: 'etm.plant.controllingunit.project.context.filter',
				serverSide: true,
				fn: function (entity) {
					return {
						ByStructure: true,
						ExtraFilter: false,
						PrjProjectFk: entity ? entity.ProjectFk : null,
						CompanyFk: platformContextService.getContext().clientId,
						ProjectContextFk: entity.ProjectContextFk,
						FilterKey: 'etm.plant.controllingunit.project.context.filter',
					};
				},
			},
			{
				key: 'resource-equipment-component-maint-schema-filter',
				fn: function (compoMaintSchemaLookup) {
					const parentItem = $injector.get('resourceEquipmentPlantComponentDataService').getSelected();
					const allItems = $injector.get('resourceEquipmentPlantComponentMaintSchemaDataService').getList();

					const result = _.find(allItems, function (e) {
						return e.MaintSchemaFk === compoMaintSchemaLookup.Id || parentItem.MaintenanceSchemaFk === compoMaintSchemaLookup.Id;
					});
					return result === undefined;
				},
			},
			{
				key: 'resource-equipment-group-pricelist-filter',
				fn: function (item, plantestimatepricelist) {
					let plantDataService = $injector.get('resourceEquipmentPlantDataService');
					let plant = plantDataService.getItemById(plantestimatepricelist.PlantFk);

					return item.MdcContextFk === masterDataContext && item.EtmDivisionFk === plant.EquipmentDivisionFk;
				}
			},
			{
				key: 'resource-material-filter',
				serverSide: true,
				fn: function (entity, searchOptions) {
					if (entity) {
						searchOptions.MaterialTypeFilter = {
							IsForRM: true,
						};
					}
				}
			},
			{
				key: 'resource-equipment-rubric-category-lookup-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function (entity) {
					return { Rubric: 30 };// 30 is rubric for equipment.
				}
			}
		]);

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};

			switch (guid) {
				case guids.plantList: // resourceEquipmentPlantListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentPlantServiceInfo(), self.getResourceEquipmentPlantLayout);
					config.listConfig = { initCalled: false, columns: [], dragDropService: resourceCommonDragDropService, type: 'resource.equipment' };
					break;
				case guids.plantDetails: // resourceEquipmentPlantDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentPlantServiceInfo(), self.getResourceEquipmentPlantLayout);
					break;
				case guids.fixedAssetList: // resourceEquipmentPlantFixedAssetListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentFixedAssetServiceInfo());
					break;
				case guids.fixedAssetDetails: // resourceEquipmentPlantFixedAssetDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentFixedAssetServiceInfo());
					break;
				case guids.plantDocumentList: // resourceEquipmentPlantDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentDocumentServiceInfo());
					break;
				case guids.plantDocumentDetails: // resourceEquipmentPlantDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentDocumentServiceInfo());
					break;
				case guids.businessPartnerList: // resourceEquipmentBusinessPartnerListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentBusinessPartnerServiceInfo());
					break;
				case guids.businessPartnerDetails: // resourceEquipmentBusinessPartnerDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentBusinessPartnerServiceInfo());
					break;
				case guids.plantAccessoryList: // resourceEquipmentPlantAccessoryListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentAccessoryServiceInfo(), self.getResourceEquipmentPlantAccessoryLayout);
					break;
				case guids.plantAccessoryDetails: // resourceEquipmentPlantAccessoryDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentAccessoryServiceInfo(), self.getResourceEquipmentPlantAccessoryLayout);
					break;
				case guids.plantPictureList: // resourceEquipmentPhotoController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentPhotoServiceInfo(), self.getResourceEquipmentPhotoLayout);
					break;
				case guids.plantAssignmentList: // resourceEquipmentPlantAssignmentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentAssignmentServiceInfo());
					break;
				case guids.plantAssignmentDetails: // resourceEquipmentPlantAssignmentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentAssignmentServiceInfo());
					break;
				case guids.plantComponentList: // resourceEquipmentPlantComponentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentComponentServiceInfo());
					break;
				case guids.plantComponentDetails: // resourceEquipmentPlantComponentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentComponentServiceInfo());
					break;
				case guids.plantCatalogCalcList: // resourceEquipmentPlantEurolistListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentEuroListServiceInfo());
					config.listConfig = {
						initCalled: false, columns: [],
						dragDropService: $injector.get('resourceEquipmentEurolistDropService'),
						type: 'plantEurolist',
						allowedDragActions: [platformDragdropService.actions.copy]
					};
					break;
				case guids.plantCatalogCalcDetails: // resourceEquipmentPlantEurolistDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentEuroListServiceInfo());
					break;
				case guids.plantMaintenanceList: // reseourceEquipmentMaintenanceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentMaintenanceServiceInfo(), self.getResourceEquipmentMaintenanceLayout);
					break;
				case guids.plantMaintenanceDetails: // reseourceEquipmentMaintenanceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentMaintenanceServiceInfo(), self.getResourceEquipmentMaintenanceLayout);
					break;
				case guids.plantPricesList: // resourceEquipmentPricelistListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentPriceListServiceInfo());
					break;
				case guids.plantPricesDetails: // resourceEquipmentPricelistDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentPriceListServiceInfo());
					break;
				case guids.plantAllocationList: // resourceEquipmentPlantAllocationViewListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentAllocationViewServiceInfo());
					break;
				case guids.plantAllocationDetails: // resourceEquipmentPlantAllocationViewDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentAllocationViewServiceInfo());
					break;
				case guids.controllingUnitList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getControllingUnitServiceInfo(), self.getControllingUnitLayout);
					break;
				case guids.controllingUnitDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getControllingUnitServiceInfo(), self.getControllingUnitLayout);
					break;
				case guids.meterReadingList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getMeterReadingServiceInfo(), self.getMeterReadingLayout);
					break;
				case guids.meterReadingDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getMeterReadingServiceInfo(), self.getMeterReadingLayout);
					break;
				case guids.plantLocationList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantLocationViewServiceInfo());
					break;
				case guids.plantLocationDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantLocationViewServiceInfo());
					break;
				case guids.plantCertificationList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantCertificationServiceInfo(), self.getResourceEquipmentPlantCertificateLayout);
					break;
				case guids.plantCertificationDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantCertificationServiceInfo(), self.getResourceEquipmentPlantCertificateLayout);
					break;
				case guids.plantCostVList: // resourceEquipmentCostViewListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantPlantCostVServiceInfo());
					break;
				case guids.plantCostVDetails: // resourceEquipmentCostViewDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantPlantCostVServiceInfo());
					break;
				case guids.plantComponentMaintSchemaList: // resourceEquipmentCostViewListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantComponentMaintSchemaServiceInfo(), self.getResourceEquipmentPlantComponentMaintSchemaLayout);
					break;
				case guids.plantComponentMaintSchemaDetail: // resourceEquipmentCostViewListController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantComponentMaintSchemaServiceInfo(), self.getResourceEquipmentPlantComponentMaintSchemaLayout);
					break;
				case guids.plantPlantLocation2List: // resourceEquipmentPlantLocation2ListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentPlantLocation2ServiceInfos());
					break;
				case guids.plantPlantLocation2Detail: // ResourceEquipmentPlantLocation2DetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentPlantLocation2ServiceInfos());
					break;
				case guids.plantPoolJobPlantLocationList: // resourceEquipmentPoolJobPlantLocationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentPoolJobPlantLocationServiceInfos());
					break;
				case guids.plantPoolJobPlantLocationDetail: // resourceEquipmentPoolJobPlantLocationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentPoolJobPlantLocationServiceInfos());
					break;
				case guids.Plant2ClerkList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentClerkRolesServiceInfo());
					break;
				case guids.Plant2ClerkDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentClerkRolesServiceInfo());
					break;
				case guids.plant2EstimatePriceListList: // resourceEquipmentPlant2EstimatePriceListListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlant2EstimatePriceListServiceInfos(), self.getPlant2EstimatePriceListLayout);
					break;
				case guids.plant2EstimatePriceListDetails: // resourceEquipmentPlant2EstimatePriceListDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlant2EstimatePriceListServiceInfos(), self.getPlant2EstimatePriceListLayout);
					break;
				case guids.plantComponentWarrantyList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentWarrantyServiceInfo());
					break;
				case guids.plantComponentWarrantyDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentWarrantyServiceInfo());
					break;
				case guids.compatibleMaterialList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentCompatibleMaterialServiceInfo());
					break;
				case guids.compatibleMaterialDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentCompatibleMaterialServiceInfo());
					break;
				case guids.sourceCatalogRecord1: // logisticDispatchingJobPlantStockSourceWindowController
					config = self.getCatalogRecordWindowConfig(1);
					break;
				case guids.sourceCatalogRecord2: // logisticDispatchingJobPlantStockSourceWindowController
					config = self.getCatalogRecordWindowConfig(2);
					break;
				case guids.contractProcurementList: // resourceEquipmentPlantProcurementContractsListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentProcurementContractsServiceInfo());
					break;
				case guids.contractProcurementDetails: // resourceEquipmentPlantProcurementContractsDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentProcurementContractsServiceInfo());
					break;
				case guids.specificValuesList:// resourceEquipmentSpecificValueListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSpecificValueServiceInfos());
					break;
				case guids.specificValuesDetails:// resourceEquipmentPlantSpecificValueDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSpecificValueServiceInfos());
					break;
				case resourceEquipmentConstantValues.uuid.container.bulkPlantOwnerList://resourceEquipmentBulkPlantOwnerListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getBulkPlantOwnerServiceInfos(),self.getBulkPlantOwnerLayout);
					break;
				case resourceEquipmentConstantValues.uuid.container.bulkPlantOwnerDetails://resourceEquipmentBulkPlantOwnerDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBulkPlantOwnerServiceInfos(),self.getBulkPlantOwnerLayout);
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;
			}
			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getBulkPlantOwnerLayout = function getBulkPlantOwnerLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout(
				'1.0.0',
				'resource.equipment.bulkplantowner',
				['companyfk', 'projectfk', 'droppointfk', 'totalquantity', 'yardquantity', 'constructionprojectfk', 'constructiondroppointfk', 'projectquantity']);
			res.overloads = platformLayoutHelperService.getOverloads(['companyfk', 'projectfk', 'droppointfk', 'constructionprojectfk', 'constructiondroppointfk'], self);
			return res;
		};
		this.getBulkPlantOwnerServiceInfos = function getBulkPlantOwnerServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentBulkPlantOwnerLayoutService',
				dataServiceName: 'resourceEquipmentBulkPlantOwnerDataService',
				validationServiceName: 'resourceEquipmentBulkPlantOwnerValidationService'
			};
		};

		this.getPlant2EstimatePriceListLayout = function getPlant2EstimatePriceListLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.plant2estimatepricelist', ['plantestimatepricelistfk', 'uomfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['plantestimatepricelistfk', 'uomfk'], self);
			return res;
		};

		this.getPlant2EstimatePriceListServiceInfos = function getPlant2EstimatePriceListServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentPlant2EstimatePriceListLayoutService',
				dataServiceName: 'resourceEquipmentPlant2EstimatePriceListDataService',
				validationServiceName: 'resourceEquipmentPlant2EstimatePriceListValidationService',
			};
		};

		this.getResourceEquipmentPlantServiceInfo = function getResourceEquipmentPlantServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantLayoutService',
				dataServiceName: 'resourceEquipmentPlantDataService',
				validationServiceName: 'resourceEquipmentPlantValidationService',
			};
		};

		this.getCatalogRecordWindowConfig = function getCatalogRecordWindowConfig(n) {
			var layServ = $injector.get('resourceCatalogContainerInformationService');
			var config = layServ.getContainerInfoByGuid('bae34453f83744d3a6f7e53b7851e657');
			var templateInfo = {
				dto: 'CatalogRecordDto',
				instance: n,
				http: 'resource/catalog/record',
				endRead: 'listbyparent',
				usePostForRead: true,
				filterFk: 'catalogFk',
				presenter: 'list',
				sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
				isInitialSorted: false,
				sourceDataService: config.dataServiceName
			};
			config.templInfo = templateInfo;
			config.dataServiceName = $injector.get('resourceEquipmentSourceDataServiceFactory').createDataService(templateInfo);
			config.validationServiceName = {};
			config.listConfig.type = 'sourceCatalogRecord'+n;
			config.listConfig.dragDropService = platformSourceWindowGridDragService;
			config.listConfig.allowedDragActions = [platformDragdropService.actions.copy];

			return config;
		};

		this.getResourceEquipmentPlantLayout = function getResourceEquipmentPlantLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout(
				'1.0.0',
				'resource.equipment.plant',
				[
					'code',
					'descriptioninfo',
					'longdescriptioninfo',
					'specification',
					'alternativecode',
					'matchcode',
					'nfcid',
					'commenttext',
					'validfrom',
					'validto',
					'islive',
					'regnumber',
					'companyfk',
					'plantstatusfk',
					'serialnumber',
					'basuomtranspsizefk',
					'basuomtranspweightfk',
					'transportlength',
					'transportwidth',
					'transportheight',
					'transportweight',
					'trafficlightfk',
					'haspooljob',
					'loadingcostfk',
					'cardnumber',
					'isresource'
				],
				{
					gid: 'configuration',
					attributes: ['equipmentdivisionfk', 'plantgroupfk', 'planttypefk', 'plantkindfk', 'procurementstructurefk', 'uomfk', 'rubriccategoryfk', 'clerkownerfk', 'clerkresponsiblefk'],
				},
				{
					gid: 'dangerousGoods',
					attributes: ['dangerclassfk', 'packagetypefk', 'uomdcfk', 'dangercapacity'],
				},
				{
					gid: 'vehicleManagement',
					attributes: ['purchasedate', 'purchaseprice', 'replacementdate', 'replacementprice', 'commissioningdate', 'planneddecommissioningdate', 'decommissioningdate', 'licenseplate', 'externalcode', 'clerktechnicalfk'],
				},

				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', '0')
			);

			res.overloads = platformLayoutHelperService.getOverloads(
				[
					'companyfk',
					'plantstatusfk',
					'equipmentdivisionfk',
					'plantgroupfk',
					'planttypefk',
					'plantkindfk',
					'procurementstructurefk',
					'uomfk',
					'islive',
					'rubriccategoryfk',
					'certificatefk',
					'clerkownerfk',
					'clerkresponsiblefk',
					'dangerclassfk',
					'packagetypefk',
					'uomdcfk',
					'basuomtranspsizefk',
					'basuomtranspweightfk',
					'trafficlightfk',
					'loadingcostfk',
					'clerktechnicalfk'
				],
				self
			);
			res.overloads.isresource = { readonly: true};
			res.addition = {
				grid: platformObjectHelper.extendGrouping([{
					afterId: 'procurementstructurefk',
					id: 'structureDescription',
					field: 'ProcurementStructureFk',
					name$tr$: 'cloud.common.entityStructureDescription',
					sortable: true,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'prcstructure',
						displayMember: 'DescriptionInfo.Translated',
					},
					width: 150,
				}]),
				detail: [],
			};
			return res;
		};

		this.getPlantComponentMaintSchemaServiceInfo = function getPlantComponentMaintSchemaServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantComponentMaintSchemaLayoutService',
				dataServiceName: 'resourceEquipmentPlantComponentMaintSchemaDataService',
				validationServiceName: 'resourceEquipmentPlantComponentMaintSchemaValidationService',
			};
		};

		this.getResourceEquipmentFixedAssetServiceInfo = function getResourceEquipmentFixedAssetServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantFixedAssetUIStandardService',
				dataServiceName: 'resourceEquipmentPlantFixedAssetDataService',
				validationServiceName: 'resourceEquipmentPlantFixedAssetValidationService',
			};
		};

		this.getResourceEquipmentDocumentServiceInfo = function getResourceEquipmentDocumentServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantDocumentUIStandardService',
				dataServiceName: 'resourceEquipmentPlantDocumentDataService',
				validationServiceName: 'resourceEquipmentPlantDocumentValidationService',
			};
		};

		this.getResourceEquipmentBusinessPartnerServiceInfo = function getResourceEquipmentBusinessPartnerServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentBusinessPartnerUIStandardService',
				dataServiceName: 'resourceEquipmentBusinessPartnerDataService',
				validationServiceName: 'resourceEquipmentBusinessPartnerValidationService',
			};
		};

		this.getResourceEquipmentAccessoryServiceInfo = function getResourceEquipmentAccessoryServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantAccessoryUIService',
				dataServiceName: 'resourceEquipmentPlantAccessoryDataService',
				validationServiceName: 'resourceEquipmentPlantAcessoryValidationService',
			};
		};

		this.getResourceEquipmentPlantAccessoryLayout = function getResourceEquipmentPlantAccessoryLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.plantaccessory', ['accessorytypefk', 'plant2fk', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['accessorytypefk', 'plant2fk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getResourceEquipmentClerkRolesServiceInfo = function getResourceEquipmentClerkRolesServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantClerkRolesUIStandardService',
				dataServiceName: 'resourceEquipmentPlantClerkRolesDataService',
				validationServiceName: 'resourceEquipmentPlantClerkRolesValidationDataService',
			};
		};

		this.getResourceEquipmentPlantComponentMaintSchemaLayout = function getResourceEquipmentPlantComponentMaintSchemaLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.plantcomponentmaintschema', [
				'maintschemafk',
				'description',
				'commenttext',
				'validfrom',
				'validto',
				'nextmaintperf',
				'hasallmaintenancegenerated',
				'nextmaintdate',
				'nextmaintdays',
			]);
			res.overloads = platformLayoutHelperService.getOverloads(['maintschemafk'], self);

			return res;
		};

		this.getResourceEquipmentPlantMaintViewLayout = function getResourceEquipmentPlantMaintViewLayout() {
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory(
				'1.0.0',
				'resource.equipment.plantMaintView',
				['plantcode', 'plantdescription', 'plantgroupfk', 'maintenancecode', 'maintenancedescription', 'maintschemafk', 'startdate', 'enddate'],
				[]
			);
			res.overloads = platformLayoutHelperService.getOverloads(['maintschemafk'], self);
			res.overloads.plantgroupfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				// use here special lookup (only used in the create req and res wizard at the moment) that only shows 'Code' column of plantgroupfk
				dataServiceName: 'resourceEquipmentGroupLookupDataService',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode',
					},
				],
				cacheEnable: true,
			});

			res.overloads.maintschemafk.grid.editor = null;
			res.overloads.maintschemafk.grid.editorOptions = null;

			res.overloads.plantgroupfk.grid.editor = null;
			res.overloads.plantgroupfk.grid.editorOptions = null;

			res.overloads.plantcode = { readonly: true };
			res.overloads.plantdescription = { readonly: true };
			res.overloads.maintenancecode = { readonly: true };
			res.overloads.maintenancedescription = { readonly: true };

			return res;
		};


		this.getSpecificValueServiceInfos = function getSpecificValueServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentSpecificValueLayoutService',
				dataServiceName: 'resourceEquipmentSpecificValueDataService',
				validationServiceName: 'resourceEquipmentPlantSpecificValueValidationService'
			};
		};

		this.getSpecificValuesLayout = function getSpecificValuesLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.specificvalue',
				['descriptioninfo', 'specificvaluetypefk', 'uomfromtypefk', 'uomfk', 'ismanual', 'commenttext','quantity', 'quantitydetail', 'factor', 'factordetail','costcodefk', 'plantassemblytypefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['specificvaluetypefk', 'uomfromtypefk', 'uomfk', 'costcodefk', 'plantassemblytypefk'], self);
			return res;
		};


		this.getResourceEquipmentPhotoServiceInfo = function getResourceEquipmentPhotoServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPhotoLayoutService',
				dataServiceName: 'resourceEquipmentLeafPhotoService',
				validationServiceName: 'resourceEquipmentEquipmentLeafPhotoValidationService',
			};
		};

		this.getResourceEquipmentPhotoLayout = function getResourceEquipmentPhotoLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.photolist', ['commenttext', 'picturedate', 'sorting', 'isdefault', 'ishiddeninpublicapi']);
		};

		this.getResourceEquipmentAssignmentServiceInfo = function getResourceEquipmentAssignmentServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantAssignmentUIStandardService',
				dataServiceName: 'resourceEquipmentPlantAssignmentDataService',
				validationServiceName: 'resourceEquipmentPlantAssignmentValidationService',
			};
		};

		this.getResourceEquipmentComponentServiceInfo = function getResourceEquipmentComponentServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantComponentUIStandardService',
				dataServiceName: 'resourceEquipmentPlantComponentDataService',
				validationServiceName: 'resourceEquipmentPlantComponentValidationService',
			};
		};

		this.getResourceEquipmentEuroListServiceInfo = function getResourceEquipmentEuroListServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantEurolistUIStandardService',
				dataServiceName: 'resourceEquipmentPlantEurolistDataService',
				validationServiceName: 'resourceEquipmentPlantEurolistValidationService',
			};
		};

		this.getResourceEquipmentMaintenanceServiceInfo = function getResourceEquipmentMaintenanceServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentMaintenanceLayoutService',
				dataServiceName: 'resourceEquipmentMaintenanceDataService',
				validationServiceName: 'resourceEquipmentMaintenanceValidationService',
			};
		};

		this.getResourceEquipmentMaintenanceLayout = function getResourceEquipmentMaintenanceLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.maintenance', [
				'code',
				'description',
				'maintenancestatusfk',
				'startdate',
				'enddate',
				'isfixeddays',
				'daysafter',
				'isperformancebased',
				'uomfk',
				'quantity',
				'duration',
				'remark',
				'comment',
				'jobcardfk',
				'jobcardtemplatefk',
				'maintenanceschemafk',
				'plantcompmaintschemafk',
				'maintschemarecfk',
				'isrecalcdates',
				'isrecalcperformance'
			]);
			res.overloads = platformLayoutHelperService.getOverloads(['maintenancestatusfk', 'uomfk', 'jobcardfk', 'jobcardtemplatefk', 'maintenanceschemafk', 'plantcompmaintschemafk', 'maintschemarecfk'], self);
			return res;
		};

		this.getResourceEquipmentPriceListServiceInfo = function getResourceEquipmentPriceListServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantPricelistUIStandardService',
				dataServiceName: 'resourceEquipmentPlantPricelistDataService',
				validationServiceName: 'resourceEquipmentPlantPricelistValidationService',
			};
		};

		this.getResourceEquipmentAllocationViewServiceInfo = function getResourceEquipmentAllocationViewServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantAllocationViewUIStandardService',
				dataServiceName: 'resourceEquipmentPlantAllocationDataService',
				validationServiceName: '',
			};
		};

		this.getControllingUnitServiceInfo = function getControllingUnitServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentControllingUnitLayoutService',
				dataServiceName: 'resourceEquipmentControllingUnitDataService',
				validationServiceName: 'resourceEquipmentControllingUnitValidationService',
			};
		};

		this.getControllingUnitLayout = function getControllingUnitLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipment.controllingunit',
				['projectcontextfk',
					'comment',
					'controllingunitfk',
					'controllingunitdescription',
					'assignment01',
					'assignment02',
					'assignment03',
					'assignment04',
					'assignment05',
					'assignment06',
					'assignment07',
					'assignment08',
					'assignment09',
					'assignment10',
					'controllingunitstatusfk',
					'isbillingelement',
					'isplanningelement',
					'isplantmanagement',
					'isassetmanagement',
					'estimatecost',
					'detail01code',
					'detail01desc',
					'detail01comment',
					'detail02code',
					'detail02desc',
					'detail02comment',
					'detail03code',
					'detail03desc',
					'detail03comment',
					'detail04code',
					'detail04desc',
					'detail04comment',
					'detail05code',
					'detail05desc',
					'detail05comment',
					'detail06code',
					'detail06desc',
					'detail06comment',
					'detail07code',
					'detail07desc',
					'detail07comment',
					'detail08code',
					'detail08desc',
					'detail08comment',
					'detail09code',
					'detail09desc',
					'detail09comment',
					'detail10code',
					'detail10desc',
					'detail10comment'
				]);

			res.addAdditionalColumns = true;
			res.overloads = platformLayoutHelperService.getOverloads(['projectcontextfk', 'controllingunitfk', 'controllingunitstatusfk'], self);
			res.overloads.projectcontextfk.readonly = true;
			res.overloads.controllingunitdescription = { readonly: true};
			res.overloads.assignment01 = { readonly: true};
			res.overloads.assignment02 = { readonly: true};
			res.overloads.assignment03 = { readonly: true};
			res.overloads.assignment04 = { readonly: true};
			res.overloads.assignment05 = { readonly: true};
			res.overloads.assignment06 = { readonly: true};
			res.overloads.assignment07 = { readonly: true};
			res.overloads.assignment08 = { readonly: true};
			res.overloads.assignment09 = { readonly: true};
			res.overloads.assignment10 = { readonly: true};
			res.overloads.controllingunitstatusfk.readonly = true;
			res.overloads.isplantmanagement = { readonly: true};
			res.overloads.isassetmanagement = { readonly: true};
			res.overloads.estimatecost = { readonly: true};
			res.overloads.isbillingelement = { readonly: true};
			res.overloads.isplanningelement = { readonly: true};
			res.overloads.detail01code = { readonly: true};
			res.overloads.detail01desc = { readonly: true};
			res.overloads.detail01comment = { readonly: true};
			res.overloads.detail02code = { readonly: true};
			res.overloads.detail02desc = { readonly: true};
			res.overloads.detail02comment = { readonly: true};
			res.overloads.detail03code = { readonly: true};
			res.overloads.detail03desc = { readonly: true};
			res.overloads.detail03comment = { readonly: true};
			res.overloads.detail04code = { readonly: true};
			res.overloads.detail04desc = { readonly: true};
			res.overloads.detail04comment = { readonly: true};
			res.overloads.detail05code = { readonly: true};
			res.overloads.detail05desc = { readonly: true};
			res.overloads.detail05comment = { readonly: true};
			res.overloads.detail06code = { readonly: true};
			res.overloads.detail06desc = { readonly: true};
			res.overloads.detail06comment = { readonly: true};
			res.overloads.detail07code = { readonly: true};
			res.overloads.detail07desc = { readonly: true};
			res.overloads.detail07comment = { readonly: true};
			res.overloads.detail08code = { readonly: true};
			res.overloads.detail08desc = { readonly: true};
			res.overloads.detail08comment = { readonly: true};
			res.overloads.detail09code = { readonly: true};
			res.overloads.detail09desc = { readonly: true};
			res.overloads.detail09comment = { readonly: true};
			res.overloads.detail10code = { readonly: true};
			res.overloads.detail10desc = { readonly: true};
			res.overloads.detail10comment = { readonly: true};

			return res;
		};

		this.getMeterReadingServiceInfo = function getMeterReadingServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentMeterReadingLayoutService',
				dataServiceName: 'resourceEquipmentMeterReadingDataService',
				validationServiceName: 'resourceEquipmentMeterReadingValidationService',
			};
		};

		this.getPlantCertificationServiceInfo = function getPlantCertificationServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantCertificateLayoutService',
				dataServiceName: 'resourceEquipmentPlantCertificateDataService',
				validationServiceName: 'resourceEquipmentPlantCertificateValidationService',
			};
		};

		this.getPlantPlantCostVServiceInfo = function getPlantPlantCostVServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantCostVLayoutService',
				dataServiceName: 'resourceEquipmentPlantCostVDataService',
				validationServiceName: 'resourceEquipmentPlantCostVValidationService',
			};
		};

		this.getResourceEquipmentPlantLocation2ServiceInfos = function getResourceEquipmentPlantLocation2ServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentPlantLocation2LayoutService',
				dataServiceName: 'resourceEquipmentPlantLocation2DataService',
				validationServiceName: 'logisticJobPlantAllocationValidationService',
			};
		};

		this.getResourceEquipmentPoolJobPlantLocationServiceInfos = function getResourceEquipmentPoolJobPlantLocationServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentPoolJobPlantLocationLayoutService',
				dataServiceName: 'resourceEquipmentPoolJobPlantLocationDataService',
				validationServiceName: '',
			};
		};

		this.getResourceEquipmentPlantLocation2Layout = function getResourceEquipmentPlantLocation2Layout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.job.plantallocation', [
				'plantfk',
				'plantdescription',
				'plantstatusfk',
				'planttypefk',
				'plantkindfk',
				'workoperationtypefk',
				'allocatedfrom',
				'allocatedto',
				'quantity',
				'uomfk',
				'projectno',
				'projectname',
				'jobdescription',
				'jobcode' /* ,'companyfk','plantgroupfk' */,
				'projectfk',
				'jobgroupfk',
				'plantisbulk',
				'companycode',
				'companyname'
			]);
			res.overloads = platformLayoutHelperService.getOverloads([/* 'plantfk', */ 'plantstatusfk', 'planttypefk', 'plantkindfk',  /* 'workoperationtypefk', */ 'uomfk' /* , 'companyfk' */, /* 'plantgroupfk', */ 'projectfk', 'jobgroupfk', 'projectchangefk', 'projectchangestatusfk'], self);
			res.overloads.plantfk = resourceCommonLayoutHelperService.provideMassDataPlantLookupOverload();
			res.overloads.workoperationtypefk = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true, null, true);
			res.overloads.plantdescription = { readonly: true };
			return res;
		};

		this.getResourceEquipmentPlantCostVLayout = function getResourceEquipmentPlantCostVLayout() {
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayout(
				'1.0.0',
				'resource.equipment.plant',
				[],
				[
					{
						gid: 'jobGroup',
						attributes: ['jobcode', 'jobdescription', 'jobuserdefined1', 'jobvalidfrom', 'jobvalidto', 'plantgroupfk', 'projectno', 'jobtypedescription'],
					},
					{
						gid: 'itemGroup',
						attributes: [
							'itemkind',
							'currency',
							'itemprcstructurecode',
							'itemprcstructuredescription',
							'itemdescription1',
							'itemdescription2',
							'itemquantity',
							'itemquantitymultiplier',
							'itempriceportion1',
							'itempriceportion2',
							'itempriceportion3',
							'itempriceportion4',
							'itempriceportion5',
							'itempriceportion6',
							'itempricetotal',
							'itemtotalcost',
							'itemunitinfo',
						],
					},
					{
						gid: 'itemHeaderGroup',
						attributes: ['itemheaderdate', 'itemheadercode', 'itemheaderdescription', 'itemheaderfrom', 'itemheaderto'],
					},
				]
			);

			res.overloads = platformLayoutHelperService.getOverloads(['plantgroupfk'], self);
			res.addAdditionalColumns = false;
			res.groups = res.groups.slice(1, -1);
			return res;
		};

		this.getResourceEquipmentPlantCertificateLayout = function getResourceEquipmentPlantCertificateLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'resource.equipment.plant', ['certificatefk', 'clerkfk', 'contactfk', 'supplierfk', 'businesspartnerfk', 'commenttext', 'validfrom', 'validto'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, null, null, '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['certificatefk', 'clerkfk', 'contactfk', 'supplierfk'], self);
			res.overloads.businesspartnerfk = self.getBusinessPartnerLookup('resourceCertificateDataService');

			res.overloads.businesspartnerfk.readonly=true;
			res.overloads.clerkfk.readonly=true;
			res.overloads.contactfk.readonly=true;
			res.overloads.supplierfk.readonly=true;
			res.overloads.userdefinedtext01 = { readonly: true};
			res.overloads.userdefinedtext02 = { readonly: true};
			res.overloads.userdefinedtext03 = { readonly: true};
			res.overloads.userdefinedtext04 = { readonly: true};
			res.overloads.userdefinedtext05 = { readonly: true};

			return res;
		};

		this.getMeterReadingLayout = function getMeterReadingLayout() {
			let res = platformLayoutHelperService.getFiveGroupsBaseLayout(
				'1.0.0',
				'resource.equipment.meterreading',
				['recorded', 'quantity', 'comment', 'longitude', 'latitude'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedIntegerGroup(5, 'userDefIntegerGroup', 'userdefinedint', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userDefNumberGroup', 'userdefinednumber', '0')
			);

			res.overloads = platformLayoutHelperService.getOverloads([], self);

			return res;
		};

		this.getPlantLocationViewServiceInfo = function getPlantLocationViewServiceInfo() {
			return resourceCommonContainerInformationService.getPlantLocationListInfo('resourceEquipmentPlantLocationDataService');
		};

		this.getResourceEquipmentWarrantyServiceInfo = function getResourceEquipmentWarrantyServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentWarrantyLayoutService',
				dataServiceName: 'resourceEquipmentWarrantyDataService',
				validationServiceName: 'resourceEquipmentWarrantyValidationService',
			};
		};

		this.getResourceEquipmentWarrantyLayout = function getResourceEquipmentWarrantyLayout() {
			let res = platformLayoutHelperService.getThreeGroupsBaseLayout(
				'1.0.0',
				'resource.equipment.component.warranty',
				['warrantytypefk', 'warrantystatusfk', 'warrantystart', 'warrantyend', 'quantity', 'uomfk', 'hours', 'descriptioninfo', 'commenttext', 'remark'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefTextGroup', 'userdefineddate', '0')
			);

			res.overloads = platformLayoutHelperService.getOverloads(['warrantytypefk', 'warrantystatusfk', 'uomfk'], self);

			return res;
		};

		this.getResourceEquipmentCompatibleMaterialServiceInfo = function getResourceEquipmentWarrantyServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentCompatibleMaterialLayoutService',
				dataServiceName: 'resourceEquipmentCompatibleMaterialDataService',
				validationServiceName: 'resourceEquipmentCompatibleMaterialValidationService',
			};
		};

		this.getResourceEquipmentCompatibleMaterialLayout = function getResourceEquipmentCompatibleMaterialLayout() {
			let res = platformLayoutHelperService.getThreeGroupsBaseLayout(
				'1.0.0',
				'materialInfo',
				['materialcatalog', 'materialfk', 'commenttext', 'materialcatalogdesc','materialcatalogtype','materialcatalogcategoryshortdesc','materialcatalogcategorydesc'],
				{
					gid: 'businessPartnerInfo',
					attributes: ['bizpartner','bizpartnername1','bizpartnername2','bizpartnerinternet','bizpartneremail','bizpartnerstate','bizpartnerstatedesc','bizpartnerisapproved','bizpartnercommunicationchannel']
				},
				{
					gid: 'contractInfo',
					attributes: ['contracted','contracteddesc','contractedstate','contractedstatedesc','contractedisaccepted']
				}
			);

			res.overloads = platformLayoutHelperService.getOverloads(['materialfk'], self);

			res.overloads.materialcatalog = { readonly: true };
			res.overloads.materialcatalogdesc = { readonly: true };
			res.overloads.materialcatalogtype = { readonly: true };
			res.overloads.materialcatalogcategoryshortdesc = { readonly: true };
			res.overloads.materialcatalogcategorydesc = { readonly: true };

			res.overloads.bizpartner = { readonly: true };
			res.overloads.bizpartnername1 = { readonly: true };
			res.overloads.bizpartnername2 = { readonly: true };
			res.overloads.bizpartnerinternet = { readonly: true };
			res.overloads.bizpartneremail = { readonly: true };
			res.overloads.bizpartnerstate = { readonly: true };
			res.overloads.bizpartnerstatedesc = { readonly: true };
			res.overloads.bizpartnerisapproved = { readonly: true };
			res.overloads.bizpartnercommunicationchannel = { readonly: true };

			res.overloads.contracted = { readonly: true };
			res.overloads.contracteddesc = { readonly: true };
			res.overloads.contractedstate = { readonly: true };
			res.overloads.contractedstatedesc = { readonly: true };
			res.overloads.contractedisaccepted = { readonly: true };

			return res;
		};

		this.getResourceEquipmentProcurementContractsServiceInfo = function getResourceEquipmentProcurementContractsServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentProcurementContractsUIStandardService',
				dataServiceName: 'resourceEquipmentProcurementContractsDataService',
				validationServiceName: 'resourceEquipmentProcurementContractsValidationService',
			};
		};

		function getChangeLookupOverload() {
			let lookupOptions = {
				additionalColumns: true,
				showClearButton: true,
				addGridColumns: [{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description'
				}]
			};

			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'project-change-dialog',
						descriptionMember: 'Description',
						lookupOptions: lookupOptions
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'project-change-dialog',
						lookupOptions: lookupOptions
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'projectchange',
						displayMember: 'Code'
					},
					width: 130
				},
				readonly: true
			};
		}

		this.getBusinessPartnerLookup = function getBusinessPartnerLookup(dataServiceName) {
			let ovl = platformLayoutHelperService.provideBusinessPartnerLookupOverload();

			// grid
			ovl.grid.editorOptions.lookupOptions.mainService = dataServiceName;
			ovl.grid.editorOptions.lookupOptions.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.grid.editorOptions.lookupOptions.SubsidiaryField = 'SubsidiaryFk';

			// detail
			ovl.detail.options.mainService = dataServiceName;
			ovl.detail.options.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.detail.options.SubsidiaryField = 'SubsidiaryFk';

			return ovl;
		};

		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {

				case 'specificvaluetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.specificvaluetype', null, {
						field: 'UomFk',
						customIntegerProperty: 'BAS_UOM_FK',
						customBoolProperty: 'ISCOSTCODE'
					});
					break;
				case 'uomfromtypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMReadOnlyLookupSpecification());
					break;
				case 'accessorytypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentaccessorytype');
					break;
				case 'projectchangefk':
					ovl = getChangeLookupOverload();
					break;
				case 'materialfk':
					ovl =  {
						detail: {
							type:'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-material-material-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'resource-material-filter',
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'resource-material-filter',
								},
								directive: 'basics-material-material-lookup'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							}
						}
					};
					break;


				case 'plantassemblytypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantassemblytype', null);
					break;
				case 'plantcompmaintschemafk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourcePlantComponentMaintenanceSchemaLookupDataService',
						cacheEnable: true,
						readonly: true,
						filter: function (item) {
							var readData = {};
							if (item) {
								if (item.PlantComponentFk) {
									readData.PKey1 = item.PlantComponentFk;
								}
							}
							return readData;
						},
					});
					break;
				case 'loadingcostfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.loadingcost');
					break;
				case 'companyfk':
					ovl = {
						navigator: {
							moduleName: 'basics.company',
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-company-company-lookup',
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'company',
								displayMember: 'Code',
							},
							width: 140,
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
							},
						},
					};
					break;
				case 'costcodefk':
					ovl = platformLayoutHelperService.provideCostCodeLookupOverload();
					break;
				case 'equipmentdivisionfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.equipmentdivision', 'Description', {
						required: true,
						field: 'EtmContextFk',
						filterKey: 'resource-equipment-context-filter',
					});
					break;
				case 'certificatefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						navigator: {
							moduleName: 'resource.certificate',
						},
						dataServiceName: 'resourceEquipmentPlantCertificateLookupDataService',
						cacheEnable: true,
					});
					break;

				case 'controllingunitfk':
					ovl = resourceCommonLayoutHelperService.provideControllingUnitOverload(false, 'etm-plant-controllingunit-project-context-filter');
					break;

				case 'controllingunitstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.contrunitstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
					});
					break;

				case 'islive':
					ovl = { readonly: true };
					break;
				case 'maintschemafk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						filterKey: 'resource-equipment-component-maint-schema-filter',
					});

					break;
				case 'maintenanceschemafk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						readonly: true,
						filterKey: 'resource-equipment-component-maint-schema-filter',
					});

					break;
				case 'maintenancestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.maintenancestatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
					});
					break;
				case 'plant2fk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					platformLayoutHelperService.addConfigObjToLookupConfig(ovl, { filterKey: 'plant-master-without-root-filter' });
					break;
				case 'plantgroupfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'resource-equipment-group-lookup-dialog',
								lookupOptions: {
									additionalColumns: true,
									showClearButton: true,
									addGridColumns: [
										{
											id: 'description',
											field: 'DescriptionInfo',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'translation',
											readonly: true,
										},
									],
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'equipmentGroup',
								displayMember: 'Code',
								version: 3
							},
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'resource-equipment-group-lookup-dialog',
								displayMember: 'Code',
								descriptionMember: 'Description',
								showClearButton: true,
								lookupOptions: {
									showClearButton: true,
								},
							},
						},
					};
					break;
				case 'plantkindfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantkind');
					break;
				case 'plantstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
					});
					break;
				case 'planttypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomizePantTypeLookupDataService'
					});
					break;
				case 'procurementstructurefk':
					ovl = {
						navigator: {
							moduleName: 'basics.procurementstructure',
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurementstructure-structure-dialog',
								lookupOptions: {
									showClearButton: true,
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code',
							},
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'StructureDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									initValueField: 'StructureCode',
									showClearButton: true,
								},
							},
						},
					};
					break;
				case 'structureDescription':
					ovl = {
						width: 150,
					};
					break;
				case 'projectcontextfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontext');
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload('plant-master-project-context-filter');
					break;
				case 'constructionprojectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload('plant-master-project-context-filter');
					break;
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
					});
					break;
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'resource-equipment-rubric-category-lookup-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'resource-equipment-rubric-category-lookup-filter',
									showClearButton: true
								}
							}
						},
						readonly: true
					};
					break;
				case 'jobcardfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'logistic-card-dialog-lookup',
								lookupOptions: {
									showClearButton: true,
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'logisticJobCard',
								displayMember: 'Code',
								version: 3,
							},
						},
						detail: {
							type: 'directive',
							directive: 'logistic-card-dialog-lookup',
							options: {
								displayMember: 'Code',
								showClearButton: true,
							},
						},
					};
					break;

				case 'jobcardtemplatefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticCardTemplateLookupDataService',
						cacheEnable: true,
						readonly: true,
					});
					break;
				case 'jobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobgroup');
					break;
				/* case 'workoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true);
					break; */
				case 'clerkownerfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'clerktechnicalfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'clerkresponsiblefk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'dangerclassfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dangerclass', null, {
						field: 'PackageTypeFk',
						filterKey: 'logistic-job-card-by-division-filter',
						customIntegerProperty: 'BAS_PACKAGETYPE_FK',
					});
					break;
				case 'packagetypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						moduleQualifier: 'basPackagingTypeLookupDataService',
						dataServiceName: 'basPackagingTypeLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'DescriptionInfo.Description',
						columns: [
							{
								id: 'Id',
								field: 'DescriptionInfo.Description',
								name: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription',
							},
						],
					});
					break;
				case 'uomdcfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
					});
					break;
				case 'basuomtranspsizefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'basuomtranspweightfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'maintschemarecfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceMaintSchemaRecordLookupDataService',
						cacheEnable: true,
						readonly: true,
						filter: function (item) {
							var readData = {};
							if (item && item.MaintenanceSchemaFk) {
								readData.PKey1 = item.MaintenanceSchemaFk;
							} else {
								readData.PKey1 = -1;
							}
							return readData;
						},
					});
					break;
				case 'trafficlightfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resourcestrafficlight', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
					});
					break;
				case 'plantestimatepricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantestimatepricelist', null, {
						filterKey: 'resource-equipment-group-pricelist-filter',
						customIntegerProperty: 'MDC_CONTEXT_FK',
						customIntegerProperty1: 'ETM_DIVISION_FK',
					});
					break;
				case 'warrantytypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantwarrantytype'); break;
				case 'warrantystatusfk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantwarrantystatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService'
				}); break;
				case 'certificatetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantcertificatetype');
					break;
				case 'clerkfk': ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
				case 'contactfk': ovl = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupDlgOverload(
					'resource-certificate-business-partner-contact-filter'
				); break;
				case 'supplierfk': ovl = platformLayoutHelperService.provideBusinessPartnerSupplierLookupOverload('resource-certificate-businesspartner-supplier-filter'); break;
				case 'droppointfk':
				 	ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				 		dataServiceName: 'projectDropPointsLookupDataService',
				 		filter: function (item) {
				 			return  item.ProjectFk;
				 		}
				 	});
				 	break;
				case 'constructiondroppointfk':
				 	ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectDropPointsLookupDataService',
				 		filter: function (item) {
				 			return  item.ConstructionProjectFk;
				 		}
					});
					break;
			}

			return ovl;
		};
	}
})(angular);
