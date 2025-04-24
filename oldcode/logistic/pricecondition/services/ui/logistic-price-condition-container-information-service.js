/**
 * Created by baf on 28.02.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticPriceconditionContainerInformationService
	 * @description provides information on container used in logistic price module
	 */
	angular.module(moduleName).service('logisticPriceconditionContainerInformationService', LogisticPriceConditionContainerInformationService);

	LogisticPriceConditionContainerInformationService.$inject = ['_', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'basicsLookupdataLookupFilterService'];

	function LogisticPriceConditionContainerInformationService(_, basicsLookupdataConfigGenerator, platformLayoutHelperService, basicsLookupdataLookupFilterService) {
		var self = this;
		basicsLookupdataLookupFilterService.registerFilter(
			[{
				key: 'logistic-material-price-list-price-version-filter',
				serverSide: true,
				serverKey: 'basics-material-price-list-price-version-filter',
				fn: function (item) {
					return {
						MaterialCatalogFk: item !== null ? item.MaterialCatalogFk : null
					};
				}
			}, {
				key: 'logistic-price-condition-cost-code-price-version',
				fn: function (coco, condition) {
					return coco.PriceListFk === condition.MasterDataPriceListFk;
				}
			}, {
				key: 'logistic-price-condition-material-filter',
				serverSide: true,
				fn: function (entity, searchOptions) {
					if (entity) {
						searchOptions.MaterialTypeFilter = {
							IsForRM: true,
						};
					}
				}
			},{
				key: 'logistic-price-condition-unit-hour-filter',
				fn: function (unit, searchOptions) {
					return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === searchOptions.UomHourFk;
				}
			},{
				key: 'logistic-price-condition-unit-day-filter',
				fn: function (unit, searchOptions) {
					return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === searchOptions.UomDayFk;
				}
			},{
				key: 'logistic-price-condition-unit-month-filter',
				fn: function (unit, searchOptions) {
					return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === searchOptions.UomMonthFk;
				}
			},{
				key: 'logistic-price-condition-unit-idle-filter',
				fn: function (unit, searchOptions) {
					return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === searchOptions.UomIdleFk;
				}
			}]
		);

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case '5d0e37f033664ce6b0faf2114db0906a': // logisticPriceConditionListController
					config = self.getLogisticPriceConditionServiceInfos();
					config.layout = self.getLogisticPriceConditionLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '24c4f1aecb6d4a5aa735201177521649': // logisticPriceConditionDetailController
					config = self.getLogisticPriceConditionServiceInfos();
					config.layout = self.getLogisticPriceConditionLayout();
					config.ContainerType = 'Detail';
					break;
				case 'bc0c1a5bc4dc420d98bd85a0eeac59f4': // logisticPriceConditionItemListController
					config = self.getLogisticPriceConditionItemServiceInfos();
					config.layout = self.getLogisticPriceConditionItemLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '96e91752e0ca46f59eb4b332fb6573b4': // logisticPriceConditionItemDetailController
					config = self.getLogisticPriceConditionItemServiceInfos();
					config.layout = self.getLogisticPriceConditionItemLayout();
					config.ContainerType = 'Detail';
					break;
				case 'e07d54925ba64e7db4928907939e1bda': // logisticPriceConditionCostCodeRateListController
					config = self.getLogisticCostCodeRateServiceInfos();
					config.layout = self.getLogisticCostCodeRateLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'e37b49b2796d4950bd7c54dfaf6cf86a': // logisticPriceConditionCostCodeRateDetailController
					config = self.getLogisticCostCodeRateServiceInfos();
					config.layout = self.getLogisticCostCodeRateLayout();
					config.ContainerType = 'Detail';
					break;
				case 'bc736a161cc248eaad95db451e06b541': // logisticPriceConditionEquipmentCatalogPriceListController
					config = self.getLogisticEquipmentCatalogPriceServiceInfos();
					config.layout = self.getLogisticEquipmentCatalogPriceLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '6e88700ea7a54efe805436ee4272ba99': // logisticPriceConditionEquipmentCatalogPriceDetailController
					config = self.getLogisticEquipmentCatalogPriceServiceInfos();
					config.layout = self.getLogisticEquipmentCatalogPriceLayout();
					config.ContainerType = 'Detail';
					break;
				case 'bd261e0906984702a6d01964ffc58bcc': // logisticPriceConditionMaterialCatalogPriceListController
					config = self.getLogisticMaterialCatalogPriceServiceInfos();
					config.layout = self.getLogisticMaterialCatalogPriceLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '00c2aee866bc4607b3824ea4e05700b6': // logisticPriceConditionMaterialCatalogPriceDetailController
					config = self.getLogisticMaterialCatalogPriceServiceInfos();
					config.layout = self.getLogisticMaterialCatalogPriceLayout();
					config.ContainerType = 'Detail';
					break;
				case '2934c2d1160447bc860cc5c3897e4d9f': // logisticPriceConditionPlantPriceListController
					config = self.getLogisticPlantPriceServiceInfos();
					config.layout = self.getLogisticPlantPriceLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'dc76760660e9466da30b5a7116fc2f52': // logisticPriceConditionPlantPriceDetailController
					config = self.getLogisticPlantPriceServiceInfos();
					config.layout = self.getLogisticPlantPriceLayout();
					config.ContainerType = 'Detail';
					break;
				case '76206e93e60a4f60a71fd0d0961c6da1': // logisticPriceConditionSundryServicePriceListController
					config = self.getLogisticSundryServicePriceServiceInfos();
					config.layout = self.getLogisticSundryServicePriceLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '9eefecb804a840e0bcefd6825c957374': // logisticPriceConditionSundryServicePriceDetailController
					config = self.getLogisticSundryServicePriceServiceInfos();
					config.layout = self.getLogisticSundryServicePriceLayout();
					config.ContainerType = 'Detail';
					break;







				case 'ef3955379c4447a3bda9264908229c8b': // logisticPriceConditionSundryServicePriceListController
					// getMaterialPriceLayout
					config = platformLayoutHelperService.getStandardGridConfig(self.getMaterialPriceServiceInfos());
					break;
				case '39f4db632f194d0bb918fc8981f1011e': // logisticPriceConditionSundryServicePriceDetailController
					// getMaterialPriceLayout
					config = platformLayoutHelperService.getStandardDetailConfig(self.getMaterialPriceServiceInfos());
					break;
				case '767c6e762ece45f6bedf133f02e9baa3': // logisticPriceConditionPlantCostCodeListController
					config = self.getLogisticPlantCostCodeInfos();
					config.layout = self.getLogisticPlantCostCodeLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '28e3bcdb271d40f29c2f1a97683dc1ca': // logisticPriceConditionPlantCostCodeDetailController
					config = self.getLogisticPlantCostCodeInfos();
					config.layout = self.getLogisticPlantCostCodeLayout();
					config.ContainerType = 'Detail';
					break;
			}
			return config;
		};

		this.getLogisticPriceConditionServiceInfos = function getLogisticPriceConditionServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionLayoutService',
				dataServiceName: 'logisticPriceConditionDataService',
				validationServiceName: 'logisticPriceConditionValidationService'
			};
		};

		this.getLogisticPriceConditionLayout = function getLogisticPriceConditionLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.pricecondition',
				['logisticcontextfk', 'code', 'descriptioninfo', 'masterdatapricelistfk', 'masterdatacostcodepriceversionfk', 'ishandlingcharge', 'handlingchargefull', 'handlingchargereduced',
					'handlingchargeextern', 'userdefinedtext01', 'userdefinedtext02', 'userdefinedtext03', 'userdefinedtext04',
					'userdefinedtext05', 'ismultiple01', 'ismultiple02', 'ismultiple03', 'ismultiple04', 'handlingchargerating01',
					'handlingchargerating02', 'handlingchargerating03', 'handlingchargerating04', 'departureratingpercent',
					'isdefault', 'currencyfk', 'sundryserviceloadingcostsfk', 'volumehandlingchargereduced', 'volumehandlingchargefull']);
			res.overloads = platformLayoutHelperService.getOverloads(['logisticcontextfk', 'masterdatapricelistfk', 'masterdatacostcodepriceversionfk', 'currencyfk', 'sundryserviceloadingcostsfk'], self);

			return res;
		};

		this.getLogisticPriceConditionItemServiceInfos = function getLogisticPriceConditionItemServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionItemLayoutService',
				dataServiceName: 'logisticPriceConditionItemDataService',
				validationServiceName: 'logisticPriceConditionItemValidationService'
			};
		};

		this.getLogisticPriceConditionItemLayout = function getLogisticPriceConditionItemLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.priceconditionitem',
				['descriptioninfo', 'commenttext', 'workoperationtypefk', 'pricinggroupfk', 'percentage01', 'percentage02', 'percentage03',
					'percentage04', 'percentage05', 'percentage06', 'validfrom', 'validto']);

			res.overloads = platformLayoutHelperService.getOverloads(['workoperationtypefk', 'pricinggroupfk'], self);

			return res;
		};

		this.getLogisticCostCodeRateServiceInfos = function getLogisticCostCodeRateServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionCostCodeRateLayoutService',
				dataServiceName: 'logisticPriceConditionCostCodeRateDataService',
				validationServiceName: 'logisticPriceConditionCostCodeRateValidationService'
			};
		};

		this.getLogisticCostCodeRateLayout = function getLogisticCostCodeRateLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.costcoderate',
				['costcodefk', 'rate', 'salesprice', 'currencyfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['costcodefk', 'currencyfk'], self);

			return res;
		};

		this.getLogisticEquipmentCatalogPriceServiceInfos = function getLogisticEquipmentCatalogPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionEquipmentCatalogPriceLayoutService',
				dataServiceName: 'logisticPriceConditionEquipmentCatalogPriceDataService',
				validationServiceName: 'logisticPriceConditionEquipmentCatalogPriceValidationService'
			};
		};

		this.getLogisticEquipmentCatalogPriceLayout = function getLogisticEquipmentCatalogPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.equipmentcatalogprice',
				['equipmentpricelistfk', 'evaluationorder', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['equipmentcatalogfk', 'equipmentpricelistfk'], self);

			return res;
		};

		this.getLogisticMaterialCatalogPriceServiceInfos = function getLogisticMaterialCatalogPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionMaterialCatalogPriceLayoutService',
				dataServiceName: 'logisticPriceConditionMaterialCatalogPriceDataService',
				validationServiceName: 'logisticPriceConditionMaterialCatalogPriceValidationService'
			};
		};

		this.getLogisticMaterialCatalogPriceLayout = function getLogisticMaterialCatalogPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.materialcatalogprice',
				['materialcatalogfk', 'materialpricelistfk', 'materialpriceversionfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['materialcatalogfk', 'materialpricelistfk', 'materialpriceversionfk'], self);

			return res;
		};

		this.getLogisticPlantPriceServiceInfos = function getLogisticPlantPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionPlantPriceLayoutService',
				dataServiceName: 'logisticPriceConditionPlantPriceDataService',
				validationServiceName: 'logisticPriceConditionPlantPriceValidationService'
			};
		};

		this.getLogisticPlantPriceLayout = function getLogisticPlantPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.plantprice',
				['plantfk', 'commenttext', 'workoperationtypefk', 'ismanual', 'uomfk', 'priceportion1', 'priceportion2', 'priceportion3',
					'priceportion4', 'priceportion5', 'priceportion6', 'validfrom', 'validto']);
			res.overloads = platformLayoutHelperService.getOverloads(['plantfk', 'workoperationtypefk', 'uomfk'], self);

			return res;
		};

		this.getLogisticSundryServicePriceServiceInfos = function getLogisticSundryServicePriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionSundryServicePriceLayoutService',
				dataServiceName: 'logisticPriceConditionSundryServicePriceDataService',
				validationServiceName: 'logisticPriceConditionSundryServicePriceValidationService'
			};
		};

		this.getLogisticSundryServicePriceLayout = function getLogisticSundryServicePriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.sundryserviceprice',
				['sundryservicefk', 'commenttext', 'ismanual', 'priceportion1', 'priceportion2', 'priceportion3', 'priceportion4',
					'priceportion5', 'priceportion6', 'validfrom', 'validto']);
			res.overloads = platformLayoutHelperService.getOverloads(['sundryservicefk'], self);

			return res;
		};

		this.getLogisticPlantCostCodeInfos = function getLogisticPlantCostCodeInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionPlantCostCodeLayoutService',
				dataServiceName: 'logisticPriceConditionPlantCostCodeDataService',
				validationServiceName: 'logisticPriceConditionPlantCostCodeValidationService'
			};
		};

		this.getLogisticPlantCostCodeLayout = function getLogisticPlantCostCodeLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.plantcostcode',
				['ismanual','uomdayfk','uomhourfk','uommonthfk','uomidlefk','daywotfk','hourwotfk'
					,'monthwotfk','idlewotfk','percentagehour','percentageday','percentagemonth','percentageidle','plantgroupfk','plantgroupspecvaluefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['plantgroupfk', 'uomdayfk',
				'uomhourfk', 'uommonthfk', 'uomidlefk', 'daywotfk','hourwotfk', 'monthwotfk', 'idlewotfk','plantgroupspecvaluefk'], self);

			res.overloads.plantgroupspecvaluefk.readonly=true;

			return res;
		};

		this.getMaterialPriceServiceInfos = function getMaterialPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticPriceConditionMaterialPriceLayoutService',
				dataServiceName: 'logisticPriceConditionMaterialPriceDataService',
				validationServiceName: 'logisticPriceConditionMaterialPriceValidationService'
			};
		};

		this.getMaterialPriceLayout = function getMaterialPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.price.materialprice',
				['materialcatalogfk', 'materialfk', 'currencyfk', 'price', 'validfrom', 'validto', 'commenttext','uom']);

			res.overloads = platformLayoutHelperService.getOverloads(['materialcatalogfk', 'materialfk', 'currencyfk','uom'], self);



			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'specificvaluetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.specificvaluetype', null, {
						field: 'UomFk',
						customIntegerProperty: 'BAS_UOM_FK'
					});
					break;



				case 'logisticcontextfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticscontext');
					break;
				case 'pricinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentpricinggroup');
					break;
				case 'costcodefk':
					ovl = platformLayoutHelperService.provideCostCodeLookupOverload();
					break;
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification());
					break;
				case 'equipmentcatalogfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceCatalogLookupDataService'
					});
					break;
				case 'equipmentpricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentpricelist');
					break;
				case 'materialcatalogfk':
					ovl = {
						navigator: {
							moduleName: 'basics.materialcatalog'
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-material-material-catalog-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-material-material-catalog-lookup',
								lookupOptions: {
									showClearButton: true,
									additionalColumns: true,
									displayMember: 'Code',
									addGridColumns: [{
										id: 'description',
										field: 'DescriptionInfo',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription',
										formatter: 'translation',
										readonly: true
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCatalog',
								displayMember: 'Code'
							}
						}
					};
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
									filterKey: 'logistic-price-condition-material-filter',
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'logistic-price-condition-material-filter',
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
				case 'materialpricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist');
					break;
				case 'materialpriceversionfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-material-catalog-price-version-lookup2',
							options: {
								filterKey: 'logistic-material-price-list-price-version-filter'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-material-catalog-price-version-lookup2',
								lookupOptions: {
									filterKey: 'logistic-material-price-list-price-version-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialPriceVersion',
								displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
							}
						}
					};
					break;
				case 'plantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
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
						readonly: true
					};
					break;
				case 'plantgroupspecvaluefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticPriceGroupSpecificValueLookupDataService'
					});
					break;
				case 'sundryservicefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServiceLookupDataService'
					});
					break;
				case 'sundrypricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServicePriceListLookupDataService',
						filter: function (item) {
							return item.SundryServiceFk;
						}
					});
					break;
				case 'masterdatapricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist');
					break;
				case 'masterdatacostcodepriceversionfk':
					ovl = platformLayoutHelperService.provideCostCodePriceVersionLookupOverload('logistic-price-condition-cost-code-price-version');
					break;
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'uomdayfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitCalendarLookupDataService',
						filterKey: 'logistic-price-condition-unit-day-filter'
					});
					break;
				case 'uomhourfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitCalendarLookupDataService',
						filterKey: 'logistic-price-condition-unit-hour-filter'
					});
					break;
				case 'uommonthfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitCalendarLookupDataService',
						filterKey: 'logistic-price-condition-unit-month-filter'
					});
					break;
				case 'uomidlefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitCalendarLookupDataService',
						filterKey: 'logistic-price-condition-unit-idle-filter'
					});
					break;
				case 'workoperationtypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					});
					break;
				case 'daywotfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					});
					break;
				case 'hourwotfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					});
					break;
				case 'monthwotfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					});
					break;
				case 'idlewotfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					});
					break;
				case 'sundryserviceloadingcostsfk':
					ovl =basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServiceLookupDataService'
					});
					break;
			}

			return ovl;
		};
	}
})(angular);
