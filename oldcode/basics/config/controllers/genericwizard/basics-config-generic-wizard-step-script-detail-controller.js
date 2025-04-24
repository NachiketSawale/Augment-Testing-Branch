/**
 * Created by baf on 2016-05-04.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardStepScriptDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of generic wizard step script entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsConfigGenericWizardStepScriptDetailController', BasicsConfigGenericWizardStepScriptDetailController);

	BasicsConfigGenericWizardStepScriptDetailController.$inject = ['$scope','platformDetailControllerService', 'basicsConfigGenWizardScriptDataService', 'basicsConfigGenWizardValidationService', 'basicsConfigGenericWizardStepScriptLayoutService', 'basicsConfigTranslationService'];

	function BasicsConfigGenericWizardStepScriptDetailController($scope, platformDetailControllerService, basicsConfigGenWizardScriptDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardStepScriptLayoutService, basicsConfigTranslationService) {
		platformDetailControllerService.initDetailController($scope, basicsConfigGenWizardScriptDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardStepScriptLayoutService, basicsConfigTranslationService);
	}
})(angular);