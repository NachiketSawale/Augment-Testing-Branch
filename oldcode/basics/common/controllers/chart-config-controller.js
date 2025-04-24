(function (){
	'use strict';
	/* global */

	let moduleName = 'basics.common';
	angular.module(moduleName).controller('chartConfigController', ['_', '$scope', '$translate', '$timeout', 'platformGridAPI', '$http','platformGridConfigService',
		'platformRuntimeDataService', 'platformTranslateService', 'basicsCommonChartConfigService',
		function (_, $scope, $translate, $timeout, platformGridAPI, $http, platformGridConfigService,
			platformRuntimeDataService, platformTranslateService, chartConfigService){

			// region menu part
			$scope.nameProperty = 'name';

			$scope.displayedItems = [
				{
					name: $translate.instant('basics.common.chartConfig.dataSeries'),
					value: 'dataSeries'
				},
				{
					name: $translate.instant('basics.common.chartConfig.dataGroup'),
					value: 'dataGroup'
				},
				{
					name: $translate.instant('basics.common.chartConfig.chartType'),
					value: 'chartType'
				},
				{
					name: $translate.instant('basics.common.chartConfig.color'),
					value: 'color'
				},
				{
					name: $translate.instant('basics.common.chartConfig.title'),
					value: 'title'
				},
				{
					name: $translate.instant('basics.common.chartConfig.legendAndData'),
					value: 'legendAndData'
				},
				{
					name: $translate.instant('basics.common.chartConfig.x_Aixs'),
					value: 'x_Aixs'
				},
				{
					name: $translate.instant('basics.common.chartConfig.y_Aixs'),
					value: 'y_Aixs'
				}
			];

			$scope.isDisabled = function (item) {
				return !item;
			};

			$scope.selectItem = function (item){
				$scope.selectedItem = item;
				if(item.value === 'dataSeries'){
					setupSeriesGrid();
				}else if(item.value === 'color'){
					setupColorGrid();
				}else if(item.value === 'dataGroup'){
					setupCategoryGrid();
				}
			};
			// endregion

			$scope.dataItem = {
				ChartTypeId: 2,
				CategoryKey: 0,
				HideZeroValue: false,
				HideZeroValueX: false,
				DrillDownForData: false,
				FilterBySelectStructure:false,
				Is3DView: false,
				ShowTitle: false,
				Title: '',
				TitleAlign: 1,
				ShowDataLabel: false,
				LegendAlign:2,
				ShowLegend: true,
				ReverseOrder: false,
				ShowXAxis: false,
				XTitle: '',
				HideXGridLine: false,
				ShowYAxis: false,
				YTitle: '',
				HideYGridLine: false
			};

			$scope.chartType = 'bar';

			$scope.dataItemChange = function (field){
				if(field === 'ChartTypeId'){
					$scope.dataItem.Is3DView = $scope.isLineChart() ? false :$scope.dataItem.Is3DView;
					$scope.dataItem.ReverseOrder = $scope.isLineChart() ? false : $scope.dataItem.ReverseOrder;
					$scope.dataItem.DrillDownForData = $scope.isLineChart() ? false : $scope.dataItem.DrillDownForData;
					$scope.dataItem.FilterBySelectStructure = $scope.isBarChart();
				}
				loadChartData();
			};

			// region series grid loading
			let seriesGridId = 'd55334021fad401fa18ff6b271898777';
			let seriesGridColumns = [
				{ id: 'checked', field: 'Selected', name: 'Selected', width: 60, toolTip: 'Select', formatter: 'boolean',  name$tr$: 'basics.common.checkbox.select',
					validator: 'isSeriesValueChange'},
				{ id: 'code', field: 'Code', name: 'Code', width: 80, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.code'},
				{ id: 'description', field: 'Description', name: 'Description', width: 180, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
				{ id: 'columnType', field: 'ColumnType', name: 'ColumnType', width: 160, toolTip: 'Column Type', formatter: 'description', name$tr$: 'basics.common.chartConfig.columnType'}
			];

			$scope.isSeriesValueChange = function isSeriesValueChange(entity, value) {
				entity.Selected = value;
				loadChartData();
				if(entity && entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors.Selected){
					return {apply: true, valid: false, error: entity.__rt$data.errors.Selected};
				}

				return {apply: true, valid: true, error: ''};
			};

			function checkAll(e){
				_.forEach($scope.seriesDataList, function (item){
					item.Selected = e.target.checked;
				});

				$timeout(function () {
					loadChartData();
				});
			}

			$scope.seriesData = {
				state: seriesGridId
			};

			$scope.seriesDataList = [];

			$scope.tools = platformGridConfigService.initToolBar(seriesGridId);
			_.forEach($scope.tools.items, function (item){
				item.disabled = function (){
					let gridInstance = platformGridAPI.grids.element('id', seriesGridId).instance;
					let selectedRows = angular.isDefined(gridInstance) ? gridInstance.getSelectedRows() : [];
					let searchTexBox = $('.filterPanel.'+seriesGridId).children();
					return !selectedRows || selectedRows.length <= 0 || gridInstance.getOptions().showFilterRow || (searchTexBox && searchTexBox.val());
				};
			});

			let searchColumnToggle;

			let searchAllToggle = {
				id: 'gridSearchAll',
				sort: 150,
				caption: 'cloud.common.taskBarSearch',
				type: 'check',
				iconClass: 'tlb-icons ico-search-all',
				fn: function () {
					let grid = platformGridAPI.grids.element('id', seriesGridId);
					searchAllToggle.value = !grid.instance.getOptions().showMainTopPanel;
					toggleFilter(searchAllToggle.value);

					if (platformGridAPI.grids.renderHeaderRow(seriesGridId)) {
						if (searchAllToggle.value && searchColumnToggle.value) {
							searchColumnToggle.value = false;
							toggleColumnFilter(false, true);
						}
					}

					let targetBtn = document.getElementById(seriesGridId).getElementsByClassName('ico-search-all')[0];
					if (targetBtn) {
						searchAllToggle.value ? targetBtn.addClass('active') : targetBtn.removeClass('active');
					}
					doToolbarRefresh();
				},
				disabled: function () {
					return $scope.showInfoOverlay;
				}
			};

			searchColumnToggle = {
				id: 'gridSearchColumn',
				sort: 160,
				caption: 'cloud.common.taskBarColumnFilter',
				type: 'check',
				iconClass: 'tlb-icons ico-search-column',
				fn: function () {
					let grid = platformGridAPI.grids.element('id', seriesGridId);
					searchColumnToggle.value = !grid.instance.getOptions().showFilterRow;
					toggleColumnFilter(searchColumnToggle.value);

					if (searchColumnToggle.value && searchAllToggle.value) {
						searchAllToggle.value = false;
						toggleFilter(false, true);
					}

					let targetBtn = document.getElementById(seriesGridId).getElementsByClassName('ico-search-column')[0];
					if (targetBtn) {
						searchColumnToggle.value ? targetBtn.addClass('active') : targetBtn.removeClass('active');
					}
					doToolbarRefresh();
				},
				disabled: function () {
					return $scope.showInfoOverlay;
				}
			};

			function toggleFilter(active, clearFilter) {
				platformGridAPI.filters.showSearch(seriesGridId, active, clearFilter);
			}

			function toggleColumnFilter(active, clearFilter) {
				platformGridAPI.filters.showColumnSearch(seriesGridId, active, clearFilter);
			}

			$scope.tools.items.unshift(searchColumnToggle);
			$scope.tools.items.unshift(searchAllToggle);


			function doToolbarRefresh() {
				if ($scope.tools && _.isFunction($scope.tools.refresh)) {
					$scope.tools.refresh();
				}
			}

			function setupSeriesGrid(){
				if(!platformGridAPI.grids.exist(seriesGridId)){
					_.forEach(seriesGridColumns, function (item){
						if(item.id === 'checked'){
							item.editor = $scope.isReadOnly ? null : 'boolean';
							item.headerChkbox = !$scope.isReadOnly;
						}
					});

					let seriesGridConfig = {
						columns: angular.copy(seriesGridColumns),
						data:[],
						id: seriesGridId,
						options: {
							indicator: true,
							idProperty: 'Id',
							multiSelect: false
						}
					};

					platformGridAPI.grids.config(seriesGridConfig);
					platformTranslateService.translateGridConfig(seriesGridConfig.columns);
					loadSeriesGrid();
				}
			}

			function loadSeriesGrid(){
				if(!$scope.seriesDataList || $scope.seriesDataList.length <=0){
					$scope.seriesDataList = $scope.options.value.series;
					$scope.seriesDataList = _.orderBy($scope.seriesDataList, ['Code']);
					let i = 0, j = 0;

					_.forEach($scope.seriesDataList, function (item){
						item.Color = item.DataConfig ? $scope.$eval(item.DataConfig).color - 0 : null;
						item.RandValue1 = 0;
						if(item.Selected){
							item.RandValue2 = j === 0 ? 4 : j === 1 ? 5 : j === 2 ? 6 : 2 + j * 3;
							item.RandValue3 = j === 0 ? 7 : j === 1 ? 6 : j === 2 ? 8 : 5 + j * 3;
							item.RandValue4 = j === 0 ? 18 : j === 1 ? 24 : j === 2 ? 35 : 20 + j * 3;
							item.RandValue5 = j === 0 ? 60 : j === 1 ? 65 : j === 2 ? 59 : 30 + j * 3;
							item.RandValue6 = j === 0 ? 120 : j === 1 ? 100 : j === 2 ? 85 : 40 + j * 3;
							let randValue = rand(1, 20);
							item.RandValue7 = j === 0 ? 130 : j === 1 ? 170 : j === 2 ? 90 : 190 + j * randValue;
							item.RandValue8 = j === 0 ? 130 : j === 1 ? 190 : j === 2 ? 90 : 190 + j * randValue;
							item.RandValue9 = j === 0 ? 130 : j === 1 ? 190 : j === 2 ? 90 : 190 + j * randValue;
							item.RandValue10 = j === 0 ? 130 : j === 1 ? 200 : j === 2 ? 90 : 190 + j * randValue;
							j++;
						}else{
							item.RandValue2 = 2 + i * 3;
							item.RandValue3 = 5 + i * 3;
							item.RandValue4 = 20 + i * 3;
							item.RandValue5 = 30 + i * 3;
							item.RandValue6 = 40 + i * 3;
							let randValue = rand(1, 20);
							item.RandValue7 = 190 + i * randValue;
							item.RandValue8 = 190 + i * randValue;
							item.RandValue9 = 190 + i * randValue;
							item.RandValue10 = 190 + i * randValue;
						}

						item.Selected = !!item.Selected; // fixed issue that can't filter by uncheck, cause its value is undefined.
						item.RandBarValue1 = rand(0, 100);
						item.RandBarValue2 = rand(0, 100);
						item.RandBarValue3 = rand(0, 100);

						i++;
					});

					if($scope.dataItem.seriesIdOrder){
						let serisesIdOrder = $scope.dataItem.seriesIdOrder.split(',');
						_.forEach($scope.seriesDataList, function (item){
							item.Order = serisesIdOrder.indexOf(item.Id + '') >= 0 ? serisesIdOrder.indexOf(item.Id + '') : 1000;
						});

						$scope.seriesDataList = _.orderBy($scope.seriesDataList, ['Order']);
					}

					platformGridAPI.grids.invalidate(seriesGridId);
					platformGridAPI.items.data(seriesGridId, $scope.seriesDataList);
					platformGridAPI.grids.refresh(seriesGridId);

					loadChartData();
				}else{
					$timeout(function () {
						platformGridAPI.grids.invalidate(seriesGridId);
						platformGridAPI.items.data(seriesGridId, $scope.seriesDataList);
						platformGridAPI.grids.refresh(seriesGridId);
					}, 200);
				}
			}

			$scope._seed = Date.now();
			function rand(min, max){
				let seed = $scope._seed;
				min = !min ? 0 : min;
				max = !max ? 1 : max;
				$scope._seed = (seed * 9301 + 49297) % 233280;
				return (min + ($scope._seed / 233280) * (max - min)).toFixed(0) - 0;
			}
			// endregion

			// region category data
			$scope.categories = $scope.options.value.categories;

			function findCategory(id){
				let res =  _.find($scope.categories, {Id: id});
				return res || $scope.categories[1];
			}

			function isDateCategory(id){
				return findCategory(id).IsDate;
			}

			let categoryGridID = '671B025B4B87453790B8CA52D28F9296';
			let categoryGridColumn = [
				{ id: 'checked', field: 'Selected', name: 'Selected', width: 60, toolTip: 'Select', formatter: 'boolean',  name$tr$: 'basics.common.checkbox.select',
					validator: 'isCategoryValueChange'},
				{ id: 'description', field: 'Description', name: 'Description', width: 180, toolTip: 'Description', formatter: 'description', name$tr$: 'cloud.common.entityDescription'}
			];
			$scope.isCategoryValueChange = function isCategoryValueChange(entity, value) {
				$scope.dataItem.CategoryKey = value ? entity.Id : 0;
				if($scope.dataItem.CategoryKey){
					_.forEach($scope.categories, function (item){
						if(item.Id !== entity.Id) {
							item.Selected = false;
							$scope.dataItem.CategoryKey = $scope.dataItem.CategoryKey || item.Id;
						}
					});
				}else{
					_.forEach($scope.categories, function (item){
						if(item.Id !== entity.Id && !$scope.dataItem.CategoryKey) {
							item.Selected = !value;
							$scope.dataItem.CategoryKey = $scope.dataItem.CategoryKey || item.Id;
						}
					});
				}
				loadCategoryGrid();
				loadChartData();
				$scope.$apply();
				return {apply: true, valid: true, error: ''};
			};

			$scope.categoryData = {
				state: categoryGridID
			};

			function setupCategoryGrid(){
				if(!platformGridAPI.grids.exist(categoryGridID)){
					_.forEach(categoryGridColumn, function (item){
						if(item.id === 'checked'){
							item.editor = $scope.isReadOnly ? null : 'boolean';
						}
					});
					let categoryGridConfig = {
						columns: angular.copy(categoryGridColumn),
						data:[],
						id: categoryGridID,
						options: {
							indicator: true,
							idProperty: 'Id'
						}
					};

					platformGridAPI.grids.config(categoryGridConfig);
					platformTranslateService.translateGridConfig(categoryGridConfig.columns);
					loadCategoryGrid();
				}
			}

			function loadCategoryGrid(){
				$timeout(function () {
					platformGridAPI.grids.invalidate(categoryGridID);
					platformGridAPI.items.data(categoryGridID, $scope.categories);
					platformGridAPI.grids.refresh(categoryGridID);
				}, 200);
			}

			// endregion

			// region color grid loading
			let colorGrid = '379eb4121051486eba1495ff6214ecb1';
			let colorGridColumns = [
				{ id: 'code', field: 'Code', name: 'Code', width: 80, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.code'},
				{ id: 'description', field: 'Description', name: 'Description', width: 180, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
				{ id: 'color', field: 'Color', name: 'Color', width: 60, toolTip: 'Color', formatter: function (row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
					if (platformRuntimeDataService.isHideContent(dataContext, columnDef.field)) {
						return '';
					}

					value = value || dataContext[columnDef.field] || 0;

					if (value !== null) {
						value = _.padStart(value.toString(16), 7, '#000000');
						let showHashCode = _.get(columnDef, 'formatterOptions.showHashCode', false);

						if (!plainText) {
							value = '<button type="button" class="btn btn-default btn-colorpicker" style="background-color:' + value + '; width:80%"></button>' + (showHashCode ? '<label class="color-picker">' + value.toString().toUpperCase() + '</label>' : '');
						}
					}

					return value || '';
				},
				name$tr$: 'basics.common.chartConfig.color',
				editor: 'color',
				editorOptions: {
					showClearButton: true
				}, validator: 'isColorValueChange'
				},
			];

			$scope.isColorValueChange = function (entity, value){
				entity.Color = value;
				loadChartData();
			};

			$scope.colorData = {state: colorGrid};

			$scope.colorDataList = [];

			function setupColorGrid(){
				if(!platformGridAPI.grids.exist(colorGrid)){

					_.forEach(colorGridColumns, function (item){
						if(item.id === 'color'){
							item.editor = $scope.isReadOnly ? null : 'color';
						}
					});

					let colorGridConfig = {
						columns: angular.copy(colorGridColumns),
						data:[],
						id: colorGrid,
						options: {
							indicator: true,
							idProperty: 'Id'
						}
					};

					platformGridAPI.grids.config(colorGridConfig);
					platformTranslateService.translateGridConfig(colorGridConfig.columns);
					loadColorGrid();
				}
			}

			function reloadColorData(){
				$scope.colorDataList = _.filter($scope.seriesDataList, {Selected: true});
				if($scope.colorDataList && $scope.colorDataList.length > 1){
					$scope.colorDataList = _.orderBy($scope.colorDataList, ['Code']);
				}
			}

			function loadColorGrid(){
				reloadColorData();
				if($scope.colorDataList && $scope.colorDataList.length > 0){
					_.forEach($scope.colorDataList, function (item, idx){
						item.Color = item.Color || chartConfigService.rgbToDecimal($scope.legendColors[idx]) || 0;
					});
				}
				$timeout(function () {
					platformGridAPI.grids.invalidate(colorGrid);
					platformGridAPI.items.data(colorGrid, $scope.colorDataList);
					platformGridAPI.grids.refresh(colorGrid);
				}, 200);
			}

			// endregion

			$scope.alignitems = chartConfigService.getAlignItems();

			$scope.chartTypes = chartConfigService.getChartTypes();

			$scope.isBarChart = function () {
				return chartConfigService.isBarChart($scope.dataItem.ChartTypeId);
			};

			$scope.isLineChart = function () {
				return chartConfigService.isLineChart($scope.dataItem.ChartTypeId);
			};
			function findChartType(id){

				if($scope.dataItem.Is3DView){ return {id:3, code: '3D_Columns'};}

				let res = _.find($scope.chartTypes, {id: id});
				return res || $scope.chartTypes[1];
			}

			// region generate chart data structure
			$scope.chartDataSource = {
				labels: [],
				datasets: []
			};

			function loadChartData(ignoreRefreshChart){
				reloadColorData();
				$scope.chartType = findChartType($scope.dataItem.ChartTypeId).code;
				let newLegends = [];
				let newDataSets = [];
				let labelNum = $scope.isBarChart() ? 2 : 10;
				let newLabels = [];
				for(let i=0; i<labelNum; i++){
					let date = new Date();
					newLabels.push(isDateCategory($scope.dataItem.CategoryKey) ? date.getUTCFullYear() + '-' + (i<9 ? '0' : '') + (i +1) : 'Category ' + (i + 1));
				}

				$scope.legendColors = [];
				_.forEach($scope.colorDataList, function (item){
					newLegends.push({name: item.Description.Translated});
					$scope.legendColors.push(item.Color ? chartConfigService.parseDecToRgb(_.padStart(item.Color.toString(16), 7, '#000000')) : null);
				});

				_.forEach($scope.colorDataList, function (item){
					let newDataSet = [];
					for(let i=0; i<labelNum; i++) {
						newDataSet.push($scope.isBarChart() ? item['RandBarValue' + (i + 1)] : item['RandValue' + (i + 1)]);
					}
					newDataSets.push({data: newDataSet});
				});
				if(newDataSets.length > 0){
					let lastDataSet = newDataSets[newDataSets.length - 1];
					lastDataSet.data[0] = 0;
				}

				generateOption();

				if(ignoreRefreshChart){return;}

				if($scope.dataItem.ReverseOrder){
					newLegends = newLegends.reverse();
					newDataSets = newDataSets.reverse();
					$scope.legendColors = $scope.legendColors.reverse();
				}

				$scope.chartDataSource = {
					legends: newLegends,
					labels: newLabels,
					datasets: newDataSets
				};
			}

			function generateOption(){
				$scope.chartOption = chartConfigService.getChartOption($scope);

				$scope.plugins = chartConfigService.getPlugins($scope);

			}
			// endregion

			function getButtonById(id) {
				return $scope.dialog.getButtonById(id);
			}

			let okButton = getButtonById('ok');
			okButton.fn = function () {
				let obj = {};
				obj.header = $scope.options.value.header;
				obj.header.BasChartTypeFk = $scope.dataItem.ChartTypeId;
				$scope.dataItem.seriesIdOrder = _.map($scope.seriesDataList, 'Id').join(',');
				obj.header.ChartOptionConfig = JSON.stringify($scope.dataItem);
				obj.categories = [_.find($scope.categories, {Selected: true})];
				obj.series = $scope.colorDataList;

				// mapping color
				if(obj.series.length > 0){
					let codes = _.map(obj.series, 'Code').sort();
					_.forEach(obj.series, function (item){
						if(!item.Color && $scope.legendColors[codes.indexOf(item.Code)]){
							item.Color = chartConfigService.rgbToDecimal($scope.legendColors[codes.indexOf(item.Code)]);
						}
						item.ChartDataConfig = '{color: ' + item.Color +'}';
					});
				}

				$scope.$close({ok: true, data: obj});
			};

			okButton.disabled = function () {
				return !!($scope.dataItem && $scope.dataItem.__rt$data && $scope.dataItem.__rt$data.errors && _.size($scope.dataItem.__rt$data.errors) > 0) || $scope.isReadOnly;
			};

			let cancelButton = getButtonById('cancel');
			cancelButton.fn = function () {
				$scope.$close({});
			};

			function initController(){
				$scope.selectedItem = $scope.displayedItems[0];

				let chartConfig = $scope.options.value;
				if(chartConfig){
					if(chartConfig.header){
						let opt = chartConfig.header.ChartOptionConfig;
						if(opt){
							$scope.dataItem = $scope.$eval(opt);
						}
						if(!opt || opt.indexOf('FilterBySelectStructure') < 0){
							// if no DrillDownForData config, then set it to true for line Chart
							$scope.dataItem.FilterBySelectStructure = chartConfig.header.BasChartTypeFk === 2;
						}
						$scope.dataItem.ChartTypeId = chartConfig.header.BasChartTypeFk;
						if(chartConfig.header.BasChartTypeFk === 1){
							$scope.dataItem.DrillDownForData = false;
							$scope.dataItem.ReverseOrder = false;
						}
					}
				}
				$scope.isReadOnly = chartConfig.readonly;
				setupSeriesGrid();
			}
			initController();

			platformGridAPI.events.register(seriesGridId, 'onHeaderCheckboxChanged', checkAll);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist(seriesGridId)){
					platformGridAPI.grids.unregister(seriesGridId);
				}
				if (platformGridAPI.grids.exist(categoryGridID)){
					platformGridAPI.grids.unregister(categoryGridID);
				}
				if (platformGridAPI.grids.exist(colorGrid)){
					platformGridAPI.grids.unregister(colorGrid);
				}

				platformGridAPI.events.unregister(seriesGridId, 'onHeaderCheckboxChanged', checkAll);

				chartConfigService.onFormConfigClose.fire();
			});
		}
	]);

})();