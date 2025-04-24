// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	/* global _ */
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('procurementStockHeaderGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementStockHeaderDataService', 'procurementStockUIStandardService',
			'basicsCommonHeaderColumnCheckboxControllerService',
			'platformGridAPI',
			// eslint-disable-next-line func-names
			function ($scope, $translate, gridControllerService, dataService, gridColumns,
				basicsCommonHeaderColumnCheckboxControllerService,
				platformGridAPI) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};
				var stockIdsAllCheckChangedclearTimeout = null;
				var checkAll = function checkAll(e) {
					clearTimeout(stockIdsAllCheckChangedclearTimeout);
					stockIdsAllCheckChangedclearTimeout = setTimeout(() => {
						dataService.checkAllStockItems(e.target.checked);
						stockIdsAllCheckChangedclearTimeout = null;
					}, 500);
				};
				var headerCheckBoxFields = ['IsChecked'];
				var headerCheckBoxEvents = [{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}];
				var setCellEditable = function (e, arg) {
					return arg.column.field === 'IsChecked';
				};
				var validationService = {
					validateIsChecked: dataService.isCheckedValueChange
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, headerCheckBoxFields, headerCheckBoxEvents);
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				dataService.checkHeaderCheckBox = function (list) {
					var _grid = platformGridAPI.grids.element('id', $scope.gridId).instance;
					var headers = _grid.getColumnHeaders();
					var ele = headers.find('#chkbox_' + _grid.getUID() + '_IsChecked');
					if (ele.length) {
						var data = list ? list : _grid.getData().getItems();
						var hasTrueValue = false;
						var hasFalseValue = false;
						if (data.length) {
							hasTrueValue = _.findIndex(data, _.set({}, 'IsChecked', true)) !== -1;
							hasFalseValue = _.findIndex(data, _.set({}, 'IsChecked', false)) !== -1;
						}
						ele.prop('disabled', !data.length);
						ele.prop('indeterminate', hasTrueValue && hasFalseValue);
						ele.prop('checked', hasTrueValue && !hasFalseValue);
					}
				};

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			}]
	);
})(angular);