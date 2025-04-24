/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).controller('basicsTextModulesHyperlinkListController', basicsTextModulesHyperlinkListController);

	basicsTextModulesHyperlinkListController.$inject = [
		'$scope',
		'_',
		'platformGridControllerService',
		'basicsTextModulesHyperlinkUIStandardService',
		'basicsTextModulesHyperlinkDataService',
		'basicsTextModulesHyperlinkValidationService',
		'platformGridAPI',
		'platformContainerCreateDeleteButtonService'];

	function basicsTextModulesHyperlinkListController(
		$scope,
		_,
		platformGridControllerService,
		basicsTextModulesHyperlinkUIStandardService,
		basicsTextModulesHyperlinkDataService,
		basicsTextModulesHyperlinkValidationService,
		platformGridAPI,
		platformContainerCreateDeleteButtonService) {

		let myGridConfig = { initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, basicsTextModulesHyperlinkUIStandardService, basicsTextModulesHyperlinkDataService, basicsTextModulesHyperlinkValidationService, myGridConfig);

		basicsTextModulesHyperlinkDataService.gridReadonlyChanged.register(onGridReadonlyChanged);

		$scope.$on('$destroy', function () {
			basicsTextModulesHyperlinkDataService.gridReadonlyChanged.unregister(onGridReadonlyChanged);
		});

		function onGridReadonlyChanged() {
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, basicsTextModulesHyperlinkDataService);
			if ($scope.tools && angular.isFunction($scope.tools.update)) {
				$scope.tools.update();
			}
		}
	}

})(angular);