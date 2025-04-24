/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.viewer.controller:modelMainObjectSet2ObjectListController
	 * @description The controller for the model object set list container.
	 */
	angular.module('model.main').controller('modelMainObjectSet2ObjectListController',
		ModelMainObjectSet2ObjectListController);

	ModelMainObjectSet2ObjectListController.$inject = ['$scope', '$translate',
		'platformContainerControllerService', 'platformMenuListUtilitiesService',
		'modelMainObjectSet2ObjectDataService', 'platformGridControllerService'];

	function ModelMainObjectSet2ObjectListController($scope, $translate,
		platformContainerControllerService, platformMenuListUtilitiesService,
		modelMainObjectSet2ObjectDataService, platformGridControllerService) {

		platformContainerControllerService.initController($scope, 'model.main', 'de6317b8a309450485e28addd88f3577');

		const toolbarItems = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: modelMainObjectSet2ObjectDataService.updateModelSelection,
				toolsScope: $scope
			})
		];

		platformGridControllerService.addTools(toolbarItems);
	}
})(angular);
