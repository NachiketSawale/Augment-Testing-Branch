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
     * @name basicsEfbsheetsCrewMixAfController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets CrewMix AF entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsCrewMixAfController',
		['$scope', 'platformGridControllerService', 'basicsEfbsheetsCrewMixAfService', 'basicsEfbsheetsCrewMixAfUIStandardService','basicsEfbsheetsAfValidationService','basicsEfbsheetCrewmixAfDetailService',
			function ($scope, platformGridControllerService, basicsEfbsheetsCrewMixAfService, basicsEfbsheetsCrewMixAfUIStandardService,basicsEfbsheetsAfValidationService,basicsEfbsheetCrewmixAfDetailService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetCrewmixAfDetailService.fieldChangeForMaster(arg.item, field, column);
					},
					type: 'estCrewmixAfsList'
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetsCrewMixAfService, basicsEfbsheetsAfValidationService, myGridConfig);
			}
		]);
})(angular);

