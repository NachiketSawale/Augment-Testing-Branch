/**
 * Created by nitsche on 30.04.2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobLocationDataServiceFactory
	 * @description pprovides methods to access, create and update logistic job  entities
	 */
	myModule.service('logisticJobLocationDataServiceFactory', LogisticJobLocationDataServiceFactory);

	LogisticJobLocationDataServiceFactory.$inject = [
		'_', '$', '$injector', '$http', '$q', '$translate', 'moment', 'platformDataServiceEntityReadonlyProcessor',
		'platformModalFormConfigService', 'platformDataServiceHttpResourceExtension', 'mainViewService',
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformGridDialogService', 'platformModalService', 'platformRuntimeDataService',
		'basicsLookupdataConfigGenerator', 'logisticJobPlantAllocationFilterConfigurationService',
		'logisticJobPlantAllocationFilterItemDataService', 'logisticJobPlantLocation2ProcessorService',
		'platformDataServiceSelectionExtension', 'platformContextService', 'platformDataServiceDataProcessorExtension',
		'basicsCommonStringFormatService'
	];

	function LogisticJobLocationDataServiceFactory(
		_, $, $injector, $http, $q, $translate, moment, platformDataServiceEntityReadonlyProcessor,
		platformModalFormConfigService, platformDataServiceHttpResourceExtension, mainViewService,
		platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformGridDialogService, platformModalService, platformRuntimeDataService,
		basicsLookupdataConfigGenerator, logisticJobPlantAllocationFilterConfigurationService,
		logisticJobPlantAllocationFilterItemDataService, logisticJobPlantLocation2ProcessorService,
		platformDataServiceSelectionExtension, platformContextService, platformDataServiceDataProcessorExtension,
		basicsCommonStringFormatService
	) {
		this.createService = function createService(options, servBase, layoutServiceName, detailedTitle, parentContainerTitle) {
			var deadline = null;
			let enablePaging = options.presenter && options.presenter.list && options.presenter.list.enablePaging;
			var logisticJobServiceOption = {
				flatLeafItem: {
					module: options.module,
					serviceName: options.serviceName,
					entityNameTranslationID: 'logisticJobEntity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'logistic/job/plantallocation/location/',
						endRead: options.httpCRUD.endRead,
						usePostForRead: true,
						initReadData: options.httpCRUD.initReadData,
						initReadDetailedData : _.isString(options.serviceName) ?
							options.httpCRUD.initReadDetailedData :
							function initReadDetailedData(readData) {
								let selectedLocation = $injector.get(options.serviceName).getSelected();
								if(!_.isNil(selectedLocation)){
									readData.JobFk = selectedLocation.JobFk;
									readData.PlantFk = selectedLocation.PlantFk;
									readData.WorkOperationTypeFk = selectedLocation.WorkOperationTypeFk;
									readData.UnitFk = selectedLocation.UoMFk;
								}
							}
					},
					actions: {delete: false, create: false},
					dataProcessor: [
						platformDataServiceEntityReadonlyProcessor,
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'JobPlantAllocationDto',
							moduleSubModule: 'Logistic.Job'
						}), logisticJobPlantLocation2ProcessorService
					],
					presenter: {
						list: {
							enablePaging: enablePaging,
							incorporateDataRead : function incorporateDataRead(bigResult, data) {
								var items;
								let result = enablePaging ? bigResult.Locations : bigResult;


								if (result && result.hasOwnProperty('FilterResult') && result.hasOwnProperty('dtos')) {  // must be a filtered dto
									items = result.dtos;
									if (data.isRoot && data.isRealRootForOpenedModule() && data.sidebarSearch) {
										data.clearSidebarFilter(result, data);
									}
								} else {
									items = result || [];
								}

								if (platformDataServiceSelectionExtension.supportSelection(data)) {
									platformDataServiceSelectionExtension.deselect(data);
								}
								data.itemList.length = 0;

								_.each(items, function iterator(item) {
									data.itemList.push(item);
								});

								platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

								data.listLoaded.fire(items);

								if (data.isRoot && data.isRealRootForOpenedModule() && platformDataServiceSelectionExtension.supportSelection(data)) {
									if (items.length) {
										platformDataServiceSelectionExtension.doMultiSelect(items[0], [items[0]], data);
									} else {
										platformContextService.setPermissionObjectInfo(null);
									}
								}
								if (enablePaging){
									data.totalRec = bigResult.NumberOfRows;
									data.updateRecordInfoText();
									data.executePostListLoadedCallbacks();

									return data.itemList;
								}
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'PlantAllocations', parentService: options.entityRole.parentService}
					}
				}
			};
			let serviceContainer = platformDataServiceFactory.createService(logisticJobServiceOption, servBase);
			serviceContainer.data.Initialised = true;
			serviceContainer.data.loadWasTriggeredByUser = false;
			serviceContainer.data.locationFilter = {
				AutoLoadIsActivated: true,
				ApplyFilter: false,
				SearchPattern: '',
				FilterItems: []
			};

			serviceContainer.data.getReadPayload = function getReadPayload(readData, mayIgnoreWOT) {
				let payLoad = {
					_deadline : _.isNil(deadline) ? moment.utc(Date.now()).format('YYYY-MM-DDTHH:mm:ss') : deadline.format('YYYY-MM-DDTHH:mm:ss'),
					MayIgnoreWOT : mayIgnoreWOT,
					PlantFk: readData.PlantFk,
					WorkOperationTypeFk: readData.WorkOperationTypeFk,
					UnitFk: readData.UnitFk,
					JobFk: readData.JobFk,
					PlantGroupFk: readData.PlantGroupFk,
					NumberOfRowsPerPage: serviceContainer.data.pageSize,
					Page: serviceContainer.data.page,
					PlantIsPlanable: readData.PlantIsPlanable
				};

				if(serviceContainer.data.locationFilter && serviceContainer.data.locationFilter.ApplyFilter) {
					payLoad.Filter = serviceContainer.data.locationFilter;
				}

				return payLoad;
			};

			// overwritting framework doCallHTTPRead to be able to pass the deadline parameter to the server
			serviceContainer.data.doCallHTTPRead = function doCallHTTPRead(readData,data,onReadSucceeded){
				platformDataServiceHttpResourceExtension.killRunningReadRequest(data);

				if(serviceContainer.data.locationFilter.AutoLoadIsActivated || serviceContainer.data.loadWasTriggeredByUser) {
					serviceContainer.data.loadWasTriggeredByUser = false;
					let parameter = serviceContainer.data.getReadPayload(readData, true);
					return $http.post(data.httpReadRoute + data.endRead, parameter, { timeout: platformDataServiceHttpResourceExtension.provideReadRequestToken(data) }
					).then(function (response) {
						platformDataServiceHttpResourceExtension.endRunningReadRequest(data);
						if (onReadSucceeded) {
							return onReadSucceeded(response.data, data);
						}

						return response.data;
					});
				} else {
					return $q.when([]);
				}

			};

			serviceContainer.service.openSetupDeadline = function OpenSetDeadline() {
				var dialogConfig = {
					title: $translate.instant('logistic.job.labelDeadlineSetup'),
					dataItem: {
						deadline: deadline
					},
					formConfiguration: {
						fid: 'logistic.job.deadlineSetup',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'deadline',
								label: 'Deadline',
								label$tr$: 'logistic.job.labelDeadline',
								type: 'dateutc',
								model: 'deadline',
								sortOrder: 1,
								tooltip:  $translate.instant('logistic.job.tooltipDeadline'),
								tooltip$tr$:'logistic.job.tooltipDeadline'
							}
						]
					},
					handleOK: function (result) {
						deadline = result.data.deadline;
						servBase.loadSubItemList();
					},
					handleCancel: function handleCancel() {
					}
				};
				platformModalFormConfigService.showDialog(dialogConfig);
			};
			serviceContainer.service.openDetailGridDialog = function openDetailGridDialog() {
				if(
					_.isObject(serviceContainer.service.getSelected()) &&
					_.isObject(options.entityRole.parentService.getSelected()))
				{
					let address =
						logisticJobServiceOption.flatLeafItem.httpCRUD.route +
						logisticJobServiceOption.flatLeafItem.httpCRUD.endRead;
					let readData = {filter: ''};
					if(_.isFunction(logisticJobServiceOption.flatLeafItem.httpCRUD.initReadDetailedData)){
						logisticJobServiceOption.flatLeafItem.httpCRUD.initReadDetailedData(readData);
					}
					let selected = serviceContainer.service.getSelected();
					readData.JobFk = selected.JobFk;
					readData.PlantFk = selected.PlantFk;
					readData.WorkOperationTypeFk = selected.WorkOperationTypeFk;
					readData.UnitFk = selected.UoMFk;
					let payload = serviceContainer.data.getReadPayload(readData, false);
					return $http.post(address, payload).then(function (response) {
						_.forEach(response.data, function (item) {
							platformRuntimeDataService.readonly(item, true);
						});
						return platformGridDialogService.showDialog({
							columns: $injector.
								get(layoutServiceName).
								getStandardConfigForListView().
								columns,
							items:response.data,
							idProperty: 'Id',
							tree: false,
							headerText: $translate.instant(detailedTitle),
							isReadOnly: true,
							showCancelButton: true,
							allowMultiSelect: true
						}).then(function (postDialog) {
							if(postDialog.success && _.isFunction(servBase.onDetailGridSuccess)){
								servBase.onDetailGridSuccess(_.filter(response.data,loc => postDialog.selectedIds.includes(loc.Id)));
							}
						});
					});
				}
				else{
					let modalOptions = {
						headerText: $translate.instant(detailedTitle),
						bodyText: basicsCommonStringFormatService.format($translate.instant('logistic.job.plantLocationDetailedErrorMsg'),$translate.instant(parentContainerTitle), $translate.instant(detailedTitle)),
						iconClass: 'ico-info'
					};
					return platformModalService.showDialog(modalOptions);
				}
			};
			serviceContainer.service.getDeadlineButtonConfig = function () {
				return {
					id: 'plantlocation-selectdeadline',
					caption: 'logistic.job.labelDeadlineSetup',
					iconClass: 'tlb-icons ico-date',
					type: 'item',
					sort: 100,
					fn: function () {
						servBase.openSetupDeadline();
					},
					disabled: function () {
					}
				};
			};
			serviceContainer.service.getDetailsButtonConfig = function () {
				return {
					id: 'plantlocation-detailgrid',
					caption: 'logistic.job.detailedLocations',
					iconClass: 'tlb-icons ico-show-detail',
					type: 'item',
					sort: 101,
					fn: function () {
						servBase.openDetailGridDialog();
					},
					disabled: function () {
					}
				};
			};
			serviceContainer.service.getActivateAutoLoadConfig = function (guid) {
				return {
					id: 'plantlocation-activateautoload',
					caption: 'logistic.job.activateautoload',
					iconClass: 'tlb-icons ico-circle-check',
					type: 'check',
					sort: 102,
					value: serviceContainer.data.locationFilter.AutoLoadIsActivated,
					fn: function () {
						serviceContainer.data.locationFilter.AutoLoadIsActivated = !serviceContainer.data.locationFilter.AutoLoadIsActivated;
						mainViewService.customData(guid, 'locationFilter', serviceContainer.data.locationFilter);
					},
					disabled: function () {
					}
				};
			};
			serviceContainer.service.configureFilterSettings = function configureFilterSettings(guid) {
				return {
					id: 'plantlocation-configurefilter',
					caption: 'logistic.job.configurePlantLocationFilter',
					type: 'item',
					iconClass: 'tlb-icons ico-filter',
					sort: 103,
					fn: function () {
						return logisticJobPlantAllocationFilterConfigurationService.editJobPlantAllocationFilterConfiguration(
							serviceContainer.data.locationFilter
						).then(function(res) {
							if(res !== false) {
								serviceContainer.data.locationFilter = res.data;
								mainViewService.customData(guid, 'locationFilter', res.data);
								serviceContainer.data.loadWasTriggeredByUser = true;
								serviceContainer.service.load();
							}

							return true;
						});
					},
					disabled: function () {
						return false;
					}
				};
			};
			serviceContainer.service.loadFilterSettings = function (guid) {
				let stored = mainViewService.customData(guid, 'locationFilter');
				if(!_.isNil(stored)) {
					serviceContainer.data.locationFilter = stored;
					logisticJobPlantAllocationFilterItemDataService.displayFilterItems(serviceContainer.data.locationFilter.FilterItems);
				}
			};
			serviceContainer.service.getStartLoadConfig = function () {
				return {
					id: 'plantlocation-startload',
					caption: 'logistic.job.startload',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					sort: 104,
					fn: function () {
						serviceContainer.data.loadWasTriggeredByUser = true;
						serviceContainer.service.load();
					},
					disabled: function () {
						return serviceContainer.data.locationFilter.AutoLoadIsActivated;
					}
				};
			};

			if(enablePaging){
				serviceContainer.data.page = 0;
				serviceContainer.data.pageSize = 1000;
				serviceContainer.data.totalRec = 0;

				serviceContainer.data.updateRecordInfoTextParams = function () {
					const pageStartRec = serviceContainer.data.page * serviceContainer.data.pageSize + 1;
					const pageMaxRec = (serviceContainer.data.page + 1) * serviceContainer.data.pageSize;
					const pageEndRec = pageMaxRec <= serviceContainer.data.totalRec ? pageMaxRec: serviceContainer.data.totalRec;
					serviceContainer.data.pagingInfo.startRec = pageStartRec;
					serviceContainer.data.pagingInfo.endRec = pageEndRec;
					serviceContainer.data.pagingInfo.totalRec = serviceContainer.data.totalRec;
					serviceContainer.data.pagingInfo.forwardEnabled = pageEndRec < serviceContainer.data.totalRec;
					serviceContainer.data.pagingInfo.backwardEnabled = pageStartRec > 1;
					serviceContainer.data.pagingInfo.pageSize = serviceContainer.data.pageSize;
				};

				serviceContainer.data.pagingInfo = {
					forwardEnabled: true,
					backwardEnabled: true,
					isPending: false,
					startRec:0,
					endRec: 0,
					totalRec : 0,
					recordInfoText: '',
					pageSize: 1000
				};
				serviceContainer.data.updateRecordInfoTextParams();

				serviceContainer.data.updateRecordInfoText = function () {
					serviceContainer.data.updateRecordInfoTextParams();
					let info = serviceContainer.data.pagingInfo;
					info.recordInfoText = info.startRec + ' - ' + info.endRec + ' / ' + info.totalRec;
				};
				serviceContainer.service.loadPageFirst = function loadPageFirst() {
					serviceContainer.data.page = 0;
				};
				serviceContainer.service.startLoad = function startLoad(resetPageNumber) {
					if (serviceContainer.data.pagingInfo.isPending) {
						return;
					}
					if (resetPageNumber) {
						serviceContainer.data.page = 0;
					}
					serviceContainer.service.loadSubItemList(undefined, true);
				};
				const superLoadSubItemList =  serviceContainer.service.loadSubItemList;
				serviceContainer.service.loadSubItemList = function loadSubItemList(keepSelection, doNotResetPage) {
					if(!doNotResetPage){
						serviceContainer.data.page = 0;
						serviceContainer.data.totalRec = 0;
					}
					superLoadSubItemList(keepSelection);
				};
				serviceContainer.service.loadPageBackward = function loadPageBackward() {
					serviceContainer.data.page = serviceContainer.data.page !== 0 ?
						serviceContainer.data.page - 1 :
						serviceContainer.data.page;
				};
				serviceContainer.service.loadPageForward = function loadPageForward() {
					++serviceContainer.data.page;
				};
				let calcMaxPageNumber = function calcMaxPageNumber(totalRec) {
					return Math.ceil(totalRec / serviceContainer.data.pageSize) - 1;
				};
				serviceContainer.service.loadPageLast = function loadPageLast() {
					serviceContainer.data.page = calcMaxPageNumber(serviceContainer.data.totalRec);
				};
				serviceContainer.service.getPagingInfo = function () {
					return serviceContainer.data.pagingInfo;
				};
				serviceContainer.service.getPageSize = function getPageSize() {
					return serviceContainer.data.pageSize;
				};
				serviceContainer.data.postListLoadedCallbacks = [];
				serviceContainer.data.executePostListLoadedCallbacks = function executePostListLoadedCallbacks(callback) {
					_.forEach(serviceContainer.data.postListLoadedCallbacks, callback => callback());
				};
				serviceContainer.service.registerListLoaded2 = function registerListLoaded2(callback) {
					return serviceContainer.data.postListLoadedCallbacks.push(callback);
				};
				serviceContainer.service.isPagingEnabled = function isPagingEnabled(callback) {
					return enablePaging;
				};
			}
			return serviceContainer;
		};

	}
})(angular);
