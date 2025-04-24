/**
 * Created by baf on 29.01.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingContainerInformationService
	 * @description provides information on container used in logistic dispatching module
	 */
	angular.module(moduleName).service('logisticDispatchingContainerInformationService', LogisticDispatchingContainerInformationService);

	LogisticDispatchingContainerInformationService.$inject = ['_', '$injector', 'platformDataValidationService', 'platformLayoutHelperService', 'platformSourceWindowGridDragService',
		'platformDragdropService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator', 'logisticCommonLayoutOverloadService',
		'basicsCommonComplexFormatter', 'resourceWotLookupConfigGenerator', 'logisticDispatchingConstantValues',
		'resourceCommonLayoutHelperService', 'logisticSettlementConstantValues', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingContainerInformationService(_, $injector, platformDataValidationService, platformLayoutHelperService, platformSourceWindowGridDragService,
		platformDragdropService, basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator, logisticCommonLayoutOverloadService,
		basicsCommonComplexFormatter, resourceWotLookupConfigGenerator, logisticDispatchingConstantValues,
		resourceCommonLayoutHelperService, logisticSettlementConstantValues, logisticDispatchingHeaderDataService) {
		let self = this;
		let dynamicConfigurations = {};
		let plantRecordTypeId = logisticDispatchingConstantValues.record.type.plant;
		const containerUuids = logisticDispatchingConstantValues.uuid.container;

		let articleLookupConfig = null;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;

			switch (guid) {
				case containerUuids.headerList: // logisticDispatchingHeaderListController
					config = self.getLogisticDispatchingHeaderServiceInfos();
					config.layout = self.getLogisticDispatchingHeaderLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false, columns: [],
						dragDropService: $injector.get('logisticDispatchingRecordDropService')
					};
					break;
				case containerUuids.headerDetails: // logisticDispatchingHeaderDetailController
					config = self.getLogisticDispatchingHeaderServiceInfos();
					config.layout = self.getLogisticDispatchingHeaderLayout();
					config.ContainerType = 'Detail';
					break;
				case containerUuids.recordList: // logisticDispatchingRecordListController
					config = self.getLogisticDispatchingRecordServiceInfos();
					config.layout = self.getLogisticDispatchingRecordLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						dragDropService: $injector.get('logisticDispatchingRecordDropService'),
						type: 'dispatchRecord',
						allowedDragActions: [platformDragdropService.actions.copy]
					};
					break;
				case containerUuids.recordDetails: // logisticDispatchingRecordDetailController
					config = self.getLogisticDispatchingRecordServiceInfos();
					config.layout = self.getLogisticDispatchingRecordLayout();
					config.ContainerType = 'Detail';
					break;
				case containerUuids.requisitionItemList: // logisticDispatchingRequistionItemViewListController
					config = self.getLogisticRequisitionItemServiceInfos();
					config.layout = $injector.get('logisticDispatchingRequisitionItemUiLayoutService').createMainDetailLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case containerUuids.requisitionItemDetails: // logisticDispatchingRequisitionItemViewDetailController
					config = self.getLogisticRequisitionItemServiceInfos();
					config.layout = $injector.get('logisticDispatchingRequisitionItemUiLayoutService').createMainDetailLayout();
					config.ContainerType = 'Detail';
					break;
				case containerUuids.documentList: // logisticDispatchingDocumentListController
					config = self.getLogisticDispatchingDocumentServiceInfos();
					config.layout = self.getLogisticDispatchingDocumentLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case containerUuids.documentDetails: // logisticDispatchingDocumentDetailController
					config = self.getLogisticDispatchingDocumentServiceInfos();
					config.layout = self.getLogisticDispatchingDocumentLayout();
					config.ContainerType = 'Detail';
					break;
				case '8d60e6fa3fdc41a7aaa6ca81ab8b0fe4': // logisticDispatchingJobMaterialStockSourceWindowController
					config = self.getJobMaterialStockSourceWindowConfig();
					break;
				case '155bda0056214e40b0223f3e569cd71a': // logisticDispatchingJobPlantStockSourceWindowController
					config = self.getJobPlantStockSourceWindowConfig();
					break;
				case 'c581784ef4234a629b1a6b0af272e416': // logisticDispatchingLinkageListController
					config = self.getLogisticDispatchingLinkageServiceInfos();
					config.layout = self.getLogisticDispatchingLinkageLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'c69c924b42d24ad9a82e1c15e6d97f02': // logisticDispatchingLinkageDetailController
					config = self.getLogisticDispatchingLinkageServiceInfos();
					config.layout = self.getLogisticDispatchingLinkageLayout();
					config.ContainerType = 'Detail';
					break;
				case 'b486266f86984782963b773b98fcad29': // logisticDispatchingJobPlantStockSourceWindowController
					config = self.getJobCardSourceWindowConfig();
					break;
				case '310e1b7ca2f94feba6d8732b38c8374d': // platformContainerControllerService
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticDispatchingPlantLocationReceivingServiceInfos(),
						self.getLogisticDispatchingPlantLocationLayout);
					break;
				case 'df910222f1144c129903771f8a9ed8ef': // logisticPlantLocationReceivingDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticDispatchingPlantLocationReceivingServiceInfos(),
						self.getLogisticDispatchingPlantLocationLayout);
					break;
				case '38a19e0b6649476a8484c35bee2b0803': // logisticPlantLocationPerformingListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticDispatchingPlantLocationPerformingServiceInfos(),
						self.getLogisticDispatchingPlantLocationLayout);
					config.listConfig = {
						initCalled: false,
						useFilter: false,
						columns: [],
						type: 'performingJobLocation',
						dragDropService: $injector.get('logisticDispatchingRecordDropService'),
						allowedDragActions: [platformDragdropService.actions.copy]
					};
					break;
				case '80c969bbf91a4dc89c2c3a9ba5645a03': // logisticPlantLocationPerformingDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticDispatchingPlantLocationPerformingServiceInfos(),
						self.getLogisticDispatchingPlantLocationLayout);
					break;
				case containerUuids.header2RequisitionList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getHeaderRequisitionServiceInfos(),
						self.getHeaderRequisitionLayout);
					break;
				case containerUuids.header2RequisitionDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getHeaderRequisitionServiceInfos(),
						self.getHeaderRequisitionLayout);
					break;
				case containerUuids.dispatchNoteSettledList: // logisticDispatchingNoteSettledListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticDispatchingNoteSettledServiceInfos(),
						self.getLogisticDispatchingNoteSettledLayout);
					break;
				case containerUuids.dispatchNoteSettledDetails: // logisticDispatchingNoteSettledDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticDispatchingNoteSettledServiceInfos(),
						self.getLogisticDispatchingNoteSettledLayout);
					break;
				case containerUuids.dispatchRecordLoadingInfoList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getDispatchRecordLoadingInfoServiceInfos(),
						self.getDispatchRecordLoadingInfoLayout);
					break;
				case containerUuids.dispatchRecordLoadingInfoDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getDispatchRecordLoadingInfoServiceInfos(),
						self.getDispatchRecordLoadingInfoLayout);
					break;
				case containerUuids.dispatchNoteTotalWeightList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getNoteTotalWeightServiceInfos(),
						self.getNoteTotalWeightLayout);
					break;
				case containerUuids.dispatchNoteTotalWeightDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getNoteTotalWeightServiceInfos(),
						self.getNoteTotalWeightLayout);
					break;
				case containerUuids.dispatchNoteDeliveryList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticDispatchNoteDeliveryServiceInfos(),
						self.getLogisticDispatchingNoteDeliveryLayout);
					break;
				case containerUuids.dispatchNoteDeliveryDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticDispatchNoteDeliveryServiceInfos(),
						self.getLogisticDispatchingNoteDeliveryLayout);
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;

			}
			return config;
		};

		const hdrNavField = {
			field: 'Code',
			navigator: {
				moduleName: 'logistic.dispatching',
				registerService: 'logisticDispatchingHeaderDataService',
				targetIdProperty: 'Id'
			}
		};


		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getNavigatorFieldByGuid = function getNavigatorFieldByGuid(guid) {
			let navField = null;
			switch(guid) {
				case containerUuids.headerList: navField = hdrNavField; break;
				case containerUuids.headerDetails: navField = hdrNavField; break;
			}

			return navField;
		};

		this.getLogisticDispatchingPlantLocationLayout = function getDispatchingPlantLocationReceivingLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.job.plantallocation',
				['plantfk', 'workoperationtypefk', 'plantstatusfk', 'planttypefk', 'plantkindfk', 'allocatedfrom', 'allocatedto',
					'quantity', 'uomfk', 'projectno', 'projectname', 'jobdescription', 'jobcode',/* 'companyfk', */'plantgroupfk',
					'projectfk', 'jobgroupfk', 'plantisbulk', 'companycode', 'companyname', 'homeprojectfk','projectlocationfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['plantstatusfk', 'planttypefk', 'plantkindfk', 'uomfk', /* 'companyfk', */
				'plantgroupfk', 'projectfk', 'jobgroupfk', 'homeprojectfk', 'projectlocationfk'], self);
			res.overloads.plantfk = resourceCommonLayoutHelperService.provideMassDataPlantLookupOverload();
			res.overloads.workoperationtypefk = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true,null,true, 'logistic-dispatching-record-wot-is-live-article-filter');

			res.addAdditionalColumns = true;
			return res;
		};

		this.getLogisticDispatchingPlantLocationReceivingServiceInfos = function getLogisticJobPlantAllocationServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingPlantLocationReceivingLayoutService',
				dataServiceName: 'logisticDispatchingPlantLocationReceivingDataService',
				validationServiceName: 'logisticJobPlantAllocationValidationService'
			};
		};

		this.getLogisticDispatchingPlantLocationPerformingServiceInfos = function getLogisticJobPlantAllocationServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingPlantLocationPerformingLayoutService',
				dataServiceName: 'logisticDispatchingPlantLocationPerformingDataService'
				// validationServiceName: 'logisticJobPlantAllocationValidationService'
			};
		};

		this.getLogisticDispatchingHeaderServiceInfos = function getLogisticDispatchingHeaderServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingHeaderUIConfigurationService',
				dataServiceName: 'logisticDispatchingHeaderDataService',
				validationServiceName: 'logisticDispatchingHeaderValidationService'
			};
		};

		this.getLogisticDispatchingCreateBackOrderWizardsListLayout = function getLogisticDispatchingCreateBackOrderWizardsListLayout() {
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory(
				'1.0.0',
				'logistic.dispatching.createbackorderwizardslist',
				['materialcode', 'materialdescription', 'quantity', 'difference', 'quantitydelivered']
			);
			res.overloads = {};
			res.overloads.materialcode = {readonly: true};
			res.overloads.materialdescription = {readonly: true};
			res.overloads.quantity = {readonly: true};
			res.overloads.quantitydelivered = {readonly: true};

			return res;
		};

		this.getLogisticDispatchingHeaderLayout = function getLogisticDispatchingHeaderLayout() {
			var res = platformLayoutHelperService.getSixGroupsBaseLayout('1.0.0', 'logistic.dispatching.header',
				['code', 'description', 'comment', 'dispatchheadertypefk', 'job1fk', 'job2fk', 'dispatchstatusfk', 'documentdate',
					'effectivedate', 'startdate', 'enddate', 'rubriccategoryfk', 'pricetotal', 'issuccess', 'externalnumber',
					'exchangerate', 'currencyfk', 'clerkdispatcherfk', 'clerkcurrentfk', 'dispatchactionfk', 'incotermfk', 'clerkrequesterfk', 'clerkreceiverfk', 'loadingcosts'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userDefDateGroup', 'userdefineddate', '0'),
				platformLayoutHelperService.getUserDefinedIntegerGroup(5, 'userDefIntegerGroup', 'userdefinedint', '0'), {
					gid: 'jobInformation',
					attributes: ['deliveryaddresscontactfk', 'deliveryaddressfk', 'performingprojectfk', 'receivingprojectfk', 'performingcompanyfk', 'receivingcompanyfk', 'performingjobgroupfk', 'receivingjobgroupfk']
				}, {
					gid: 'pickingData',
					attributes: ['clerkpickerfk', 'clerkpickerteamleadfk', 'pickingdate', 'loadingdate', 'deliverydate', 'truckplate']
				});
			res.overloads = platformLayoutHelperService.getOverloads(['dispatchheadertypefk', 'job1fk', 'job2fk', 'dispatchstatusfk', 'rubriccategoryfk', 'deliveryaddresscontactfk',
				'deliveryaddressfk', 'performingprojectfk', 'receivingprojectfk', 'performingcompanyfk', 'receivingcompanyfk', 'currencyfk', 'clerkpickerfk', 'clerkpickerteamleadfk',
				'clerkdispatcherfk', 'clerkcurrentfk', 'performingjobgroupfk', 'receivingjobgroupfk', 'dispatchactionfk', 'incotermfk', 'clerkrequesterfk', 'clerkreceiverfk'], self);
			res.addAdditionalColumns = true;
			res.overloads.pricetotal = {readonly: true};
			res.overloads.clerkpickerteamleadfk.readonly = true;
			res.overloads.deliveryaddressfk.readonly = true;

			return res;
		};// getTwoGroupsBaseLayout

		this.getLogisticDispatchingHeaderDefaultSettingsDialogLayout = function getLogisticDispatchingHeaderDefaultSettingsDialogLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory(
				'1.0.0',
				'logistic.dispatching.header',
				['rubriccategoryfk'],
				[]
			);
			res.overloads = platformLayoutHelperService.getOverloads(['rubriccategoryfk'], self);
			return res;
		};

		this.getLogisticDispatchingRecordServiceInfos = function getLogisticDispatchingRecordServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingRecordUIConfigurationService',
				dataServiceName: 'logisticDispatchingRecordDataService',
				validationServiceName: 'logisticDispatchingRecordValidationService'
			};
		};

		this.getLogisticRequisitionItemServiceInfos = function getLogisticRequisitionItemServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingRequisitionItemUiLayoutService',
				dataServiceName: 'logisticDispatchingRequisitionItemDataService',
				validationServiceName: 'logisticDispatchingRequisitionItemValidationService'
			};
		};

		this.getLogisticDispatchingRecordLayout = function getLogisticDispatchingRecordLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.dispatching.record',
				[
					'recordtypefk', 'recordno', 'issettled', 'description', 'dispatchrecordstatusfk', 'articlefk',
					'articledesc', 'workoperationtypefk', 'planttypefk', 'stocktransactiontypefk', 'prjstockfk', 'prjstocklocationfk',
					'stockreceivingfk', 'stocklocationreceivingfk', 'stockreceivingtransactiontypefk', 'pickingorder', 'reservationfk', 'quantity',
					'deliveredquantity', 'acceptedquantity', 'price', 'pricetotal', 'priceoc', 'pricetotaloc', 'uomfk',
					'expectedallocateto', 'commenttext', 'dateeffective', 'prcstructurefk', 'tksemployeefk',
					'receivingprojectlocationfk', 'performingprojectlocationfk', 'requisitionfk',
					'lotreceiving', 'expirationdate', 'expirationdatereceiving', 'precalculatedworkoperationtypefk',
					'priceportionpre01', 'priceportionpre02', 'priceportionpre03',
					'priceportionpre04', 'priceportionpre05', 'priceportionpre06', 'priceportionpreoc01',
					'priceportionpreoc02', 'priceportionpreoc03', 'priceportionpreoc04', 'priceportionpreoc05',
					'priceportionpreoc06', 'pricetotalpreoc', 'pricepreoc', 'pricepre', 'pricetotalpre','projectchangefk', 'projectchangestatusfk',
					'pricinggroupfk','materialconversion'

				],
				{
					gid: 'pricePortions',
					attributes: ['priceportion01', 'priceportion02', 'priceportion03', 'priceportion04', 'priceportion05', 'priceportion06']
				},
				{
					gid: 'pricePortionsOc',
					attributes: ['priceportionoc01', 'priceportionoc02', 'priceportionoc03', 'priceportionoc04', 'priceportionoc05', 'priceportionoc06']
				},
				{
					gid: 'dangerousGoods',
					attributes: ['dangerclassfk', 'packagetypefk', 'dangerquantity', 'uomdangerousgoodfk']
				},
				platformLayoutHelperService.getUserDefinedTextGroup(6, 'userDefTextGroup', 'userdefinedtext', '0'));
			res.overloads = platformLayoutHelperService.getOverloads(['recordno', 'workoperationtypefk', 'stocktransactiontypefk', 'recordtypefk', 'uomfk',
				'reservationfk', 'dispatchrecordstatusfk', 'prcstructurefk', 'articlefk', 'prjstockfk', 'prjstocklocationfk', 'stockreceivingfk',
				'stocklocationreceivingfk', 'stockreceivingtransactiontypefk', 'tksemployeefk', 'dangerclassfk', 'packagetypefk', 'uomdangerousgoodfk',
				'receivingprojectlocationfk', 'performingprojectlocationfk', 'requisitionfk', 'precalculatedworkoperationtypefk', 'planttypefk','projectchangefk', 'projectchangestatusfk', 'pricinggroupfk'], self);
			res.addAdditionalColumns = true;

			res.overloads.workoperationtypefk.grid.bulkSupport = false;
			res.overloads.precalculatedworkoperationtypefk.grid.bulkSupport = false;
			res.overloads.pricetotal = {readonly: true};
			res.overloads.pricetotaloc = {readonly: true};
			res.overloads.issettled = {readonly: true};
			res.overloads.articledesc = {readonly: true};
			res.overloads.materialconversion = {readonly: true};

			return res;
		};

		this.getLogisticDispatchingDocumentServiceInfos = function getLogisticDispatchingDocumentServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingDocumentUIStandardService',
				dataServiceName: 'logisticDispatchingDocumentDataService',
				validationServiceName: 'logisticDispatchingDocumentValidationService'
			};
		};

		this.getLogisticDispatchingDocumentLayout = function getLogisticDispatchingDocumentLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.dispatchdocumentdetailform',
				['description', 'dispatchdocumenttypefk', 'documenttypefk', 'date', 'barcode', 'dispatchrecordfk', 'originfilename']);
			res.overloads = platformLayoutHelperService.getOverloads(['dispatchdocumenttypefk', 'documenttypefk', 'dispatchrecordfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getLogisticDispatchingRecordByMaterialLayout = function getLogisticDispatchingRecordByMaterialLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.recordMaterial',
				['recordno', 'description', 'quantity', 'price', 'uomfk', 'prjstockfk', 'prjstocklocationfk', 'lot',
					'dispatchrecordstatusfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['uomfk', 'prjstockfk', 'prjstocklocationfk', 'dispatchrecordstatusfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getJobMaterialStockSourceWindowConfig = function getJobMaterialStockSourceWindowConfig() {
			var layServ = $injector.get('procurementStockContainerInformationService');
			var config = layServ.getContainerInfoByGuid('18c130e2310242069db7e14c90f7469b');
			var templateInfo = {
				dto: 'StockTotalVDto',
				http: 'procurement/stock/stocktotal',
				endRead: 'list',
				usePostForRead: false,
				overrideDataServicePostForRead: true,
				filterFk: ['stockFk'],
				filter: '?mainItemId=',
				presenter: 'list',
				sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
				isInitialSorted: true,
				sourceDataService: config.dataServiceName
			};
			config.templInfo = templateInfo;
			config.dataServiceName = $injector.get('logisticDispatchingSourceDataServiceFactory').createDataService(templateInfo);
			config.validationServiceName = {};
			config.listConfig.type = 'sourceJobMaterialStock';
			config.listConfig.dragDropService = platformSourceWindowGridDragService;
			config.listConfig.allowedDragActions = [platformDragdropService.actions.copy];

			return config;
		};

		this.getJobPlantStockSourceWindowConfig = function getJobPlantStockSourceWindowConfig() {
			var layServ = $injector.get('logisticJobContainerInformationService');
			var config = _.cloneDeep(layServ.getContainerInfoByGuid('432068179c654b419d3d42d7153d10f8'));
			var templateInfo = {
				dto: 'JobPlantAllocationDto',
				http: 'logistic/job/plantallocation',
				endRead: 'listbyparent',
				usePostForRead: true,
				filterFk: ['jobFk', 'workOperationTypeFk'],
				presenter: 'list',
				sortOptions: {initialSortColumn: {field: 'AllocatedTo', id: 'allocatedto'}, isAsc: true},
				isInitialSorted: false,
				sourceDataService: config.dataServiceName,
				parentService: $injector.get('logisticDispatchingHeaderDataService'),
				onHeaderSelectionChanged: function onHeaderSelectionChanged(data, header) {
					data.selectedObject.jobFk = null;
					data.selectedObject.workOperationTypeFk = null;
					if (!_.isNil(header) && header.Job1Fk > 0) {
						data.selectedObject.jobFk = header.Job1Fk;
					}
					data.clearContent(data);
				}
			};

			config.templInfo = templateInfo;
			config.standardConfigurationService = 'logisticDispatchingSourcePlantAllocationDataService';
			config.dataServiceName = $injector.get('logisticDispatchingSourceDataServiceFactory').createDataService(templateInfo);
			config.validationServiceName = {};
			config.listConfig.type = 'sourceJobPlantStock';
			config.listConfig.dragDropService = platformSourceWindowGridDragService;
			config.listConfig.allowedDragActions = [platformDragdropService.actions.copy];

			return config;
		};

		this.getLogisticDispatchingLinkageServiceInfos = function getLogisticDispatchingLinkageServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingLinkageLayoutService',
				dataServiceName: 'logisticDispatchingLinkageDataService',
				validationServiceName: 'logisticDispatchingLinkageValidationService'
			};
		};

		this.getLogisticDispatchingLinkageLayout = function getLogisticDispatchingLinkageLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.dispatchlinkagedetailform',
				['commenttext', 'linkagetypefk', 'linkagereasonfk', 'dispatchheaderlinkfk', 'productionheaderfk',
					'mountingactivityfk', 'transportroutefk', 'settlementfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['linkagetypefk', 'linkagereasonfk', 'dispatchheaderlinkfk', 'productionheaderfk',
				'mountingactivityfk', 'transportroutefk', 'settlementfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getJobCardSourceWindowConfig = function getJobCardSourceWindowConfig() {
			var layServ = $injector.get('logisticCardContainerInformationService');
			var config = layServ.getContainerInfoByGuid('05fd352d74ef4f5aa179d259e056c367');
			var templateInfo = {
				dto: 'JobCardDto',
				http: 'logistic/card/card',
				endRead: 'listbyperformingjob',
				filterFk: ['jobFk'],
				usePostForRead: false,
				presenter: 'list',
				sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
				isInitialSorted: true,
				sourceDataService: config.dataServiceName
			};
			config.templInfo = templateInfo;
			config.dataServiceName = $injector.get('logisticDispatchingSourceDataServiceFactory').createDataService(templateInfo);
			config.validationServiceName = {};
			config.listConfig.type = 'sourceJobCard';
			config.listConfig.dragDropService = platformSourceWindowGridDragService;
			config.listConfig.allowedDragActions = [platformDragdropService.actions.copy];

			return config;
		};

		this.getHeaderRequisitionServiceInfos = function getHeaderRequisitionServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingHeaderRequisitionLayoutService',
				dataServiceName: 'logisticDispatchingHeaderRequisitionDataService',
				validationServiceName: 'logisticDispatchingHeaderRequisitionValidationService'
			};
		};

		this.getHeaderRequisitionLayout = function getHeaderRequisitionLayout() {
			var res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.dispatching.header.requisition',
				['resourcerequisitionfk', 'requisitionstatusfk', 'requisitiontypefk', 'commenttext'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefinedtext', '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['resourcerequisitionfk', 'requisitionstatusfk', 'requisitiontypefk'], self);
			return res;
		};

		this.getLogisticDispatchingNoteSettledServiceInfos = function getLogisticDispatchingNoteSettledServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingNoteSettledLayoutService',
				dataServiceName: 'logisticDispatchingNoteSettledDataService',
				validationServiceName: 'logisticDispatchingNoteSettledValidationService'
			};
		};

		this.getLogisticDispatchingNoteSettledLayout = function getLogisticDispatchingNoteSettledLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.headernotesettled',
				['settlementno', 'settlementdate', 'statusdescriptioninfo']);
			res.overloads = {};
			res.addAdditionalColumns = true;
			res.overloads.settlementno = { readonly: true };
			res.overloads.settlementdate = { readonly: true };
			res.overloads.statusdescriptioninfo = { readonly: true };
			return res;
		};

		this.getDispatchRecordLoadingInfoServiceInfos = function getDispatchRecordLoadingInfoServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingRecordLoadingInfoLayoutService',
				dataServiceName: 'logisticDispatchingRecordLoadingInfoDataService',
				validationServiceName: 'logisticDispatchingRecordLoadingInfoValidationService'
			};
		};

		this.getDispatchRecordLoadingInfoLayout = function getDispatchRecordLoadingInfoLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.recordloadinginfo',
				['headercode','headerdescription','dispatchstatusfk','dateeffective','recordtypefk','articlecode','articledescription',
					'materialcatalogfk','quantity','uomrecordfk','uomweightfk','transportweight','totalweight','uomvolumefk','transportvolume']);
			res.overloads = platformLayoutHelperService.getOverloads(['dispatchstatusfk','recordtypefk','materialcatalogfk','uomrecordfk','uomweightfk','uomvolumefk'], self);

			return res;
		};

		this.getNoteTotalWeightServiceInfos = function getNoteTotalWeightServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingNoteTotalWeightLayoutService',
				dataServiceName: 'logisticDispatchingNoteTotalWeightDataService',
				validationServiceName: 'logisticDispatchingNoteTotalWeightValidationService'
			};
		};

		this.getNoteTotalWeightLayout = function getNoteTotalWeightLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.notetotalweight',
				['code', 'description', 'dateeffective', 'dispatchstatusfk','totalweight','uomweightfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['uomweightfk','dispatchstatusfk'], self);

			return res;
		};

		this.getLogisticDispatchNoteDeliveryServiceInfos = function getLogisticDispatchNoteDeliveryServiceInfos() {
			return {
				standardConfigurationService: 'logisticDispatchingNoteDeliveryLayoutService',
				dataServiceName: 'logisticDispatchingNoteDeliveryDataService',
				validationServiceName: 'logisticDispatchingNoteDeliveryValidationService'
			};
		};

		this.getLogisticDispatchingNoteDeliveryLayout = function getLogisticDispatchingNoteDeliveryLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.dispatching.notedelivery',
				['transportstart', 'transportend', 'commenttext']);
			res.overloads = {};
			return res;
		};


		this.getMaterialOverload = function getMaterialOverload() {
			return {
				navigator: {
					moduleName: 'basics.material'
				},
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'Code'
					},
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true,
							additionalColumns: true,
							addGridColumns: [{
								id: 'Description',
								field: 'DescriptionInfo.Translated',
								width: 150,
								name: 'Description',
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}]
						},
						directive: 'basics-material-material-lookup'
					},
					width: 100
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupOptions: {
							showClearButton: true
						},
						lookupDirective: 'basics-material-material-lookup',
						displayMember: 'Code',
						descriptionMember: 'DescriptionInfo.Translated'
					}
				}
			};
		};

		function getChangeLookupOverload() {
			let lookupOptions = {
				additionalColumns: true,
				showClearButton: true,
				filterKey: 'project-change-lookup-for-logistic-records-filter',
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
				}
			};
		}

		function assertArticleLookupConfig() {
			if(articleLookupConfig === null) {
				const constService = $injector.get('logisticDispatchingConstantValues');
				articleLookupConfig = {};

				let configObj = basicsLookupdataConfigGenerator.getDataServiceDefaultSpec({
					dataServiceName: 'resourceTypeSmallToolsLookupDataService'
				});

				articleLookupConfig[constService.record.type.resource] = {
					column: 'ResourceFk',
					lookup: {
						directive: 'resource-master-resource-lookup-dialog-new',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							displayMember: 'Code'
						}
					}
				};
				articleLookupConfig[constService.record.type.plant] = {
					column: 'PlantFk',
					lookup: {
						directive: 'resource-equipment-plant-lookup-dialog-new',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							displayMember: 'Code',
							version: 3,
							lookupType: 'equipmentPlant',
							showFilteredData: true,
							filterKey: 'logistic-dispatching-record-plant-cache-tool-filter',
							additionalFilters: [
								{
									'hasCacheTool': 'hasCacheTool',
									hasCacheToolVisible: true,
									getAdditionalEntity: function (entity) {
										return { hasCacheTool: !!entity?.CacheToolFk };
									}
								},
								{
									'groupFk': 'groupFk',
									groupFkReadOnly: true,
									getAdditionalEntity: function (entity) {
										return { groupFk: entity?.CacheToolFk };
									}
								}
							],
							filterOnLoadFn: function (item) {
								var itemList = $injector.get('logisticDispatchingRecordDataService').getList();
								return !_.some(itemList, function (entity) {
									return entity.RecordTypeFk === plantRecordTypeId && entity.ArticleFk === item.Id && (entity.WorkOperationIsHire || entity.IsBulkPlant);
								});
							}
						}
					}
				};
				articleLookupConfig[constService.record.type.material] = {
					column: 'MaterialFk',
					lookup: {
						directive: 'basics-material-material-lookup',
						options: {
							showClearButton: true,
							displayMember: 'Code',
							filterKey: 'logistic-dispatching-record-material-filter',
							gridOptions: {
								disableCreateSimilarBtn: true,
								multiSelect: false
							}
						}
					}
				};
				articleLookupConfig[constService.record.type.sundryService] = {
					column: 'SundryServiceFk',
					lookup: {
						directive: 'logistic-sundry-service-lookup-dialog',
						options: {
							showClearButton: true,
							displayMember: 'Code'
						}
					}
				};
				articleLookupConfig[constService.record.type.costCode] = {
					column: 'MdcCostCodeFk',
					lookup: {
						directive: 'basics-cost-codes-lookup',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							displayMember: 'Code'
						}
					}
				};
				articleLookupConfig[constService.record.type.fabricatedProduct] = {
					column: 'ProductFk',
					lookup: {
						directive: 'productionplanning-common-product-lookup',
						options: {
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							displayMember: 'Code'
						}
					}
				};
				articleLookupConfig[constService.record.type.loadingCost] = {
					column: 'SundryServiceLoadFk',
					lookup: {
						directive: 'logistic-sundry-service-lookup-dialog',
						options: {
							showClearButton: false,
							displayMember: 'Code'
						}
					}
				};
				articleLookupConfig[constService.record.type.loadingCostForBilling] = {
					column: 'SundryServiceLoadBillingFk',
					lookup: {
						directive: 'logistic-sundry-service-lookup-dialog',
						options: {
							showClearButton: false,
							displayMember: 'Code'
						}
					}
				};
				articleLookupConfig[constService.record.type.smallTool] = {
					column: 'ResourceTypeToolFk',
					lookup: {
						directive: 'basics-lookup-data-by-custom-data-service',
						options: {
							idProperty: 'Id',
							dataServiceName: 'resourceTypeSmallToolsLookupDataService',
							descriptionMember: configObj.dispMember,
							valueMember: configObj.valMember,
							displayMember: configObj.dispMember,
							showClearButton: true,
							columns: configObj.columns,
							uuid: configObj.uuid,
							treeOptions: {
								'parentProp': 'ResourceTypeFk', 'childProp': 'SubResources'
							},
						}
					}
				};
			}

			return articleLookupConfig;
		}

		this.getArticleOverload = function getArticleOverload() {
			let lookupInfo = assertArticleLookupConfig();

			return {
				detail: {
					type: 'directive',
					directive: 'dynamic-grid-and-form-lookup',
					options: {
						isTextEditable: false,
						dependantField: 'RecordTypeFk',
						lookupInfo: lookupInfo,
						grid: false,
						dynamicLookupMode: true,
						dynamicDisplayMember: 'ArticleCode',
						showClearButton: true,
					}
				},
				grid: {
					editor: 'directive',
					editorOptions: {
						directive: 'dynamic-grid-and-form-lookup',
						dependantField: 'RecordTypeFk',
						lookupInfo: lookupInfo,
						isTextEditable: false,
						dynamicLookupMode: true,
						dynamicDisplayMember: 'ArticleCode',
						grid: true,
					},
					formatter: 'code',
					formatterOptions: {
						field: 'ArticleCode',
						filterKey: 'logistic-dispatching-record-article-unique-plant-article-filter'
					}
				}
			};
		};

		function providePoolJobLookupOverload(jobPrefix, descPostfix) {
			const defFilter = {
				activeJob: true,
				showOnlyJobsForTheCurrentDivision: true,
				supportsPoolJob: function (entity) {
					let sel = logisticDispatchingHeaderDataService.getSelected();
					entity.supportsPoolJob = sel && sel.supportsPoolJob;
					return true;
				}
			};
			return {
				navigator: {
					moduleName: 'logistic.job'
				},
				grid:
				{
					additionalColumnPrefix: jobPrefix,
					editor: 'lookup',
					editorOptions:
					{
						directive: 'logistic-pool-job-paging-lookup',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							defaultFilter: defFilter,
							additionalFilters: [
								{
									'supportsPoolJob': 'supportsPoolJob',
									getAdditionalEntity: function () {
										let sel = logisticDispatchingHeaderDataService.getSelected();
										return {
											supportsPoolJob: sel && sel.supportsPoolJob,
										};
									}
								},
								{
									'activeJob': 'activeJob',
									getAdditionalEntity: function () {
										return { activeJob: true };
									}
								}
							],
							addGridColumns: [{
								id: 'description',
								additionalColumnPostfix: descPostfix,
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
						lookupType: 'logisticJob',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'logistic-pool-job-paging-lookup',
						displayMember: 'Code',
						descriptionMember: 'Description',
						lookupOptions: {
							defaultFilter: defFilter,
							showClearButton: true
						}
					}
				}
			};
		}





		/* jshint -W074 */ // For me there is no cyclomatic complexity
		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'uomrecordfk':
					ovl = {
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					};
					break;
				case 'uomweightfk':
					ovl = {
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					};
					break;
				case 'uomvolumefk':
					ovl = {
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					};
					break;
				case 'materialfk':
					ovl = self.getMaterialOverload();
					break;
				case 'articlefk':
					ovl = self.getArticleOverload();
					break;
				case 'projectchangefk':
					ovl = getChangeLookupOverload();
					break;
				case 'projectchangestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
						showIcon: true,
						field: 'RubricCategoryFk',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'});
					break;
				case 'dangerclassfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dangerclass');
					break;
				case 'dispatchactionfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dispatchaction');
					break;
				case 'dispatchheadertypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticsdispatcherheadertype');
					break;
				case 'dispatchstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.dispatchstatus', null, {
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						field: 'RubricCategoryFk',
						showIcon: true
					});
					break;
				case 'dispatchrecordfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticDispatchingRecordLookupDataService'
					});
					break;
				case 'dispatchdocumenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dispatchheaderdocumenttype');
					break;
				case 'linkagetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.dispheaderlinktype');
					break;
				case 'linkagereasonfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.dispheaderlinkreason', null, {
						showIcon: true,
						imageSelectorService: 'basicsCustomizeDispatchHeaderControlIconService'
					});
					break;
				case 'packagetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.packagingtypes');
					break;
				case 'recordtypefk':
					ovl = {
						grid: {
							editor: 'directive',
							editorOptions: {
								directive: 'logistic-dispatching-record-type-lookup',
								lookupOptions: {
									additionalColumns: true,
									displayMember: 'ShortKeyInfo.Translated',
									addGridColumns: [
										{
											id: 'brief',
											field: 'DescriptionInfo',
											name: 'Description',
											width: 120,
											formatter: 'translation',
											name$tr$: 'cloud.common.entityDescription'
										}
									]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'recordtype',
								displayMember: 'ShortKeyInfo.Translated',
								dataServiceName: 'logisticDispatchingRecordTypeLookupDataService'
							}
						},
						detail: {
							type: 'directive',
							directive: 'logistic-dispatching-record-type-lookup',
							options: {
								lookupDirective: 'logistic-dispatching-record-type-lookup',
								descriptionField: 'ShortKeyInfo',
								descriptionMember: 'ShortKeyInfo.Translated',
								filterKey: 'logistic-dispatching-record-type-filter',
								lookupOptions: {
									initValueField: 'ShortKeyInfo'
								}
							}
						}
					};
					break;
				case 'descriptioninfo':
					ovl = {
						readonly: true
					};
					break;
				case 'dispatchheaderlinkfk':
					ovl = logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderLinkFk', false);
					break;
				case 'dispatchrecordstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.dispatchrecordstatus', null, {showIcon: true});
					break;
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;
				case 'job1fk':
					ovl = providePoolJobLookupOverload('logistic.dispatching.performingJob', 'Desc');
					break;
				case 'job2fk':
					ovl = providePoolJobLookupOverload('logistic.dispatching.receivingJob', 'Desc');
					break;
				case 'deliveryaddresscontactfk':
					ovl = platformLayoutHelperService.provideBusinessPartnerFilteredContactLookupDlgOverload(
						'logistic-job-business-partner-contact-filter'
					);
					break;
				case 'deliveryaddressfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-common-address-dialog',
							model: 'DeliveryAddress',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'DeliveryAddressFk'
							},
							readonly: true
						},
						grid: {
							editor: 'lookup',
							field: 'DeliveryAddress',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								'lookupOptions': {
									foreignKey: 'DeliveryAddressFk',
									titleField: 'cloud.common.entityAddress'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Address'
							}
						}
					};
					break;
				case 'performingprojectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload(null, 'PerformingProjectFk');
					break;
				case 'receivingprojectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload(null, 'ReceivingProjectFk');
					break;
				case 'performingcompanyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'receivingcompanyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				// case 'recordtypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticrecordtype'); break;
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'logistic-dispatching-rubric-category-lookup-filter',
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
									filterKey: 'logistic-dispatching-rubric-category-lookup-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'stocktransactiontypefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'procurementStockTransactionTypesService',
					filterKey: 'TransactionTypeIsDispatchingFilter'});
					break;
				case 'stockreceivingtransactiontypefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'procurementStockTransactionTypesService',
					filterKey: 'TransactionTypeIsDispatchingFilter'});
					break;
				case 'pricinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticPricingGroupLookupDataService',
						filter: function () {
							let selectedHeader = logisticDispatchingHeaderDataService.getSelected();
							if (selectedHeader) {
								return selectedHeader.PriceConditionFk;
							}
							return 0;
						}
					});
					break;
				case 'uomfk':
					ovl = {
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					};
					break;

				case 'workoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true, 'PlantFk', 'logistic-dispatching-record-wot-is-live-article-filter');
					break;

				case 'precalculatedworkoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true, 'PlantFk', 'logistic-dispatching-record-wot-is-live-article-filter');
					break;
				case 'prjstockfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						filter: function () {
							return {PKey1: getPerformingProject(), PKey2: null, PKey3: null};
						}
					});
					break;
				case 'prjstocklocationfk':
					ovl = platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						projectFk: 'ProjectFk',
						projectFkReadOnly: true,
						getAdditionalEntity: function () {
							let prj = getPerformingProject();
							let item = {
								'ProjectFk': prj ? prj : null
							};
							return item;
						}
					}, {
						projectStockFk: 'PrjStockFk',
						projectStockFkReadOnly: false,
						getAdditionalEntity: function (item) {
							return item;
						}
					}]);
					break;
				case 'stockreceivingfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						filter: function () {
							return {PKey1: getReceivingProject(), PKey2: null, PKey3: null};
						}
					});
					break;
				case 'stocklocationreceivingfk':
					ovl = platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						'projectFk': 'ProjectFk',
						projectFkReadOnly: true,
						getAdditionalEntity: function () {
							let prj = getReceivingProject();
							let item = {
								'ProjectFk': prj ? prj : null
							};
							return item;
						}
					}, {
						'projectStockFk': 'StockReceivingFk',
						projectStockFkReadOnly: false,
						getAdditionalEntity: function (item) {
							return item;
						}
					}]);

					break;
				case 'reservationfk':
					ovl = logisticCommonLayoutOverloadService.getResourceReservationLookupOverload('ReservationFk', false, false);
					break;
				case 'prcstructurefk':
					ovl = {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurementstructure-structure-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
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
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'sundryservicefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServiceLookupDataService'
					});
					break;
				case 'mdccostcodefk':
					ovl = {
						'detail': {
							'type': 'directive',
							'directive': 'basics-cost-codes-lookup',
							'options': {
								showClearButton: true
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
								lookupOptions: {showClearButton: true},
								directive: 'basics-cost-codes-lookup'
							}
						}
					};
					break;
				case 'controllingunitfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'controllingStructureUnitLookupDataService',
						filter: function (item) {
							var prj;
							if (item) {
								prj = getReceivingProject();
							}
							return prj;
						}
					});
					break;
				case 'productionheaderfk':
					ovl = {
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'productionplanning-Common-Header-Lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CommonHeader',
								displayMember: 'Code'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-Common-Header-Lookup',
								descriptionMember: 'Code'
							}
						}
					};
					break;
				case 'mountingactivityfk':
					ovl = {
						navigator: {
							moduleName: 'productionplanning.activity'
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'productionplanning-mounting-activity-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MntActivity',
								displayMember: 'Code',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-mounting-activity-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}
					};
					break;
				case 'transportroutefk':
					ovl = {
						navigator: {
							moduleName: 'transportplanning.transport'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'transportplanning-transport-route-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TrsRoute',
								displayMember: 'Code',
								version: 3// for new lookup master api, the value of version should be greater than 2
							}
							// width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'transportplanning-transport-route-lookup',
								descriptionMember: 'DescriptionInfo.Description'
							}
						}
					};
					break;
				case 'settlementfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSettlementLookupByCompanyService',
						filter: function (item) {
							return item.CompanyFk;
						}
					});
					break;
				case 'tksemployeefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeLookupDataService'
					});
					break;
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true
					});
					break;
				case 'clerkpickerfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'clerkpickerteamleadfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'clerkdispatcherfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'clerkcurrentfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'plantstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantstatus');
					break;
				case 'plantkindfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantkind');
					break;
				case 'planttypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.planttype');
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'plantgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceEquipmentGroupLookupDataService',
						cacheEnable: true
					});
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload(null, 'ProjectFk');
					break;
				case 'homeprojectfk':
					ovl = platformLayoutHelperService.provideProjectLookupReadOnlyOverload();
					break;
				case 'projectlocationfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'projectLocationLookupDataService',readonly: true,
						filter: function (item) {
							return item.HomeProjectFk;
						}
					});
					break;
				case 'performingjobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup');
					break;
				case 'receivingjobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup');
					break;
				case 'uomdangerousgoodfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'receivingprojectlocationfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'projectLocationLookupDataService',
					filter: function (item) {
						let prj;
						if (item) {
							let header = logisticDispatchingHeaderDataService.getItemById(item.DispatchHeaderFk);
							if (header) {
								prj = header.ReceivingProjectFk;
							}
						}
						return prj;
					}
				}); break;
				case 'performingprojectlocationfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'projectLocationLookupDataService',
					filter: function (item) {
						let prj;
						if (item) {
							let header = logisticDispatchingHeaderDataService.getItemById(item.DispatchHeaderFk);
							if (header) {
								prj = header.PerformingProjectFk;
							}
						}
						return prj;
					}
				}); break;
				case 'incotermfk':
					ovl = {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-incoterm-combobox',
							'options': {
								showClearButton: false
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: false},
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
				case 'requisitionfk':
					ovl = {
						navigator: {
							moduleName: 'resource.requisition'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									lookupType: 'resourceRequisition',
									showClearButton: true,
									defaultFilter: {resourceFk: 'ResourceFk'}
								},
								directive: 'resource-requisition-lookup-dialog-new'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'resourceRequisition',
								version: 3,
								displayMember: 'Description'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'resource-requisition-lookup-dialog-new',
								descriptionMember: 'Description',
								displayMember: 'Code',
								showClearButton: true,
								lookupOptions: {
									defaultFilter: {resourceFk: 'ResourceFk'}
								}
							}
						}
					};
					break;
				case 'requisitionstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resrequisitionstatus', null, { showIcon: true });
					break;
				case 'requisitiontypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.resrequisitiontype', null, { showIcon: true });
					break;
				case 'dispatchheaderfk':
					ovl = logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderFk', true);
					break;
				case 'resourcerequisitionfk':
					ovl = {
						navigator: {
							moduleName: 'resource.requisition'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									lookupType: 'resourceRequisition',
									showClearButton: true
								},
								directive: 'resource-requisition-lookup-dialog-new'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'resourceRequisition',
								version: 3,
								displayMember: 'Description'
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'resource-requisition-lookup-dialog-new',
								descriptionMember: 'Description',
								displayMember: 'Code',
								showClearButton: true
							}
						}
					};
					break;
				case 'clerkrequesterfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
				case 'clerkreceiverfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
			}
			return ovl;
		};

		function getPerformingProject() {
			var parentService = $injector.get('logisticDispatchingHeaderDataService');
			var header = parentService.getSelected();
			if (!header || _.isNil(header.PerformingProjectFk)) {
				return 0;
			}

			return header.PerformingProjectFk;
		}

		function getReceivingProject() {
			var parentService = $injector.get('logisticDispatchingHeaderDataService');
			var header = parentService.getSelected();
			if (!header || _.isNil(header.ReceivingProjectFk)) {
				return 0;
			}

			return header.ReceivingProjectFk;
		}

		var filters = [
			{
				key: 'logistic-dispatching-rubric-category-by-rubric-filter',
				fn: function filterCategoryByRubric(item) {
					return item.RubricFk === 34;
				}
			},
			{
				key: 'logistic-dispatching-job-settledby-filter',
				fn: function filterjobbysettledby(item) {
					return item.SettledByTypeFk !== logisticSettlementConstantValues.settledbytypes.None;
				}
			},
			{
				key: 'logistic-dispatching-record-wot-is-live-article-filter',
				fn: function (item) {
					return item.IsLive;
				}
			},
			{
				key: 'logistic-dispatching-record-article-unique-plant-article-filter',
				fn: function (item, relItem) {
					if (relItem.RecordTypeFk === plantRecordTypeId) {
						var itemList = $injector.get('logisticDispatchingRecordDataService').getList();
						return !_.some(itemList, function (entity) {
							return entity.RecordTypeFk === plantRecordTypeId && entity.ArticleFk === item.Id && (entity.WorkOperationIsHire || entity.IsBulkPlant);
						});
					} else {
						return true;
					}
				}
			},
			{
				key: 'logistic-dispatching-record-plant-cache-tool-filter',
				serverSide: true,
				serverKey: 'equipment-plant-filter',
				fn: function (item) {
					let plantFilterDataServ = $injector.get('resourceEquipmentFilterLookupDataService');
					const filterParams = plantFilterDataServ.getFilterParams(item);
					filterParams.resTypeFk = item?.CacheToolFk;
					filterParams.excludePltGrp = !!item?.CacheToolFk;
					return filterParams;
				}
			},
			{
				key: 'logistic-dispatching-record-material-filter',
				serverSide: true,
				fn: function (entity, searchOptions) {
					if (entity) {
						searchOptions.MaterialTypeFilter = {
							IsForLogistics: true,
						};
					}
				}
			},
			{
				key: 'logistic-dispatching-rubric-category-lookup-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function () {
					return { Rubric: 34 };//34 is rubric for dispatching.
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);
	}
})(angular);
