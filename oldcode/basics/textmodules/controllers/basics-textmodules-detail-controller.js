/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).controller('basicsTextModulesDetailController', basicsTextModulesDetailController);

	basicsTextModulesDetailController.$inject = [
		'$scope',
		'platformGridControllerService',
		'basicsTextModulesStandardConfigurationService',
		'basicsTextModulesMainService',
		'platformDetailControllerService',
		'basicsTextModulesTranslationService',
		'basicsTextModulesValidationService'];

	function basicsTextModulesDetailController(
		$scope,
		platformGridControllerService,
		basicsTextModulesStandardConfigurationService,
		basicsTextModulesMainService,
		platformDetailControllerService,
		basicsTextModulesTranslationService,
		basicsTextModulesValidationService) {

		platformDetailControllerService.initDetailController($scope, basicsTextModulesMainService, basicsTextModulesValidationService, basicsTextModulesStandardConfigurationService, basicsTextModulesTranslationService);
	}
})(angular);