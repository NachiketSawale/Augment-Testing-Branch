/**
 * Created by lja on 2015/10/23.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageSideBarInfoController',
		['$scope', 'procurementPackageDataService', 'procurementCommonTotalDataService',
			'procurementCommonSideBarInfoService',
			'procurementCommonSideBarInfoDependentDataService', 'procurementCommonSideBarInfoDependentDataUIService',
			function ($scope, dataService, commonTotalService,
				procurementCommonSideBarInfoService,
				procurementCommonSideBarInfoDependentDataService, procurementCommonSideBarInfoDependentDataUIService) {

				var headerItemFields = [
					{
						model: 'PackageStatus.Description',
						iconUrl: 'getStatusIconUrl()'
					},
					{
						model: 'PlannedStart',
						description: '"Planned Start"',
						description$tr$: 'procurement.package.sidebar.plannedStart',
						domain: 'date',
						iconClass: 'app-icons ico-calendar'
					},
					{
						model: 'PlannedEnd',
						description: '"Planned End"',
						description$tr$: 'procurement.package.sidebar.plannedEnd',
						domain: 'date',
						iconClass: 'app-icons ico-calendar'
					}
				];

				var theModule = 'package';

				$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
					.concat(
						procurementCommonSideBarInfoService.businessPartnerHandler($scope),
						procurementCommonSideBarInfoService.totalHandler($scope, commonTotalService.getService(dataService)),
						procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
					);

			}]);
})(angular);