// / <reference path="../_references.js" />

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonHeaderTextNewDataService
	 * @function
	 * @requireds procurementCommonDataServiceFactory
	 *
	 * @description Provide header text data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonHeaderTextNewDataService',
		['$http', 'procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementContextService',
			'PlatformMessenger', '$q', 'basicsCommonTextFormatConstant', 'globals', '_', 'basicsCommonReadDataInterceptor','$injector', 'platformRuntimeDataService', 'mainViewService',
			function ($http, dataServiceFactory, basicsLookupdataLookupDescriptorService, moduleContext,
				PlatformMessenger, $q, basicsCommonTextFormatConstant, globals, _, basicsCommonReadDataInterceptor,$injector, platformRuntimeDataService, mainViewService) {

				basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');
				basicsLookupdataLookupDescriptorService.loadData('PrcTextType');

				// create a new data service object
				function constructorFn(parentService) {
					// service configuration

					var serviceName = 'procurementCommonHeaderTextNewDataService';

					if (parentService && angular.isFunction(parentService.getServiceName)) {
						var parentServiceName = parentService.getServiceName();
						if (parentServiceName) {
							serviceName = 'headerTextServiceOf' + parentServiceName;
						}
					}

					var service;
					var selectedItem = null;
					var serviceContainer,
						tmpServiceInfo = {
							flatLeafItem: {
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/prcheadertext/',
									initReadData: function initReadData(readData) {
										let prcHeader = parentService.getSelected().PrcHeaderEntity;
										let mainItemId = prcHeader.Id;
										let configurationFk = serviceContainer.service.getPrcConfigurationId();
										readData.filter = '?MainItemId=' + mainItemId + '&ConfigurationFk=' + configurationFk;
									}
								},
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											let prcHeader = parentService.getSelected().PrcHeaderEntity;
											creationData.MainItemId = prcHeader.Id;
											creationData.PrcConfigFk = serviceContainer.service.getPrcConfigurationId();
										},
										incorporateDataRead: incorporateDataRead
									}
								},
								entityRole: {leaf: {itemName: 'PrcHeaderblob', parentService: parentService}},
								serviceName: serviceName,
								dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}]
							}
						};

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						overview: {
							key: moduleContext.overview.keys.headerText,
							mapper: function (item) {
								var textType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTextType'), {Id: item.PrcTexttypeFk});
								if (textType) {
									return {
										Id: textType.Id,
										Description: textType.DescriptionInfo.Translated || ''
									};
								}

							}
						},
						reload: {
							route: globals.webApiBaseUrl + 'procurement/common/prcheadertext/reload',
							initReloadData: initReloadData,
							clearHandler: function (reloadData) {
								serviceContainer.data.clearContent(serviceContainer.data);
							}
						}
					});
					function initReloadData(param, reloadArgs) {
						param.PrcHeaderId = reloadArgs.prcHeaderId;
						param.PrcConfigurationId = reloadArgs.prcConfigurationId;
						param.ProjectId = reloadArgs.projectId;
						param.IsOverride = reloadArgs.isOverride;
						if (!param.IsOverride) {
							param.HeaderTexts = service.getList();
						}
					}

					// read service from serviceContainer
					service = serviceContainer.service;

					function incorporateDataRead(responseData, data) {
						responseData.Main = responseData.Main || responseData;
						var result = data.handleReadSucceeded(responseData.Main, data, true);
						if (serviceContainer.data.itemList.length > 0) {
							var item = selectedItem && selectedItem.Id ? _.find(serviceContainer.data.itemList, {Id: selectedItem.Id}) : serviceContainer.data.itemList[0];
							data.selectionChanged.fire(null, item);
							service.setSelected(item);
						}
						selectedItem = null;
						if(mainViewService.getCurrentModuleName() === 'procurement.rfq'){
							_.forEach(responseData.Main, function (item){
								platformRuntimeDataService.readonly(item, true);
							});
						}
						return result;
					}

					// var overviewService = procurementCommonOverviewDataService.getService(parentService, moduleContext.getLeadingService());

					// var baseOnReadSucceeded = serviceContainer.data.onReadSucceeded;
					// service.prcHeader=null;
					//
					// serviceContainer.data.onReadSucceeded = function onReadSucceeded(result, data) {
					service.registerLookupFilters({
						'prc-req-header-text-prc-text-type-filter': {
							serverSide: true,
							fn: function () {
								let parentItem = parentService.getSelected();
								if (parentItem && parentItem.PrcHeaderEntity) {
									return {
										ForHeader: true,
										PrcConfiguraionFk: service.getPrcConfigurationId(parentItem.PrcHeaderEntity)
									};
								}

								return {
									ForHeader: true,
									PrcConfiguraionFk: 0
								};
							}
						}
					});

					moduleContext.getLeadingService().registerUpdateDone(function () {
						selectedItem = service.getSelected();
						if(selectedItem) {
							service.load();
						}
					});

					service.setTextMoudleValue = function setTextMoudleValue(id) {
						var defer = $q.defer();
						var entity = service.getSelected();
						if (entity) {
							var prcHeader = service.getPrcHeader();
							$http.get(globals.webApiBaseUrl + 'procurement/common/prcheadertext/prcHeaderTextEntity' + '?prcTexttypeFk=' + entity.PrcTexttypeFk + '&textMoudleFk=' + id + '&prcHeaderFk=' + prcHeader.Id).then(function (response) {

								if (response) {
									defer.resolve({
										entity: entity,
										ContentString: response.data.ContentString,
										PlainText: response.data.PlainText
									});
									return;
								}

								defer.resolve(null);
							});
						} else {
							defer.resolve(null);
						}

						return defer.promise;
					};

					service.getPrcHeader = function () {
						if (parentService.getSelected()) {
							return parentService.getSelected().PrcHeaderEntity;
						}
					};

					service.getPrcConfigurationId = function (prcHeaderEntity) {
						if (_.isFunction(parentService.getPrcConfigurationId)) {
							return parentService.getPrcConfigurationId();
						}
						let prcHeader = prcHeaderEntity || service.getPrcHeader();
						return prcHeader ? prcHeader.ConfigurationFk : -1;
					};

					service.getParentEntity= function () {
						if (parentService.getSelected()) {
							return parentService.getSelected();
						}
					};

					service.getParentStatus = function () {
						if (_.isFunction(parentService.getModuleState) && parentService.getSelected()) {
							var state = parentService.getModuleState(parentService.getSelected());
							if (state && !state.IsReadonly) {
								return true;
							}
						}
						return false;
					};

					// basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

					service.prcHeaderTextTypeChange = new PlatformMessenger();
					service.updateByTextType = updateByTextType;
					service.registerSelectionChanged(onSelectionChanged);
					service.getTextModuleList = getTextModuleList;
					service.getTextModulesByTextModuleType = getTextModulesByTextModuleType;
					if (parentService.completeItemCreated) {
						parentService.completeItemCreated.register(onPackageCreated);
					}
					basicsCommonReadDataInterceptor.init(serviceContainer.service, serviceContainer.data);
					return service;

					// ////////////////////////
					function processItem(entity) {
						entity.keepOriginalContentString = true;
						entity.keepOriginalPlainText = true;
						entity.originalContent = entity.Content;
						entity.originalContentString = entity.ContentString;
						entity.originalPlainText = entity.PlainText;

						/*
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
						*/
					}

					function revertProcessItem(entity) {
						if (entity.keepOriginalContentString) {
							entity.ContentString = entity.originalContentString;
							entity.Content = entity.originalContent;
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
						let isProject = entity.IsProject;
						const getTextModulesWithoutConfigUrl = globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextmodulesbytextmoduletype?rubricId=' + rubricId + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk + '&isProject=' + isProject;
						return $http.get(getTextModulesWithoutConfigUrl).then(function (response) {
							if (!response) {
								return;
							}
							let textModuleList = response.data;
							service.prcHeaderTextTypeChange.fire(null, {entity: entity, textModuleList: textModuleList});
							return textModuleList;
						});
					}

					function getTextModuleList(entity) {
						let configurationId = service.getPrcConfigurationId();
						let prcHeader = service.getPrcHeader();
						entity = entity || service.getSelected();

						if (!prcHeader || !configurationId || !entity) {
							return $q.when(null);
						}
						let textModuleTypeFk = entity.TextModuleTypeFk;
						let isProject = entity.IsProject;
						let url = globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/prcHeaderTextModuleList' + '?prcConfigurationFk=' + configurationId + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk + '&isProject=' + isProject;
						return $http.get(url).then(function (response) {
							if (!response) {
								return;
							}
							return response.data;
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
							promises.push(text.specification ? service.setTextMoudleValue(text.specification.Id) : $q.when(null));
							promises.push(text.html ? service.setTextMoudleValue(text.html.Id) : $q.when(null));

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

					// package created event handler for get the default create package2header.
					function onPackageCreated(e, args) {
						if (!args || !args.PrcHeaderBlob) {
							return;
						}
						service.setCreatedItems(args.PrcHeaderBlob, true);

						if (args.PrcHeaderBlob && args.PrcHeaderBlob.length > 0) {
							let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
							var updateData = modTrackServ.getModifications(service);
							if (!(updateData && updateData.PrcPackage2HeaderToSave &&
								updateData.PrcPackage2HeaderToSave[0] &&
								updateData.PrcPackage2HeaderToSave[0].PrcHeaderblobToSave &&
								updateData.PrcPackage2HeaderToSave[0].PrcHeaderblobToSave.length === args.PrcHeaderBlob.length)) {
								console.error('Header text cannot be generated automatically due to some unknown reason.');
							}
						}
					}
				}

				return dataServiceFactory.createService(constructorFn, 'procurementCommonHeaderTextNewDataService');
			}
		]);
})(angular);