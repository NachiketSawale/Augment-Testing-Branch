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
     * @name basicsEfbsheetsProjectCrewMixCostCodeController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets Project CrewMix 2 Costcode entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsProjectCrewMixCostCodeController',
		['$scope', '$translate','platformGridControllerService', 'basicsEfbsheetsProjectCrewMixCostCodeUIStandardService', 'basicsEfbsheetsProjectCrewMixCostCodeService',
			'basicsEfbsheetCrewMixCostCodeDetailService',
			function ($scope, $translate,platformGridControllerService, basicsEfbsheetsProjectCrewMixCostCodeUIStandardService, basicsEfbsheetsProjectCrewMixCostCodeService,
				basicsEfbsheetCrewMixCostCodeDetailService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetCrewMixCostCodeDetailService.fieldChangeForProject(arg.item, field, column);
					},
					type: 'prjCrewMix2CostCodesList'
				};

				let tools = [
					{
						id: 'updatecrewmixtocostcode',
						caption: $translate.instant('basics.efbsheets.updateCostCode'),
						type: 'item',
						iconClass: 'tlb-icons ico-price-update',
						fn: function () {
							basicsEfbsheetsProjectCrewMixCostCodeService.updateCostCodes();
						},
						disabled: function () {
							return !basicsEfbsheetsProjectCrewMixCostCodeService.isEnableTools();
						}
					}
				];

				$scope.gridId = '5fbf701267ea4e20b4723a7d46dbee24';
				platformGridControllerService.initListController($scope, basicsEfbsheetsProjectCrewMixCostCodeUIStandardService, basicsEfbsheetsProjectCrewMixCostCodeService, null, myGridConfig);

				$scope.addTools(tools);
			}
		]);
})(angular);

