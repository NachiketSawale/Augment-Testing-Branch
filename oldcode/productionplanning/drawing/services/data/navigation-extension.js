/**
 * Created by zwz on 2020/1/8.
 */

(function () {
	'use strict';
	/* global angular */
	let moduleName = 'productionplanning.drawing';
	let module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingNavigationExtension
	 * @function
	 * @requires cloudDesktopSidebarService
	 * @description
	 * productionplanningDrawingNavigationExtension provides navigation functionality for drawing data service
	 */
	module.service('productionplanningDrawingNavigationExtension', NavigationExtension);
	NavigationExtension.$inject = [
		'cloudDesktopSidebarService',
		'$injector'];

	function NavigationExtension(
		cloudDesktopSidebarService,
		$injector) {

		this.addNavigation = function (service) {
			// for navigational function
			service.searchByCalId = function (id) {
				let item = service.getItemById(id);
				// if item is null(maybe because the service hasn't load data), then we search by it immediately.
				if (!item) {
					service.searchByCalIds([id]);
				} else {
					service.setSelected(item);
				}
			};

			service.searchByCalIds = function (ids) {
				if (ids && ids.length > 0) {
					let dataServ = $injector.get('productionplanningDrawingMainService');
					dataServ.resetFilter(true);
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
			};
		};
	}
})();
