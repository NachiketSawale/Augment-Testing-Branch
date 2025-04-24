/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesAssemblyResourcesDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of Assembly Resources entities.
	 **/
	angular.module(moduleName).controller('estimateAssembliesAssemblyResourcesDetailController',
		['$scope', '$injector', 'platformContainerControllerService', function ($scope, $injector, platformContainerControllerService) {

			$scope.change=function (entity, field){
				let argData = {item: entity, field: field, colName: field};
				$injector.get('estimateAssembliesResourceService').estimateAssemblyResources(argData);
			};

			platformContainerControllerService.initController($scope, moduleName, '8eb36f285d154864bba7da0574973c94', 'salesBidTranslations');

			$injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService').loadUserDefinedColumnDetail($scope);
		}]);
})(angular);
