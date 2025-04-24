/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationPropertyKeyTagCategoryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model administration property key tag category entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationPropertyKeyTagCategoryDetailController', ModelAdministrationDetailController);

	ModelAdministrationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f0b70206735642cab5472cc4f5620c65', 'modelAdministrationTranslationService');
	}

})(angular);