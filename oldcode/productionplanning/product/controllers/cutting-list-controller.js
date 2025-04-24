/**
 * Created by zwz on 7/25/2022.
 */
(function () {

	'use strict';
	const moduleName = 'productionplanning.product';
	const angModule = angular.module(moduleName);

	angModule.controller('productionplanningProductCuttingProductListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'platformGridAPI',
		'productionplanningProductCuttingProductDataService',
		'productionplanningProductCuttingProductUIStandardService'];
	function ListController($scope, platformGridControllerService,
		platformGridAPI,
		dataServ,
		uiStandardServ) {

		let gridConfig = { initCalled: false, columns: [] };
		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, null, gridConfig);

	}
})();