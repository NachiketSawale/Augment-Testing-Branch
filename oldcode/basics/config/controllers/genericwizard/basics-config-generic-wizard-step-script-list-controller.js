/**
 * Created by baf on 2016-05-04.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardStepScriptListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of generic wizard step script entities.
	 **/
	angModule.controller('basicsConfigGenericWizardStepScriptListController', BasicsConfigGenericWizardStepScriptListController);

	BasicsConfigGenericWizardStepScriptListController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigGenWizardScriptDataService', 'basicsConfigGenericWizardStepScriptLayoutService', 'basicsConfigGenWizardValidationService'];


	function BasicsConfigGenericWizardStepScriptListController($scope, platformGridControllerService, basicsConfigGenWizardStepScriptDataService, basicsConfigGenericWizardStepScriptLayoutService, basicsConfigGenWizardValidationService) {

		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardStepScriptLayoutService, basicsConfigGenWizardStepScriptDataService, basicsConfigGenWizardValidationService, myGridConfig);
	}
})();