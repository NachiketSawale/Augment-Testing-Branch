/**
 * Created by sandu on 31.03.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name basicsConfigModuleListController
     * @function
     *
     * @description
     * Controller for the  list view of module entities.
     **/
	angModule.controller('basicsConfigListController', basicsConfigListController);

	basicsConfigListController.$inject = ['$scope', 'basicsConfigMainService', 'basicsConfigUIStandardService', 'basicsConfigValidationService', 'platformGridControllerService'];

	function basicsConfigListController($scope, basicsConfigMainService, basicsConfigUIStandardService, basicsConfigValidationService, platformGridControllerService) {

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, basicsConfigUIStandardService, basicsConfigMainService, basicsConfigValidationService, myGridConfig);
	}
})();