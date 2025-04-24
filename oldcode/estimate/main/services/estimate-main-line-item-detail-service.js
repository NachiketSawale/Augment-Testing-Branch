/**
 * Created by joshi on 18.05.2017.
 */
(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemDetailService
	 * @function
	 *
	 * @description
	 * estimateMainLineItemDetailService is the data service for estimate line item related functionality.
	 */
	angular.module(moduleName).factory('estimateMainLineItemDetailService',
		['$q', '$http','$injector', 'platformModalService', 'estimateMainService', 'estimateMainResourceService', 'estimateMainDynamicColumnService', 'estimateMainRefLineItemService',
			'estimateMainCommonService', 'cloudCommonGridService', 'estimateMainCommonCalculationService', 'estimateMainResourceProcessor', 'estimateMainDurationCalculatorService','platformDataValidationService',
			function ($q,$http, $injector, platformModalService, estimateMainService, estimateMainResourceService, estimateMainDynamicColumnService,
				estimateMainRefLineItemService, estimateMainCommonService, cloudCommonGridService, estimateMainCommonCalculationService, estimateMainResourceProcessor, estimateMainDurationCalculatorService,platformDataValidationService) {

				let service = {
					fieldChange : fieldChange,
					valueChangeCallBack : valueChangeCallBack,
					calcLineItemResNDynamicCol : calcLineItemResNDynamicCol,
					valueChangeCalculationForBulkEdit:valueChangeCalculationForBulkEdit
				};
				let map2Detail = {
						Quantity: 'QuantityDetail',
						QuantityTarget: 'QuantityTargetDetail',
						QuantityFactorDetail1: 'QuantityFactor1',
						QuantityFactorDetail2: 'QuantityFactor2',
						ProductivityFactorDetail:'ProductivityFactor',
						CostFactorDetail1: 'CostFactor1',
						CostFactorDetail2: 'CostFactor2',
						IsLumpsum:'null',
						QuantityFactor3:'null',
						QuantityFactor4 : 'null',
						QuantityTotal : 'QuantityTotal',
						WqQuantityTarget: 'WqQuantityTarget',
						WqQuantityTargetDetail: 'WqQuantityTargetDetail'
					},
					calcFields = angular.extend({}, _.invert(map2Detail), map2Detail);
				delete calcFields['null'];

				let checkBoxFields = [
					'IsLumpsum',
					'IsDisabled',
					'IsGc',
					'IsOptional',
					'IsOptionalIT',
					'IsFixedPrice',
					'IsIncluded',
					'IsDaywork'
				];

				let refresh = function refresh(item) {
					estimateMainService.fireItemModified(item);
					angular.forEach(estimateMainResourceService.getList(), function(resItem){
						estimateMainResourceService.fireItemModified(resItem);
					});
				};

				// calculate line item on change of any type of quantity, details, cost factors, lumpsum, fromdate or todate fields
				// calculate resources of line item
				// recalculate the dynamic column values
				// refresh items
				function calcLineItemResNDynamicCol(col, item, resourceList){// agr as item

					if(item.CombinedLineItemsSimple === null) {
						/* calculate detail of lineItem */
						estimateMainCommonService.calculateDetails(item, col, null, true);

						item.forceBudgetCalc = !item.IsOptional && !item.IsDisabled;

						/* calculate quantity and cost of lineItem and resources */
						estimateMainCommonService.calculateLineItemAndResources(item, resourceList);

						/* mark resources as modified */
						if (item.Id && item.EstLineItemFk === null && resourceList.length > 0) {

						} else {
							item.EstResources = [];
						}

						/* render the lineItem and resource to screen */
						refresh(item);
					} else {
						angular.forEach(item.CombinedLineItems, function(lineItem){
							/* calculate detail of lineItem */
							estimateMainCommonService.calculateDetails(lineItem, col, null, true);

							/* calculate quantity and cost of lineItem and resources */
							estimateMainCommonService.calculateLineItemAndResources(lineItem, resourceList);

							/* mark resources as modified */
							if (lineItem.Id && lineItem.EstLineItemFk === null && resourceList.length > 0) {

							} else {
								lineItem.EstResources = [];
							}

							/* render the lineItem and resource to screen */
							refresh(lineItem);
						});
					}
				}

				function fieldChange(item, field, column) {
					if(estimateMainCommonService.isCharacteristicCulumn(column)) { // characteristic culomn
						if (estimateMainCommonService.isCharacteristicColumnExpired(column)) {
							$injector.get('platformModalService').showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
								// eslint-disable-next-line no-prototype-builtins
								if (item.hasOwnProperty(field)) {
									item[field] = item[field + '__revert'];
									delete item[field + '__revert'];
									estimateMainService.gridRefresh();
								}
							});
						} else {
							if (item[field] === undefined) {
								item[field] = estimateMainCommonService.getCharacteristicColValue(angular.copy(item), _.split(field, '.'));
							}

							// TODO: when update character value in line item, sync update character.
							let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(estimateMainService, 28, null, 'EstHeaderFk');
							let contextId = parseInt(_.replace(characteristicDataService.getFilter(), 'mainItemId=', ''));
							let currentContextId = item.Id;
							if (contextId === currentContextId) {
								characteristicDataService.syncUpdateCharacteristic(field, item);
							} else {
								characteristicDataService.setUpdateCharOnListLoaded(field, item);
							}
						}
					}
					else if(['WQ', 'BQ', 'ASQ'].indexOf(field) !== -1){
						$injector.get('estimateMainLineItemQuantityService').generateQuantityItem(field, item).then(function(data){return data;});
					}

					let procurementPackageEstimateLineItemDataService = $injector.get('procurementPackageEstimateLineItemDataService');
					if(procurementPackageEstimateLineItemDataService && procurementPackageEstimateLineItemDataService.getList() && procurementPackageEstimateLineItemDataService.getList().length > 0){
						procurementPackageEstimateLineItemDataService.load();
					}

					let quantityAndFactors = ['QuantityTotal','QuantityDetail', 'Quantity', 'QuantityFactor1', 'QuantityFactorDetail1', 'QuantityFactor2', 'QuantityFactorDetail2', 'QuantityFactor3', 'QuantityFactorDetail3', 'QuantityFactor4', 'QuantityFactorDetail4', 'ProductivityFactor', 'ProductivityFactorDetail'];
					if(_.includes(quantityAndFactors, field))
					{
						let isQuantity = _.includes(['QuantityTotal','QuantityDetail', 'Quantity'], field);
						estimateMainService.onQuantityChanged.fire(item, isQuantity);
					}

					if (field === 'EstAssemblyFk') {
						let value = item[field];

						let estimateMainAssemblyTemplateService = $injector.get('estimateMainAssemblyTemplateService');
						let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
						let platformDataValidationService = $injector.get('platformDataValidationService');

						if (value && !_.isNumber(value)){
							estimateMainAssemblyTemplateService.getAssemblyByCodeAsync(value).then(function(lookupItem){
								if (lookupItem){
									estimateMainCommonService.setSelectedLookupItem(lookupItem);

									item.EstAssemblyFk = lookupItem.Id;
									estimateMainService.gridRefresh();
									let mainItemList = estimateMainService.getList();
									return service.modifiedAssemblyTemplate(item, mainItemList, field);
								}
								else{
									let result = platformDataValidationService.createErrorObject(moduleName + '.errors.codeParamNotFound', { code: value });
									platformRuntimeDataService.applyValidationResult(result, item, field);
									estimateMainService.gridRefresh();
								}
							});
						}
					}

					const fieldsReadonly =[];

					if(field === 'IsFixedBudget'){
						fieldsReadonly.push({field: 'Budget',readonly: !item.IsFixedBudget});
						if(item.IsFixedBudget){
							item.IsFixedBudgetUnit= !item.IsFixedBudget;
							fieldsReadonly.push({field: 'BudgetUnit',readonly: !item.IsFixedBudgetUnit});
						}
					}

					if(field === 'IsFixedBudgetUnit'){
						fieldsReadonly.push({field: 'BudgetUnit', readonly: !item.IsFixedBudgetUnit});
						if(item.IsFixedBudgetUnit){
							item.IsFixedBudget= !item.IsFixedBudgetUnit;
							fieldsReadonly.push({field: 'Budget',readonly: !item.IsFixedBudget});
						}
					}

					if (field === 'IsGc') {
						fieldsReadonly.push({ field: 'GcBreakdownTypeFk', readonly: !item.IsGc })
					}

					$injector.get('platformRuntimeDataService').readonly(item, fieldsReadonly);

					if(field === 'IsLumpsum'){
						$injector.get('estimateMainLineItem2MdlObjectService').setQuantityReadOnly(item);
					}

					if(_.includes(['AdvancedAll','AdvancedAllUnitItem','AdvancedAllUnit'], field)){
						$injector.get('estimateMainStandardAllowanceCalculationService').reCalculateAdvAllowance(item,field);
						item.AdvancedAllowance = 0;
					}

					if(_.includes(['ManualMarkupUnitItem','ManualMarkup','ManualMarkupUnit'],field)){
						$injector.get('estimateMainStandardAllowanceCalculationService').reCalculateManualMarkup(item,field);
					}

					if(_.includes(checkBoxFields, field)){
						let resourceList = $injector.get('estimateMainResourceService').getList();
						if(_.isArray(resourceList) && resourceList.length > 0 && resourceList[0].EstLineItemFk === item.Id){
							_.forEach(resourceList, function (resource){
								resource.IsParentDisabled = item.IsDisabled || item.IsOptional || item.IsOptionalIT;
							});
							estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
						}
					}

					if(field ==='Rule'){
						let ruleToDelete = estimateMainService.getRuleToDelete();
						if(!item.Rule.length && ruleToDelete && ruleToDelete.length) {
							$injector.get ('platformDeleteSelectionDialogService').showDialog ({
								dontShowAgain: true,
								id: '7a9f7da5c9b44e339d49ba149a905987'
							}).then (result => {
								if (result.ok || result.delete) {
									estimateMainService.deleteParamByPrjRule(item, ruleToDelete,'EstLineItems');
								}
							});
						}
					}

					if(field === 'ExternalCode'){
						$injector.get('platformGridAPI').grids.refresh('bedd392f0e2a44c8a294df34b1f9ce44',true);
					}

					$injector.get('estimateMainDynamicUserDefinedColumnService').fieldChange(item, field);
				}

				function assignAssemblyTo(item, lineItemEntity, assembly, projectId, field, mainItemList, overwrite, pastedContent) {
					// only assign assembly when has value
					return estimateMainCommonService.assignAssembly(lineItemEntity, assembly, projectId, false, overwrite, pastedContent).then(function (response) {
						let resources = _.filter(angular.copy(response.data.resourceOfAssembly), function (res) {
							return res.EstLineItemFk === lineItemEntity.Id;
						});
						let resList = response.data.resourceOfLineItem ?  response.data.resourceOfLineItem : [];
						if (resources) {
							if (overwrite && overwrite.overwriteFlag && overwrite.canResOverwrite) {
								if (resList && resList.length) {
									resList = _.filter(resList, function (res) {
										return res.EstLineItemFk === lineItemEntity.Id;
									});
								}
								if(resList && resList.length){
									let deleteParams = {};
									deleteParams.entities = resList;
									deleteParams.service = estimateMainResourceService;
									deleteParams.index = -1;

									estimateMainResourceService.DeleteResourceByDropDrag(deleteParams, item);
									estimateMainResourceService.updateList([]);
								}
								estimateMainResourceService.resolveResourceFromAssembly(lineItemEntity, resources);
								// set also assembly cat
								lineItemEntity.EstAssemblyCatFk = assembly.EstAssemblyCatFk;

								estimateMainResourceService.setItemResources(lineItemEntity);
								$injector.get('estimateMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(resources);

							} else {
								estimateMainResourceService.resolveResourceFromAssembly(lineItemEntity, resources);
								// set also assembly cat
								lineItemEntity.EstAssemblyCatFk = assembly.EstAssemblyCatFk;

								estimateMainResourceService.setItemResources(lineItemEntity);

								resources = resList.concat(resources);
								$injector.get('estimateMainResourceValidationService').validateSubItemsUniqueCodeFromAssembly(resources);
							}

							let resources2LineItem = estimateMainResourceService.getList();
							calcLineItemResNDynamicCol(null, item, resources2LineItem);

							return $q.when();

						}
					});
				}

				function valueChangeCalculationForBulkEdit(entity, field, originalValue) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, originalValue, field, estimateMainService);
					asyncMarker.myPromise = valueChangeCallBackForBulkEdit(entity, field, originalValue).then(function () {
						return platformDataValidationService.finishAsyncValidation(true, entity, originalValue, field, asyncMarker, service, estimateMainService);
					});
					return asyncMarker.myPromise;
				}

				function valueChangeCallBackForBulkEdit(entity, field, originalValue){
					let serv = $injector.get('estimateMainLineItemDetailService');

					let postData ={
						estLineItemFks:[entity.Id],
						estHeaderFk:estimateMainService.getSelectedEstHeaderId(),
						projectId:  estimateMainService.getProjectId()
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems',postData).then(function (response) {
						let resourceList = response && response.data && response.data.dtos ? response.data.dtos : [];

						// load user defined column value
						let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
						let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
						if(udpData.length > 0){
							estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(resourceList, udpData, false);
						}

						serv.valueChangeCallBack(entity, field, originalValue,true, resourceList);
						serv.calcLineItemResNDynamicCol(field, entity, resourceList);
						return $q.when();
					});
				}

				// changes for Bulk editor
				/* jshint -W074 */ // this function's cyclomatic complexity is too high.
				function valueChangeCallBack(item, field, newValue, isFromBulkEditor, sourceResourceList) {

					let mainItemList = estimateMainService.getList();
					let resourceList = getResourceList(item, isFromBulkEditor, sourceResourceList);

					if (field === 'EstLineItemFk') {

						angular.forEach(mainItemList, function(lineItem){
							if (!_.some(mainItemList, ['EstLineItemFk', lineItem.Id])){
								delete lineItem.HasReferenceLineItem;
							} else {
								lineItem.HasReferenceLineItem = true;
							}
							estimateMainService.markItemAsModified(lineItem);
						});

						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								return estimateMainRefLineItemService.setRefLineItem(lineItem, mainItemList);
							});
						}else{
							return estimateMainRefLineItemService.setRefLineItem(item, mainItemList);
						}
					}else if (field === 'IsDisabled' || field === 'IsOptional') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (lineItem && lineItem.Id) {
									estimateMainCommonService.calculateLineItemAndResources(lineItem, resourceList);
								}
								return $q.when();
							});
						}else {
							if (item && item.Id) {
								item.forceBudgetCalc = !item.IsOptional && !item.IsDisabled;
								estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
							}
							return $q.when();
						}
					}
					else if (field === 'GcBreakdownTypeFk') {
						if (item) {
							estimateMainResourceService.handleGcBreakdownType(item, newValue, resourceList);
						}
					}
					else if (field === 'FromDate' || field === 'ToDate') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (lineItem && lineItem.Id && lineItem.BasUomFk) {
									let itemQty = lineItem.Quantity;
									return estimateMainDurationCalculatorService.getDuration(lineItem).then(function (result) {
										let qty = result;
										if (qty > 0 && qty !== itemQty) {
											item.Quantity = qty;
											item.QuantityDetail = qty.toString();
											calcLineItemResNDynamicCol(field, lineItem, resourceList);
										}
										return $q.when();
									});
								}
							});
						}else if (item && item.Id && item.BasUomFk) {
							let itemQty = item.Quantity;
							return estimateMainDurationCalculatorService.getDuration(item).then(function (result) {
								let qty = result;
								if (qty > 0 && qty !== itemQty) {
									item.Quantity = qty;
									item.QuantityDetail = qty.toString();
									calcLineItemResNDynamicCol(field, item, resourceList);
								}
								return $q.when();
							});
						}
						return $q.when();
					}else if (field === 'IsGc') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (lineItem && lineItem.Id) {
									estimateMainResourceService.setIndirectCost(resourceList, lineItem.IsGc);
									estimateMainCommonService.calculateLineItemAndResources(lineItem, resourceList);
									estimateMainService.markItemAsModified(lineItem);
								}
							});
						}else {
							if (item && item.Id) {
								estimateMainResourceService.setIndirectCost(resourceList, item.IsGc);
								let lineItemProcessor = $injector.get('estimateMainLineItemProcessor');
								lineItemProcessor.setGcBreakdownTypeReadonly(item, resourceList);
								estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
								estimateMainService.markItemAsModified(item);
							}
						}
						return $q.when();
					}else if (field === 'EstAssemblyFk') {
						return $q.when();
					}else if (field === 'IsFixedBudget' || field === 'IsFixedBudgetUnit') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if(lineItem && lineItem.Id) {
									let itemProcessor = $injector.get('estimateMainLineItemProcessor');
									itemProcessor.processItem(lineItem);
									estimateMainService.markItemAsModified(lineItem);
								}
							});
						}else {
							if(item && item.Id) {
								let itemProcessor = $injector.get('estimateMainLineItemProcessor');
								itemProcessor.processItem(item);
								estimateMainService.markItemAsModified(item);
							}
						}
						return $q.when();
					}else if (field === 'BudgetUnit') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if(lineItem && lineItem.Id) {
									let calculationService = $injector.get('estimateMainCompleteCalculationService');
									calculationService.calItemBudget(lineItem, field);
									calculationService.calLineItemBudgetDiff(lineItem, resourceList);
									estimateMainService.markItemAsModified(lineItem);
								}
							});
						}else {
							let calcService = $injector.get('estimateMainCompleteCalculationService'),
								prjInfo = estimateMainService.getSelectedProjectInfo(),
								prjId = prjInfo.ProjectId ? prjInfo.ProjectId : estimateMainService.getSelectedProjectId();

							return calcService.calculateBudget(item, field, prjId, resourceList, null).then(function(){
								return estimateMainService.markItemAsModified(item);
							});
						}
						return $q.when();
					}else if (field === 'Budget') {
						if(item.CombinedLineItems !== null) {
							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if(lineItem && lineItem.Id) {
									let calcService = $injector.get('estimateMainCompleteCalculationService');
									calcService.calItemUnitBudget(lineItem, field);
									calcService.calLineItemBudgetDiff(lineItem, resourceList);
									estimateMainService.markItemAsModified(lineItem);
								}
							});
						}else {
							let completeCalcService = $injector.get('estimateMainCompleteCalculationService'),
								projectInfo = estimateMainService.getSelectedProjectInfo(),
								projectId = projectInfo.ProjectId ? projectInfo.ProjectId : estimateMainService.getSelectedProjectId();

							return completeCalcService.calculateBudget(item, field, projectId, resourceList, null).then(function(){
								return estimateMainService.markItemAsModified(item);
							});
						}
						return $q.when();
					}else if(field === 'BasUomFk') {
						return estimateMainCommonService.isLumpsumUom(item.BasUomFk).then(function (isLsumUom) {
							if (isLsumUom) {
								estimateMainCommonService.setQuantityByLsumUom(item, false, isLsumUom);
								estimateMainCommonService.calculateLineItemAndResources(item, resourceList);
								$injector.get('estimateMainLineItemProcessor').processItem(item);
								return $q.when();
							}
							else if (item.BasUomFk) {
								return estimateMainDurationCalculatorService.getDuration(item).then(function (result) {
									let qty = result;
									if (qty > 0 && qty !== item.Quantity) {
										item.Quantity = qty;
										item.QuantityDetail = qty.toString();
										calcLineItemResNDynamicCol(field, item, resourceList);
									}
									return $q.when();
								});
							}
							return $q.when();
						});


					}
					// eslint-disable-next-line no-prototype-builtins
					else if(calcFields.hasOwnProperty(field))
					{
						if(item.CombinedLineItems !== null) {
							let combineQuantityFactor = null;

							angular.forEach(item.CombinedLineItems, function (lineItem) {
								if (!lineItem[field] || lineItem[field] === '') {
									lineItem[field] = 0;
								}

								lineItem.DescriptionInfo = item.DescriptionInfo;

								if(field === 'Quantity') {
									combineQuantityFactor = item.Quantity / parseFloat(newValue);
									lineItem.Quantity *= combineQuantityFactor;
								}else if (field === 'QuantityTotal') {
									combineQuantityFactor = item.QuantityTotal / parseFloat(newValue);
									lineItem.QuantityFactor4 *= combineQuantityFactor;
								} else if (field === 'WqQuantityTarget'){
									combineQuantityFactor = item.WqQuantityTarget / parseFloat(newValue);
									lineItem.WqQuantityTarget *= combineQuantityFactor;
								} else if(field === 'QuantityTarget'){
									combineQuantityFactor = item.QuantityTarget / parseFloat(newValue);
									lineItem.QuantityTarget *= combineQuantityFactor;
								}

								if (field !== 'QuantityTotal') {
									if (lineItem.__rt$data && lineItem.__rt$data.errors && lineItem.__rt$data.errors.QuantityTotal) {
										if (lineItem.QuantityTotal || lineItem.QuantityTotal === 0) {
											let platformDataValidationService = $injector.get('platformDataValidationService');
											platformDataValidationService.removeDeletedEntityFromErrorList(lineItem, estimateMainService);

											lineItem.__rt$data.errors.QuantityTotal = null;
										}
									}
								}
							});
						}else {
							if(angular.isUndefined(item[field]) || item[field] === null || item[field] === ''){
								if(field.toLocaleLowerCase().indexOf('detail') > -1){
									item[field] = '';
								}else{
									item[field] = 0;
								}
							}
							if (field === 'QuantityTotal') {
								setQuantityAndDetail(item);
							}

							let deferred = service.calculateResourceSystemParam(item, resourceList);


							return deferred.promise.then(() =>{
								processLineItemResNDynamicCol(item, field, resourceList);
								if (field !== 'QuantityTotal') {
									if (item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.QuantityTotal) {
										if (item.QuantityTotal || item.QuantityTotal === 0) {
											let platformDataValidationService = $injector.get('platformDataValidationService');
											platformDataValidationService.removeDeletedEntityFromErrorList(item, estimateMainService);

											item.__rt$data.errors.QuantityTotal = null;
										}
									}
								}
							});
						}
						return $q.when();
					}
					else{
						return $q.when();
					}
				}

				service.calculateResourceSystemParam = function (item, resourceList) {
					let deferred = $q.defer();

					let systemVariablesHelperService = $injector.get('estimateMainSystemVariablesHelperService');
					let detailColumns = systemVariablesHelperService.getUsingDetailColumns();
					let calculateExps = [];
					let regex1 = new RegExp('\\b_AQQuantity\\b', 'gi');
					let regex2 = new RegExp('\\b_WQQuantity\\b', 'gi');
					let regex3 = new RegExp('\\b_TotalQuantity\\b', 'gi');
					let flatResourceList = cloudCommonGridService.flatten(resourceList, [], 'EstResources');
					_.forEach(flatResourceList, function (res) {
						_.forEach(detailColumns, function (column) {
							let colValue = res[column];
							if(colValue && colValue !== '' && (regex1.test(colValue) || regex2.test(colValue) || regex3.test(colValue))) {
								calculateExps.push(colValue);
							}
							regex1.lastIndex = 0;
							regex2.lastIndex = 0;
							regex3.lastIndex = 0;
						});
					});

					if(calculateExps.length <= 0){
						deferred.resolve('');
						return deferred;
					}

					let postData ={
						lineItem: item,
						EstHeaderId:estimateMainService.getSelectedEstHeaderId(),
						ProjectId:  estimateMainService.getProjectId(),
						Details: calculateExps
					};
					$http.post(globals.webApiBaseUrl +'estimate/main/calculator/calculatedetails', postData).then(formulaRes => {
						if(formulaRes && formulaRes.data){
							_.forEach(flatResourceList, function (res) {
								_.forEach(detailColumns, function (column) {
									let colValue = res[column];
									if(colValue && colValue !== '' && (regex1.test(colValue) || regex2.test(colValue) || regex3.test(colValue))) {
										if(formulaRes.data[colValue] || formulaRes.data[colValue] === 0){
											res[systemVariablesHelperService.getRelativedColOfDetail(column)] = formulaRes.data[colValue];
										}
									}
									regex1.lastIndex = 0;
									regex2.lastIndex = 0;
									regex3.lastIndex = 0;
								});
							});
						}
						deferred.resolve('');
					});

					return deferred;
				};

				function processLineItemResNDynamicCol(item, field, resourceList)
				{
					/* check whether the resources is in the current lineItem */
					if (item) {
						if (item.EstLineItemFk) {
							let resources = estimateMainRefLineItemService.getResources(item.Id);

							if (resources) {
								calcLineItemResNDynamicCol(field, item, resources);
							}
						} else {
							if (resourceList === null || resourceList.length === 0) {
								calcLineItemResNDynamicCol(field, item, resourceList);
							} else if (resourceList && resourceList.length > 0 && item.Id === resourceList[0].EstLineItemFk) {
								calcLineItemResNDynamicCol(field, item, resourceList);
							}
						}
					}
				}

				function getResourceList(item, isFromBulkEditor, sourceResourceList)
				{
					let resourceList;
					if(isFromBulkEditor){
						resourceList = sourceResourceList;
					} else{
						let allResources = estimateMainResourceService.getList();
						// in case of bulk editor operation of multi selected items find resource of item
						resourceList = allResources && allResources.length ? _.filter(allResources, {EstLineItemFk : item.Id, EstHeaderFk : item.EstHeaderFk}) : [];
					}
					return resourceList;
				}

				function setQuantityAndDetail(item) {
					if (item.QuantityFactor1 === 0 || item.QuantityFactor2 === 0 || item.QuantityFactor3 === 0 || item.QuantityFactor4 === 0 || item.ProductivityFactor === 0) {
						if (item.QuantityTotal > 0) {
							if (item.QuantityFactor1 === 0) {
								item.QuantityFactor1 = 1;
								item.QuantityFactorDetail1 = '1';
							}
							if (item.QuantityFactor2 === 0) {
								item.QuantityFactor2 = 1;
								item.QuantityFactorDetail2 = '1';
							}
							item.QuantityFactor3 = item.QuantityFactor3 === 0 ? 1 : item.QuantityFactor3;
							item.QuantityFactor4 = item.QuantityFactor4 === 0 ? 1 : item.QuantityFactor4;
							if (item.ProductivityFactor === 0) {
								item.ProductivityFactor = 1;
								item.ProductivityFactorDetail = '1';
							}
						}
					}
					let isCalcTotalWithWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();
					let targetQuantity = isCalcTotalWithWq ? item.WqQuantityTarget : item.QuantityTarget;
					if (targetQuantity === 0 && item.Quantity === 0) {
						item.Quantity = 1;
					}
					if (item.IsLumpsum) {
						item.Quantity = item.QuantityTotal / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
						item.QuantityDetail = item.Quantity;
					} else {
						if (!isCalcTotalWithWq && item.QuantityTarget === 0 && item.Quantity !== 0) {
							item.QuantityTarget = item.QuantityTotal / item.Quantity / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
							item.QuantityTargetDetail = item.QuantityTarget;
							item.QuantityDetail = item.Quantity;
						} else if (isCalcTotalWithWq && item.WqQuantityTarget === 0 && item.Quantity !== 0) {
							item.WqQuantityTarget = item.QuantityTotal / item.Quantity / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
							item.WqQuantityTargetDetail = item.WqQuantityTarget;
							item.QuantityDetail = item.Quantity;
						} else {
							let qty2Divide = isCalcTotalWithWq ? item.WqQuantityTarget : item.QuantityTarget;
							item.Quantity = item.QuantityTotal / qty2Divide / (item.QuantityFactor1 * item.QuantityFactor2 * item.QuantityFactor3 * item.QuantityFactor4 * item.ProductivityFactor);
							item.QuantityDetail = item.Quantity;
						}
					}
				}

				service.modifiedAssemblyTemplate = function (lineItem, mainItemList, field, assemblyItem, pastedContent,resourceList){
					let lineItemEntity = lineItem,
						assembly = assemblyItem ? assemblyItem : estimateMainCommonService.getSelectedLookupItem(),
						projectInfo = estimateMainService.getSelectedProjectInfo(),
						projectId = projectInfo.ProjectId ? projectInfo.ProjectId : estimateMainService.getSelectedProjectId();

					if (lineItemEntity && lineItemEntity.EstAssemblyFk) {
						// TO DO: copy character1 and character2 to line item form assembly
						$injector.get('estimateMainCharacteristicCommonService').copyCharacter1AssemblyToLineItem(estimateMainService, assembly, lineItemEntity);
						$injector.get('estimateMainCharacteristicCommonService').copyCharacter2AssemblyToLineItem(estimateMainService, assembly, lineItemEntity);

						let estimateRuleComplexLookupCommonService = $injector.get('estimateRuleComplexLookupCommonService');

						let lookupItems = _.isArray(lineItemEntity.RuleAssignment) ? lineItemEntity.RuleAssignment : lineItemEntity.RuleAssignment ? [lineItemEntity.RuleAssignment] : [];
						let ls2RuleData = {
							PrjEstRulesToSave : lookupItems,
							LSItemId : lineItemEntity.IsRoot ? lineItemEntity.EstHeaderFk : lineItemEntity.Id,
							LSName : 'EstLineItems',
							ProjectId : projectId,
							EstHeaderId : estimateMainService.getSelectedEstHeaderId()
						};

						let promises = [];
						promises.push(estimateMainCommonService.checkIfResourceCanBeDeleted(lineItemEntity.Id, lineItemEntity.BasUomFk, assembly.BasUomFk, lineItemEntity.EstHeaderFk));
						promises.push(estimateRuleComplexLookupCommonService.canDeleteLS2RuleItems(ls2RuleData));

						// clear all resources under this lineitem if system option "Overwrite line item when change assembly template" = true
						return $q.all(promises).then(function () {
							let responseData = promises[0].$$state.value.data;
							let overwrite = {
								canResOverwrite: responseData && responseData.CanOverwrite,
								overwriteFlag: responseData && responseData.OverwrideFlag,
								canRuleOverwrite: promises[1].$$state.value.data,
								hasSameUom: responseData && responseData.HasSameUom
							};

							if (overwrite && !overwrite.canResOverwrite) {
								platformModalService.showMsgBox(responseData.ErrorMessage, '', 'warning');
							}
							return assignAssemblyTo(lineItem, lineItemEntity, assembly, projectId, field, mainItemList, overwrite, pastedContent,resourceList);
						});
					}else{
						return $q.when();
					}
				};

				return service;

			}]);
})();
