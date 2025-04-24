/**
 * Created by las on 11/26/2018.
 */

(function () {
	'use strict';
	/* global angular, Microsoft */
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);

	transportModule.factory('transportplanningTransportCalculationDistanceWithoutMapService', trsCalculationDistanceWithoutMapService);
	trsCalculationDistanceWithoutMapService.$inject = ['$', '$q', 'platformContextService',
		'basicsCommonMapKeyService',
		'basicsCommonGoogleMap',
		'basicsCommonOpenStreetMap',
		'basicsCommonBaiduMap',
		'basicsCommonBingMapV8',
		'platformModalService'];

	function trsCalculationDistanceWithoutMapService($, $q, platformContextService,
													 basicsCommonMapKeyService,
													 basicsCommonGoogleMap,
													 basicsCommonOpenStreetMap,
													 basicsCommonBaiduMap,
													 basicsCommonBingMapV8,
													 platformModalService) {

		var service = {};
		var dataProvider = null;
		var directionsService = null;

		function init() {
			basicsCommonMapKeyService.getMapOptions().then(function (data) {
				dataProvider = data.Provider;
				var culture = platformContextService.getCulture();
				switch (data.Provider) {
					case 'bingv8': {
						basicsCommonBingMapV8.key = data.BingKey;
						var BingMapV8ApiUrl = 'https://cn.bing.com/api/maps/mapcontrol';
						$.getScript(BingMapV8ApiUrl + '?mkt=' + culture + '&key=' + data.BingKey).done(function () {
							Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
								directionsService = new Microsoft.Maps.Directions.DirectionsManager(null);
								directionsService.setRequestOptions({
									routeMode: Microsoft.Maps.Directions.RouteMode.driving,
									distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
									routeDraggable: false
								});
							});
						});
					}
						break;
					case 'google': {
						basicsCommonGoogleMap.key = data.GoogleKey;

					}
						break;
					case 'openstreet': { // jshint ignore:line

					}
						break;
					case 'baidu': {
						basicsCommonBaiduMap.key = data.BaiduKey;

					}
						break;
				}


			});
		}

		function recalculateDistance(wayPoints) {
			var defer = $q.defer();
			switch (dataProvider) {
				case 'bingv8': {

					var data = {unitInfo: 'km', distances: []};

					_.each(wayPoints, function (wayPoint) {
						var wayPnt = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(wayPoint.latitude, wayPoint.longitude)});
						directionsService.addWaypoint(wayPnt);
					});

					Microsoft.Maps.Events.addHandler(directionsService, 'directionsUpdated', function (directionsEventArgs) {
						var legs = directionsEventArgs.route[0].routeLegs;
						_.each(legs, function (leg) {
							data.distances.push(leg.summary.distance);
						});
						defer.resolve(data);
					});

					Microsoft.Maps.Events.addHandler(directionsService, 'directionsError', function (directionsErrorEventArgs) {
						platformModalService.showErrorBox(directionsErrorEventArgs.message, 'Details error');
						//window.alert(directionsErrorEventArgs.message);
					});

					directionsService.calculateDirections();
				}
					break;
			}
			return defer.promise;
		}

		service.init = init;
		service.recalculateDistance = recalculateDistance;
		return service;
	}

})();