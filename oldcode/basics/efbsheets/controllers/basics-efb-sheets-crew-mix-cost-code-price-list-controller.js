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
	 * @name basicsEfbsheetsCrewMixCostCodePriceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Efb Sheets CrewMix Costcode PriceList entities.
	 **/

	angModule.controller('basicsEfbsheetsCrewMixCostCodePriceListController',
		['_','$scope','$injector','$translate', 'platformToolbarService','platformGridControllerService', 'basicsEfbsheetsCrewMixCostCodePriceListUIStandardService', 'basicsEfbsheetsCrewMixCostCodePriceListService',
			function (_,$scope,$injector,$translate, platformToolbarService,platformGridControllerService, basicsEfbsheetsCrewMixCostCodePriceListUIStandardService, basicsEfbsheetsCrewMixCostCodePriceListService) {

				let guid = 'd256a1e7881142dea135dde54081ff5a';
				let myGridConfig = {
					initCalled: false
				};

				let tools = {
					id: 'updatecrewmixtocostcodepricelist',
					caption: $translate.instant('basics.efbsheets.updateCostCodePriceList'),
					type: 'item',
					iconClass: 'tlb-icons ico-price-update',
					fn: function () {
						basicsEfbsheetsCrewMixCostCodePriceListService.updateCostCodesPriceList();
					},
					disabled: function () {
						return !basicsEfbsheetsCrewMixCostCodePriceListService.isEnableTools();
					}
				};

				platformGridControllerService.initListController($scope, basicsEfbsheetsCrewMixCostCodePriceListUIStandardService, basicsEfbsheetsCrewMixCostCodePriceListService, null, myGridConfig);

				platformToolbarService.removeTools(guid);

				let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'create';
				});
				$scope.tools.items.splice(createBtnIdx, 1);

				let deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'delete';
				});
				$scope.tools.items.splice(deleteBtnIdx, 1);

				$scope.tools.items.splice(9, 0, tools);

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: $scope.tools.items
				});
			}
		]);
})(angular);

