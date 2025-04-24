/**
 * Created by baf on 2016-05-04.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardContainerPropertyDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of generic wizard container property entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsConfigGenericWizardContainerPropertyDetailController', BasicsConfigGenericWizardContainerPropertyDetailController);

	BasicsConfigGenericWizardContainerPropertyDetailController.$inject = ['$scope', 'platformDetailControllerService', 'basicsConfigGenWizardContainerPropertyDataService', 'basicsConfigGenWizardValidationService', 'basicsConfigGenericWizardContainerPropertyLayoutService', 'basicsConfigTranslationService'];

	function BasicsConfigGenericWizardContainerPropertyDetailController($scope, platformDetailControllerService, basicsConfigGenWizardContainerPropertyDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardContainerPropertyLayoutService, basicsConfigTranslationService) {
		platformDetailControllerService.initDetailController($scope, basicsConfigGenWizardContainerPropertyDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardContainerPropertyLayoutService, basicsConfigTranslationService);
	}
})(angular);