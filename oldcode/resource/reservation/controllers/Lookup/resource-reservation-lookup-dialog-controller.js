/**
 * Created by leo on 13.04.2015.
 */
(function () {

	'use strict';

	var moduleName = 'resource.reservation';
	/**
	 * @ngdoc controller
	 * @name resourceReservationLookupController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('resourceReservationLookupController',
		['$scope', 'resourceReservationLookupDataService',
			'platformGridAPI', 'platformTranslateService', 'basicsLookupdataConfigGenerator', 'Slick', '_',
			function ($scope, resourceReservationLookupDataService,
				platformGridAPI, platformTranslateService, basicsLookupdataConfigGenerator, Slick, _) {

				$scope.gridTriggersSelectionChange = false;

				// grid's id === container's uuid
				$scope.gridId = '57f527281d3d4547892cd73c3acc11b7';

				$scope.gridData = {
					state: $scope.gridId
				};

				var settings = {
					columns: [
						{
							id: 'description',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'description',
							readonly: true,
							width: 270
						},
						{
							id: 'resource',
							field: 'ResourceFk',
							name: 'Resource',
							name$tr$: 'resource.master.entityResource',
							readonly: true,
							formatter: 'lookup',
							formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceResourceLookupDataService',
								cacheEnable: true,
								additionalColumns: false
							}).grid.formatterOptions
						},
						{
							id: 'requisition',
							field: 'RequisitionFk',
							name: 'Requisition',
							name$tr$: 'resource.requisition.entityRequisition',
							readonly: true,
							formatter: 'lookup',
							formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceRequisitionLookupDataService',
								cacheEnable: true,
								additionalColumns: false
							}).grid.formatterOptions
						},
						{
							id: 'reservedFrom',
							field: 'ReservedFrom',
							name: 'Reserved From',
							name$tr$: 'resource.reservation.entityReservedFrom',
							formatter: 'dateutc',
							readonly: true
						},
						{
							id: 'reservedTo',
							field: 'ReservedTo',
							name: 'Reserved To',
							name$tr$: 'resource.reservation.entityReservedTo',
							formatter: 'dateutc',
							readonly: true
						}
					]
				};
				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(settings.columns),
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: '',
							editorLock: new Slick.EditorLock()
						}
					};
					platformGridAPI.grids.config(grid);
				}

				function onSelectedRowsChanged() {

					var selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});

					$scope.gridTriggersSelectionChange = true;
					resourceReservationLookupDataService.setSelected(_.isArray(selected) ? selected[0] : selected);
					$scope.gridTriggersSelectionChange = false;
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				function updateItemList(list) {

					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

					platformGridAPI.items.data($scope.gridId, list);

					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				}

				resourceReservationLookupDataService.listLoaded.register(updateItemList);

				$scope.$on('$destroy', function () {
					resourceReservationLookupDataService.listLoaded.unregister(updateItemList);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					// platformGridAPI.grids.unregister($scope.gridId);
				});

			}]);
})();
