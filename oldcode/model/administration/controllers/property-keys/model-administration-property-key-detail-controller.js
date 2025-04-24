/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationPropertyKeyDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model administration property key entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationPropertyKeyDetailController', ModelAdministrationDetailController);

	ModelAdministrationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9889fc35cb8640ba9b59f0c8c663698f', 'modelAdministrationTranslationService');
	}

})(angular);