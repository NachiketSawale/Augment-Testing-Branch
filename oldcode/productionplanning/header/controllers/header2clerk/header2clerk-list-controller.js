/**
 * Created by zwz on 10/10/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningHeader2ClerkListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningHeader2ClerkDataService',
		'productionplanningHeader2ClerkUIStandardService',
		'productionplanningHeader2ClerkValidationService'];
	function ListController($scope, platformGridControllerService,
							dataServ,
							uiStandardServ,
							validationServ) {

		var gridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);
	}
})();