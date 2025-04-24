/**
 * Created by baf on 2016-05-04.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardInstanceParameterDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of generic wizard step entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsConfigGenericWizardInstanceParameterDetailController', BasicsConfigGenericWizardInstanceParameterDetailController);

	BasicsConfigGenericWizardInstanceParameterDetailController.$inject = ['$scope', 'platformDetailControllerService', 'basicsConfigGenWizardInstanceParameterDataService', 'basicsConfigGenWizardValidationService', 'basicsConfigGenericWizardInstanceParameterLayoutService', 'basicsConfigTranslationService'];

	function BasicsConfigGenericWizardInstanceParameterDetailController($scope, platformDetailControllerService, basicsConfigGenWizardInstanceParameterDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardInstanceParameterLayoutService, basicsConfigTranslationService) {
		platformDetailControllerService.initDetailController($scope, basicsConfigGenWizardInstanceParameterDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardInstanceParameterLayoutService, basicsConfigTranslationService);
	}
})(angular);