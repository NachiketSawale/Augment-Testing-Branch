/**
 * Created by sandu on 17.01.2019.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name basicsConfigMcTwoQnAListController
     * @function
     *
     * @description
     * Controller for the  McTwoQnA list view
     **/
	angModule.controller('basicsConfigMcTwoQnAListController', basicsConfigMcTwoQnAListController);

	basicsConfigMcTwoQnAListController.$inject = ['$scope', 'basicsConfigMcTwoQnAService', 'basicsConfigMcTwoQnAUIService', 'basicsConfigMcTwoQnAValidationService', 'platformGridControllerService'];

	function basicsConfigMcTwoQnAListController($scope, basicsConfigMcTwoQnAService, basicsConfigMcTwoQnAUIService, basicsConfigMcTwoQnAValidationService, platformGridControllerService) {

		var myGridConfig = {initCalled: false, columns: []};


		platformGridControllerService.initListController($scope, basicsConfigMcTwoQnAUIService, basicsConfigMcTwoQnAService, basicsConfigMcTwoQnAValidationService, myGridConfig);

	}
})();
