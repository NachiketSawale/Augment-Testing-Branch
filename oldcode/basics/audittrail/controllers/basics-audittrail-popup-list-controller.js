/**
 * Created by reimer on 23.03.2016.
 */

/*
		uestuenel: wird momentan nicht gebraucht!!!
 */

(function () {

	'use strict';

	var moduleName = 'basics.audittrail';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 * Controller for generic dependent data grid
	 **/
	angular.module(moduleName).controller('basicsAuditTrailPopupListController',
		['$scope',
			'basicsAuditTrailPopupService',
			'platformGridAPI',
			'platformUIConfigInitService',
			'platformSchemaService',
			'basicsAuditTrailGridColumns',
			'basicsAuditTrailTranslationService',
			'$translate',
			'$timeout',
			function ($scope,
				basicsAuditTrailPopupService,
				platformGridAPI,
				platformUIConfigInitService,
				platformSchemaService,
				basicsAuditTrailGridColumns,
				basicsAuditTrailTranslationService,
				$translate,
				$timeout) {

				var _pendingRequest = null;

				var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'LogEntityDto', moduleSubModule: 'Basics.AuditTrail'});
				var config = platformUIConfigInitService.provideConfigForListView(basicsAuditTrailGridColumns, domainSchema.properties, basicsAuditTrailTranslationService);

				$scope.gridId = '212d6d2149934b10af20953b6154a438';   				// grid's id

				$scope.gridData = {
					state: $scope.gridId
				};

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						data: [],
						columns: angular.copy(config.columns),
						id: $scope.gridId,
						options: {
							tree: false,
							indicator: true,
							iconClass: '',
							// idProperty: 'ID'
							enableDraggableGroupBy: true
						},
						lazyInit: true,
						enableConfigSave: true
					};
					platformGridAPI.grids.config(grid);
				}

				var toolbarItems = [
					{
						id: 't4',
						caption: 'cloud.common.toolbarSearch',
						type: 'item',
						iconClass: 'tlb-icons ico-search', // ico-search',
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, true);
						}
					},
					{
						id: 't5',
						caption: 'cloud.common.toolbarDeleteSearch',
						type: 'item',
						iconClass: 'tlb-icons ico-search-delete',
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, false);
						}
					},
					{
						id: 't15',
						caption: 'cloud.common.gridlayout',
						type: 'item',
						iconClass: 'tlb-icons ico-settings',
						fn: function () {
							platformGridAPI.configuration.openConfigDialog($scope.gridId);
						}
					},
					{
						id: 't12',
						sort: 10,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.gridId, !this.value);
						},
						value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
						disabled: false
					}
				];

				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolbarItems,
					version: 1,
					update: function () {  // dummy function to bypass menulist-directive weak point in line 199!!!!
						angular.noop();
					}
				};

				var init = function () {

					var options = basicsAuditTrailPopupService.getOptions();
					_pendingRequest = basicsAuditTrailPopupService.loadData(options);

					_pendingRequest.promise.then(
						function (data) {

							platformGridAPI.items.data($scope.gridId, data);
							// default sort
							// platformGridAPI.items.sort( $scope.gridId, 'UpdatedAt', 'sort-desc'); --> done on server-side

							if (!data || data === null || data.length === 0) {
								$scope.error = {
									show: true,
									messageCol: 1,
									message: $translate.instant('cloud.common.Info_QueryReturnsNoRecords'),
									type: 2
								};
							}

							// load user column config
							$timeout(function () {
								platformGridAPI.configuration.refresh($scope.gridId);
							}, 60, false);

						},
						function (reason) {
							console.log('load audit trail canceled - reason: ' + reason.config.timeout.$$state.value);
						}).finally(function () {
						_pendingRequest = null;
					});

				};
				init();

				$scope.$on('$destroy', function () {

					if (_pendingRequest !== null) {
						_pendingRequest.cancel('Controller was destroyed!');
						_pendingRequest = null;
					}

				});

			}
		]);
})();
