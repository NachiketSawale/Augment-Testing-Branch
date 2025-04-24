/**
 * Created by baf on 2016-05-04.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardStepListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of generic wizard step entities.
	 **/
	angModule.controller('basicsConfigGenericWizardStepListController', BasicsConfigGenericWizardStepListController);

	BasicsConfigGenericWizardStepListController.$inject = ['$scope', 'platformGridControllerService', 'basicsConfigGenWizardStepDataService', 'basicsConfigGenericWizardStepLayoutService', 'basicsConfigGenWizardValidationService'];


	function BasicsConfigGenericWizardStepListController($scope, platformGridControllerService, basicsConfigGenWizardStepDataService, basicsConfigGenericWizardStepLayoutService, basicsConfigGenWizardValidationService) {

		var myGridConfig = { initCalled: false, columns: [] };

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardStepLayoutService, basicsConfigGenWizardStepDataService, basicsConfigGenWizardValidationService, myGridConfig);
	}
})();