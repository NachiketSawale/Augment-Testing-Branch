/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainEstLineItem2ObjectController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of model objects assigned ti line item.
	 **/
	angular.module(moduleName).controller('modelMainEstLineItem2ObjectController',
		ModelMainEstLineItem2ObjectController);

	ModelMainEstLineItem2ObjectController.$inject = ['$scope',
		'platformContainerControllerService', '$translate', 'modelMainEstLineItem2ObjectService'];

	function ModelMainEstLineItem2ObjectController($scope,
		platformContainerControllerService, $translate, modelMainEstLineItem2ObjectService) {

		platformContainerControllerService.initController($scope, moduleName, '078db77dd8d54d2f810c4509d43ff34b');

		$scope.overlayInfo = $translate.instant('model.main.noPinnedEstimate');
		$scope.showInfoOverlay = !modelMainEstLineItem2ObjectService.isEstimatePinned();
	}
})(angular);
