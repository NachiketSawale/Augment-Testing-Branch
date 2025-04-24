/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationModelImportPropertyKeyRuleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model administration model import property key rule entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationModelImportPropertyKeyRuleDetailController',
		ModelAdministrationModelImportPropertyKeyRuleDetailController);

	ModelAdministrationModelImportPropertyKeyRuleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationModelImportPropertyKeyRuleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f21727ad8b4b4b5b9b22330d600fb3fb', 'modelAdministrationTranslationService');
	}

})(angular);