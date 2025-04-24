/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.billingschema';

	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaService
	 * @function
	 *
	 * @description
	 * basicsBillingSchemaService is the main data service for all billing schema related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsBillingSchemaBillingSchemaDetailService',
		['_', 'platformDataServiceFactory', 'basicsBillingSchemaRubricCategoryService', 'basicsBillingSchemaService', 'basicsLookupdataLookupDescriptorService',
			'$q', '$http', 'basicsBillingSchemaBillingSchemaDetailValidationService', 'platformRuntimeDataService', 'platformDataServiceSelectionExtension', '$injector',
			'platformModalService', '$translate', 'basicsLookupdataLookupFilterService', 'basicsBillingSchemaBillingLineType',
			function (_, platformDataServiceFactory, basicsBillingSchemaRubricCategoryService, basicsBillingSchemaService, basicsLookupdataLookupDescriptorService,
			          $q, $http, basicsBillingSchemaBillingSchemaDetailValidationService, platformRuntimeDataService, platformDataServiceSelectionExtension, $injector,
			          platformModalService, $translate, basicsLookupdataLookupFilterService, basicsBillingSchemaBillingLineType) {
				var serviceContainer = null;
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsBillingSchemaBillingSchemaDetailService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/billingschema/billingschemadetail/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.MainItemId = -1;
								readData.RubricId = -1;
								readData.RubricCategoryId = null;

								var selectedMainItem = basicsBillingSchemaService.getSelected();
								if (basicsBillingSchemaService.isSelection(selectedMainItem)) {
									readData.MainItemId = selectedMainItem.Id;
								}

								//If the parent node have the cache data,
								// when switch to the child node, get the data from the corresponding child node cache.
								//If the child node have the cache data,
								// when switch to the parent node, get the data from the corresponding child node cache.
								//So if the node have cache, not transfer the Id to the server side.
								var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
								if (basicsBillingSchemaService.isSelection(selectedRubricItem)) {
									if (selectedRubricItem.ParentFk) {
										var parentCache = serviceContainer.data.provideCacheFor(selectedRubricItem.ParentFk, serviceContainer.data);
										if (!parentCache) {
											readData.RubricCategoryId = selectedRubricItem.RubricCategoryId;
										}
									} else {
										//If the child has the cache, not transfer the id to the server side.
										var rubricCategories = selectedRubricItem.RubricCategories;
										readData.RubricCategoryIds = [];
										if (rubricCategories && rubricCategories.length > 0) {
											for (var i = 0; i < rubricCategories.length; i++) {
												var cache = serviceContainer.data.provideCacheFor(rubricCategories[i].Id, serviceContainer.data);
												if (!cache || cache.loadedItems.length === 0) {
													readData.RubricCategoryIds.push(selectedRubricItem.RubricCategories[i].RubricCategoryId);
												}
											}
										}
									}
								}
								return readData;
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var currentRubricCategory = basicsBillingSchemaRubricCategoryService.getSelected();
									var currentBillingSchema = basicsBillingSchemaService.getSelected();
									creationData.BillingSchemaId = (currentBillingSchema) ? currentBillingSchema.Id : undefined;
									creationData.RubricCategoryId = (currentRubricCategory) ? currentRubricCategory.RubricCategoryId : undefined;
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									basicsLookupdataLookupDescriptorService.attachData(readItems);
									//Sometimes load the data from cache, sometimes load the data from the database.
									var dataList = readItems.Main ? readItems.Main : readItems;
									//If the parent node have the cache data,
									// when switch to the child node, get the data from the corresponding child node cache.
									//If the child node have the cache data,
									// when switch to the parent node, get the data from the corresponding child node cache.
									var currentRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
									if (currentRubricItem) {
										if (!currentRubricItem.RubricCategoryId) {
											var rubricCategories = currentRubricItem.RubricCategories;
											if (rubricCategories && rubricCategories.length > 0) {
												for (var i = 0; i < rubricCategories.length; i++) {
													var cache = data.provideCacheFor(rubricCategories[i].Id, data);
													if (cache) {
														var items = angular.copy(_.uniqBy(cache.loadedItems, 'Id'));
														dataList = dataList.concat(items);
													}
												}
											}
										} else {
											var childCache = data.provideCacheFor(currentRubricItem.Id, data);
											if (childCache && childCache.loadedItems && childCache.loadedItems.length > 0) {
												dataList = angular.copy(_.uniqBy(childCache.loadedItems, 'Id'));
											} else {
												var parentCache = data.provideCacheFor(currentRubricItem.ParentFk, data);
												if (parentCache) {
													var parentItems = angular.copy(_.uniqBy(parentCache.loadedItems, 'Id'));
													dataList = _.filter(parentItems, function (item) {
														return item.RubricCategoryFk === currentRubricItem.RubricCategoryId;
													});
												}
											}
										}
									}
									dataList = dataList.sort(function (a, b) {
										return a.Sorting - b.Sorting;
									});

									var list = serviceContainer.data.handleReadSucceeded(dataList, data);

									// should store to the cache when listLoaded, instead of when switching rubricCategory
									var cache0 = data.provideCacheFor(currentRubricItem.Id, data);
									if (!cache0) {
										data.storeCacheFor(currentRubricItem, data);
									}

									return list;
								},
								handleCreateSucceeded: function handleCreateSucceeded(creationData, data) { //jshint ignore: line
									//Set the Sorting field as the max value of the current list.
									var newItem = creationData,
										list = serviceContainer.service.getList(),
										newSorting = _.max(_.map(list, 'Sorting'));
									if (newSorting) {
										newItem.Sorting = newSorting + 1;
									} else {
										newItem.Sorting = 1;
									}
									// the newItem should be add to the cache immediately, so that when saved, the response data can merge data to the cache
									var rubricCatalog = basicsBillingSchemaRubricCategoryService.getSelected();
									if (rubricCatalog) {
										data.cache[rubricCatalog.Id].loadedItems.push(newItem);
									}
								}
							}
						},
						actions: {
							delete: {},
							create: 'flat',
							/* jshint -W098*/
							// eslint-disable-next-line no-unused-vars
							canCreateCallBackFunc: function (item, data) {
								return canEdit();
							},
							/* jshint -W098*/
							// eslint-disable-next-line no-unused-vars
							canDeleteCallBackFunc: function (item, data) {
								return canEdit();
							}
						},
						entityRole: {
							leaf: {
								itemName: 'BillingSchemaDetail',
								parentService: basicsBillingSchemaRubricCategoryService
							}
						},
						dataProcessor: [{processItem: processValidateItem}],
						entitySelection: {},
						translation: {
							uid: 'basicsBillingSchemaBillingSchemaDetailService',
							title: 'basics.billingschema.billingSchemaDetailListContainerTitle',
							columns: [
								{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'},
								{header: 'cloud.common.entityDescription', field: 'Description2Info'}
							],
							dtoScheme: {typeName: 'BillingSchemaDetailDto', moduleSubModule: 'Basics.BillingSchema'}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				//The LEVEL 1 container has the same tree data in the LEVEL 2 container
				//and the LEVEL 2 container always cache the data by Id
				//So we need clear the cache, when switch the item in the LEVEL 1 container.
				//Otherwise LEVEL 3 container will always load the same data.
				// eslint-disable-next-line no-unused-vars
				basicsBillingSchemaService.registerSelectionChanged(function (data) { //jshint ignore: line
					//clear cache = {rubric category id: [billing schema detail items] }
					serviceContainer.data.cache = {};

					serviceContainer.service.setList([]); //clear billing schema detail items

					//when billing schema item changed -> no rubric category selected (null) -> so no need to cache data
					//if currentParentItem not null it will continue add cache data
					serviceContainer.data.currentParentItem = null;

					removeAndLoadLookup();
				});

				//Override this data, because the rubric node need show all the data of rubric category node.
				//In order to synchronize the parent data and child data.(New,Delete and update)
				serviceContainer.data.doReadData = function doReadData(data) {
					data.listLoadStarted.fire();
					if (data.usesCache && data.currentParentItem && data.currentParentItem.Id && data.currentParentItem.RubricCategoryId) {
						var cache = data.provideCacheFor(data.currentParentItem.Id, data);
						if (cache) {
							var Items = angular.copy(_.uniqBy(cache.loadedItems, 'Id'));
							return $q.when(data.onReadSucceeded(Items, data));
						}
					}

					var readData = {};
					if (data.initReadData) {
						data.initReadData(readData, data);
					}

					return serviceContainer.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
				};

				//When it is a rubric node not allow Add and Delete.
				function canEdit() {
					var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
					return selectedRubricItem !== null && selectedRubricItem.RubricCategoryId !== null;
				}

				function processValidateItem(item) {
					var validator = basicsBillingSchemaBillingSchemaDetailValidationService(serviceContainer.service);
					platformRuntimeDataService.applyValidationResult(validator.validateBillingLineTypeFk(item, item.BillingLineTypeFk, 'BillingLineTypeFk', true), item, 'BillingLineTypeFk');
					platformRuntimeDataService.applyValidationResult(validator.validateFactor(item, item.Factor, 'Factor', true), item, 'Factor');
				}


				function removeAndLoadLookup() {
					basicsLookupdataLookupDescriptorService.removeData('billingSchemas');//when switch billingSchema then remove it
					var selectedMainItem = basicsBillingSchemaService.getSelected();
					if (selectedMainItem && selectedMainItem.Id) {
						$http.get(globals.webApiBaseUrl + 'basics/billingschema/billingschemadetail/getitems?' + 'MainItemId=' + selectedMainItem.Id)
							.then(function (res) {
								basicsLookupdataLookupDescriptorService.updateData('billingSchemas', res.data);//collect currenct selected billingSchema's detail
								return res;
							});
					}
				}

				serviceContainer.service.getListByMainId = function () {
					var rubricItemList = basicsBillingSchemaRubricCategoryService.getList();
					var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
					var dataList = serviceContainer.service.getList() || [];
					var categoryIds = [];

					//get cache data
					if (selectedRubricItem.ParentFk) {//deal with child
						//do not contains root rubric and  current selected rubric
						var childRubricItems = _.filter(rubricItemList, function (item) {
							if (item.RubricId === selectedRubricItem.RubricId && !!item.ParentFk) {
								categoryIds.push(item.RubricCategoryId);
								return item.Id !== selectedRubricItem.Id;
							}
							return false;
						});
						_.forEach(childRubricItems, function (item) {
							var cache = serviceContainer.data.provideCacheFor(item.Id, serviceContainer.data);
							if (cache) {
								dataList = dataList.concat(cache.loadedItems);
							}
						});
					}

					//get lookup data
					var lookupBillingSchemas = basicsLookupdataLookupDescriptorService.getData('billingSchemas');
					var billingSchemas = _.filter(lookupBillingSchemas, function (item) {
						return categoryIds.indexOf(item.RubricCategoryFk) !== -1;
					});

					//merge cacheData to lookup //refresh
					dataList.forEach(function (item) {
						var index = _.findIndex(billingSchemas, {Id: item.Id});
						if (index !== -1) {
							billingSchemas[index] = item;
						} else {
							billingSchemas.push(item);
						}
					});

					basicsLookupdataLookupDescriptorService.updateData('billingSchemas', billingSchemas);
					return $q.when({data: billingSchemas});
				};

				var basicDeleteItem = serviceContainer.service.deleteItem;
				serviceContainer.service.deleteItem = function () {
					//remove item from billingSchemas Lookup
					var lookupBillingSchemas = basicsLookupdataLookupDescriptorService.getData('billingSchemas');
					if (lookupBillingSchemas) {
						if (Object.hasOwnProperty.call(lookupBillingSchemas, arguments[0].Id)) {
							delete lookupBillingSchemas[arguments[0].Id];
						}
					}
					var deleteParamsIndex = serviceContainer.data.itemList.indexOf(arguments[0]);
					basicDeleteItem.apply(serviceContainer.service, arguments);
					platformDataServiceSelectionExtension.doSelectCloseTo(deleteParamsIndex, serviceContainer.data);
				};

				serviceContainer.service.disableDeepCopy = function disableDeepCopy() {
					var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
					var selectedEntities = basicsBillingSchemaRubricCategoryService.getSelectedEntities();
					var detailList = serviceContainer.service.getList();

					if (selectedEntities && selectedEntities.length > 1) {
						return true;
					}

					if (detailList === null || detailList.length === 0) {
						return true;
					}

					if (basicsBillingSchemaService.isSelection(selectedRubricItem)) {
						if (selectedRubricItem.ParentFk) {
							return false;
						}
					}

					return true;
				};

				function provideDeepCopyDialogConfig() {
					var modalOptions = {
						headerText: 'Deep Copy Billing Schema',
						bodyText: 'Select Target Billing Schema Header:',
						showYesButton: true,
						showNoButton: true,
						iconClass: 'warning',
						backdrop: false,
						resizeable: false,
						yesBtnText: 'OK',
						noBtnText: 'Cancel',
						templateUrl: globals.appBaseUrl + 'basics.billingschema/partials/basics-billingschema-billing-schema-detail-deep-copy-dialog.html'
					};

					return modalOptions;
				}

				serviceContainer.service.showDialog = function (func, customConfig) {
					var platformDialogService = $injector.get('platformDialogService');
					var config = provideDeepCopyDialogConfig();
					if (customConfig) {
						angular.extend(config, customConfig);
					}
					return platformDialogService.showDialog(config).then(func);
				};

				function isValidForDeepCopy() {
					var detailList = serviceContainer.service.getList();
					if (detailList === null || detailList.length === 0) {
						var message = 'Cannot find any records to deep copy.Please check the selected rubric category.';
						showMessage(message);
						return false;
					}
					var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
					if (basicsBillingSchemaService.isSelection(selectedRubricItem)) {
						if (!selectedRubricItem.ParentFk) {
							var message = 'Please select a rubric category to do deep copy.';
							showMessage(message);
							return false;
						}
					}

					return true;
				}

				serviceContainer.service.copyPaste = function copyPaste() {
					if (!isValidForDeepCopy()) {
						return;
					}

					var action = function (result) {
						if (result && result.yes) {
							deepcopy(result.targetBillingSchemaId);
						}
					};

					basicsBillingSchemaService.updateAndExecute(function () {
						serviceContainer.service.showDialog(action);
					});
				};

				function showMessage(message, headerText) {
					return platformModalService.showDialog({
						headerTextKey: headerText || 'Deep copy',
						bodyTextKey: $translate.instant(message),
						iconClass: 'ico-info'
					});
				}

				serviceContainer.service.showMessage = showMessage;

				serviceContainer.service.getAvailableBillingSchemaForDeepCopy = function (rubricCategoryId) {
					return $http.get(globals.webApiBaseUrl + 'basics/billingschema/deepcopy/available?rubricCategoryId=' + rubricCategoryId)
						.then(function (response) {
							return response.data;
						});
				};

				serviceContainer.service.getLine28EntityByMinId = function () {
					let minFactorEntity = null;
					let list = _.filter(this.getList(), {BillingLineTypeFk: basicsBillingSchemaBillingLineType.advances});
					if (list && list.length > 0) {
						minFactorEntity = _.min(list, 'Id');
					}
					return minFactorEntity;
				}

				serviceContainer.service.setFactorReadOnly = function (entity) {
					let minFactor = this.getLine28EntityByMinId();
					let isReadOnly = true;
					if (entity.BillingLineTypeFk === basicsBillingSchemaBillingLineType.advances && minFactor && minFactor.Id >= entity.Id) {
						isReadOnly = false;
					}
					platformRuntimeDataService.readonly(entity, [{field: 'Factor', readonly: isReadOnly}])

					this.gridRefresh();
				}

				function deepcopy(targetBillingSchemaId) {
					var selected = serviceContainer.service.getSelected();
					var selectedMainItem = basicsBillingSchemaService.getSelected();
					var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
					var rubricCategorId;
					if (selectedRubricItem.ParentFk) {
						rubricCategorId = selectedRubricItem.RubricCategoryId;
					}

					var requestParam = {
						BillingSchemaId: selectedMainItem.Id,
						RubricCategoryId: rubricCategorId,
						TargetBillingSchemaId: targetBillingSchemaId
					};
					$http.post(globals.webApiBaseUrl + 'basics/billingschema/billingschemadetail/deepcopy', requestParam)
						.then(function (response) {
								if (response && response.status === 200) {
									var billingSchemaList = basicsBillingSchemaService.getList();
									var targetBillingSchema = _.filter(billingSchemaList, function (item) {
										return item.Id === response.data;
									});

									var description;
									if (targetBillingSchema && targetBillingSchema[0]) {
										description = targetBillingSchema[0].Description || '';
									}
									var message = 'Deep copy for target billing schema ' + description + ' Successfully.';
									showMessage(message);
								}
							},
							function (error) {
								error = error || '';
								var message = 'Deep copy failed' + error + '.';
								showMessage(message);
							});
				}

				basicsLookupdataLookupFilterService.registerFilter([
					{
						key: 'basics-billingschema-billing-line-type-filter',
						fn: function (item) {
							var selectedRubricItem = basicsBillingSchemaRubricCategoryService.getSelected();
							if (selectedRubricItem.RubricId === 27) {	// pes
								return [1, 3, 4, 5, 6, 8, 10, 11, 17, 18, 29].indexOf(item.Id) !== -1;
							} else if (selectedRubricItem.RubricId === 26) { // contract
								return [1, 3, 4, 5, 6, 8, 10, 11, 12, 17, 18, 19, 29].indexOf(item.Id) !== -1;
							} else if (selectedRubricItem.RubricId === 25) { // quotation
								return [1, 3, 4, 5, 6, 8, 10, 11, 12, 17, 18, 19, 29].indexOf(item.Id) !== -1;
							}
							return true;
						}
					}
				]);

				return serviceContainer.service;
			}]);
})(angular);