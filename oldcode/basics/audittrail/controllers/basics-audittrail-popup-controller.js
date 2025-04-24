/**
 * Created by uestuenel
 * Controller for the Grid on the left side
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
	angular.module(moduleName).controller('basicsAuditTrailPopupController',
		['$scope', 'platformGridAPI', 'platformUIConfigInitService', 'platformSchemaService', 'basicsAuditTrailGridColumns',
			'basicsAuditTrailTranslationService', '$translate', 'reportingPrintService', 'basicsAudittrailHelperService', '_', 'basicsCommonGridFormatterHelper',
			function ($scope, platformGridAPI, platformUIConfigInitService, platformSchemaService, basicsAuditTrailGridColumns,
				basicsAuditTrailTranslationService, $translate, reportingPrintService, basicsAudittrailHelperService, _, basicsCommonGridFormatterHelper) {

				var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'LogEntityDto', moduleSubModule: 'Basics.AuditTrail'});
				var config = platformUIConfigInitService.provideConfigForListView(basicsAuditTrailGridColumns, domainSchema.properties, basicsAuditTrailTranslationService);

				_.find(config.columns, ['field', 'Action']).formatter = function (row, cell, value, columnDef, dataContext, plainText) {
					if (!value) {
						value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
					}

					return value.toUpperCase() === 'U' ? $translate.instant('basics.audittrail.actionModified') : $translate.instant('basics.audittrail.actionDeleted');
				};

				$scope.gridId = '212d6d2149934b10af20953b6154a438';

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
						id: 't12',
						sort: 10,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.gridId, !this.value);
							// $scope.toggleFilter(this.value);
						},
						value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
						// value: platformGridAPI.filters.showSearch($scope.gridId),
						disabled: false
					},
					{
						id: 't13',
						sort: 11,
						caption: 'cloud.common.print',
						iconClass: 'tlb-icons ico-print-preview',
						type: 'item',
						fn: function () {
							reportingPrintService.printGrid($scope.gridId);
						}
					},
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
					}
				];

				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: toolbarItems,
					update: function () {  // dummy function to bypass menulist-directive weak point in line 199!!!!
						angular.noop();
					}
				};

				function updateGrid() {
					var data = basicsAudittrailHelperService.getGridDataItems();
					platformGridAPI.items.data($scope.gridId, data);
				}

				$scope.$on('startFillGridData', function () {
					updateGrid();
				});

				$scope.$on('$destroy', function () {
					// ???
				});

			}
		]);
})();
