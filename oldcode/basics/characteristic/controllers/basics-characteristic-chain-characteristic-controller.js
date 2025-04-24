/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	const moduleName = 'basics.characteristic';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicChainCharacteristicController
	 * @function
	 *
	 * @description
	 *
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCharacteristicChainCharacteristicController',
		basicsCharacteristicChainCharacteristicController);

	basicsCharacteristicChainCharacteristicController.$inject = ['$scope',
		'platformGridAPI',
		'basicsCharacteristicChainCharacteristicService',
		'platformGridControllerService',
		'basicsCharacteristicChainCharacteristicUIService'];

	function basicsCharacteristicChainCharacteristicController($scope,
		platformGridAPI,
		dataService,
		platformGridControllerService,
		UIService) {

		const myGridConfig = {
			initCalled: false,
			columns: [],
			addValidationAutomatically: false
		};

		platformGridControllerService.initListController($scope, UIService, dataService, '', myGridConfig);

		// var removeItems = ['create', 'delete', 'createChild'];
		// $scope.tools.items = _.filter($scope.tools.items, function (item) {
		//     return item && removeItems.indexOf(item.id) === -1;
		// });

		$scope.sectionId = -1;

	}
})(angular);
