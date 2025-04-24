/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationModelImportPropertyProcessorDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model administration model import property processor entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationModelImportPropertyProcessorDetailController',
		ModelAdministrationModelImportPropertyProcessorDetailController);

	ModelAdministrationModelImportPropertyProcessorDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationModelImportPropertyProcessorDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '44f7428f27c94325ba46d1c2357f5ee7', 'modelAdministrationTranslationService');
	}

})(angular);