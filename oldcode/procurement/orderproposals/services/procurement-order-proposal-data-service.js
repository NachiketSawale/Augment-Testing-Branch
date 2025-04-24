(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'procurement.orderproposals';
	// jshint -W072
	angular.module(moduleName).factory('procurementOrderProposalsDataService',
		['$injector', 'platformDataServiceFactory', 'cloudDesktopSidebarService', 'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService','platformContextService',
			function procurementOrderProposalsDataService($injector, dataServiceFactory, cloudDesktopSidebarService, basicsLookupdataLookupFilterService,
				basicsLookupdataLookupDescriptorService, moduleContext, platformContextService) {
				// eslint-disable-next-line no-unused-vars
				var selectItem, service = {}, serviceContainer, isUpdate = false, createParam;
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					showOptions: true,
					showProjectContext: false,
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false,
					includeDateSearch:true,
					enhancedSearchVersion: '2.0'
				};

				var onReadSucceeded = function onReadSucceeded(readData, data) {
					angular.forEach(readData.Main, function (item) {
						if(item && item.PrcConfigurationReqFk === 0){
							item.PrcConfigurationReqFk = null;
						}
					});
					basicsLookupdataLookupDescriptorService.attachData(readData);
					var result = {
						FilterResult: readData.FilterResult,
						dtos: readData.Main || []
					};
					return serviceContainer.data.handleReadSucceeded(result, data);
				};

				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementOrderProposalsDataService',
						httpCreate: {route: globals.webApiBaseUrl + 'procurement/orderproposals/header/',endCreate: 'createorderproposal'},
						httpRead: { route: globals.webApiBaseUrl + 'procurement/orderproposals/header/',endRead: 'getlist', usePostForRead: true },
						httpDelete: { route: globals.webApiBaseUrl + 'procurement/orderproposals/header/', endDelete: 'deleteorderproposal' },
						httpUpdate: {route: globals.webApiBaseUrl + 'procurement/orderproposals/header/',endUpdate: 'updatedto'},
						actions: { delete: {}, create: 'flat' },
						presenter: {
							list: {
								incorporateDataRead: onReadSucceeded,
								initCreationData: function initCreationData(creationData) {
									creationData.PrjStock2MdcMaterialFk = createParam.Stock2matId;
									createParam = {};
								}
							}
						},
						entityRole: {
							root: {
								useIdentification: true,
								itemName: 'OrderProposals',
								moduleName: 'cloud.desktop.moduleDisplayNameOrderProposals',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								responseDataEntitiesPropertyName: 'Main',
								handleUpdateDone: function (updateData, response, data) {
									data.handleOnUpdateSucceeded(updateData, response, data, true);
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},
						entitySelection: {supportsMultiSelection: true}
					}
				};
				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				service.IsUpdate = function IsUpdate() {
					isUpdate = true;
				};
				service.loadData = function loadData() {
					selectItem = service.getSelected();
					service.load();
				};

				var getProjectFk = function getProjectFk(useCurrentFirst, currentItem) {
					return useCurrentFirst && currentItem ? currentItem.ProjectFk : platformContextService.getApplicationValue(cloudDesktopSidebarService.appContextProjectContextKey);
				};

				var filters = [
					{
						key: 'prc-order-req-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.requisitionRubricFk;
						}
					},
					{
						key: 'prc-order-con-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.contractRubricFk;
						}
					},
					{
						key: 'prc-order-con-package-filter-for-order-proposal',
						serverSide: true,
						serverKey: 'prc-invoice-package-filter',
						fn: function (currentItem) {
							if (!currentItem) {
								return null;
							}
							return {
								ProjectFk: getProjectFk(true, currentItem)
							};
						}
					},
					{
						key: 'order-businesspartner-main-evaluation-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
							};
						}
					},
					{
						key: 'prc-order-subcontactor-supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						fn: function (dataItem) {
							return {
								BusinessPartnerFk: dataItem !== null ? dataItem.BusinessPartnerFk : null,
								SubsidiaryFk: dataItem !== null ? dataItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'prc-order-req-contact-filter',
						serverSide: true,
						serverKey: 'prc-req-contact-filter',
						fn: function (item) {
							if(item && item.BusinessPartnerFk > 0) {
								return {
									BusinessPartnerFk: item.BusinessPartnerFk
								};
							}
							else{
								return {};
							}
						}
					},
					{
						key: 'prc-order-invoice-header-project-filter',
						serverSide: true,
						fn: function () {
							return {
								IsLive: true,
								CompanyFk: moduleContext.loginCompany
							};
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				createParam = {};
				var baseCreateItem = service.createItem;
				service.createItem = function createItem(){
					$injector.get('platformModalService').showDialog({
						width: '606px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'procurement.orderproposals/partials/prc-order-proposal-create-list-dialog.html'
					}).then(function (result) {
						if (result) {
							createParam = result;
							baseCreateItem();
						}
					});
				};

				// user for reloading items after required  clearprojectstock wizard runed.
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;


				return service;
			}]);

})(angular);