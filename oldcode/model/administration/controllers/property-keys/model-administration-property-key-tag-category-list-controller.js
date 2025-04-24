/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationPropertyKeyTagCategoryListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model administration property key tag category entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationPropertyKeyTagCategoryListController', ModelAdministrationListController);

	ModelAdministrationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e7bee8d36e8f475b9812eb0d21696c49');
	}
})(angular);