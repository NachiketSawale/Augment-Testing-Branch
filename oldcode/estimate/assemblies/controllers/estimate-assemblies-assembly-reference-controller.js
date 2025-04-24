/**
 * $Id: estimate-assemblies-wic-item-list-controller.js 11512 2021-09-21 09:28:27Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesReferencesController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of entity entities.
	 **/
	angular.module(moduleName).controller('estimateAssembliesReferencesController',
		['_','$scope', 'platformContainerControllerService','estimateAssembliesReferenceService','platformGridAPI',
			function (_,$scope, platformContainerControllerService, estimateAssembliesReferenceService, platformGridAPI) {
				platformContainerControllerService.initController($scope, moduleName, 'd0cd8c0b6d68486d9e8a137f2fb33687');

				function onListLoaded(){
					platformGridAPI.configuration.refresh('d0cd8c0b6d68486d9e8a137f2fb33687');
				}

				estimateAssembliesReferenceService.registerListLoaded(onListLoaded);
				$scope.$on('$destroy', function () {
					estimateAssembliesReferenceService.unregisterListLoaded(onListLoaded);
				});

				// remove tools
				const idsToRemove = ['t14', 't12', 't199'];
				_.remove($scope.tools.items, item => idsToRemove.includes(item.id));
			}]);
})();
