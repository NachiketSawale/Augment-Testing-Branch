/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceSummaryConfigDataService',
		['_','$q', '$http', '$translate', 'PlatformMessenger', 'platformRuntimeDataService', 'platformDataServiceModificationTrackingExtension', 'estimateMainService', 'platformModalService', 'projectMainSidebarWizardService',
			function (_, $q, $http, $translate, PlatformMessenger, platformRuntimeDataService, platformDataServiceModificationTrackingExtension, estimateMainService, platformModalService, projectMainSidebarWizardService) {

				let service = {}, configId = null, configdata = [], selectedItemPath = {}, defaultCombineSetting = [], selectedConfig = {};

				// original data(set this data after data load)
				let originalData = [];

				let defaultSystemConfigId ={
					onlyCostCodes: 1,
					onlyMaterials: 2
				};

				service.onSelectedTypeChanged = new PlatformMessenger();
				service.onConfigItemCreated = new PlatformMessenger();
				service.onConfigSelectedItemChanged = new PlatformMessenger();
				service.onConfigDeleted = new PlatformMessenger();
				service.onAfterSaved = new PlatformMessenger();
				service.onToolsUpdated = new PlatformMessenger();

				service.createItem = function () {
					let itemPath = selectedItemPath.Id;
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'estimate/main/resources/summary/createsummaryconfig?itemPath=' + itemPath
					});
				};

				function createNewCombine() {
					let configId = selectedConfig.Id;
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'estimate/main/resources/summary/createcummarycombine?configId=' + configId
					});
				}

				service.createNewItem = function () {
					return service.createItem().then(function (result) {
						if(result.data) {
							configdata.push(result.data);
							return configdata;
						}
						return $q.when(configdata);
					});
				};

				service.addNewConfig = function (newcofig) {
					configdata.push(newcofig);
				};

				service.createNewCombineItem = function () {
					let config = _.find(configdata, function (item) {
						return item.Id === selectedConfig.Id;
					});
					if (config) {
						if (!config.EstResSummaryCombineEntities) {
							config.EstResSummaryCombineEntities = [];
						}
						return createNewCombine().then(function (result) {
							if (result.data) {
								config.EstResSummaryCombineEntities.push(result.data);
								return result.data;
							}
							return $q.when(null);
						});
					}
					return $q.when(null);
				};

				service.getItems = function getItems() {
					return configdata;
				};

				service.loadData = function loadData() {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'estimate/main/resources/summary/getallresoucesummaryconfig'
					}).then(function (result) {
						if(result && result.data) {
							configdata = result.data.ConfigData;
							defaultCombineSetting = result.data.DefaultSetting;
						}

						_.forEach(configdata, function (item) {
							if(service.isDefaultSystemConfiguration(item)){
								item.DescriptionInfo.Description = item.Id === defaultSystemConfigId.onlyMaterials ? $translate.instant('estimate.main.summaryConfig.onlyMaterials') :
																													 $translate.instant('estimate.main.summaryConfig.onlyCostCodes');
								item.DescriptionInfo.Translated = item.DescriptionInfo.Description;
								platformRuntimeDataService.readonly(item, [{field: 'DescriptionInfo', readonly: true}]);
							}
						});

						return result.data;
					});
				};

				service.saveData = function() {
					let isValid = true;
					_.each(configdata, function (data) {
						if(data.DescriptionInfo)
						{
							data.DescriptionInfo.Description = data.DescriptionInfo.Translated;
							data.DescriptionInfo.DescriptionModified = true;
						}
						if(!data.ToBeDeleted && (!data.DescriptionInfo.Description || data.DescriptionInfo.Description === ''))
						{
							isValid = false;
						}
						if(data.EstResSummaryCombineEntities){
							_.each(data.EstResSummaryCombineEntities, function (combined) {
								if(combined){
									combined.IsModified = combined.Modified;
								}
							});
						}
					});
					if(!isValid) {
						// show error message
						platformModalService.showErrorBox('estimate.main.summaryConfig.configNameEmptyError', 'cloud.common.errorMessage');
						return $q.when(false);
					}
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resources/summary/saveconfig', configdata);
				};

				service.setSelectedItemPath = function (_selectItem) {
					selectedItemPath = _selectItem;
				};

				service.setSelectedConfig = function (_selectedConfig) {
					selectedConfig = _selectedConfig;
				};

				service.getSelectedConfig = function () {
					return selectedConfig;
				};

				service.getDefaultCombineSettings = function () {
					return defaultCombineSetting;
				};

				/**
             * @ngdoc function
             * @name deleteConfig
             * @function
             * @methodOf estimateMainResourceSummaryConfigDataService
             * @description
             * @param {object} _deleteConfig
             * @returns {}
             */
				service.deleteConfig = function (_deleteConfig) {
					if(_deleteConfig){
						let tobeDeleteItem = _.find(configdata, function (item) {
							return item.Id === _deleteConfig.Id;
						});
						if(tobeDeleteItem){
							tobeDeleteItem.ToBeDeleted = true;
							// all sub combine set to deleted
							if(tobeDeleteItem.EstResSummaryCombineEntities) {
								_.each(tobeDeleteItem.EstResSummaryCombineEntities, function (deleteCombine) {
									deleteCombine.ToBeDeleted = true;
								});
							}
						}
						service.onConfigDeleted.fire(_deleteConfig);
					}
				};

				service.deleteCombine = function (_deleteCombine) {
					if(_deleteCombine) {
						_.each(configdata, function (config) {
							if(config.Id === selectedConfig.Id) {
								_.each(config.EstResSummaryCombineEntities, function (combine) {
									_.each(_deleteCombine, function (deleteItem){
										if (combine.Id === deleteItem.Id) {
											combine.ToBeDeleted = true;
										}
									});
								});
							}
						});
					}
				};

				service.clearData = function () {
					configdata = [];
					selectedConfig = {};
					selectedItemPath = {};
				};

				service.getItemsByItemPath = function () {
					if(selectedItemPath){
						let filteredData = [];
						switch (selectedItemPath.Id) {
							case 'sysSettings':
								filteredData = _.filter(configdata, function (item) {
									return item.IsSystem && !item.ToBeDeleted;
								});
								break;
							case 'userSettings':
								filteredData = _.filter(configdata, function (item) {
									return !item.IsSystem && !!item.FrmUserFk && !item.ToBeDeleted;
								});
								break;
							case 'roleSettings':
								filteredData = _.filter(configdata, function (item) {
									return !item.IsSystem && !!item.FrmAccessRoleFk && !item.ToBeDeleted;
								});
								break;
						}
						return filteredData;
					}
				};

				service.getDefaulstIds = function () {
					let defaultCombineSettings = service.getDefaultCombineSettings();
					return _.map(defaultCombineSettings, function (item) {
						return item.Id;
					});
				};

				service.getOptionalFieldIds = function () {
					let defaultCombineSettings = [
						{Id: 48}, // DescriptionInfo
						{Id: 24}, // BasCurrencyFk
						{Id: 39}, // IsLumpSum
						{Id: 49}, // IndirectCost
						// {Id: 27}, //CostFactor1
						// {Id: 28}, //CostFactor2
						{Id: 50}, // IsGerneratePrc,
						{Id: 51}, // Job
						{Id: 54},  // CostUnitOriginal
						{Id: 55}  // RuleGenerated
					];
					return _.map(defaultCombineSettings, function (item) {
						return item.Id;
					});
				};

				service.setCombinedGridReadOnly = function (items, detailReadonly, allReadonly) {
					let fields = [];

					angular.forEach(items, function (item) {
						let isInclude = true;
						if(item.ColumnId === 42 || item.ColumnId === 43 || item.ColumnId === 47){
							isInclude = false;
						}
						let hasVersion = item.Version > 0;
						let exceptionKeyReadonly = isInclude && hasVersion;
						if(detailReadonly){
							exceptionKeyReadonly = isInclude;
						}
						if(allReadonly && item.ColumnId !== 47){
							exceptionKeyReadonly = hasVersion = allReadonly;
						}
						fields = [{field: 'ColumnId', readonly: hasVersion}, { field: 'ExceptionKeyValues', readonly: exceptionKeyReadonly }];
						if(allReadonly && item.ColumnId === 47)
						{
							fields = [{field: 'ColumnId', readonly: true}, { field: 'ExceptionKeyValues', readonly: exceptionKeyReadonly }];
						}
						if (item.__rt$data){
							item.__rt$data.readonly = [];
						}
						platformRuntimeDataService.readonly(item, fields);
					});
				};

				// get combined container grid data
				service.getCombinedItems = function (_configId) {
					if(selectedConfig || _configId) {
						let result = [];
						if(selectedConfig && selectedConfig.EstResSummaryCombineEntities)
						{
							_.each(selectedConfig.EstResSummaryCombineEntities, function (item) {
								if(item && !item.ToBeDeleted) {
									result.push(item);
								}
							});
						}
						// service.setCombinedGridReadOnly(result);
						return result;
					}
				};

				// tools in summary container
				let tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 'commandsMenu',
							caption: $translate.instant('estimate.main.summaryConfig.commandTitle'),
							type: 'dropdown-btn',
							iconClass: 'tlb-icons ico-filtering',
							list: {
								showImages: false,
								activeValue: 'Combined',
								items: []
							}
						},
						{
							id: 'priceUpdateMenu',
							caption: $translate.instant('estimate.main.summaryConfig.priceUpdateMenu'),
							type: 'dropdown-btn',
							iconClass: 'tlb-icons ico-price-update',
							list: {
								showImages: false,
								activeValue: 'priceUpdate',
								items: [
									{
										id: 'updateCostCode',
										type: 'item',
										value: 'updateCostCode',
										caption: 'estimate.main.summaryConfig.updateCostCode',
										fn: function () {
											projectMainSidebarWizardService.updateCostCodesPriceByPriceList(true);
										}
									},
									{
										id: 'updateMaterial',
										type: 'item',
										value: 'updateMaterial',
										caption: 'estimate.main.summaryConfig.updateMaterial',
										fn: function () {
											projectMainSidebarWizardService.updateMaterialPrices(true,'','',true);
										}
									}
								]
							}
						}
					]};

				service.getToolbar = function () {
					return tools;
				};

				service.updateTools = function (_tools) {
					tools = _tools;
					service.onToolsUpdated.fire();
				};

				service.setConfigId = function (_configId) {
					configId = _configId;
				};

				service.newSummaryTotalPreview = function (summary) {
					let requestData = {
						param: {
							configId: configId - 0,
							filterRequest: estimateMainService.getLastFilter()
						},
						summaryDtos: _.isArray(summary)? summary : [summary]
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resources/summary/newsummarytotalpreview', requestData).then(function (result) {
						return result.data;
					});
				};

				service.setOriginalData = function (_data) {
					originalData = _data;
				};

				service.isUsingClientCalculation = function (currentItem) {
					let isUsingClient = false;
					if(currentItem) {
						let originalItem = _.find(originalData, {Id: currentItem.Id});
						if (originalItem) {
							isUsingClient = (currentItem.CostFactor1 === 1 && currentItem.CostFactor2 === 1 &&
                            currentItem.CostFactorCc === 1 &&
                            currentItem.QuantityFactor1 === originalItem.QuantityFactor1 &&
                            currentItem.QuantityFactor2 === originalItem.QuantityFactor2 &&
                            currentItem.QuantityFactor3 === originalItem.QuantityFactor3 &&
                            currentItem.QuantityFactor4 === originalItem.QuantityFactor4 &&
                            currentItem.QuantityFactorCc === originalItem.QuantityFactorCc);
						}
					}
					return isUsingClient;
				};

				let modifiedItems = [];

				service.resetModifiedItems = function () {
					modifiedItems = [];
				};

				service.markAsModified = function (item) {
					modifiedItems.push(item);
				};

				service.getModifiedItems = function () {
					return _.uniq(_.map(modifiedItems, function (item) {
						return item.Id;
					}));
				};

				service.isDefaultSystemConfiguration = function (configItem) {
					// Manually insert data which id will Less than 1000000 through the database
					return configItem.Id < 1000000;
				};

				service.setResourceSummaryHeaderInfoReadOnly = function (selectedConfigItemId) {
					let items = service.getItems();
					if(!selectedConfigItemId || selectedConfigItemId < 0 || items.length === 0){
						return true;
					}

					let selectedConfig = _.find(items, function (item) {
						return item.Id === selectedConfigItemId;
					});

					if(!selectedConfig || !selectedConfig.EstResSummaryCombineEntities || selectedConfig.EstResSummaryCombineEntities.length === 0){
						return true;
					}

					let resSummaryShortKeyCombineEntity = _.find(selectedConfig.EstResSummaryCombineEntities, function (item) {
						return item.ColumnId === 47;
					});

					return (resSummaryShortKeyCombineEntity.ExceptionKeyValues && resSummaryShortKeyCombineEntity.ExceptionKeyValues.length === 1) ?
									!_.find(resSummaryShortKeyCombineEntity.ExceptionKeyValues, function (item) {
										return item.Id < 3;
									}) : true;
				};

				return service;
			}]);

})();
