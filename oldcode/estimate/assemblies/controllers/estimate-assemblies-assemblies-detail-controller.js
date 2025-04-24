/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
     * @ngdoc controller
     * @name estimateAssembliesAssembliesDetailController
     * @function
     *
     * @description
     * Controller for the detail view of Assembly entities.
     **/
	angular.module(moduleName).controller('estimateAssembliesAssembliesDetailController',
		['$scope', '$injector', 'platformContainerControllerService', 'estimateAssembliesService', 'estimateAssembliesConfigurationService', 'estimateAssembliesValidationService', 'estimateAssembliesConfigurationExtendService',
			function ($scope, $injector, platformContainerControllerService, estimateAssembliesService, estimateAssembliesConfigurationService, estimateAssembliesValidationService, estimateAssembliesConfigurationExtendService) {

				/* add costGroupService to mainService */
				if(!estimateAssembliesService.costGroupService){
					estimateAssembliesService.costGroupService = $injector.get('estimateAssembliesCostGroupService');
				}

				estimateAssembliesConfigurationExtendService.attachCostGroup(estimateAssembliesService.costGroupCatalogs, estimateAssembliesService.costGroupService);

				platformContainerControllerService.initController($scope, moduleName, 'b5c6ff9eab304beba4335d30700773da', 'salesBidTranslations');

				/* register the event 'onCostGroupCatalogsLoaded' */
				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
						scope: $scope,
						dataService: estimateAssembliesService,
						validationService: estimateAssembliesValidationService,
						formConfiguration: estimateAssembliesConfigurationService,
						costGroupName: 'basicData'
					});
				}

				estimateAssembliesService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				$injector.get('estimateAssembliesDynamicUserDefinedColumnService').loadUserDefinedColumnDetail($scope);

				$scope.$on('$destroy', function () {
					/* unregister the onCostGroupCatalogsLoaded */
					estimateAssembliesService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				});
			}]);
})(angular);
