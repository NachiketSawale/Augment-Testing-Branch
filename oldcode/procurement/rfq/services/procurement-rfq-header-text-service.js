/**
 * Created by wui on 3/6/2019.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.rfq';
	/** @namespace parentService.headerTextArray */
	/** @namespace headerStatus.IsAdvertised */
	/**
	 * @ngdoc service
	 * @name procurementRfqHeaderTextService
	 * @function
	 * @requireds procurementCommonDataServiceFactory
	 *
	 * @description Provide header text data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementRfqHeaderTextService', [
		'$http',
		'procurementCommonDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'procurementRfqMainService',
		'$q',
		'basicsCommonTextFormatConstant',
		'globals',
		'_',
		'PlatformMessenger',
		function ($http,
			dataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			parentService,
			$q,
			basicsCommonTextFormatConstant,
			globals,
			_,
			PlatformMessenger) {

			basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');
			basicsLookupdataLookupDescriptorService.loadData('PrcTextType');

			var selectedItem = null;
			// service configuration
			var serviceContainer,
				tmpServiceInfo = {
					flatLeafItem: {
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/rfq/blob/',
							endCreate: 'createnew',
							initReadData: function initReadData(readData) {
								var parent = parentService.getSelected();
								readData.filter = '?mainItemId=' + parent.Id + '&configurationFk=' + parent.PrcConfigurationFk;
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var parent = parentService.getSelected();
									creationData.RfqHeaderId = parent.Id;
									creationData.PrcConfigurationId = parent.PrcConfigurationFk;
								}
							}
						},
						entityRole: {leaf: {itemName: 'RfqHeaderblob', parentService: parentService}},
						dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}]
					}
				};

			serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
				reload: {
					route: globals.webApiBaseUrl + 'procurement/rfq/blob/reload',
					initReloadData: initReloadData,
					clearHandler: function (reloadData) {
						var list = serviceContainer.service.getList();
						var newList = reloadData.Main;

						angular.forEach(list, function (item) {
							if (newList && newList.length) {
								if (!newList.some(function (newItem) {
									return newItem.Id === item.Id;
								})) {
									serviceContainer.data.deleteItem(item, serviceContainer.data);
								}
							} else {
								serviceContainer.data.deleteItem(item, serviceContainer.data);
							}
						});

						list.length = 0;
					}
				}
			});

			// read service from serviceContainers
			var service = serviceContainer.service;

			function initReloadData(param, reloadArgs) {
				param.RfqHeaderId = reloadArgs.rfqHeaderId;
				param.PrcConfigurationId = reloadArgs.prcConfigurationId;
				param.ProjectId = reloadArgs.projectId;
				param.IsOverride = reloadArgs.isOverride;
				if (!param.IsOverride) {
					param.HeaderTexts = service.getList();
				}
			}

			var baseOnReadSucceeded = serviceContainer.data.onReadSucceeded;
			service.prcHeader = null;

			serviceContainer.data.onReadSucceeded = function onReadSucceeded(result, data) {
				if (!parentService.getSelected()) { // deal with the error in console
					return [];
				}
				service.prcHeader = parentService.getSelected().PrcHeaderEntity;
				if (parentService.CreateHandle === true && parentService.headerTextArray && parentService.headerTextArray.length > 0) {
					_.forEach(parentService.headerTextArray, function (item) {
						result.Main.push(item);
					});
					service.setList(parentService.headerTextArray);
					parentService.headerTextArray.length = 0;
				}
				parentService.CreateHandle = false;
				var readResult = baseOnReadSucceeded(result, data);
				var item = selectedItem && selectedItem.Id && _.find(data.itemList, {Id: selectedItem.Id});
				if (item) {
					service.setSelected(item);
				} else {
					serviceContainer.service.goToFirst();
				}
				selectedItem = null;
				service.gridRefresh();

				return readResult;
			};

			service.registerLookupFilters({
				'prc-rfq-header-text-prc-text-type-filter': {
					serverSide: true,
					fn: function () {
						var parentItem = parentService.getSelected();

						if (parentItem) {
							return {
								ForHeader: true,
								PrcConfiguraionFk: parentItem.PrcConfigurationFk
							};
						}

						return {
							ForHeader: true,
							PrcConfiguraionFk: 0
						};
					}
				}
			});

			service.setTextMoudleValue = function setTextMoudleValue(id) {
				var defer = $q.defer();
				var entity = service.getSelected();
				if (entity) {
					$http.get(globals.webApiBaseUrl + 'procurement/common/prcheadertext/prcHeaderTextEntity' + '?prcTexttypeFk=' + entity.PrcTexttypeFk + '&textMoudleFk=' + id + '&prcHeaderFk=' + (service.prcHeader || {Id: 0}).Id).then(function (response) {

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

			service.getConfigurationFk = function () {
				var rfqHeader = parentService.getSelected();
				return rfqHeader ? rfqHeader.PrcConfigurationFk : null;
			};

			parentService.registerUpdateDone(function () {
				selectedItem = service.getSelected();
				service.load();
			});

			service.canDelete = function canDelete() {
				if (service.getList().length <= 0) {
					return false;
				}
				return !isReadonlyByParentStatus();
			};

			service.canCreate = function canCreate() {
				var rfqItem = parentService.getSelected();
				if (!rfqItem || angular.isUndefined(rfqItem.Id)) {
					return false;
				}
				return !isReadonlyByParentStatus();
			};

			function isReadonlyByParentStatus() {
				var readonly = false;
				var header = parentService.getSelected();
				if (header.RfqHeaderFk) {
					readonly = true;
				}

				var headerStatus = parentService.getStatus();
				if (!headerStatus || headerStatus.IsReadonly || headerStatus.IsAdvertised || headerStatus.IsQuoted) {
					readonly = true;
				}
				return readonly;
			}

			service.getTextModuleList = getTextModuleList;
			service.prcHeaderTextTypeChange = new PlatformMessenger();
			service.updateByTextType = updateByTextType;
			service.registerSelectionChanged(onSelectionChanged);
			service.getTextModulesByTextModuleType = getTextModulesByTextModuleType;

			return service;

			// //////////////////////////

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
				var prcConfigurationFk = service.getConfigurationFk();
				entity = entity || service.getSelected();
				if (!prcConfigurationFk || !entity) {
					return $q.when(null);
				}

				let textModuleTypeFk = entity.TextModuleTypeFk;
				let isProject = entity.IsProject;
				return $http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/prcHeaderTextModuleList' + '?prcConfigurationFk=' + prcConfigurationFk + '&prcTextTypeFk=' + entity.PrcTexttypeFk + '&textModuleTypeFk=' + textModuleTypeFk + '&isProject=' + isProject)
					.then(function (response) {
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
						if (((entity.TextFormatFk === basicsCommonTextFormatConstant.specification || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) && Object.prototype.hasOwnProperty.call(text, 'specification')) &&
								((entity.TextFormatFk === basicsCommonTextFormatConstant.html || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) && Object.prototype.hasOwnProperty.call(text, 'html'))) {
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

						if (textModuleTextFormat === basicsCommonTextFormatConstant.specification && !Object.prototype.hasOwnProperty.call(text, 'specification')) {
							text.specification = item;
						} else if (textModuleTextFormat === basicsCommonTextFormatConstant.html && !Object.prototype.hasOwnProperty.call(text, 'html')) {
							text.html = item;
						}
					});

					// var oldContentString = entity.ContentString;
					// var oldPlainText = entity.PlainText;

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
		}
	]
	);
})(angular);
