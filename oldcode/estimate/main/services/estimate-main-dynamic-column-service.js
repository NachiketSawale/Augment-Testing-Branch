/**
 * Created by xia on 2/22/2016.
 */
(function(angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDynamicColumnService', [
		'$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService', 'estimateMainService', 'estimateMainExchangeRateService', 'estimateMainResourceConfigurationService',
		'estimateMainStandardConfigurationService', 'estimateMainResourceService', 'estimateMainCommonService', 'estimateMainConfigDetailService', 'estimateMainDynamicColumnFilterService', 'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService', 'estimateMainCombinedLineItemClientService',
		'_',
		function (
			$http, $q, $injector, globals, platformGridAPI, platformTranslateService, estimateMainService, estimateMainExchangeRateService, estimateMainResourceConfigurationService,
			estimateMainStandardConfigurationService, estimateMainResourceService, estimateMainCommonService, estimateMainConfigDetailService, estimateMainDynamicColumnFilterService, basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService, estimateMainCombinedLineItemClientService, _) {
			let service = {};
			let dynamicColumn = [];
			let dyAndCharCols = [];
			let defaultCharacteristics = [];
			let fieldTag = 'ConfDetail';
			let lineItemGridId = '681223e37d524ce0b9bfa2294e18d650';
			let combineLineItemGridId = 'b46b9e121808466da59c0b2959f09960';
			let sectionId = 28;

			// the flag for line item list requests to server
			let dynamicColumnDataCache = [];
			let dynamicColumnTitleCache = [];

			function setDyAndCharCols(dynCols){
				dyAndCharCols = angular.copy(dynCols);
			}

			function setDefaultCharacteristics(defaultItems){
				defaultCharacteristics = defaultItems;
			}

			function getDefaultCharacteristics(){
				return defaultCharacteristics;
			}

			function setDynamicColums(value) {
				dynamicColumn = value;
			}

			let notAssignedField = platformTranslateService.translateGridConfig({
				id: 'NotAssignedCostTotal',
				field: 'NotAssignedCostTotal',
				name: 'Not Assigned Cost Total',
				name$tr$: 'estimate.main.columnEstimateNotAssignedCostTotal',
				formatter: 'money',
				readonly: true,
				grouping:{
					title: 'Not Assigned Cost Total',
					title$tr$: 'estimate.main.columnEstimateNotAssignedCostTotal',
					getter: 'NotAssignedCostTotal',
					aggregators: [],
					aggregateCollapsed: true
				},
				columnid: 1000
			});

			let estResourceStandardConfig = getEstResourceStandardConfig();
			let estLineItemStandardConfig = getEstLineItemStandardConfig();

			function getEstResourceStandardConfig() {

				let standardConfig = estimateMainResourceConfigurationService.getStandardConfigForListView();

				if (!standardConfig.isTranslated) {

					platformTranslateService.translateGridConfig(standardConfig.columns);

					standardConfig.isTranslated = true;
				}

				return standardConfig;
			}

			function getEstLineItemStandardConfig() {

				let standardConfig = estimateMainStandardConfigurationService.getStandardConfigForListView();

				if (!standardConfig.isTranslated) {

					platformTranslateService.translateGridConfig(standardConfig.columns);

					standardConfig.isTranslated = true;
				}

				return standardConfig;
			}

			// whether the column is dynamic created
			function isDynamicColumn(columnId) {

				return !!_.find(dynamicColumn, {field: columnId});
			}

			// to create column by column type
			function getColumnConfigInfo(item, columnConfig) {
				let columnDetail = {};
				// match the config field to the resource grid column
				// id: column id
				let id = estimateMainConfigDetailService.getIdByColumnId(item.ColumnId);
				if (id !== null) {
					let columnInfo = _.find(columnConfig, {id: id});
					if (columnInfo !== undefined && columnInfo !== null) {
						columnDetail = columnInfo;
						if (item.LineType !== 1) {
							if (id === 'code') {
								columnDetail.editor = 'lookup';
								columnDetail.editorOptions.directive = 'estimate-main-material-lookup';
								columnDetail.editorOptions.lookupOptions.lookupField = fieldTag + item.Id;
								columnDetail.editorOptions.lookupOptions.displayMember = 'Code';
								columnDetail.editorOptions.lookupOptions.valueMember = 'Id';
								columnDetail.editorOptions.lookupOptions.isTextEditable = false;
								columnDetail.editorOptions.lookupOptions.materialFkField = fieldTag + item.Id;

								let formatter1 = {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'MaterialRecord',
										displayMember: 'Code',
										dataServiceName: 'estimateMainMaterialFastInputDataService',
									}
								};
								angular.extend(columnDetail, formatter1);
							}
						}
					}

					if (estimateMainConfigDetailService.isReadonly(id)) {
						columnDetail.readonly = true;
					}
				}

				columnDetail.id = fieldTag + item.Id;
				columnDetail.field = fieldTag + item.Id;
				columnDetail.name = item.DescriptionInfo.Description;
				columnDetail.name$tr$ = undefined;
				columnDetail.columnid = item.Id;
				columnDetail.isDynamic = true;
				columnDetail.sortable = true;
				columnDetail.required = false;
				columnDetail.hidden = false;
				columnDetail.bulkSupport = true;
				if (columnDetail.readonly === true) {
					columnDetail.editor = null;
				}
				if (columnDetail.validator) {
					delete columnDetail.validator;
				}
				if (columnDetail.asyncValidator) {
					delete columnDetail.asyncValidator;
				}

				columnDetail.asyncValidator = function(entity, value, model) {
					let defer = $q.defer();

					if (entity.CombinedLineItems && entity.CombinedLineItems.length){
						defer.resolve(true);
						return defer.promise;
					}

					let estimateMainService = $injector.get('estimateMainService');
					let column = _.find(dynamicColumn, {field: model});
					entity[model] = value;

					service.extendColumnValueChange(column, entity).then(function () {
						if (estimateMainService.isMdcCostCodeLookupLoaded()) {
							defer.resolve(true);
						}

						let estimateMainOnlyCostCodeAssignmentDetailLookupDataService = $injector.get('estimateMainOnlyCostCodeAssignmentDetailLookupDataService');
						estimateMainOnlyCostCodeAssignmentDetailLookupDataService.getList().then(function () {
							estimateMainService.setMdcCostCodeLookupLoaded(true);
							defer.resolve(true);
						});
					});

					return defer.promise;
				};

				return columnDetail;
			}

			// get the resources of lineItem(if it reference to other lineItem, then return the reference lineitem resources)
			function getLineItemResources(lineItem, estLineItemList, estResourceList) {

				// get the root parent lineitem id, (if no parent lineitem, return itself id)
				function getParentId(lineItem, estLineItemList) {

					if (lineItem.EstLineItemFk === null) {
						return lineItem.Id;
					} else {
						let parent = _.find(estLineItemList, {Id: lineItem.EstLineItemFk});

						if (parent !== null) {
							return getParentId(parent, estLineItemList);
						} else {
							return lineItem.Id;
						}
					}
				}

				// get the resources of lineItem(if it reference to other lineItem, then get the reference lineItem resources)
				function getResources(lineItem, estLineItemList, estResourceList) {

					if (lineItem.EstLineItemFk === null) {
						if (estResourceList &&  angular.isDefined(estResourceList[lineItem.Id])) {
							return estResourceList[lineItem.Id];
						}
					} else {
						let parentId = getParentId(lineItem, estLineItemList);
						if (angular.isDefined(estResourceList[parentId])) {
							let resources = angular.copy(estResourceList[parentId]);

							return resources;
						}
					}

					return [];
				}

				if (lineItem === null || estLineItemList === null || estResourceList === null) {
					return [];
				}

				return getResources(lineItem, estLineItemList, estResourceList);
			}

			function loadDynamicColumnData(lineItemList, estResourceList) {

				if (lineItemList !== undefined && lineItemList !== null) {

					_.forEach(lineItemList, function (item) {

						if (item.EstLineItemFk === null) {

							let resources = getLineItemResources(item, lineItemList, estResourceList);

							estimateMainCommonService.calculateExtendColumnValuesOfLineItem(item, resources);

						}
					});
				}
			}

			service.getResourcesOfLineItem = function(lineItem, resources) {
				const resourcesOfCurrentLineItem = resources && resources.length ? _.filter(resources, {EstLineItemFk: lineItem.Id, EstHeaderFk: lineItem.EstHeaderFk}) : [];
				if (resourcesOfCurrentLineItem.length) {
					return $q.when({
						resources : resources,
						isLoaded : true
					});
				}
				let postData = {
					estLineItemFks: [lineItem.Id],
					estHeaderFk: estimateMainService.getSelectedEstHeaderId(),
					projectId: estimateMainService.getProjectId()
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbylineitems', postData).then(function(response) {
					const dtos = response && response.data && response.data.dtos ? response.data.dtos : [];
					// load user defined column value
					let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
					let udpData = response && response.data && response.data.dynamicColumns && _.isArray(response.data.dynamicColumns.ResoruceUDPs) ? response.data.dynamicColumns.ResoruceUDPs : [];
					if (udpData.length > 0) {
						estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(dtos, udpData, false);
					}
					return {
						resources : dtos,
						isLoaded : false
					};
				});
			};

			service.createNewResourceEx = function(resCreationData){
				return estimateMainResourceService.createItemEx(resCreationData.selectedLineItem, function(responseData, data, creationData){
					if(resCreationData.isResourcesLoaded && data.onCreateSucceeded){
						return data.onCreateSucceeded(responseData, data, creationData);
					}else{
						estimateMainResourceService.markAsModifiedEx(responseData);
						return responseData;
					}
				});
			};



			// when modify the dynamic column ,then update the resource
			/* jshint -W074 */
			service.extendColumnValueChange = function (column, selectedLineItem) {

				let mainItemList = estimateMainService.getList(),
					estResources = estimateMainResourceService.getList();

				let result = $q.when([]);

				let col = column.field;

				let columnConfigDetail = estimateMainConfigDetailService.getColumnConfigDetails();
				let configDetail = getConfigDetialById(column);

				let columnField = getColumnField(column);
				if (selectedLineItem.EstHeaderFk < 1 || selectedLineItem.Id < 1 || configDetail === null || columnField === null) {
					return result;
				}

				let fieldName = estimateMainConfigDetailService.getFieldByColumnId(configDetail.ColumnId);
				if (fieldName === null) {
					return result;
				}

				if (fieldName === 'CostUnit') {
					configDetail.CostUnit = selectedLineItem[col];
				}
				else {
					configDetail.DynamicValue = selectedLineItem[col];
				}

				// if code change ,modify all the MdcMaterialFk in the columnConfigDetail with the same MaterialLineId
				configDetail.MdcMaterialFk = null;
				if (configDetail.LineType === 2) {
					let materialType = _.find(columnConfigDetail, {
						ColumnId: 1,
						MaterialLineId: configDetail.MaterialLineId
					});
					if (materialType) {
						configDetail.MdcMaterialFk = selectedLineItem[fieldTag + materialType.Id];

						if(!configDetail.MdcMaterialFk){
							return result;
						}
					}else{
						return result;
					}

					if (configDetail.ColumnId === 1) {
						_.forEach(columnConfigDetail, function (materialItem) {
							if (materialItem.MaterialLineId === configDetail.MaterialLineId) {
								materialItem.MdcMaterialFk = selectedLineItem[columnField.field];
							}
						});
					}
				}

				calculateDynamicColumnDetail(selectedLineItem, col, configDetail);

				return service.getResourcesOfLineItem(selectedLineItem, estResources).then(function(response) {
					const resourcesOfCurrentLineItem = response.resources;
					const resourceCloned = [...resourcesOfCurrentLineItem];
					let resourceList = _.filter(resourcesOfCurrentLineItem, {EstRuleSourceFk: null});
					let resList;

					const resCreationData = {
						resourceList : resourceList,
						lineItemList : mainItemList,
						selectedLineItem : selectedLineItem,
						projectInfo : estimateMainService.getSelectedProjectInfo(),
						configDetail : configDetail,
						isResourcesLoaded : response.isLoaded
					};

					// if current resource is cost code
					if (configDetail.LineType === 1) {
						if (configDetail.MdcCostCodeFk === null) {
							return result;
						}
						resList = $injector.get('estimateMainColumnConfigService').getResourcesByCostCode(resourceList, columnConfigDetail, configDetail.MdcCostCodeFk);

						// Dynamic column is going to take line item JobFk to get correct cost unit for costCode
						let resMock = { LgmJobFk: estimateMainService.getLgmJobId({EstLineItemFk: selectedLineItem.Id, EstHeaderFk: selectedLineItem.EstHeaderFk }) };
						resMock.MdcCostCodeFk = configDetail.IsCustomProjectCostCode ? null : configDetail.MdcCostCodeFk;

						return $injector.get('estimateMainJobCostcodesLookupService').getEstCCByIdAsyncByJobId(configDetail.MdcCostCodeFk, resMock).then(function(responseDataCostCode){
							//if user have move to another lineItem, then the resources in resource data service will be clear. we should use the resource cloned.
							const resourcesToCalculate = getResourcesToCalculate(selectedLineItem, resourcesOfCurrentLineItem, resourceCloned);
							if (resList.length === 0) {
								// create new resource
								resCreationData.fieldName = fieldName;
								resCreationData.fieldValue = selectedLineItem[columnField.field];
								resCreationData.columnField = columnField;

								resCreationData.currentCostCode = responseDataCostCode;
								return createNewResource(resCreationData);
							} else if (resList.length === 1) {
								// modify first record
								let currentResource = resList[0];
								currentResource[fieldName] = selectedLineItem[columnField.field];
								setOriginalValue(currentResource);
								updateSelectedResource(fieldName, currentResource, resourcesToCalculate, mainItemList, selectedLineItem, columnField);
							} else {
								// if field is detail, get the relate field and get the value
								let calculatedValue = estimateMainDynamicColumnFilterService.calculateDetailValue(selectedLineItem[columnField.field]);
								let realFieldName = estimateMainDynamicColumnFilterService.getTheRelateField(fieldName);
								resCreationData.fieldName = realFieldName;
								resCreationData.fieldValue = calculatedValue - _.sumBy(resList, realFieldName);
								resCreationData.currentCostCode = responseDataCostCode;
								resCreationData.columnField = columnField;
								return createNewResource(resCreationData);
							}
							return result;
						});
					} else {
						resList = _.filter(resourceList, {
							EstHeaderFk: selectedLineItem.EstHeaderFk,
							EstLineItemFk: selectedLineItem.Id,
							ColumnId: configDetail.MaterialLineId
						});
						const resourcesToCalculate = getResourcesToCalculate(selectedLineItem, resourcesOfCurrentLineItem, resourceCloned);
						if (angular.isDefined(resList) && resList.length > 0) {
							// modify current resource
							let currentRes = resList[0];
							if (configDetail.ColumnId === 1) {
								if(estimateMainCommonService.getSelectedLookupItem()){
									estimateMainCommonService.setSelectedCodeItem(fieldName, currentRes, true);
									setOriginalValue(currentRes);
									updateSelectedResource(fieldName, currentRes, resourcesToCalculate, mainItemList, selectedLineItem, columnField);
								}else{
									estimateMainResourceService.deleteItem(estimateMainResourceService.getItemById(currentRes.Id));
									// refresh lineItems after delete resource
									refreshLineItem(selectedLineItem);
								}
								currentRes.ColumnId = configDetail.MaterialLineId;
							} else {
								currentRes[fieldName] = selectedLineItem[columnField.field];
								currentRes.ColumnId = configDetail.MaterialLineId;
								setOriginalValue(currentRes);
								updateSelectedResource(fieldName, currentRes, resourcesToCalculate, mainItemList, selectedLineItem, columnField);
							}
							return result;
						} else {
							// create new resource
							resCreationData.fieldName = fieldName;
							resCreationData.fieldValue = selectedLineItem[columnField.field];
							resCreationData.columnField = columnField;
							return createNewResource(resCreationData);
						}
					}
				});

				function getResourcesToCalculate(selectedLineItem, sourceRes, clonedRes){
					return estimateMainResourceService.isLineItemSelectedUnChange(selectedLineItem) ? sourceRes : clonedRes;
				}

				function setOriginalValue(resource) {
					if( resource.Version === 0){
						resource.CostUnitOriginal = resource.CostUnit;
					}

					if(resource.Version === 0){
						resource.QuantityOriginal = resource.Quantity;
					}
				}

				function getConfigDetialById(column) {
					let columnId = column.columnid;
					if (!angular.isDefined(columnId) && columnId === null) {
						return null;
					}
					return estimateMainConfigDetailService.getConfigDetialById(columnId);
				}

				function getColumnField(column) {
					let columnId = column.columnid;
					if (!angular.isDefined(columnId) && columnId === null) {
						return;
					}
					return _.find(dynamicColumn, {columnid: columnId});
				}

				function calculateDynamicColumnDetail(selectedLineItem, colName, configDetail) {

					let resFieldName = estimateMainConfigDetailService.getFieldByColumnId(configDetail.ColumnId);

					let union = estimateMainDynamicColumnFilterService.getMap2DetailUnion();

					// eslint-disable-next-line no-prototype-builtins
					if (union.hasOwnProperty(resFieldName)) {

						let invertFieldId = estimateMainConfigDetailService.getColumnIdByField(union[resFieldName]);

						if (invertFieldId > -1) {

							let currentConfigDetial = _.find(estimateMainConfigDetailService.getColumnConfigDetails(), {
								ColumnId: invertFieldId,
								LineType: configDetail.LineType,
								MaterialLineId: configDetail.MaterialLineId,
								MdcCostCodeFk: configDetail.MdcCostCodeFk
							});

							if (angular.isDefined(currentConfigDetial) && currentConfigDetial !== null) {

								selectedLineItem[fieldTag + currentConfigDetial.Id] = estimateMainDynamicColumnFilterService.calculateDetailValue(selectedLineItem[colName]);
							}
						}
					}
				}
			};

			function createNewResource(resCreationData) {
				return estimateMainExchangeRateService.loadData(resCreationData.projectInfo.ProjectId).then(function () {
					estimateMainResourceService.deselect();
					return service.createNewResourceEx(resCreationData);
				}).then(function (response) {
					resCreationData.resourceList.push(response);
					// 1,set the current cost code properties to  new resource
					estimateMainConfigDetailService.addExtendData(response, resCreationData.fieldName, resCreationData.fieldValue, resCreationData.configDetail, resCreationData.currentCostCode);
					let lookupItem = estimateMainConfigDetailService.getSelectedLookupItem();
					response.ExchangeRate = response.ExchangeRate ? response.ExchangeRate : estimateMainExchangeRateService.getExchRate(lookupItem.BasCurrencyFk);
					// 2,to set more detail to new resource
					if ([1, 2, 4].indexOf(response.EstResourceTypeFk) > -1) {
						estimateMainCommonService.setSelectedCodeItem(resCreationData.fieldName, response, true, lookupItem);
					}
					// 3,set the fill in value to resource
					if (resCreationData.configDetail.ColumnId !== 1) {
						response[resCreationData.fieldName] = resCreationData.fieldValue;
					}
					// the type of image processor
					$injector.get('estimateMainResourceImageProcessor').processItem(response);

					if (response.MdcCostCodeFk || response.MdcMaterialFk) {
						// Clear validation error
						let estimateMainResourceValidationService = $injector.get('estimateMainResourceValidationService');

						$injector.get('platformDataValidationService').removeFromErrorList(response, 'Code', estimateMainResourceValidationService, estimateMainResourceService);
						// calculate new resource and the dynamic column in line item
						service.calculateResource(resCreationData.fieldName, response, resCreationData.resourceList, resCreationData.selectedLineItem, null, resCreationData.currentCostCode, resCreationData.columnField).then(function () {
							/* set original value */
							if (response.Version === 0) {
								response.CostUnitOriginal = response.CostUnit;
							}

							if (response.Version === 0) {
								response.QuantityOriginal = response.Quantity;
							}
							refreshLineItem(resCreationData.selectedLineItem, resCreationData.lineItemList, resCreationData.resourceList);
						});
					} else {
						refreshLineItem(resCreationData.selectedLineItem, resCreationData.lineItemList, resCreationData.resourceList);
					}

					// after refresh lineItem Grid, active cell will lose focus
					let gridLineItem = platformGridAPI.grids.element('id', estimateMainService.getGridId());
					if (gridLineItem && gridLineItem.instance){
						let activeCell = gridLineItem.instance.getActiveCell();
						if(activeCell){
							$injector.get('$timeout')(function (){
								gridLineItem.instance.setCellFocus(activeCell.row, activeCell.cell, true);
							});

						}
					}
					
					return [];
				});
			}

			function updateSelectedResource(fieldName, selectedResource, resourceList, lineItemList, selectedLineItem, columnField) {

				service.calculateResource(fieldName, selectedResource, resourceList, selectedLineItem, null, null, columnField).then(function (resChanged) {
					resChanged.push(selectedResource);

					const isResourceLoaded = estimateMainResourceService.isResourcesLoaded(selectedLineItem);

					//mark current resource as modified
					resChanged.forEach(function (res) {
						if(isResourceLoaded){
							estimateMainResourceService.markItemAsModified(selectedResource);
						}else{
							estimateMainResourceService.markAsModifiedEx(res);
						}
					});

					/* render lineItem and resources */
					refreshLineItem(selectedLineItem, lineItemList, resourceList);
				});
			}

			function refreshLineItem(selectedLineItem) {
				estimateMainResourceService.gridRefresh();
				estimateMainService.fireItemModified(selectedLineItem);
				// when modify the lineitem ,not refresh the reference lineitem immediately.
				// after lineitem rowchange , refresh it
				estimateMainService.gridRefresh();
			}

			function reloadDynamicColumnAndData(isActive) {
				if (isActive){
					return appendDynamicColumnData();
				}else{
					return $q.when([]);
				}
			}

			function reloadDynamicCombineLineItemColumnAndData() {
				appendDynamicCombineColumnData();
				asyncLoadDynamicCombineColumns();
				refreshCharacteristicCodeLookup();
			}

			function sendColumnDataRequest(url, $requestData) {
				return $http.post(url, $requestData);
			}

			function getStaticColumns() {
				let loadedCols = {};
				let originalCols = angular.copy(estLineItemStandardConfig.columns || []);
				// current = hidden + visible;
				// current: all loaded columns
				let columns = platformGridAPI.columns.configuration(lineItemGridId);
				let currentColumns = (columns || {}).current || [];
				_.map(currentColumns, function (col) {
					let colId = col.id;
					if (!_.isEmpty(colId)) {
						loadedCols[colId] = col;
					}
				});
				let modifiedCols = _.map(originalCols, function (oriCol) {
					let colId = oriCol.id;
					if (!_.isEmpty(colId) && loadedCols[colId]) {
						oriCol = _.merge(oriCol, loadedCols[colId]);
					}
					return oriCol;
				});

				// fix issue that the group column will disappear after clicking refresh button
				if(columns && columns.visible){
					let groupColumn = _.find(columns.visible, {id:'group',field:'group'});
					if(groupColumn){
						modifiedCols.push(groupColumn);
					}
				}

				return angular.copy(modifiedCols);
			}

			function setCharactColsReadOnly(charactCols){
				let itemList = estimateMainService.getList();
				let fieldCharacts = [];
				angular.forEach(charactCols, function(charact){
					let field = {field: charact.field , readonly: false};
					fieldCharacts.push(field);
				});

				angular.forEach(itemList, function(item){
					if(item && item.EstRuleSourceFk) {
						$injector.get('platformRuntimeDataService').readonly(item, fieldCharacts);
					}
				});


			}

			function asyncLoadDynamicColumns() {

				let estHeaderId = estimateMainService.getSelectedEstHeaderId() || -1;
				let qDefer = $q.defer();
				if (estHeaderId >= -1) {
					// $http.post(
					sendColumnDataRequest(
						globals.webApiBaseUrl + 'estimate/main/columnconfigdetail/getitemsbyestheader',
						{Id: estHeaderId},
						dynamicColumnTitleCache).then(
						function (response) {
							dynamicColumnTitleCache = response;
							let infoData = response.data || {};
							// set the dynamic columns information: main, cost codes, materialView lookup, dynamic columns matching relation data
							estimateMainConfigDetailService.setInfo(infoData);

							let cols = generateDynamicColumns(infoData.Main);

							let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
							estMainStandardDynamicService.attachData({'estConfig': cols});

							let estMainCombinedStandardDynamicService = $injector.get('estimateMainCombinedLineItemDynamicConfigurationService');
							estMainCombinedStandardDynamicService.attachData({'estConfig': cols});

							let qtyServiceCols = $injector.get('estimateMainDynamicQuantityColumnService').getDynamicQuantityColumns();
							estMainStandardDynamicService.attachData({'estQuantityCols': qtyServiceCols});

							let qtyCombinedServiceCols = $injector.get('estimateMainCombinedLineItemDynamicConfigurationService').getDynamicQuantityColumns();
							estMainCombinedStandardDynamicService.attachData({'estQuantityCols': qtyCombinedServiceCols});

							estMainStandardDynamicService.fireRefreshConfigLayout();
							estMainCombinedStandardDynamicService.fireRefreshConfigLayout();

							qDefer.resolve(cols);
						},
						function (/* error */) {
							qDefer.resolve([]);
						}
					);
				} else {
					qDefer.resolve([]);
				}
				return qDefer.promise;
			}

			function asyncLoadDynamicCombineColumns() {
				function refreshColumns(resColumnConfigDto) {
					estimateMainCommonService.generateCharacteristicColumns(estimateMainCombinedLineItemClientService, sectionId).then(function (data) {
						estimateMainCommonService.appendCharactiricColumnData(data, estimateMainCombinedLineItemClientService);
						// charactiric culomn
						let charactCols = estimateMainCommonService.getCharactCols(data);
						// culomn cinfig
						let dyCols = _.values(generateDynamicColumns(resColumnConfigDto));
						dyCols = dyCols.concat($injector.get('estimateMainDynamicQuantityColumnService').getDynamicQuantityColumns());
						dyAndCharCols = dyCols.concat(charactCols); // column config and caracteristic column

						estimateMainCombinedLineItemClientService.setDynamicColumns(dyAndCharCols); // Dynamic columns are saved to cache,they are used when editing the layout view, or change from one view to another

						service.resizeCombineLineItemGrid();
						// when the line item was genarated by rule, set the charact cols editable
						if(charactCols && charactCols.length > 0){
							setCharactColsReadOnly(charactCols);
						}
						return dyCols;
					});
				}

				let estHeaderId = estimateMainService.getSelectedEstHeaderId() || -1;
				let qDefer = $q.defer();
				if (estHeaderId >= -1) {
					// $http.post(
					sendColumnDataRequest(
						globals.webApiBaseUrl + 'estimate/main/columnconfigdetail/getitemsbyestheader',
						{Id: estHeaderId},
						dynamicColumnTitleCache).then(
						function (response) {
							dynamicColumnTitleCache = response;
							let infoData = response.data || {};
							// set the dynamic columns information: main, cost codes, materialView lookup, dynamic columns matching relation data
							estimateMainConfigDetailService.setInfo(infoData);
							let cols = refreshColumns(infoData.Main);
							qDefer.resolve(cols);
						},
						function (/* error */) {
							qDefer.resolve([]);
						}
					);
				} else {
					qDefer.resolve([]);
				}
				return qDefer.promise;
			}

			function refreshCharacteristicCodeLookup(){
				let basicsCharacteristicCodeLookupService = $injector.get('basicsCharacteristicCodeLookupService');
				basicsCharacteristicCodeLookupService.refresh(sectionId);
			}

			function appendColumnData(listData, resources, resColumnConfigDto) {
				// calculation
				loadDynamicColumnData(listData, resources);

				// reference items
				let fieldList = resColumnConfigDto.map(function (item) {
					return {field: fieldTag + item.Id};
				});
				estimateMainConfigDetailService.setRefLineItemDynamicColumnReadonly(listData, fieldList, true);

				estimateMainService.gridRefresh();
			}

			function appendCombineColumnData(listData, resources, resColumnConfigDto) {
				// calculation
				loadDynamicColumnData(listData, resources);

				// reference items
				let fieldList = resColumnConfigDto.map(function (item) {
					return {field: fieldTag + item.Id};
				});
				estimateMainConfigDetailService.setRefLineItemDynamicColumnReadonly(listData, fieldList, true);

				estimateMainCombinedLineItemClientService.gridRefresh();
			}

			function appendExtendColumnValuesToLineItem(lineItems, extendColumcValues){
				_.forEach(lineItems, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(extendColumcValues.hasOwnProperty(item.Id)){
						let extendColumnValueOfLineItem = extendColumcValues[item.Id];

						if(extendColumnValueOfLineItem){
							_.forEach(extendColumnValueOfLineItem, function(columnValue, key){
								item[key] = columnValue.Value;
								// Custom extended property for line item entity, this is to keep track when we set readonly in the processor
								item['__' + key] = {columnName: key, recordsInfo: columnValue};
								// setExtendColumnReadonly(item, key, columnValue);
							});
						}
					}
				});
			}

			function appendDynamicColumnData(items) {

				let qDefer = $q.defer();
				if (!estimateMainService) {
					qDefer.resolve([]);
					return qDefer.promise;
				}
				let estHeaderId = parseInt(estimateMainService.getSelectedEstHeaderId() || -1),
					lineItems = items ? items : estimateMainService.getList() || [];
				if (estHeaderId > -1 && lineItems.length > 0) {
					let dynamicLineItemsData = {
						lineItemIds: _.map(lineItems, 'Id'),
						estHeaderFk: estHeaderId,
						EstColumnConfigFk: estimateMainService.getSelectedEstHeaderColumnConfigFk(),
						PrjProjectFk: estimateMainService.getSelectedProjectId()
					};

					// send request to server
					// $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/columnestimatelineitem2resources', dynamicLineItemsData).then(
					sendColumnDataRequest(
						globals.webApiBaseUrl + 'estimate/main/lineitem/columnestimatelineitem2resources',
						dynamicLineItemsData,
						dynamicColumnDataCache).then(
						function (response) {
							dynamicColumnDataCache = response;
							let respData = response.data || {},
								columnConfigInfo = respData.columnConfigInfo || {},
								lineItemResources = respData.Main,
								columnDetailItems = columnConfigInfo.Main || [];
							// set the dynamic columns information: main, cost codes, materialView lookup, dynamic columns matching relation data
							estimateMainConfigDetailService.setInfo(columnConfigInfo);
							appendColumnData(lineItems, lineItemResources, columnDetailItems);
							qDefer.resolve(lineItems);
						},
						function (/* error */) {
							qDefer.resolve(lineItems);
						}
					);

				} else {
					qDefer.resolve([]);
				}

				return qDefer.promise;
			}

			function appendDynamicCombineColumnData(items) {
				let qDefer = $q.defer();
				if (!estimateMainCombinedLineItemClientService) {
					qDefer.resolve([]);
					return qDefer.promise;
				}
				let estHeaderId = parseInt(estimateMainCombinedLineItemClientService.getSelectedEstHeaderId() || -1),
					lineItems = items ? items : estimateMainCombinedLineItemClientService.getList() || [];
				if (estHeaderId > -1 && lineItems.length > 0) {
					let dynamicLineItemsData = {
						lineItemIds: _.map(lineItems, 'Id'),
						estHeaderFk: estHeaderId,
						EstColumnConfigFk: estimateMainCombinedLineItemClientService.getSelectedEstHeaderColumnConfigFk(),
						PrjProjectFk: estimateMainCombinedLineItemClientService.getSelectedProjectId()
					};

					// send request to server
					// $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/columnestimatelineitem2resources', dynamicLineItemsData).then(
					sendColumnDataRequest(
						globals.webApiBaseUrl + 'estimate/main/lineitem/columnestimatelineitem2resources',
						dynamicLineItemsData,
						dynamicColumnDataCache).then(
						function (response) {
							dynamicColumnDataCache = response;
							let respData = response.data || {},
								columnConfigInfo = respData.columnConfigInfo || {},
								lineItemResources = respData.Main,
								columnDetailItems = columnConfigInfo.Main || [];
							// set the dynamic columns information: main, cost codes, materialView lookup, dynamic columns matching relation data
							estimateMainConfigDetailService.setInfo(columnConfigInfo);
							appendCombineColumnData(lineItems, lineItemResources, columnDetailItems);
							qDefer.resolve(lineItems);
						},
						function (/* error */) {
							qDefer.resolve(lineItems);
						}
					);

				} else {
					qDefer.resolve([]);
				}

				return qDefer.promise;
			}

			function generateDynamicColumns(responseColumnConfigDetailsDto) {
				let dynamicColumns = [];
				let configDetailColumns = responseColumnConfigDetailsDto || [];
				// dynamic cols
				configDetailColumns.map(function (item) {
					// let newId = fieldTag + item.Id;
					dynamicColumns.push(getColumnConfigInfo(item, angular.copy(estResourceStandardConfig.columns)));
				});
				// add not assigned field
				if (configDetailColumns.length > 0) { // if the column config is active and there are configured columns
					// dynamicColumns.NotAssignedCostTotal = notAssignedField;
					dynamicColumns.push(notAssignedField);
				}

				// Set to cache
				setDynamicColums(dynamicColumns);

				return dynamicColumns;
			}

			service.isExistColumn = function isExistColumn(idorField) {
				let colData = _.filter(dyAndCharCols, {'id': idorField});
				if (!colData || (colData && colData.length === 0)) {
					return false;
				}
				return true;
			};

			service.addColumn = function addColumn(item, columnIdorField, columnName) {
				let charCol = estimateMainCommonService.createCharactCol(item, columnIdorField, columnName);
				let charCols = [];
				charCols.push(charCol);
				if (!dyAndCharCols){
					dyAndCharCols = [];
				}
				dyAndCharCols = dyAndCharCols.concat(charCols);
				estimateMainService.setDynamicColumns(dyAndCharCols); // Dynamic columns are saved to cache,they are used when editing the layout view, or change from one view to another
			};

			service.removeColumn = function removeColumn(oldIdorField) {
				dyAndCharCols = _.filter(dyAndCharCols, function (col) {
					return col.id !== oldIdorField;
				});
				estimateMainService.setDynamicColumns(dyAndCharCols); // Dynamic columns are saved to cache,they are used when editing the layout view, or change from one view to another
			};

			service.addQuantityColumn = function addQuantityColumn(col) {
				if(!service.isExistColumn(col.Field)){
					let qtyCols = _.isArray(col) ? col : [col];
					dyAndCharCols = dyAndCharCols.concat(qtyCols);
					estimateMainService.setDynamicColumns(dyAndCharCols); // Dynamic columns are saved to cache,they are used when editing the layout view, or change from one view to another
				}
			};

			service.resizeLineItemGrid = function resizeLineItemGrid() {
				let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
				estMainStandardDynamicService.fireRefreshConfigLayout();
			};

			service.resizeCombineLineItemGrid = function resizeCombineLineItemGrid() {
				if(true === platformGridAPI.grids.exist(combineLineItemGridId))
				{
					platformGridAPI.columns.configuration(combineLineItemGridId, getStaticColumns().concat(dyAndCharCols));
					platformGridAPI.configuration.refresh(combineLineItemGridId);
					platformGridAPI.grids.resize(combineLineItemGridId);
				}
			};

			// calculation for Resource container
			/* jshint -W098 */ // keep it for future use
			service.calculateResource = function calculateResource(col, currentResItem, resItemList, parentLineItem, lookupItem, costcode, columnField) { // jshint ignore:line

				return handleDetailField(col, columnField, currentResItem, parentLineItem).then(function () {
					// costcode = 1, material = 2, plant = 3, assembly = 4, subitem = 5
					if ([1, 2, 4].indexOf(currentResItem.EstResourceTypeFk) > -1) {
						estimateMainCommonService.setSelectedCodeItem(col, currentResItem, true, lookupItem);
					}

					const resChanged = estimateMainCommonService.calculateResource(currentResItem, parentLineItem, resItemList);

					estimateMainCommonService.calculateExtendColumnValuesOfLineItem(parentLineItem, resItemList, costcode);

					return resChanged;
				});
			};

			service.isDynamicColumn = isDynamicColumn;

			service.setLineItemReadOnly = function setLineItemReadOnly(itemList, isReadOnly) {
				estimateMainConfigDetailService.setRefLineItemDynamicColumnReadonly(itemList, dynamicColumn, isReadOnly);
			};

			function handleDetailField(fieldName, columnField, currentResource, selectedLineItem) {
				if(!estimateMainDynamicColumnFilterService.isDetailField(fieldName)){
					return $q.when();
				}
				let options = {
					itemName: 'EstLineItems',
					itemServiceName: 'estimateMainService',
					validItemName: 'EstLineItems',
					isBulkEdit: false
				};

				let value = selectedLineItem[columnField.field];
				if(!value){
					value = '';
				}
				return $injector.get('estimateMainCommonFeaturesService').getDetailsFormulaParameters(currentResource, value, fieldName, estimateMainResourceService, options);
			}

			service.reloadDynamicColumnAndData = reloadDynamicColumnAndData;
			service.reloadDynamicCombineLineItemColumnAndData = reloadDynamicCombineLineItemColumnAndData;
			service.appendDynamicColumnData = appendDynamicColumnData;
			service.appendDynamicCombineColumnData = appendDynamicCombineColumnData;
			service.asyncLoadDynamicColumns = asyncLoadDynamicColumns;
			service.asyncLoadDynamicCombineColumns = asyncLoadDynamicCombineColumns;

			service.generateDynamicColumns = generateDynamicColumns;
			service.appendColumnData = appendColumnData;
			service.appendCombineColumnData = appendCombineColumnData;
			service.appendExtendColumnValuesToLineItem = appendExtendColumnValuesToLineItem;
			service.setDyAndCharCols = setDyAndCharCols;
			service.setDefaultCharacteristics = setDefaultCharacteristics;
			service.getDefaultCharacteristics = getDefaultCharacteristics;
			service.getStaticColumns = getStaticColumns;
			return service;
		}]);
})(angular);
