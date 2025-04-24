/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.viewer.controller:modelMainObject2ObjectSetListController
	 * @requires $scope, $translate, platformContainerControllerService, modelMainObjectSetConfigurationService,
	 *           modelMainObjectSetDataService
	 * @description The controller for the model object set list container.
	 */
	angular.module('model.main').controller('modelMainObject2ObjectSetListController', ['$scope', '$translate',
		'platformContainerControllerService',
		function ($scope, $translate, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, 'model.main', '5ac3e7c43a534136876b9f2b43d5fcb8');
		}]);
})();