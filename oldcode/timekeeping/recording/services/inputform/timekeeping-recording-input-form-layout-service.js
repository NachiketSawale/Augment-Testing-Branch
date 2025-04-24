/*
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	angular.module(moduleName).service('timekeepingRecordingInputFormLayoutService', TimekeepingRecordingInputFormLayoutService);

	TimekeepingRecordingInputFormLayoutService.$inject = ['_', 'timekeepingLayoutUserInterfaceLayoutDataService'];

	function TimekeepingRecordingInputFormLayoutService(_, timekeepingLayoutUserInterfaceLayoutDataService) {
		var data = {
			layouts: [],
			selectedLayout: null
		};

		function takeOver(layouts) {
			_.forEach(layouts, function(layout) {
				data.layouts.push(layout);
			});

			data.selectedLayout = data.layouts[0];
		}

		this.load = function loadLayoutsForInputForm() {
			return timekeepingLayoutUserInterfaceLayoutDataService.loadAll().then(function(layouts) {
				takeOver(layouts);

				return layouts;
			});
		};

		this.loadLayoutComplete = function loadLayoutComplete(layout) {
			return timekeepingLayoutUserInterfaceLayoutDataService.loadComplete(layout.Id);
		};

		this.getSelectedLayout = function getSelectedLayout() {
			return data.selectedLayout;
		};
	}

})(angular);