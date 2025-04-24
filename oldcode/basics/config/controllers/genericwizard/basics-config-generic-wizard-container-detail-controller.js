/**
 * Created by baf on 2016-05-04.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardContainerDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of generic wizard container entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsConfigGenericWizardContainerDetailController', BasicsConfigGenericWizardContainerDetailController);

	BasicsConfigGenericWizardContainerDetailController.$inject = ['$scope', 'platformDetailControllerService', 'basicsConfigGenWizardContainerDataService', 'basicsConfigGenWizardValidationService', 'basicsConfigGenericWizardContainerLayoutService', 'basicsConfigTranslationService'];

	function BasicsConfigGenericWizardContainerDetailController($scope, platformDetailControllerService, basicsConfigGenWizardContainerDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardContainerLayoutService, basicsConfigTranslationService) {
		platformDetailControllerService.initDetailController($scope, basicsConfigGenWizardContainerDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardContainerLayoutService, basicsConfigTranslationService);
	}
})(angular);