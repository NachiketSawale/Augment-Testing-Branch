/**
 * Created by zos on 8/27/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * @ngdoc service
	 * @name procurementPackageEstimateLineItemDataService
	 * @function
	 *
	 * @description
	 * procurementPackageLineItemDataService is the data service for all estimate related functionality in the module package.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('procurementPackageEstimateLineItemDataService',
		['$http', 'platformDataServiceFactory', 'procurementPackageDataService', 'procurementPackageReadonlyProcessor',
			'$injector', 'basicsLookupdataLookupDescriptorService', 'modelViewerModelSelectionService',
			'modelViewerStandardFilterService',
			function ($http, platformDataServiceFactory, procurementPackageDataService, readonlyProcessor, $injector, lookupDescriptorService,
				modelViewerModelSelectionService, modelViewerStandardFilterService) {
				let procurementCommonFilterJobVersionToolService = $injector.get('procurementCommonFilterJobVersionToolService');
				var packageLineItemServiceOptions = {
					flatNodeItem: {
						module: module,
						serviceName: 'procurementPackageEstimateLineItemDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
							endRead: 'filterlineitems4package',
							initReadData: initReadData,
							usePostForRead: true
						},
						presenter: {
							isDynamicModified: true,
							list: {
								incorporateDataRead: function (readData, data) {
									let highlightJobIds = [];
									readData = procurementCommonFilterJobVersionToolService.filterIncorporateDataRead(service, readData, highlightJobIds);
									handleDataBeforeReadCompleted(readData);
									lookupDescriptorService.attachData(readData);
									procurementCommonFilterJobVersionToolService.initFilterDataMenu(service, procurementPackageDataService, highlightJobIds);
									return serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'EstLineItem',
								parentService: procurementPackageDataService
							}
						},
						dataProcessor: [readonlyProcessor],
						entitySelection: {},
						useItemFilter: true
					}
				};

				function handleDataBeforeReadCompleted(readData) {

					createDynamicColumns(readData);
					assignCostGroupsToLineItems(readData);
				}

				function createDynamicColumns(readData) {

					var packageLineItemDynamicService = $injector.get('packageEstLineItemDynamicConfigurationService');
					// //at module package, idDynamicColunmActive will be true.
					// serviceContainer.data.isDynamicColumnActive = data.IsDynamicColumnActive;
					var dynCols = [];

					// create cost group column.
					var costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(readData.CostGroupCats, false);
					// added to UIStandard.
					packageLineItemDynamicService.attachData({costGroup: costGroupColumns});
					dynCols = dynCols.concat(costGroupColumns);

					// Update grid layout if there are dynamic columns
					// if dynCols.length is 0, it also should render UI again.
					// if (dynCols.length > 0){
					// Gather all the columns
					serviceContainer.data.dynamicColumns = dynCols;
					// refresh layout.
					packageLineItemDynamicService.fireRefreshConfigLayout();
					// }
				}

				function assignCostGroupsToLineItems(readData) {

					$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
						basicsCostGroupAssignmentService.process(readData, service, {
							mainDataName: 'Main',
							attachDataName: 'LineItem2CostGroups',
							dataLookupType: 'LineItem2CostGroups',
							identityGetter: function identityGetter(entity) {
								return {
									EstHeaderFk: entity.RootItemId,
									Id: entity.MainItemId
								};
							},
							isReadonly: true // at module package, it is readonly.
						});
					}]);
				}

				function initReadData(readData) {
					var selectPackage = procurementPackageDataService.getSelected();
					if (selectPackage) {
						readData.projectFk = selectPackage.ProjectFk;
						readData.packageFk = selectPackage.Id;
						return readData;
					} else {
						return null;
					}
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(packageLineItemServiceOptions);

				var service = serviceContainer.service;

				service.canCreate = service.canDelete = function () {
					return false;
				};

				service.registerSelectionChanged(reLoad);

				// noinspection JSUnusedLocalSymbols
				function reLoad(e, item) {
					if (procurementPackageDataService.getSelected() && procurementPackageDataService.getSelected().estlineitemfk > 0) {
						service.onReadOnlyGrid.fire(procurementPackageDataService.getSelected());
					}

					if (procurementPackageDataService.reloadPackageIds.length > 0) {
						// serviceContainer.data.doClearModificationsForItemFromCache(item && item.Id, serviceContainer.data);
						if (serviceContainer.service.getSelected()) {
							item = item || serviceContainer.service.getSelected();
							if (item && _.find(procurementPackageDataService.reloadPackageIds, function (load) {
								return load.lineitemid === item.Id;
							})) {
								var resourceDataService = $injector.get('procurementPackageEstimateResourceDataService');
								resourceDataService.load();
								resourceDataService.gridRefresh();
								_.remove(procurementPackageDataService.reloadPackageIds, function (loadItem) {
									return loadItem.lineitemid === item.Id;
								});
							}
						}
					}
				}

				function show3DViewByLineItem(selectedLineItem) {
					var route = globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/getall';
					$http.post(route, selectedLineItem).then(function (response) {
						var modelIds = [];
						if (response.data && response.data.length > 0) {
							modelIds = response.data;
						}
						showModelViewer(modelIds);
					});
				}

				function showModelViewer() {
					modelViewerStandardFilterService.updateMainEntityFilter();
				}

				service.getLineItemSelected = function (arg, gridItems) {
					var arr = [];
					if (arg) {
						angular.forEach(arg.rows, function (item) {
							var elem = gridItems[item];
							if (elem) {
								arr.push(elem);
							}
						});
						if (arr.length > 0) {
							var multipleItems = _.map(arr, function (item) {
								return {
									EstHeaderFk: item.EstHeaderFk,
									EstLineItemFk: item.Id
								};
							});
							show3DViewByLineItem(multipleItems);
						}

					}
				};

				service.getDataByHeaderId = function () {
					var packageEstimateHeaderDataService=$injector.get('procurementPackageEstimateHeaderDataService');
					var selectedEstimateHeader = packageEstimateHeaderDataService.getSelected();
					if (selectedEstimateHeader) {
						var readData = {};
						readData.projectFk = procurementPackageDataService.getSelected().ProjectFk;
						readData.estHeaderFk = selectedEstimateHeader.Id;
						readData.packageFk = procurementPackageDataService.getSelected().Id;
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/filterlineitems4package', readData
						).then(function (response) {
							handleDataBeforeReadCompleted(response.data);
							serviceContainer.data.handleReadSucceeded(response.data.Main, serviceContainer.data);
						}
						);
					}
				};

				service.estimateHeaderContainerIsExist = false;
				service.estimateHeaderContainerIfIsOpen = function (isOpen) {
					service.estimateHeaderContainerIsExist = isOpen;
					if (service.estimateHeaderContainerIsExist) {
						serviceContainer.data.doNotLoadOnSelectionChange = true;
					}
					else {
						serviceContainer.data.doNotLoadOnSelectionChange = false;
					}
				};

				serviceContainer.service.loadSubItemsList = loadSubItemsList;
				return service;

				// //////////////////////
				function loadSubItemsList() {
					serviceContainer.data.doesRequireLoadAlways = true;
					serviceContainer.data.loadSubItemList();
					serviceContainer.data.doesRequireLoadAlways = false;
				}
			}]);

})(angular);