/**
 * Created by zwz on 2020/1/20.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningPackageNavigationExtension
	 * @function
	 * @requires cloudDesktopSidebarService
	 * @description
	 * transportplanningPackageNavigationExtension provides navigation functionality for transport package data service
	 */
	module.service('transportplanningPackageNavigationExtension', NavigationExtension);
	NavigationExtension.$inject = ['cloudDesktopSidebarService'];

	function NavigationExtension(cloudDesktopSidebarService) {
		this.addNavigation = function (service) {
			//for navigational function
			service.selectItemByID = function (id) {
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