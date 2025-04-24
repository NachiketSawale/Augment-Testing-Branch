/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainObjectSetDetailController', ModelMainObjectSetDetailController);

	ModelMainObjectSetDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'platformMenuListUtilitiesService', 'modelMainObjectSetDataService'];

	function ModelMainObjectSetDetailController($scope, platformContainerControllerService,
		platformMenuListUtilitiesService, modelMainObjectSetDataService) {

		platformContainerControllerService.initController($scope, moduleName, 'afc330272d704407856af51fc68f62c1', 'modelMainTranslationService');

		$scope.formContainerOptions.customButtons = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelMainObjectSetDataService.updateModelSelection,
				toolsScope: $scope
			})
		];
	}
})(angular);
