/**
 * Created by tto on 8/20/2015.
 */

(function (angular, global) { /* global BMap */
	'use strict';

	angular.module('basics.common').factory('basicsCommonBaiduMap', [
		'PlatformMessenger',
		'$http',
		'$log',
		'$interval',
		'basicsCommonUtilities',
		'$q',
		'$',
		'_',
		function (PlatformMessenger, $http, $log, $interval, utils, $q, $, _) {

			/**
			 * Baidu map constructor.
			 * @param element
			 * @param options
			 * @constructor
			 */
			function BaiduMap(element, options) {
				this.element = element;
				this.map = null;
				this.geocoder = null;
				this.marker = null;
				this.options = options;
				this.onMapClick = new PlatformMessenger();
				this.clickHandle = null;
				this.init();
				this.markerList = [];
			}

			/**
			 * @description static variable, baidu map key value.
			 * @type {string}
			 */
			// BaiduMap.key = ''; // keep it for more readable
			BaiduMap.isApiLoading = false;

			BaiduMap.isApiLoaded = false;

			BaiduMap.onApiLoaded = new PlatformMessenger();
			BaiduMap.isApiLoadFailed = false;
			BaiduMap.onMapApiLoadFailed = new PlatformMessenger();

			// find address by lat-lon
			function geoLocation2address(lat, lon, objSelf) {
				const extractAddress = function (result) {
					const addressComponents = result.addressComponents || {}, // jshint ignore:line
						newAddressEntity = {
							AddressModified: true,
							Address: result.address // jshint ignore:line
						},

						info = {
							Street: ['street', 'streetNumber'],
							City: ['city'],
							County: ['province'],
							ZipCode: ['postalCode'], // no this info from baidu
							CountryCodeISO2: ['countryCodeISO2'] // no this info from baidu
						};

					_.map(info, function (val, key) {
						const addrInfo = [];
						_.map(val, function (property) {
							addrInfo.push(addressComponents[property] || '');
						});
						newAddressEntity[key] = _.uniq(addrInfo).join(' ');
					});

					// no thest two info from baidu
					newAddressEntity.ZipCode = '';
					newAddressEntity.CountryCodeISO2 = 'CN';

					return newAddressEntity;
				};

				objSelf.geocoder.getLocation(new BMap.Point(lon, lat), function (result) {
					result = result || {};
					let newAddress = null;
					if (result.address) {
						newAddress = extractAddress(result);
					} else {
						$log.log('Baidu Map geo error: No address found');
					}

					objSelf.onMapClick.fire({
						latitude: lat,
						longitude: lon,
						addressEntity: newAddress
					});
				});

			}

			// wait for the Baidu api to be loaded
			function waitForApiLoaded(times) {
				times = times ? times : 60;
				const interval = $interval(function () {
					checkForApiLoaded(interval);
				}, 500, times);
				interval.then(function () {
					if (BMap.version === undefined) {
						throw new Error('Baidu api could not be loaded.');
					}
				});
			}

			// check if Baidu api is loaded, then fire api
			function checkForApiLoaded(interval) {
				if (BMap.version !== undefined) {
					BaiduMap.isApiLoaded = true;
					BaiduMap.isApiLoading = false;
					BaiduMap.onApiLoaded.fire();
					$interval.cancel(interval);
				}
			}

			/**
			 * @description load Baidu map api.
			 */
			BaiduMap.loadScript = function () {
				if (global.BMap || BaiduMap.isApiLoaded) {
					BaiduMap.onApiLoaded.fire();
				} else if (!BaiduMap.isApiLoading) {
					// @mike:only v2.0 js api or above can support https. s=1 enable https.
					const url = 'https://api.map.baidu.com/api?v=2.0&s=1&ak=' + BaiduMap.key + '&callback=null';
					$.getScript(url).done(function () {
						waitForApiLoaded(60);
					}).fail(function () {
						BaiduMap.isApiLoading = false;
						BaiduMap.isApiLoadFailed = true;
						BaiduMap.onMapApiLoadFailed.fire();
					});
					BaiduMap.isApiLoading = true;
				} else if (BaiduMap.isApiLoadFailed) {
					BaiduMap.onMapApiLoadFailed.fire();
				}
			};

			BaiduMap.prototype.init = function () {
				const self = this,
					defaults = {
						zoom: 11,
						center: new BMap.Point(116.404, 39.915) // beijing
					},
					settings = $.extend({}, defaults, self.options.mapOptions);

				// map onclick handle function
				self.clickHandle = function (e) {
					geoLocation2address(e.point.lat, e.point.lng, self);
				};

				// baidu map instance
				self.map = new BMap.Map(self.element);

				self.map.centerAndZoom(settings.center, settings.zoom);

				self.map.addControl(new BMap.MapTypeControl());
				self.map.addControl(new BMap.NavigationControl());
				self.map.setCurrentCity('北京'); // mandatory
				self.map.enableScrollWheelZoom(true);

				// baidu geocoder
				self.geocoder = new BMap.Geocoder();

				// listen click event of map
				self.clickMapId = self.map.addEventListener('click', self.clickHandle);

				// callback when map is ready
				if (self.options && self.options.ready) {
					self.options.ready(self);
				}
			};

			/* jshint -W074 */ // this function's cyclomatic complexity is too high.
			BaiduMap.prototype.mark = function (markOptions) {
				const self = this;

				if (!utils.isLatLongValid(markOptions)) {
					return;
				}

				self.map.clearOverlays(); // clear old mark.

				const position = new BMap.Point(markOptions.longitude, markOptions.latitude);

				self.marker = new BMap.Marker(
					position,
					{title: markOptions.address}
				);
				self.map.addOverlay(self.marker);
				if (!markOptions.disableSetCenter) {
					self.map.setCenter(position);
				}
			};

			BaiduMap.prototype.clearMarker = function () {
				const self = this;
				self.map.clearOverlays();
				self.markerList = [];
			};

			BaiduMap.prototype.markMultiple = function (markItemList) {
				const self = this;

				function openPopup(position, item) {
					return function () {
						const opts = {
							// width: 250, // Information window width
							// height: 100, // Information window height
							title: item.address // Information window title
						};
						const infoWindow = new BMap.InfoWindow(item.formatter ? item.formatter(item) : item.address, opts);
						self.map.openInfoWindow(infoWindow, position);
					};
				}

				self.clearMarker();
				_.each(markItemList, function (markItem) {
					if (!utils.isLatLongValid(markItem)) {
						return;
					}
					const position = new BMap.Point(markItem.longitude, markItem.latitude);

					const marker = new BMap.Marker(
						position,
						{title: markItem.address}
					);
					marker.addEventListener('click', openPopup(position, markItem));
					self.markerList.push(marker);
					self.map.addOverlay(marker);
				});
				self.map.setViewport(self.getBounds(markItemList));
			};

			BaiduMap.prototype.showRoutes = function () {
				const defer = $q.defer();
				const data = [];
				defer.resolve(data);
				return defer.promise;
			};

			BaiduMap.prototype.calculateDistance = function () {
				const defer = $q.defer();
				const data = [];
				defer.resolve(data);
				return defer.promise;
			};

			BaiduMap.prototype.getBounds = function (markItemList) {
				const extremes = utils.getExtremes(markItemList);
				const point1 = new BMap.Point(extremes.minLong, extremes.maxLat);
				const point2 = new BMap.Point(extremes.maxLong, extremes.minLat);
				return [point1, point2];
			};

			BaiduMap.prototype.search = function (searchOptions) {
				const self = this,
					hasSuccessCallback = angular.isFunction(searchOptions.success),
					successCallback = function (location) {
						if (hasSuccessCallback) {
							searchOptions.success(location);
						}
					};

				self.geocoder.getPoint(
					searchOptions.address,
					function (point) {
						try {
							const location = {
								address: searchOptions.address, // jshint ignore:line
								latitude: point.lat,
								longitude: point.lng
							};
							self.mark(location);
							successCallback(location);
						} catch (e) {
							self.map.clearOverlays(); // clear old mark.
							successCallback(null); // clear old latitude and longitude.
							$log.log('Address not found!', e);
						}
					},
					searchOptions.entity.City // the city which the address is belonged to
				);
			};

			BaiduMap.prototype.destroy = function () {
				const self = this;
				self.map.removeEventListener('click', self.clickHandle);
			};

			return BaiduMap;
		}
	]);

})(angular, window);