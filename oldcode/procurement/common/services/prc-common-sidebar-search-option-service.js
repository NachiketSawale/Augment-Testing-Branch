/**
 * Created by lst on 11/3/2016.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.common').factory('procurementCommonSidebarSearchOptionService',
		['cloudDesktopSidebarService',
			function (cloudDesktopSidebarService) {

				var service = {};

				var procurementSearchOptions = {
					name: cloudDesktopSidebarService.getSidebarIds().search,
					title: 'Search',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.common/templates/sidebar-search-main.html',
					isActive: function () {
						return service.isSearchActive();
					}
				};

				var defaultSearchOptions = {
					name: cloudDesktopSidebarService.getSidebarIds().search,
					type: 'template',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-main.html',
					isActive: function () {
						return service.isSearchActive();
					}
				};

				service.getProcurementSidebarSearchOptions = function () {
					return procurementSearchOptions;
				};

				service.getDefaultSidebarSearchOptions = function () {
					return defaultSearchOptions;
				};

				service.isSearchActive = function () {
					let searchItemId = cloudDesktopSidebarService.getSidebarIds().search;
					let searchItem = _.find(cloudDesktopSidebarService.commandBarDeclaration.items, { id: '#' + searchItemId });
					if (searchItem) {
						return !searchItem.hideItem;
					}
					return false;
				};

				return service;

			}]);
})(angular);