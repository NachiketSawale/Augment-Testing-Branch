/**
 * commom billing schema data service
 * for create sub-billing schema data service like InvBillingSchemaService
 * create by lnb 2015-06-08
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.billingschema').factory('commonBillingSchemaDataService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', '$http',
			'$timeout', '$q', 'platformRuntimeDataService', 'basicsCommonReadDataInterceptor', 'PlatformMessenger',
			'BasicsBillingSchemaDetailReadOnlyProcessor', 'globals', '_',
			function (dataServiceFactory, lookupDescriptorService, $http,
				$timeout, $q, runtimeDataService, readDataInterceptor, PlatformMessenger,
				BasicsBillingSchemaDetailReadOnlyProcessor, globals, _) {

				var dataServiceFac = {};
				var serviceRepository = [];
				var createService = null;

				/*
				 * service repository, for cache services with different parent service. one parent service only have one billing schema service.
				 */
				dataServiceFac.getService = function (parentService, route, svrOptions) {
					var dataService;
					angular.forEach(serviceRepository, function (container) {
						if (container.parentSerivce === parentService) {
							dataService = container.dataService;
						}
					});

					if (!dataService) {
						dataService = createService(parentService, route, svrOptions);
						serviceRepository.push({parentSerivce: parentService, dataService: dataService});
					}

					return dataService;
				};

				/*
				 * billing schema service constructor
				 */
				createService = function (parentService, route, createOptions) {
					var serviceContainer = null;
					var service = null;
					var opts = angular.extend({
						onUpdateSuccessNotify: null,
						getIfSelectedIdElse: null
					}, createOptions);
					var serviceOption = {
						flatLeafItem: {
							httpCRUD: {
								route: globals.webApiBaseUrl + route,
								initReadData: function (readData) {
									readData.filter = '?mainItemId=' + (opts.getIfSelectedIdElse ? opts.getIfSelectedIdElse() : parentService.getIfSelectedIdElse(-1));
									if (angular.isFunction(service.getQualifier)) {
										readData.filter = readData.filter + '&qualifier=' + service.getQualifier();
									}
								}
							},
							serviceName: 'commonBillingSchemaDataService',
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										var parentSelected = parentService.getSelected();
										var selfSelected = service.getList();
										if (parentSelected &&
											parentSelected.Version === 0 &&
											selfSelected && selfSelected.length && selfSelected[0].HeaderFk === parentSelected.Id)
										{
											return;
										}

										if (parentSelected && parentSelected.IsFromDeepCopy) {
											return;
										}

										var billingSchemas = service.splitHiddenItems(readData && readData.Main && readData.Main.length ? readData.Main : [], false);
										if (billingSchemas.length > 0) {
											lookupDescriptorService.attachData(readData);
											billingSchemas.map(function (i) {
												generateStyle(i);
											});
											angular.forEach(billingSchemas, function (item) {
												service.updateRowReadonly(item);
											});
											serviceContainer.service.goToFirst();
										}
										return serviceContainer.data.handleReadSucceeded(billingSchemas, data, true);
									}
								}
							},
							entityRole: {
								leaf: {
									itemName: 'BillingSchema',
									parentService: parentService,
									doesRequireLoadAlways: true
								}
							},
							dataProcessor: [new BasicsBillingSchemaDetailReadOnlyProcessor()]
						}
					};
					serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;
					// eslint-disable-next-line no-unused-vars
					var dirtyCaches = {};
					readDataInterceptor.init(service, serviceContainer.data);

					// when the data in RFQ billingSchema wizard changed, reload the selected billingSchema
					service.doReadData = function () {
						serviceContainer.data.handleReadSucceeded([], serviceContainer.data);
						serviceContainer.data.doReadData(serviceContainer.data);
					};

					service.canCreate = function canCreate() {
						return false;
					};

					service.canDelete = function canDelete() {
						return false;
					};

					service.contractBillingSchemaChanged = new PlatformMessenger();
					service.billBillingSchemaChanged = new PlatformMessenger();
					service.hiddenItems = [];
					service.isPostHiddenItems = false;

					service.getRubricCategory = function (item) {
						return item.RubricCategoryFk;
					};//needed to override

					/**
					 * reload items from billingschemafk and rubricCategoryFk
					 * @returns {*}
					 * @param item
					 * @param onLoadDone
					 */
					service.reloadItems = function reloadItems(item, onLoadDone) {
						var defer = $q.defer();
						var creationData = {
							HeaderFK: item.Id,
							billingSchemaFk: item.BillingSchemaFk,
							rubricCategoryFk: service.getRubricCategory(item)
						};
						$http({
							method: 'get',
							url: globals.webApiBaseUrl + route + 'reloaditems',
							params: creationData
						}).then(function (response) {
							lookupDescriptorService.attachData(response.data || {});
							var billingSchemas = service.splitHiddenItems(response.data.Main, true);
							angular.forEach(billingSchemas, function (item) {
								service.updateRowReadonly(item);
								if (serviceContainer.data.handleCreateSucceededWithoutSelect) {
									serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, creationData);
								}
								if (onLoadDone) {
									onLoadDone(item, serviceContainer.data, creationData);
								}
							});
							service.goToFirst(serviceContainer.data);
							service.gridRefresh();
							defer.resolve(response.data);
						}, function (error) {
							defer.reject(error);
						});

						return defer.promise;
					};

					//overwrite the doClearModifications method
					var oldDoClearModifications = serviceContainer.data.doClearModifications;
					serviceContainer.data.doClearModifications = doClearModifications;

					function doClearModifications(entities, data) {
						if (_.isArray(entities)) {
							_.forEach(entities, function (entity) {
								oldDoClearModifications(entity, data);
							});
						} else {
							oldDoClearModifications(entities, data);
						}
					}

					service.reloadItemsFromBill = function reloadItemsFromBill(item, onLoadDone, hasHiddenItem) {
						var defer = $q.defer();
						if (item.BillingSchemaFk) {
							var creationData = {
								HeaderFK: item.Id,
								billingSchemaFk: item.BillingSchemaFk,
								rubricCategoryFk: service.getRubricCategory(item)
							};
							if (angular.isFunction(service.getQualifier)) {
								creationData.qualifier = service.getQualifier();
							}
							$http({
								method: 'get',
								url: globals.webApiBaseUrl + route + 'reloadBillItems',
								params: creationData
							}).then(function (response) {
								lookupDescriptorService.attachData(response.data || {});
								var billingSchemas = hasHiddenItem ? response.data.Main : service.splitHiddenItems(response.data.Main, true);
								billingSchemas.map(function (i) {
									generateStyle(i);
								});
								angular.forEach(billingSchemas, function (billingSchema) {
									service.updateRowReadonly(billingSchema);
									if (serviceContainer.data.handleCreateSucceededWithoutSelect) {
										if(item.OldBillingSchemas){
											var oldBillingSchema = _.find(item.OldBillingSchemas, {'IsEditable': true, 'MdcBillingSchemaDetailFk': billingSchema.MdcBillingSchemaDetailFk});
											if(oldBillingSchema){
												billingSchema.Description = oldBillingSchema.Description;
												billingSchema.Description2 = oldBillingSchema.Description2;
												billingSchema.CodeRetention = oldBillingSchema.CodeRetention;
												billingSchema.Value = oldBillingSchema.Value;
											}
										}

										if (serviceContainer.data.handleCreateSucceededWithoutSelect) {
											serviceContainer.data.handleCreateSucceededWithoutSelect(billingSchema, serviceContainer.data, service);
										}
									}
									if (onLoadDone && !onLoadDone.getAllItems) {
										onLoadDone(billingSchema, serviceContainer.data, creationData);
									}
								});
								if (onLoadDone && onLoadDone.getAllItems) {
									onLoadDone(billingSchemas, serviceContainer.data, creationData);
								}

								defer.resolve(response.data);
							}, function (error) {
								defer.reject(error);
							});
						} else {
							defer.resolve([]);
						}

						return defer.promise;
					};

					service.onBillingSchemaChangedFromBilling = function onBillingSchemaChangedFromBilling(item) {
						service.deleteAll();//delete all items
						return service.reloadItemsFromBill(item);
					};

					service.copyBasicBillingSchemas = function copyBasicBillingSchemas(item, onLoadDone, hasHiddenItem) {
						return service.reloadItemsFromBill(item, onLoadDone, hasHiddenItem);
					};

					service.onBillingSchemaChanged = function onBillingSchemaChanged(item) {
						let billingSchemas = service.getList();
						if (billingSchemas && billingSchemas[0] && billingSchemas[0].HeaderFk === item.Id) {
							service.deleteAll();// delete all items in same HeaderFK
						}
						return service.reloadItems(item);
					};

					/**
					 * @ngdoc function
					 * @name recalculateBilling
					 * @function
					 * @methodOf createService
					 * @description used to recalculate the billing schema
					 * @returns {promise}
					 * @param mainitemid
					 */
					service.recalculateBilling = function recalculateBilling(mainitemid) {
						var defer = $q.defer();
						var postData = {
							mainItemId: mainitemid
						};
						if (angular.isFunction(service.getQualifier)) {
							postData.qualifier = service.getQualifier();
						}
						$http({
							method: 'get',
							url: globals.webApiBaseUrl + route + 'recalculate',
							params: postData
						}).then(function (response) {
							lookupDescriptorService.attachData(response.data || {});

							var billingSchemas = service.splitHiddenItems(response.data.Main, true);
							// Generate styles and refresh the service
							billingSchemas.map(function (i) {
								generateStyle(i);
								service.updateRowReadonly(i);
							});
							service.setList(billingSchemas);
							service.fireListLoaded();
							//service.gridRefresh();
							defer.resolve(response.data);
						}, function (error) {
							defer.reject(error);
						});

						return defer.promise;
					};

					var deleteItem = function (entity) {
						return serviceContainer.data.deleteItem(entity, serviceContainer.data);
					};

					service.fireListLoaded = function fireListLoaded() {
						serviceContainer.data.listLoaded.fire();
					};

					//delete all items
					service.deleteAll = function deleteAll() {
						service.deleteItem = service.deleteItem || deleteItem;
						var items = service.getList();
						items = items.concat(service.getHiddenItems());
						serviceContainer.data.supportUpdateOnSelectionChanging = false;
						serviceContainer.data.deleteEntities(items, serviceContainer.data);
						serviceContainer.data.supportUpdateOnSelectionChanging = true;
					};

					/*var onParentCreated = function onParentCreated(e, item) {
					 $timeout(function () {
					 if (item && item.BillingSchemaFk) {
					 service.BillingSchemaFk = item.BillingSchemaFk;
					 service.reloadItems(item);
					 service.isBillingDirty = true;
					 }
					 }, 600);
					 };*/

					var onParentSelectionChanged = function onParentSelectionChanged(e, item) {
						if (item && item.Id) {
							service.BillingSchemaFk = item.BillingSchemaFk;
							dirtyCaches = {};
							service.gridRefresh();
						}
					};


					var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
						var tempItems = service.splitHiddenItems(completeData.BillingSchemas || [], true);
						service.setCreatedItems(tempItems);
						service.isBillingDirty = true;
						angular.forEach(tempItems, function (item) {
							service.updateRowReadonly(item);
						});
					};

					if (parentService.completeEntityCreateed) {
						parentService.completeEntityCreateed.register(onCompleteEntityCreated);
					}

					/*var onParentItemModified = function onParentItemModified(e, item) {

					 if (!item || !item.Id) {
					 return;
					 }

					 //reload billing schemas only when billingSchemaFk changed or rubriccategoryfk changed.
					 if (item.BillingSchemaFk !== service.BillingSchemaFk) {
					 service.BillingSchemaFk = item.BillingSchemaFk;
					 service.RubricCategoryFk = service.getRubricCategory();
					 if (service.getRubricCategory()) {
					 service.reloadItems(item);
					 service.markCurrentItemAsDirty();
					 }
					 } else if(service.getRubricCategory() !== service.RubricCategoryFk){
					 service.BillingSchemaFk = 0; //set to 0 and wait for the new value from RubricCategoryFk validator
					 }else if (
					 item.TaxCodeFk !== service.TaxCodeFk ||
					 item.GeneralsTypeFk !== service.GeneralsTypeFk) {
					 service.markCurrentItemAsDirty();
					 }
					 };*/

					/*var onItemModified = function onItemModified(e, item) {
					 if (item && service.old.Value !== item.Value) {
					 service.old.Value = item.Value;
					 service.markCurrentItemAsDirty();
					 }
					 };*/

					// eslint-disable-next-line no-tabs
					/*	var onSelectionChanged = function onSelectionChanged(e, item) {
					 //service.updateRowReadonly(item);
					 service.old = item;
					 };*/

					/*service.markCurrentItemAsDirty = function (isDirty) {
					 isDirty = angular.isUndefined(isDirty) ? true : isDirty;
					 var parentItem = parentService.getSelected();
					 dirtyCaches[parentItem.Id] = service.isBillingDirty = isDirty;
					 service.gridRefresh();
					 };*/

					var moduleReadonly = false;
					service.setModuleReadonly = function setModuleReadonly(readonly) {
						moduleReadonly = readonly;
					};

					service.getModuleReadonly = function getModuleReadonly() {
						return moduleReadonly;
					};

					service.updateRowReadonly = function updateRowReadonly(item) {
						if (!item || !item.Id) {
							return;
						}
						var moduleEditable = !service.getModuleReadonly();
						var managedFields = ['Value', 'ControllingUnitFk', 'Description', 'Description2', 'Result', 'ResultOc'];
						for (var index = 0; index < managedFields.length; index++) {
							var field = managedFields[index];
							var editable = moduleEditable;
							if (editable) {
								editable = service.getCellEditable(item, field);
							}
							runtimeDataService.readonly(item, [{field: field, readonly: !editable}]);
						}
					};

					service.getCellEditable = function (item, model) {
						var editable = true;
						if (!item || !item.Id) {
							return false;
						}
						if (model === 'Value') {
							editable = !!item.IsEditable;
						} else if (model === 'ControllingUnitFk') {
							editable = !!item.HasControllingUnit;
						}
						return editable;
					};

					/*//TODO WORK AROUND TO MAKE UPDATE DISPLAY DATA BINDING AFTER UPDATE
					 var mergeItemAfterSuccessfullUpdate = serviceContainer.data.mergeItemAfterSuccessfullUpdate;
					 serviceContainer.data.mergeItemAfterSuccessfullUpdate = function () {
					 mergeItemAfterSuccessfullUpdate.apply(this, arguments);
					 service.gridRefresh();
					 };*/

					//parentService.registerEntityCreated(onParentCreated);
					parentService.registerSelectionChanged(onParentSelectionChanged);
					//parentService.registerItemModified(onParentItemModified);
					//service.registerSelectionChanged(onSelectionChanged);
					//service.registerItemModified(onItemModified);

					service.getBillingSchemaDetails = function getBillingSchemaDetails(mainItem) {
						return $http.get(globals.webApiBaseUrl + 'basics/billingschema/billingschemadetail/getitems?' + 'MainItemId=' + mainItem.BillingSchemaFk)
							.then(function (res) {
								return _.filter(res.data, function (data) {
									return data.RubricCategoryFk === mainItem.RubricCategoryFk;
								});
							});
					};

					function generateStyle(item) {
						/*function transform(obj){
							var arr = [];
							for(var item in obj){
								arr.push(obj[item]);
							}
							return arr;
						}*/
						// the styles from total config
						var cssClass = '';
						if (item.IsBold) {
							cssClass += ' cm-strong ';
						}
						if (item.IsUnderline) {
							cssClass += ' cm-link '; // from \cloud.style\content\css\lib\codemirror.css
						}
						if (item.IsItalic) {
							cssClass += ' cm-em ';
						}
						// item.cssClass = styleConfigs[item.Id];
						// apply the css class to cell
						_.intersection(_.keys(item), _.keys(item))
							.map(function (field) {
								item.__rt$data = item.__rt$data || {};
								item.__rt$data.cellCss = item.__rt$data.cellCss || {};
								item.__rt$data.cellCss[field] = item.__rt$data.cellCss[field] || '';
								item.__rt$data.cellCss[field] += cssClass;
								switch (field) {
									case 'InsertedAt' :
										item.__rt$data.cellCss['__rt$data.history.insertedAt'] = '' + cssClass;
										break;
									case 'InsertedBy' :
										item.__rt$data.cellCss['__rt$data.history.insertedBy'] = '' + cssClass;
										break;
									case 'UpdatedAt' :
										item.__rt$data.cellCss['__rt$data.history.updatedAt'] = '' + cssClass;
										break;
									case 'UpdatedBy' :
										item.__rt$data.cellCss['__rt$data.history.updatedBy'] = '' + cssClass;
										break;
									default :
										break;
								}
							});
					}

					// Register update interceptor
					if (parentService.registerUpdateDataExtensionEvent) {
						parentService.registerUpdateDataExtensionEvent(function (updateData) {
							if (service.isPostHiddenItems) {
								var billingSchemaToSave = updateData.BillingSchemaToSave || [];
								billingSchemaToSave = billingSchemaToSave.concat(service.getHiddenItems());
								updateData.BillingSchemaToSave = billingSchemaToSave;
							}
						});
					}

					// Register update callback
					if (opts.onUpdateSuccessNotify) {
						opts.onUpdateSuccessNotify.register(function () {
							service.isPostHiddenItems = false;
							service.clearHiddenItems();
							service.load();
						});
					}
					service.splitHiddenItems = function (items, isPostHiddenItems) {
						service.clearHiddenItems();
						var visibleItems = [];
						if (items && items.length > 0) {
							angular.forEach(items, function (item) {
								if (item.IsHidden) {
									service.hiddenItems.push(item);
								} else {
									visibleItems.push(item);
								}
							});
						}
						service.setPostHiddenStatus(isPostHiddenItems);
						return visibleItems;
					};

					service.getHiddenItems = function () {
						return service.hiddenItems;
					};

					service.clearHiddenItems = function () {
						service.hiddenItems = [];
					};

					service.getContainerData = function () {
						return serviceContainer.data;
					};

					service.setPostHiddenStatus = function (status) {
						service.isPostHiddenItems = !!status;
					};

					service.getMergeItems = function () {
						var items = service.getList(), hiddenItems = service.getHiddenItems();
						return items.concat(hiddenItems);
					};

					return serviceContainer.service;

					//return service;
				};

				return dataServiceFac;
			}]);
})(angular);