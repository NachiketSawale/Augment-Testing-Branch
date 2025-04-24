/**
 * Created by lnt on 21.05.2020.
 */

(function (angular) {
	/* global Slick */
	'use strict';
	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainDetailGridControllerService', ['_', '$injector', '$timeout', '$translate', 'platformGridAPI', 'platformControllerExtendService', 'platformGridControllerService',
		'qtoMainFormulaType', 'mainViewService','qtoBoqType','platformModalService', 'basicsLookupdataLookupDescriptorService',
		function (_, $injector, $timeout, $translate, platformGridAPI, platformControllerExtendService, gridControllerService, qtoMainFormulaType, mainViewService,qtoBoqType,platformModalService, lookupDescriptorService) {

			let service = {};

			service.initQtoDetailController = function ($scope, dataService, validationService, gridColumns, qtoMainLineType, qtoMainClipboardService, parentService, boqType, isCopySource) {
				let enter2Create = false, lastKeyCode, enter2OpenUserForm = false;

				let gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function (arg) {
						let currentItem = arg.item;
						currentItem.createQtoItemByBoqItemChangeFlag = false;
						let column = arg.grid.getColumns()[arg.cell];
						let colId = column.id;
						let colField = column.field;

						let referencedLines = dataService.getReferencedDetails(currentItem);

						if (colId === 'value1detail') {
							if (currentItem.QtoFormula && currentItem.QtoFormula.QtoFormulaTypeFk === 2) {
								let isSplitLine = false;
								if (currentItem.QtoFormula.IsMultiline && currentItem.QtoFormula.BasRubricCategoryFk === 84 && !_.isEmpty(currentItem.LineText) && currentItem.LineText.length > 38) {
									if (!currentItem.HasError || !(currentItem && currentItem.__rt$data && currentItem.__rt$data.errors && currentItem.__rt$data.errors.LineText)) {
										dataService.setSplitCell(arg.cell);
										let result = splitExpression(currentItem.LineText, 38);
										currentItem.LineText = result[0];
										currentItem.NoAppendedEqualSign = true;
										isSplitLine = true;
										$timeout(function () {
											dataService.setSplitResult(result);
											dataService.copyPaste(undefined, undefined, undefined, undefined, currentItem);
										}, 1000);
									}
								}

								if (isSplitLine){
									return;
								}

								// If Formula code type is Free Input add '=' at end for formula (in value1)
								// If Formula code type is Free input and IsMultLine = 1, add '=' at end for formula(in Value1) in last row.
								// and Update result on 'Enter' key press.
								let appendEqualChar = function(){

									if (!_.isEmpty(currentItem.LineText) && currentItem.LineText.indexOf('=') === -1) {
										if(!currentItem.QtoFormula.IsMultiline){
											if(!(currentItem && currentItem.__rt$data && currentItem.__rt$data.errors && currentItem.__rt$data.errors.LineText)){
												currentItem.LineText = currentItem.LineText + '=';
											}
										}else {
											let hasError = false;
											_.forEach(referencedLines, function (item){
												hasError = hasError || (item && item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.LineText);
											});
											let lastItem = referencedLines[referencedLines.length - 1];
											if(!hasError && !_.isEmpty(lastItem.LineText) && lastItem.LineText.indexOf('=') === -1){
												lastItem.LineText = lastItem.LineText + '=';
												if(lastItem.Id !== currentItem.Id){
													dataService.markItemAsModified(lastItem);
												}
											}
										}
									}
									currentItem.IsCalculate = true;
									dataService.markItemAsModified(currentItem);
									if (!currentItem.QtoFormula.IsMultiline) {
										dataService.updateCalculation();
									} else {
										// if the group multilines has errors, not update.
										let referenceList = dataService.getReferencedDetails(currentItem);
										let errorItems = _.filter(referenceList, function (line) {
											return line.HasError;
										});

										if (errorItems.length === 0) {
											dataService.updateCalculation();
										}
									}
								};

								let promise = dataService.getCreatingPromise();
								if(promise){
									promise.then(function(){
										appendEqualChar();
									});
								}else{
									appendEqualChar();
								}
							}
						}
						else if (colId === 'value2detail' && currentItem.QtoLineTypeFk === 6) {
							currentItem.IsCalculate = true;
							dataService.updateCalculation();
						}
						else if (colId === 'isreadonly') {
							let qtoQtoReadOnlyProcessor = $injector.get('qtoQtoReadOnlyProcessor');
							qtoQtoReadOnlyProcessor.updateReadOnlyDetail(currentItem);
							currentItem.IsCalculate = true;

							if (currentItem.QtoFormula !== null && currentItem.QtoFormula.IsMultiline  && referencedLines.length>1)
							{
								_.forEach (referencedLines, function (item) {
									item.IsReadonly = currentItem.IsReadonly;
									qtoQtoReadOnlyProcessor.updateReadOnlyDetail(item);
									item.IsCalculate = true;
								});
								dataService.markEntitiesAsModified(referencedLines);
							}

							updateSplitQTOLineTool([currentItem]);
							updateInsertButton(currentItem);
						}
						else if (colId === 'v') {
							if(currentItem.V){
								currentItem.V = _.toUpper(currentItem.V);
							}
							dataService.updateCalculation();

							if (currentItem.QtoLineTypeFk === 2) {
								let readOnlyColumns = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
									'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5', 'Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
								dataService.updateReadOnly(currentItem, readOnlyColumns, true);
								dataService.gridRefresh();
							}
						}
						else if(colId === 'factor'){
							if(referencedLines && referencedLines.length > 0){
								if (referencedLines[0].Id !== currentItem.Id) {
									referencedLines[0].Factor = currentItem.Factor;
									currentItem.Factor = null;
									dataService.markEntitiesAsModified([referencedLines[0]]);
								}

								//In multiline formula, the factor should be set into the first row and clean the factor in another row;
								for(var i = 1; i < referencedLines.length; i++){
									if(!_.isNull(referencedLines[i].Factor) && referencedLines[i].Id !== currentItem.Id){
										referencedLines[i].Factor = null;
										dataService.markEntitiesAsModified([referencedLines[i]]);
									}
								}
							}

							dataService.updateCalculation();
						}
						else if (colId === 'pagenumber') {
							dataService.setPageNumberCell(arg.cell);
							let pageNumberCreated = dataService.getPageNumberCreated();
							if (!isNaN(pageNumberCreated) && pageNumberCreated !== '' && pageNumberCreated !== null) { // have created at  validation
								dataService.setPageNumberCreated(null);
								dataService.setSelected(currentItem);
								setQtoLineCellFocus(arg, currentItem);
							}
							else if (currentItem.PageNumber !== 0) {
								if (!isNaN(currentItem.PageNumber) && currentItem.PageNumber !== '' && currentItem.PageNumber !== null) {
									$injector.get('qtoMainStructureDataService').createQtoStructure(currentItem.PageNumber,currentItem.QtoHeaderFk, boqType, currentItem.QtoTypeFk).then(function (sheetItem) {
										currentItem.QtoSheetFk = sheetItem ? sheetItem.Id : null;
										if (currentItem.QtoFormula !== null && currentItem.QtoFormula.IsMultiline  && referencedLines.length>1)
										{
											_.forEach (referencedLines, function (item) {
												item.QtoSheetFk = currentItem.QtoSheetFk;
											});
										}
									});
								}
							}



						} else if (colId === 'isblocked') {
							dataService.updateCalculation();
						}
						else if(colId === 'prjlocationfk'){
							currentItem.IsCalculate = true;
							dataService.updateCalculation();
						}
						else if(colId === 'isbq' || colId === 'isiq'){
							updateSplitQTOLineTool([currentItem]);
						}

						let operatorArray = ['operator1','operator2','operator3','operator4','operator5'];
						if(operatorArray.indexOf(colId) !== -1){
							checkOperatorAndValue(currentItem);
						}

						if(colId === 'qtoformulafk'){

							if(!_.isEmpty(currentItem) && !_.isEmpty(currentItem.QtoFormula) && currentItem.QtoFormula.BasFormFk > 0 && (currentItem.QtoFormula.IsDialog || enter2OpenUserForm)){
								enter2OpenUserForm = false;

								if(dataService.showQtoUserFormDialog()){
									dataService.showForm();
								}
							}

							dataService.setIsFormulaChanged(false);
							updateInsertButton(currentItem);
						}

						// TODO: modified some fields, need to recalculate
						let modelArray = ['qtolinetypecode','qtolinetypefk','v', 'factor', 'value1detail', 'value2detail', 'value3detail', 'value4detail', 'value5detail', 'operator1',
							'operator2', 'operator3', 'operator4', 'operator5'];
						let index = modelArray.indexOf(colId);
						if (index !== -1) {
							currentItem.IsCalculate = true;
						}

						let validateFields = ['RemarkText','Remark1Text','LineText'];
						if(validateFields.indexOf(colField) !== -1){
							validationService.validateFieldBeforeEdit(currentItem, colField);
						}

						if (colId === 'pagenumber' || colId === 'linereference' || colId === 'lineindex') {
							let grid = platformGridAPI.grids.element('id', dataService.getGridId());
							currentItem.IsModifyLineReference = true;
							grid.dataView.fastSort('QtoDetailReference');
						}
					},
					type: getPastedContentType(),
					dragDropService: qtoMainClipboardService,
					costGroupService: 'qtoDetailCostGroupService',
					isCostGroupReadonly: (boqType !== qtoBoqType.QtoBoq)
				};

				function getPastedContentType(){
					let type = 'QtoDetail';
					if (isCopySource){
						type = 'SourceQtoDetial';
					} else if (boqType === qtoBoqType.QtoBoq){
						type = 'QtoDetail';
					} else {
						switch (boqType) {
							case qtoBoqType.PrcBoq:
								type = 'PrcBoqQtoDetail';
								break;
							case qtoBoqType.PrjBoq:
								type = 'PrjBoqQtoDetail';
								break;
							case qtoBoqType.WipBoq:
								type = 'WipBoqQtoDetail';
								break;
							case qtoBoqType.PesBoq:
								type = 'PesBoqQtoDetail';
								break;
							case qtoBoqType.BillingBoq:
								type = 'BillingBoqQtoDetail';
								break;
						}
					}

					return  type;
				}

				function setQtoLineCellFocus(arg, currentItem) {

					let isImmediatePropagationStopped = true;

					let columns = arg.grid.getColumns();
					let cellCount = columns ? columns.length : 0;
					let count = getNextColumnEditableNum(arg);
					if (count < cellCount) {
						let options = {
							item: currentItem,
							cell: count,
							forceEdit: true
						};

						dataService.setCellFocus(options);
					}

					if (count === cellCount) {
						isImmediatePropagationStopped = false;
					}
					return isImmediatePropagationStopped;
				}

				function setQtoLineCellFocusByArrows(arg/* , currentItem */) {
					let isImmediatePropagationStopped = true;
					let columns = arg.grid.getColumns();
					let cellCount = columns ? columns.length : 0;

					let mergeCell = getMergeCells(arg);
					if(mergeCell) {
						let value1Count = mergeCell.value1Count,
							nextCount = mergeCell.nextCount;

						if (value1Count !== nextCount && nextCount < cellCount) {
							let grid = platformGridAPI.grids.element('id', dataService.getGridId());
							grid.instance.setActiveCell(arg.row, nextCount);
						}

						if (value1Count === nextCount) {
							isImmediatePropagationStopped = false;
						}
					}

					return isImmediatePropagationStopped;
				}

				function getMergeCells(arg) {
					let columns = arg.grid.getColumns();
					let modelArray = ['value2detail', 'value3detail', 'value4detail', 'value5detail','operator1', 'operator2', 'operator3', 'operator4', 'operator5'];

					let count = 0,
						value1Count = 0,
						nextCount = 0;
					_.each(columns, function (column) {
						if(column.id === 'value1detail'){
							value1Count = count;
							nextCount = count + 1;
						}

						if(value1Count > 0){
							let index = _.indexOf(modelArray, column.id);
							if(index !== -1 && (count === nextCount)){
								nextCount = count + 1;
							}
						}
						count++;
					});

					return {nextCount: nextCount, value1Count: value1Count};
				}

				function getNextColumnEditableNum(arg){
					let columns = arg.grid.getColumns();
					let selectItem = dataService.getSelected();
					let count = arg.cell + 1;
					if(selectItem) {
						let itemsReadonly = selectItem.__rt$data.readonly;
						for (let i = count; i < columns.length; i++) {
							let nextItemReadonly = getReadonlyItems(itemsReadonly, columns[i]);
							if ((nextItemReadonly && nextItemReadonly.readonly) || (columns[i].keyboard && !columns[i].keyboard.enter) ||
								columns[i].editor === null) {
								count++;
							}
							else {
								break;
							}
						}
					}

					return count;
				}

				function getLastColumnEditableNum(arg) {
					let columns = arg.grid.getColumns();
					let selectItem = dataService.getSelected();
					let count = arg.cell + 1;
					let lastNum = arg.cell;
					if (selectItem) {
						let itemsReadonly = selectItem.__rt$data.readonly;
						for (let i = count; i < columns.length; i++) {
							let nextItemReadonly = getReadonlyItems(itemsReadonly, columns[i]);
							if ((nextItemReadonly && nextItemReadonly.readonly) || (columns[i].keyboard && !columns[i].keyboard.enter)||
								columns[i].editor === null) {
								count++;
							}
							else {
								lastNum = i;
							}

							if(count > columns.length){
								break;
							}
						}
					}

					return lastNum;
				}

				function getReadonlyItems(itemsReadonly, column) {
					return _.find(itemsReadonly, function (itemReadonly) {
						if(column.lookupDisplayColumn || column.IsReadonly){
							return true;
						}
						else if (itemReadonly.field.toLowerCase() === column.id) {
							return true;
						}
						else if (itemReadonly.field === column.filed) {
							return true;
						}
					});
				}

				function checkOperatorAndValue(item){
					if(_.isNull(item.QtoFormula) || !item.QtoFormula.IsMultiline ){
						return;
					}

					let operatorArrays = ['Operator1','Operator2','Operator3','Operator4','Operator5'];
					let valueArrays = ['Value1','Value2','Value3','Value4','Value5'];
					let needToClear = false;

					for(let i = 0; i < operatorArrays.length; i++){
						if(needToClear){
							item[valueArrays[i]] = null;
							item[valueArrays[i]+'Detail'] = _.toString(item[valueArrays[i]]);
							item[operatorArrays[i]] = null;
						}

						if(item[operatorArrays[i]] && item[operatorArrays[i]] === '=') {
							needToClear = true;
						}
					}
				}

				platformControllerExtendService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				dataService.setGridId($scope.gridId);

				lookupDescriptorService.loadData('QtoDetailStatus');

				function setMergeCell(item) {
					let mergeCells = [];
					if (item !== null && item !== undefined) {
						let modelArray =[];
						let baseColumn ={};
						let colspanCount2 ={};
						let colspanCount ={};
						let colspanCount1 ={};
						let colspanCount3= {};
						let baseColumn2= {};
						let baseColumn3 = {};
						switch (item.QtoLineTypeFk) {
							case qtoMainLineType.Standard:
							case qtoMainLineType.Hilfswert:
							case qtoMainLineType.Subtotal:
							case qtoMainLineType.ItemTotal:
								if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk === 2) {
									baseColumn ={baseField:'value1detail'};
									modelArray = ['value2detail', 'value3detail', 'value4detail', 'value5detail','operator1', 'operator2', 'operator3', 'operator4', 'operator5'];
									colspanCount = getColspanCount(modelArray,baseColumn);

									mergeCells = [
										{colid: baseColumn.baseField, colspan: colspanCount}
									];
								}
								break;
							case qtoMainLineType.CommentLine:

								baseColumn ={baseField:'qtoformulafk'};
								modelArray = ['value1detail','value2detail', 'value3detail', 'value4detail', 'value5detail','operator1', 'operator2', 'operator3', 'operator4', 'operator5'];
								colspanCount = getColspanCount(modelArray,baseColumn);

								mergeCells = [
									{colid: baseColumn.baseField, colspan: colspanCount}
								];
								break;
							case qtoMainLineType.RRefrence:

								baseColumn ={baseField:'value1detail'};
								modelArray = ['operator1'];
								colspanCount1 =getColspanCount(modelArray,baseColumn);


								baseColumn2 ={baseField:'value2detail'};
								modelArray = ['value3detail', 'value4detail', 'value5detail','operator2', 'operator3', 'operator4', 'operator5'];
								colspanCount2 =getColspanCount(modelArray,baseColumn2);

								mergeCells = [
									{colid: baseColumn.baseField, colspan: colspanCount1},
									{colid: baseColumn2.baseField, colspan: colspanCount2}
								];
								item.QtoFormulaFk = null;
								break;
							case qtoMainLineType.LRefrence:

								baseColumn ={baseField:'value1detail'};
								modelArray = ['operator1'];
								colspanCount1 = getColspanCount(modelArray,baseColumn);

								baseColumn2 = {baseField:'value2detail'};
								modelArray = ['operator2'];
								colspanCount2 = getColspanCount(modelArray,baseColumn2);


								baseColumn3 ={baseField:'value3detail'};
								modelArray = ['value4detail', 'value5detail','operator3', 'operator4', 'operator5'];
								colspanCount3 =getColspanCount(modelArray,baseColumn3);

								mergeCells = [
									{colid: baseColumn.baseField, colspan: colspanCount1},
									{colid: baseColumn2.baseField, colspan: colspanCount2},
									{colid: baseColumn3.baseField, colspan: colspanCount3}
								];
								item.QtoFormulaFk = null;
								break;
							case qtoMainLineType.IRefrence:

								baseColumn = {baseField:'value1detail'};
								modelArray = ['operator1'];
								colspanCount1 =getColspanCount(modelArray,baseColumn);

								baseColumn2 =  {baseField:'value2detail'};
								modelArray = ['value3detail', 'value4detail', 'value5detail','operator2', 'operator3', 'operator4', 'operator5'];
								colspanCount2 =getColspanCount(modelArray,baseColumn2);

								mergeCells = [
									{colid: baseColumn.baseField, colspan: colspanCount1},
									{colid: baseColumn2.baseField, colspan: colspanCount2}
								];
								item.QtoFormulaFk = null;
								break;
							default:
								break;
						}
						if(item.__rt$data){
							platformGridAPI.cells.mergeCells(dataService.getGridId(), mergeCells, item);
						}
					}
				}

				function  getColspanCount(modelArray,baseColumn) {
					let cols = platformGridAPI.columns.getColumns(dataService.getGridId());
					let allVisibleCols =[];
					if(cols !==null && cols !== undefined){
						allVisibleCols = _.map(cols,'id');
					}
					let colspanCount =1;
					let sIndex = allVisibleCols.indexOf(baseColumn.baseField);

					for(let i =sIndex+1; i<=allVisibleCols.length; i++){
						if(modelArray.indexOf(allVisibleCols[i])>-1){
							colspanCount++;
						}else{
							break;
						}
					}
					return colspanCount;
				}

				function setAsMainViewConfig() {
					let cols = platformGridAPI.columns.getColumns(dataService.getGridId());
					/* set as the main view config */
					let config = mainViewService.getViewConfig(dataService.getGridId());
					if (config) {
						let propertyConfig = config.Propertyconfig || [];
						propertyConfig = parseConfiguration(propertyConfig);

						_.forEach(propertyConfig, function (propertyItem) {
							let col = _.find(cols, {'id': propertyItem.id});// cols[propertyItem.id];
							if (col) {
								col.keyboard = propertyItem.keyboard;
							}
						});
					}

					function parseConfiguration(propertyConfig) {
						propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

						_.each(propertyConfig, function (config) {
							if (_.has(config, 'name')) {
								_.unset(config, 'name');
								_.unset(config, 'name$tr$');
								_.unset(config, 'name$tr$param$');
							}
						});

						return propertyConfig;
					}

					return cols;
				}

				function splitExpression(expression, maxLength) {
					const operators = ['+', '-', '*', '/'];
					let result = [];
					let currentExpression = '';

					for (let i = 0; i <= expression.length; i++) {
						if (i === expression.length || currentExpression.length >= maxLength) {
							let lastOperatorIndex = -1;

							for (const operator of operators) {
								const operatorIndex = currentExpression.lastIndexOf(operator);
								if (operatorIndex > lastOperatorIndex) {
									lastOperatorIndex = operatorIndex;
								}
							}

							if (lastOperatorIndex !== -1 && currentExpression.length === maxLength) {
								result.push(currentExpression.slice(0, lastOperatorIndex + 1));
								currentExpression = currentExpression.slice(lastOperatorIndex + 1);
							} else {
								// If there's no operator, push the remaining part of the expression
								result.push(currentExpression);
								currentExpression = '';
							}
						}

						if (i < expression.length) {
							currentExpression += expression[i];
						}
					}

					// Handle the case where the last part of the expression doesn't exceed maxLength
					if (currentExpression.length > 0 && currentExpression.length <= maxLength) {
						result.push(currentExpression);
					}

					return result;
				}

				let cellStyleChangedForQtoLines = function (){
					let list = dataService.getList();

					/* set as the main view config */
					setAsMainViewConfig();

					// set Merge Cell
					if (list.length === 0) {
						return;
					}
					list.forEach(function (item) {
						setMergeCell(item);
					});

					platformGridAPI.grids.invalidate(dataService.getGridId());
					platformGridAPI.grids.refresh(dataService.getGridId());
				};

				let onCellStyleChanged = function (item) {
					$timeout(function () {
						setMergeCell(item);
						platformGridAPI.grids.invalidate(dataService.getGridId());
					});
				};

				let resizeGrid = function (item){
					$timeout(function () {
						let qtoLines = dataService.getList();
						let isLast = qtoLines && qtoLines.length > 0 && item ? qtoLines[qtoLines.length - 1].Id === item.Id : false;
						if (isLast){
							platformGridAPI.grids.resize(dataService.getGridId());
						} else {
							platformGridAPI.grids.invalidate(dataService.getGridId());
						}

						let grid = platformGridAPI.grids.element('id', dataService.getGridId());
						grid.instance.editActiveCell();
					});
				};

				let showQtoFormulaUserFormBtns = [
					{
						id: 'showUserForm',
						caption: $translate.instant('qto.main.detail.userForm'),
						type: 'item',
						iconClass: 'tlb-icons ico-formula',
						isDisabled: function () {
							let selectedQtoDetailItem = dataService.getSelected();

							return _.isEmpty(selectedQtoDetailItem) || _.isEmpty(selectedQtoDetailItem.QtoFormula) || selectedQtoDetailItem.QtoFormula.BasFormFk === null;
						},
						fn: function showForm() {
							dataService.showForm();
						}
					},{
						id: 'turnOnShowUserForm',
						caption: $translate.instant('qto.main.detail.trunOnShowUserForm'),
						type: 'item',
						fn: function () {
							showQtoUserFormDialog(true);
						}
					}, {
						id: 'turnOffShowUserForm',
						caption: $translate.instant('qto.main.detail.turnOffShowUserForm'),
						type: 'item',
						fn: function () {
							showQtoUserFormDialog(false);
						}
					}
				];

				let qtoMainDetailCopyConfigService = $injector.get('qtoMainDetailCopyConfigService');
				let copyOptionsProfile = qtoMainDetailCopyConfigService.getCopyOptions();
				let showQtoCopyOptionBtns = {
					id: 'showQtoCopyOptions',
					sort: 3,
					caption: $translate.instant('boq.main.copyOptions'),
					type: 'check',
					iconClass: 'tlb-icons ico-copy-settings',
					value: copyOptionsProfile && copyOptionsProfile.IsActivate,
					fn: function () {
						qtoMainDetailCopyConfigService.showDialog();
					}
				};

				let refreshCopyOptionsBtn = function(isActivate) {
					showQtoCopyOptionBtns.value = isActivate;
					$scope.tools.update();
				}

				qtoMainDetailCopyConfigService.registerDialogClosed(refreshCopyOptionsBtn);

				$scope.showCopyOptions = function () {
					$injector.get('qtoMainSourceDetailConfigService').showDialog();
				};

				$scope.copy = function (){
					let items = dataService.getSelectedEntities();
					let copyDatas = [];
					_.each(items, function (item){
						let copyData = {
							Id: item.Id,
							QtoDetailGroupId: item.QtoDetailGroupId
						};

						copyDatas.push(copyData);
					});

					qtoMainClipboardService.copy(copyDatas, 'SourceQtoDetial');
				};

				$scope.paste = function (){
					var type = 'QtoDetail';
					switch (boqType) {
						case qtoBoqType.QtoBoq:
							type = 'QtoDetail';
							break;
						case qtoBoqType.PrcBoq:
							type = 'PrcBoqQtoDetail';
							break;
						case qtoBoqType.PrjBoq:
							type = 'PrjBoqQtoDetail';
							break;
						case qtoBoqType.WipBoq:
							type = 'WipBoqQtoDetail';
							break;
						case qtoBoqType.BillingBoq:
							type = 'BillingBoqQtoDetail';
							break;
						case qtoBoqType.PesBoq:
							type = 'PesBoqQtoDetail';
							break;
					}

					if (!qtoMainClipboardService.canPaste(type)) {
						return;
					}

					qtoMainClipboardService.paste(null, type);
				};

				function refreshSourceQto(){
					let selectedItem = $injector.get('qtoMainDetailLookupFilterService').selectedQtoHeader;
					let projectId = selectedItem ? selectedItem.ProjectFk : 0;
					$injector.get('qtoMainCommonService').setLookupWithProjectId(projectId);

					$injector.get('qtoMainLineLookupService').load();
				}

				function canRefreshSourceQto(){
					let selectedQtoHeader = $injector.get('qtoMainDetailLookupFilterService').selectedQtoHeader;
					return selectedQtoHeader && selectedQtoHeader.Id > 0;
				}

				let tools = isCopySource ? [{
					id: 'boqCopy',
					caption: $translate.instant('cloud.common.toolbarCopy'),
					type: 'item',
					iconClass: 'tlb-icons ico-copy',
					fn: $scope.copy,
					disabled: function () {
						return _.isEmpty(dataService.getSelected());
					}
				}, {
					id: 'boqCopyOptions',
					caption: $translate.instant('boq.main.copyOptions'),
					type: 'item',
					iconClass: 'tlb-icons ico-copy-settings',
					fn: $scope.showCopyOptions,
					disabled: false
				}, {
					id: 'sourceQtoRefresh',
					caption: 'basics.common.button.refresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					fn: function () {
						refreshSourceQto();
					},
					disabled: function () {
						return !canRefreshSourceQto();
					}
				}] : [
					showQtoCopyOptionBtns,
					{
					id: 'filterByBoqSplitQuantity',
					caption: 'qto.main.filterByBoqSplitQuantity',
					type: 'check',
					value: dataService.getFilterStatus(),
					iconClass: 'tlb-icons ico-line-item-filter',
					fn: function () {
						dataService.setFilterStatus(this.value);
						dataService.hasToLoadOnFilterActiveChange(this.value);
						dataService.load();
					}
				},
				{
					id: 'filterByNoWipOrBil',
					caption: 'qto.main.filterByNoWipOrBil',
					type: 'check',
					value: dataService.getFilterByNoWipOrBilStatus(),
					iconClass: 'tlb-icons ico-filter',
					fn: function () {
						dataService.setFilterByNoWipOrBilStatus(this.value);
						dataService.load();
					}
				},
				{
					id: 't1000',
					sort: 1000,
					caption: $translate.instant('qto.main.detail.insertRecord'),
					type: 'item',
					iconClass: 'tlb-icons ico-insert',
					disabled: function () {
						return true;
					},
					fn: dataService.insertItem
				},
				{
					id: 't5',
					sort: 5,
					caption: $translate.instant('qto.main.detail.copyPasteRecord'),
					type: 'item',
					disabled:function () {
						return true;
					},
					iconClass:  'tlb-icons ico-copy-paste-deep',// 'control-icons ico-boq-sub-description',
					fn: function copyQtoDetail() {
						dataService.deleteTemporaryQtos();
						dataService.copyPaste();
					}
				},
				{
					id: 'showQtoFormulaUserForm',
					sort: 6,
					caption: $translate.instant('qto.main.detail.userForm'),
					type: 'action-select-btn',
					disabled: false,
					options: {
						showTitles: true,
						showImages: true,
						items: _.filter(showQtoFormulaUserFormBtns, function(item) {
							return item.id !== (dataService.showQtoUserFormDialog() ? 'turnOnShowUserForm' : 'turnOffShowUserForm');
						})
					}
				},
				{
					id: 't7',
					sort: 7,
					caption: $translate.instant('qto.main.detail.splitQTOLine'),
					type: 'item',
					iconClass: 'tlb-icons ico-split',
					fn: function showForm() {
						dataService.splitIsBqIqQtoLine();
					}
				},
				{
					id: 't1002',
					sort: 1002,
					caption: $translate.instant('qto.main.detail.ReCalculate'),
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					fn: function updateCalculation() {
						dataService.calculateQtoLines();
					}
				},
				{
					id: 'boqPaste',
					caption: $translate.instant('cloud.common.toolbarPasteSelectedItem'),
					type: 'item',
					iconClass: 'tlb-icons ico-paste',
					fn: $scope.paste,
					disabled: function () {
						var boqItemService = $injector.get('qtoBoqStructureService');
						switch (boqType) {
							case qtoBoqType.QtoBoq:
								boqItemService = $injector.get('qtoBoqStructureService');
								break;
							case qtoBoqType.PrcBoq:
								boqItemService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
								break;
							case qtoBoqType.PrjBoq:
								boqItemService = $injector.get('boqMainService');
								break;
							case qtoBoqType.WipBoq:
								boqItemService = $injector.get('salesWipBoqStructureService');
								break;
							case qtoBoqType.PesBoq:
								boqItemService = $injector.get('prcBoqMainService').getService($injector.get('procurementContextService').getMainService());
								break;
							case qtoBoqType.BillingBoq:
								boqItemService = $injector.get('salesBillingBoqStructureService');
								break;
						}

						return _.isEmpty(boqItemService.getSelected());
					}
				}
				];
				gridControllerService.addTools(tools);

				$timeout(function () {

					let pluginOptions = {
						clipboardCommandHandler: function (editCommand) {
							editCommand.execute();
						},
						includeHeaderWhenCopying: false
					};
					// register plugin for the copy/paste
					if (platformGridAPI.grids.registerPlugin) {
						platformGridAPI.grids.setSelectionModel(dataService.getGridId(), new Slick.CellSelectionModel());
						platformGridAPI.grids.registerPlugin(dataService.getGridId(), new Slick.Plugins.CellExternalCopyManager(pluginOptions));
					}

					updateTools();
					$scope.tools.update();
				});

				/* jshint -W074 */
				let onBeforeEditCell = function (e, args) {
					dataService.setCurrentCell(args.cell);

					let currentItem = args.item;
					if(!currentItem){
						return '';
					}

					if(args.column.id !== 'isreadonly' && currentItem.IsReadonly){
						return false;
					}
					if (args.column.id === 'qtoformulafk') {
						args.column.field =  currentItem.QtoLineTypeFk === qtoMainLineType.CommentLine ? 'LineText' : 'QtoFormulaFk';
					}
					else if (args.column.id === 'value1detail') {
						switch (currentItem.QtoLineTypeFk) {
							case qtoMainLineType.Standard:
							case qtoMainLineType.Hilfswert:
							case qtoMainLineType.Subtotal:
							case qtoMainLineType.ItemTotal:
								if (args.item.QtoFormula && args.item.QtoFormula.QtoFormulaTypeFk === 2) {
									args.column.field = 'LineText';
								}
								else {
									args.column.field = 'Value1Detail';
								}
								break;
							case qtoMainLineType.RRefrence:
								args.column.field = 'QtoDetailReferenceFk';
								break;
							case qtoMainLineType.LRefrence:
							case qtoMainLineType.IRefrence:
								args.column.field = 'BoqItemReferenceFk';
								break;
							default:
								args.column.field = 'Value1Detail';
						}
					}
					else if (args.column.id === 'value2detail') {
						switch (currentItem.QtoLineTypeFk) {
							case qtoMainLineType.RRefrence:
							case qtoMainLineType.IRefrence:
								args.column.field = 'LineText';
								break;
							case qtoMainLineType.LRefrence:
								args.column.field = 'PrjLocationReferenceFk';
								break;
							default :
								args.column.field = 'Value2Detail';
						}
					}
					else if (args.column.id === 'value3detail') {
						args.column.field = currentItem.QtoLineTypeFk === qtoMainLineType.LRefrence ? 'LineText' : 'Value3Detail';
					}

					validateField(currentItem, args.column.field);

					if (args.item.__rt$data && args.item.__rt$data.readonly) {
						let metadata = args.item.__rt$data.readonly;
						if ((_.findIndex(metadata, {
							'field': args.column.field,
							'readonly': true
						}) > -1)) {
							return false;
						}
					}

					if(args.column.field.indexOf('Operator') > -1){
						$injector.get('qtoFormulaLookupService').setLookupCurrentValue(currentItem[args.column.field]);
					}

					return true;
				};

				function validateField(item, column){
					if(['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'].indexOf(column) >= 0){
						validationService.validateFieldBeforeEdit(item, column);
					}
				}

				platformGridAPI.events.register(dataService.getGridId(), 'onBeforeEditCell', onBeforeEditCell);

				function selectionChangedCallBack() {

					if (isCopySource){
						return;
					}

					let isDelete = dataService.deleteTemporaryQtos();
					let selectItem = dataService.getSelected();
					let itemList = dataService.getList();
					if(isDelete){
						// highlight
						let grid = platformGridAPI.grids.element('id',dataService.getGridId());
						selectItem = itemList && itemList.length > 0 && selectItem === null ? itemList[itemList.length -1] : selectItem;

						let ids = _.map([selectItem], 'Id');
						let rows = grid.dataView.mapIdsToRows(ids);
						grid.instance.setSelectedRows(rows, true);

						dataService.setDataSelectedItem(selectItem);
					}

					if (selectItem && selectItem.IsSplitLine){
						return;
					}

					let isCreate = dataService.getIsCreatedSucceeded();

					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					let updateDataImmediately = modTrackServ.getModifications(parentService);
					let isUpdate = updateDataImmediately.EntitiesCount > 0;
					if(!enter2Create && !isCreate && ((selectItem && selectItem.Version !== 0) || isUpdate)) {
						dataService.updateCalculation(true).then(function () {
							// set split no. as readonly
							dataService.setQtoLineSplitNoReadonly(selectItem, itemList);

							// set lineitem as readonly
							dataService.setQtoLineLineItemReadonly(selectItem, itemList);
						});
					}

					updateTools();
					$scope.tools.update();
					enter2Create = false;
					dataService.setIsCreatedSucceeded(false);
				}

				function getQtoStatusInfo(){
					let qtoHeader = parentService.getSelected();
					let qtoDetailService = null;
					let qtoDetailReadOnlyProcessor = null;
					let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
					let parentBoqIsReadOnly = false;

					if (boqType !== qtoBoqType.QtoBoq) {
						switch (boqType) {
							case qtoBoqType.PrcBoq:
								qtoDetailService = $injector.get('procurementPackageQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('procurementPackageQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.PrjBoq:
								qtoDetailService = $injector.get('boqMainQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('boqMainQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.WipBoq:
								qtoDetailService = $injector.get('salesWipQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('salesWipQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.PesBoq:
								qtoDetailService = $injector.get('procurementPesQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('procurementPesQtoDetailReadOnlyProcessor');
								break;
							case qtoBoqType.BillingBoq:
								qtoDetailService = $injector.get('salesBillingQtoDetailService');
								qtoDetailReadOnlyProcessor = $injector.get('salesBillingQtoDetailReadOnlyProcessor');
								break;
						}

						if (qtoDetailService && qtoDetailReadOnlyProcessor) {
							qtoHeader = qtoDetailService.getQtoHeader();
							qtoStatusItem = qtoHeader ? qtoDetailReadOnlyProcessor.getItemStatus(qtoHeader) : qtoStatusItem;
						}

						if (parentService && _.isFunction(parentService.getReadOnly)) {
							parentBoqIsReadOnly = parentService.getReadOnly();
						}
					}

					return {
						qtoStatusItem : qtoStatusItem,
						parentBoqIsReadOnly : parentBoqIsReadOnly,
						qtoHeader : qtoHeader
					};
				}

				function updateTools() {
					if (isCopySource){
						$scope.tools.items = _.filter($scope.tools.items, function (item) {
							return item && !['create', 'delete', 't14'].includes(item.id);
						});
					} else {
						let info = getQtoStatusInfo();
						let qtoHeader = info ? info.qtoHeader : null;
						let isBackup = qtoHeader ? qtoHeader.IsBackup : false;
						let qtoStatusItem = info ? info.qtoStatusItem : null;
						let parentBoqIsReadOnly = info ? info.parentBoqIsReadOnly : false;

						let qtodetailItem = dataService.getSelected();
						let btnStatus = false;
						let canInsert = true; // if selected qto detail is readonly and qto detail formula is multiline, cannot insert a new qto detail ahead of selected item.
						let disable = true;  // active the 'insert','copy','calculate'  button  only when qto detail data  be selected
						if (qtoStatusItem) {
							btnStatus = qtoStatusItem.IsReadOnly || qtoHeader.PrjChangeStutasReadonly;
						}
						if (qtodetailItem) {
							disable = false;

							let referencedLines = dataService.getTheSameGroupQto(qtodetailItem);
							canInsert = !qtodetailItem.IsReadonly || !(qtodetailItem.QtoFormula !== null && qtodetailItem.QtoFormula.IsMultiline);

							$timeout(function () {
								updateSplitQTOLineTool(referencedLines);
							});
						} else {
							$timeout(function () {
								updateSplitQTOLineTool();
							});
						}

						angular.forEach($scope.tools.items, function (item) {
							if (item.id === 'create') {
								item.disabled = btnStatus;
							}

							if (item.id === 'delete') {
								item.disabled = btnStatus;
							}

							if (item.id === 't1000') {
								if (btnStatus) {
									item.disabled = btnStatus || parentBoqIsReadOnly || !canInsert || isBackup;
								} else {
									item.disabled = disable || parentBoqIsReadOnly || !canInsert || isBackup;
								}
							}

							if (item.id === 't1002') {
								if (boqType === qtoBoqType.QtoBoq && !isBackup) {
									if (btnStatus) {
										item.disabled = btnStatus;
									} else {
										item.disabled = false;
									}
								} else {
									item.disabled = true;
								}
							}

							if (item.id === 't5') {
								if (btnStatus) {
									item.disabled = btnStatus;
								} else {
									item.disabled = disable;
								}
							}

							if (item.id === 'showQtoFormulaUserForm' && item.options && _.isArray(item.options.items)) {
								angular.forEach(item.options.items, function (subItem) {
									if (subItem.id === 'showUserForm') {
										subItem.disabled = !qtodetailItem || _.isNull(qtodetailItem.QtoFormula) || _.isNull(qtodetailItem.QtoFormula.BasFormFk) || isBackup;
									}
								});
								item.options.activeValue = 'showUserForm';

								if (isBackup) {
									item.permission = '#c';
								}
							}
							if (item.id === 'showQtoCopyOptions' && item.options && _.isArray(item.options.items)) {
								item.options.activeValue = 'showCopyOptions';

								if (isBackup) {
									item.permission = '#c';
								}
							}

							if (item.id === 'filterByNoWipOrBil') {
								item.disabled = (boqType !== qtoBoqType.QtoBoq || (qtoHeader && qtoHeader.QtoTargetType !== 2));
							}
						});
					}
				}

				function updateSplitQTOLineTool(entities) {
					let disabled = true;

					// only activate the Split QTOLine Button on QTO, WIP, BILL Module
					if((_.isArray(entities) && entities.length > 0) && (boqType === qtoBoqType.QtoBoq || boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq)){
						let qtoHeader = null;
						let parentBoqIsReadOnly = false;
						let qtoStatusItem = null;
						let qtoDetailService = null;
						let readOnlyProcessor = null;

						if(boqType === qtoBoqType.QtoBoq){
							qtoHeader = parentService.getSelected();
							readOnlyProcessor = $injector.get('qtoHeaderReadOnlyProcessor');
						}
						else {
							switch (boqType) {
								case qtoBoqType.WipBoq:
									qtoDetailService = $injector.get('salesWipQtoDetailService');
									readOnlyProcessor = $injector.get('salesWipQtoDetailReadOnlyProcessor');
									break;
								case qtoBoqType.BillingBoq:
									qtoDetailService = $injector.get('salesBillingQtoDetailService');
									readOnlyProcessor = $injector.get('salesBillingQtoDetailReadOnlyProcessor');
									break;
							}

							qtoHeader = qtoDetailService ? qtoDetailService.getQtoHeader() : qtoHeader;

							if(parentService && _.isFunction(parentService.getReadOnly)){
								parentBoqIsReadOnly = parentService.getReadOnly();
							}
						}

						// only activate the Split QTOLine Button when the qto header purpose is Sales WIP & Bill
						if(qtoHeader && qtoHeader.QtoTargetType === 2){
							qtoStatusItem = readOnlyProcessor ? readOnlyProcessor.getItemStatus(qtoHeader) : qtoStatusItem;

							if(qtoStatusItem && !qtoStatusItem.IsReadOnly && !parentBoqIsReadOnly){
								disabled = false;
								for(var i = 0; i < entities.length; i++){
									var entity = entities[i];

									if(!entity.IsBQ || !entity.IsIQ || entity.WipReadOnly || entity.BillReadOnly || entity.IsReadonly){
										disabled = true;
										break;
									}
								}
							}
						}
					}

					let tool = _.find($scope.tools.items,{'id':'t7'});
					if(tool){
						tool.disabled = disabled;
					}

					$scope.tools.update();
				}

				function updateInsertButton(entity){
					let info = getQtoStatusInfo();
					let qtoHeader = info ? info.qtoHeader : null;
					let qtoStatusItem = info ? info.qtoStatusItem : null;
					let parentBoqIsReadOnly = info ? info.parentBoqIsReadOnly : false;

					let btnStatus = false;
					let canInsert = true; // if selected qto detail is readonly and qto detail formula is multiline, cannot insert a new qto detail ahead of selected item.
					let disable = true;  // active the 'insert','copy','calculate'  button  only when qto detail data  be selected
					if (qtoStatusItem) {
						btnStatus = qtoStatusItem.IsReadOnly || qtoHeader.PrjChangeStutasReadonly;
					}

					if (entity) {
						disable = false;

						canInsert = !(entity.IsReadonly && entity.QtoFormula !== null && entity.QtoFormula.IsMultiline);
					}

					let tool = _.find($scope.tools.items,{'id':'t1000'});
					if(tool){
						// tool.disabled = tool.disabled || !canInsert;
						if (btnStatus) {
							tool.disabled = btnStatus || parentBoqIsReadOnly || !canInsert;
						} else {
							tool.disabled = disable || parentBoqIsReadOnly || !canInsert;
						}
					}
					$scope.tools.update();
				}

				function showQtoUserFormDialog(value){
					dataService.setQtoUserFormDialog(value);

					let showQtoUserFormDialogBtn = _.find($scope.tools.items,{id: 'showQtoFormulaUserForm'});
					if(showQtoUserFormDialogBtn){
						showQtoUserFormDialogBtn.options.activeValue = 'showUserForm';

						showQtoUserFormDialogBtn.options.items = _.filter(showQtoFormulaUserFormBtns, function(item) {
							return item.id !== (value ? 'turnOnShowUserForm' : 'turnOffShowUserForm');
						});
					}
				}
				function showQtoDetailCopyOptionDialog(value){
					dataService.setIsShowQtoDetailCopyConfig(value);

					let showQtoDetailDialogBtn = _.find($scope.tools.items,{id: 'showQtoCopyOptions'});
					if(showQtoDetailDialogBtn){
						showQtoDetailDialogBtn.options.activeValue = 'showCopyOptions';

						showQtoDetailDialogBtn.options.items = _.filter(showQtoCopyOptionBtns, function(item) {
							return item.id !== (value ? 'turnOnShowqtoCopyOptions' : 'turnOffShowqtoCopyOptions');
						});
					}
				}
				dataService.registerSelectionChanged(selectionChangedCallBack);
				dataService.updateQtoBtnTools.register(updateTools);

				dataService.updateQtoLineToolsOnHeaderSelectedChange.register(updateWipOrBillFilterTool);
				function updateWipOrBillFilterTool() {
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'filterByNoWipOrBil' && boqType === qtoBoqType.QtoBoq){
							item.value = false;
							dataService.setFilterByNoWipOrBilStatus(false);
						}
					});
				}

				dataService.cellStyleChanged.register(onCellStyleChanged);
				dataService.cellStyleChangedForQtoLines.register(cellStyleChangedForQtoLines);
				dataService.resizeGrid.register(resizeGrid);

				platformGridAPI.events.register(dataService.getGridId(), 'onKeyDown', onKeyDown);
				function onKeyDown(event, args) {
					let entity = args.grid.getDataItem(args.row);
					let column = args.grid.getColumns()[args.cell];
					let cellEditor = args.grid.getCellEditor();

					let _isImmediatePropagationStopped = false;
					if(entity && entity.QtoLineTypeFk && ((column.id === 'value1detail' && (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)) ||
						(column.id === 'qtoformulafk' && entity.QtoLineTypeFk === qtoMainLineType.CommentLine))) {
						if ((event.keyCode === 13 || event.keyCode === 9) && lastKeyCode !== 39 && lastKeyCode !== 37) {
							_isImmediatePropagationStopped = setQtoLineCellFocus(args, entity);
							event.isImmediatePropagationStopped = function isImmediatePropagationStopped() {
								return _isImmediatePropagationStopped;
							};
						} else if (!cellEditor && event.keyCode === 39 && lastKeyCode !== 13) {
							_isImmediatePropagationStopped = setQtoLineCellFocusByArrows(args, entity);
							event.isImmediatePropagationStopped = function isImmediatePropagationStopped() {
								return _isImmediatePropagationStopped;
							};
						}
					}

					if(event.keyCode === 37 && (entity && entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2)) {
						let mergeCell = getMergeCells(args);
						if (mergeCell) {
							let value1Count = mergeCell.value1Count;
							let nextCount = mergeCell.nextCount;
							if (nextCount === args.cell) {
								if (value1Count === args.cell - 1) {
									_isImmediatePropagationStopped = false;
								} else {
									let grid = platformGridAPI.grids.element('id', dataService.getGridId());
									grid.instance.setActiveCell(args.row, value1Count);
									_isImmediatePropagationStopped = true;
								}
							}

							event.isImmediatePropagationStopped = function isImmediatePropagationStopped() {
								return _isImmediatePropagationStopped;
							};
						}
					}

					// if formula assigned user form, show user form by enter
					if(event.keyCode === 13 && column.field === 'QtoFormulaFk' && (!_.isEmpty(entity) && entity.QtoFormula && entity.QtoFormula.BasFormFk > 0)) {
						enter2OpenUserForm = true;
						let isFormulaChanged = dataService.getIsFormulaChanged();
						if(!isFormulaChanged){
							enter2OpenUserForm = false;
							if(dataService.showQtoUserFormDialog()){
								dataService.showForm();
							}
						}
					}

					// create item by enter
					if(event.keyCode === 13){
						let nextEditCellNum = getLastColumnEditableNum(args);
						enter2Create = args.cell === nextEditCellNum;
					}

					lastKeyCode = event.keyCode;

					if(!entity || !entity.QtoFormula || !column || column.field.indexOf('Operator') < 0){
						return;
					}
					if(!entity.QtoFormula[column.field] || entity.QtoFormula[column.field]=== ''){
						return;
					}
					// Enter key or Tab key
					if ((event.keyCode === 9 || event.keyCode === 13) && !entity.QtoFormula.IsMultiline) {
						validationService.setOperatorByEnterKeyOrTebKey(entity, column.field, args);
					}
				}

				let inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
				inquiryService.handleInquiryToolbarButtons($scope,  true/* include all button, depending on selection */);

				if(boqType === qtoBoqType.QtoBoq) {
					parentService.onQtoHeaderRubricCatagoryChanged.register(dataService.onQtoHeaderRubricCatagoryChanged);
				}

				let splitQuantityService = dataService.getBoqSplitQuantityService(boqType);
				splitQuantityService.registerSelectionChanged(onBoqSplitQuantitySelectionChanged);
				function onBoqSplitQuantitySelectionChanged(){
					let selectedItem = splitQuantityService.getSelected();
					if(dataService.getFilterStatus() && selectedItem) {
						dataService.load();
					}
				}

				dataService.setScope($scope);

				function onSelectedRowsChanged(e, args){
					if (isCopySource){
						return;
					}

					// Set selected Items to service cache first, otherwise it will get the previous selected entities
					let selectedItems = args.rows.map(function (row) {
						return args.grid.getDataItem(row);
					});

					if(!!selectedItems && selectedItems.length === 1){
						dataService.updateStatusBarPrjChangeStutasIcon(selectedItems[0]);
					}

					$timeout(function () {
						updateSplitQTOLineTool(!!selectedItems && selectedItems.length > 0 ? selectedItems : null);
						let list = dataService.getList();
						if (list.length === 0) {
							onParentSelectionChanged();
						}
					});
				}

				platformGridAPI.events.register(dataService.getGridId(), 'onSelectedRowsChanged', onSelectedRowsChanged);

				$scope.$on('createMultiItemsInProgress', function (eventObject, isInProgress) {
					if (isInProgress) {
						$scope.loadingText = $translate.instant('qto.main.detail.createMultiItemsInProgress');
						$scope.isLoading = isInProgress;
					} else {
						$scope.isLoading = isInProgress;
					}
				});

				dataService.registerEntityCreated(validationService.entityCreated);

				if (isCopySource) {
					$injector.get('basicsLookupdataLookupDefinitionService').load([
						'qtoDetailBoqReferenceLookup'
					]);
				}

				let basicsUserformCommonService = $injector.get('basicsUserformCommonService');
				basicsUserformCommonService.winOnClosed.register(userfromClosed);
				function userfromClosed(saveIsCalled) {
					if (!saveIsCalled) {
						let options = {
							item: dataService.getSelected(),
							cell: dataService.getCurrentCell(),
							forceEdit: true
						};
						dataService.setCellFocus(options);
					}
				}

				dataService.getBoqService().registerSelectionChanged(onParentSelectionChanged);
				function onParentSelectionChanged(){
					// if is DivisionOrRoot, should not create qtoline
					let selectedBoqItem = dataService.getSelectedBoqItem();
					let boqMainCommonSerivce = $injector.get('boqMainCommonService');
					let butStatus = selectedBoqItem && boqMainCommonSerivce.isDivisionOrRoot(selectedBoqItem);
					let toolItem = _.find($scope.tools.items, {'id': 'create'});
					if (toolItem){
						toolItem.disabled = butStatus;
					}

					$scope.tools.update();
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(dataService.getGridId(), 'onSelectedRowsChanged', onSelectedRowsChanged);
					dataService.cellStyleChanged.unregister(onCellStyleChanged);
					dataService.cellStyleChangedForQtoLines.unregister(cellStyleChangedForQtoLines);
					dataService.resizeGrid.unregister(resizeGrid);
					platformGridAPI.events.unregister(dataService.getGridId(), 'onKeyDown', onKeyDown);
					platformGridAPI.events.unregister(dataService.getGridId(), 'onBeforeEditCell', onBeforeEditCell);
					dataService.unregisterSelectionChanged(selectionChangedCallBack);
					dataService.costGroupService.unregisterCellChangedEvent(dataService.getGridId());
					dataService.updateQtoBtnTools.unregister(updateTools);
					dataService.updateQtoLineToolsOnHeaderSelectedChange.unregister(updateWipOrBillFilterTool);
					qtoMainDetailCopyConfigService.unregisterDialogClosed(refreshCopyOptionsBtn);

					splitQuantityService.unregisterSelectionChanged(onBoqSplitQuantitySelectionChanged);
					if(boqType === qtoBoqType.QtoBoq) {
						parentService.onQtoHeaderRubricCatagoryChanged.unregister(dataService.onQtoHeaderRubricCatagoryChanged);
					}
					dataService.isCanCreate = undefined;
					dataService.basrubriccategoryfk = -1;

					dataService.unregisterEntityCreated(validationService.entityCreated);

					basicsUserformCommonService.winOnClosed.unregister(userfromClosed);

					dataService.getBoqService().unregisterSelectionChanged(onParentSelectionChanged);
				});
			};

			return service;
		}]);
})(angular);
