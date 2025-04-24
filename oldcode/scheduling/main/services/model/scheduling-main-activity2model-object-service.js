/**
 * Created by frank on 03.08.2016.
 */
(function (angular) {
	'use strict';

	var schedulingModule = angular.module('scheduling.main');
	/**
	 * @ngdoc service
	 * @name schedulingMainActivity2ModelObjectService
	 * @function
	 * @description
	 * schedulingMainActivity2ModelObjectService is the data service for model object related functionality of activities.
	 */
	schedulingModule.service('schedulingMainActivity2ModelObjectService', SchedulingMainActivity2ModelObjectService);
	
	SchedulingMainActivity2ModelObjectService.$inject = ['modelViewerViewerRegistryService', 'schedulingMainService',
		'modelViewerStandardFilterService'];

	function SchedulingMainActivity2ModelObjectService(modelViewerViewerRegistryService, schedulingMainService,
		modelViewerStandardFilterService) {
		var data = {
			openViewers: 0
		};
		
		this.activateViewerControlling = function activateViewerControlling() {
			modelViewerViewerRegistryService.onViewersChanged.register(handleNumberOfModelViewerChanged);
			var viewers = modelViewerViewerRegistryService.getViewers();
			data.openViewers = viewers.length;
			schedulingMainService.registerSelectedEntitiesChanged(onSelectedActivitiesChanged);
		};
		
		this.deActivateViewerControlling = function deActivateViewerControlling() {
			schedulingMainService.unregisterSelectedEntitiesChanged(onSelectedActivitiesChanged);
			modelViewerViewerRegistryService.onViewersChanged.unregister(handleNumberOfModelViewerChanged);
		};

		function handleNumberOfModelViewerChanged() {
			var viewers = modelViewerViewerRegistryService.getViewers();
			data.openViewers = viewers.length;
		}

		function onSelectedActivitiesChanged() {
			modelViewerStandardFilterService.updateMainEntityFilter();
		}
	}
})(angular);