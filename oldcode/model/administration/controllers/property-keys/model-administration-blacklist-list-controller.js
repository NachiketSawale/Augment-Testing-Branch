/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationBlackListListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of static highlighting schemes.
	 **/
	angular.module(moduleName).controller('modelAdministrationBlackListListController',
		modelAdministrationBlackListListController);

	modelAdministrationBlackListListController.$inject = ['$scope',
		'platformContainerControllerService', 'modelAdministrationPropertyKeyBlacklistHelperService',
		'modelAdministrationBlackListDataService'];

	function modelAdministrationBlackListListController($scope, platformContainerControllerService, modelAdministrationPropertyKeyBlacklistHelperService,
		modelAdministrationBlackListDataService) {
		platformContainerControllerService.initController($scope, moduleName, '51db6299be4f4d3097919ef4492b0cdc');

		modelAdministrationPropertyKeyBlacklistHelperService.addBlacklistByTagButton($scope, false, function () {
			return modelAdministrationBlackListDataService.load();
		});
	}
})(angular);
