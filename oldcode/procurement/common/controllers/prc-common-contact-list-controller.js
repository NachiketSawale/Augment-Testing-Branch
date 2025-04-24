/**
 * Created by lja on 07/15/2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name procurementCommonContactController
	 * @require $scope
	 * @description controller for contact
	 */
	angular.module('procurement.common').controller('procurementCommonContactController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonContactDataService',
			'procurementCommonContactValidationService', 'procurementCommonContactUIStandardService',
			'procurementCommonHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, moduleContext, gridControllerService, dataServiceFactory, validationService,
				gridColumns, procurementCommonHelperService) {

				var dataService = dataServiceFactory.getService(moduleContext.getMainService());

				validationService = validationService(dataService);

				var gridConfig = {
					initCalled: true,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var entity = arg.item;
						var field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						if (_.isFunction(dataService.cellChange)) {
							dataService.cellChange(entity, field);
						}
					}
				};

				// add grouping setting
				angular.forEach(gridColumns, function (column) {
					angular.extend(column, {
						grouping: {
							title: column.name$tr$,
							getter: column.field,
							aggregators: [],
							aggregateCollapsed: true
						}
					});
				});

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
				});

			}
		]);
})(angular);