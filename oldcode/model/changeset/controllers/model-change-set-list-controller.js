/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.changeset').controller('modelChangeSetListController', ModelChangeSetListController);

	ModelChangeSetListController.$inject = ['$scope', 'platformGridControllerService',
		'modelChangeSetConfigurationService', 'modelChangeSetDataService','modelChangeSetClipboardService'];

	function ModelChangeSetListController($scope, platformGridControllerService,
		modelChangeSetConfigurationService, modelChangeSetDataService, modelChangeSetClipboardService) {

		const myGridConfig = {
			initCalled: false,
			grouping: true,
			idProperty: 'CompoundId',
			type: 'model.changeset',
			dragDropService: modelChangeSetClipboardService
		};

		platformGridControllerService.initListController($scope, modelChangeSetConfigurationService, modelChangeSetDataService, null, myGridConfig);

		modelChangeSetDataService.addActiveConsumer();

		$scope.$on('$destroy', function () {
			modelChangeSetDataService.removeActiveConsumer();
		});
	}
})(angular);
