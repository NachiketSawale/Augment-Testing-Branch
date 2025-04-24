(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonItemTextNewDataService',
		['$q', '$http', 'procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementContextService', '$translate', 'platformToolbarService',
			'basicsCommonTextFormatConstant', '_', 'PlatformMessenger', 'globals','platformRuntimeDataService',
			function ($q, $http, dataServiceFactory, basicsLookupdataLookupDescriptorService, moduleContext, $translate, platformToolbarService,
				basicsCommonTextFormatConstant, _, PlatformMessenger, globals,platformRuntimeDataService) {

				basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

				// create a new data service object
				function constructorFn(parentService) {
					// service configuration
					var serviceName = 'procurementCommonItemTextNewDataService';

					if (parentService && angular.isFunction(parentService.getServiceName)) {
						var parentServiceName = parentService.getServiceName();
						if (parentServiceName) {
							serviceName = 'itemTextServiceOf' + parentServiceName;
						}
					}
					var canItemTypeEdit;
					var serviceContainer,
						serviceOptions = {
							flatLeafItem: {
								serviceName: serviceName,
								httpCRUD: {
									usePostForRead: true,
									endRead: 'lists',
									route: globals.webApiBaseUrl + 'procurement/common/prcitemtext/',
									initReadData: function initReadData(readData) {
										// var param = [];
										let paraList = parentService.getList();
										readData.configurationFk = serviceContainer.service.getPrcConfigurationId();
										readData.mainItemIds = _.map(paraList, 'Id');
									}
								},
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											creationData.MainItemId = parentService.getSelected().Id;
											creationData.PrcConfigFk = serviceContainer.service.getPrcConfigurationId();
										}
									}
								},
								entityRole: {leaf: {itemName: 'PrcItemblob', parentService: parentService}},
								dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}]
							}
						};
					serviceContainer = dataServiceFactory.createNewComplete(serviceOptions, {
						onUpdateDone: function () {

						},
						overview: {
							key: moduleContext.overview.keys.itemText,
							mapper: function (item) {
								var textType = _.find(basicsLookupdataLookupDescriptorService.getData('Configuration2TextType'), {Id: item.PrcTexttypeFk}) || {};
								return {
									Id: textType.Id,
									Description: textType.Description || ''
								};
							}
						}
					}, parentService);

					canItemTypeEdit = function () {
						var parentItem = parentService.getSelected();
						if (parentItem) {
							let itemTypeFk = parentItem.BasItemTypeFk;
							if (itemTypeFk === 7) {
								setTimeout(()=>{$($('#ui-layout-east').find('.ql-editor')).attr('contenteditable', false);},200);
								return false;
							} else {
								return true;
							}
						}
						return false;
					};
					// read service from serviceContainer
					var service = serviceContainer.service;
					var mainService = moduleContext.getMainService();
					service.textTypeChanged = new PlatformMessenger();
					service.updateToolsEvent = new PlatformMessenger();
					service.registerLookupFilters({
						'prc-req-item-text-prc-text-type-filter': {
							serverSide: true,
							fn: function () {
								let currentItem = moduleContext.getMainService().getSelected();
								if (!currentItem) {
									return '';
								}
								let prcHeader = currentItem.PrcHeaderEntity;
								if (prcHeader) {
									let itemService = moduleContext.getItemDataService();
									return {
										ForItem: true,
										PrcConfiguraionFk: itemService && _.isFunction(itemService.getPrcConfigurationId) ? itemService.getPrcConfigurationId() : prcHeader.ConfigurationFk
									};
								}

								return {
									ForItem: true,
									PrcConfiguraionFk: 0
								};
							}
						}
					}
					);
					var baseOnCreateSucceeded = serviceContainer.data.onCreateSucceeded;
					serviceContainer.data.onCreateSucceeded = function onCreateSucceeded(newData, data, creationData) {
						baseOnCreateSucceeded(newData, data, creationData);
						service.setSelected(newData);
					};

					var isStoreInCache = false;
					var cacheOperation = function storeCacheFor(key, valueList) {
						var itemCache = serviceContainer.data.cache[key];

						if (!itemCache) {
							itemCache = {
								loadedItems: [],
								selectedItems: [],
								modifiedItems: [],
								deletedItems: []
							};
						}

						serviceContainer.data.cache[key] = itemCache;

						angular.forEach(valueList, function (item) {
							if (item.PrcItemFk === key) {
								itemCache.loadedItems.push(item);
							}
						});
					};
					var baseOnReadSucceeded = serviceContainer.data.onReadSucceeded;
					serviceContainer.data.onReadSucceeded = function onReadSucceeded(result, data) {
						var parentSel = parentService.getSelected();
						if (parentSel === null) {
							return;
						}
						if (!isStoreInCache) {
							isStoreInCache = true;
							cacheOperation(parentSel.Id);
							var parentIdList = _.map(parentService.getList(), 'Id');
							_.forEach(parentIdList, function (id) {
								cacheOperation(id, result.Main);
							});
						}

						var itemTextToDis = _.filter(result.Main || result, function (item) {
							return item.PrcItemFk === parentSel.Id;
						});
						var readResult = baseOnReadSucceeded(itemTextToDis, data);

						serviceContainer.service.goToFirst();
						return readResult;
					};
					var makeUniqueItemTextList;
					service.getListForOverView = function () {
						var parentSel = parentService.getSelected();
						var cache = serviceContainer.data.cache;
						var itemTextList = [];
						_.forEach(cache, function (item) {
							if (item && item.loadedItems) {
								_.forEach(item.loadedItems, function (type) {
									itemTextList.push(type);
								});
							}
						});
						// When overview add itemText
						if (cache[parentSel.Id] && service.getList().length > cache[parentSel.Id].loadedItems.length) {
							itemTextList.push(service.getSelected());
							return makeUniqueItemTextList(itemTextList);
						} else {
							// When overview modify or delete itemText
							return makeUniqueItemTextList(itemTextList);
						}
					};
					makeUniqueItemTextList = function makeUniqueItemTextList(itemTextList) {
						var resList = [];
						_.forEach(itemTextList, function (item) {
							if (item && item.PrcTexttypeFk) {
								if (resList.length === 0 && item.PrcTexttypeFk !== 0) {
									resList.push(item);
								} else {
									var hasItem = false;
									_.forEach(resList, function (resList) {
										if (resList.PrcTexttypeFk === item.PrcTexttypeFk) {
											hasItem = true;
										}
									});
									if (!hasItem && item.PrcTexttypeFk !== 0) {
										resList.push(item);
									}
								}
							}
						});
						return resList;
					};
					service.registerEntityCreated(function () {
						parentService.updateItemTextStatus(service.getList());
					});
					// override onDeleteDone
					// var onDeleteDone = serviceContainer.data.onDeleteDone;
					// serviceContainer.data.onDeleteDone = function onDeleteDoneInList() {
					// onDeleteDone.apply(serviceContainer.data, arguments);
					// parentService.updateItemTextStatus(serviceContainer.service.getList());
					// };

					// (e=>null, deletedItems=>all deleted items)
					// replace the logic of onDeleteDone, done by stone.
					var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
						parentService.updateItemTextStatus(serviceContainer.service.getList());
					};
					serviceContainer.service.registerEntityDeleted(onEntityDeleted);
					serviceContainer.service.getTextModuleList = getTextModuleList;

					function getTextModuleList(entity) {
						let prcHeader = service.getPrcHeader();
						entity = entity || service.getSelected();
						if (!prcHeader || !entity) {
							return $q.when(null);
						}
						let configurationId = service.getPrcConfigurationId();
						let textModuleTypeFk = entity.TextModuleTypeFk;
						return $http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/getTextModuleList' + '?prcConfigurationFk=' + configurationId + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk)
							.then(function (response) {
								if (!response) {
									return;
								}
								return response.data;
							});
					}

					function getBlobAndClobString(blobsFk, clobsFk) {
						return $http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobandclobstring' + '?blobId=' + blobsFk + '&clobId=' + clobsFk);
					}

					service.setTextMoudleValue = function setTextMoudleValue(textModule) {
						var blobsFk = !_.isNil(textModule.BasBlobsFk) ? textModule.BasBlobsFk : -1;
						var clobsFk = !_.isNil(textModule.BasClobsFk) ? textModule.BasClobsFk : -1;
						return getBlobAndClobString(blobsFk, clobsFk).then(function (response) {
							if (response && response.data) {
								var textModuleString = response.data;
								var textFormatFk = generateTextFormatFk(textModule);
								var contentString = textModuleString.BlobStringDto && textFormatFk === basicsCommonTextFormatConstant.specification ? textModuleString.BlobStringDto.Content : null;
								var plainText = textModuleString.ClobStringDto && textFormatFk === basicsCommonTextFormatConstant.html ? textModuleString.ClobStringDto.Content : null;
								return {
									ContentString: contentString,
									PlainText: plainText
								};
							}
							return null;
						});
					};

					function generateTextFormatFk(textModule) {
						if (!textModule) {
							// regard it as specification.
							return basicsCommonTextFormatConstant.specification;
						}
						var textFormatFk = textModule.TextFormatFk;
						if (textFormatFk !== null) {
							return textFormatFk;
						} else if (textModule.BasClobsFk && !textModule.BasBlobsFk) {
							return basicsCommonTextFormatConstant.html;
						} else {
							return basicsCommonTextFormatConstant.specification;
						}
					}

					service.getPrcHeader = function () {
						let prcHeader = parentService.getSelectedPrcHeader();
						if (prcHeader) {
							return prcHeader.PrcHeaderEntity;
						} else {
							return null;
						}
					};

					service.getPrcConfigurationId = function (prcHeaderEntity) {
						if (_.isFunction(parentService.getPrcConfigurationId)) {
							return parentService.getPrcConfigurationId();
						}
						let prcHeader = prcHeaderEntity || service.getPrcHeader();
						return prcHeader ? (prcHeader.ConfigurationFk || prcHeader.PrcConfigurationFk) : -1;
					};

					serviceContainer.service.mergeUpdatedDataInCache = function mergeUpdatedDataInCache(updateData, data) {
						if (data.provideCacheFor) {
							var cache = data.provideCacheFor(updateData.MainItemId, data);
							var items;

							if (cache && cache.loadedItems.length) {
								items = cache.loadedItems;
								cache.modifiedItems.length = 0;
								cache.deletedItems.length = 0;
							} else {
								items = data.itemList;
							}

							if (items && items.length) {
								var updates = updateData[data.itemName + 'ToSave'];
								_.forEach(updates, function (updated) {
									var oldItem = _.find(items, {Id: updated.Id});
									if (oldItem) {
										data.mergeItemAfterSuccessfullUpdate(oldItem, updated, true, data);
									}
								});
							}
						} else {
							_.forEach(updateData[data.itemName + 'ToSave'], function (updateItem) {
								var oldItem = service.findItemToMerge(updateItem);
								if (oldItem) {
									data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
								}
							});
						}

					};

					service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
						let columns = Object.keys(entity);
						_.forEach(columns, (item) => {
							if(itemTypeFk=== 7){
								platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
							}else{
								platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
							}
						});
					};

					var canCreate = service.canCreate;
					service.canCreate = function () {
						return canCreate() && canItemTypeEdit();
					};
					var canDelete = service.canDelete;
					service.canDelete = function () {
						return canDelete() && canItemTypeEdit();
					};

					service.registerSelectionChanged(onSelectionChanged);
					service.updateByTextType = updateByTextType;
					service.getTextModulesByTextModuleType = getTextModulesByTextModuleType;
					if (mainService.configurationChanged) {
						mainService.configurationChanged.register(onHeaderConfigurationChanged);
					}
					return service;

					// ////////////////////////
					function processItem(entity) {
						entity.keepOriginalContentString = true;
						entity.keepOriginalPlainText = true;
						entity.originalContent = entity.Content;
						entity.originalContentString = entity.ContentString;
						entity.originalPlainText = entity.PlainText;

						if (entity.TextFormatFk === basicsCommonTextFormatConstant.specification) {
							entity.PlainText = null;
						} else if (entity.TextFormatFk === basicsCommonTextFormatConstant.html) {
							entity.Content = null;
							entity.ContentString = null;
						} else if (entity.TextFormatFk === basicsCommonTextFormatConstant.hyperlink) {
							entity.Content = null;
							entity.ContentString = null;
							entity.PlainText = null;
						}
					}

					function revertProcessItem(entity) {
						if (entity.keepOriginalContentString) {
							entity.Content = entity.originalContent;
							entity.ContentString = entity.originalContentString;
						}

						if (entity.keepOriginalPlainText) {
							entity.PlainText = entity.originalPlainText;
						}

						entity.keepOriginalContentString = true;
						entity.keepOriginalPlainText = true;
						entity.originalContent = entity.Content;
						entity.originalContentString = entity.ContentString;
						entity.originalPlainText = entity.PlainText;
					}

					function onSelectionChanged() {
						getTextModulesByTextModuleType();
					}

					function getTextModulesByTextModuleType(entity) {
						let rubricId = parentService.getRubricId ? parentService.getRubricId() : null;
						entity = entity || service.getSelected();
						if (!entity || !rubricId) {
							return $q.when(null);
						}

						let textModuleTypeFk = entity.TextModuleTypeFk;
						let isProject = false;
						const getTextModulesWithoutConfigUrl = globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextmodulesbytextmoduletype?rubricId=' + rubricId + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk + '&isProject=' + isProject;
						return $http.get(getTextModulesWithoutConfigUrl).then(function (response) {
							if (!response) {
								return;
							}
							let textModuleList = response.data;
							service.textTypeChanged.fire(null, {entity: entity, textModuleList: textModuleList});
							return textModuleList;
						});
					}

					function updateByTextType(entity, needUpdateText) {
						entity = entity || service.getSelected();
						getTextModuleList(entity).then(function (list) {
							if (!entity || !needUpdateText) {
								return;
							}
							if (!angular.isArray(list)) {
								entity.Content = null;
								entity.ContentString = null;
								entity.PlainText = null;
								return;
							}
							var textModules = _.filter(list, {PrcTextTypeFk: entity.PrcTexttypeFk});
							if (!angular.isArray(textModules) || textModules.length === 0) {
								entity.Content = null;
								entity.ContentString = null;
								entity.PlainText = null;
								return;
							}

							var text = {};
							_.forEach(textModules, function (item) {
								if (((entity.TextFormatFk === basicsCommonTextFormatConstant.specification ||
									entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) &&
									Object.prototype.hasOwnProperty.call(text,'specification')) &&
									((entity.TextFormatFk === basicsCommonTextFormatConstant.html ||
										entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) &&
										Object.prototype.hasOwnProperty.call(text,'html'))) {
									return;
								}

								if (!item.IsDefault) {
									return;
								}

								var textModuleTextFormat = null;
								if (item.TextFormatFk) {
									textModuleTextFormat = item.TextFormatFk;
								} else {
									if (item.BasBlobsFk) {
										textModuleTextFormat = basicsCommonTextFormatConstant.specification;
									} else if (!item.BasBlobsFk && item.BasClobsFk) {
										textModuleTextFormat = basicsCommonTextFormatConstant.html;
									}
								}
								if (textModuleTextFormat === basicsCommonTextFormatConstant.specification && !Object.prototype.hasOwnProperty.call(text,'specification')) {
									text.specification = item;
								} else if (textModuleTextFormat === basicsCommonTextFormatConstant.html && !Object.prototype.hasOwnProperty.call(text,'html')) {
									text.html = item;
								}
							});

							// eslint-disable-next-line no-unused-vars
							var oldContentString = entity.ContentString;
							// eslint-disable-next-line no-unused-vars
							var oldPlainText = entity.PlainText;

							var promises = [];
							promises.push(text.specification ? service.setTextMoudleValue(text.specification) : $q.when(null));
							promises.push(text.html ? service.setTextMoudleValue(text.html) : $q.when(null));

							var updateFormat = 0;
							if (promises.length > 0) {
								$q.all(promises)
									.then(function (results) {
										if (!angular.isArray(results)) {
											return;
										}
										var text4Spec = results[0] ? results[0].ContentString : null;
										var text4Html = results[1] ? results[1].PlainText : null;

										if (text4Spec) {
											updateFormat = 1;
											if (text4Spec !== entity.ContentString) {
												entity.ContentString = text4Spec;
											}
										}

										if (text4Html) {
											updateFormat += 2;
											if (text4Html !== entity.PlainText) {
												entity.PlainText = text4Html;
											}
										}

										if (updateFormat === 1) {
											if (angular.isString(entity.PlainText)) {
												entity.PlainText = null;
											}
										} else if (updateFormat === 2) {
											if (angular.isString(entity.ContentString)) {
												entity.Content = null;
												entity.ContentString = null;
											}
										} else if (updateFormat === 0) {
											entity.Content = null;
											entity.ContentString = null;
											entity.PlainText = null;
										}
									});
							}
						});
					}

					function onHeaderConfigurationChanged() {
						service.load();
					}
				}

				return dataServiceFactory.createService(constructorFn, 'procurementCommonItemTextNewDataService');
			}]);
})(angular);