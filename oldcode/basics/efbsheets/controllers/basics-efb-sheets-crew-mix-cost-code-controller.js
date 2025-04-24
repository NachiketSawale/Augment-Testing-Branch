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
     * @name basicsEfbsheetsCrewMixCostCodeController
     * @function
     *
     * @description
     * Controller for the  list view of Efb Sheets CrewMix 2 Costcode entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsEfbsheetsCrewMixCostCodeController',
		['$scope','$injector','$translate','$timeout', 'platformGridControllerService', 'basicsEfbsheetsCrewMixCostCodeUIStandardService', 'basicsEfbsheetsCrewMixCostCodeService','basicsEfbsheetCrewMixCostCodeDetailService',
			function ($scope,$injector,$translate,$timeout, platformGridControllerService, basicsEfbsheetsCrewMixCostCodeUIStandardService, basicsEfbsheetsCrewMixCostCodeService,basicsEfbsheetCrewMixCostCodeDetailService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
						basicsEfbsheetCrewMixCostCodeDetailService.fieldChangeForMaster(arg.item, field, column);
					},
					type: 'estCrewMix2CostCodesList'
				};

				let tools = [
					{
						id: 'updatecrewmixtocostcode',
						caption: $translate.instant('basics.efbsheets.updateCostCode'),
						type: 'item',
						iconClass: 'tlb-icons ico-price-update',
						fn: function () {
							basicsEfbsheetsCrewMixCostCodeService.updateCostCodes();
						},
						disabled: function () {
							return !basicsEfbsheetsCrewMixCostCodeService.isEnableTools();
						}
					}
				];

				platformGridControllerService.initListController($scope, basicsEfbsheetsCrewMixCostCodeUIStandardService, basicsEfbsheetsCrewMixCostCodeService, null, myGridConfig);

				$scope.addTools(tools);

				$injector.get('estimateMainLookupService').getEstCostCodesTreeForAssemblies().then( function(response) {
					var list =[];
					$injector.get('cloudCommonGridService').flatten(response, list, 'CostCodes');
					$injector.get('basicsLookupdataLookupDescriptorService').updateData('estcostcodeslist', list);
				});
			}
		]);
})(angular);

