/**
 * Created by zwz on 2022/5/20.
 */

(function (angular) {
	/* global moment, _ */
	'use strict';
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointPlannedtimeDateshiftService
	 * @function
	 * @description
	 * transportplanningTransportWaypointPlannedtimeDateshiftService provides functionality for shifting waypoints' PlannedTime when route's PlannedDelivery(destinationWaypoint's PlannedTime) is changed
	 */
	transportModule.service('transportplanningTransportWaypointPlannedtimeDateshiftService', Service);
	Service.$inject = ['$injector', 'platformRuntimeDataService'];

	function Service($injector, platformRuntimeDataService) {

		function setPlannedFinishByPlannedTime(wp, diffTime){
			if (!_.isNil(wp.PlannedFinish)) {
				if (_.isString(wp.PlannedFinish)) {
					wp.PlannedFinish = moment(wp.PlannedFinish);
				}
				wp.PlannedFinish.add(diffTime, 'seconds');
				var result = $injector.get('transportplanningTransportWaypointValidationService').validatePlannedFinish(wp, wp.PlannedFinish, 'PlannedFinish');
				platformRuntimeDataService.applyValidationResult(result, wp, 'PlannedFinish');
			}
		}

		function setAdjacentWaypoints(wps, dstWp, waypointServ, diffTime) {
			_.each(wps, function (item) {
				if (item.Id !== dstWp.Id) {
					if (!_.isNil(item.PlannedTime)) {
						if (_.isString(item.PlannedTime)) {
							item.PlannedTime = moment(item.PlannedTime);
						}
						item.PlannedTime = _.cloneDeep(item.PlannedTime).add(diffTime, 'seconds');
					}
					// set waypoint's PlannedFinish
					setPlannedFinishByPlannedTime(item, diffTime);

					waypointServ.markItemAsModified(item);
				}
			});
		}

		this.shiftTime = function (wpList, dstWp, dstWpOrginalPlannedTime, waypointServ) {
			if (dstWpOrginalPlannedTime) {
				if (_.isString(dstWpOrginalPlannedTime)) {
					dstWpOrginalPlannedTime = moment(dstWpOrginalPlannedTime);
				}
				var diffTime = dstWp.PlannedTime.diff(dstWpOrginalPlannedTime, 'seconds');

				setPlannedFinishByPlannedTime(dstWp, diffTime); // set destination waypoint's PlannedFinish

				let wpsBefore = _.filter(wpList, function (e) {
					return e.Sorting <= dstWp.Sorting && e.Id !== dstWp.Id;
				})
					.sort(function (a, b) {
						return parseFloat(b.Sorting) - parseFloat(a.Sorting);
					});
				setAdjacentWaypoints(wpsBefore, dstWp, waypointServ, diffTime);

				let wpsAfter = _.filter(wpList, function (e) {
					return e.Sorting > dstWp.Sorting;
				})
					.sort(function (a, b) {
						return parseFloat(a.Sorting) - parseFloat(b.Sorting);
					});
				setAdjacentWaypoints(wpsAfter, dstWp, waypointServ, diffTime);
			}
		};

	}
})(angular);