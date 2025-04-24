/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.efbsheets';
	let angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name basicsEfbsheetsListController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets CrewMix entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'basicsEfbsheetsUIStandardService', 'basicsEfbsheetsMainService', 'basicsEfbsheetsValidationService','basicsEfbsheetCrewmixDetailService',
			function ($scope, $injector, platformGridAPI,platformGridControllerService, basicsEfbsheetsUIStandardService, basicsEfbsheetsMainService,basicsEfbsheetsValidationService,basicsEfbsheetCrewmixDetailService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					type: 'estCrewMixesList',
					dragDropService : $injector.get('basicsCommonClipboardService'),
					cellChangeCallBack: function (arg) {
						let column = arg.grid.getColumns()[arg.cell];
						let field = arg.grid.getColumns()[arg.cell].field;
						basicsEfbsheetCrewmixDetailService.fieldChange(arg.item, field, column);
					},
					rowChangeCallBack: function rowChangeCallBack() {
					}
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsUIStandardService, basicsEfbsheetsMainService, basicsEfbsheetsValidationService, myGridConfig);

				function onSelectedRowsChanged(e, args){
					let selectedLineItems = args.rows.map(function (row) {
						return args.grid.getDataItem(row);
					});
					basicsEfbsheetsMainService.setSelectedEntities(selectedLineItems || []);
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				});

			}
		]);
})(angular);

