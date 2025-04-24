/**
 * Created by zwz on 2020/1/8.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.producttemplate';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningProducttemplateNavigationExtension
	 * @function
	 * @requires cloudDesktopSidebarService
	 * @description
	 * productionplanningProducttemplateNavigationExtension provides navigation functionality for product template data service
	 */
	module.service('productionplanningProducttemplateNavigationExtension', NavigationExtension);
	NavigationExtension.$inject = ['cloudDesktopSidebarService'];

	function NavigationExtension(cloudDesktopSidebarService) {

		this.addNavigation = function (service) {
			//navigational function
			service.searchByCalId = function (id) {
				var item = service.getItemById(id);
				//if item is null(maybe because the service hasn't load data), then we search by it immediately.
				if (!item) {
					cloudDesktopSidebarService.filterSearchFromPKeys([id]);
				}
				else {
					service.setSelected(item);
				}
			};
		};

	}
})(angular);
