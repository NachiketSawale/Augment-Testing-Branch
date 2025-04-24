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
	 * @name basicsEfbsheetsProjectCrewMixAfsnController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Efb Sheets project CrewMix AFSN entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsProjectCrewMixAfsnController',
		['$scope', 'platformGridControllerService', 'basicsEfbsheetsProjectCrewMixAfsnService', 'basicsEfbsheetsCrewMixAfsnUIStandardService', 'basicsEfbsheetCrewmixAfsnDetailService', 'basicsEfbsheetsAfsnValidationService',
			function ($scope, platformGridControllerService, basicsEfbsheetsProjectCrewMixAfsnService, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetCrewmixAfsnDetailService, basicsEfbsheetsAfsnValidationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetCrewmixAfsnDetailService.fieldChangeForProject(arg.item, field, column);
					},
					type: 'estCrewmixAfsnsList'
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetsProjectCrewMixAfsnService, basicsEfbsheetsAfsnValidationService, myGridConfig);
			}
		]);
})(angular);

