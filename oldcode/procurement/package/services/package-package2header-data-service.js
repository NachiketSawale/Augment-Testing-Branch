/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackagePackage2HeaderService',
		['$q', 'procurementCommonReadDataInterceptor', 'platformDataServiceFactory', 'procurementPackageDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService', 'basicsLookupdataLookupFilterService',
			'PlatformMessenger', 'PackagePackage2HeaderCommonItemsProcessor', 'procurementCommonGeneralsDataService',
			'procurementCommonCertificateNewDataService', 'procurementCommonHelperService', 'procurementPackage2HeaderReadonlyProcessor',
			'procurementCommonOverviewDataService', '$http', 'basicsCommonReadDataInterceptor', '$injector', '$timeout', 'procurementCommonHeaderTextNewDataService', 'basicsCommonMandatoryProcessor', 'platformModuleStateService',
			function ($q, procurementCommonReadDataInterceptor, dataServiceFactory, parentService,
				basicsLookupdataLookupDescriptorService, moduleContext, basicsLookupdataLookupFilterService,
				PlatformMessenger, PackagePackage2HeaderCommonItemsProcessor,
				procurementCommonGeneralsDataService, procurementCommonCertificateDataService, procurementCommonHelperService, readonlyProcessor,
				procurementCommonOverviewDataService, $http, basicsCommonReadDataInterceptor, $injector, $timeout, procurementCommonHeaderTextNewDataService, mandatoryProcessor, platformModuleStateService) {
				var filterRegistered = false;
				var onFilterLoaded = new PlatformMessenger();
				var onFilterUnLoaded = new PlatformMessenger();
				var lastSelectedItem = null;
				var lastItems = null;
				var lastBoqs = null;
				var serviceContainer;
				var service;
				var serviceOption = {
					flatNodeItem: {
						module: module,
						serviceName: 'procurementPackagePackage2HeaderService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/package/prcpackage2header/',
							endCreate:'createdata',
							initReadData: function initReadData(readData) {
								var packageHeader = parentService.getSelected();
								readData.filter = '?mainItemId=' + (packageHeader ? packageHeader.Id : -1);
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lastSelectedItem = null;
									lastItems = null;
									lastBoqs = null;
									angular.forEach(readData.Main, function (item) {
										var structureFk = item.PrcHeaderEntity.StructureFk;
										var structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: structureFk});
										if (angular.isDefined(structure)) {
											item.PrcHeaderEntity.TaxCodeFk = structure.TaxCodeFk;
										}
									});

									var packageHeader = parentService.getSelected();
									var list = angular.copy(service.getList());
									var result = [];
									if (packageHeader) {
										if (packageHeader.Version !== 0) {
											basicsLookupdataLookupDescriptorService.attachData(readData);
											result = serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
										} else {
											result = serviceContainer.data.handleReadSucceeded(list, data, true);
										}
									} else {
										basicsLookupdataLookupDescriptorService.attachData(readData);
										result = serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									}

									if (service.currentSelectItem) {
										service.setSelected(service.currentSelectItem);
										service.currentSelectItem = null;
									} else {
										// DEV-10491 fix characteristics disappear after refresh selected.
										setTimeout(function(){
											service.goToFirst();
										},1);
									}

									service.canLoadOverview = true;
									service.loadOverview.fire();
									service.canLoadOverview = false;
									return result;
								},
								initCreationData: function (creationData/* , data */) {
									var parentItem = parentService.getSelected();
									creationData.StructureFk = parentItem.StructureFk;
									var structure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: parentItem.StructureFk});
									if (angular.isDefined(structure)) {
										var TaxCodeFk = structure.TaxCodeFk;
										if (TaxCodeFk) {
											parentItem.TaxCodeFk = TaxCodeFk;
										}
									}
									creationData.ConfigurationFk = parentItem.ConfigurationFk;
									creationData.MdcTaxCodeFk = parentItem.TaxCodeFk;
									creationData.ProjectFk = parentItem.ProjectFk || moduleContext.loginProject;
									creationData.MainItemId = parentItem.Id;
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'PrcPackage2Header',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						dataProcessor: [new PackagePackage2HeaderCommonItemsProcessor(parentService), readonlyProcessor],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							},
							canDeleteCallBackFunc: function () {
								return !moduleContext.isReadOnly;
							}
						}
					},
					entitySelection: {}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				function packageChanged() {
					// service.load();
				}

				service.containerIsShow = false;
				service.setContainerShow = function (isShow) {
					if (isShow === false) {
						parentService.registerSelectionChanged(packageChanged);
					} else {
						parentService.unregisterSelectionChanged(packageChanged);
					}
				};

				service.setContainerShow(false);

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'PrcPackage2HeaderDto',
					moduleSubModule: 'Procurement.Package',
					validationService: 'procurementPackagePackage2HeaderValidationService',
					mustValidateFields: ['PrcHeaderEntity.StrategyFk']
				});

				service.loadOverview = new PlatformMessenger();
				service.completeItemCreated = new PlatformMessenger();
				service.name = moduleName;
				service.exchangeRateChanged = parentService.exchangeRateChanged;
				service.taxCodeFkChanged = parentService.taxCodeFkChanged;
				service.projectFkChanged = parentService.projectFkChanged;
				service.totalFactorsChangedEvent = parentService.totalFactorsChangedEvent;

				// procurementCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);
				basicsCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);
				service.updateAndExecute = parentService.updateAndExecute;
				service.update = parentService.update;

				service.allMainItemToDictionary = function allMainItemToDictionary() {
					var items = service.getList();
					return procurementCommonHelperService.arrayToDictionary(items, 'PrcHeaderFk', 'Description');
				};
				var filters = [
					{
						key: 'prc-package-package2header-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.packageRubricFk;
						}
					}, {
						key: 'prc-package-package2header-strategy-filter',
						serverSide: true,
						fn: function (currentItem) {
							if (!currentItem || !currentItem.Id) {
								return '1=2';
							}
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcHeaderEntity.ConfigurationFk});
							return 'PrcConfigHeaderFk=' + config.PrcConfigHeaderFk;
						}
					}
				];

				// filter events
				service.registerFilterLoad = function (func) {
					onFilterLoaded.register(func);
				};

				service.registerFilterUnLoad = function (func) {
					onFilterUnLoaded.register(func);
				};

				// register filter by hand
				service.registerFilters = function registerFilters() {
					if (!filterRegistered) {
						filterRegistered = true;
						basicsLookupdataLookupFilterService.registerFilter(filters);
					}
					onFilterLoaded.fire(moduleName);
				};

				function loadAfterCreateSucceeded(/* created */) {
					var requestData = {
						mainItemId: 0
					};

					$http.post(globals.webApiBaseUrl + 'procurement/common/overview/tree', requestData
					).then(function (response) {
						if (response.data) {
							var overviewService = procurementCommonOverviewDataService.getService(moduleContext.getMainService(), moduleContext.getLeadingService());
							overviewService.addRow(response.data[0]);
						}
					});
					service.markCurrentItemAsModified();// when create done the set selected will call by grid which will make selection changed and do clear all modifications.
					// reloadGeneralsAndCertificates(created);
				}

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
					lastSelectedItem = newData.Package2Header;
					lastItems = null;
					lastBoqs = null;
					/** @namespace newData.Package2Header */
					onCreateSucceeded(newData.Package2Header, data, creationData).then(function () {
						loadAfterCreateSucceeded(newData.Package2Header);
						service.completeItemCreated.fire(null, newData);
						// service.markCurrentItemAsModified();//when create done the set selected will call by grid which will make selection changed and do clear all modifications.
					});
				};

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				var onEntityDeleted = function onEntityDeleted(e, deletedItems) {
					var deleteEntities = [];
					if (deletedItems) {
						if (deletedItems instanceof Array) {
							deleteEntities = deletedItems;
						} else {
							deleteEntities = [deletedItems];
						}
						var overviewService = procurementCommonOverviewDataService.getService(moduleContext.getMainService(), moduleContext.getLeadingService());
						angular.forEach(deleteEntities, function (entity) {
							overviewService.deleteRow(entity.PrcHeaderFk);
						});
					}
				};
				service.registerEntityDeleted(onEntityDeleted);

				service.reload = function () {
					serviceContainer.data.doReadData(serviceContainer.data);
				};

				// package created event handler for get the default create package2header.
				var onPackageCreated = function (e, args) {
					if (!args || !args.Package2HeaderComplete) {
						return;
					}
					service.setCreatedItems(args.Package2HeaderComplete.Package2Header, true);
					loadAfterCreateSucceeded(args.Package2HeaderComplete.Package2Header);
					service.completeItemCreated.fire(null, args.Package2HeaderComplete);
				};
				// unload filters
				service.unRegisterFilters = function () {
					if (filterRegistered) {
						filterRegistered = false;
						basicsLookupdataLookupFilterService.unregisterFilter(filters);
					}
					onFilterUnLoaded.fire(moduleName);
				};

				service.getVatGroupFk = function getVatGroupFk() {
					var vatGroupFk = null;
					var selectePackge = parentService.getSelected();
					if (selectePackge) {
						vatGroupFk = selectePackge.BpdVatGroupFk;
					}
					return vatGroupFk;
				};

				service.getRubricId = function () {
					return moduleContext.packageRubricFk;
				};

				var doRoadDataAndClearItems = function (entity, originalEntity) {
					var generalsDataService = procurementCommonGeneralsDataService.getService(service);
					var certificateDataService = procurementCommonCertificateDataService.getService(service);
					certificateDataService.clearConfiguration2certCache();
					if (originalEntity && originalEntity.originalConfigurationFk && originalEntity.originalStructureFk) {
						generalsDataService.reloadData(originalEntity);
						certificateDataService.reloadData(originalEntity);
					} else if (entity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk) {
						generalsDataService.reloadData();
						certificateDataService.reloadData();
					}
				};
				// region reload certificates and generals when configuration or structure changed in prc header
				var reloadGeneralsAndCertificates = function reloadGeneralsAndCertificates(entity, originalEntity) {
					if (service.hasSelection() && service.getSelected().Id === entity.Id) {
						doRoadDataAndClearItems(entity, originalEntity);
					} else {
						service.setSelected(entity).then(function () {
							doRoadDataAndClearItems(entity, originalEntity);
						});
					}
				};

				function reloadHeaderText(item, options) {
					var headerTextDataService = procurementCommonHeaderTextNewDataService.getService(service);
					headerTextDataService.reloadData({
						prcHeaderId: item.PrcHeaderEntity.Id,
						prcConfigurationId: item.PrcHeaderEntity.ConfigurationFk,
						projectId: item.ProjectFk,
						isOverride: options !== null && !angular.isUndefined(options) ? options.isOverride : false
					});
				}

				var reloadAllGeneralsAndCertificatesAndHeaderText = function reloadAllGeneralsAndCertificatesAndHeaderText(reloadArgs) {
					$http.post(globals.webApiBaseUrl + 'procurement/common/data/loadbywizard', reloadArgs);
				};

				var onParentPropertyChanged = function onParentPropertyChanged(e, args) {
					/* if(args.model==='Description'){
					 _.forEach(service.getList(),function(item){
					 if(args.value) {
					 item.Description = item.Description || args.value;
					 service.markItemAsModified(item);
					 }
					 });
					 } */
					/* else */
					if (args.model === 'StructureFk') {
						_.forEach(service.getList(), function (item) {
							if (!item.PrcHeaderEntity.StructureFk) {
								var originalEntity = {};
								originalEntity.originalConfigurationFk = item.PrcHeaderEntity.ConfigurationFk;
								originalEntity.originalStructureFk = item.PrcHeaderEntity.StructureFk;
								item.PrcHeaderEntity.StructureFk = args.value;
								service.markItemAsModified(item);
								reloadGeneralsAndCertificates(item, originalEntity);

								reloadHeaderText(item, {
									isOverride: true
								});
							}
						});
					} else if (args.model === 'ConfigurationFk') {
						_.forEach(service.getList(), function (item) {
							if (item.PrcHeaderEntity.ConfigurationFk !== args.value) {
								var originalEntity = {};
								originalEntity.originalConfigurationFk = item.PrcHeaderEntity.ConfigurationFk;
								originalEntity.originalStructureFk = item.PrcHeaderEntity.StructureFk;
								item.PrcHeaderEntity.ConfigurationFk = args.value;
								reloadGeneralsAndCertificates(item, originalEntity);
								reloadHeaderText(item, {
									isOverride: true
								});

								service.markItemAsModified(item);
							}
						});
					} else if (args.model === 'AllConfigurationFk') {
						var reloadArgs = [];
						var entity = args.entity;
						var blobAction = entity.BlobAction;
						_.forEach(service.getList(), function (item) {
							if (item.PrcHeaderEntity.ConfigurationFk !== args.value) {

								var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: args.value});
								var argsEntity = {};
								argsEntity.SubPackageId = item.Id;
								argsEntity.MainItemId = item.PrcHeaderEntity.Id;
								argsEntity.OriginalStructureFk = item.PrcHeaderEntity.StructureFk;
								argsEntity.OriginalConfigurationFk = item.PrcHeaderEntity.ConfigurationFk;
								argsEntity.MdcControllingunitFk = item.MdcControllingUnitFk;
								argsEntity.StructureFk = item.PrcHeaderEntity.StructureFk;
								argsEntity.ConfigurationFk = args.value;
								argsEntity.ProjectFk = item.ProjectFk || moduleContext.loginProject;
								argsEntity.PrcHeaderFk = item.PrcHeaderFk;
								argsEntity.PrcConfigHeaderFk = config.PrcConfigHeaderFk;
								argsEntity.UpdateAction = blobAction;
								reloadArgs.push(argsEntity);

								item.PrcHeaderEntity.ConfigurationFk = args.value;
								service.markItemAsModified(item);
							}
						});

						if (!_.isEmpty(reloadArgs)) {
							reloadAllGeneralsAndCertificatesAndHeaderText(reloadArgs);
						}
					} else if (args.model === 'ProjectFk') {
						_.forEach(service.getList(), function (item) {
							reloadHeaderText(item, {
								isOverride: true
							});
						});
					}
				};

				parentService.registerFilterLoad(service.registerFilters);
				parentService.registerFilterUnLoad(service.unRegisterFilters);
				parentService.completeItemCreated.register(onPackageCreated);
				parentService.registerPropertyChanged(onParentPropertyChanged);
				service.registerFilters();

				service.registerSelectionChanged(function updateModuleHeaderInfo() {
					if (service.isSelection(service.getSelected())) {
						parentService.updateModuleHeaderInfo(service.getSelected());
					}
				});

				function getTotalNoDiscountSplitOfSubPackage(e, newSelectedItem) {
					if (lastItems && lastSelectedItem) {
						var prcItemServiceFactory = $injector.get('procurementCommonPrcItemDataService');
						var prcItemService = prcItemServiceFactory.getService(parentService);
						var prcItemNetTotalNoDiscountSplit = prcItemService.getNetTotalNoDiscountSplit(lastItems);
						lastSelectedItem.PrcItemValueNet = prcItemNetTotalNoDiscountSplit.netTotal;
						lastSelectedItem.PrcItemValueNetOc = prcItemNetTotalNoDiscountSplit.netTotalOc;
						lastSelectedItem.PrcItemGross = prcItemNetTotalNoDiscountSplit.gross;
						lastSelectedItem.PrcItemGrossOc = prcItemNetTotalNoDiscountSplit.grossOc;
					}
					if (lastBoqs && lastSelectedItem) {
						var prcBoqServiceFactory = $injector.get('procurementCommonPrcBoqService');
						var prcBoqService = prcBoqServiceFactory.getService(parentService);
						var boqItemNetTotalNoDiscountSplit = prcBoqService.getNetTotalNoDiscountSplit(lastBoqs);
						lastSelectedItem.PrcBoqValueNet = boqItemNetTotalNoDiscountSplit.netTotal;
						lastSelectedItem.PrcBoqValueNetOc = boqItemNetTotalNoDiscountSplit.netTotalOc;
						lastSelectedItem.PrcBoqGross = boqItemNetTotalNoDiscountSplit.gross;
						lastSelectedItem.PrcBoqGrossOc = boqItemNetTotalNoDiscountSplit.grossOc;
					}
					lastSelectedItem = newSelectedItem ? newSelectedItem : lastSelectedItem;
				}

				service.registerSelectionChanged(getTotalNoDiscountSplitOfSubPackage);

				var getLastItems = function () {
					var modState = platformModuleStateService.state(moduleName);
					if (modState.modifications && modState.modifications.PrcPackage2HeaderToSave &&
						modState.modifications.PrcPackage2HeaderToSave.length && lastSelectedItem) {
						var lastSubPackageState = _.find(modState.modifications.PrcPackage2HeaderToSave, {MainItemId: lastSelectedItem.Id});
						if (lastSubPackageState) {
							if ((lastSubPackageState.PrcItemToSave && lastSubPackageState.PrcItemToSave.length) ||
								(lastSubPackageState.PrcItemToDelete && lastSubPackageState.PrcItemToDelete.length)) {
								var prcItemServiceFactory = $injector.get('procurementCommonPrcItemDataService');
								var prcItemService = prcItemServiceFactory.getService(parentService);
								var items = prcItemService.getList();
								lastItems = (items) ? _.clone(items) : lastItems;
							}
							if (lastSubPackageState.PrcBoqCompleteToSave) {
								if ((lastSubPackageState.PrcBoqCompleteToSave.BoqItemCompleteToSave && lastSubPackageState.PrcBoqCompleteToSave.BoqItemCompleteToSave.length) ||
									(lastSubPackageState.PrcBoqCompleteToSave.BoqItemCompleteToDelete && lastSubPackageState.PrcBoqCompleteToSave.BoqItemCompleteToDelete.length)) {
									var prcBoqServiceFactory = $injector.get('procurementCommonPrcBoqService');
									var prcBoqService = prcBoqServiceFactory.getService(parentService);
									var boqs = prcBoqService.getList();
									lastBoqs = (boqs) ? _.clone(boqs) : lastBoqs;
								}
							}
						}
					}
				};

				var originalSetSelected = service.setSelected;
				service.setSelected = function (item, entities) {
					getLastItems();
					originalSetSelected(item, entities);
				};

				var originalSetSelectedEntities = service.setSelectedEntities;
				service.setSelectedEntities = function (entities) {
					getLastItems();
					originalSetSelectedEntities(entities);
				};


				service.getItemServiceName = function () {
					return 'procurementPackageItemDataService';
				};

				service.getModuleState = function () {
					return parentService.getModuleState();
				};

				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

				service.createSucceededWhenCreateHeader = function (newData) {
					serviceContainer.data.onCreateSucceeded(newData, serviceContainer.data);
				};

				return service;
			}]);
})(angular);