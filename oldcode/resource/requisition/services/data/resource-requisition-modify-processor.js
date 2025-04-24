(function (angular) {
	/* global globals */
	'use strict';
	angular.module('resource.requisition').factory('resourceRequisitionModifyProcessor', ['$http', 'moment', 'platformRuntimeDataService', 'platformColorService', function ($http, moment, platformRuntimeDataService, platformColorService) {

		var asRequired;
		var smallDelay;
		var delayOverThreshold;
		var noReservationDone;

		var service = {};
		var url = globals.webApiBaseUrl + 'basics/customize/resrequisitionresdate/list';

		$http.post(url).then(function (result) {
			if (result.data !== undefined) {
				asRequired = result.data[0];
				smallDelay = result.data[1];
				delayOverThreshold = result.data[2];
				noReservationDone = result.data[3];

				service.processItem = function processItem(item) {

					if (item.ReservedFrom !== null && item.ReservedTo !== null) {
						var durationReservedFrom = moment.duration(item.RequestedFrom.diff(item.ReservedFrom));
						var daysReservedFrom = durationReservedFrom.asDays();
						var color = null;

						if (daysReservedFrom >= 0 && daysReservedFrom <= asRequired.Delaylessthan && asRequired.Isreserved === true) {
							platformRuntimeDataService.colorInfo(item, 'ReservedFrom', null);
						}

						if (daysReservedFrom > asRequired.Delaylessthan && daysReservedFrom <= smallDelay.Delaylessthan && smallDelay.Isreserved === true) {
							color = smallDelay.Backgroundcolor.toString(16);
							platformRuntimeDataService.colorInfo(item, 'ReservedFrom', 'bg-' + platformColorService.nearestColor('#' + color).css); //'bg-yellow-4'
						}

						if (daysReservedFrom > smallDelay.Delaylessthan && daysReservedFrom <= delayOverThreshold.Delaylessthan && delayOverThreshold.Isreserved === true) {
							color = delayOverThreshold.Backgroundcolor.toString(16);
							platformRuntimeDataService.colorInfo(item, 'ReservedFrom', 'bg-' + platformColorService.nearestColor('#' + color).css); //'bg-orange-4'
						}

						if (daysReservedFrom > delayOverThreshold.Delaylessthan && noReservationDone.Isreserved === false) {
							color = noReservationDone.Backgroundcolor.toString(16);
							platformRuntimeDataService.colorInfo(item, 'ReservedFrom', 'bg-' + platformColorService.nearestColor('#' + color).css); //'bg-red-4'
						}

						var durationReservedTo = moment.duration(item.RequestedTo.diff(item.ReservedTo));
						var daysReservedTo = durationReservedTo.asDays();

						if (daysReservedTo >= 0 && daysReservedTo <= asRequired.Delaylessthan && asRequired.Isreserved === true) {
							platformRuntimeDataService.colorInfo(item, 'ReservedTo', null);
						}

						if (daysReservedTo > asRequired.Delaylessthan && daysReservedTo <= smallDelay.Delaylessthan && smallDelay.Isreserved === true) {
							color = smallDelay.Backgroundcolor.toString(16);
							platformRuntimeDataService.colorInfo(item, 'ReservedTo', 'bg-' + platformColorService.nearestColor('#' + color).css); // 'bg-yellow-4'
						}

						if (daysReservedTo > smallDelay.Delaylessthan && daysReservedTo <= delayOverThreshold.Delaylessthan && delayOverThreshold.Isreserved === true) {
							color = delayOverThreshold.Backgroundcolor.toString(16);
							platformRuntimeDataService.colorInfo(item, 'ReservedTo', 'bg-' + platformColorService.nearestColor('#' + color).css); // 'bg-orange-4'
						}

						if (daysReservedTo > delayOverThreshold.Delaylessthan && noReservationDone.Isreserved === false) {
							color = noReservationDone.Backgroundcolor.toString(16);
							platformRuntimeDataService.colorInfo(item, 'ReservedTo', 'bg-' + platformColorService.nearestColor('#' + color).css); // 'bg-red-4'
						}
					}
				};
			}
		},
		function (/*error*/) {
			return true;
		});

		return service;
	}]);
})(angular);
