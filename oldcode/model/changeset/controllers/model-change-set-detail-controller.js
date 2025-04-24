/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.changeset';

	angular.module(moduleName).controller('modelChangeSetDetailController', ModelChangeSetDetailController);

	ModelChangeSetDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelChangeSetDataService'];

	function ModelChangeSetDetailController($scope, platformContainerControllerService,
		modelChangeSetDataService) {

		platformContainerControllerService.initController($scope, moduleName, '46f270d1fcce425c85b26dbfc9288b9d', 'modelMainTranslationService');

		modelChangeSetDataService.addActiveConsumer();

		$scope.$on('$destroy', function () {
			modelChangeSetDataService.removeActiveConsumer();
		});
	}
})(angular);
