/**
 * Created by wui/tto on 8/20/2015.
 * use leafletjs
 */

(function (angular, global) { /* global L */
	'use strict';

	angular.module('basics.common').factory('basicsCommonOpenStreetMap', [
		'PlatformMessenger',
		'$translate',
		'$timeout',
		'basicsCommonUtilities',
		'basicsCommonMapKeyService',
		'_',
		'$q',
		'$',
		function (PlatformMessenger, $translate, $timeout, utils, basicsCommonMapKeyService, _, $q, $) {
			// var leafletjsUrlBase  = '//cdnjs.leafletjs.com/leaflet-0.7.5/',
			var leafletjsUrlBase = '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.5/',
				// var leafletjsUrlBase  = '//unpkg.com/leaflet@1.0.2/dist/',
				address2LatLngUrl = '//nominatim.openstreetmap.org/search', // from address to lat lng
				addressReverseUrl = '//nominatim.openstreetmap.org/reverse'; // from lat,lng to address

			// for internal test
			// leafletjsUrlBase = '//localhost/iTWO.Cloud/V1/Test/';
			// addressReverseUrl =  'https://localhost/iTWO.Cloud/V1/Test/address.aspx';

			let loadOptions = null;

			/**
			 * OpenStreet map constructor.
			 * @param element
			 * @param options
			 * @constructor
			 */
			function OpenStreetMap(element, options) {
				this.element = element;
				this.map = null;
				this.geocoder = null;
				this.marker = null;
				this.infoWindow = null;
				this.options = options;
				this.onMapClick = new PlatformMessenger();
				this.init();
				this.markerList = [];
			}

			/**
			 * @description static variable, bing map key value.
			 * @type {string}
			 */
			OpenStreetMap.key = '';
			OpenStreetMap.typeId = 'OSM';
			OpenStreetMap.isApiLoading = false;
			OpenStreetMap.isApiLoaded = false;
			OpenStreetMap.onApiLoaded = new PlatformMessenger();
			OpenStreetMap.isApiLoadFailed = false;
			OpenStreetMap.onMapApiLoadFailed = new PlatformMessenger();

			function extractAddress(newAddressEntity, result, joinMultiValues) {
				if (!result || !newAddressEntity) {
					return newAddressEntity;
				}
				const addressParts = {
					Street: ['street', 'road', 'house_number'],
					City: 'city|town|village',
					County: 'county|state',
					ZipCode: 'postcode',
					State: 'state',
					CountryCodeISO2: 'country_code'
				};

				if (!result.address) {
					result.address = {}; // the address parts contains city, street...
				}

				// change the address info
				_.map(addressParts, function (val, key) {
					const fields = _.isArray(val) ? val : val.split('|');
					if (joinMultiValues && _.isArray(val)) {
						const finalVal = fields.map(field => result.address[field]).filter(v => !_.isNil(v)).join(' ');
						newAddressEntity[key] = finalVal || '';
					} else {
						const finalVal = fields.map(field => result.address[field]).find(v => !_.isNil(v));
						newAddressEntity[key] = finalVal || '';
					}
				});
				newAddressEntity.Address = result.display_name || '';    // jshint ignore:line

				return newAddressEntity;
			}

			// find address by lat-lon
			function geoLocation2address(lat, lon, objSelf) {
				var request = {
						method: 'GET',
						// url: '//nominatim.openstreetmap.org/reverse',
						url: addressReverseUrl,
						data: {
							format: 'json', // return json format
							addressdetails: '1',
							'accept-language': loadOptions.culture,
							lat: lat,
							lon: lon
						}
						// headers: function () {
						//   return null;
						// }
					},
					newAddressEntity = {
						AddressModified: true
					};

				return $.ajax(request).done(function (res) {
					objSelf.onMapClick.fire({
						latitude: lat,
						longitude: lon,
						addressEntity: extractAddress(newAddressEntity, res, true)
					});
				});
			}

			function constructReqAddressParams(searchOptions, options) {
				const mapOptions = basicsCommonMapKeyService.getMapOptionsFromCache();

				// Use free-form query
				if (mapOptions && mapOptions.OpenStreetQueryMode === 1) {
					return angular.extend({
						// replace the [return line feed] with ','
						// JQuery.ajax(request) will encode it so we should not use encodeURI to encode it.
						q: searchOptions.address.split(/[\n\r]+/g).map(e => e.trim()).join(', ')
					}, options);
				} else {
					// Use structured query
					var reqAddress = {};
					try {
						// use user manually inputs address
						if (searchOptions.entity.AddressModified === true) {
							reqAddress = {
								// replace the [return line feed] with ','
								// JQuery.ajax(request) will encode it so we should not use encodeURI to encode it.
								q: searchOptions.address.replace(/[\n\r]+/g, ',')
							};
						}
						// use composite address
						else {
							reqAddress = {
								street: searchOptions.entity.Street ? searchOptions.entity.Street : searchOptions.entity.Address.Street,
								city: searchOptions.entity.City ? searchOptions.entity.City : searchOptions.entity.Address.City,
								county: searchOptions.entity.County ? searchOptions.entity.County : searchOptions.entity.Address.County,
								postalcode: searchOptions.entity.ZipCode ? searchOptions.entity.ZipCode : searchOptions.entity.Address.ZipCode,
								country: searchOptions.entity.CountryDescription ? searchOptions.entity.CountryDescription : searchOptions.entity.Address.CountryDescription
							};

						}
					} catch (e) {
						// ignore
					}
					return angular.extend(reqAddress, options);
				}
			}

			// show message if address not found on the map
			function addressNotFound(objSelf) {
				var latlng = [0, 0],
					zoom = 2;
				objSelf.map.setView(latlng, zoom);
				// show a message popup
				L.popup().setLatLng(latlng)
					// .setContent('<p>Notice: <br> Address not found on the map.</p>')
					.setContent($translate.instant('basics.common.map.addressNotFound'))
					.openOn(objSelf.map);
			}

			/**
			 * @description load OpenStreet map api.
			 * Using the openLayer library for displaying OpenStreetMap map tiles
			 */
			OpenStreetMap.loadScript = function (options) {
				loadOptions = options;
				if ((global.L) || OpenStreetMap.isApiLoaded) {
					OpenStreetMap.onApiLoaded.fire();
				} else if (!OpenStreetMap.isApiLoading) {
					// loadd css
					var cssUrl = leafletjsUrlBase + 'leaflet.css';
					$('head')
						.append('<link rel="stylesheet" type="text/css" href="' + cssUrl + '" />');

					$.getScript(leafletjsUrlBase + 'leaflet.js').done(function () {
						$timeout(function () {
							OpenStreetMap.isApiLoaded = true;
							OpenStreetMap.isApiLoading = false;
							OpenStreetMap.onApiLoaded.fire();

						}, 1000); // wait for api available
					}).fail(function () {
						OpenStreetMap.isApiLoading = false;
						OpenStreetMap.isApiLoadFailed = true;
						OpenStreetMap.onMapApiLoadFailed.fire();
					});
					OpenStreetMap.isApiLoading = true;
				} else if (OpenStreetMap.isApiLoadFailed) {
					OpenStreetMap.onMapApiLoadFailed.fire();
				}
			};

			OpenStreetMap.prototype.init = function () {
				var self = this;

				// osm map instance
				// empty leaflet object
				// if map is instanced, return.
				if (self.element._leaflet && self.element.innerHTML) {
					return;
				}

				const resizeOserver = new ResizeObserver((entries) => {
					self.map.invalidateSize();
				});

				resizeOserver.observe(self.element);

				self.element._leaflet = false;
				self.element.innerHTML = '';
				self.map = new L.Map(self.element).setView([0, 0], 13);

				// set tile layer
				L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					noWrap: true // set only on map,no repeat
					// attribution: '&copy; <a target="_blank" href="https://osm.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(self.map);

				// set the osm logo at bottom right
				self.map.attributionControl.setPrefix(
					'<a target="_blank" href="https://www.leafletjs.com">leaflet</a> | ' +
					'&copy; <a target="_blank" href="https://www.osm.org/copyright">OpenStreetMap</a> contributors'
				);

				// listen click event of map
				self.clickHandle = function (e) {
					try {
						geoLocation2address(e.latlng.lat, e.latlng.lng, self);
					} catch (err) {
						// $log.log('OSM MAP error: ',  err);
					}
				};
				self.clickMapId = self.map.on('click', self.clickHandle);

				// callback when map is ready
				if (self.options && self.options.ready) {
					self.options.ready(self);
				}
			};

			/* jshint -W074 */ // this function's cyclomatic complexity is too high.
			OpenStreetMap.prototype.mark = function (markOptions) {
				var self = this, invalidLocation = false;

				// judge latitude and longitude value are valid or not.
				if (markOptions && markOptions.latitude && markOptions.longitude) {
					invalidLocation = markOptions.latitude > 90 || markOptions.latitude < -90 ||
						markOptions.longitude > 180 || markOptions.longitude < -180;
				}

				if (!markOptions || invalidLocation) { // clear mark.
					if (self.marker) {
						self.map.removeLayer(self.marker);
					}
					return;
				}

				var position = [markOptions.latitude, markOptions.longitude];

				// clear marker.
				if (self.marker) {
					self.map.removeLayer(self.marker);
				}

				// clear popup if any
				self.map.closePopup();

				// add new marker
				self.marker = L.marker(position, {
					icon: new L.Icon.Default({
						iconUrl: 'https:' + leafletjsUrlBase + 'images/marker-icon.png',
						shadowUrl: 'https:' + leafletjsUrlBase + 'images/marker-shadow.png'
						// width:'25px',height:'41px'
					})
				})
					.addTo(self.map)
					.bindPopup(markOptions.address);

				if (self.options.showInfoBox) {
					self.marker.openPopup();
				}

				if (!markOptions.disableSetCenter) {
					self.map.setView(position);
				}
			};

			OpenStreetMap.prototype.clearMarker = function () {
				var self = this;
				_.each(self.markerList, function (marker) {
					self.map.removeLayer(marker);
				});
				self.markerList = [];
			};

			OpenStreetMap.prototype.markMultiple = function (markItemList) {
				var self = this;
				var pinShadowImage = 'https:' + leafletjsUrlBase + 'images/marker-shadow.png';
				var pinDefaultImage = 'https:' + leafletjsUrlBase + 'images/marker-icon.png';
				var pinSelectedImage = 'cloud.style/content/images/control-icons.svg#ico-pushpin-openstreet';
				self.clearMarker();
				self.selectedPin = null;
				self.selectedCenter = null;
				_.each(markItemList, function (markItem) {

					if (!utils.isLatLongValid(markItem)) {
						return;
					}
					var position = [markItem.latitude, markItem.longitude];

					// clear popup if any
					self.map.closePopup();

					// add new marker
					var marker = L.marker(position, {
						icon: new L.Icon.Default({
							iconUrl: pinDefaultImage,
							shadowUrl: pinShadowImage
							// width:'25px',height:'41px'
						})
					});

					if (markItem.isSelected) {
						marker = L.marker(position, {
							icon: new L.Icon.Default({
								iconUrl: pinSelectedImage,
								shadowUrl: pinShadowImage,
								iconSize: [40, 40]
								// width:'25px',height:'41px'
							})
						});
						self.selectedPin = marker;
						self.selectedCenter = position;
					}

					marker.addTo(self.map)
						.bindPopup(markItem.formatter ? markItem.formatter(markItem) : markItem.address);

					self.markerList.push(marker);

					if (self.options.showInfoBox) {
						marker.openPopup();
					}
				});

				if (self.selectedPin && self.selectedCenter) {
					self.selectedPin.openPopup();
				}

				self.map.fitBounds(self.createBound(markItemList));

			};

			OpenStreetMap.prototype.createBound = function createBound(markItemList) {
				var extremeValues = utils.getExtremes(markItemList);
				var bounds = [[extremeValues.maxLat, extremeValues.minLong], [extremeValues.minLat, extremeValues.maxLong]];
				// L.rectangle(bounds).addTo(self.map);
				return bounds;
			};

			OpenStreetMap.prototype.showRoutes = function (wayPoints) {
				var defer = $q.defer();
				var data = [];
				defer.resolve(data);
				return defer.promise;
			};

			OpenStreetMap.prototype.calculateDistance = function (wayPoints) {
				var defer = $q.defer();
				var data = [];
				defer.resolve(data);
				return defer.promise;
			};

			OpenStreetMap.prototype.search = function (searchOptions) {
				var self = this,
					hasSuccessCallback = angular.isFunction(searchOptions.success),
					successCallback = function (location) {
						if (hasSuccessCallback) {
							searchOptions.success(location);
						}
					};

				// find lon, lat by address string
				var request = {
					method: 'GET',
					url: address2LatLngUrl,
					data: constructReqAddressParams(searchOptions, {
						addressdetails: '1',
						'accept-language': loadOptions.culture,
						format: 'json', // return json format
						limit: 1 // limit the number of returned results
					})

					// headers: function () {
					// return null;
					// }
				};

				/**
				 * res: {config:{}, data:{], headers: func(){}}
				 */
				$.ajax(request)
					.done(function (res) {
						try {
							var result = res[0],
								location = {
									address: result.display_name, // jshint ignore:line
									latitude: result.lat,
									longitude: result.lon,
									addressEntity: extractAddress({}, result, false)
								};
							self.mark(location);
							successCallback(location);
						} catch (e) {
							self.mark(null); // clear old mark.
							successCallback(null); // clear old latitude and longitude.
							addressNotFound(self);
							// $log.log('OSM MAP error: ',  e);
						}

					})
					.fail(function () {
						// addressNotFound(self);
					});
			};

			OpenStreetMap.prototype.destroy = function () {
				var self = this;
				// remove event
				self.map.off('click', self.clickHandle);
				try {
					self.map.remove();
				} catch (e) {
					// $log.error(e);
				}// map is removed before this.destroy when change the view.
			};

			return OpenStreetMap;
		}
	]);

})(angular, window);