/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.common';
	let estimateCommonModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateCommonCopyPasteService
	 *
	 */
	estimateCommonModule.factory('estimateCommonCopyPasteService', ['globals' ,'_', '$q', '$http', '$injector', 'platformRuntimeDataService', 'accounting', 'platformContextService', 'platformLanguageService', 'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		function (globals, _, $q, $http, $injector, platformRuntimeDataService, accounting, platformContextService, platformLanguageService, platformGridAPI, basicsLookupdataLookupDescriptorService) {

			let editorPasteAllowed = ['description', 'remark', 'code', 'quantity', 'lookup', 'money', 'integer', 'translation', 'comment', 'dynamic', 'boolean'];
			let _gridInstance = null;
			let service = {};
			let fullQualifiedName = '';
			let currentDataService = null;
			let culture = null;
			let cultureInfo = null;
			let copyStartLocation = {
				row: null,
				cell: null,
				rowItem: null
			};
			let entitiesToProcess = [];
			let patternForNormalFormat = /^[-+]?(?:\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(\.\d+)?|\.\d+)$/; // check money or quantity columnDef
			let patternForEuropeanFormat = /^[-+]?(?:\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?|,\d+)$/; // check money or quantity columnDef

			service.pasteSelection = function pasteSelection(gridId, option) {
				if(!platformGridAPI.grids.exist(gridId)){
					return;
				}
				let grid = platformGridAPI.grids.element('id', gridId);
				fullQualifiedName = getFullQualifiedName(option.dataService);
				currentDataService = option.dataService;
				if (angular.isDefined(grid) && grid !== null && angular.isDefined(grid.instance) && grid.instance !== null) {
					_gridInstance = grid.instance;
					culture = platformContextService.culture();
					cultureInfo = platformLanguageService.getLanguageInfo(culture);
					if (navigator.clipboard) {
						navigator.clipboard.readText()
							.then(function (text) {
								pasteText(text, option);
							});
					}
				}
			};

			function pasteText(text, option) {
				if (_.isEmpty(text)) {
					return;
				}

				let clipText = text;
				let columns = _gridInstance.getColumns();
				let clipRows = clipText.split(/\r?\n/);
				// trim trailing CR if present
				if (clipRows[clipRows.length - 1] === '') {
					clipRows.pop();
				}

				let clippedRange = [];
				let j = 0;

				_.forEach(clipRows, function (clipRow) {
					if (clipRow !== '') {
						clippedRange[j++] = clipRow.split('\t');
					} else {
						clippedRange[j++] = [''];
					}
				});

				let selectedCell = _gridInstance.getActiveCell();
				let activeRow = null;
				let activeCell = null;

				if (selectedCell) {
					activeRow = selectedCell.row;
					activeCell = selectedCell.cell;
					copyStartLocation.row = activeRow;
					copyStartLocation.cell = activeCell;
					copyStartLocation.rowItem = _gridInstance.getDataItem(activeRow);
				} else {
					// we don't know where to paste
					return;
				}

				let destH = clippedRange.length; // row
				let destW = clippedRange.length ? clippedRange[0].length : 0; // cell
				let maxDestY = _gridInstance.getDataLength();
				let maxDestX = _gridInstance.getColumns().length;

				let copyColumnLookupTypeObj = [];
				let changeObjects = [];
				let modifiedItems = new Set();
				for (let y = 0; y < destH; y++) {
					let destY = activeRow + y;
					let rowItem = _gridInstance.getDataItem(destY);

					for (let x = 0; x < destW; x++) {
						let destX = activeCell + x;
						if (rowItem) {
							if (destY < maxDestY && destX < maxDestX && (columns[destX].id !== 'indicator' && columns[destX].id !== 'tree' && columns[destX].id !== 'marker' && columns[destX].id !== 'group')) {
								let columnDef = columns[destX];

								let value = clippedRange[y] ? clippedRange[y][x] : '';
								if(option.customSetDataItemValueForColumnFun){
									option.customSetDataItemValueForColumnFun(rowItem, columnDef, value, copyColumnLookupTypeObj, changeObjects, option);
								} else {
									setDataItemValueForColumn(rowItem, columnDef, value, copyColumnLookupTypeObj, changeObjects, option);
								}
								modifiedItems.add(rowItem);
							}
						}
					}
				}

				if(option.customOnPasteCompleteHandler){
					option.customOnPasteCompleteHandler(copyColumnLookupTypeObj, changeObjects, modifiedItems, option);
				}else {
					service.onPasteCompleteHandler(copyColumnLookupTypeObj, changeObjects, modifiedItems, option);
				}
			}

			function setDataItemValueForColumn (rowItem, columnDef, value, copyColumnLookupTypeObj, changeObjects, option) {
				// todo directive column
				let valid = true;
				let isChanged = false;
				let fi = _.find(platformRuntimeDataService.readonly(rowItem), {field: columnDef.field});
				let rowItemReadOnly = _.get(fi, 'readonly', false) || columnDef.denyPaste || !columnDef.editor;

				if(!rowItemReadOnly){
					if (columnDef.editor$name === 'lookup') {
						// will be collect lookup type, then when onPasteComplete call, will set id for lookup column
						if (columnDef.formatterOptions) {
							if(option.customCollectionLookupTypeFun){
								option.customCollectionLookupTypeFun(copyColumnLookupTypeObj, columnDef);
							}else {
								let copyLookupType = _.find(copyColumnLookupTypeObj, function (item) {
									return item.lookupType === columnDef.formatterOptions.lookupType;
								});
								if(!copyLookupType){
									copyColumnLookupTypeObj.push({lookupType: columnDef.formatterOptions.lookupType});
								}
							}
						}
					} else if (columnDef.editor$name === 'translation') {
						_.set(rowItem, columnDef.field + '.Description', value);
						_.set(rowItem, columnDef.field + '.Translated', value);
						isChanged = true;
					} else {
						if (columnDef.editor$name === 'quantity' || columnDef.editor$name === 'money') {
							let pattern = cultureInfo.numeric.decimal === '.' ? patternForNormalFormat : patternForEuropeanFormat;
							if(pattern.test(value)){
								value = accounting.unformat(value, cultureInfo.numeric.decimal);
							}else {
								valid = false;
							}
						}

						if(columnDef.editor$name === 'boolean'){
							value = value === '1' || value.toLowerCase() === 'true';
						}

						if(valid){
							_.set(rowItem, columnDef.field, value);
							isChanged = true;
						}
					}
				}

				createChangeObject(rowItem, columnDef, value, changeObjects, valid, isChanged, rowItemReadOnly);
			}

			function createChangeObject(entity, columnDef, value, changeObjects, valid, isChanged, rowItemReadOnly) {
				let isLookupColumn = columnDef.editor$name === 'lookup';
				let changeObject = {
					id: entity.Id,
					entityDisplayMember: entity.Code ? entity.Code :
						entity.ProjectNo ? entity.ProjectNo :
							(entity.DescriptionInfo && entity.DescriptionInfo.Translated) ? entity.DescriptionInfo.Translated :
								entity.Description ? entity.Description : entity.Id,
					isChanged: rowItemReadOnly ? false : isChanged,
					affectedProperty: columnDef.field,
					desiredValue: value,
					desiredValue2: null,
					isReadonly: rowItemReadOnly,
					valueAlreadyAssigned: false,
					isCopyPasteLookup: isLookupColumn,
					oldValue: entity[columnDef.field],
					valid: valid
				};
				if(isLookupColumn && columnDef.formatterOptions){
					changeObject.lookupType = columnDef.formatterOptions.lookupType;
					changeObject.displayMember = columnDef.formatterOptions.displayMember;
				}
				changeObjects.push(changeObject);
			}

			service.onPasteCompleteHandler = function onPasteCompleteHandler(copyColumnLookupTypeObj, changeObjects, modifiedItems) {
				let promises = [];
				_.forEach(copyColumnLookupTypeObj, function (lookupTypeObj) {
					promises.push(basicsLookupdataLookupDescriptorService.loadData(lookupTypeObj.lookupType));
				});
				$q.all(promises).then(function () {
					_.forEach(changeObjects, function (item) {
						if(item.isCopyPasteLookup && item.lookupType){
							let lookupItems = basicsLookupdataLookupDescriptorService.getData(item.lookupType);
							if(lookupItems){
								let lookupItem = _.find(lookupItems, function (data) {
									return item.desiredValue === data[item.displayMember];
								});
								if(lookupItem){
									item.desiredValue = lookupItem.Id;
								} else {
									item.desiredValue = item.oldValue;
								}
							}
							item.isChanged = item.desiredValue !== item.oldValue;
						}
					});
					service.doCopyPaste(changeObjects, modifiedItems);
				}).catch(function (error) {
					currentDataService.gridRefresh();
					return $q.reject(error);
				});
			};

			service.doCopyPaste = function doCoyPaste(changeObjects, modifiedItems) {
				let dataList = currentDataService.getList();
				let group = _.groupBy(changeObjects, 'id');
				let object = [];
				_.forIn(group, function (items) {
					let data = _.find(dataList, function (data) {
						return data.Id === items[0].id;
					});
					if(data){
						_.forEach(items,function (item) {
							if(item.lookupType && item.isChanged){
								_.set(data, item.affectedProperty, item.desiredValue);
							}
						});
					}
					object.push(items);
				});
				entitiesToProcess =  Array.from(modifiedItems);
				if(!entitiesToProcess.length){
					return;
				}
				$http.post(globals.webApiBaseUrl + 'basics/common/bulk/processBulkChanges', {
					EntitiesToProcess: entitiesToProcess,
					ChangeObjects: object,
					FullQualifiedName: fullQualifiedName
				}).then(function () {
					service.reLoadData();
				}).catch(function (error) {
					service.reLoadData();
					return $q.reject(error);
				});
			};

			function getFullQualifiedName(entityDataService) {
				if (!entityDataService.getItemName() || !entityDataService.getItemName()) {
					throw new Error('ItemName is required to save');
				}
				return (entityDataService.getModule().name + '.' + entityDataService.getItemName()).toLowerCase();
			}

			service.reLoadData = function reLoadData() {
				if(currentDataService.refreshEntities && angular.isFunction(currentDataService.refreshEntities)){
					currentDataService.refreshEntities(entitiesToProcess);
				}else {
					currentDataService.load();
				}
			};

			return service;
		}]);
})(angular);
