/**
 * Created by xia on 2/22/2016.
 */
(function(angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainDynamicColumnService', [
		'$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService', 'estimateMainService', 'estimateMainExchangeRateService', 'constructionsystemMainResourceUIStandardService',
		'constructionsystemMainLineItemUIStandardService', 'constructionsystemMainResourceDataService', 'constructionsystemMainCommonService', 'constructionsystemMainConfigDetailService', 'estimateMainDynamicColumnFilterService', 'basicsLookupdataLookupDescriptorService',
		'_', 'estimateMainCommonService',
		function ($http, $q, $injector, globals, platformGridAPI, platformTranslateService, estimateMainService, estimateMainExchangeRateService, constructionsystemMainResourceUIStandardService,
			constructionsystemMainLineItemUIStandardService, constructionsystemMainResourceDataService, constructionsystemMainCommonService, constructionsystemMainConfigDetailService, estimateMainDynamicColumnFilterService, basicsLookupdataLookupDescriptorService,
			_, estimateMainCommonService) {
			var service = {};
			var dynamicColumn = [];
			var dyAndCharCols = [];
			var fieldTag = 'ConfDetail';
			var lineItemGridId = 'efec989037bc431187bf166fc31666a0';
			var sectionId = 28;

			// the flag for line item list requests to server
			// eslint-disable-next-line no-unused-vars
			var dynamicServerRequestFlag = false;
			var dynamicColumnDataCache = [];
			var dynamicColumnTitleCache = [];

			// eslint-disable-next-line no-unused-vars
			var CharacteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');

			function setDyAndCharCols(dynCols){
				dyAndCharCols = dynCols;
			}

			function setDynamicColums(value) {
				dynamicColumn = value;
			}

			var notAssignedField = platformTranslateService.translateGridConfig({
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

			var estResourceStandardConfig = getEstResourceStandardConfig();
			var estLineItemStandardConfig = getEstLineItemStandardConfig();

			function getEstResourceStandardConfig() {

				var standardConfig = constructionsystemMainResourceUIStandardService.getStandardConfigForListView();

				if (!standardConfig.isTranslated) {

					platformTranslateService.translateGridConfig(standardConfig.columns);

					standardConfig.isTranslated = true;
				}

				return standardConfig;
			}

			function getEstLineItemStandardConfig() {

				var standardConfig = constructionsystemMainLineItemUIStandardService.getStandardConfigForListView();

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
				var columnDetail = {};
				// match the config field to the resource grid column
				// id: column id
				var id = constructionsystemMainConfigDetailService.getIdByColumnId(item.ColumnId);
				if (id !== null) {
					var columnInfo = _.find(columnConfig, {id: id});
					if (columnInfo !== undefined && columnInfo !== null) {
						columnDetail = columnInfo;
						if (item.LineType === 1) {
							if (id === 'costunit') {
								var costCodeInfo = constructionsystemMainConfigDetailService.getCostCodeById(item.MdcCostCodeFk);
								if (angular.isDefined(costCodeInfo) && costCodeInfo !== null && angular.isDefined(costCodeInfo.IsRate) && costCodeInfo.IsRate) {
									columnDetail.readonly = true;
								}
							}
						} else {
							if (id === 'code') {
								columnDetail.editor = 'directive';
								columnDetail.editorOptions.directive = 'estimate-main-material-lookup';
								columnDetail.editorOptions.lookupField = fieldTag + item.Id;
								columnDetail.editorOptions.displayMember = 'Code';
								columnDetail.editorOptions.valueMember = 'Id';
								columnDetail.editorOptions.isTextEditable = false;
								columnDetail.editorOptions.materialFkField = fieldTag + item.Id;

								var formatter1 = {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'MaterialRecord',
										displayMember: 'Code'
									}
								};
								angular.extend(columnDetail, formatter1);
							}
						}
					}

					if (constructionsystemMainConfigDetailService.isReadonly(id)) {
						columnDetail.readonly = true;
					}
				}

				columnDetail.id = fieldTag + item.Id;
				columnDetail.field = fieldTag + item.Id;
				columnDetail.name = item.DescriptionInfo.Description;
				columnDetail.name$tr$ = undefined;
				columnDetail.columnid = item.Id;
				columnDetail.isDynamic = true;
				columnDetail.required = false;
				columnDetail.hidden = false;
				if (columnDetail.readonly === true) {
					columnDetail.editor = null;
				}
				if (columnDetail.validator) {
					delete columnDetail.validator;
				}
				if (columnDetail.asyncValidator) {
					delete columnDetail.asyncValidator;
				}

				return columnDetail;
			}

			// get the resources of lineItem(if it reference to other lineItem, then return the reference lineitem resources)
			function getLineItemResources(lineItem, estLineItemList, estResourceList) {

				// get the root parent lineitem id, (if no parent lineitem, return itself id)
				function getParentId(lineItem, estLineItemList) {

					if (lineItem.EstLineItemFk === null) {
						return lineItem.Id;
					} else {
						var parent = _.find(estLineItemList, {Id: lineItem.EstLineItemFk});

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
						var parentId = getParentId(lineItem, estLineItemList);
						if (angular.isDefined(estResourceList[parentId])) {
							var resources = angular.copy(estResourceList[parentId]);

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

			service.calculateLineItem = function calculateLineItem(lineItem, estResourceList) {

				constructionsystemMainResourceDataService.calLineItemDynamicColumns(lineItem, estResourceList, constructionsystemMainConfigDetailService.getColumnConfigDetails());

			};

			function loadDynamicColumnData(lineItemList, estResourceList) {

				if (lineItemList !== undefined && lineItemList !== null) {

					_.forEach(lineItemList, function (item) {

						if (item.EstLineItemFk === null) {

							var resources = getLineItemResources(item, lineItemList, estResourceList);

							constructionsystemMainResourceDataService.calLineItemDynamicColumns(item, resources, constructionsystemMainConfigDetailService.getColumnConfigDetails());

						}
					});
				}
			}

			// when modify the dynamic column ,then update the resource
			/* jshint -W074 */
			service.estimateLineItems = function (column, item, mainItemList, estResources, selectedLineItem) {
				var result = $q.when([]);

				var col = column.field;

				var resourceList = _.filter(estResources, {EstRuleSourceFk: null});

				var projectInfo = estimateMainService.getSelectedProjectInfo();
				// var item = (arg && arg.Id > 0) ? arg : arg.item;
				var columnConfigDetail = constructionsystemMainConfigDetailService.getColumnConfigDetails();
				var configDetail = getConfigDetialById(column);

				var columnField = getColumnField(column);
				if (selectedLineItem.EstHeaderFk < 1 || selectedLineItem.Id < 1 || configDetail === null || columnField === null) {
					return result;
				}

				var fieldName = constructionsystemMainConfigDetailService.getFieldByColumnId(configDetail.ColumnId);
				if (fieldName === null) {
					return result;
				}

				if (fieldName === 'CostUnit') {
					configDetail.CostUnit = selectedLineItem[col];
				}
				else {
					configDetail.DynamicValue = selectedLineItem[col];
				}

				var resList;

				// if code change ,modify all the MdcMaterialFk in the columnconfigdetail with the same MaterialLineId
				configDetail.MdcMaterialFk = null;
				if (configDetail.LineType === 2) {
					var materialType = _.find(columnConfigDetail, {
						ColumnId: 1,
						MaterialLineId: configDetail.MaterialLineId
					});
					if (materialType) {
						configDetail.MdcMaterialFk = selectedLineItem[fieldTag + materialType.Id];
					}

					if (configDetail.ColumnId === 1) {
						_.forEach(columnConfigDetail, function (materialItem) {
							if (materialItem.MaterialLineId === configDetail.MaterialLineId) {
								materialItem.MdcMaterialFk = item[columnField.field];
							}
						});
					}
				}

				calculateDynamicColumnDetail(item, col, configDetail);

				// if current resource is costcode
				if (configDetail.LineType === 1) {

					if (configDetail.MdcCostCodeFk === null) {
						return result;
					}

					resList = estimateMainDynamicColumnFilterService.filterResources(resourceList, columnConfigDetail).getResourceByCostCode(configDetail.MdcCostCodeFk);

					if (resList.length === 0) {
						// create new resource
						createNewResource(fieldName, item[columnField.field], estResources, mainItemList, selectedLineItem, projectInfo, configDetail);
					} else if (resList.length === 1) {
						// modify first record
						var currentResource = resList[0];
						currentResource[fieldName] = item[columnField.field];
						if( currentResource.Version === 0){
							currentResource.CostUnitOriginal = currentResource.CostUnit;
						}

						if(currentResource.Version === 0){
							currentResource.QuantityOriginal = currentResource.Quantity;
						}
						updateSelectedResource(fieldName, currentResource, estResources, mainItemList, selectedLineItem, projectInfo);
					} else {
						// if field is detail, get the relate field and get the value
						var calculatedValue = estimateMainDynamicColumnFilterService.calculateDetailValue(item[columnField.field]);
						var realFieldName = estimateMainDynamicColumnFilterService.getTheRelateField(fieldName);
						var diffValue = calculatedValue - _.sumBy(resList, realFieldName);

						return createNewResource(realFieldName, diffValue, estResources, mainItemList, selectedLineItem, projectInfo, configDetail);
					}
					return result;
				} else {
					resList = _.filter(resourceList, {
						EstHeaderFk: selectedLineItem.EstHeaderFk,
						EstLineItemFk: selectedLineItem.Id,
						ColumnId: configDetail.MaterialLineId
					});
					if (angular.isDefined(resList) && resList.length > 0) {
						// modify current resource
						var currentRes = resList[0];
						if (configDetail.ColumnId === 1) {

							if(estimateMainCommonService.getSelectedLookupItem()){
								estimateMainCommonService.setSelectedCodeItem(fieldName, currentRes, true);
								if( currentRes.Version === 0){
									currentRes.CostUnitOriginal = currentRes.CostUnit;
								}

								if(currentRes.Version === 0){
									currentRes.QuantityOriginal = currentRes.Quantity;
								}
								updateSelectedResource(fieldName, currentRes, estResources, mainItemList, selectedLineItem, projectInfo);
							}else{
								constructionsystemMainResourceDataService.deleteItem(constructionsystemMainResourceDataService.getItemById(currentRes.Id));
								// refresh lineitems after delete resource
								refreshLineItem(selectedLineItem, mainItemList, estResources);
							}

							// if (_.isEmpty(currentRes.Code)) {
							// estimateMainResourceService.deleteItem(estimateMainResourceService.getItemById(currentRes.Id));
							// //refresh lineitems after delete resource
							// refreshLineItem(selectedLineItem, mainItemList, estResources);
							// } else {
							// updateSelectedResource(fieldName, currentRes, estResources, mainItemList, selectedLineItem, projectInfo);
							// }
							currentRes.ColumnId = configDetail.MaterialLineId;
						} else {
							currentRes[fieldName] = item[columnField.field];
							currentRes.ColumnId = configDetail.MaterialLineId;
							if( currentRes.Version === 0){
								currentRes.CostUnitOriginal = currentRes.CostUnit;
							}

							if(currentRes.Version === 0){
								currentRes.QuantityOriginal = currentRes.Quantity;
							}
							updateSelectedResource(fieldName, currentRes, estResources, mainItemList, selectedLineItem, projectInfo);
						}
						return result;
					} else {
						// create new resource
						return createNewResource(fieldName, item[columnField.field], estResources, mainItemList, selectedLineItem, projectInfo, configDetail);
					}
				}

				function getConfigDetialById(column) {
					var columnId = column.columnid;
					if (!angular.isDefined(columnId) && columnId === null) {
						return null;
					}
					return constructionsystemMainConfigDetailService.getConfigDetialById(columnId);
				}

				function getColumnField(column) {
					var columnId = column.columnid;
					if (!angular.isDefined(columnId) && columnId === null) {
						return;
					}
					return _.find(dynamicColumn, {columnid: columnId});
				}

				function calculateDynamicColumnDetail(item, colName, configDetail) {

					var resFieldName = constructionsystemMainConfigDetailService.getFieldByColumnId(configDetail.ColumnId);

					var union = estimateMainDynamicColumnFilterService.getMap2DetailUnion();

					if (Object.prototype.hasOwnProperty.call(union,resFieldName)) {

						var invertFieldId = constructionsystemMainConfigDetailService.getColumnIdByField(union[resFieldName]);

						if (invertFieldId > -1) {

							var currentConfigDetial = _.find(constructionsystemMainConfigDetailService.getColumnConfigDetails(), {
								ColumnId: invertFieldId,
								LineType: configDetail.LineType,
								MaterialLineId: configDetail.MaterialLineId,
								MdcCostCodeFk: configDetail.MdcCostCodeFk
							});

							if (angular.isDefined(currentConfigDetial) && currentConfigDetial !== null) {

								item[fieldTag + currentConfigDetial.Id] = estimateMainDynamicColumnFilterService.calculateDetailValue(item[colName]);
							}
						}
					}
				}
			};

			function createNewResource(fieldName, fieldValue, resourceList, lineItemList, selectedLineItem, projectInfo, configDetail) {

				return estimateMainExchangeRateService.loadData(projectInfo.ProjectId).then(function(){
					constructionsystemMainResourceDataService.deselect();
					return constructionsystemMainResourceDataService.createItem();
				}).then(function (response) {
					constructionsystemMainConfigDetailService.addExtendData(response, fieldName, fieldValue, configDetail);
					var estimateMainResourceImageProcessor = $injector.get('estimateMainResourceImageProcessor');
					estimateMainResourceImageProcessor.processItem(response);

					if(response.MdcCostCodeFk || response.MdcMaterialFk){
						// Clear validation error
						var constructionsystemMainResourceValidationService = $injector.get('constructionsystemMainResourceValidationService');
						var platformDataValidationService = $injector.get('platformDataValidationService');

						platformDataValidationService.removeFromErrorList(response, 'Code', constructionsystemMainResourceValidationService, constructionsystemMainResourceDataService);

						var lookupItem = constructionsystemMainConfigDetailService.getSelectedLookupItem();
						response.ExchangeRate = response.ExchangeRate ? response.ExchangeRate : estimateMainExchangeRateService.getExchRate(lookupItem.BasCurrencyFk);
						service.estimateResources(fieldName, response, resourceList, selectedLineItem, lineItemList, lookupItem, projectInfo);
						if( response.Version === 0){
							response.CostUnitOriginal = response.CostUnit;
						}

						if(response.Version === 0){
							response.QuantityOriginal = response.Quantity;
						}
						constructionsystemMainResourceDataService.calLineItemDynamicColumns(selectedLineItem, resourceList);
					}

					refreshLineItem(selectedLineItem, lineItemList, resourceList);
					// set back the focus to line item container
					platformGridAPI.cells.selection({gridId: lineItemGridId});

					return [];
				});
			}

			function updateSelectedResource(fieldName, selectedResource, resourceList, lineItemList, selectedLineItem, projectInfo) {
				constructionsystemMainResourceDataService.markItemAsModified(selectedResource);
				service.estimateResources(fieldName, selectedResource, resourceList, selectedLineItem, lineItemList, null, projectInfo);
				constructionsystemMainResourceDataService.calLineItemDynamicColumns(selectedLineItem, resourceList);
				refreshLineItem(selectedLineItem, lineItemList, resourceList);
			}

			function refreshLineItem(selectedLineItem, mainItemList, resourceList) {
				constructionsystemMainResourceDataService.gridRefresh();
				estimateMainService.fireItemModified(mainItemList);
				// estimateMainService.fireItemModified(selectedLineItem);
				service.calCostUnitTarget(selectedLineItem, resourceList);
				// when modify the lineitem ,not refresh the reference lineitem immediately.
				// after lineitem rowchange , refresh it
				estimateMainService.gridRefresh();
			}

			function reloadDynamicColumnAndData(serverRequestFlag) {
				if (!angular.isUndefined(serverRequestFlag)) {
					setDynamicServerRequestFlag(serverRequestFlag);
				}

				appendDynamicColumnData().then(function () {
					if (platformGridAPI.grids.exist(lineItemGridId) ) {
						var grid = platformGridAPI.grids.element('id', lineItemGridId).instance;
						if (grid && grid.getSelectedRows().length === 0) {
							var data = grid.getData();
							var selectedLineItem = estimateMainService.getSelected();
							var selectedRow = data.getRowById(selectedLineItem ? selectedLineItem.Id : -1);
							if (selectedRow > -1) {
								grid.setSelectedRows([selectedRow]);
							}
						}
					}
				});
				asyncLoadDynamicColumns();
				refreshCharacteristicCodeLookup();

				setDynamicServerRequestFlag(false);
			}

			function setDynamicServerRequestFlag(flag) {
				if (flag !== true) {
					flag = false;
				}
				dynamicServerRequestFlag = flag;
			}

			function sendColumnDataRequest(url, $requestData, responseCache) {
				var promiseRs;
				console.log(responseCache);
				// if (dynamicServerRequestFlag === true) {
				promiseRs = $http.post(url, $requestData);
				// } else {
				// promiseRs = $q.when(responseCache);
				// }

				return promiseRs;
			}

			function getStaticColumns() {
				var loadedCols = {};
				var originalCols = angular.copy(estLineItemStandardConfig.columns || []);
				// current = hidden + visible;
				// current: all loaded columns
				var columns = platformGridAPI.columns.configuration(lineItemGridId);
				var currentColumns = (columns || {}).current || [];
				_.map(currentColumns, function (col) {
					var colId = col.id;
					if (!_.isEmpty(colId)) {
						loadedCols[colId] = col;
					}
				});
				var modifiedCols = _.map(originalCols, function (oriCol) {
					var colId = oriCol.id;
					if (!_.isEmpty(colId) && loadedCols[colId]) {
						oriCol = _.merge(oriCol, loadedCols[colId]);
					}
					return oriCol;
				});

				// fix issue that the group column will disappear after clicking refresh button
				if(columns && columns.visible){
					var groupColumn = _.find(columns.visible, {id:'group',field:'group'});
					if(groupColumn){
						modifiedCols.push(groupColumn);
					}
				}

				return angular.copy(modifiedCols);
			}

			function setCharactColsReadOnly(charactCols){
				var itemList = estimateMainService.getList();
				var fieldCharacts = [];
				angular.forEach(charactCols, function(charact){
					var field = {field: charact.field , readonly: false};
					fieldCharacts.push(field);
				});

				angular.forEach(itemList, function(item){
					if(item && item.EstRuleSourceFk) {
						$injector.get('platformRuntimeDataService').readonly(item, fieldCharacts);
					}
				});


			}

			function asyncLoadDynamicColumns() {
				function refreshColumns(resColumnConfigDto) {
					estimateMainCommonService.generateCharacteristicColumns(estimateMainService, sectionId).then(function (data) {
						estimateMainCommonService.appendCharactiricColumnData(data, estimateMainService);
						// charactiric culomn
						var charactCols = estimateMainCommonService.getCharactCols(data);
						// culomn cinfig
						var dyCols = _.values(generateDynamicColumns(resColumnConfigDto));
						dyCols = dyCols.concat($injector.get('estimateMainDynamicQuantityColumnService').getDynamicQuantityColumns());
						dyAndCharCols = dyCols.concat(charactCols); // column config and caracteristic column

						estimateMainService.setDynamicColumns(dyAndCharCols); // Dynamic columns are saved to cache,they are used when editing the layout view, or change from one view to another

						service.resizeLineItemGrid();
						// when the line item was genarated by rule, set the charact cols editable
						if(charactCols && charactCols.length > 0){
							setCharactColsReadOnly(charactCols);
						}
						return dyCols;
					});
				}

				var estHeaderId = estimateMainService.getSelectedEstHeaderId() || -1;
				var qDefer = $q.defer();
				if (estHeaderId >= -1) {
					// $http.post(
					sendColumnDataRequest(
						globals.webApiBaseUrl + 'estimate/main/columnconfigdetail/getitemsbyestheader',
						{Id: estHeaderId},
						dynamicColumnTitleCache).then(
						function (response) {
							dynamicColumnTitleCache = response;
							var infoData = response.data || {};
							// set the dynamic columns information: main, cost codes, materialView lookup, dynamic columns matching relation data
							constructionsystemMainConfigDetailService.setInfo(infoData);
							var cols = refreshColumns(infoData.Main);
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
				var basicsCharacteristicCodeLookupService = $injector.get('basicsCharacteristicCodeLookupService');
				basicsCharacteristicCodeLookupService.refresh(sectionId);
			}

			function appendColumnData(listData, resources, resColumnConfigDto) {
				// calculation
				loadDynamicColumnData(listData, resources);

				// reference items
				var fieldList = resColumnConfigDto.map(function (item) {
					return {field: fieldTag + item.Id};
				});
				constructionsystemMainConfigDetailService.setRefLineItemDynamicColumnReadonly(listData, fieldList, true);

				estimateMainService.gridRefresh();
			}

			function appendDynamicColumnData(items) {

				var qDefer = $q.defer();
				if (!estimateMainService) {
					qDefer.resolve([]);
					return qDefer.promise;
				}
				var estHeaderId = parseInt(estimateMainService.getSelectedEstHeaderId() || -1),
					lineItems = items ? items : estimateMainService.getList() || [];
				if (estHeaderId > -1 && lineItems.length > 0) {
					var dynamicLineItemsData = {
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
							var respData = response.data || {},
								columnConfigInfo = respData.columnConfigInfo || {},
								lineItemResources = respData.Main,
								columnDetailItems = columnConfigInfo.Main || [];
							// set the dynamic columns information: main, cost codes, materialView lookup, dynamic columns matching relation data
							constructionsystemMainConfigDetailService.setInfo(columnConfigInfo);
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

			function generateDynamicColumns(responseColumnConfigDetailsDto) {
				var dynamicColumns = {};
				var configDetailColumns = responseColumnConfigDetailsDto || [];
				// dynamic cols
				configDetailColumns.map(function (item) {
					var newId = fieldTag + item.Id;
					dynamicColumns[newId] = getColumnConfigInfo(item, angular.copy(estResourceStandardConfig.columns));
				});
				// add not assigned field
				if (configDetailColumns.length > 0) { // if the column config is active and there are configured columns
					dynamicColumns.NotAssignedCostTotal = notAssignedField;
				}
				setDynamicColums(dynamicColumns);
				return dynamicColumns;
			}

			service.isExistColumn = function isExistColumn(idorField) {
				var colData = _.filter(dyAndCharCols, {'id': idorField});
				if (!colData || (colData && colData.length === 0)) {
					return false;
				}
				return true;
			};

			service.addColumn = function addColumn(item, columnIdorField, columnName) {
				var charCol = estimateMainCommonService.createCharactCol(item, columnIdorField, columnName);
				var charCols = [];
				charCols.push(charCol);
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
					var qtyCols = _.isArray(col) ? col : [col];
					dyAndCharCols = dyAndCharCols.concat(qtyCols);
					estimateMainService.setDynamicColumns(dyAndCharCols); // Dynamic columns are saved to cache,they are used when editing the layout view, or change from one view to another
				}
			};

			service.resizeLineItemGrid = function resizeLineItemGrid() {
				if(true === platformGridAPI.grids.exist(lineItemGridId))
				{
					platformGridAPI.columns.configuration(lineItemGridId, getStaticColumns().concat(dyAndCharCols));
					platformGridAPI.configuration.refresh(lineItemGridId);
					platformGridAPI.grids.resize(lineItemGridId);
				}

			};

			// calculation for Resource container
			// calculation for sub items and resources in Resource container
			var calSubItemsNResources = function calSubItemsNResources(col, resItem, resItemList, parentLineItem, mainLineItemList, lookupItem) {
				var extractItemProp = true;

				// costcode = 1, material = 2, plant = 3, assembly = 4, subitem = 5
				if (resItem.EstResourceTypeFk === 5) {
					constructionsystemMainCommonService.CalculateSubItems(resItem, parentLineItem, resItemList);
				}
				else if ([1, 2, 4].indexOf(resItem.EstResourceTypeFk) > -1) {
					estimateMainCommonService.setSelectedCodeItem(col, resItem, extractItemProp, lookupItem);
					constructionsystemMainCommonService.CalculateResources(resItem, parentLineItem, resItemList);
				}
			};

			// calculation of Deatails factor of sub items and resources in Resource container
			var calSubNResDeatilsFacors = function calSubNResDeatilsFacors(col, currentResItem) {
				var result = {};
				result.col = col;
				result.resItem = currentResItem;

				if (result.col) {
					estimateMainCommonService.calculateDetails(result.resItem, result.col);
				}
				if (result.resItem.IsLumpsum) {
					result.resItem.Quantity = 1;
				}

				return result;
			};
			/* jshint -W098 */ // keep it for future use
			// eslint-disable-next-line no-unused-vars
			service.estimateResources = function estimateResources(col, currentResItem, resItemList, parentLineItem, mainLineItemList, lookupItem, projectInfo) { // jshint ignore:line
				var result = calSubNResDeatilsFacors(col, currentResItem, resItemList, parentLineItem, mainLineItemList);
				calSubItemsNResources(result.col, result.resItem, resItemList, parentLineItem, mainLineItemList, lookupItem);
			};

			service.isDynamicColumn = isDynamicColumn;

			service.setLineItemReadOnly = function setLineItemReadOnly(itemList, isReadOnly) {
				constructionsystemMainConfigDetailService.setRefLineItemDynamicColumnReadonly(itemList, dynamicColumn, isReadOnly);
			};

			service.calCostUnitTarget = function calCostUnitTarget(item, resourceList) {
				var resList;
				_.forEach(constructionsystemMainConfigDetailService.getColumnConfigDetails(), function (columnItem) {
					if (columnItem.ColumnId === 15) {
						resList = _.find(resourceList, {ColumnId: columnItem.MaterialLineId});
						if (resList) {
							item[fieldTag + columnItem.Id] = resList.CostUnitLineItem;
						}
					}

					if (columnItem.ColumnId === 16) {
						resList = _.find(resourceList, {ColumnId: columnItem.MaterialLineId});
						if (resList) {
							item[fieldTag + columnItem.Id] = resList.CostTotal;
						}
					}
				});
			};

			service.isAdvanceAllowance = function isAdvanceAllowance(column){
				if(column === 'AdvanceAllowance'){
					return true;
				}
				return false;
			};

			var allowanceCostCodePromise = null;
			var allowanceCostCodeEntity = null;
			// eslint-disable-next-line no-unused-vars
			var isAllowanceCostCodeActive = false;

			service.getAllowanceCostCodeEntity = function getAllowanceCostCodeEntity(){
				if(allowanceCostCodeEntity){
					return $q.when(allowanceCostCodeEntity);
				}

				return service.getAllowanceCostCodePromise().then(function(response){
					isAllowanceCostCodeActive = true;
					if(response.data){
						allowanceCostCodeEntity = response.data;

						// insert the allowance cost code to cost code cache
						updateMdcCostcodeCache(allowanceCostCodeEntity);
					}
					return allowanceCostCodeEntity;
				});
			};

			service.getAllowanceCostCodePromise = function getAllowanceCostCodePromise(){
				if(!allowanceCostCodePromise){
					allowanceCostCodePromise = $http.get(globals.webApiBaseUrl + 'basics/costcodes/getadvanceallowancecode');
				}
				return allowanceCostCodePromise;
			};

			function updateMdcCostcodeCache(allowanceCostCode){
				var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
				if(!_.some(lookupDescriptorService.getData('estmdccostcodes'), {'Id': allowanceCostCode.Id})) {
					lookupDescriptorService.addData('estmdccostcodes',allowanceCostCode);
				}
			}

			service.updateAdvanceAllowanceResource = function updateAdvanceAllowanceResource(column, lineItem, lineItemList, resourceList){

				service.getAllowanceCostCodeEntity().then(function(advanceAllowanceCostCode){

					// eslint-disable-next-line no-unused-vars
					var projectInfo = estimateMainService.getSelectedProjectInfo();

					if(advanceAllowanceCostCode){

						var advanceAllowanceResources = _.filter(resourceList, {MdcCostCodeFk : advanceAllowanceCostCode.Id});

						if(advanceAllowanceResources.length === 0){

							constructionsystemMainResourceDataService.createItem().then(function(response){

								var constructionsystemMainResourceValidationService = $injector.get('constructionsystemMainResourceValidationService');
								var platformDataValidationService = $injector.get('platformDataValidationService');
								platformDataValidationService.removeFromErrorList(response, 'Code', constructionsystemMainResourceValidationService, constructionsystemMainResourceDataService);

								estimateMainCommonService.extractSelectedItemProp(advanceAllowanceCostCode, response);

								response.IsLumpsum = true;

								response.CostUnit = lineItem[column.field];

								constructionsystemMainCommonService.CalculateResources(response, lineItem, resourceList);

								refreshLineItem(lineItem, lineItemList, resourceList);
							});

						} else {
							var aAResourcesNotGenareatedByRule = _.find(advanceAllowanceResources, {EstRuleSourceFk : null});

							var total = _.sum(advanceAllowanceResources, 'CostTotal');

							if(aAResourcesNotGenareatedByRule){

								advanceAllowanceResources.IsLumpsum = true;

								advanceAllowanceResources.CostUnit = advanceAllowanceResources.CostUnit + lineItem[column.field] - total;

								constructionsystemMainCommonService.CalculateResources(advanceAllowanceResources[0], lineItem, resourceList);

								refreshLineItem(lineItem, lineItemList, resourceList);
							}else{

								constructionsystemMainResourceDataService.createItem().then(function(response){

									var constructionsystemMainResourceValidationService = $injector.get('constructionsystemMainResourceValidationService');
									var platformDataValidationService = $injector.get('platformDataValidationService');
									platformDataValidationService.removeFromErrorList(response, 'Code', constructionsystemMainResourceValidationService, constructionsystemMainResourceDataService);


									estimateMainCommonService.extractSelectedItemProp(advanceAllowanceCostCode, response);

									response.IsLumpsum = true;

									response.CostUnit = lineItem[column.field] - total;

									constructionsystemMainCommonService.CalculateResources(response, lineItem, resourceList);

									refreshLineItem(lineItem, lineItemList, resourceList);
								});
							}
						}
					}
				});



			};

			service.setDynamicServerRequestFlag = setDynamicServerRequestFlag;
			service.reloadDynamicColumnAndData = reloadDynamicColumnAndData;
			service.appendDynamicColumnData = appendDynamicColumnData;
			service.asyncLoadDynamicColumns = asyncLoadDynamicColumns;

			service.generateDynamicColumns = generateDynamicColumns;
			service.appendColumnData = appendColumnData;
			service.setDyAndCharCols = setDyAndCharCols;
			return service;
		}]);
})(angular);
