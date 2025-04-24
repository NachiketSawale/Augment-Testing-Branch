/*
 * $Id: viewer-filtering-selection-button-service.js 481628 2018-02-06 09:51:11Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformViewerFilteringSelectionButtonService
	 * @function
	 * @requires _
	 *
	 * @description Provides the toolbar button that can enable and disable grid filtering by 3D viewer selection.
	 */
	angular.module('platform').factory('platformViewerFilteringSelectionButtonService', ['_',
		function (_) {
			var service = {};

			service.provideButtons = function (config, dataService) {
				if (dataService.setFilterByViewerActive) {
					config.toggleFilteringSelectionBtn = {
						id: 'toggleFilteringSelection',
						sort: 20,
						caption: 'cloud.common.filterByViewer',
						type: 'check',
						iconClass: 'tlb-icons ico-filter-by-model',
						value: dataService.isFilterByViewerActive(),
						fn: function (id, btn) {
							dataService.setFilterByViewerActive(btn.value);
						}
					};

					if (_.isFunction(dataService.addFilterByViewerButton) && _.isFunction(dataService.removeFilterByViewerButton)) {
						dataService.addFilterByViewerButton(config);
						config.finalizeButton = function () {
							dataService.removeFilterByViewerButton(config);
						};
					}
				}
			};

			return service;
		}]);
})();