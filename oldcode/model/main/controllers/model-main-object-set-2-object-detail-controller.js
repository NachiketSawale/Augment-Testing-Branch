/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainObjectSet2ObjectDetailController', ModelMainObjectSetDetailController);

	ModelMainObjectSetDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelMainObjectSet2ObjectDataService', 'platformMenuListUtilitiesService'];

	function ModelMainObjectSetDetailController($scope, platformContainerControllerService,
		modelMainObjectSet2ObjectDataService, platformMenuListUtilitiesService) {

		platformContainerControllerService.initController($scope, moduleName, '7286433056e94cf18d40390f6d723956', 'modelMainTranslationService');

		$scope.formContainerOptions.customButtons = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelMainObjectSet2ObjectDataService.updateModelSelection,
				toolsScope: $scope
			})
		];
	}
})(angular);
