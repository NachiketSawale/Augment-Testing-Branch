/**
 * Created by baf on 2016-05-04.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardInstanceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of generic wizard instance entities.
	 **/
	angModule.controller('basicsConfigGenericWizardInstanceListController', BasicsConfigGenericWizardInstanceListController);

	BasicsConfigGenericWizardInstanceListController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigGenWizardInstanceDataService', 'basicsConfigGenericWizardInstanceLayoutService', 'basicsConfigGenWizardValidationService'];


	function BasicsConfigGenericWizardInstanceListController($scope, platformGridControllerService, basicsConfigGenWizardInstanceDataService, basicsConfigGenericWizardInstanceLayoutService, basicsConfigGenWizardValidationService) {

		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardInstanceLayoutService, basicsConfigGenWizardInstanceDataService, basicsConfigGenWizardValidationService, myGridConfig);
	}
})();