(function (angular) {
	'use strict';
	/* global globals */
	var mainModule = angular.module('logistic.job');
	/**
	 * @ngdoc service
	 * @name logisticJobContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('logisticJobContainerInformationService', LogisticJobContainerInformationService);

	LogisticJobContainerInformationService.$inject = ['$injector', '$http', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService', 'basicsCommonComplexFormatter', 'logisticCommonLayoutOverloadService',
		'resourceWotLookupConfigGenerator', 'resourceCommonContainerInformationService', 'resourceCommonLayoutHelperService',
		'logisticJobConstantValues','logisticCommonDragDropService'];

	function LogisticJobContainerInformationService($injector, $http, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, basicsCommonComplexFormatter, logisticCommonLayoutOverloadService,
		resourceWotLookupConfigGenerator, resourceCommonContainerInformationService, resourceCommonLayoutHelperService,
		logisticJobConstantValues, logisticCommonDragDropService) {

		var self = this;
		var guids = logisticJobConstantValues.uuid.container;
		var dynamicConfigurations = {};

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
			},
			{
				key: 'logistic-material-filter',
				fn: function (item) {
					var filter = '';
					if (item && item.MaterialGroupFk !== null) {
						filter = 'MdcMaterialGroupFk' + item.MaterialGroupFk;
					}
					return filter;
				}
			},
			{
				key: 'procurement-pes-item-item-filter',
				serverKey: 'procurement-pes-item-item-filter',
				serverSide: true,
				fn: function (dataContext) {
					return {
						IsCanceled: false,
						IsDelivered: false,
						// prcHeaderIds: procurementPesHeaderService.getBaseNChangeOrderPrcHeaderIds() //prcHeaderId
						ContractId: dataContext.ConHeaderFk
					};
				}
			},
			{
				key: 'logistic-job-is-maintenance-filter',
				fn: function filterJobTypByIsMaintenance(item, entity) {
					if (entity.Version === 0 && entity.IsMaintenance === true) {
						return item.IsMaintenance === entity.IsMaintenance;
					} else {
						return true;
					}
				}
			},
			{
				key: 'logistic-job-task-evaluation-invheader-filter',
				serverKey: 'businesspartner-main-evaluation-invheader-filter',
				serverSide: true,
				fn: function (item) {
					// var projektFk = $injector.get('logisticJobDataService').getSelected()?  $injector.get('logisticJobDataService').getSelected().ProjectFk : null;
					if (item.JobTaskTypeFk === 2 && item.BusinessPartnerFk || item.ContractHeaderFk) {
						return {
							BusinessPartnerFk: item.BusinessPartnerFk,
							ConHeaderFk: item.ContractHeaderFk,
						};
					}
				}
			},
			{
				key: 'logistic-job-task-prc-con-header-filter',
				serverKey: 'prc-con-header-filter',
				serverSide: true,
				fn: function (item) {
					return {
						BusinessPartnerFk: item.BusinessPartnerFk !== null ? item.BusinessPartnerFk : null,
					};
				}
			},
			{
				key: 'logistic-job-dispatch-rubric-category-by-rubric-filter',
				fn: function filterCategoryByRubric(item) {
					return item.RubricFk === 34;
				}
			},
			{
				key: 'dispatch-nodes-rubric-category-lookup-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function () {
					return { Rubric: 34 };
				}
			}
			]);


		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case '11091450f3e94dc7ae58cbb563dfecad': // logisticJobListController
					// No second parameter, because in dynamic container it causes an error
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobServiceInfos());
					config.listConfig = { initCalled: false, columns: [], dragDropService: logisticCommonDragDropService, type: 'logistic.job'};
					break;
				case 'b0e4433e826b44c69f422d42e9788e49': // logisticJobDetailController
					// No second parameter, because in dynamic container it causes an error
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobServiceInfos());
					break;
				case '20e85d49386d410c85988b42e384759f': // logisticJobDocumentListController
					layServ = $injector.get('logisticJobDocumentUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					self.addLogisticJobDocumentServiceInfos(config);
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '8893ada79e704d60ac11c87235d95c0e': // logisticJobDocumentDetailController
					layServ = $injector.get('logisticJobDocumentUIStandardService');
					config.layout = layServ.getStandardConfigForDetailView();
					self.addLogisticJobDocumentServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case '361273dab16942fa97c7c51b43b9d361': // logisticJobEquipmentCatPriceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobEquipmentCatPriceServiceInfos(),
						self.getLogisticJobEquipmentCatPriceLayout);
					break;
				case '1f657746606c440fbac058367512dcef': // logisticJobEquipmentCatPriceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobEquipmentCatPriceServiceInfos(),
						self.getLogisticJobEquipmentCatPriceLayout);
					break;
				case '01f5e790a9e9416da8f7c4171e9ece5d': // logisticJobEquipmentCatPriceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobMaterialCatPriceServiceInfos(),
						self.getLogisticJobMaterialCatPriceLayout);
					break;
				case '2f3c295af8024ecc8f8fd55518417e84': // logisticJobEquipmentCatPriceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobMaterialCatPriceServiceInfos(),
						self.getLogisticJobMaterialCatPriceLayout);
					break;
				case '36d8fdec018141e6b4b3a450425849b0': // logisticJobMaterialListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobPrj2MaterialServiceInfos(),
						self.getLogisticJobPrj2MaterialLayout);
					break;
				case '34673772740a46fda71000928bf0eb7d': // logisticJobMaterialDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobPrj2MaterialServiceInfos(),
						self.getLogisticJobPrj2MaterialLayout);
					break;
				case '19ee8d84d00c4b9d936713e302ae49f0': // logisticJobMaterialRateListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobMaterialRateServiceInfos(),
						self.getLogisticJobMaterialRateLayout);
					break;
				case '265fbb21125d4d749f72f47922a8ad4f': // logisticJobMaterialRateDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobMaterialRateServiceInfos(),
						self.getLogisticJobMaterialRateLayout);
					break;
				case '89bf60f70caf4d6db646a941b632e40b': // logisticJobMaterialListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobPrj2MaterialPriceCondServiceInfos(),
						self.getLogisticJobPrj2MaterialPriceCondLayout);
					break;
				case '9618d193861547efa8a8b233ed80c00d': // logisticJobMaterialDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobPrj2MaterialPriceCondServiceInfos(),
						self.getLogisticJobPrj2MaterialPriceCondLayout);
					break;
				case 'd106505776d14f8c9f4737b18370b2cb': // logisticJobCostCodeRateListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobCostCodeRateServiceInfos(),
						self.getLogisticJobCostCodeRateLayout);
					break;
				case 'bf85675ae414422f91d2a916a418b447': // logisticJobCostCodeRateDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobCostCodeRateServiceInfos(),
						self.getLogisticJobCostCodeRateLayout);
					break;
				case 'e8ceec4dc6d54974a27159588c65962d': // logisticJobPlantPriceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobPlantPriceServiceInfos(),
						self.getLogisticJobPlantPriceLayout);
					break;
				case '4c30f0a003a047eea2528d8c44eddbde': // logisticJobPlantPriceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobPlantPriceServiceInfos(),
						self.getLogisticJobPlantPriceLayout);
					break;
				case '0a4b9b45b59445c9b536b1d20fb40be8': // logisticJobTaskListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobTaskServiceInfos(),
						self.getLogisticJobTaskLayout);
					break;
				case '173d56eae5954d47a7f63559dcc0076b': // logisticJobTaskDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobTaskServiceInfos(),
						self.getLogisticJobTaskLayout);
					break;
				case 'd7891ba1840c4b82959112b06d70afab': // logisticJobSundryServicePriceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobSundryServicePriceServiceInfos(),
						self.getLogisticJobSundryServicePriceLayout);
					break;
				case '0d5b4fcb1a204c9ab52e75bec5561bde': // logisticJobSundryServicePriceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobSundryServicePriceServiceInfos(),
						self.getLogisticJobSundryServicePriceLayout);
					break;
				case '432068179c654b419d3d42d7153d10f8': // logisticJobPlantAllocationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobPlantAllocationServiceInfos(),
						self.getLogisticJobPlantAllocationLayout);
					break;
				case 'f683b9900aa54c5db4eb359a1ab85115': // logisticJobPlantAllocationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobPlantAllocationServiceInfos(),
						self.getLogisticJobPlantAllocationLayout);
					break;
				case '283d7092e9fb431ca2b9610466d1de91': // logisticJobPlantAllocationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticJobPlantLocationServiceInfos(),
						self.getLogisticJobPlantLocationLayout);
					break;
				case '98adf5d9ac8748caa69d1c1f95462402': // logisticJobPlantAllocationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticJobPlantLocationServiceInfos(),
						self.getLogisticJobPlantLocationLayout);
					break;
				case guids.plantLocationList: // logisticJobPlantAllocationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlantLocationViewServiceInfo());
					break;
				case guids.plantLocationDetails: // logisticJobPlantAllocationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlantLocationViewServiceInfo());
					break;
				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;

			}

			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getLogisticJobServiceInfos = function getLogisticJobServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobUIStandardService',
				dataServiceName: 'logisticJobDataService',
				validationServiceName: 'logisticJobValidationService'
			};
		};

		this.getLogisticJobLayout = function getLogisticJobLayout() {
			var res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'logistic.job.detailform',
				['code', 'descriptioninfo', 'jobtypefk', 'jobstatusfk', 'jobgroupfk', 'divisionfk', 'companyfk', 'projectfk', 'controllingunitfk',
					'validfrom', 'validto', 'commenttext', 'calendarfk', 'ismaintenance','plantfk', 'plantgroupfk', 'settledbytypefk',
					'lastsettlementdate', 'sitefk','plantestimatepricelistfk', 'billingjobfk', 'hasloadingcost', 'calestimatefk', 'islive', 'pricinggroupfk', 'companyresponsiblefk'], {
					gid: 'pricing',
					attributes: ['costcodepricelistfk', 'costcodepriceversionfk', 'priceconditionfk', 'currencyfk']
				}, {
					gid: 'customer',
					attributes: ['addressfk', 'addressprjfk', 'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'deliveryaddresscontactfk',
						'incotermfk', 'clerkownerfk', 'clerkresponsiblefk']
				},
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', ''));

			res.overloads = platformLayoutHelperService.getOverloads(['code','costcodepricelistfk', 'costcodepriceversionfk',
				'divisionfk', 'jobtypefk', 'jobstatusfk', 'controllingunitfk', 'companyfk',
				'jobgroupfk', 'addressfk', 'addressprjfk', 'subsidiaryfk', 'customerfk',
				'deliveryaddresscontactfk', 'priceconditionfk', 'plantfk', 'plantgroupfk', 'settledbytypefk',
				'calendarfk', 'currencyfk', 'incotermfk', 'clerkownerfk', 'clerkresponsiblefk', 'sitefk',
				'plantestimatepricelistfk', 'billingjobfk', 'calestimatefk', 'pricinggroupfk', 'companyresponsiblefk'], self);


			res.overloads.businesspartnerfk = self.getBusinessPartnerLookup('logisticJobDataService');

			res.overloads.priceconditionfk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'logisticPriceConditionLookupDataService',
				navigator: {
					moduleName: 'logistic.pricecondition'
				}
			});

			res.overloads.islive = { readonly: true};
			res.overloads.ismaintenance = {readonly: true};
			res.overloads.lastsettlementdate = {readonly: true};
			res.overloads.projectfk = platformLayoutHelperService.provideProjectLookupOverload();

			return res;
		};

		this.addLogisticJobDocumentServiceInfos = function addLogisticJobDocumentServiceInfos(config) {
			config.standardConfigurationService = 'logisticJobDocumentUIStandardService';
			config.dataServiceName = 'logisticJobDocumentDataService';
			config.validationServiceName = 'logisticJobDocumentValidationService';
		};

		this.getLogisticJobEquipmentCatPriceServiceInfos = function getLogisticJobEquipmentCatPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobEquipmentCatPriceUIStandardService',
				dataServiceName: 'logisticJobEquipmentCatPriceDataService',
				validationServiceName: 'logisticJobEquipmentCatPriceValidationService'
			};
		};

		this.getLogisticJobEquipmentCatPriceLayout = function getLogisticJobEquipmentCatPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.equipmentcat2prices',
				['jobperformingfk', 'equipmentpricelistfk', 'evaluationorder', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['jobperformingfk', 'equipmentcatalogfk', 'equipmentpricelistfk'], self);

			return res;
		};

		this.getLogisticJobMaterialCatPriceServiceInfos = function getLogisticJobMaterialCatPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobMaterialCatPriceUIStandardService',
				dataServiceName: 'logisticJobMaterialCatPriceDataService',
				validationServiceName: 'logisticJobMaterialCatPriceValidationService'
			};
		};

		this.getLogisticJobMaterialCatPriceLayout = function getLogisticJobMaterialCatPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.materialcat2prices',
				['jobperformingfk', 'materialcatalogfk', 'materialpriceversionfk', 'materialpricelistfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['jobperformingfk', 'materialcatalogfk', 'materialpriceversionfk',
				'materialpricelistfk'], self);

			return res;
		};

		this.getLogisticJobPrj2MaterialServiceInfos = function getLogisticJobPrj2MaterialServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobPrj2MaterialUIStandardService',
				dataServiceName: 'logisticJobPrj2MaterialDataService',
				validationServiceName: 'logisticJobPrj2MaterialValidationService'
			};
		};

		this.getLogisticJobPrj2MaterialLayout = function getLogisticJobPrj2MaterialLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.prj2material',
				['materialdiscountgrpfk', 'taxcodefk', 'currencyfk', 'projectfk', 'materialgroupfk', 'materialfk', 'uomfk',
					'retailprice', 'listprice', 'discount', 'charges', 'cost', 'priceconditionfk', 'priceextra', 'estimateprice',
					'priceunit', 'uompriceunitfk', 'factorpriceunit', 'commenttext', 'costtypefk', 'factorhour']);
			res.overloads = platformLayoutHelperService.getOverloads(['materialdiscountgrpfk', 'taxcodefk', 'currencyfk', 'projectfk',
				'materialgroupfk', 'uomfk', 'priceconditionfk', 'uompriceunitfk', 'costtypefk'], self);

			res.overloads.materialfk = self.getMaterialReadOnlyOverload();

			return res;
		};

		this.getLogisticJobPrj2MaterialPriceCondServiceInfos = function getLogisticJobPrj2MaterialPriceCondServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobPrj2MaterialPriceCondUIStandardService',
				dataServiceName: 'logisticJobPrj2MaterialPriceConditionDataService',
				validationServiceName: 'logisticJobPrj2MaterialPriceCondValidationService'
			};
		};

		this.getLogisticJobPrj2MaterialPriceCondLayout = function getLogisticJobPrj2MaterialPriceCondLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.prj2materialpricecond',
				['priceconditiontypefk', 'description', 'value', 'total', 'totaloc', 'ispricecomponent', 'isactivated']);
			res.overloads = platformLayoutHelperService.getOverloads(['priceconditiontypefk'], self);

			return res;
		};

		this.getLogisticJobMaterialRateServiceInfos = function getLogisticJobMaterialRateServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobMaterialRateUIStandardService',
				dataServiceName: 'logisticJobMaterialRateDataService',
				validationServiceName: 'logisticJobMaterialRateValidationService'
			};
		};

		this.getLogisticJobMaterialRateLayout = function getLogisticJobMaterialRateLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.materialrates',
				['materialfk', 'currencyfk', 'commenttext', 'priceportion1', 'priceportion2', 'priceportion3', 'priceportion4', 'priceportion5', 'priceportion6']);
			res.overloads = platformLayoutHelperService.getOverloads(['materialfk', 'currencyfk'], self);

			return res;
		};

		this.getLogisticJobCostCodeRateServiceInfos = function getLogisticJobCostCodeRateeServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobCostCodeRateUIStandardService',
				dataServiceName: 'logisticJobCostCodeRateDataService',
				validationServiceName: 'logisticJobCostCodeRateValidationService'
			};
		};

		this.getLogisticJobCostCodeRateLayout = function getLogisticJobCostCodeRateLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.costcoderate',
				['costcodefk', 'rate', 'salesprice', 'currencyfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['costcodefk', 'currencyfk'], self);

			return res;
		};

		this.getLogisticJobPlantPriceServiceInfos = function getLogisticJobPlantPriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobPlantPriceUIStandardService',
				dataServiceName: 'logisticJobPlantPriceDataService',
				validationServiceName: 'logisticJobPlantPriceValidationService'
			};
		};

		this.getLogisticJobPlantPriceLayout = function getLogisticJobPlantPriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.plantprice',
				['plantfk', 'jobperformingfk', 'workoperationtypefk', 'ismanual', 'uomfk', 'priceportion1',
					'priceportion2', 'priceportion3', 'priceportion4', 'priceportion5', 'priceportion6',
					'validfrom', 'validto', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['plantfk', 'jobperformingfk', 'workoperationtypefk', 'uomfk'], self);

			return res;
		};

		this.getLogisticJobTaskServiceInfos = function getLogisticJobTaskServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobTaskUIStandardService',
				dataServiceName: 'logisticJobTaskDataService',
				validationServiceName: 'logisticJobTaskValidationService'
			};
		};

		this.getLogisticJobTaskLayout = function getLogisticJobTaskLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.jobtask',
				['jobtasktypefk', 'articlefk', 'commenttext', 'remark', 'quantity', 'contractheaderfk', 'businesspartnerfk', 'invheaderfk', 'jobcardareafk', 'itemquantity', 'itempriceunit', 'itempricetotal', 'articledescription']);
			res.overloads = platformLayoutHelperService.getOverloads(['articlefk', 'jobtasktypefk', 'contractheaderfk', 'invheaderfk','jobcardareafk'], self);

			res.overloads.itemquantity = { readonly: true };
			res.overloads.itempriceunit = { readonly: true };
			res.overloads.itempricetotal = { readonly: true };
			res.overloads.articledescription = { readonly: true };
			res.overloads.businesspartnerfk = self.getBusinessPartnerLookup('logisticJobTaskDataService');

			return res;
		};

		this.getLogisticJobSundryServicePriceServiceInfos = function getLogisticJobSundryServicePriceServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobSundryServicePriceUIStandardService',
				dataServiceName: 'logisticJobSundryServicePriceDataService',
				validationServiceName: 'logisticJobSundryServicePriceValidationService'
			};
		};

		this.getLogisticJobSundryServicePriceLayout = function getLogisticJobSundryServicePriceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.job.sundryserviceprice',
				['sundryservicefk', 'commenttext', 'jobperformingfk', 'ismanual', 'priceportion1',
					'priceportion2', 'priceportion3', 'priceportion4', 'priceportion5', 'priceportion6',
					'validfrom', 'validto']);
			res.overloads = platformLayoutHelperService.getOverloads(['sundryservicefk', 'jobperformingfk', 'workoperationtypefk'],
				self);

			return res;
		};

		this.getLogisticJobPlantAllocationServiceInfos = function getLogisticJobPlantAllocationServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobPlantAllocationUIStandardService',
				dataServiceName: 'logisticJobPlantAllocationDataService',
				validationServiceName: 'logisticJobPlantAllocationValidationService'
			};
		};

		this.getLogisticJobPlantLocationServiceInfos = function getLogisticJobPlantAllocationServiceInfos() {
			return {
				standardConfigurationService: 'logisticJobPlantLocation2LayoutService',
				dataServiceName: 'logisticJobLocation2DataService',
				validationServiceName: 'logisticJobPlantAllocationValidationService'
			};
		};

		this.getLogisticJobPlantAllocationLayout = function getLogisticJobPlantAllocationLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.job.plantallocation',
				[
					'plantfk', 'plantdescription', 'plantstatusfk', 'workoperationtypefk', 'planttypefk', 'plantkindfk', 'allocatedfrom',
					'allocatedto', 'releasedate', 'quantity', 'uomfk', 'commenttext', 'controllingunitfk', 'reservationfk',
					'dispatchrecordinfk', 'dispatchrecordoutfk','serialnumber'],
				{
					gid: 'dispatchNoteInformation',
					attributes: ['dispatchheaderincode', 'dispatchheaderindesc', 'dispatchheaderincomment', 'dispatchheaderoutcode', 'dispatchheaderoutdesc', 'dispatchheaderoutcomment', 'companyincode', 'companyinname', 'companyoutcode', 'companyoutname','isfrompes']
				});
			res.overloads = platformLayoutHelperService.getOverloads([
				'plantstatusfk', 'planttypefk', 'plantkindfk', 'uomfk', 'controllingunitfk', 'reservationfk', 'dispatchheaderincode',
				'dispatchheaderindesc', 'dispatchheaderincomment', 'dispatchheaderoutcode', 'dispatchheaderoutdesc',
				'dispatchheaderoutcomment', 'companyincode', 'companyinname', 'companyoutcode', 'companyoutname',
				'dispatchrecordinfk', 'dispatchrecordoutfk'], self);

			res.overloads.plantfk = resourceCommonLayoutHelperService.provideMassDataPlantLookupOverload();
			res.overloads.workoperationtypefk = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true,null,true);

			res. overloads.plantdescription = {readonly: true};
			res.overloads.isfrompes = { readonly: true };
			return res;
		};

		// PLANT LOCATION CONTAINER
		this.getLogisticJobPlantLocationLayout = function getLogisticJobPlantLocationLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.job.plantallocation',
				['plantfk', 'jobdescription', 'jobcode', 'plantdescription', 'workoperationtypefk', 'planttypefk', 'plantkindfk',
					'allocatedfrom', 'allocatedto', 'quantity', 'uomfk', 'projectno', 'projectname', 'plantgroupfk',
					'projectfk', 'jobgroupfk', 'plantisbulk', 'companycode', 'companyname','serialnumber']);
			res.overloads = platformLayoutHelperService.getOverloads(['planttypefk', 'plantkindfk', 'uomfk',
				'plantgroupfk', 'projectfk', 'jobgroupfk'], self);

			res.overloads.plantfk = resourceCommonLayoutHelperService.provideMassDataPlantLookupOverload();
			res.overloads.workoperationtypefk = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true,null,true);

			res.addAdditionalColumns = false;
			return res;
		};


		this.getPlantLocationViewServiceInfo = function getPlantLocationViewServiceInfo() {
			return resourceCommonContainerInformationService.getPlantLocationListInfo('logisticJobPlantLocationDataService');
		};

		this.getMaterialReadOnlyOverload = function getMaterialReadOnlyOverload() {
			return {
				navigator: {
					moduleName: 'basics.material'
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupOptions: {
							showClearButton: false,
							readOnly: true
						},
						lookupDirective: 'basics-material-material-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						displayMember: 'Code',
						filterKey: 'logistic-material-filter'
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							readOnly: true,
							additionalColumns: true,
							showClearButton: false,
							filterKey: 'logistic-material-filter',
							addGridColumns: [
								{
									id: 'description',
									field: 'DescriptionInfo.Translated',
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									formatter: 'description',
									readonly: true
								},
								{
									id: 'description2',
									field: 'DescriptionInfo2.Translated',
									name: 'Description2',
									name$tr$: 'Description2',
									formatter: 'description',
									readonly: true
								},
							]
						},
						directive: 'basics-material-material-lookup'
					},
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'Code'
					},
					width: 100
				}
			};
		};

		this.getArticleOverload = function getArticleOverload() {
			var constService = $injector.get('logisticJobConstantValues');

			var lookupInfo = {};
			lookupInfo[constService.jobTaskType.contract] = {
				column: 'PrcItemFk',
				lookup: {
					directive: 'prc-common-item-dialog-lookup',
					options: {
						descriptionMember: 'Description2',
						showClearButton: true,
						displayMember: 'Itemno',
						lookupType: 'PrcItemEntityLookup',
						additionalFilters: [{
							projectFk: 'ProjectFk',
							conHeaderFk: 'ConHeaderFk',
							getAdditionalEntity: function () {
								var item = {};
								if ($injector.get('logisticJobDataService').getSelected().ProjectFk) {
									item.ProjectFk = $injector.get('logisticJobDataService').getSelected().ProjectFk;
								}
								if($injector.get('logisticJobTaskDataService').getSelected().ContractHeaderFk){
									item.ConHeaderFk = $injector.get('logisticJobTaskDataService').getSelected().ContractHeaderFk;
								}
								return item;
							}
						} ],
						version: 3,
					}
				}
			};
			lookupInfo[constService.jobTaskType.invoice] = {
				column: 'InvOtherFk',
				lookup: {
					directive: 'invoice-other-dialog-lookup',
					options: {
						descriptionMember: 'Description',
						showClearButton: true,
						lookupType: 'InvOtherLookup',
						displayMember: 'Description',
						additionalFilters: [{
							projectFk: 'ProjectFk',
							invoiceFk: 'InvoiceFk',
							getAdditionalEntity: function () {
								var item = {};
								if ($injector.get('logisticJobDataService').getSelected().ProjectFk) {
									item.ProjectFk = $injector.get('logisticJobDataService').getSelected().ProjectFk;
								}
								if($injector.get('logisticJobTaskDataService').getSelected().InvHeaderFk){
									item.InvoiceFk = $injector.get('logisticJobTaskDataService').getSelected().InvHeaderFk;
								}
								return item;
							}
						} ],
						version: 3
					}
				}
			};

			return {
				detail: {
					type: 'directive',
					directive: 'dynamic-grid-and-form-lookup',
					options: {
						isTextEditable: false,
						dependantField: 'JobTaskTypeFk',
						lookupInfo: lookupInfo,
						grid: false,
						dynamicLookupMode: true,
						showClearButton: true
					}
				},
				grid: {
					editor: 'directive',
					editorOptions: {
						directive: 'dynamic-grid-and-form-lookup',
						dependantField: 'JobTaskTypeFk',
						lookupInfo: lookupInfo,
						isTextEditable: false,
						dynamicLookupMode: true,
						grid: true,
					},
					formatter: 'dynamic',
					domain: function (item, column, flag) {
						var info = lookupInfo[item.JobTaskTypeFk];
						if (info) {
							var prop = info.lookup.options;
							column.formatterOptions = {
								lookupType: prop.lookupType,
								displayMember: prop.displayMember,
								dataServiceName: prop.dataServiceName,
							};
							if (prop.version) {
								column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
							}
						} else {
							column.formatterOptions = null;
						}

						return flag ? 'directive' : 'lookup';
					},

				}
			};
		};

		function getAddressOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-common-address-dialog',
					model: 'Address',
					options: {
						titleField: 'cloud.common.entityAddress',
						foreignKey: 'AddressFk',
						showClearButton: true
					}
				},
				grid: {
					editor: 'lookup',
					field: 'Address',
					editorOptions: {
						lookupDirective: 'basics-common-address-dialog',
						'lookupOptions': {
							foreignKey: 'AddressFk',
							titleField: 'cloud.common.entityAddress'
						}
					},
					formatter: basicsCommonComplexFormatter,
					formatterOptions: {
						displayMember: 'AddressLine'
					}
				}
			};
		}

		function getCustomerOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-customer-lookup',
						lookupOptions: {
							filterKey: 'logistic-job-customer-filter',
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
					width: 125
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'business-partner-main-customer-lookup',
						descriptionField: 'CustomerDescription',
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'logistic-job-customer-filter',
							showClearButton: true
						}
					}
				}
			};
		}

		function getSubSidiaryOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'business-partner-main-subsidiary-lookup',
					options: {
						initValueField: 'SubsidiaryAddress',
						filterKey: 'logistic-job-subsidiary-filter',
						showClearButton: true,
						displayMember: 'AddressLine'
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'business-partner-main-subsidiary-lookup',
						lookupOptions: {
							showClearButton: true,
							filterKey: 'logistic-job-subsidiary-filter',
							displayMember: 'AddressLine'
						}
					},
					width: 125,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Subsidiary',
						displayMember: 'AddressLine'
					}
				}
			};
		}

		this.getBusinessPartnerLookup = function getBusinessPartnerLookup(dataServiceName) {
			let ovl = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
			// detail
			ovl.detail.options.mainService = dataServiceName;
			ovl.detail.options.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.detail.options.SubsidiaryField = 'SubsidiaryFk';
			// grid
			ovl.grid.editorOptions.lookupOptions.mainService = dataServiceName;
			ovl.grid.editorOptions.lookupOptions.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.grid.editorOptions.lookupOptions.SubsidiaryField = 'SubsidiaryFk';
			return ovl;
		};

		/* jshint -W074 */ // this function's cyclomatic complexity is too high.
		this.getOverload = function getOverloads(overload) { // jshint ignore:line
			var ovl = null;

			switch (overload) {
				case 'companyincode':
					ovl = {readonly: true};
					break;
				case 'sitefk':
					ovl = platformLayoutHelperService.provideSiteLookupOverload();
					break;
				case 'companyinname':
					ovl = {readonly: true};
					break;
				case 'companyoutcode':
					ovl = {readonly: true};
					break;
				case 'companyoutname':
					ovl = {readonly: true};
					break;
				case 'dispatchheaderincode':
					ovl = {
						// readonly: true,
						navigator:{
							moduleName: 'logistic.dispatching',
							targetIdProperty:'DispatchHeaderInFk'
						}
					};
					break;
				case 'dispatchheaderindesc':
					ovl = {readonly: true};
					break;
				case 'dispatchheaderincoment':
					ovl = {readonly: true};
					break;
				case 'dispatchheaderoutcode':
					ovl = {
						readonly: true,
						navigator:{
							moduleName: 'logistic.dispatching',
							targetIdProperty:'DispatchHeaderOutFk'
						}
					};
					break;
				case 'dispatchheaderoutdesc':
					ovl = {readonly: true};
					break;
				case 'dispatchheaderoutcomment':
					ovl = {readonly: true};
					break;
				case 'addressfk':
					ovl = getAddressOverload();
					break;
				case 'addressprjfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectAddressesLookupDataService',
						filter: function (item) {
							var prj;
							if (item) {
								prj = item.ProjectFk;
							}
							return prj;
						}
					});
					break;
				case 'calendarfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupCalendarDataService',
						enableCache: true
					});
					break;
				case 'calestimatefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupCalendarDataService',
						enableCache: true
					});
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'controllingunitfk':
					ovl = logisticCommonLayoutOverloadService.getControllingUnitLookupOverload();
					break;
				case 'costcodepricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist', null, {
						showClearButton: true
					});
					break;
				case 'costcodepriceversionfk':
					ovl = platformLayoutHelperService.provideCostCodePriceVersionLookupOverload('logistic-job-priceversion-filter');
					break;
				case 'customerfk':
					ovl = getCustomerOverload();
					break;
				case 'deliveryaddresscontactfk':
					ovl = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupDlgOverload(
						'logistic-job-business-partner-contact-filter'
					);
					break;
				case 'divisionfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentdivision');
					break;
				case 'equipmentcatalogfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceCatalogLookupDataService'
					});
					break;
				case 'equipmentpricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentpricelist');
					break;
				case 'jobtypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomLogisticJobTypeLookupDataService',
						filterKey: 'logistic-job-is-maintenance-filter'
					});
					break;
				case 'jobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobgroup');
					break;
				case 'jobstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobstatus', null, {showIcon: true});
					break;
				case 'jobtasktypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticjobtasktype');
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
				case 'materialpriceversionfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-material-catalog-price-version-lookup',
							options: {
								filterKey: 'logistic-material-price-list-price-version-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-material-catalog-price-version-lookup',
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
				case 'materialdiscountgrpfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-material-material-discount-group-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-material-material-discount-group-lookup',
								lookupOptions: {
									showClearButton: true,
									additionalColumns: true,
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
								lookupType: 'MaterialDiscountGroup',
								displayMember: 'Code'
							}
						}
					};
					break;
				case 'jobperformingfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'taxcodefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.taxcode.taxcode');
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupReadOnlyOverload();
					break;
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification());
					break;
				case 'materialfk':
					ovl = platformLayoutHelperService.getMaterialOverload('logistic-material-filter');
					break;
				case 'materialgroupfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-material-material-group-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-material-material-group-lookup',
								lookupOptions: {
									showClearButton: true,
									additionalColumns: true,
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
								lookupType: 'MaterialGroup',
								displayMember: 'Code'
							}
						}
					};
					break;
				case 'subsidiaryfk':
					ovl = getSubSidiaryOverload();
					break;
				case 'uompriceunitfk':
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'plantestimatepricelistfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantestimatepricelist');
					break;
				case 'plantstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService'
					});
					break;
				case 'plantkindfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantkind');
					break;
				case 'planttypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.planttype');
					break;
				case 'priceconditionfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-Material-Price-Condition-Combobox',
							options: {
								showClearButton: true,
								dataService: 'projectMaterialPriceConditionServiceNew'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									dataService: 'projectMaterialPriceConditionServiceNew'
								},
								directive: 'basics-Material-Price-Condition-Combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcPricecondition',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					};
					break;
				case 'priceconditiontypefk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupField: 'PrcPriceConditionTypeFk',
								lookupDirective: 'procurement-common-price-condition-type-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcpriceconditiontype',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						detail: {
							type: 'directive',
							directive: 'procurement-common-price-condition-type-lookup'
						}
					};
					break;
				case 'costcodefk':
					ovl = platformLayoutHelperService.provideCostCodeLookupOverload();
					break;
				case 'costtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description');
					break;
				case 'materialpricelistfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist');
					break;
				case 'sundryservicefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServiceLookupDataService'
					});
					break;
				case 'workoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true);
					break;
				case 'plantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					break;
				case 'plantgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceEquipmentGroupLookupDataService',
						cacheEnable: true
					});
					break;
				case 'reservationfk':
					ovl = logisticCommonLayoutOverloadService.getResourceReservationLookupOverload('ReservationFk', false, true);
					break;
				case 'settledbytypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticssettledbytype');
					break;
				case 'articlefk':
					ovl = self.getArticleOverload();
					break;
				case 'costcodetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodetype', 'Description');
					break;

				case 'abcclassificationfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.abcclassification', 'Description');
					break;
				case 'costcodeportionsfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodeportions', 'Description');
					break;
				case 'costgroupportionsfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costgroupportions', 'Description');
					break;
				case 'procurementstructurefk':
					ovl = {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
						}
					};
					break;
				case 'controllingcostcodefk':
					ovl = {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-cost-codes-controlling-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							},
							'change': 'change'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-cost-codes-controlling-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ControllingCostCode',
								displayMember: 'Code'
							}
						}
					};
					break;

				case 'incotermfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-incoterm-combobox',
							options: {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-lookupdata-incoterm-combobox'
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcincoterm',
								displayMember: 'Description'
							}
						}
					};
					break;

				case 'clerkownerfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();// true, 'ClerkOwnerFk'
					break;
				case 'clerkresponsiblefk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();// true, 'ClerkResponsibleFk'
					break;
				case 'contractheaderfk':
					ovl = {
						grid: {
							navigator: {
								moduleName: 'procurement.contract'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									addGridColumns: [
										{
											id: 'DateOrdered',
											field: 'DateOrdered',
											name: 'Date Ordered',
											name$tr$: 'cloud.common.entityDateOrdered',
											formatter: 'dateutc',
											readonly: true
										},
										{
											id: 'Description',
											field: 'Description',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											readonly: true
										},
									],
									additionalColumns: true,

									filterKey: 'logistic-job-task-prc-con-header-filter',
									showClearButton: true,
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: 'Setting basis contract will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.contractHeaderUpdateInfo'
										}]
									}
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'conheaderview', 'displayMember': 'Code'},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-con-header-filter',
									dialogOptions: {
										alerts: [{
											theme: 'info',
											message: 'Setting basis contract will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.contractHeaderUpdateInfo'
										}]
									}
								}
							}
						}
					};
					break;

				case 'invheaderfk':
					ovl = {
						'navigator': {
							moduleName: 'procurement.invoice'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-header-dialog',
								lookupOptions: {
									filterKey: 'logistic-job-task-evaluation-invheader-filter',
									showClearButton: true
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvHeaderChained',
								displayMember: 'Code'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'procurement-invoice-header-dialog',
								descriptionMember: 'Reference',
								lookupOptions: {
									filterKey: 'logistic-job-task-evaluation-invheader-filter',
									showClearButton: true
								}
							}
						},
					};
					break;

				case 'jobcardareafk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobcardarea',null,{
						field: 'DivisionFk',
						filterKey: 'logistic-job-card-by-division-filter',
						customIntegerProperty: 'ETM_DIVISION_FK'
					});
					break;
				case 'dispatchrecordinfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticDispatchingRecordLookupOnAllocDataService'
					});
					break;
				case 'dispatchrecordoutfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticDispatchingRecordLookupOnAllocDataService'
					});
					break;
				case 'pricinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticPricingGroupLookupDataService',
						filter: function (item) {
							if (item) {
								return item.PriceConditionFk;
							}
							return 0;
						}
					});
					break;
				case 'billingjobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'companyresponsiblefk': ovl = {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 140
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						model: 'CompanyResponsibleFk',
						options: {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName'
						},
						change: 'formOptions.onPropertyChanged'
					}
				};	break;

			}
			return ovl;

		};
	}
})(angular);
