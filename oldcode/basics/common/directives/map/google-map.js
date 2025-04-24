/**
 * Created by wui on 6/10/2015.
 */

(function (angular, global) { /* global google */
	'use strict';

	angular.module('basics.common').factory('basicsCommonGoogleMap', [
		'PlatformMessenger',
		'$timeout',
		'$log',
		'$translate',
		'basicsCommonUtilities',
		'$q',
		'_',
		'$',
		function (PlatformMessenger, $timeout, $log, $translate, utils, $q, _, $) {

			/**
			 * Google map constructor.
			 * @param element
			 * @param options
			 * @constructor
			 */
			function GoogleMap(element, options) {
				this.element = element;
				this.map = null;
				this.geocoder = null;
				this.marker = null;
				this.infoWindow = null;
				this.directionsService = null;
				this.directionsDisplay = null;
				this.options = options;
				this.onMapClick = new PlatformMessenger();
				this.init();
				this.markerList = [];
			}

			function extractAddress(result, addressModified, joinMultiValues) {
				const addressComponents = result.address_components || [], // jshint ignore:line
					newAddressEntity = {
						AddressModified: addressModified,
						Address: result.formatted_address // jshint ignore:line
					},

					info = {
						Street: ['route', 'street_number'],
						City: 'locality',
						County: 'administrative_area_level_3|administrative_area_level_2|administrative_area_level_1',
						State: 'administrative_area_level_1',
						ZipCode: 'postal_code',
						CountryCodeISO2: 'country'
					};

				_.map(info, function (val, key) {
					const fields = _.isArray(val) ? val : val.split('|');
					let component = _.filter(addressComponents, function (item) {
						return _.includes(fields, item.types[0]);
					});
					let property;

					if (key === 'CountryCodeISO2') {
						property = 'short_name'; // use short name for the iso2 code
					} else {
						property = 'long_name';
					}

					if (joinMultiValues && _.isArray(val)) {
						const finalVal = _.map(component, property).filter(v => !_.isNil(v)).join(' ');
						newAddressEntity[key] = finalVal || '';
					} else {
						const finalVal = _.map(component, property).find(v => !_.isNil(v));
						newAddressEntity[key] = finalVal || '';
					}
				});

				return newAddressEntity;
			}

			// find address by lat-lon
			function geoLocation2address(lat, lon, objSelf) {
				objSelf.geocoder.geocode(
					{location: new google.maps.LatLng(lat, lon)},
					function (results, status) {
						let newAddress = null;
						if (status === google.maps.GeocoderStatus.OK) {
							if (results[0]) {
								newAddress = extractAddress(results[0], true, true);
							} else {
								$log.log('Google geo error: No address found');
							}
						} else {
							$log.log('Google geo error: ', status);
						}

						objSelf.onMapClick.fire({
							latitude: lat,
							longitude: lon,
							addressEntity: newAddress
						});
					}
				);
			}

			/**
			 * @description static variable, bing map key value.
			 * @type {string}
			 */
			GoogleMap.key = '';

			GoogleMap.isApiLoading = false;

			GoogleMap.isApiLoaded = false;

			GoogleMap.onApiLoaded = new PlatformMessenger();

			GoogleMap.isApiLoadFailed = false;
			GoogleMap.onMapApiLoadFailed = new PlatformMessenger();

			// show message if address not found on the map
			function addressNotFound(objSelf) {
				const latlng = new google.maps.LatLng(0, 0),
					zoom = 2;
				objSelf.map.setCenter(latlng);
				objSelf.map.setZoom(zoom);
				// show a message popup
				if (!objSelf.infoWindow) {
					objSelf.infoWindow = new google.maps.InfoWindow();
				}
				objSelf.infoWindow.setContent($translate.instant('basics.common.map.addressNotFound'));
				objSelf.infoWindow.setPosition(latlng);
				objSelf.infoWindow.open(objSelf.map);
			}

			/**
			 * @description load google map api.
			 */
			GoogleMap.loadScript = function (options) {
				if ((global.google && google.maps && google.maps.Map) || GoogleMap.isApiLoaded) {
					GoogleMap.onApiLoaded.fire();
				} else if (!GoogleMap.isApiLoading) {
					const script = document.createElement('script');
					script.type = 'text/javascript';
					script.onerror = function () {
						GoogleMap.isApiLoading = false;
						GoogleMap.isApiLoadFailed = true;
						GoogleMap.onMapApiLoadFailed.fire();
					};
					script.src = '//maps.googleapis.com/maps/api/js?key=' + GoogleMap.key + '&language=' + options.culture + '&callback=gmapLoaded';
					document.body.appendChild(script);
					window.gmapLoaded = function () {
						delete window.gmapLoaded;
						$timeout(function () {
							GoogleMap.isApiLoaded = true;
							GoogleMap.isApiLoading = false;
							GoogleMap.onApiLoaded.fire();
						}, 1000); // wait for api available
					};
					GoogleMap.isApiLoading = true;
				} else if (GoogleMap.isApiLoadFailed) {
					GoogleMap.onMapApiLoadFailed.fire();
				}
			};

			GoogleMap.prototype.init = function () {
				const self = this,
					latLng = new google.maps.LatLng(0, 0),
					defaults = {
						zoom: 16,
						center: latLng,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					},
					settings = $.extend({}, defaults, self.options.mapOptions);

				// google map instance
				self.map = new google.maps.Map(self.element, settings);
				// google geocoder
				self.geocoder = new google.maps.Geocoder();
				//
				self.directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
				self.directionsService = new google.maps.DirectionsService();
				self.directionsDisplay.setMap(self.map);

				// listen click event of map
				self.clickMapId = google.maps.event.addListener(self.map, 'click', function (e) {
					/* self.onMapClick.fire({
					 latitude: e.latLng.lat(),
					 longitude: e.latLng.lng()
					 }); */
					geoLocation2address(e.latLng.lat(), e.latLng.lng(), self);
				});
				// callback when map is ready
				if (self.options && self.options.ready) {
					self.options.ready(self);
				}
			};

			/* jshint -W074 */ // this function's cyclomatic complexity is too high.
			GoogleMap.prototype.mark = function (markOptions) {
				let self = this, invalidLocation = false;

				// judge latitude and longitude value are valid or not.
				if (markOptions && markOptions.latitude && markOptions.longitude) {
					invalidLocation = markOptions.latitude > 90 || markOptions.latitude < -90 ||
						markOptions.longitude > 180 || markOptions.longitude < -180;
				}

				if (!markOptions || invalidLocation) { // clear mark.
					if (self.marker) {
						self.marker.setMap(null);
					}
					if (self.infoWindow) {
						self.infoWindow.close(self.map, self.marker);
					}
					if (self.map) {
						self.map.setCenter(new google.maps.LatLng(0, 0));
					}
					return;
				}

				// clear the previous info window if there is any
				if (self.infoWindow) {
					self.infoWindow.close();
				}

				const position = new google.maps.LatLng(markOptions.latitude, markOptions.longitude);

				if (!self.marker || !self.infoWindow) {
					self.marker = new google.maps.Marker({
						map: self.map,
						title: markOptions.address,
						draggable: true
					});
					self.infoWindow = new google.maps.InfoWindow();
					google.maps.event.addListener(self.marker, 'click', function () {
						self.infoWindow.open(self.map, self.marker);
					});
				}

				if (!markOptions.disableSetCenter) {
					self.map.setCenter(position);
				}

				self.map.setOptions({draggableCursor: 'inherit'});
				self.marker.setPosition(position);
				self.marker.setTitle(markOptions.address);
				self.marker.setMap(self.map);
				self.infoWindow.setContent(markOptions.address);
			};

			function createBound(markItemList) {

				const extremeValues = utils.getExtremes(markItemList);
				return new google.maps.LatLngBounds(
					new google.maps.LatLng(extremeValues.maxLat, extremeValues.minLong),
					new google.maps.LatLng(extremeValues.minLat, extremeValues.maxLong)
				);
			}

			GoogleMap.prototype.clearMarker = function clearMarker() {
				const self = this;
				_.each(self.markerList, function (markItem) {
					markItem.setMap(null);
				});
				self.markerList = [];
			};

			GoogleMap.prototype.markMultiple = function (markItemList) {
				const self = this;
				const pinSelectedImage = 'cloud.style/content/images/control-icons.svg#ico-pushpin-google';
				self.clearMarker();
				self.selectedPin = null;
				self.selectedPinInfo = null;
				self.selectedCenter = null;
				_.each(markItemList, function (markItem) {

					if (!utils.isLatLongValid(markItem)) {
						return;
					}

					const position = new google.maps.LatLng(markItem.latitude, markItem.longitude);

					const content = markItem.formatter ? markItem.formatter(markItem) : markItem.address;
					let marker = new google.maps.Marker({
						map: self.map,
						title: markItem.address,
						draggable: true
					});

					const infoWindow = new google.maps.InfoWindow();

					if (markItem.isSelected) {
						const icon = {
							url: pinSelectedImage,
							scaledSize: new google.maps.Size(40, 40)
						};
						marker = new google.maps.Marker({
							map: self.map,
							title: markItem.address,
							icon: icon,
							draggable: true
						});
						self.selectedPin = marker;
						self.selectedPinInfo = infoWindow;
						self.selectedCenter = position;
					}

					marker.setPosition(position);
					marker.setMap(self.map);
					self.markerList.push(marker);

					google.maps.event.addListener(marker, 'click', function () {
						infoWindow.open(self.map, marker);
					});

					self.map.setOptions({draggableCursor: 'inherit'});
					infoWindow.setContent(content);
					infoWindow.setPosition(position);
					marker.setTitle(markItem.address);

				});

				if (self.selectedPin && self.selectedPinInfo) {
					$timeout(function () {
						if (self.selectedPinInfo) {
							self.selectedPinInfo.open(self.map, self.selectedPin);
						}
					}, 1000);
				}

				self.map.fitBounds(createBound(markItemList));
			};

			GoogleMap.prototype.showRoutes = function (wayPoints) {
				const self = this;
				const data = {unitInfo: 'm', distances: []};
				const defer = $q.defer();

				if (wayPoints.length < 2) {
					return;
				}

				let start;
				let end;
				let waypoint = wayPoints[0];
				if (angular.isDefined(waypoint.latitude) && angular.isDefined(waypoint.longitude) && utils.isLatLongValid(waypoint)) {
					start = new google.maps.LatLng(waypoint.latitude, waypoint.longitude);
				} else if (angular.isDefined(waypoint.addressline)) {
					start = waypoint.addressline;
				} else {
					start = waypoint.address;
				}
				waypoint = wayPoints[wayPoints.length - 1];
				if (angular.isDefined(waypoint.latitude) && angular.isDefined(waypoint.longitude) && utils.isLatLongValid(waypoint)) {
					end = new google.maps.LatLng(waypoint.latitude, waypoint.longitude);
				} else if (angular.isDefined(waypoint.addressline)) {
					end = waypoint.addressline;
				} else {
					end = waypoint.address;
				}
				const wps = [];
				for (let i = 1; i < wayPoints.length - 1; ++i) {
					waypoint = wayPoints[i];
					if (angular.isDefined(waypoint.latitude) && angular.isDefined(waypoint.longitude) && utils.isLatLongValid(waypoint)) {
						wps.push({location: new google.maps.LatLng(waypoint.latitude, waypoint.longitude)});
					} else if (angular.isDefined(waypoint.addressline)) {
						wps.push({location: waypoint.addressline});
					} else {
						wps.push({location: waypoint.address});
					}
				}

				self.directionsService.route({
					origin: start,
					destination: end,
					waypoints: wps,
					travelMode: 'DRIVING'
				}, function (response, status) {
					if (status === 'OK') {
						self.directionsDisplay.setDirections(response);
						const legs = response.routes[0].legs;
						_.each(legs, function (leg) {
							data.distances.push(leg.distance.value);
						});
						defer.resolve(data);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				});
				return defer.promise;
			};

			GoogleMap.prototype.calculateDistance = function (wayPoints) {
				const self = this;
				return self.showRoutes(wayPoints);
			};

			GoogleMap.prototype.search = function (searchOptions) {
				const self = this,
					hasSuccessCallback = angular.isFunction(searchOptions.success),
					successCallback = function (location) {
						if (hasSuccessCallback) {
							searchOptions.success(location);
						}
					};

				self.geocoder.geocode({
					address: searchOptions.address
				}, function (results, status) { /* jshint -W106 */
					if (status === google.maps.GeocoderStatus.OK) {
						const result = results[0],
							location = {
								address: result.formatted_address, // jshint ignore:line
								latitude: result.geometry.location.lat(),
								longitude: result.geometry.location.lng(),
								addressEntity: extractAddress(result, false, false)
							};
						if (!searchOptions.searchOnly) {
							self.mark(location);
						}
						successCallback(location);
					} else {
						if (!searchOptions.searchOnly) {
							self.mark(null); // clear old mark.
							addressNotFound(self);
							$log.log('Geocode was not successful for the following reason: ' + status);
						}
						successCallback(null); // clear old latitude and longitude.
					}
				});
			};

			GoogleMap.prototype.getMapSnapshotURL = (map, mapDimensions) => {
				if (map.directionsDisplay.directions && map.directionsDisplay.directions.geocoded_waypoints.length > 1) {
					return getMapSnapshotURLForRoute(map, mapDimensions);
				} else {
					return getMapSnapshotURLForPinpoint(map, mapDimensions);
				}
			};

			function getMapSnapshotURLForRoute(map, mapDimensions) {
				let httpString = '';
				const mapData = map.map.data.map;
				const polyline = map.directionsDisplay.directions.routes[0].overview_polyline;
				const zoom = map.directionsDisplay.map.zoom;

				httpString = 'https://maps.googleapis.com/maps/api/staticmap?sensor=false&size=' + mapDimensions.width + 'x' + mapDimensions.height // map dimensions must be a square
					+ '&center='
					+ mapData.center.lat() + ',' + mapData.center.lng()
					+ '&markers=size:mid%7Ccolor:red%7C';
				httpString += map.directionsDisplay.directions.routes[0].legs[0].start_location.lat() + ',' + map.directionsDisplay.directions.routes[0].legs[0].start_location.lng() + '|';
				map.directionsDisplay.directions.routes[0].legs.forEach((leg) => {
					httpString += leg.end_location.lat() + ',' + leg.end_location.lng() + '|';
				});
				httpString = httpString.substr(0, httpString.length - 1);

				httpString += '&zoom=' + zoom + '&path=weight:6%7Ccolor:blue%7Cenc:' + polyline + '&key=' + GoogleMap.key;

				if(_.isString(map?.map?.mapTypeId) && map?.map?.mapTypeId.length > 0){
					httpString += '&maptype=' + map?.map?.mapTypeId;
				}

				return httpString;
			}

			function getMapSnapshotURLForPinpoint(map, mapDimensions) {
				let httpString = '';
				const mapData = map.map.data.map;
				const zoom = map.directionsDisplay.map.zoom;

				httpString = 'https://maps.googleapis.com/maps/api/staticmap?sensor=false&size=' + mapDimensions.width + 'x' + mapDimensions.height // map dimensions must be a square
					+ '&center='
					+ mapData.center.lat() + ',' + mapData.center.lng()
					+ '&markers=size:mid%7Ccolor:red%7C';

				httpString += map.selectedPin.position.lat() + ',' + map.selectedPin.position.lng();

				httpString += '&zoom=' + zoom + '&key=' + GoogleMap.key;

				if(_.isString(map?.map?.mapTypeId) && map?.map?.mapTypeId.length > 0){
					httpString += '&maptype=' + map?.map?.mapTypeId;
				}

				return httpString;
			}

			GoogleMap.prototype.destroy = function () {
				google.maps.event.removeListener(this.clickMapId);
			};

			return GoogleMap;
		}
	]);

})(angular, window);