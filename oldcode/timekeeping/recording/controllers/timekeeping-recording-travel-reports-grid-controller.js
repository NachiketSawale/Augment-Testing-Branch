(function (angular) {
	'use strict';

	let moduleName = 'timekeeping.recording';

	/**
	 @ngdoc controller
	 * @name timekeepingRecordingTravelReportsGridController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('timekeepingRecordingTravelReportsGridController',
		['$scope', '$timeout', 'platformGridAPI', 'platformCreateUuid', 'timekeepingRecordingReportClockingService', 'basicsLookupdataConfigGenerator', 'ServiceDataProcessDatesExtension',
			function ($scope, $timeout, platformGridAPI, platformCreateUuid, timekeepingRecordingReportClockingService, basicsLookupdataConfigGenerator, ServiceDataProcessDatesExtension){
				let formatForTimesymbol = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingTimeSymbol2GroupLookupDataService',
					filter: function (entity) {
						return entity;
					}}).grid.formatterOptions;
				let formatForUoM = {
					lookupType: 'uom',
					displayMember: 'Unit'
				}
				let gridColumns =[
					{id: 'DueDate', field: 'DueDate', name: 'DueDate', width: 100, formatter: 'dateutc', name$tr$: 'timekeeping.recording.bookingDate'},
					{id: 'Duration', field: 'Duration', name: 'Duration', width: 100, formatter: 'decimal', editor: 'decimal', name$tr$: 'timekeeping.common.duration'},
					{id: 'Timesymbol', field: 'TimeSymbolFk', name: 'TimeSymbol', width: 100, formatter: 'lookup', formatterOptions: formatForTimesymbol, name$tr$: 'timekeeping.timesymbols.entityTimeSymbol'},
					{id: 'Uom', field: 'TimeSymbol.UoMFk', name: 'UoM', width: 50, formatter: 'lookup', formatterOptions: formatForUoM, name$tr$: 'cloud.common.entityUoM'}
				]
				$scope.gridId = platformCreateUuid();
				let items = timekeepingRecordingReportClockingService.getDrivingHomeReports();
				_.forEach(items, function(item) {
					item['DueDate'] = moment.utc(item['DueDate']);
				});
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					let gridConfig = {
						data: items,
						columns: gridColumns,
						id: $scope.gridId,
						lazyInit: true,
						autoHeight: true,
						options: {
							tree: false, indicator: true, allowRowDrag: false,
							idProperty: 'Id'
						}
					};

					platformGridAPI.grids.config(gridConfig);
				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});
			}
		]);
})(angular);
