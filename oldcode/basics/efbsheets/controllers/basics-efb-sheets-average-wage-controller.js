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
     * @name basicsEfbsheetsAverageWageController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets AverageWage entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsAverageWageController',
		['$scope', 'platformGridControllerService', 'basicsEfbsheetsAverageWageUIStandardService', 'basicsEfbsheetsAverageWageService','basicsEfbsheetsAverageWageValidationService','basicsEfbsheetsAverageWageDetailService',
			function ($scope, platformGridControllerService, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsAverageWageService,basicsEfbsheetsAverageWageValidationService,basicsEfbsheetsAverageWageDetailService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetsAverageWageDetailService.fieldChangeForMaster(arg.item, field, column);
					},
					type: 'estAverageWagesList'
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsAverageWageService, basicsEfbsheetsAverageWageValidationService, myGridConfig);
			}
		]);
})(angular);

