/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	/**
	 * @ngdoc controller
	 * @name controllingActualsCostHeaderListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Cost Headers (Actuals).
	 **/
	angular.module(moduleName).controller('controllingActualsCostHeaderListController',
		['$scope', '$injector', '_', 'platformGridControllerService', 'controllingActualsCostHeaderListService', 'controllingActualsCostHeaderConfigurationService', 'controllingActualsTranslationService', 'controllingActualsCommonService', 'controllingActualsCostDataListService', 'controllingActualsValidationService',
			function ($scope, $injector, _, platformGridControllerService, controllingActualsCostHeaderListService, controllingActualsCostHeaderConfigurationService, controllingActualsTranslationService, controllingActualsCommonService, controllingActualsCostDataListService, controllingActualsValidationService) {

				var myGridConfig = {
					initCalled: false, columns: [],
					sortOptions: {
						initialSortColumn: {field: 'code', id: 'code'},
						isAsc: true
					},
					type : 'controlling.actuals.costheader',
					dragDropService : $injector.get('controllingCommonClipboardService'),
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let item = arg.item, col = arg.grid.getColumns()[arg.cell].field;

						if(col === 'ProjectFk'){
							controllingActualsCostDataListService.setCostHeaderPrjInfo(item.ProjectFk);
						}

						controllingActualsCommonService.onSelectionChanged(arg);
						controllingActualsCostHeaderListService.gridRefresh();
					}
				};

				platformGridControllerService.initListController($scope, controllingActualsCostHeaderConfigurationService, controllingActualsCostHeaderListService, controllingActualsValidationService, myGridConfig);
				controllingActualsCostHeaderListService.load();
			}
		]);
})(angular);
