/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	let moduleName = 'qto.main';

	/**
	 * @ngdoc factory
	 * @name qtoMainRebImportWizard
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportWizardService', ['$injector', '$translate', '$http', '$timeout', 'platformModalFormConfigService', 'platformTranslateService', 'platformGridAPI', 'QtoType',
		function ($injector, $translate, $http, $timeout, platformModalFormConfigService, platformTranslateService, platformGridAPI, qtoType) {
			let service = {};

			function generateRebImportDialogConfig(dataItem) {
				let title = 'qto.main.rebImport.title';
				let isOnrom = dataItem.QtoHeader.QtoTypeFk === qtoType.OnormQTO;
				let rebImportDialogConfig = {
					title: $translate.instant(title),
					resizeable: true,
					dataItem: dataItem,
					formConfiguration: {
						fid: 'qto.main.rebImport',
						version: '0.1.1',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								header: 'Basic Setting',
								header$tr$: 'qto.main.rebImport.baseGroup',
								visible: true,
								isOpen: true,
								attributes: ['SelectedItem']
							},
							{
								gid: 'filterAddressGroup',
								header: 'Filter Address Area',
								header$tr$: 'qto.main.rebImport.filterAddressGroup',
								isOpen: true,
								visible: false,
								attributes: []
							},
							{
								gid: 'filterBoQGroup',
								header: 'Filter BoQ Area',
								header$tr$: 'qto.main.rebImport.filterBoQGroup',
								isOpen: true,
								visible: false,
								attributes: []
							},
							{
								gid: 'filterLocationGroup',
								header: 'Filter Location Area',
								header$tr$: 'qto.main.rebImport.filterLocationGroup',
								isOpen: true,
								visible: false,
								attributes: []
							},
							{
								gid: 'filterBillToGroup',
								header: 'Filter Bill To Area',
								header$tr$: 'qto.main.rebImport.filterBillToGroup',
								isOpen: true,
								visible: false,
								attributes: []
							},
							{
								gid: 'filterCostGroupGroup',
								header: 'Filter Cost Group Area',
								header$tr$: 'qto.main.rebImport.filterCostGroupGroup',
								isOpen: true,
								visible: false,
								attributes: []
							}
						],
						rows: [
							// Base Group
							{
								gid: 'baseGroup',
								rid: 'SelectFile2Import',
								label: 'File to Import',
								label$tr$: 'basics.import.entityFile2Import',
								type: 'directive',
								model: 'File2Import',
								directive: 'qto-main-reb-import-file-selection-control',
								options: {},
								visible: true,
								required: true,
								sortOrder: 1
							},
							{
								gid: 'baseGroup',
								rid: 'Entire2Import',
								label: 'Import Entire Quantity Takeoff',
								label$tr$: 'qto.main.rebImport.entire2Import',
								type: 'boolean',
								model: 'Entire2Import',
								change: function (entity) {
									// show/hide groups
									service.setRowsVisable(rebImportDialogConfig, entity);

									// update form configuration
									$timeout(function () {
										if (!entity.Entire2Import) {
											loadData(entity, dataItem);
										}

									}, 500);
								},
								sortOrder: 2
							},
							{
								gid: 'filterAddressGroup',
								rid: 'SheetArea',
								label: 'Sheet Area',
								label$tr$: 'qto.main.sheetArea',
								type: 'description',
								model: 'SheetArea',
								validator: function(entity, value, model){
									let result = $injector.get('qtoAddressRangeDialogDetailValidationService').checkNum(value);
									dataItem.isOkBtnDisabled = !result.valid;
									entity.isOkBtnDisabled = !result.valid;

									if (result.valid && entity.QtoHeader) {
										let lastSheet = entity.QtoHeader.QtoTypeFk === 1 ?  99999 : 9999;
										let hasSheet = isWithinAddressRange(value, lastSheet);
										if (hasSheet){
											result.valid = false;
											result.error = $translate.instant('qto.main.rebImport.errorSheet', {
												value0: lastSheet
											});
										}
									}

									if (result.valid && entity.SourceSheetArea) {
										let sheets = parseAndFlatten(value);
										let sourceSheets = parseAndFlatten(entity.SourceSheetArea);
										let isSubset = sheets.every(function (item) {
											return sourceSheets.includes(item);
										});

										if (!isSubset) {
											result.valid = false;
											result.error = $translate.instant('qto.main.rebImport.sheetArea', {
												value0: value,
												value1: entity.SourceSheetArea
											});
										}
									}

									return result;
								},
								readonly: isOnrom,
								sortOrder: 5
							},
							{
								gid: 'filterAddressGroup',
								rid: 'LineArea',
								label: 'Line Area',
								label$tr$: 'qto.main.lineArea',
								type: 'description',
								model: 'LineArea',
								change: function (entity) {
									let value = entity.LineArea;
									entity.LineArea = value ? value.toUpperCase() : value;
								},
								validator: function(entity, value, model){
									let result =  $injector.get('qtoAddressRangeDialogDetailValidationService').checkChar(value);
									dataItem.isOkBtnDisabled = !result.valid;
									entity.isOkBtnDisabled = !result.valid;

									if (result.valid && entity.SourceLineArea) {
										value = value ? value.toUpperCase() : value;
										let sourceLines = parseStringToArray(entity.SourceLineArea);
										let lines = parseStringToArray(value);
										let isSubset = lines.every(function (item) {
											return sourceLines.includes(item);
										});

										if (!isSubset) {
											result.valid = false;
											result.error = $translate.instant('qto.main.rebImport.lineArea', { value0: value,  value1: entity.SourceLineArea});
										}
									}

									return result;
								},
								readonly: isOnrom,
								sortOrder: 6
							},
							{
								gid: 'filterAddressGroup',
								rid: 'IndexArea',
								label: 'Index Area',
								label$tr$: 'qto.main.indexArea',
								type: 'description',
								model: 'IndexArea',
								validator: function(entity, value, model){
									let result = $injector.get('qtoAddressRangeDialogDetailValidationService').checkNum(value);
									dataItem.isOkBtnDisabled = !result.valid;
									entity.isOkBtnDisabled = !result.valid;

									if (result.valid && entity.QtoHeader) {
										let lastIndex = entity.QtoHeader.QtoTypeFk === 1 ? 99 : 9;
										let hasIndex = isWithinAddressRange(value, lastIndex);
										if (hasIndex){
											result.valid = false;
											result.error = $translate.instant('qto.main.rebImport.errorIndex', {
												value0: lastIndex
											});
										}
									}

									if (result.valid && entity.SourceIndexArea) {
										let Indexs = parseAndFlatten(value);

										let sourceIndexs = parseAndFlatten(entity.SourceIndexArea);
										let isSubset = Indexs.every(function (item) {
											return sourceIndexs.includes(item);
										});

										if (!isSubset) {
											result.valid = false;
											result.error = $translate.instant('qto.main.rebImport.indexArea', {
												value0: value,
												value1: entity.SourceIndexArea
											});
										}
									}

									return result;
								},
								readonly: isOnrom,
								sortOrder: 7
							},
							{
								gid: 'filterBoQGroup',
								rid: 'SelectBoqs',
								type: 'directive',
								model: 'SelectBoqs',
								directive: 'qto-main-reb-import-select-boq-grid',
								sortOrder: 8
							},
							{
								gid: 'filterLocationGroup',
								rid: 'SelectLocations',
								type: 'directive',
								model: 'SelectLocations',
								directive: 'qto-main-reb-import-select-location-grid',
								sortOrder: 9
							},
							{
								gid: 'filterBillToGroup',
								rid: 'SelectBillTos',
								type: 'directive',
								model: 'SelectBillTos',
								directive: 'qto-main-reb-import-select-bill-to-grid',
								sortOrder: 9
							},
							{
								gid: 'filterCostGroupGroup',
								rid: 'SelectCostGroupCats',
								label: 'Cost Group Catalog',
								label$tr$: 'qto.main.rebImport.costGroupCatalogEntity',
								type: 'directive',
								model: 'SelectCostGroupCats',
								directive: 'qto-main-reb-import-cost-group-cat-grid',
								sortOrder: 10
							},
							{
								gid: 'filterCostGroupGroup',
								rid: 'SelectCostGroups',
								label: 'Cost Group',
								label$tr$: 'qto.main.costGroup',
								type: 'directive',
								model: 'SelectCostGroups',
								directive: 'qto-main-reb-import-select-cost-group-grid',
								sortOrder: 11
							}
						]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !dataItem.IsFileSelected || dataItem.isOkBtnDisabled;
						}
					}
				};

				// columns of quantity
				let qtoTypeRows = getQuantityTypeRows(dataItem);
				rebImportDialogConfig.formConfiguration.rows = rebImportDialogConfig.formConfiguration.rows.concat(qtoTypeRows);

				return rebImportDialogConfig;
			}

			function loadData(entity, dataItem) {
				// load address
				let postParam = {
					BoqHeaderId: entity.QtoHeader.BoqHeaderFk,
					qtoHeaderFk: entity.QtoHeader.Id
				};
				$http.post(globals.webApiBaseUrl + 'qto/main/header/preparerebimport', postParam).then(function (respone) {
					// set dataItem
					if (respone.data) {
						dataItem.SourceSheetArea = respone.data.SheetArea;
						dataItem.SheetArea = respone.data.SheetArea;
						dataItem.SourceLineArea = respone.data.LineArea;
						dataItem.LineArea = respone.data.LineArea;
						dataItem.SourceIndexArea = respone.data.IndexArea;
						dataItem.IndexArea = respone.data.IndexArea;
					}
				});

				// load boq items
				let selectBoqService = $injector.get('qtoMainRebImportSelectBoqService');
				selectBoqService.loadBoqItems(entity.QtoHeader.BoqHeaderFk);

				// load location items
				let selectLocationService = $injector.get('qtoMainRebImportSelectLocationService');
				selectLocationService.loadLocationItems(entity.QtoHeader.ProjectFk);

				// load bill to items
				let selectBillToService = $injector.get('qtoMainRebImportSelectBillToService');
				selectBillToService.loadBillToItems(entity.QtoHeader.ProjectFk);

				// load cost group catalog items
				let costGroupCatService = $injector.get('qtoMainRebImportCostGroupCatService');
				costGroupCatService.loadCostGroupCatItems(entity.QtoHeader.ProjectFk);
			}

			function getQuantityTypeRows(dataItem){
				let qtoTargetType = dataItem.QtoHeader.QtoTargetType;
				if (qtoTargetType === 3 || qtoTargetType === 4) {
					dataItem.WQQuantiy = false;
					dataItem.AQQuantiy = false;
					return [
						{
							gid: 'baseGroup',
							rid: 'WQQuantiy',
							label: 'WQ Quantiy',
							label$tr$: 'qto.main.rebImport.wqQuantity',
							type: 'boolean',
							model: 'WQQuantiy',
							visible: false,
							sortOrder: 3
						},
						{
							gid: 'baseGroup',
							rid: 'AQQuantiy',
							label: 'AQ Quantiy',
							label$tr$: 'qto.main.rebImport.aqQuantity',
							type: 'boolean',
							model: 'AQQuantiy',
							visible: false,
							sortOrder: 4
						}
					];
				} else {
					dataItem.IQQuantiy = false;
					dataItem.BQQuantiy = false;
					return [
						{
							gid: 'baseGroup',
							rid: 'IQQuantiy',
							label: 'IQ Quantiy',
							label$tr$: 'qto.main.rebImport.iqQuantity',
							type: 'boolean',
							model: 'IQQuantiy',
							visible: false,
							sortOrder: 3
						},
						{
							gid: 'baseGroup',
							rid: 'BQQuantiy',
							label: 'BQ Quantiy',
							label$tr$: 'qto.main.rebImport.bqQuantity',
							type: 'boolean',
							model: 'BQQuantiy',
							visible: false,
							sortOrder: 4
						}
					];
				}
			}

			function parseAndFlatten(input) {
				let result = [];
				let parts = input.split(',');

				for (let i = 0; i < parts.length; i++) {
					let part = parts[i];
					let numbers = part.split('-').map(Number);
					if (numbers.length === 2) {
						let start = numbers[0];
						let end = numbers[1];
						for (let j = start; j <= end; j++) {
							result.push(j);
						}
					} else {
						result.push(numbers[0]);
					}
				}

				return result;
			}

			function parseStringToArray(str) {
				return str.split(',').flatMap(function(part) {
					if (part.includes('-')) {
						let start = part.split('-')[0].charCodeAt(0);
						let end = part.split('-')[1].charCodeAt(0);
						let chars = [];
						for (let i = start; i <= end; i++) {
							chars.push(String.fromCharCode(i));
						}
						return chars;
					} else {
						return part;
					}
				});
			}

			function isWithinAddressRange(value, lastValue) {
				let arr = value.split(',');
				let arrs = arr.map(function (item) {
					if (item.indexOf('-') !== -1) {
						return item.split('-').join(',');
					}
					return item;
				}).join(',').split(',');

				return arrs.some(function (numStr) {
					let num = parseInt(numStr, 10);
					return !isNaN(num) && num > lastValue;
				});
			}

			service.showDialog = function (qtoHeader, isCrbBoq) {
				// clear first
				initialImportDialog();

				let dataItem = {
					QtoHeader: qtoHeader,
					IsCrbBoq: isCrbBoq,
					Entire2Import: true,
					IsFileSelected: false
				};

				let rebImportDialogConfig = generateRebImportDialogConfig(dataItem);
				platformTranslateService.translateFormConfig(rebImportDialogConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(rebImportDialogConfig);
			};

			service.setCurrentScope = function (scope) {
				service.scope = scope;
			};

			service.setFormData = function (formData, data) {
				formData.append('Entire2Import', data.Entire2Import);

				if (data.Entire2Import){
					return;
				}

				if (!angular.isUndefined(data.WQQuantiy)){
					formData.append('WQQuantiy', data.WQQuantiy);
				}

				if (!angular.isUndefined(data.AQQuantiy)){
					formData.append('AQQuantiy', data.AQQuantiy);
				}

				if (!angular.isUndefined(data.IQQuantiy)){
					formData.append('IQQuantiy', data.IQQuantiy);
				}

				if (!angular.isUndefined(data.BQQuantiy)){
					formData.append('BQQuantiy', data.BQQuantiy);
				}

				// set filter address items
				if (data.SheetArea) {
					formData.append('SheetArea', data.SheetArea);
				}

				if (data.LineArea) {
					formData.append('LineArea', data.LineArea);
				}

				if (data.IndexArea) {
					formData.append('IndexArea', data.IndexArea);
				}

				// set filter boq items
				let selectBoqService = $injector.get('qtoMainRebImportSelectBoqService');
				let boqIds = selectBoqService.getPositionAndIsMarkedIdList();
				if (boqIds && boqIds.length > 0) {
					formData.append('BoqIds', boqIds);
				}

				// set filter location items
				let selectLocationService = $injector.get('qtoMainRebImportSelectLocationService');
				let locationIds = selectLocationService.getIsMarkedIdList();
				if (locationIds && locationIds.length > 0) {
					formData.append('LocationIds', locationIds);
				}

				// set filter bill to items
				let selectBillToService = $injector.get('qtoMainRebImportSelectBillToService');
				let billToIds = selectBillToService.getIsMarkedIdList();
				if (billToIds && billToIds.length > 0) {
					formData.append('BillToIds', billToIds);
				}

				// set filter cost group items
				let selectCostGroupService = $injector.get('qtoMainRebImportSelectCostGroupService');
				let costGroupIds = selectCostGroupService.getIsMarkedIdList();
				if (costGroupIds && costGroupIds.length > 0) {
					formData.append('CostGroupIds', costGroupIds);
				}
			};

			function initialImportDialog(){
				let selectBoqService = $injector.get('qtoMainRebImportSelectBoqService');
				let selectLocationService = $injector.get('qtoMainRebImportSelectLocationService');
				let selectBillToService = $injector.get('qtoMainRebImportSelectBillToService');
				let selectCostGroupService = $injector.get('qtoMainRebImportSelectCostGroupService');

				// clear the gridids
				selectBoqService.setGridId(null);
				selectLocationService.setGridId(null);
				selectBillToService.setGridId(null);
				selectCostGroupService.setGridId(null);
				selectCostGroupService.clearHashCostGroup();
			}

			service.setRowsVisable = function (rebImportDialogConfig, entity) {
				// show/hide groups
				rebImportDialogConfig.formConfiguration.groups.forEach(function (group) {
					if (group.gid !== 'baseGroup') {
						group.visible = !entity.Entire2Import;
					}

					if (group.visible && ['filterLocationGroup', 'filterBillToGroup', 'filterCostGroupGroup'].includes(group.gid)) {
						if (entity.FileData && entity.FileData.name) {
							let endsWithX31orD11 = ['.X31', '.D11'].some(function(suffix) {
								return entity.FileData.name.toUpperCase().endsWith(suffix);
							});
							if (endsWithX31orD11) {
								group.visible = false;
							}
						}
					}
				});

				// show/hide rows
				rebImportDialogConfig.formConfiguration.rows.forEach(function (row) {
					if (row.rid === 'WQQuantiy' || row.rid === 'AQQuantiy' || row.rid === 'IQQuantiy' || row.rid === 'BQQuantiy') {
						row.visible = !entity.Entire2Import;
					}
				});

				service.scope.$broadcast('form-config-updated');
			};

			return service;
		}
	]);
})(angular);