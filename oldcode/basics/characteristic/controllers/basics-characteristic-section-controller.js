/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'basics.characteristic';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicSectionController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Section.
	 **/
	angular.module(moduleName).controller('basicsCharacteristicSectionController',
		basicsCharacteristicSectionController);

	basicsCharacteristicSectionController.$inject = ['$scope', 'platformGridAPI', 'basicsCharacteristicSectionService',
		'platformGridControllerService', 'basicsCharacteristicSectionUIStandardService', '_'];

	function basicsCharacteristicSectionController($scope, platformGridAPI, dataService,
		platformGridControllerService, basicsCharacteristicSectionUIStandardService, _) {

		const myGridConfig = {
			initCalled: false,
			columns: [],
			addValidationAutomatically: false
		};

		$scope.validateModel = dataService.validateModel;

		platformGridControllerService.initListController($scope, basicsCharacteristicSectionUIStandardService, dataService, '', myGridConfig);

		const removeItems = ['create', 'delete', 'createChild'];
		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item && removeItems.indexOf(item.id) === -1;
		});
	}
})(angular);
