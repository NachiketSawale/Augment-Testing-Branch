(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/** @namespace headerStatus.IsAdvertised */
	/**
	 * @ngdoc service
	 * @name 'procurementRfqRequisitionService'
	 * @function
	 * @requires platformDataServiceFactory
	 * @description
	 * #
	 * data service of rfq requisition container
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqRequisitionService', [
		'_', '$http', 'platformDataServiceFactory', 'procurementRfqMainService', 'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService', 'procurementCommonDataEnhanceProcessor', 'basicsCommonMandatoryProcessor',
		'PlatformMessenger', 'procurementCommonDocumentCoreDataService', 'procurementContextService', 'basicsLookupdataLookupDataService', 'platformPermissionService',
		'basicsLookupdataLookupDescriptorService', '$q', 'platformDataServiceDataProcessorExtension', 'platformDataServiceActionExtension',
		function (_, $http, platformDataServiceFactory, procurementRfqMainService, lookupDescriptorService,
			lookupFilterService, procurementCommonDataEnhanceProcessor, basicsCommonMandatoryProcessor,
			PlatformMessenger, documentService, procurementContextService, basicsLookupdataLookupDataService, platformPermissionService,
			basicsLookupdataLookupDescriptorService, $q, platformDataServiceDataProcessorExtension, platformDataServiceActionExtension) {

			var serviceOption = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementRfqRequisitionService',
					httpCreate: {route: globals.webApiBaseUrl + 'procurement/rfq/requisition/',endCreate:'createnew'},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/rfq/requisition/',
						endRead: 'tree',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.Value = procurementRfqMainService.getIfSelectedIdElse(-1);
						}
					},
					dataProcessor: [dataProcessItem()],
					presenter: {
						tree: {
							parentProp: 'Pid',
							childProp: 'Children',
							initCreationData: function initCreationData(creationData) {
								creationData.Value = procurementRfqMainService.getSelected().Id;
							},
							incorporateDataRead: incorporateDataRead,
							doesRequireLoadAlways: true
						}
					},
					entityRole: {
						node: {
							itemName: 'RfqRequisition',
							parentService: procurementRfqMainService,
							doesRequireLoadAlways: platformPermissionService.hasRead('3da6f959d8744a84be2d78dac89ffeef')
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			let originalHandleOnCreateSucceeded = serviceContainer.data.handleOnCreateSucceeded;
			service.loadOverview = new PlatformMessenger();
			service.reqHeaderFkChanged = new PlatformMessenger();
			service.reqHeaderFkChanged.register(onReqHeaderFkChanged);
			service.updateParentItem = updateParentItem;
			service.registerSelectionChanged(onRowChanged);
			service.createChildItem = null;
			service.canCreateChild = false;


			serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
				// handle   children data
				if (newItem.Id < 0) {
					let newItems = [];
					data.flatten([newItem], newItems, data.treePresOpt.childProp);
					_.forEach(newItems, function (item) {
						platformDataServiceDataProcessorExtension.doProcessItem(item, data);
						data.itemList.push(item);
					});
					platformDataServiceActionExtension.fireEntityCreated(data, newItem);
					return $q.when(newItem);
				}
				// handle no children data
				else {
					return originalHandleOnCreateSucceeded(newItem, data);
				}
			};
			initialize(service);


			return service;

			function onReqHeaderFkChanged(e, args) {
				var value = args.value;
				var entity = args.entity;
				if (value && entity.ReqHeaderFk !== value) {
					// PrcHeaderFk,PrcHeaderEntity
					$http
						.get(globals.webApiBaseUrl + 'procurement/rfq/requisition/getprcheaderbyreq?reqHeaderFk=' + value)
						.then(function (xhr) {
							if (xhr && xhr.data) {
								entity.PrcHeaderFk = xhr.data.Id;
								entity.PrcHeaderEntity = xhr.data;
								// read this PRC document
								documentService.getService(service).read();
								onRowChanged();
							}
							return entity;

						})
						.then(function () {

							// Sets ProjectFk
							return basicsLookupdataLookupDataService.getItemByKey('reqheaderlookupview', value).then(function (item) {
								entity.ProjectFk = item.ProjectFk;
								entity.PackageFk = item.PackageFk;
								onRowChanged();

								serviceContainer.service.gridRefresh();
								return entity;
							});

						})
						.then(function (entity) {
							if (value > 0) {
								let list = service.getList();
								let parent = _.find(list, {Id: entity.Id});
								let children = parent.Children;
								if (children && children.length > 0) {
									_.forEach(children, function (child) {
										service.deleteItem(child);
									});
								}
								$http.post(globals.webApiBaseUrl + 'procurement/rfq/requisition/getchildren', parent).then(function (response) {
									if (response && response.data) {
										list = service.getList();
										parent = _.find(list, {Id: entity.Id});
										loadChildrenAfterCreation(parent, response.data);
									}
								});
							}
						});

				}
			}

			function onRowChanged() {
				serviceContainer.service.canLoadOverview = true;
				serviceContainer.service.loadOverview.fire();
				serviceContainer.service.canLoadOverview = false;
			}

			function incorporateDataRead(readData, data) {
				lookupDescriptorService.attachData(readData || {});
				var dataRead = data.handleReadSucceeded(readData.Main, data, true);
				service.goToFirst(data);

				if (readData.Main.length > 0) {
					var parentItem = procurementRfqMainService.getSelected();
					procurementRfqMainService.updateHeaderFieldsReadonly(parentItem);
				}
				return dataRead;
			}

			function dataProcessItem() {
				var isReadonly = function isReadonly(item) {
					if (!item) {
						return true;
					}
					let readonly = isReadonlyByParentStatus();
					if (!readonly)
					{
						if (item.Id<0) {
							return  true;
						}
					}
					return readonly;
				};
				var dataProcessService = function () {
					// return {dataService: service, validationService: validationService(service)};
					// execute validation logic in procurementRfqRequisitionValidationService (not in procurementCommonDataEnhanceProcessor).
					return {dataService: service, validationService: null};
				};

				return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementRfqRequisitionUIStandardService', isReadonly);
			}
			function initialize(service) {
				var entitiesNeedResetHeaderToNull = [];
				var filters = [
					{
						key: 'procurement-rfq-requisition-requisition-filter',
						serverSide: true,
						serverKey: 'procurement-rfq',
						fn: function () {
							var mainItem = procurementRfqMainService.getSelected();
							if (!mainItem) {
								return {
									Id: -1
								};
							}

							var filter = {};
							var existItems = service.getList();

							filter.Ids = _.map(existItems, function (item) {
								return item.ReqHeaderFk;
							});
							filter.CompanyFk = mainItem.CompanyFk;

							if (mainItem.ProjectFk && mainItem.ProjectId !== -1) {
								filter.ProjectFk = mainItem.ProjectFk;
							}

							filter.ReqHeaderFk = mainItem.RfqHeaderFk;

							return filter;
						}
					}, {
						key: 'project-main-project-for-rfq-requisition-filter',
						serverSide: true,
						serverKey: 'project-main-project-for-rfq-requisition-filter',
						fn: function (entity) {
							var filter = {};
							filter.CompanyFk = entity.CompanyFk;
							return filter;
						}
					}, {
						key: 'procurement-rfq-requisition-requisition-filter-new',
						serverSide: true,
						serverKey: 'procurement-rfq-new',
						fn: function () {
							var mainItem = procurementRfqMainService.getSelected();
							if (!mainItem) {
								return {
									Id: -1
								};
							}
							var filter = {};
							var existItems = service.getList();
							filter.Ids = _.map(existItems, function (item) {
								return item.ReqHeaderFk;
							});
							filter.ReqHeaderFk = mainItem.RfqHeaderFk;
							return filter;
						}
					}
				];
				lookupFilterService.registerFilter(filters);

				service.name = 'procurement.rfq.requisition';
				service.canDelete = function canDelete() {
					if (service.getList().length <= 0) {
						return false;
					}
					let data=service.getSelected();
					if (data&&data.Id<0)
					{
						return false;
					}
					return !isReadonlyByParentStatus();
				};

				service.canCreate = function canCreate() {
					var rfqItem = procurementRfqMainService.getSelected();
					if (!rfqItem || angular.isUndefined(rfqItem.Id) || rfqItem.IsBidderDeniedRequest) {
						return false;
					}
					return !isReadonlyByParentStatus();
				};

				service.documentCreateItem = false;
				service.documentDeleteItem = false;
				service.documentUploadItem = false;

				service.needResetReqHeaderToNull = function needResetReqHeaderToNull(entityId) {
					var found = _.find(entitiesNeedResetHeaderToNull, {Id: entityId});
					if (!found) {
						entitiesNeedResetHeaderToNull.push({Id: entityId});
					}
				};

				service.noneedResetReqHeaderToNull = function noneedResetReqHeaderToNull(entityId) {
					var found = _.find(entitiesNeedResetHeaderToNull, {Id: entityId});
					if (found) {
						entitiesNeedResetHeaderToNull = _.filter(entitiesNeedResetHeaderToNull, function (item) {
							return item.Id !== found.Id;
						});
					}
				};

				service.resetReqHeadaerToNull = function resetReqHeaderToNull(entity) {
					var found = _.find(entitiesNeedResetHeaderToNull, {Id: entity.Id});
					if (found) {
						entitiesNeedResetHeaderToNull = _.filter(entitiesNeedResetHeaderToNull, function (item) {
							return item.Id !== found.Id;
						});
						entity.ReqHeaderFk = -1;
					}
				};

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns IsReadonly {Isreadonly:true|false}
				 */
				service.getModuleState = function getModuleState(item) {
					var state, status, parentItem = item || service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('ReqStatus');
					let reqLookupData = basicsLookupdataLookupDescriptorService.getData('reqheaderlookupview');
					if (parentItem && parentItem.Id && reqLookupData && reqLookupData[parentItem.ReqHeaderFk]) {
						let req = reqLookupData[parentItem.ReqHeaderFk];
						state = _.find(status, {Id: req.ReqStatusFk});
						if (state) {
							state = {IsReadonly: state.Isreadonly};
						}

					} else {
						state = {IsReadonly: true};
					}
					return state;
				};

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				const onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
					const parentItem = procurementRfqMainService.getSelected();
					if (serviceContainer.data.itemList.length === 0) {
						let isChanged = false;
						if (parentItem.CurrencyFk !== procurementContextService.companyCurrencyId) {
							parentItem.CurrencyFk = procurementContextService.companyCurrencyId;
							if (parentItem.ExchangeRate !== 1) {
								parentItem.ExchangeRate = 1;
								procurementRfqMainService.exchangeRateChanged.fire(null, { ExchangeRate: 1 });
								procurementRfqMainService.gridRefresh();
							}
							isChanged = true;
						}
						if (isChanged) {
							procurementRfqMainService.markItemAsModified(parentItem);
						}
						procurementRfqMainService.updateHeaderFieldsReadonly(parentItem, false);
					}
					recalculateDatePriceFixing(parentItem, serviceContainer.data.itemList);
					procurementRfqMainService.gridRefresh();
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				const onEntityCreated = function onEntityCreated() {
					const parentItem = procurementRfqMainService.getSelected();
					recalculateDatePriceFixing(parentItem, serviceContainer.data.itemList);
					procurementRfqMainService.gridRefresh();
				};
				serviceContainer.service.registerEntityCreated(onEntityCreated);

				const onEntityModified = function onEntityModified() {
					const parentItem = procurementRfqMainService.getSelected();
					recalculateDatePriceFixing(parentItem, serviceContainer.data.itemList);
					procurementRfqMainService.gridRefresh();
				};
				serviceContainer.service.registerItemModified(onEntityModified);

				// execute validation after new entity created
				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'RfqRequisitionDto',
					moduleSubModule: 'Procurement.RfQ',
					validationService: 'procurementRfqRequisitionValidationService',
					mustValidateFields: ['ReqHeaderFk']
				});
			}

			// ///////////////////
			function isReadonlyByParentStatus() {
				var readonly = false;
				var header = procurementRfqMainService.getSelected();
				if (header.RfqHeaderFk) {
					readonly = true;
				}

				var headerStatus = procurementRfqMainService.getStatus();
				// jshint ignore:line
				if (!headerStatus || headerStatus.IsReadonly || headerStatus.IsAdvertised || headerStatus.IsQuoted) {
					readonly = true;
				}
				return readonly;
			}

			function updateParentItem(reqId, list, callback) {
				$http.get(globals.webApiBaseUrl + 'procurement/rfq/requisition/getreqheaderinfo?reqHeaderId=' + reqId).then(function (response) {
					var data = response.data;
					var parentItem = procurementRfqMainService.getSelected();
					var isChanged = false;
					if ((parentItem.Version === 0 || list.length === 1) && parentItem.PrcConfigurationFk !== data.ConfigurationFk) {
						parentItem.PrcConfigurationFk = data.ConfigurationFk;
						isChanged = true;
					}
					if (parentItem.CurrencyFk !== data.CurrencyFk) {
						parentItem.CurrencyFk = data.CurrencyFk;
						if (parentItem.ExchangeRate !== data.ExchangeRate) {
							parentItem.ExchangeRate = data.ExchangeRate;
							procurementRfqMainService.exchangeRateChanged.fire(null, {ExchangeRate: data.ExchangeRate});
							procurementRfqMainService.gridRefresh();
						}
						isChanged = true;
					}
					if (isChanged) {
						procurementRfqMainService.markItemAsModified(parentItem);
					}
					procurementRfqMainService.updateHeaderFieldsReadonly(parentItem);
					procurementRfqMainService.gridRefresh();

					if (angular.isFunction(callback)) {
						callback();
					}
				});
			}

			function loadChildrenAfterCreation(parent, childrenData) {
				if (parent && childrenData && parent.ReqHeaderFk > 0) {
					let children = childrenData.Main;
					lookupDescriptorService.attachData(childrenData || {});
					_.forEach(children, function (child) {
						serviceContainer.data.onCreateSucceeded(child, serviceContainer.data, {parent: parent, parentId: parent.Id});
					});
				}
			}

			/**
			 * Recalculates the DatePriceFixing property of the parent item based on the list of child items.
			 *
			 * @param {Object} parentItem - The parent item whose DatePriceFixing property needs to be recalculated.
			 * @param {Array} list - The list of child items to be considered for recalculating the DatePriceFixing property.
			 */
			function recalculateDatePriceFixing(parentItem, list) {
				if (!parentItem) {
					return;
				}
				parentItem.DatePriceFixing = null;
				// get the DatePriceFixing from reqs, later than the rfq creation date and closest to it.
				if (list && list.length > 0) {
					const reqLookupData = basicsLookupdataLookupDescriptorService.getData('reqheaderlookupview');
					_.forEach(list, function (item) {
						const req = reqLookupData?.[item.ReqHeaderFk];
						if (!req?.DatePriceFixing) {
							return;
						}
						const datePriceFixing = new Date(req.DatePriceFixing);
						if (datePriceFixing > new Date(parentItem.InsertedAt)) {
							if (parentItem.DatePriceFixing) {
								if (datePriceFixing < new Date(parentItem.DatePriceFixing)) {
									parentItem.DatePriceFixing = req.DatePriceFixing;
								}
							} else {
								parentItem.DatePriceFixing = req.DatePriceFixing;
							}
						}
					});
				}
			}
		}
	]);
})(angular);
