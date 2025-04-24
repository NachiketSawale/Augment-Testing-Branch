/**
 * Created by baf on 2016-06-04.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardInstanceParameterListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of generic wizard step entities.
	 **/
	angModule.controller('basicsConfigGenericWizardInstanceParameterListController', BasicsConfigGenericWizardInstanceParameterListController);

	BasicsConfigGenericWizardInstanceParameterListController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigGenWizardInstanceParameterDataService', 'basicsConfigGenericWizardInstanceParameterLayoutService', 'basicsConfigGenWizardValidationService'];


	function BasicsConfigGenericWizardInstanceParameterListController($scope, platformGridControllerService, basicsConfigGenWizardInstanceParameterDataService, basicsConfigGenericWizardInstanceParameterLayoutService, basicsConfigGenWizardValidationService) {

		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardInstanceParameterLayoutService, basicsConfigGenWizardInstanceParameterDataService, basicsConfigGenWizardValidationService, myGridConfig);
	}
})();