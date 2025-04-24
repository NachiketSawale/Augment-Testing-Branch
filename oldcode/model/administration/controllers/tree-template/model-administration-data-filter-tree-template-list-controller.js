/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationDataFilterTreeTemplateListController
	 * @function
	 *
	 * @description
	 * Controller for the details container of data filter tree template.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationDataFilterTreeTemplateListController', ['$scope',
		'platformContainerControllerService', 'modelAdministrationDataFilterTreeTemplateDataService','platformGridControllerService',
		function ($scope, platformContainerControllerService, modelAdministrationDataFilterTreeTemplateDataService, platformGridControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'e5801f5433724277babcc584015775a1');
			var tools = [
				{
					id: 'deepCopyTreeTemplate',
					sort: 5,
					caption: 'cloud.common.taskBarDeepCopyRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-copy-paste-deep',
					fn: function deepCopy() {
						modelAdministrationDataFilterTreeTemplateDataService.copyPaste();
					}
				}
			];
			platformGridControllerService.addTools(tools);


		}]);
})();