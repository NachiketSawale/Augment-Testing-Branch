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
     * @name basicsEfbsheetsProjectListController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets Project CrewMix entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsProjectListController',
		['$scope','$translate','platformGridAPI', 'platformGridControllerService', 'basicsEfbsheetsUIStandardService', 'basicsEfbsheetsProjectMainService',
			'basicsEfbsheetsValidationService','basicsEfbsheetCrewmixDetailService',
			function ($scope,$translate, platformGridAPI,platformGridControllerService, basicsEfbsheetsUIStandardService,
				basicsEfbsheetsProjectMainService,basicsEfbsheetsValidationService,basicsEfbsheetCrewmixDetailService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					type: 'estCrewMixesList',
					cellChangeCallBack: function (arg) {
						let column = arg.grid.getColumns()[arg.cell];
						let field = arg.grid.getColumns()[arg.cell].field;
						basicsEfbsheetCrewmixDetailService.fieldChange(arg.item, field, column);
					},
					rowChangeCallBack: function rowChangeCallBack() {
					}
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsUIStandardService, basicsEfbsheetsProjectMainService, basicsEfbsheetsValidationService, myGridConfig);

				function onSelectedRowsChanged(e, args){
					let selectedLineItems = args.rows.map(function (row) {
						return args.grid.getDataItem(row);
					});
					basicsEfbsheetsProjectMainService.setSelectedEntities(selectedLineItems || []);
				}

				let tools = [
					{
						id: 'copymastercrewmix',
						caption: $translate.instant('basics.efbsheets.copyMasterCrewMix'),
						type: 'item',
						iconClass: 'tlb-icons ico-copy-line-item',
						fn: function () {
							basicsEfbsheetsProjectMainService.copyMasterCrewMix();
						},
						disabled: function () {
							return !basicsEfbsheetsProjectMainService.isEnableTools();
						}
					}
				];

				$scope.addTools(tools);

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				});

			}
		]);
})(angular);

