/**
 * Created by wui on 4/8/2015.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonMapReadonlyHandler', [
		'_',
		'math',
		function (
			_,
			math) {

			return {
				restrict: 'A',
				scope: false,
				controller: controller
			};

			/* jshint -W040 */ // possible strict violation
			function controller() {
				const coordinate_precision = 10;

				this.handlerName = 'basicsCommonMapReadonlyHandler';

				this.mapOptions = {
					showScalebar: false,
					customizeOverlays: false,
					showBreadcrumb: false,
					showDashboard: false
				};

				this.initialize = angular.noop;

				/**
				 * @description do initialization after map instance is ready.
				 * @param mapScope it is scope of 'platformBingMap' directive
				 * @param map map instance.
				 */
				this.onMapApiReady = function (mapScope, map) {
					var markMap = function (addressItem) {
						if (addressItem && addressItem.Latitude !== null && addressItem.Longitude !== null) {
							map.mark({
								latitude: addressItem.Latitude,
								longitude: addressItem.Longitude,
								address: addressItem.Address
							});
						} else if (addressItem && addressItem.Address !== null) {
							map.search({
								address: addressItem.Address,
								entity: mapScope.entity,
								success: function (location) {
									if (location) {
										mapScope.entity.Latitude = math.round(location.latitude, coordinate_precision);
										mapScope.entity.Longitude = math.round(location.longitude, coordinate_precision);
									} else {
										map.mark(); // clear mark.
										mapScope.entity.Latitude = 0;
										mapScope.entity.Longitude = 0;
									}

								},
								error: function () {
									map.mark(); // clear mark.
								}
							});
						} else {
							map.mark(); // clear mark.
						}
					};

					function checkForMultipleEntities(entity) {
						if (mapScope.showRoutes === true || mapScope.calculateDist === true) {
							return;
						}
						if (angular.isArray(mapScope.entity)) {
							if (_.isEmpty(entity)) {
								map.clearMarker();
							} else {
								let invalidLocations = entity.filter(addressItem => addressItem.latitude === null || addressItem.longitute === null);
								if (invalidLocations.length > 0) {
									let addressCount = invalidLocations.length;
									invalidLocations.forEach(address => {
										// map.search returns undefined -> needed to find solution without working with promises
										map.search({
											searchOnly: true,
											address: address.addressLine || address.addressline,
											entity: address,
											success: function (location) {
												if (location) {
													address.latitude = math.round(location.latitude, coordinate_precision);
													address.longitude = math.round(location.longitude, coordinate_precision);
												}
												addressCount--;
												if (addressCount === 0) {
													map.markMultiple(entity);
												}
											},
											error: function () {
												addressCount--;
												if (addressCount === 0) {
													map.markMultiple(entity);
												}
											}
										});
									});
								} else {
									map.markMultiple(entity);
								}
							}
						} else {
							markMap(mapScope.entity);
						}
					}

					checkForMultipleEntities(mapScope.entity);
					mapScope.$watch('entity', function (newValue, oldValue) {
						if (newValue && newValue !== oldValue && !map.waypointDragging) {
							checkForMultipleEntities(mapScope.entity);
						}
						if (map.waypointDragging) {
							map.waypointDragging = false;
						}
					}, true);

					mapScope.$watch('showRoutes', function () {
						if (mapScope.showRoutes === true) {
							mapScope.$emit('hadShowRoutes', mapScope.showRoutes);
							map.showRoutes(mapScope.entity);
						}
					}, true);

					mapScope.$watch('calculateDist', function () {
						if (mapScope.calculateDist === true) {
							mapScope.$emit('hadCalculate', mapScope.calculateDist);
							map.calculateDistance(mapScope.entity).then(function (data) {
								mapScope.distanceData = data;
								mapScope.$emit('finishCal', mapScope.distanceData);
							});
						}
					});

					mapScope.$on('selectPin', function (event, filterObject, waypoint) {
						if (map.selectPin) {
							map.selectPin(filterObject, waypoint);
						} else {
							console.warn('Map provider does not support programmatic pin selection!');
						}
					});

					mapScope.$on('mapSnapshot', function (eventScope, jobId) {
						if (_.isFunction(map.getMapSnapshotURL)) {
							const parentContainerUUID = $('.cid_' + mapScope.$parent.$parent.getContainerUUID());
							const mapContainerDimensions = {
								width: Math.floor(parentContainerUUID.width()),
								height: Math.floor(parentContainerUUID.height())
							};
							const mapSnapshotURL = map.getMapSnapshotURL(map, mapContainerDimensions);
							let result = {
								url: mapSnapshotURL,
								jobId: jobId
							};
							mapScope.$emit('finishMapSnapshot', result);
						}
					});

					mapScope.$on('$destroy', function () {
						map.destroy();
					});

				};

			}

		}
	]);

})(angular);