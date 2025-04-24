/**
 * Created by zwz on 9/30/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningHeader2ContactListController', ListController);

	ListController.$inject = ['$scope', 'platformGridControllerService',
		'productionplanningHeader2ContactDataService',
		'productionplanningHeader2ContactUIStandardService',
		'productionplanningHeader2ContactValidationService'];
	function ListController($scope, platformGridControllerService,
							dataServ,
							uiStandardServ,
							validationServ) {

		var gridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);
	}
})();