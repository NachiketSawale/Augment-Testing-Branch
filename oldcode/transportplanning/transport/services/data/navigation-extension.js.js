/**
 * Created by zwz on 2020/1/20.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportNavigationExtension
	 * @function
	 * @requires cloudDesktopSidebarService, transportplanningTransportPinningContextExtension, $q
	 * @description
	 * transportplanningTransportNavigationExtension provides navigation functionality for transport transport data service
	 */
	module.service('transportplanningTransportNavigationExtension', NavigationExtension);
	NavigationExtension.$inject = ['cloudDesktopSidebarService'];

	function NavigationExtension(cloudDesktopSidebarService) {

		function searchItem(id) {
			cloudDesktopSidebarService.filterSearchFromPKeys([id], { Value: id });
		}

		this.addNavigation = function (service) {
			service.searchItem = searchItem;


			service.searchByCalId = function (id) {
				var item = service.getItemById(id);
				//if item is null(maybe because the service hasn't load data), then we search by it immediately.
				if (!item) {
					service.isSearchByNavigation = true;
					cloudDesktopSidebarService.filterSearchFromPKeys([id]);
				}
				else {
					service.setSelected(item);
				}
			};
	
			service.searchByCalIds = function (ids) {
				if (ids && ids.length > 0) {
					service.isSearchByNavigation = true;
					var fRequest = cloudDesktopSidebarService.getFilterRequestParams();
					fRequest.includeNonActiveItems = true;//Here we set this option value with TRUE, because maybe the route that is gotoed from other module is inactive(IsLive is FALSE)
					fRequest.PKeys = ids;
					fRequest.ProjectContextId = null;
					fRequest.PinningContext = null;
					fRequest.furtherFilters = null;
					cloudDesktopSidebarService.onExecuteSearchFilter.fire(null, fRequest);
					//cloudDesktopSidebarService.filterRequest.includeNonActiveItems = true;//Here set this option with TRUE, in case user may research the route and the route is inactive(user may input the pattern of the Search sidebar, then click search-button).
	
				}
			};
		};

	}
})(angular);