/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationModelImportPropertyProcessorListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model administration model import property processor entities.
	 **/

	angular.module(moduleName).controller('modelAdministrationModelImportPropertyProcessorListController',
		ModelAdministrationModelImportPropertyProcessorListController);

	ModelAdministrationModelImportPropertyProcessorListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationModelImportPropertyProcessorListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2744eda347844751ad0a61950b4ad6cf');
	}
})(angular);