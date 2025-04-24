/**
 * Created by baf on 2016-05-04.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardInstanceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of generic wizard instance entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsConfigGenericWizardInstanceDetailController', BasicsConfigGenericWizardInstanceDetailController);

	BasicsConfigGenericWizardInstanceDetailController.$inject = ['$scope', 'platformDetailControllerService', 'basicsConfigGenWizardInstanceDataService', 'basicsConfigGenWizardValidationService', 'basicsConfigGenericWizardInstanceLayoutService', 'basicsConfigTranslationService'];

	function BasicsConfigGenericWizardInstanceDetailController($scope, platformDetailControllerService, basicsConfigGenWizardInstanceDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardInstanceLayoutService, basicsConfigTranslationService) {
		platformDetailControllerService.initDetailController($scope, basicsConfigGenWizardInstanceDataService, basicsConfigGenWizardValidationService, basicsConfigGenericWizardInstanceLayoutService, basicsConfigTranslationService);
	}
})(angular);