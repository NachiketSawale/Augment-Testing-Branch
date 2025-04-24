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
     * @name basicsEfbsheetsCrewMixAfsnController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets CrewMix AFSN entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsCrewMixAfsnController',
		['$scope', 'platformGridControllerService', 'basicsEfbsheetsCrewMixAfsnService', 'basicsEfbsheetsCrewMixAfsnUIStandardService','basicsEfbsheetsAfsnValidationService','basicsEfbsheetCrewmixAfsnDetailService',
			function ($scope, platformGridControllerService, basicsEfbsheetsCrewMixAfsnService, basicsEfbsheetsCrewMixAfsnUIStandardService,basicsEfbsheetsAfsnValidationService,basicsEfbsheetCrewmixAfsnDetailService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetCrewmixAfsnDetailService.fieldChangeForMaster(arg.item, field, column);
					},
					type: 'estCrewmixAfsnsList'
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetsCrewMixAfsnService, basicsEfbsheetsAfsnValidationService, myGridConfig);
			}
		]);
})(angular);

