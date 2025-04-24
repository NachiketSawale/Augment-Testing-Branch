/**
 * Created by zwz on 2020/1/9.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningRequisitionNavigationExtension
	 * @function
	 * @requires cloudDesktopSidebarService, transportplanningRequisitionPinningContextExtension, $q
	 * @description
	 * transportplanningRequisitionNavigationExtension provides navigation functionality for transport requisition data service
	 */
	module.service('transportplanningRequisitionNavigationExtension', NavigationExtension);
	NavigationExtension.$inject = ['cloudDesktopSidebarService', 'transportplanningRequisitionPinningContextExtension', '$q'];

	function NavigationExtension(cloudDesktopSidebarService, pinningContextExtension, $q) {

		function searchItem(id) {
			cloudDesktopSidebarService.filterSearchFromPKeys([id], { Value: id });
		}

		this.addNavigation = function (service) {
			service.searchItem = searchItem;

			service.searchItemByActivity = function searchItemByActivity(activity) {
				service.setSelected();
				if (activity) {
					$q.when(pinningContextExtension.setPinningContext(activity.ProjectId, null, activity)).then(function () {
						service.refresh();
					});
				}
			};

			service.navigateByCode = function navigateByCode(trsRequisition) {
				if (trsRequisition) {
					$q.when(pinningContextExtension.setPinningContext(trsRequisition.ProjectFk, null, null, trsRequisition)).then(function () {
						$q.when(service.refresh()).then(function () {
							service.setSelected(trsRequisition);
						});
					});
				}
			};
		};

	}
})(angular);