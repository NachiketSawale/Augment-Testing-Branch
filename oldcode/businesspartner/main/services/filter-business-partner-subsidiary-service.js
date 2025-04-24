/**
 * @ngdoc service
 * @name filterBusinessPartnerSubsidiaryService
 * @function
 *
 * @description delivery subsidiary grid option from businesspartner on filter dialog.
 * @auther pel 10/02 2022
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,Slick */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('filterBusinessPartnerSubsidiaryService', ['platformGridAPI', 'platformRuntimeDataService', '$http', 'platformDataProcessExtensionHistoryCreator', '$injector', '$q', 'BasicsCommonDateProcessor',
		function (platformGridAPI, platformRuntimeDataService, $http, dataProcessExtension, $injector, $q, BasicsCommonDateProcessor) {
			var ctOptions = {};
			var ctGridId = 'f3b7569b3ba344768005d7b4a24f62c1';
			var arrayData = [];
			var readonlyFields = [];

			let dateProcessor = new BasicsCommonDateProcessor(['TradeRegisterDate']);
			var service = {
				setCtOptions: setCtOptions,
				setCtGridId: setCtGridId,
				getCtOptions: getCtOptions,
				getCtGridId: getCtGridId,
				setData: setData,
				pushArrayData: pushArrayData,
				getArrayData: getArrayData,
				setSubsidiaries: setSubsidiaries,
				setGenerateSubs: setGenerateSubs,
				resetArrayData: resetArrayData,
				getGridConfig: getGridConfig,
				getGridColumns: getGridColumns,
				getSelected: getSelected
			};
			return service;

			function setCtOptions(modalOptions) {
				ctOptions = modalOptions;
			}

			function setCtGridId(gridId) {
				ctGridId = gridId;
			}

			function getCtOptions() {
				return ctOptions;
			}

			function getCtGridId() {
				return ctGridId;
			}

			function getSelected(){
				return  platformGridAPI.rows.selection({
					gridId: ctGridId
				});
			}

			function setSubsidiaries(parentSelectedItem, parentEntity, parameter, subsidiaryField) {
				let deferred = $q.defer();
				if (!platformGridAPI.grids.exist(ctGridId)) {
					deferred.resolve(true);
					return deferred.promise;
				}
				return $http.post(globals.webApiBaseUrl + 'businesspartner/main/lookup/subsidiary/search', parameter).then(function (response) {
					_.forEach(response.data, function (item) {
						dataProcessExtension.processItem(item);
						dateProcessor.processItem(item);
					});
					platformGridAPI.items.data(ctGridId, response.data);
					readonlyFields = [];
					getReadonlyFields();
					_.forEach(platformGridAPI.items.data(ctGridId), function (item) {
						platformRuntimeDataService.readonly(item, readonlyFields);
					});

					var selectedBp = _.find(arrayData, function (data) {
						return data.bpId === parentSelectedItem.Id;
					});
					if (_.isNil(subsidiaryField)) {
						subsidiaryField = 'SubsidiaryFk';
					}
					var grid = platformGridAPI.grids.element('id', ctGridId);
					if (_.isNil(selectedBp)) {
						if (!_.isNil(grid) && !_.isNil(parentEntity)) {
							var index = _.findIndex(response.data, function (d) {
								return d.Id === parentEntity[subsidiaryField];
							});
							if (index !== -1) {
								grid.instance.setSelectedRows([index]);
							} else {
								index = _.findIndex(response.data, function (d) {
									return d.IsMainAddress === true;
								});
								if (index !== -1) {
									grid.instance.setSelectedRows([index], true);
								} else {
									grid.instance.setSelectedRows([0]);
								}
							}
						}
						if (_.isNil(parentEntity)) {
							var isMainIndex = _.findIndex(response.data, function (d) {
								return d.IsMainAddress === true;
							});
							if (isMainIndex !== -1) {
								grid.instance.setSelectedRows([isMainIndex], true);
							} else {
								grid.instance.setSelectedRows([0]);
							}

						}
					} else {
						if (!_.isNil(grid)) {
							var selectedIndex = _.findIndex(response.data, function (d) {
								return d.Id === selectedBp.subsId;
							});
							if (selectedIndex !== -1) {
								grid.instance.setSelectedRows([selectedIndex], true);
							}else{
								grid.instance.setSelectedRows([0]);
							}
						}
					}

					var selectedItem = platformGridAPI.rows.selection({
						gridId: ctGridId
					});
					if (!_.isNil(selectedItem) && _.isNil(selectedBp)) {
						arrayData.push({bpId: parentSelectedItem.Id, subsId: selectedItem.Id});
					}
					if (!_.isNil(selectedItem)) {
						selectedItem.IsChecked = true;
					}
					let _data = platformGridAPI.items.data(ctGridId);
					platformGridAPI.items.data(ctGridId, _data);
					// reset selected
					if (!_.isNil(selectedItem)) {
						var selIndex = _.findIndex(response.data, function (d) {
							return d.Id === selectedItem.Id;
						});
						if (selIndex !== -1) {
							grid.instance.setSelectedRows([selIndex]);
						} else {
							grid.instance.setSelectedRows([0]);
						}
					}
					deferred.resolve(true);
					return deferred.promise;
				});

			}

			function setData(datalist) {
				platformGridAPI.items.data(ctGridId, datalist);
			}

			function pushArrayData(item) {
				arrayData.push(item);
			}

			function getArrayData() {
				return arrayData;
			}

			function resetArrayData() {
				arrayData = [];
			}

			function setGenerateSubs(mapBps) {
				if (!_.isNil(mapBps)) {
					mapBps.forEach(function (bpItem) {
						var generatedBp = _.find(arrayData, function (data) {
							return data.bpId === bpItem.BusinessPartnerFk;
						});
						if (_.isNil(generatedBp)) {
							if (!_.isNil(bpItem.BusinessPartnerFk) && !_.isNil(bpItem.SubsidiaryFk)) {
								arrayData.push({bpId: bpItem.BusinessPartnerFk, subsId: bpItem.SubsidiaryFk});
							}
						} else {
							generatedBp.subsId = bpItem.SubsidiaryFk;
						}
					});
				}

			}

			function getReadonlyFields() {
				if (_.isEmpty(readonlyFields)) {
					var columns = platformGridAPI.columns.getColumns(ctGridId);
					_.forEach(columns, function (column) {
						if (column.field !== 'IsChecked') {
							readonlyFields.push({field: column.field, readonly: true});
						}
					});
				}
			}

			function changeIsMainAddressFormatter(row, cell, value) {
				var template = '<input disabled="true" type="radio"' + '" disabled="disabled"' + (value ? ' checked="checked"' : '') + '>';
				return '<div class="text-center" >' + template + '</div>';
			}

			function changeIsCheckedFormatter(row, cell, value) {
				var template = '<input  type="radio"' + (value ? ' checked="checked"' : '') + '>';
				return '<div class="text-center" >' + template + '</div>';
			}

			function changeEmailFormatter(gridColumns) {
				_.remove(gridColumns, {id: 'email'});
				gridColumns.push({
					id: 'email',
					field: 'Email',
					name: 'Email',
					name$tr$: 'cloud.common.sidebarInfoDescription.email',
					width: 130
				});
				return gridColumns;
			}

			function getGridColumns() {
				var uiStandardService = $injector.get('businessPartnerMainSubsidiaryUIStandardService');
				var settings = uiStandardService.getStandardConfigForListView();
				var gridColumns = angular.copy(settings.columns);
				var columnDef = _.find(gridColumns, {field: 'IsMainAddress'});
				if (columnDef !== undefined && columnDef !== null) {
					columnDef.formatter = changeIsMainAddressFormatter;
				}
				// formatter: changeIsMainAddressFormatter,
				gridColumns.unshift({
					id: 'isCheck',
					field: 'IsChecked',
					name: 'Selected',
					name$tr$: 'cloud.common.entitySelected',
					formatter: changeIsCheckedFormatter,
					width: 60,
					pinned: true
				});
				gridColumns = changeEmailFormatter(gridColumns);
				gridColumns.unshift({
					id: 'distance',
					field: 'Distance',
					name: 'Distance',
					name$tr$: 'businesspartner.main.distance',
					width: 100
				}, {
					id: 'regionDistance',
					field: 'RegionDistance',
					name: 'Region Distance',
					name$tr$: 'businesspartner.main.regionDistance',
					width: 100
				});
				return gridColumns;
			}

			function getGridConfig() {
				return {
					columns: getGridColumns(),
					data: [],
					id: ctGridId,
					gridId: ctGridId,
					lazyInit: true,
					options: {
						skipPermissionCheck: true,
						iconClass: 'control-icons',
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						multiSelect: false,
						enableDraggableGroupBy: true,
						enableModuleConfig: true,
						enableConfigSave: true,
						editorLock: new Slick.EditorLock()
					}
				};
			}
		}
	]);
})(angular);