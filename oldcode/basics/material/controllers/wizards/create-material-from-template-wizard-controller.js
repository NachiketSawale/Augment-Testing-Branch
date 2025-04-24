/**
 * Created by alm on 11/10/2020.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialCreateMaterialFromTemplateWizardController', ['_', '$scope', '$http', '$translate','moment', 'platformGridAPI', 'basicsLookupdataLookupFilterService', 'basicsMaterialRecordUIConfigurationService', 'platformModalService','basicsMaterialRecordService',
		function (_, $scope, $http, $translate, moment,platformGridAPI, basicsLookupdataLookupFilterService, basicsMaterialRecordUIConfigurationService, platformModalService,basicsMaterialRecordService) {
			$scope.entity = {
				MaterialCatalogFk: null,
				TemplateTypeFk: null,
				searchValue: '',
				Quantity: 1,
				InheritCodeFk: null
			};
			$scope.mmcLookupOptions = {
				showClearButton: true
			};
			$scope.ttcLookupOptions = {
				showClearButton: true,
				filterKey: 'basics-material-template-type-filter',
			};
			$scope.inheritCodeLookupOptions = {
				showClearButton: true
			};
			var filters = [{
				key: 'basics-material-template-type-filter',
				serverSide: false,
				fn: function (item) {
					return item.Istemplate;

				}
			},{
				key: 'basics-material-template-type-filter1',
				serverSide: false,
				fn: function (item) {
					return !item.Istemplate&&item.Islive;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			var gridId = '2423020F04F944E6A511C0F831C8D684';
			$scope.gridData = {
				state: gridId
			};

			function setTools(tools) {
				$scope.tools = tools || {};
				$scope.tools.update = function () {
				};
			}

			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.grids.unregister(gridId);
			}
			function getColumns() {
				var materialUiService = angular.copy(basicsMaterialRecordUIConfigurationService.getStandardConfigForListView());
				return materialUiService;
			}

			var extraColumns = [
				{
					id: 'Selected',
					field: 'Selected',
					headerChkbox: true,
					name: 'Selected',
					name$tr$: 'basics.material.record.selected',
					editor: 'boolean',
					formatter: 'boolean',
					width: 35
				}
			];
			var layoutUIGridColumns = getColumns().columns;
			var columns=[];
			_.forEach(layoutUIGridColumns, function (item) {
				if(item.editor!=='select') {
					var column={
						id: item.id,
						field: item.field,
						formatter: item.formatter,
						formatterOptions: item.formatterOptions,
						name: item.name,
						name$tr$: item.name$tr$,
						name$tr$param$: item.name$tr$param$,
						readonly:true,
						grouping: item.grouping
					};
					columns.push(column);

				}
			});
			var gridColumns = _.concat(extraColumns, columns);
			var gridConfig = {
				columns: angular.copy(gridColumns),
				data: [],
				id: gridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					enableDraggableGroupBy: true,
					enableConfigSave: true
				},
				enableConfigSave: true
			};
			platformGridAPI.grids.config(gridConfig);
			setTools(
				{
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't4',
							caption: 'cloud.common.toolbarSearch',
							type: 'check',
							value: platformGridAPI.filters.showSearch(gridId),
							iconClass: 'tlb-icons ico-search',
							fn: function () {
								platformGridAPI.filters.showSearch(gridId, this.value);
							}
						},
						{
							id: 't16',
							sort: 10,
							caption: 'cloud.common.taskBarGrouping',
							type: 'check',
							iconClass: 'tlb-icons ico-group-columns',
							fn: function () {
								platformGridAPI.grouping.toggleGroupPanel(gridId, this.value);
							},
							value: platformGridAPI.grouping.toggleGroupPanel(gridId),
							disabled: false
						},
						{
							id: 't111',
							sort: 111,
							caption: 'cloud.common.gridlayout',
							iconClass: 'tlb-icons ico-settings',
							type: 'item',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog(gridId);
							}
						}
					]
				});




			$scope.onSearch = function (searchValue) {
				var entity = $scope.entity;
				var param = {
					SearchValue: searchValue,
					MaterialCatalogFk: entity.MaterialCatalogFk,
					TemplateTypeFk: entity.TemplateTypeFk
				};
				$http.post(globals.webApiBaseUrl + 'basics/material/template/getMaterialByTemplate', param).then(function (res) {
					if (res.data) {
						var readData = res.data;
						var taxCodes=readData.TaxCode;
						var gridData=readData.Main;
						var neutralMaterialRecords = readData.MaterialRecord ? readData.MaterialRecord : [];
						_.forEach(gridData, function (item) {
							item.Selected = false;
							item.UserDefinedDate1=moment.utc(item.UserDefinedDate1);
							item.UserDefinedDate2=moment.utc(item.UserDefinedDate2);
							item.UserDefinedDate3=moment.utc(item.UserDefinedDate3);
							item.UserDefinedDate4=moment.utc(item.UserDefinedDate4);
							item.UserDefinedDate5=moment.utc(item.UserDefinedDate5);
							var taxCode = _.find(taxCodes, {Id: item.MdcTaxCodeFk });
							var vatPercent = taxCode ? taxCode.VatPercent : 0;
							item.CostPriceGross = item.Cost * (100 + vatPercent) / 100;
							if (item.MdcMaterialFk) {
								var neutralMaterialRecord = _.find(neutralMaterialRecords, function (netural) {
									return netural.Id === item.MdcMaterialFk;
								});
								if (neutralMaterialRecord) {
									item.NeutralMaterialCatalogFk = neutralMaterialRecord.MaterialCatalogFk;
								}
							}
						});
						platformGridAPI.items.data(gridId, gridData);
					}
				});
			};

			$scope.createMaterial = function () {
				var entity = $scope.entity;
				var grid = platformGridAPI.grids.element('id', gridId);
				var gridDatas = grid.dataView.getRows();
				var selectedItems = [];
				_.forEach(gridDatas, function (item) {
					if (item.Selected) {
						selectedItems.push(item.Id);
					}
				});
				if(selectedItems.length<1){
					platformModalService.showMsgBox($translate.instant('basics.material.createMaterialByTemplate.onItemSelected'), 'Info', 'ico-info');
					return false;
				}
				if(entity.Quantity<1){
					platformModalService.showMsgBox($translate.instant('basics.material.createMaterialByTemplate.quantityOfCopyMustIntegerGreater'), 'Info', 'ico-info');
					return false;
				}
				var param = {
					SelectedItems: selectedItems,
					Quantity: entity.Quantity,
					InheritCodeFk: entity.InheritCodeFk
				};
				$http.post(globals.webApiBaseUrl + 'basics/material/template/createByTemplate', param).then(function (res) {
					if (res.data&&res.data.CreateObjects.length>0) {
						platformModalService.showMsgBox($translate.instant('basics.material.createMaterialByTemplate.createTemplateSuccess'), 'Info', 'ico-info');
						var materials=res.data.CreateObjects;
						if(materials && materials.length>0){
							_.forEach(materials,function(item){
								item.UserDefinedDate1=moment.utc(item.UserDefinedDate1);
								item.UserDefinedDate2=moment.utc(item.UserDefinedDate2);
								item.UserDefinedDate3=moment.utc(item.UserDefinedDate3);
								item.UserDefinedDate4=moment.utc(item.UserDefinedDate4);
								item.UserDefinedDate5=moment.utc(item.UserDefinedDate5);
							});
							basicsMaterialRecordService.setList(materials);
							basicsMaterialRecordService.setSelected(materials[0]);
						}
					}
					else {
						platformModalService.showMsgBox($translate.instant('basics.material.createMaterialByTemplate.createFailure'), 'Info', 'ico-info');
					}

					$scope.$close();
				});
			};

		}]);

})(angular);