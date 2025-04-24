/**
 * Created by zwz on 11/30/2020.
 */
/* global angular*/
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.requisition';
	/**
	 * @ngdoc service
	 * @name transportplanningRequisitionMainServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningRequisitionMainServiceEntityPropertychangedExtension provides entity property-changed functionality for transport requisition data service
	 *
	 */
	angular.module(moduleName).factory('transportplanningRequisitionMainServiceEntityPropertychangedExtension', EntityPropertychangedExtension);

	EntityPropertychangedExtension.$inject = ['PlatformMessenger', 'moment'];

	function EntityPropertychangedExtension(PlatformMessenger, moment) {
		var service = {};


		service.addMethods = function addMethods(dataService) {
			// add method `onEntityPropertyChanged`
			dataService.onEntityPropertyChanged = function onEntityPropertyChanged(entity, field) {
				service.onPropertyChanged(entity, field, dataService);
			};

			// add method `registerProjectFkChanged` and `unregisterProjectFkChanged`
			// at the moment, `registerProjectFkChanged` and `unregisterProjectFkChanged` are only referenced in transportplanningBundleSubviewController
			dataService.projectFkChanged = new PlatformMessenger();
			dataService.registerProjectFkChanged = function registerProjectFkChanged(fn) {
				dataService.projectFkChanged.register(fn);
			};
			dataService.unregisterProjectFkChanged = function unregisterProjectFkChanged(fn) {
				dataService.projectFkChanged.unregister(fn);
			};
		};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onProjectFkChanged = function (entity, field, dataService) {
			dataService.projectFkChanged.fire(entity);
		};

		//deactivated since it does not conform to dateshiftConventions.
		/*service.onPlannedTimeChanged = function (entity, field, dataService) {
			var diff = entity.PlannedTime.diff(entity.PlannedStart, 'seconds');
			entity.PlannedStart = moment(entity.PlannedStart.add(diff, 'seconds'));
			entity.PlannedFinish = moment(entity.PlannedFinish.add(diff, 'seconds'));
			entity.EarliestStart = moment(entity.EarliestStart.add(diff, 'seconds'));
			entity.LatestStart = moment(entity.LatestStart.add(diff, 'seconds'));
			entity.EarliestFinish = moment(entity.EarliestFinish.add(diff, 'seconds'));
			entity.LatestFinish = moment(entity.LatestFinish.add(diff, 'seconds'));
			entity.PlannedTimeDay = moment(entity.PlannedTimeDay.add(diff, 'seconds'));
			dataService.markItemAsModified(entity);
		};*/
		return service;
	}
})(angular);