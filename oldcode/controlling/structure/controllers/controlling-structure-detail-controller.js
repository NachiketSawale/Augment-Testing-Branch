/**
 * Created by janas on 12.11.2014.
 */


(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc controller
	 * @name controllingStructureDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of controlling structure entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('controllingStructureDetailController',
		['$scope', 'platformContainerControllerService', function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '7D688DE3485B440D92154D7C19F376F7', 'controllingStructureTranslationService');
		}]);
})();
