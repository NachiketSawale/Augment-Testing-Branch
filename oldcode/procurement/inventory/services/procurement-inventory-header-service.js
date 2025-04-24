/**
 * Created by pel on 7/2/2019.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.inventory';

	/**
     * @ngdoc service
     * @name procurementInventoryHeaderDataService
     * @function
     * @requireds procurementInventoryHeaderDataService
     *
     * @description Provide inventory header data service
     */

	angular.module(moduleName).factory('procurementInventoryHeaderDataService',
		['$translate','platformDataServiceFactory','$injector', 'platformContextService', 'PlatformMessenger', 'basicsLookupdataLookupDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupOptionService',
			'platformModalService', 'basicsCommonMandatoryProcessor', 'cloudDesktopSidebarService','cloudDesktopInfoService',
			'ServiceDataProcessDatesExtension','basicsLookupdataLookupDescriptorService','inventoryHeaderReadonlyProcessor','basicsLookupdataLookupFilterService',
			'$q','cloudDesktopPinningContextService',
			function ($translate,dataServiceFactory,$injector, platformContextService, PlatformMessenger, lookupDataService,
				lookupDescriptorService, moduleContext, platformDataServiceProcessDatesBySchemeExtension, lookupOptionService,
				platformModalService, basicsCommonMandatoryProcessor, cloudDesktopSidebarService,cloudDesktopInfoService,ServiceDataProcessDatesExtension,
				basicsLookupdataLookupDescriptorService,inventoryHeaderReadonlyProcessor,basicsLookupdataLookupFilterService,$q,
				cloudDesktopPinningContextService
			) {

				var service = {},serviceContainer = null;
				var onReadSucceeded;
				// set filter parameter for this module
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					pinningOptions: {
						isActive: true,
						showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: setCurrentPinningContext
					},
					withExecutionHints: false,
					includeDateSearch:true,
					enhancedSearchVersion: '2.0'
				};


				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementInventoryHeaderDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/inventory/header/',
							usePostForRead: true
						},
						// actions: {
						//     actions: { delete: true, create: true, bulk: false }
						//     // canDeleteCallBackFunc: function () {
						//     //     return !moduleContext.isReadOnly;
						//     // }
						// },
						dataProcessor: [
							inventoryHeaderReadonlyProcessor,
							new ServiceDataProcessDatesExtension(['InventoryDate', 'TransactionDate'])
						],
						entityRole: {
							root: {
								useIdentification: true,
								itemName: 'InventoryHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameInventory',
								addToLastObject: true,
								lastObjectModuleName: moduleName
							}
						},
						presenter: {
							list: {
								incorporateDataRead: onReadSucceeded
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						entitySelection: {}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				service = serviceContainer.service;

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'PrcInventoryHeaderDto',
					moduleSubModule: 'Procurement.Inventory',
					validationService: 'inventoryHeaderElementValidationService',
					mustValidateFields: ['InventoryDate', 'TransactionDate', 'PrjProjectFk']
				});
				service.updateReadOnly = function (entity, fieldToBeSet, value) {
					if (value) {
						inventoryHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity, fieldToBeSet, false);
					} else {
						inventoryHeaderReadonlyProcessor.setFieldReadonlyOrNot(entity, fieldToBeSet, true);
					}
				};
				/* var onSelectionChanged = function onSelectionChanged() {
                    if(service.hasSelection()){
                        var currentItem = service.getSelected();
                        inventoryHeaderReadonlyProcessor.updateReadOnlyFiled(currentItem, service.getModuleState(currentItem));
                    }
                }; */

				onReadSucceeded = serviceContainer.data.onReadSucceeded;
				serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});

					var dataRead = onReadSucceeded({
						dtos: readData.dtos,
						FilterResult: readData.FilterResult
					},
					data);

					service.goToFirst();
					return dataRead;
				};

				// var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				// confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer,{showDependantDataButton:false});

				service.setShowHeaderAfterSelectionChanged(function (inventoryHeader) {
					if (inventoryHeader) {
						const moduleInfoName = 'procurement.inventory.header.headerContainerTitle';
						// var text = inventoryHeader.Description;
						if (inventoryHeader.PrjProjectFk) {
							$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('PrcProject', inventoryHeader.PrjProjectFk)).then(function (project) {
								if (project) {
									let entityInfoObject = {};
									let text = cloudDesktopPinningContextService.concate2StringsWithDelimiter(project.ProjectNo, project.ProjectName, ' - ');
									entityInfoObject.project = {
										id: project.Id,
										description: text
									}
									if(inventoryHeader.Description !== ''){
										entityInfoObject.module = {
											id: inventoryHeader.Id,
											description: inventoryHeader.Description,
											moduleName: moduleName
										}
									}
									cloudDesktopInfoService.updateModuleInfo(moduleInfoName, entityInfoObject);
								}

							});
						}

						// cloudDesktopInfoService.updateModuleInfo(moduleInfoName, text);
					}
				});

				// user for reloading items after required  clearprojectstock wizard runed.
				//    service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
				var filters = [
					{
						key: 'header-inventory-stock-transaction-transactiontype-filter',
						serverSide: false,
						fn: function (item) {
							return item.IsConsumed === true && item.IsLive === true && item.Sorting !== 0 && item.IsDelta === false;
						}
					},
					{
						key: 'stock-project-filter',
						serverSide: false,
						fn: function projectFilter(item) {
							if(!_.isObject(item)) {
								return true;
							}
							var select = service.getSelected();
							return item.ProjectFk === select.PrjProjectFk;
						}
					},
					{
						key: 'stock-down-time-filter',
						serverSide: false,
						fn: function stockFilter(item) {
							if(!_.isObject(item)) {
								return true;
							}
							var select = service.getSelected();
							return item.PrjStockFk === select.PrjStockFk;
						}
					}

				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				service.doNavigate = function doNavigate(item, triggerField) {
					if (item && triggerField) {
						var keys = [];
						if (angular.isObject(item)) {
							keys.push(item[triggerField]);
						}
						if (angular.isString(item)) {
							keys.push(parseInt(item));
						}
						cloudDesktopSidebarService.filterSearchFromPKeys(keys);
					}
				};

				function setCurrentPinningContext(dataService) {
					function setCurrentProjectToPinnningContext(dataService) {
						var currentItem = dataService.getSelected();
						if (currentItem) {
							var projectPromise = $q.when(true);
							var pinningContext = [];
							if (angular.isNumber(currentItem.Id)) {
								if (angular.isNumber(currentItem.PrjProjectFk)) {
									projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.PrjProjectFk).then(function (pinningItem) {
										pinningContext.push(pinningItem);
									});
								}
							}

							return $q.all([projectPromise]).then(
								function () {
									if (pinningContext.length > 0) {
										cloudDesktopPinningContextService.setContext(pinningContext);
									}
								});
						}
					}

					setCurrentProjectToPinnningContext(dataService);
				}

				serviceContainer.data.callAfterSuccessfulUpdate = function () {
					service.showModuleHeaderInformation();
				};

				return service;
			}]);
})(angular);
