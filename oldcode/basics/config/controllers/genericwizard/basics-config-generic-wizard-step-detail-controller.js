/**
 * Created by baf on 2016-05-04.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardStepDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of generic wizard step entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsConfigGenericWizardStepDetailController', BasicsConfigGenericWizardStepDetailController);

	BasicsConfigGenericWizardStepDetailController.$inject = ['$scope', 'platformDetailControllerService', 'basicsConfigGenWizardStepDataService', 'basicsConfigGenWizardValidationService', 'basicsConfigGenericWizardStepLayoutService', 'basicsConfigTranslationService'];

	function BasicsConfigGenericWizardStepDetailController($scope, platformDetailControllerService, basicsConfigGenWizardStepDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardStepLayoutService, basicsConfigTranslationService) {
		platformDetailControllerService.initDetailController($scope, basicsConfigGenWizardStepDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardStepLayoutService, basicsConfigTranslationService);
	}
})(angular);