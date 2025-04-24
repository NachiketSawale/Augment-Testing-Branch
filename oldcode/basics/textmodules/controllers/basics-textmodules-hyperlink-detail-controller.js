/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).controller('basicsTextModulesHyperlinkDetailController', basicsTextModulesHyperlinkDetailController);

	basicsTextModulesHyperlinkDetailController.$inject = [
		'$scope',
		'_',
		'platformGridControllerService',
		'basicsTextModulesHyperlinkUIStandardService',
		'basicsTextModulesHyperlinkDataService',
		'platformDetailControllerService',
		'basicsTextModulesTranslationService',
		'basicsTextModulesHyperlinkValidationService',
		'platformContainerCreateDeleteButtonService'];

	function basicsTextModulesHyperlinkDetailController(
		$scope,
		_,
		platformGridControllerService,
		basicsTextModulesHyperlinkUIStandardService,
		basicsTextModulesHyperlinkDataService,
		platformDetailControllerService,
		basicsTextModulesTranslationService,
		basicsTextModulesHyperlinkValidationService,
		platformContainerCreateDeleteButtonService) {

		platformDetailControllerService.initDetailController($scope, basicsTextModulesHyperlinkDataService, basicsTextModulesHyperlinkValidationService, basicsTextModulesHyperlinkUIStandardService, basicsTextModulesTranslationService);

		basicsTextModulesHyperlinkDataService.gridReadonlyChanged.register(onGridReadonlyChanged);

		$scope.$on('$destroy', function () {
			basicsTextModulesHyperlinkDataService.gridReadonlyChanged.unregister(onGridReadonlyChanged);
		});

		function onGridReadonlyChanged() {
			platformContainerCreateDeleteButtonService.toggleButtons($scope.formContainerOptions, basicsTextModulesHyperlinkDataService);
			if ($scope.tools && angular.isFunction($scope.tools.update)) {
				$scope.tools.update();
			}
		}
	}

})(angular);