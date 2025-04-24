/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.characteristic').controller('basicsCharacteristicCharacteristicController',
		basicsCharacteristicCharacteristicController);

	basicsCharacteristicCharacteristicController.$inject = ['$scope',
		'basicsCharacteristicCharacteristicService',
		'basicsCharacteristicCharacteristicUIStandardService',
		'basicsCharacteristicCharacteristicValidationService',
		'platformGridControllerService'];

	function basicsCharacteristicCharacteristicController($scope,
		dataService,
		uiStandardService,
		validationService,
		platformGridControllerService) {

		const myGridConfig = {
			initCalled: false,
			columns: []
		};
		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, myGridConfig);
	}
})(angular);
