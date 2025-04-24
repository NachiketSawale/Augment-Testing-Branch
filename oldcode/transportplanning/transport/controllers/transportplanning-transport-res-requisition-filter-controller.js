/**
 * Created by zov on 30/01/2019.
 */
(function () {
	'use strict';

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).controller('transportPlanningResRequisitionFilterController', [
		'$scope',
		'platformSourceWindowControllerService',
		'$http',
		'$injector',
		'platformGridAPI',
		'$timeout',
		'transportplanningTransportMainService',
		function ($scope,
				  platformSourceWindowControllerService,
				  $http,
				  $injector,
				  platformGridAPI,
				  $timeout,
				  trsMainDataService) {

			var sourceFSName = 'transportplanningTransportResRequisitionFilterService';
			// set default site
			if (trsMainDataService.getSelected()) {
				var defSiteFk = trsMainDataService.getSelected().SiteFk;
				if (defSiteFk) {
					$injector.get(sourceFSName).setDefaultSite(defSiteFk);
				}
				var deliveryDate = trsMainDataService.getSelected().PlannedDelivery;
				$injector.get(sourceFSName).setRequestedDate(deliveryDate);
			}
			else {
				$http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/getCurrentCompanyDefaultSiteId').then(function (response) {
					var defSiteFk = response.data;
					$injector.get(sourceFSName).setDefaultSite(defSiteFk);
				});
				$injector.get(sourceFSName).setRequestedDate(null);
			}

			var uuid = $scope.getContainerUUID();
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid,
				'transportplanningTransportContainerInformationService', sourceFSName);

			// temporary solution to let data grid editable
			var setCellEditable = null;
			$timeout(function () {
				setCellEditable = function () {
					return true;
				};
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
			}, 1000);

			$scope.$on('$destroy', function () {
				if (setCellEditable) {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				}
			});
		}
	]);
})();