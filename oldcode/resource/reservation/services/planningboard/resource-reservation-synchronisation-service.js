(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceReservationDataService
	 * @function
	 *
	 * @description
	 * resourceReservationDataService is the data service for all reservation related functionality.
	 */
	var moduleName = 'resource.reservation';
	angular.module(moduleName).service('resourceReservationSynchronisationService', ResourceReservationSynchronisationService);

	ResourceReservationSynchronisationService.$inject = ['_', 'resourceReservationDataService', 'resourceReservationPlanningBoardReservationService'];

	function ResourceReservationSynchronisationService(_, resourceReservationDataService, resourceReservationPlanningBoardReservationService) {
		let self = this;
		let data = {
			gridSelection: null,
			gridSelected: null,
			boardSelection: null,
			boardSelected: null
		};

		this.getSelectedEntities = function getSelectedEntities() {
			return data.gridSelection || data.boardSelection;
		};

		this.getSelected = function getSelected() {
			return data.gridSelected || data.boardSelected;
		};

		this.onPlanningBoardSelectionChanged = function onPlanningBoardSelectionChanged() {
			let selection = resourceReservationPlanningBoardReservationService.getSelected();
			if(selection) {
				data.boardSelection = [selection];
				data.boardSelected = selection;
				data.gridSelection = null;
				data.gridSelected = null;
			}
			else {
				data.boardSelection = null;
				data.boardSelected = null;
			}
		};

		this.onListContainerSelectionChanged = function onListContainerSelectionChanged() {
			let selection = resourceReservationDataService.getSelected();
			if(selection) {
				data.gridSelection = resourceReservationDataService.getSelectedEntities();
				data.gridSelected = selection;
			}
			else {
				data.gridSelection = null;
				data.gridSelected = null;
			}
			data.boardSelection = null;
			data.boardSelected = null;
		};

		this.startWatching = function startWatching() {
			if (resourceReservationPlanningBoardReservationService.registerSelectionChanged) {
				resourceReservationPlanningBoardReservationService.registerSelectionChanged(self.onPlanningBoardSelectionChanged);
			}

			if (resourceReservationDataService.registerSelectionChanged) {
				resourceReservationDataService.registerSelectionChanged(self.onListContainerSelectionChanged);
			}
		};

		this.stopWatching = function stopWatching() {
			if (resourceReservationPlanningBoardReservationService.unregisterSelectionChanged) {
				resourceReservationPlanningBoardReservationService.unregisterSelectionChanged(self.onPlanningBoardSelectionChanged);
			}

			if (resourceReservationDataService.unregisterSelectionChanged) {
				resourceReservationDataService.unregisterSelectionChanged(self.onListContainerSelectionChanged);
			}
		};
	}
})(angular);
