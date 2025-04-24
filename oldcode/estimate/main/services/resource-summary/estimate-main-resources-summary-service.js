/**
 * bel 01/06/2018
 */
(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateResourcesSummaryService
	 * @function
	 *
	 * @description
	 * estimateResourcesSummaryService is the data service for summary of resources.
	 */
	estimateMainModule.factory('estimateResourcesSummaryService', [
		'platformDataServiceFactory',
		'$injector',
		'$http',
		'platformRuntimeDataService',
		'estimateMainResourceService',
		'estimateMainService', 'estimateMainResourceSummaryConfigDataService', 'estimateMainResourceType',
		'platformDataServiceModificationTrackingExtension',
		'PlatformMessenger',
		'platformLanguageService',
		'platformContextService',
		'platformDomainService',
		'accounting',
		function (platformDataServiceFactory,
				  $injector,
				  $http,
				  platformRuntimeDataService,
				  estimateMainResourceService,
				  estimateMainService, estimateMainResourceSummaryConfigDataService, estimateMainResourceType,
				  platformDataServiceModificationTrackingExtension,
				  PlatformMessenger,
				  platformLanguageService,
				  platformContextService,
				  platformDomainService,
				  accounting) {

			// request params to server
			let requestParams = {}, configId = null;
			let undoFilteredTotalCostEntity ={
				isUndoCostModificationPercent: false,
				isUndoAdjCostSummary: false
			}

			let undoTotalCostEntity = {
				isUndoCostModificationPercent: false,
				isUndoCostModificationAbsolute: false,
				isUndoAdjCostSummary: false
			}

			function processItem(item){
				let isReadOnly = item.EstResourceTypeFk === estimateMainResourceType.CostCode || item.EstResourceTypeFk === estimateMainResourceType.Material;
				let fields = [
					{ field: 'AdjustCostUnit', readonly: !isReadOnly},
					{ field: 'DetailsStack', readonly: false},
					{ field: 'OverrideFactor', readonly: item.RuleGenerated}
				];

				let isReadOnlyForChangedSettings = service.isDefaultSettingsChanged() || item.RuleGenerated;
				let costModificationReadOnly =  isReadOnlyForChangedSettings || estimateMainResourceSummaryConfigDataService.setResourceSummaryHeaderInfoReadOnly(parseInt(configId));

				fields.push({ field: 'CostFactor1', readonly: isReadOnlyForChangedSettings});
				fields.push({ field: 'CostFactor2', readonly: isReadOnlyForChangedSettings});

				fields.push({ field: 'QuantityFactor1', readonly: isReadOnlyForChangedSettings});
				fields.push({ field: 'QuantityFactor2', readonly: isReadOnlyForChangedSettings});
				fields.push({ field: 'QuantityFactor3', readonly: isReadOnlyForChangedSettings});
				fields.push({ field: 'QuantityFactor4', readonly: isReadOnlyForChangedSettings});

				fields.push({ field: 'EfficiencyFactor1', readonly: isReadOnlyForChangedSettings});
				fields.push({ field: 'EfficiencyFactor2', readonly: isReadOnlyForChangedSettings});

				fields.push({ field: 'ProductivityFactor', readonly: isReadOnlyForChangedSettings});

				fields.push({ field: 'CostModificationPercent', readonly: costModificationReadOnly});
				fields.push({ field: 'CostModificationAbsolute', readonly: costModificationReadOnly});
				fields.push({ field: 'AdjCostSummary', readonly: isReadOnlyForChangedSettings});

				if (isReadOnlyForChangedSettings){
					let adjustCostUnitField = _.find(fields, {field: 'AdjustCostUnit'});
					adjustCostUnitField.readonly = isReadOnlyForChangedSettings;
				}

				if(!item.GroupInSameCurrency){
					item.CostUnitOriginal = '';
					item.CostSummaryOriginal = '';
					item.CostUnitDifference = '';
					item.CostSummaryOriginalDifference = '';
				}

				platformRuntimeDataService.readonly(item, fields);

				// Process grouping conditions
				// CostFactor1,CostFactor2 and CostUnitOriginal
				// When these fields are grouped, then we don't display 0.00, we leave it blank ' '
				let fieldsToGroup = ['CostFactor1', 'CostFactor2', 'CostUnitOriginal','BasCurrencyFk','IsLumpsum','IsIndirectCost','IsGeneratedPrc','LgmJobFk'];
				_.each(fieldsToGroup, function(fieldGroup){
					if (item['IsInclude' + fieldGroup] === false){
						item[fieldGroup] = '';
					}
				});
			}

			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateResourcesSummaryService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/resources/summary/summarytotal',
						endRead: '/',
						initReadData: function initReadData(readData) {
							requestParams.filterRequest = estimateMainService.getLastFilter();
							requestParams.configId = configId ? configId: -1;
							angular.extend(readData, requestParams);
						},
						usePostForRead: true
					},
					actions: {},
					dataProcessor: [{ processItem: processItem }],
					modification: {multi: {}},
					entitySelection: { supportsMultiSelection: true },
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							itemName: 'EstResourceSummary'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (responseData, data) {
								if(responseData){
									let totalCostEntity = responseData.TotalCostEntity;
									if(totalCostEntity){
										totalCostEntity.isAdjust = true;
									}
									service.calculatedHeaderTotalInfo.fire(totalCostEntity, responseData.EstResourcesSummaries);
									let result = data.handleReadSucceeded(responseData.EstResourcesSummaries, data);
									if(result.length > 0){
										service.setSelected(result[0]);
									}
									return  result;
								}
							}
						}
					},
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(options);
			serviceContainer.data.updateOnSelectionChanging = null;
			let service = serviceContainer.service;
			service.calculatedHeaderTotalInfo = new PlatformMessenger();

			service.loadFromConfig = function (_configId) {
				configId = _configId;
				estimateMainResourceSummaryConfigDataService.setConfigId(configId);
				service.load();
			};

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				if(updateData.EntitiesCount > 0){
					service.entityModified(updateData.EstResourceSummary);
				}

				platformDataServiceModificationTrackingExtension.makeEntitiesEditableAfterUpdating(updateData, serviceContainer.data, service);

				updateData.EntitiesCount = 0;
			};

			service.getConfigId = function () {
				return configId;
			};

			service.apply = function () {
				let modifiedIds = estimateMainResourceSummaryConfigDataService.getModifiedItems();
				let updateList = _.filter(service.getList(), function (item) {
					return _.includes(modifiedIds, item.Id);
				});
				let requestData = {
					requestData: updateList,
					EstHeaderFk: estimateMainService.getSelectedEstHeaderId(),
					EstProjectFk: estimateMainService.getSelectedProjectId()
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resources/summary/apply', requestData);
			};

			service.clear = function () {
				service.setList([]);
				estimateMainResourceSummaryConfigDataService.onToolsUpdated.fire();
			};

			let oldEstHeaderId = 0;

			service.setCurrentEstHeaderId = function (estHeaderId) {
				if(estHeaderId !== oldEstHeaderId){
					oldEstHeaderId = estHeaderId;
					service.clear();
				}
			};

			service.entityModified = function (entities){
				if(!entities || !entities.length){
					return;
				}
				_.forEach(entities, function (item){
					estimateMainResourceSummaryConfigDataService.markAsModified(item);
				});

				service.showLoading();

				let items = entities;
				let gridData = service.getList();
				let currentEditColumn = $injector.get('estimateMainResourceSummaryValidateService').getCurrentEditColumn();
				if (currentEditColumn === 'AdjustCostUnit') {
					items = [];
					_.forEach(entities, function (item){
						let itemsByCode = _.filter(gridData, {'Code': item.Code});
						_.forEach(itemsByCode, function (data) {
							if (data.IsFixed && data.Code === item.Code && data.LgmJobFk === item.LgmJobFk && data.Id === item.Id) {
								data.AdjustCostUnit = item.AdjustCostUnit;
								items.push(data);
							}else if(data.Id === item.Id){
								items.push(data);
							}
						});
					});
				}

				if(currentEditColumn === 'CostModificationPercent'){
					_.forEach(entities,function (item) {
						if(item.CostSummary === 0){
							item.CostModificationPercent = 0;
							serviceContainer.data.doClearModifications(item, serviceContainer.data);
							service.gridRefresh();
							return;
						}
						service.onCostModificationPercent(item);
					});
				}

				if(currentEditColumn === 'CostModificationAbsolute'){
					_.forEach(entities,function (item) {
						service.onCostModificationAbsolute(item);
					});
				}

				estimateMainResourceSummaryConfigDataService.newSummaryTotalPreview(items).then(function (responseData) {
					service.hideLoading();
					if(responseData){
						let totalCostEntity = responseData.TotalCostEntity;
						if(totalCostEntity){
							totalCostEntity.isAdjust = true;
						}
						let data = responseData.EstResourcesSummaries;
						if (data && angular.isArray(data) && data.length > 0) {
							// update the other entries while the code, job, is the same and fixed unit rate
							_.each(items, function (itemTemp) {
								let tobeUpdateData = _.find(data, {'GroupIdKeys': itemTemp.GroupIdKeys});
								if(!tobeUpdateData){
									return;
								}
								let itemOfData = _.find(gridData, {'GroupIdKeys': itemTemp.GroupIdKeys});
								replaceGridItemValue(itemOfData, tobeUpdateData);

								// remove validation resule
								if(!itemOfData.isValid){
									applyValidationResult(true, itemOfData, 'AdjCostSummary');
								}

								itemOfData.isValid = tobeUpdateData.CostSummary !== 0;
								itemOfData.reCalCostSummary = itemOfData.OverrideFactor !== 0 ? (tobeUpdateData.CostSummary / itemOfData.OverrideFactor) : 0;
							});

							if(items.length > 1){
								service.setSelected(data[0]);
							}
							service.calculatedHeaderTotalInfo.fire(totalCostEntity, gridData);
							service.gridRefresh();
						}
					}
				});
			};

			service.isDefaultSettingsChanged = function isDefaultSettingsChanged(){
				let isChanged = false;

				let configId = angular.copy(service.getConfigId());
				// If it is not a standard config, then we validate if the optional settings were updated, if they were updated, we will disable these buttons
				if (configId !== -1 && !_.isEmpty(configId)){
					let currentConfig = _.find(estimateMainResourceSummaryConfigDataService.getItems(), {Id: parseInt(configId) });
					if (currentConfig){
						let optionalFieldIds = estimateMainResourceSummaryConfigDataService.getOptionalFieldIds();
						let currentFieldIds = _.map(currentConfig.EstResSummaryCombineEntities, 'ColumnId');

						let optFieldIdsNotFound = [];
						_.forEach(optionalFieldIds, function(optFieldId){
							if (currentFieldIds.indexOf(optFieldId) === -1){
								optFieldIdsNotFound.push(optFieldId);
							}
						});

						// if we have data in optFieldIdsNotFound, then it has default fields removed, so we disable these toolbar buttons
						isChanged = _.size(optFieldIdsNotFound) > 0;
					}
				}

				return isChanged;

			};

			function replaceGridItemValue(itemOfData, tobeUpdateData, isCostUnitOnly) {
				let replaceColumns = ['CostFactor1', 'CostFactor2', 'EfficiencyFactor1', 'EfficiencyFactor2', 'ProductivityFactor', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4', 'AdjCostSummary', 'AdjQuantitySummary'];
				if (isCostUnitOnly) {
					replaceColumns = ['AdjCostSummary'];
				}
				_.each(replaceColumns, function (column) {
					itemOfData[column] = tobeUpdateData[column];
				});
				// calculation
				// Adjust Cost/unit - Cost/unit Original Difference
				itemOfData.CostUnitDifference = itemOfData.AdjustCostUnit - itemOfData.CostUnitOriginal;
				// Adjust Cost summary-Cost summary Difference
				itemOfData.CostSummaryDifference = itemOfData.AdjCostSummary - itemOfData.CostSummary;
				// Adjust Cost summary-Cost summary Original Difference
				itemOfData.CostSummaryOriginalDifference = itemOfData.AdjCostSummary - itemOfData.CostSummaryOriginal;

				// recaluate cost facotr1 by override factor
				itemOfData.CostFactor1 =  itemOfData.OverrideFactor !== 0 && itemOfData.CostFactor1 ? itemOfData.CostFactor1 / itemOfData.OverrideFactor : null;
			}

			function applyValidationResult(result, entity, field){
				if (!result.valid) {
					platformRuntimeDataService.applyValidationResult(result, entity, field);
				} else {
					platformRuntimeDataService.applyValidationResult(true, entity, field);
				}
			}

			service.onCostModificationPercent = function onCostModificationPercent(entity) {
				let newAdjCostSummary = entity.CostSummary + entity.CostSummary * entity.CostModificationPercent / 100;
				if(entity.AdjCostSummary !== 0){
					entity.OverrideFactor *= newAdjCostSummary / entity.AdjCostSummary;
				}else {
					entity.OverrideFactor = newAdjCostSummary / entity.CostSummary;
				}
				entity.AdjCostSummary = newAdjCostSummary;
			}

			service.onCostModificationAbsolute = function onCostModificationAbsolute(entity) {
				if(entity.CostSummary === 0) {
					entity.OverrideFactor = entity.AdjCostSummary === 0 ? 1 : (entity.OverrideFactor === 0 ? 0 : entity.CostModificationAbsolute / (entity.AdjCostSummary / entity.OverrideFactor));
					entity.AdjCostSummary = entity.CostModificationAbsolute;
				} else {
					let newAdjCostSummary = entity.CostSummary + entity.CostModificationAbsolute;
					if(entity.AdjCostSummary !== 0){
						entity.OverrideFactor *= newAdjCostSummary / entity.AdjCostSummary;
					}else {
						entity.OverrideFactor = newAdjCostSummary / entity.CostSummary;
					}
					entity.AdjCostSummary = newAdjCostSummary;
				}
			}

			service.formatNumberToPercent = function (value) {
				let cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());
				let domainInfo = platformDomainService.loadDomain('percent');
				return accounting.formatNumber(value, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
			}

			service.getIsUndoInputValue = function (valueEntityName, valueEntityColumnName) {
				if(valueEntityName === 'filteredTotalCostEntity'){
					return undoFilteredTotalCostEntity['isUndo' + valueEntityColumnName];
				}else {
					return undoTotalCostEntity['isUndo' + valueEntityColumnName];
				}
			}

			service.setIsUndoInputValue = function (valueEntityName, valueEntityColumnName, flag) {
				if(valueEntityName === 'filteredTotalCostEntity'){
					undoFilteredTotalCostEntity['isUndo' + valueEntityColumnName] = flag;
				}else {
					undoTotalCostEntity['isUndo' + valueEntityColumnName] = flag;
				}
			}

			service.resetUndoInputValueFlag = function () {
				undoFilteredTotalCostEntity.isUndoAdjCostSummary = false;
				undoFilteredTotalCostEntity.isUndoCostModificationPercent = false;
				undoTotalCostEntity.isUndoAdjCostSummary = false;
				undoTotalCostEntity.isUndoCostModificationPercent = false;
				undoTotalCostEntity.isUndoCostModificationAbsolute = false;
			}

			return service;
		}]);
})();
