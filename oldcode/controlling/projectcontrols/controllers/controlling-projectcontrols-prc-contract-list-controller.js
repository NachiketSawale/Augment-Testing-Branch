(function (angular) {
	/* global  _ */
	'use strict';
	let moduleName='controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectControlsPrcContractListController',
		['$scope','controllingCommonPrcContractListControllerFactory','controllingProjectControlsPrcContractListDataService',
			function ($scope,controllingCommonPrcContractListControllerFactory,dataService) {

				controllingCommonPrcContractListControllerFactory.initPrcContractController($scope,dataService);
				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items,function (d) {
						return d.id==='t12' || d.id ==='gridSearchAll' ||
							d.id ==='gridSearchColumn' || d.id ==='t200'|| d.id ==='collapsenode' ||
							d.id ==='expandnode'|| d.id ==='collapseall' || d.id ==='expandall';
					});
					$scope.tools.update();
				}
				updateTools();
			}
		]);
})(angular);