/**
 * Created by zwz on 9/29/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	angModule.controller('productionplanningHeaderDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformDetailControllerService',
		'productionplanningHeaderDataService',
		'productionplanningHeaderUIStandardService',
		'productionplanningHeaderValidationService'];
	function DetailController($scope, platformDetailControllerService,
							  dataServ,
							  uiStandardServ,
							  validationServ) {

		platformDetailControllerService.initDetailController($scope, dataServ, validationServ, uiStandardServ, 'productionplanningHeaderTranslationService');
	}
})();