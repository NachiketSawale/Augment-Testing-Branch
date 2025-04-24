/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectSidebarService
	 * @function
	 *
	 * @description Provides a dialog box that allows to input settings for a new stored camera position.
	 */
	angular.module('model.main').factory('modelMainObjectSidebarService', ['_', 'modelMainTranslationService',
		'cloudDesktopSidebarService',
		function (_, modelMainTranslationService, sidebarSvc) {
			var service = {};

			var modelObjectSearchId = sidebarSvc.getSidebarIds().modelObjectSearch;

			var modelObjectSearch = {
				name: modelObjectSearchId,
				type: 'template',
				templateUrl: globals.appBaseUrl + 'model.main/templates/object-sidebar/sidebar-search-main.html',
				isActive: function () {
					var btnId = sidebarSvc.getSidebarIdAsId(modelObjectSearchId);
					return !_.find(sidebarSvc.commandBarDeclaration.items, function (item) {
						return item.id === btnId;
					}).hideItem;
				}
			};
			sidebarSvc.registerSidebarContainer(modelObjectSearch, false);

			var sidebarRequestCount = 0;

			function updateSidebarVisibility() {
				/*var btnId = sidebarSvc.getSidebarIdAsId(modelObjectSearchId);
				_.find(sidebarSvc.commandBarDeclaration.items, function (item) {
					return item.id === btnId;
				}).hideItem = sidebarRequestCount <= 0;*/
				sidebarSvc.showHideButtons([{sidebarId: modelObjectSearchId, sidebarContainer: modelObjectSearch, active: sidebarRequestCount > 0 }]);
			}

			service.requireSidebar = function() {
				sidebarRequestCount++;
				updateSidebarVisibility();
			};

			service.unrequireSidebar = function() {
				sidebarRequestCount--;
				updateSidebarVisibility();
			};

			service.currentSearchType = 'enhanced';

			return service;
		}]);
})(angular);
