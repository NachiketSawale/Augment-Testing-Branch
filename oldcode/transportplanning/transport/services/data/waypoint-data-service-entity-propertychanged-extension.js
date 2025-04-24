/**
 * Created by zwz on 12/10/2018.
 */
(function (angular) {
	'use strict';
	/* global angular, _*/
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointDataServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportWaypointDataServiceEntityPropertychangedExtension provides entity property-changed functionality for waypoint data service
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportWaypointDataServiceEntityPropertychangedExtension', service);

	service.$inject = ['transportplanningTransportWaypointDefaultSrcDstService'];

	function service(defaultSrcDstService) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onDistanceChanged = service.onActualDistanceChanged = service.onExpensesChanged = function (entity, field, dataService) {
			dataService.parentService().updateSumInfo(field);
		};

		service.onLgmJobFkChanged = function (entity, field, dataService) {
			dataService.updateJobRelatedProperties(entity, entity.selectedJobDef, true);//remark:selectedJobDef is set in the onSelectedItemChanged event of jobFK lookup.
			dataService.calculateDistance(field);

		};

		service.onPlannedTimeChanged = function (entity, field, dataService) {
			//When a waypoint's PlannedTime is changed, we need to calculate Distance.Because at the moment waypoints are sorted by Planned Time, and the order of a waypoint is related to calculation of a waypoint's distance.
			dataService.calculateDistance(field);
			//When a waypoint's PlannedTime is changed,check if the route's PlannedDelivery need to be updated.
			dataService.parentService().updateRouteDeliveryFieldByWaypoint(entity, field);
		};

		service.onActualTimeChanged = function (entity, field, dataService) {
			//When a waypoint's ActualTime is changed,check if the route's ActualDelivery need to be updated.
			dataService.parentService().updateRouteDeliveryFieldByWaypoint(entity, field);
		};

		service.onIsDefaultSrcChanged = service.onIsDefaultDstChanged = function (entity, field, dataService) {
			if (entity[field] === true) {
				_.each(dataService.getList(), function (item) {
					if (item.Id !== entity.Id && item[field] === true) {
						item[field] = false;
						defaultSrcDstService.updateSrcDst(item);
						dataService.markItemAsModified(item);
					}
				});
			}
			defaultSrcDstService.updateSrcDst(entity);
			dataService.gridRefresh();
			if (field === 'IsDefaultDst') {
				dataService.parentService().updateRouteDeliveryFieldsByWaypoint();
			}
		};

		return service;
	}
})(angular);