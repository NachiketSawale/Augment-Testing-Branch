/**
 * Created by baf on 2016-05-04.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardContainerPropertyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of generic wizard step entities.
	 **/
	angModule.controller('basicsConfigGenericWizardContainerPropertyListController', BasicsConfigGenericWizardContainerPropertyListController);

	BasicsConfigGenericWizardContainerPropertyListController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigGenWizardContainerPropertyDataService', 'basicsConfigGenericWizardContainerPropertyLayoutService', 'basicsConfigGenWizardValidationService'];


	function BasicsConfigGenericWizardContainerPropertyListController($scope, platformGridControllerService, basicsConfigGenWizardContainerPropertyDataService, basicsConfigGenericWizardContainerPropertyLayoutService, basicsConfigGenWizardValidationService) {

		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardContainerPropertyLayoutService, basicsConfigGenWizardContainerPropertyDataService, basicsConfigGenWizardValidationService, myGridConfig);
	}
})();