/*
 * $Id: project-main-container-information-service.js 383850 2016-07-14 07:24:36Z zos $
 * Copyright (c) RIB Software AG
 */

(function (angular) {
	'use strict';
	var resModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceTypeContainerInformationService
	 * @function
	 *
	 * @description
	 */
	resModule.service('resourceEquipmentgroupContainerInformationService', ResourceEquipmentGroupContainerInformationService);

	ResourceEquipmentGroupContainerInformationService.$inject = [
		'_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'resourceCommonLayoutHelperService', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentConstantValues',
		'platformContextService','resourceEquipmentGroupDynamicNominaldimensionService', 'resourceWotLookupConfigGenerator',
		'resourceCommonContextService', 'platformSourceWindowGridDragService', 'platformDragdropService'];

	function ResourceEquipmentGroupContainerInformationService(
		_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService,
		resourceCommonLayoutHelperService, resourceEquipmentGroupConstantValues, resourceEquipmentConstantValues,
		platformContextService,resourceEquipmentGroupDynamicNominaldimensionService, resourceWotLookupConfigGenerator,
		resourceCommonContextService, platformSourceWindowGridDragService, platformDragdropService) {

		let self = this;
		let dynamicConfigurations = {};
		var guids = resourceEquipmentGroupConstantValues.uuid.container;
		var plantGuids = resourceEquipmentConstantValues.uuid.container;
		let masterDataContext = resourceCommonContextService.getMasterDataContext();
		let equipmentDivisionIds= _.map(resourceCommonContextService.getLogInEquipmentDivisons(),d => d.Id);



		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'resource-equipmentgroup-self-eurolist-filter',
				fn: function (eurolist, entity) {
					return eurolist.Id !== entity.Id;  // Rubric for equipment
				}
			},
			{
				key: 'resource-equipment-category-by-rubric-filter',
				fn: function (rubricCategory /*, entity*/) {
					return rubricCategory.RubricFk === 30;  // Rubric for equipment
				}
			},
			{
				key: 'project-context-filter',
				fn: function (projectLookupItem, entity) {
					var result = false;
					if (entity.ProjectContextFk) {
						result = projectLookupItem.ProjectContextFk === entity.ProjectContextFk;
					}
					return result;
				}
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
						FilterKey: 'etm.plant.controllingunit.project.context.filter'
					};
				}
			},
			{
				key: 'resource-equipment-group-cost-codes-filter',
				serverKey: 'resource-equipment-group-cost-codes-filter',
				serverSide: true,
				fn: function () {
					return {IsRate: false};
				}
			},
			{
				key: 'resource-equipment-group-pricelist-filter',
				fn: function (item) {
					let resourceEquipmentGroupPlantGroup2EstimatePriceListDataService = $injector.get('resourceEquipmentGroupPlantGroup2EstimatePriceListDataService');
					let platformFilterHelperService = $injector.get('platformFilterHelperService');
					return item.MdcContextFk === masterDataContext &&
						_.some(equipmentDivisionIds, Id => item.EtmDivisionFk === Id) &&
						platformFilterHelperService.IsItemUniqueOutOfAllUnselected(
							item,
							resourceEquipmentGroupPlantGroup2EstimatePriceListDataService,
							ePL => ePL.EstimatePricelistFk);
				}
			},
			{
				key: 'resource-equipment-rubric-category-lookup-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function (entity) {
					return { Rubric: 30 };//30 is rubric for equipment.
				}
			}
		]);

		/* jshint -W074 */ // ignore cyclomatic complexity warning
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.groupList: //resourceEquipmentGroupListController
					config = self.getResourceEquipmentGroupServiceInfos();
					config.layout = self.getResourceEquipmentGroupLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						parentProp: 'EquipmentGroupFk',
						childProp: 'SubGroups'
					};
					break;
				case guids.groupDetails: //resourceEquipmentGroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentGroupServiceInfos(), self.getResourceEquipmentGroupLayout);
					break;
				case guids.accountList: //resourceEquipmentGroupAccountListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getAccountServiceInfos(), self.getAccountLayout);
					break;
				case guids.accountDetails: //resourceEquipmentGroupAccountDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getAccountServiceInfos(), self.getAccountLayout);
					break;
				case guids.controllingUnitList: //resourceEquipmentGroupAccountListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getControllingUnitServiceInfos());
					break;
				case guids.controllingUnitDetails: //resourceEquipmentGroupAccountDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getControllingUnitServiceInfos());
					break;
				case guids.eurolistList: //resourceEquipmentGroupEuroListListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEuroListServiceInfos(), self.getEuroListLayout);
					config.listConfig = {
						initCalled: false, columns: [],
						dragDropService: $injector.get('resourceEquipmentGroupEurolistDropService'),
						type: 'plantGroupEurolist',
						allowedDragActions: [platformDragdropService.actions.copy]
					};
					break;
				case guids.eurolistDetails: //resourceEquipmentGroupEuroListDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEuroListServiceInfos(), self.getEuroListLayout);
					break;
				case guids.pictureList: // resourceEquipmentGroupPictureListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEquipmentGroupPictureServiceInfo(), self.getEquipmentGroupPictureLayout);
					break;
				case guids.pricelistList: //resourceEquipmentGroupPriceListListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPriceListServiceInfos());
					break;
				case guids.pricelistDetails: //resourceEquipmentGroupPriceListDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPriceListServiceInfos());
					break;
				case guids.woTList: //resourceEquipmentGroupWorkOrderTypeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getWorkOrderTypeServiceInfos(), self.getWorkOrderTypeLayout);
					break;
				case guids.woTDetails: //resourceEquipmentGroupWorkOrderTypeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkOrderTypeServiceInfos(), self.getWorkOrderTypeLayout);
					break;
				case plantGuids.plantCostVList://resourceEquipmentCostViewListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getGroupPlantCostVServiceInfo());
					break;
				case plantGuids.plantCostVDetails://resourceEquipmentCostViewDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getGroupPlantCostVServiceInfo());
					break;
				case guids.plantLocationList://resourceEquipmentGroupPlantLocationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResourceEquipmentGroupPlantLocationServiceInfos());
					break;
				case guids.plantLocationDetails://resourceEquipmentGroupPlantLocationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResourceEquipmentGroupPlantLocationServiceInfos(),self.getResourceEquipmentPlantLocation2Layout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.plantGroup2CostCodeList://resourceEquipmentGroupPlantGroup2CostCodeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantGroup2CostCodeServiceInfos(),self.getPlantGroup2CostCodeLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.plantGroup2CostCodeDetails://resourceEquipmentGroupPlantGroup2CostCodeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantGroup2CostCodeServiceInfos(),self.getPlantGroup2CostCodeLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.plantGroup2EstimatePriceListList://resourceEquipmentGroupPlantGroup2EstimatePriceListListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantGroup2EstimatePriceListServiceInfos(),self.getPlantGroup2EstimatePriceListLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.plantGroup2EstimatePriceListDetails://resourceEquipmentGroupPlantGroup2EstimatePriceListDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantGroup2EstimatePriceListServiceInfos(),self.getPlantGroup2EstimatePriceListLayout);
					break;
				case guids.specificValueList://resourceEquipmentGroupPlantLocationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSpecificValueServiceInfos());
					break;
				case guids.specificValueDetails://resourceEquipmentGroupPlantLocationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSpecificValueServiceInfos(),self.getSpecificValueLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.taxCodeList://resourceEquipmentGroupTaxCodeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTaxCodeServiceInfos(),self.getTaxCodeLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.taxCodeDetails://resourceEquipmentGroupTaxCodeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTaxCodeServiceInfos(),self.getTaxCodeLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.sourceCatalogRecord1: //resourceEquipmentGroupJobPlantStockSourceWindowController
					config = self.getCatalogRecordWindowConfig(1);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.sourceCatalogRecord2: //resourceEquipmentGroupPlantStockSourceWindowController
					config = self.getCatalogRecordWindowConfig(2);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.compmaintschematemplateList: //resourceEquipmentGroupCompMaintSchemaTemplateListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCompMaintSchemaTemplServiceInfos(),self.getCompMaintSchemaTemplLayout);
					break;
				case resourceEquipmentGroupConstantValues.uuid.container.compmaintschematemplateDetail: //resourceEquipmentGroupCompMaintSchemaTemplateDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCompMaintSchemaTemplServiceInfos(),self.getCompMaintSchemaTemplLayout);
					break;
				case guids.documentList: // resourceEquipmentGroupDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEquipmentGroupocumentServiceInfo());
					break;
				case guids.documentDetails: // resourceEquipmentGroupDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEquipmentGroupocumentServiceInfo());
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

		this.getTaxCodeLayout = function getTaxCodeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.plantgroup.taxcode',
				['ledgercontextfk', 'taxcodefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['ledgercontextfk', 'taxcodefk'], self);
			return res;
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
			config.dataServiceName = $injector.get('resourceEquipmentGroupSourceDataServiceFactory').createDataService(templateInfo);
			config.validationServiceName = {};
			config.listConfig.type = 'sourceCatalogRecord'+n;
			config.listConfig.dragDropService = platformSourceWindowGridDragService;
			config.listConfig.allowedDragActions = [platformDragdropService.actions.copy];

			return config;
		};


		this.getSpecificValueServiceInfos = function getSpecificValueServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupSpecificValueLayoutService',
				dataServiceName: 'resourceEquipmentGroupSpecificValueDataService',
				validationServiceName: 'resourceEquipmentGroupSpecificValueValidationService'
			};
		};

		this.getSpecificValueLayout = function getSpecificValueLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.plantgroup.specificvalue',
				['descriptioninfo', 'specificvaluetypefk', 'uomfromtypefk', 'uomfk', 'isinherited', 'ismanual', 'commenttext', 'quantity', 'quantitydetail', 'factor', 'factordetail', 'costcodefk', 'plantassemblytypefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['specificvaluetypefk', 'uomfromtypefk', 'uomfk', 'costcodefk', 'plantassemblytypefk'], self);
			return res;
		};

		this.getTaxCodeServiceInfos = function getTaxCodeServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupTaxCodeLayoutService',
				dataServiceName: 'resourceEquipmentGroupTaxCodeDataService',
				validationServiceName: 'resourceEquipmentGroupTaxCodeValidationService'
			};
		};


		this.getPlantGroup2CostCodeLayout = function getPlantGroup2CostCodeLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout(
				'1.0.0',
				'resource.equipmentgroup.plantgroup2costcode',
				['costcodepricep1fk', 'costcodepricep2fk', 'costcodepricep3fk', 'costcodepricep4fk', 'costcodepricep5fk', 'costcodepricep6fk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['costcodepricep1fk', 'costcodepricep2fk', 'costcodepricep3fk', 'costcodepricep4fk', 'costcodepricep5fk', 'costcodepricep6fk'], self);
			return res;
		};
		this.getPlantGroup2CostCodeServiceInfos = function getPlantGroup2CostCodeServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupPlantGroup2CostCodeLayoutService',
				dataServiceName: 'resourceEquipmentGroupPlantGroup2CostCodeDataService',
				validationServiceName: 'resourceEquipmentGroupPlantGroup2CostCodeValidationService'
			};
		};
		this.getPlantGroup2EstimatePriceListLayout = function getPlantGroup2EstimatePriceListLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout(
				'1.0.0',
				'resource.equipmentgroup.plantgroup2estimatepricelist',
				['estimatepricelistfk', 'uomfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['estimatepricelistfk', 'uomfk'], self);
			return res;
		};
		this.getPlantGroup2EstimatePriceListServiceInfos = function getPlantGroup2EstimatePriceListServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupPlantGroup2EstimatePriceListLayoutService',
				dataServiceName: 'resourceEquipmentGroupPlantGroup2EstimatePriceListDataService',
				validationServiceName: 'resourceEquipmentGroupPlantGroup2EstimatePriceListValidationService'
			};
		};

		this.getResourceEquipmentGroupPlantLocationServiceInfos = function getResourceEquipmentGroupPlantLocationServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupPlantLocationLayoutService',
				dataServiceName: 'resourceEquipmentGroupPlantLocationDataService'
			};
		};


		this.getResourceEquipmentGroupPlantLocationLayout = function getResourceEquipmentGroupPlantLocationLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.job.plantallocation',
				['plantfk', 'plantdescription', 'plantstatusfk', 'planttypefk','workoperationtypefk', 'allocatedfrom', 'allocatedto', 'quantity', 'uomfk', 'projectno', 'projectname','jobdescription','jobcode',/*'companyfk',*/'plantgroupcode','plantgroupdesc','projectfk','jobgroupfk','plantisbulk','companycode','companyname']);

			res.overloads = platformLayoutHelperService.getOverloads([/* 'plantfk', */ 'plantstatusfk', 'planttypefk', /* 'workoperationtypefk', */'uomfk' /* 'companyfk' */ ,
				/* 'plantgroupfk' */ 'projectfk', 'jobgroupfk'], self);

			res.overloads.plantfk = resourceCommonLayoutHelperService.provideMassDataPlantLookupOverload();
			res.overloads.workoperationtypefk = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true,null,true);

			res.overloads.plantdescription = { readonly: true };
			res.overloads.plantgroupcode = { readonly: true };
			res.overloads.plantgroupdesc = { readonly: true };
			res.addAdditionalColumns = false;
			return res;
		};

		this.getResourceEquipmentGroupServiceInfos = function getResourceEquipmentGroupServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupLayoutService',
				dataServiceName: 'resourceEquipmentGroupDataService',
				validationServiceName: 'resourceEquipmentGroupValidationService'
			};
		};

		this.getResourceEquipmentGroupLayout = function getResourceEquipmentGroupLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentgroup.group',
				['code', 'descriptioninfo', 'islive', 'rubriccategoryfk', 'pricinggroupfk','commenttext','specification','restypefk', 'defaultplantkindfk', 'defaultplanttypefk', 'defaultprocurementstructurefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['rubriccategoryfk', 'pricinggroupfk','restypefk', 'defaultplantkindfk', 'defaultplanttypefk', 'defaultprocurementstructurefk'], self);

			return res;
		};

		this.getGroupPlantCostVServiceInfo = function getGroupPlantCostVServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupCostVLayoutService',
				dataServiceName: 'resourceEquipmentGroupCostVDataService',
				validationServiceName: 'resourceEquipmentGroupCostVValidationService'
			};
		};

		this.getResourceEquipmentGroupCostVLayout = function getResourceEquipmentGroupCostVLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'resource.equipment.plant',[],
				[
					{
						'gid': 'jobGroup',
						'attributes': ['jobcode','jobdescription','jobuserdefined1','jobvalidfrom','jobvalidto',
							'plantfk','projectno','jobtypedescription']
					},
					{
						'gid': 'itemGroup',
						'attributes': ['itemkind','currency','itemprcstructurecode','itemprcstructuredescription','itemdescription1',
							'itemdescription2','itemquantity','itemquantitymultiplier', 'itempriceportion1','itempriceportion2',
							'itempriceportion3','itempriceportion4','itempriceportion5','itempriceportion6','itempricetotal',
							'itemtotalcost','itemunitinfo']
					},
					{
						'gid': 'itemHeaderGroup',
						'attributes': ['itemheaderdate','itemheadercode','itemheaderdescription','itemheaderfrom',
							'itemheaderto']
					}
				]);

			res.overloads = platformLayoutHelperService.getOverloads(['plantfk'], self);
			res.addAdditionalColumns = false;
			res.groups = res.groups.slice(1,-1);
			return res;
		};

		this.getAccountServiceInfos = function getAccountServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupAccountLayoutService',
				dataServiceName: 'resourceEquipmentGroupAccountDataService',
				validationServiceName: 'resourceEquipmentGroupAccountValidationService'
			};
		};

		this.getAccountLayout = function getAccountLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'resource.equipmentgroup.account',
				['ledgercontextfk', 'validfrom', 'validto', 'workoperationtypefk', 'accounttypefk', 'commenttext'],
				{
					gid: 'accounts',
					attributes: [
						'account01fk','nominaldimension0101','nominaldimension0102','nominaldimension0103',
						'account02fk','nominaldimension0201','nominaldimension0202','nominaldimension0203',
						'account03fk','nominaldimension0301','nominaldimension0302','nominaldimension0303',
						'account04fk','nominaldimension0401','nominaldimension0402','nominaldimension0403',
						'account05fk','nominaldimension0501','nominaldimension0502','nominaldimension0503',
						'account06fk','nominaldimension0601','nominaldimension0602','nominaldimension0603'
					]
				});

			res.overloads = platformLayoutHelperService.getOverloads(['ledgercontextfk', 'workoperationtypefk', 'accounttypefk',
				'account01fk', 'account02fk', 'account03fk', 'account04fk', 'account05fk', 'account06fk'], self);
			var accountAttributes = _.get(_.find(res.groups, {'gid': 'accounts'}), 'attributes');
			resourceEquipmentGroupDynamicNominaldimensionService.setAccountOverloads(accountAttributes, res.overloads);

			return res;
		};

		this.getControllingUnitServiceInfos = function getControllingUnitServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupControllingUnitLayoutService',
				dataServiceName: 'resourceEquipmentGroupControllingUnitDataService',
				validationServiceName: 'resourceEquipmentGroupControllingUnitValidationService'
			};
		};

		this.getControllingUnitLayout = function getControllingUnitLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentgroup.controllingunit',
				['projectcontextfk', 'controllingunitfk', 'comment']);

			res.overloads = platformLayoutHelperService.getOverloads(['projectcontextfk', 'controllingunitfk'], self);
			res.overloads.projectcontextfk.readonly = true;

			return res;
		};

		this.getEuroListServiceInfos = function getEuroListServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupEuroListLayoutService',
				dataServiceName: 'resourceEquipmentGroupEuroListDataService',
				validationServiceName: 'resourceEquipmentGroupEuroListValidationService'
			};
		};

		this.getEuroListLayout = function getEuroListLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout(
				'1.0.0',
				'resource.equipmentGroup.euroList',
				[
					'lookupcode', 'reinstallment', 'reinstallmentyear', 'deviceparameter1', 'deviceparameter2',
					'catalogfk', 'catalogrecordfk', 'quantity', 'uomfk', 'istire', 'ismanual', 'code', 'groupeurolistfk'
				],
				{

					gid: 'OutputGeneralDev',
					attributes: [
						'depreciationpercentfrom', 'depreciationpercentto',
						'repairpercent'
					]
				},
				{
					gid: 'OutputUpperDev',
					attributes: [
						'catalogrecordupperfk','depreciationupperfrom',
						'depreciationupperto', 'repairupper', 'reinstallmentupper', 'priceindexupper'
					]
				},
				{
					gid: 'OutputLowerDev',
					attributes: [
						'catalogrecordlowerfk', 'depreciationlowerfrom',
						'depreciationlowerto', 'repairlower', 'reinstallmentlower', 'priceindexlower'
					]
				},
				{
					gid: 'OutputCalcDev',
					attributes: [
						'description', 'depreciation', 'repaircalculated',
						'reinstallmentcalculated', 'priceindexcalc', 'isinterpolated', 'isextrapolated']
				});


				platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentGroup.euroList',
				['lookupcode', 'reinstallment', 'reinstallmentyear', 'deviceparameter1', 'deviceparameter2', 'catalogfk', 'catalogrecordfk', 'quantity', 'uomfk', 'istire', 'isinterpolated', 'ismanual']);

			res.overloads = platformLayoutHelperService.getOverloads(['catalogfk', 'catalogrecordfk', 'uomfk', 'catalogrecordupperfk', 'catalogrecordlowerfk', 'groupeurolistfk'], self);

			return res;
		};

		this.getPriceListServiceInfos = function getPriceListServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupPriceListLayoutService',
				dataServiceName: 'resourceEquipmentGroupPriceListDataService',
				validationServiceName: 'resourceEquipmentGroupPriceListValidationService'
			};
		};

		this.getPriceListLayout = function getPriceListLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'resource.equipmentGroup.priceList',
				['plantpricelistfk', 'ismanual', 'validfrom', 'validto', 'commenttext', 'priceportionsum', 'uomfk'],
				resourceCommonLayoutHelperService.providePricePortionFormGroup(6, null, '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['plantpricelistfk', 'uomfk'], self);

			return res;
		};

		this.getWorkOrderTypeServiceInfos = function getWorkOrderTypeServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupWorkOrderTypeLayoutService',
				dataServiceName: 'resourceEquipmentGroupWorkOrderTypeDataService',
				validationServiceName: 'resourceEquipmentGroupWorkOrderTypeValidationService'
			};
		};

		this.getWorkOrderTypeLayout = function getWorkOrderTypeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentgroup.workordertype',
				['workoperationtypefk', 'ispriced', 'percent']);

			res.overloads = platformLayoutHelperService.getOverloads(['workoperationtypefk'], self);

			return res;
		};

		this.getEquipmentGroupPictureServiceInfo = function getEquipmentGroupPictureServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupPictureLayoutService',
				dataServiceName: 'resourceEquipmentGroupPictureDataService',
				validationServiceName: 'resourceEquipmentGroupPictureValidationService',
			};
		};

		this.getEquipmentGroupPictureLayout = function getEquipmentGroupPictureLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentgroup.pictureList', ['commenttext', 'picturedate', 'sorting', 'isdefault', 'ishiddeninpublicapi']);
		};

		this.getCostCodeLookUpConfig = function getCostCodeLookUpConfig() {
			return {
				'detail': {
					'type': 'directive',
					'directive': 'basics-cost-codes-lookup',
					'options': {
						showClearButton: true,
						filterKey: 'resource-equipment-group-cost-codes-filter',
						customIntegerProperty: 'ISRATE'
					}
				},
				'grid': {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						lookupField: 'CostCodeFk',
						lookupOptions: {
							showClearButton: true,
							filterKey: 'resource-equipment-group-cost-codes-filter'
						},
						//directive:'estimate-main-cost-codes-lookup',
						directive: 'basics-cost-codes-lookup'
					}
				}
			};
		};

		this.getCompMaintSchemaTemplServiceInfos = function getCompMaintSchemaTemplServiceInfos() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupCompMaintSchemaTemplateLayoutService',
				dataServiceName: 'resourceEquipmentGroupCompMaintSchemaTemplateDataService',
				validationServiceName: 'resourceEquipmentGroupCompMaintSchemaTemplateValidationService'
			};
		};

		this.getCompMaintSchemaTemplLayout = function getCompMaintSchemaTemplLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.equipmentgroup.compmaintschematemplatentity',
				['maintschemafk', 'plantcomponenttypefk', 'description', 'subschema1', 'subschema2', 'subschema3', 'subschema4', 'subschema5']);

			res.overloads = platformLayoutHelperService.getOverloads(['plantcomponenttypefk', 'maintschemafk', 'subschema1', 'subschema2', 'subschema3', 'subschema4', 'subschema5'], self);
			return res;
		};

		this.getEquipmentGroupocumentServiceInfo = function getEquipmentGroupocumentServiceInfo() {
			return {
				standardConfigurationService: 'resourceEquipmentGroupDocumentUIStandardService',
				dataServiceName: 'resourceEquipmentGroupDocumentDataService',
				validationServiceName: 'resourceEquipmentGroupDocumentValidationService',
			};
		};

		this.getOverload = function getOverload(overload) {
			var ovl = null;

			switch (overload) {
				case 'plantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					platformLayoutHelperService.addConfigObjToLookupConfig(ovl);
					break;
				case 'account01fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'resource-equipment-group-account-filter'
					});
					break;
				case 'account02fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'resource-equipment-group-account-filter'
					});
					break;
				case 'account03fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'resource-equipment-group-account-filter'
					});
					break;
				case 'account04fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'resource-equipment-group-account-filter'
					});
					break;
				case 'account05fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'resource-equipment-group-account-filter'
					});
					break;
				case 'account06fk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomAccountLookupDataService',
						filterKey: 'resource-equipment-group-account-filter'
					});
					break;
				case 'accounttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.accountingtype');
					break;
				case 'catalogfk':
					ovl = resourceCommonLayoutHelperService.providePlantCatalogOverload();
					break;
				case 'catalogrecordfk':
					ovl = resourceCommonLayoutHelperService.providePlantCatalogRecordOverload();
					break;
				case 'catalogrecordlowerfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceCatalogDetailLookupDataService',
						filter: function (item) {
							return item;
						}
					});
					break;
				case 'catalogrecordupperfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceCatalogDetailLookupDataService',
						filter: function (item) {
							return item;
						}
					});
					break;
				case 'controllingunitfk':
					ovl = resourceCommonLayoutHelperService.provideControllingUnitOverload(false, 'etm-plant-controllingunit-project-context-filter');
					break;
				case 'costcodefk':
					ovl = platformLayoutHelperService.provideCostCodeLookupOverload();
					break;
				case 'equipmentgroupfk':
					ovl = resourceCommonLayoutHelperService.providePlantGroupOverload();
					break;
				case 'islive':
					ovl = {readonly: true};
					break;
				case 'ledgercontextfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ledgercontext', null);
					break;
				case 'plantassemblytypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantassemblytype', null);
					break;
				case 'maintschemafk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
					filterKey: 'resource-equipment-component-maint-schema-filter'
				});
					break;
				case 'subschema1':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						filterKey: 'resource-equipment-component-maint-schema-filter'
					});
					break;
				case 'subschema2':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						filterKey: 'resource-equipment-component-maint-schema-filter'
					});
					break;
				case 'subschema3':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						filterKey: 'resource-equipment-component-maint-schema-filter'
					});
					break;
				case 'subschema4':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						filterKey: 'resource-equipment-component-maint-schema-filter'
					});
					break;
				case 'subschema5':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
						filterKey: 'resource-equipment-component-maint-schema-filter'
					});
					break;
				case 'plantpricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentpricelist', null, {
						field: 'UomFk',
						customIntegerProperty: 'BAS_UOM_FK'
					});
					break;
				case 'projectcontextfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontext');
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload();
					break;
				case 'pricinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentpricinggroup');
					break;
				case 'restypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceTypeLookupDataService',
						readonly: true
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
						}
					};
					break;
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
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'workoperationtypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					});
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'plantstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService'
					});
					break;
				case 'estimatepricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig(
						'basics.customize.plantestimatepricelist',
						null,
						{
							filterKey: 'resource-equipment-group-pricelist-filter',
							customIntegerProperty: 'MDC_CONTEXT_FK',
							customIntegerProperty1: 'ETM_DIVISION_FK'
						});
					break;
				case 'planttypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.planttype');
					break;
				case 'defaultplanttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.planttype');
					break;
				case 'defaultplantkindfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantkind');
					break;
				case 'defaultprocurementstructurefk':
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
				case 'jobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobgroup');
					break;
				case 'costcodepricep1fk':
					ovl = this.getCostCodeLookUpConfig();
					break;
				case 'costcodepricep2fk':
					ovl = this.getCostCodeLookUpConfig();
					break;
				case 'costcodepricep3fk':
					ovl = this.getCostCodeLookUpConfig();
					break;
				case 'costcodepricep4fk':
					ovl = this.getCostCodeLookUpConfig();
					break;
				case 'costcodepricep5fk':
					ovl = this.getCostCodeLookUpConfig();
					break;
				case 'costcodepricep6fk':
					ovl = this.getCostCodeLookUpConfig();
					break;
				case	'plantcomponenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('resource.componenttype.plantcomponenttype');
					break;
				case 'taxcodefk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-master-data-context-tax-code-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							}
						}
					};
					break;
				case 'groupeurolistfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceEquipmentGroupEurolistLookupDataService',
						filter: function (item) {
							return {PKey1: item.PlantGroupFk};
						},
						filterKey: 'resource-equipmentgroup-self-eurolist-filter',
						valMember: 'Id',
						dispMember: 'Code'
					});
					break;
			}

			return ovl;
		};
	}
})(angular);
