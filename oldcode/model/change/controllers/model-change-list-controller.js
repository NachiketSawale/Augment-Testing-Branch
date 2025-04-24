/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.change').controller('modelChangeListController', modelChangeListController);

	modelChangeListController.$inject = ['$scope', 'platformGridControllerService', 'modelChangeConfigurationService',
		'modelChangeDataService'];

	function modelChangeListController($scope, platformGridControllerService, modelChangeConfigurationService,
		modelChangeDataService) {

		const myGridConfig = {
			initCalled: false,
			grouping: true,
			idProperty: 'CompoundId'
		};

		platformGridControllerService.initListController($scope, modelChangeConfigurationService, modelChangeDataService, null, myGridConfig);
	}
})(angular);
