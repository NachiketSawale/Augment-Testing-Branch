

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('qto.main');

	myModule.factory('qtoMainBillToDataService',['_','$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'qtoMainHeaderDataService','projectMainBillToReadOnlyProcessor','qtoMainBoqFilterService','qtoMainDetailService','platformDataServiceDataProcessorExtension','qtoMainHeaderDataService',
	function (_,$injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, parentService, projectMainBillToReadOnlyProcessor,qtoMainBoqFilterService,qtoMainDetailService,dataServiceDataProcessor,qtoMainHeaderDataService) {
		let self = this;
		let billToServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'qtoMainBillToDataService',
				entityNameTranslationID: 'qto.main.billToEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/billto/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = parentService.getSelected();
						readData.PKey1 = selected.ProjectFk;
					}
				},
				actions: {},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					{typeName: 'ProjectBillToDto', moduleSubModule: 'Project.Main'}), projectMainBillToReadOnlyProcessor],
				presenter: {
					list: {
					}
				},
				toolBar: {
					id: 'filterBillTos',
					costgroupName: 'BillToFk',
					iconClass: 'tlb-icons ico-filter-boq'
				},
				entityRole: {
					leaf: {itemName: 'BillTos', parentService: parentService}
				},
				entitySelection: {supportsMultiSelection: true}
			}
		};
		let service = {};

		let serviceContainer = platformDataServiceFactory.createService(billToServiceOption, self);
		serviceContainer.data.Initialised = true;
		service = serviceContainer.service;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			validationService: 'qtoMainBillToValidationService',
			typeName: 'ProjectBillToDto',
			moduleSubModule: 'Project.Main'
		});

		qtoMainBoqFilterService.addMarkersChanged(service, billToServiceOption.flatLeafItem.presenter.list,billToServiceOption.flatLeafItem.toolBar,'setFilterBillTos');

		service.filterBillTos = function filterBillTos(options, entity){
			serviceContainer.data.disableWatchSelected(serviceContainer.data);
			entity.isFilter = !entity.isFilter;
			let items = service.getList();

			dataServiceDataProcessor.doProcessItem(entity, serviceContainer.data);

			service.gridRefresh();
			serviceContainer.data.enableWatchSelected(entity, serviceContainer.data);

			let filterKeys = _.filter(items, {isFilter: true}).map(function (item) {
				return item.Id;
			});
			// set filter keys and call update.
			qtoMainDetailService.setFilterBillTos(filterKeys);
			let promise = qtoMainHeaderDataService.update();
			if (promise) {
				promise.then(function () {
					qtoMainDetailService.load();// reload items in qto detail
				});
			} else {
				qtoMainDetailService.load();// reload items in qto detail
			}
		};

		service.assignContractByBillTo = function (qtoLine){
         let ordHeaderFk = null;
			let selectQtoHeader = qtoMainHeaderDataService.getSelected ();
			let projectFk = selectQtoHeader.ProjectFk;
			let filter = '(CompanyFk=' + $injector.get ('platformContextService').getContext ().clientId + ') and (ProjectFk=' + projectFk + ')';

			return $injector.get ('qtoHeaderSalesContractLookupDialogService').getSearchList (filter, 'code', qtoLine).then (function (data) {
				if(data && data.length){
					ordHeaderFk = data[0].Id;
				}
				return ordHeaderFk;
			});
		};

		return service;
	}]);
})(angular);
