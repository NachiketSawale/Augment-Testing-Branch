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
	 * @name basicsEfbsheetsProjectCrewMixAfController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Efb Sheets Project CrewMix AF entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsProjectCrewMixAfController',
		['$scope', 'platformGridControllerService', 'basicsEfbsheetsProjectCrewMixAfService', 'basicsEfbsheetsCrewMixAfUIStandardService', 'basicsEfbsheetCrewmixAfDetailService', 'basicsEfbsheetsAfValidationService',
			function ($scope, platformGridControllerService, basicsEfbsheetsProjectCrewMixAfService, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetCrewmixAfDetailService, basicsEfbsheetsAfValidationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetCrewmixAfDetailService.fieldChangeForProject(arg.item, field, column);
					},
					type: 'estCrewmixAfsList'
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetsProjectCrewMixAfService, basicsEfbsheetsAfValidationService, myGridConfig);
			}
		]);
})(angular);

