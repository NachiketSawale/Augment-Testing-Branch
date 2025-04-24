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
	 * @name basicsEfbsheetsProjectAverageWageController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Efb Sheets Project AverageWage entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsProjectAverageWageController',
		['$scope', 'platformGridControllerService', 'basicsEfbsheetsAverageWageUIStandardService', 'basicsEfbsheetsProjectAverageWageService', 'basicsEfbsheetsAverageWageDetailService', 'basicsEfbsheetsAverageWageValidationService',
			function ($scope, platformGridControllerService, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsProjectAverageWageService, basicsEfbsheetsAverageWageDetailService, basicsEfbsheetsAverageWageValidationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetsAverageWageDetailService.fieldChangeForProject(arg.item, field, column);
					},
					type: 'estAverageWagesList'
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsProjectAverageWageService, basicsEfbsheetsAverageWageValidationService, myGridConfig);
			}
		]);
})(angular);

