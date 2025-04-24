/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.changeset').controller('modelChangeSetBlackListController', ModelChangeSetBlackListController);

	ModelChangeSetBlackListController.$inject = ['$scope', 'platformGridControllerService',
		'modelChangeSetConfigurationService', 'modelChangeSetDataService'];

	function ModelChangeSetBlackListController($scope, platformGridControllerService,
		modelChangeSetConfigurationService, modelChangeSetDataService) {

		const myGridConfig = {
			initCalled: false,
			grouping: true,
			idProperty: 'ID'
		};

		platformGridControllerService.initListController($scope, modelChangeSetConfigurationService, modelChangeSetDataService, null, myGridConfig);

		modelChangeSetDataService.addActiveConsumer();

		$scope.$on('$destroy', function () {
			modelChangeSetDataService.removeActiveConsumer();
		});
	}
})(angular);
