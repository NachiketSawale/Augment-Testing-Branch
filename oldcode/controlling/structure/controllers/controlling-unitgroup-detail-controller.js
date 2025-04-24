/**
 * Created by janas on 16.01.2015.
 */


(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc controller
	 * @name controllingStructureUnitgroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of controlling group assignments.
	 **/
	angular.module(moduleName).controller('controllingStructureUnitgroupDetailController',
		['$scope', 'platformContainerControllerService', function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '9832DABE9F3E4EE8BF3A0B3010E2122F', 'controllingStructureTranslationService');
		}]);
})();
