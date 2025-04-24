/**
 * Created by anl on 8/21/2019.
 */

(function (angular) {
	/*global Slick, _, moment*/

	'use strict';
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemEventQuantityDialogService', EventQuantityDialogService);

	EventQuantityDialogService.$inject = [
		'platformGridAPI', '$interval', '$translate',
		'platformRuntimeDataService',
		'productionplanningCommonEventUIStandardService'];

	function EventQuantityDialogService(
		platformGridAPI, $interval, $translate,
		platformRuntimeDataService,
		eventUIStandardService) {
		var service = {};
		var guid = '3a36a2b8a2c348279fb896f850dac258';

		service.init = function ($scope, events) {
			initData(events);
			$scope.isLoading = true;
			var eventGrid = {
				id: guid,
				title: 'productionplanning.item.editEventQuantityGridTitle',
				data: events,
				columns: initEventColumns(),
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: guid
			};
			platformGridAPI.grids.config(eventGrid);

			$scope.eventGrid = eventGrid;
			$scope.modalOptions = {
				headerText: $translate.instant('productionplanning.item.editEventQuantityDialogTitle'),
				cancel: close
			};

			function close() {
				return $scope.$close(true);
			}
		};

		function initData(events) {
			var datetimes = ['PlannedStart', 'PlannedFinish', 'EarliestStart', 'EarliestFinish', 'LatestStart', 'LatestFinish'];
			_.forEach(events, function (event) {
				_.forEach(event, function (value, key) {
					var found = _.find(datetimes, function(v){
						return v === key;
					});
					if (found) {
						event[key] = moment.utc(value);
					}
				});
			});
		}

		function initEventColumns() {
			var columns = angular.copy(eventUIStandardService.getStandardConfigForListView().columns);

			var quantityColumn = _.find(columns, {field: 'Quantity'});

			var newColumns = [quantityColumn];
			_.forEach(columns, function (column) {
				if (column.field !== 'Quantity') {
					column.editor = null;
					newColumns.push(column);
				}
			});

			return newColumns;
		}

		return service;
	}
})(angular);
