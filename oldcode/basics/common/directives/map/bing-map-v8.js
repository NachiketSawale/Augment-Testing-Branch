/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular, global) { /* global Microsoft, moment */
	'use strict';

	angular.module('basics.common').factory('basicsCommonBingMapV8', ['PlatformMessenger', '$timeout', '$log', '$translate', 'basicsCommonUtilities', '$q', 'platformModalService', '_', '$',
		function (PlatformMessenger, $timeout, $log, $translate, basicsCommonUtilities, $q, platformModalService, _, $) {

			/**
			 * @description bing map api url: https://www.bing.com/api/maps/mapcontrol
			 * @param element
			 * @param options
			 * @constructor
			 */
			function BingMapV8(element, options) {
				this.map = null;
				this.pin = null;
				this.pinInfo = null;
				this.element = element;
				this.theOptions = options;
				this.directionManager = null;
				this.wayPointsAdrs = {};
				this.onMapClick = new PlatformMessenger();
				this.routeInfoBox = null;
				this.directionWaypointLayer = null;
				this.init();
				this.waypointDragging = false;
			}

			/**
			 * @description static variable, bing map key value.
			 * @type {string}
			 */
			BingMapV8.key = '';

			BingMapV8.mapName = 'BingMapV8';

			BingMapV8.isApiLoading = false;

			BingMapV8.isApiLoaded = false;

			BingMapV8.onApiLoaded = new PlatformMessenger();

			BingMapV8.isApiLoadFailed = false;

			BingMapV8.onMapApiLoadFailed = new PlatformMessenger();

			BingMapV8.apiUrl = 'https://www.bing.com/api/maps/mapcontrol';

			BingMapV8.onWaypointClick = new PlatformMessenger();

			function extractAddress(result, addressModified, joinMultiValues) {
				const addressComponents = result.address || {}, // jshint ignore:line
					newAddressEntity = {
						AddressModified: addressModified,
						Address: addressComponents.formattedAddress // jshint ignore:line
					},

					info = {
						Street: ['addressLine'],
						City: 'locality',
						County: 'district|adminDistrict2',
						State: 'adminDistrict',
						ZipCode: 'postalCode',
						CountryCodeISO2: 'countryRegionIso2'
					};

				_.map(info, function (val, key) {
					const fields = _.isArray(val) ? val : val.split('|');
					if (joinMultiValues && _.isArray(val)) {
						const finalVal = fields.map(field => addressComponents[field]).filter(v => !_.isNil(v)).join(' ');
						newAddressEntity[key] = finalVal || '';
					} else {
						const finalVal = fields.map(field => addressComponents[field]).find(v => !_.isNil(v));
						newAddressEntity[key] = finalVal || '';
					}
				});

				return newAddressEntity;
			}

			// find address by lat-lon
			function geoLocation2address(lat, lon, objSelf) {
				Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
					const searchManager = new Microsoft.Maps.Search.SearchManager(objSelf.map);
					const reverseGeocodeRequestOptions = {
						location: new Microsoft.Maps.Location(lat, lon),
						callback: function (response) {
							let newAddress = null;
							try {
								newAddress = extractAddress(response, true, true);
							} catch (e) {
								$log.log('Bing Map geo error: No address found');
							}

							objSelf.onMapClick.fire({
								latitude: lat,
								longitude: lon,
								addressEntity: newAddress
							});
						}
					};
					searchManager.reverseGeocode(reverseGeocodeRequestOptions);
				});
			}

			// show info box for selected pin
			function showPinInfoBox(mapObject, pin, waypoint) {
				const waypointStr = $translate.instant('transportplanning.transport.entityWaypoint');
				const plannedTime = $translate.instant('transportplanning.transport.entityPlannedTime');
				const address = $translate.instant('basics.common.entityAddress');
				const comments = $translate.instant('basics.common.entityCommentText');

				const planTimeStr = '<b>' + plannedTime + '</b>: ' +
					moment.utc(waypoint.PlannedTime).toString();
				const addressStr = '<br><b>' + address + '</b>: ' +
					waypoint.Address.Address || '';
				const commentStr = '<br><b>' + comments + '</b>: ' +
					waypoint.CommentText || '';

				mapObject.routeInfoBox.setOptions({
					location: pin.getLocation(),
					title: '<' + waypoint.Code + '> ' + waypointStr,
					description: planTimeStr + addressStr + commentStr,
					offset: pin.metadata.infoboxOffset,
					showPointer: true,
					visible: true,
					maxHeight: 160
				});
			}

			/**
			 * @description load bing map api.
			 * @param options
			 */
			BingMapV8.loadScript = function (options) {
				if ((global.Microsoft && Microsoft.Maps && Microsoft.Maps.Map) || BingMapV8.isApiLoaded) {
					BingMapV8.onApiLoaded.fire();
				} else if (!BingMapV8.isApiLoading) {
					$.getScript(BingMapV8.apiUrl + '?mkt=' + options.culture).done(function () {
						$timeout(function () {
							BingMapV8.isApiLoaded = true;
							BingMapV8.isApiLoading = false;
							BingMapV8.onApiLoaded.fire();
						}, 1000); // wait for api available
					}).fail(function () {
						BingMapV8.isApiLoading = false;
						BingMapV8.isApiLoadFailed = true;
						BingMapV8.onMapApiLoadFailed.fire();
					});
					BingMapV8.isApiLoading = true;
				} else if (BingMapV8.isApiLoadFailed) {
					BingMapV8.onMapApiLoadFailed.fire();
				}
			};

			/**
			 * @description initialize bing map.
			 */
			BingMapV8.prototype.init = function () {
				const self = this;
				const defaults = {
						credentials: BingMapV8.key,
						mapTypeId: Microsoft.Maps.MapTypeId.road,
						zoom: 16,
						showMapTypeSelector: false,
				}, mapSettings = $.extend({}, defaults, self.theOptions.mapOptions);

				// create map
				self.map = new Microsoft.Maps.Map(self.element, mapSettings);
				// listen click event of map
				self.clickMapId = Microsoft.Maps.Events.addHandler(self.map, 'click', function (e) {
					// check if the user is clicking on the info box close button
					const isInfoBoxCloseClick = function () {
						let rs;
						try {
							rs = $(e.target).hasClass('infobox-close');
						} catch (e1) {
							rs = false;
						}
						return rs;
					};

					if (e && e.targetType === 'map' && !isInfoBoxCloseClick()) {
						const location = e.location;
						geoLocation2address(location.latitude, location.longitude, self);
						/* self.onMapClick.fire({
						 latitude: location.latitude,
						 longitude: location.longitude
						 }); */
					}
				});
				// callback when map is ready
				if (self.theOptions && self.theOptions.ready) {
					self.theOptions.ready(self);
				}

				self.routeInfoBox = new Microsoft.Maps.Infobox(self.map.getCenter(), {
					showCloseButton: true,
					visible: false
				});
				self.routeInfoBox.setMap(self.map);

				Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
					self.directionManager = new Microsoft.Maps.Directions.DirectionsManager(self.map);
				});
			};

			/**
			 * @description mark location on the map.
			 * @param markOptions
			 */
			/* jshint -W074 */ // this function's cyclomatic complexity is too high.
			BingMapV8.prototype.mark = function (markOptions) {
				let self = this, validLoacation;

				// judge latitude and longitude value are valid or not.
				validLoacation = basicsCommonUtilities.isLatLongValid(markOptions);

				if (!markOptions || !validLoacation) { // clear mark.
					if (self.pin) {
						Microsoft.Maps.Events.removeHandler(self.showInfoBoxId);
						self.pin = null;
					}
					if (self.map) {
						Microsoft.Maps.Events.removeHandler(self.hideInfoBoxId);
						self.map.entities.clear();
						self.map.setView({center: new Microsoft.Maps.Location(0, 0)});
					}
					self.pinInfo = null;
					return;
				}

				const center = new Microsoft.Maps.Location(markOptions.latitude, markOptions.longitude);
				const address = markOptions.address || 'you are here';

				// clear the address not found error popup if necessary
				if (self.addrNotFoundPopInfo) {
					self.map.entities.clear();
					self.addrNotFoundPopInfo = null;
				}

				if (!self.pin || !self.pinInfo) {
					self.pin = new Microsoft.Maps.Pushpin(center, {
						// text: '1',
						icon: 'http://www.bingmapsportal.com/content/images/poi_custom.png'
					});
					self.pinInfo = new Microsoft.Maps.Infobox(center, {
						width: 180,
						height: 60,
						visible: false,
						offset: new Microsoft.Maps.Point(0, 39)
					});
					self.showInfoBoxId = Microsoft.Maps.Events.addHandler(self.pin, 'click', showInfoBox);
					self.hideInfoBoxId = Microsoft.Maps.Events.addHandler(self.map, 'viewchange', hideInfoBox);
					self.map.entities.clear();
					self.map.entities.push(self.pin);
				} else {
					self.pin.setLocation(center);
					self.pinInfo.setLocation(center);

				}

				// when pickup location on map, don't show this info box, to avoid the close button fire event on map again pb
				let isInfoVisible = self.theOptions.showInfoBox; // default

				// when pick up location on map...
				if (markOptions.disableSetCenter) {
					// disable show the info box when mark address on map
					isInfoVisible = false;
				} else {
					self.map.setView({center: center});
				}

				self.pinInfo.setOptions({
					visible: isInfoVisible,
					description: address
				});

				function showInfoBox() {
					self.pinInfo.setOptions({visible: true});
					self.pinInfo.setMap(self.map);
				}

				function hideInfoBox() {
					self.pinInfo.setOptions({visible: false});
					self.pinInfo.setMap(null);
				}
			};

			BingMapV8.prototype.clearMarker = function () {
				const self = this;
				if (self.map.entities) {
					self.map.entities.clear();
				}
				_.each(self.markerList, function (markItem) {
					markItem.setMap(null);
				});
				self.markerList = [];
			};

			BingMapV8.prototype.markMultiple = function (markItemList) {
				const self = this;
				const pinDefaultImage = 'http://www.bingmapsportal.com/content/images/poi_custom.png';
				const pinSelectedImage = 'cloud.style/content/images/control-icons.svg#ico-pushpin-bing';
				self.clearMarker();
				self.selectedPin = null;
				self.selectedPinInfo = null;
				self.selectedCenter = null;

				_.each(markItemList, function (markItem, i) {
					if (!basicsCommonUtilities.isLatLongValid(markItem)) {
						return;
					}
					const center = new Microsoft.Maps.Location(markItem.latitude, markItem.longitude);
					const address = markItem.formatter ? markItem.formatter(markItem) : markItem.address;
					const title = markItem.countryDescription;

					const pin = new Microsoft.Maps.Pushpin(center, {
						text: (i + 1).toString(), icon: pinDefaultImage, width: '25px', height: '39px'
					});

					const pinInfo = new Microsoft.Maps.Infobox(center, {
						width: 180,
						height: 60,
						visible: false,
						offset: new Microsoft.Maps.Point(0, 45),
						title: title,
						description: address
					});

					function createScaledPushpin(location, scale, callback, index) {
						let img = new Image();
						const svg = '<svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="1.5" viewBox="0 0 40 40" id="ico-pushpin-bing"><path d="M9.849 21.031A12.44 12.44 0 017.5 13.74c0-6.899 5.601-12.5 12.5-12.5s12.5 5.601 12.5 12.5a12.44 12.44 0 01-2.349 7.291C29.918 21.356 25.5 26 25.5 26s-3.943 7.563-5.5 13.261C18.428 33.636 14.5 26 14.5 26s-4.417-4.643-4.651-4.969h0z" fill="#ebebeb" stroke="#000" stroke-width="1.5"/><circle cx="20" cy="13.74" r="10" fill="url(#axl_Linear1)"/><ellipse cx="20" cy="8.01" rx="4.688" ry="2.083" fill="url(#axl_Linear2)"/><defs><linearGradient id="axl_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 20 -20 0 20 3.74)"><stop offset="0" stop-color="#50b289"/><stop offset=".26" stop-color="#3c8767"/><stop offset=".5" stop-color="#35775b"/><stop offset=".74" stop-color="#3c8767"/><stop offset="1" stop-color="#50b289"/></linearGradient><linearGradient id="axl_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -4.16668 4.16668 0 20 10.094)"><stop offset="0" stop-color="var(--icon-color-7)" stop-opacity="0"/><stop offset="1" stop-color="var(--icon-color-7)" stop-opacity=".6"/></linearGradient></defs></svg>';
						let img64 = 'data:image/svg+xml,' + encodeURIComponent(svg);
						img.onload = function () {
							let c = document.createElement('canvas');
							c.width = img.width / scale;
							c.height = img.height / scale;
							let context = c.getContext('2d');

							context.drawImage(img, 0, 0, c.width, c.height);
							const pin = new Microsoft.Maps.Pushpin(location, {
								icon: c.toDataURL(),
								draggable: true,
								text: (index + 1).toString(),
							});
							Microsoft.Maps.Events.addHandler(pin, 'click', showInfoBox);
							Microsoft.Maps.Events.addHandler(pin, 'drag', updateInfoBoxPosition);
							if (callback) {
								callback(pin);
							}
						};
						img.src = img64;
					}


					if (markItem.isSelected) {
						createScaledPushpin(center, 3.5, function (pin) {
							self.map.entities.push(pin);
						}, i);
						self.selectedPin = pin;
						self.selectedPinInfo = pinInfo;
						self.selectedCenter = center;
					}

					pinInfo.setMap(self.map);

					if(!self.selectedPin) {
						self.map.entities.push(pin);
					}

					self.showInfoBoxId = Microsoft.Maps.Events.addHandler(pin, 'click', showInfoBox);
					self.hideInfoBoxId = Microsoft.Maps.Events.addHandler(self.map, 'viewchange', hideInfoBox);
					self.updateInfoBoxPosition = Microsoft.Maps.Events.addHandler(pin, 'drag', updateInfoBoxPosition);

					self.markerList.push(pinInfo);

					function showInfoBox() {
						pinInfo.setOptions({ visible: true });
						pinInfo.setMap(self.map);
					}

					function hideInfoBox() {
						pinInfo.setOptions({ visible: false });
						pinInfo.setMap(null);
					}

					function updateInfoBoxPosition(event) {
						pinInfo.setOptions({ location: event.location });
					}
				});

				function createBound() {
					const extremeValues = basicsCommonUtilities.getExtremes(markItemList);
					return new Microsoft.Maps.LocationRect.fromEdges(extremeValues.maxLat, extremeValues.minLong, extremeValues.minLat, extremeValues.maxLong);
				}

				if (self.selectedPin && self.selectedPinInfo) {
					$timeout(function () {
						if (self.selectedPinInfo) {
							self.selectedPinInfo.setOptions({ visible: true });
							self.selectedPinInfo.setMap(self.map);
						}
					}, 1000);
				}

				self.map.setView({ bounds: createBound() });
				self.waypointDragging = false;
			};

			BingMapV8.prototype.selectPin = function (filterObj, waypoint) {
				const self = this;
				if (self.directionWaypointLayer) {
					const layerContents = self.directionWaypointLayer.getPrimitives();
					const assignedPin = _.find(layerContents, function (pin) {
						const entity = pin.metadata.entity;
						return _.isMatch(entity, filterObj);
					});
					if (assignedPin) {
						showPinInfoBox(self, assignedPin, waypoint);
					}
				}
			};

			BingMapV8.prototype.showRoutes = function (wayPoints) {
				const defer = $q.defer();
				const data = { unitInfo: 'km', distances: [] };
				const self = this;
				self.wayPointsAdrs = wayPoints;

				// reset route
				self.clearMarker();
				self.routeInfoBox.setOptions({
					visible: false
				});
				self.directionManager.clearAll();

				self.directionManager.setRequestOptions({
					routeMode: Microsoft.Maps.Directions.RouteMode.driving,
					distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
					routeDraggable: false
				});
				// don't clear all layers, because it also clears the direction layer
				// self.map.layers.clear();

				// only create new layer if it's not yet initialised
				if (!self.directionWaypointLayer) {
					// Create a layer for managing custom waypoints.
					self.directionWaypointLayer = new Microsoft.Maps.Layer();

					// Add mouse events for showing instruction when hovering waypoint in directions-waypoint layer.
					Microsoft.Maps.Events.addHandler(self.directionWaypointLayer, 'click', onWaypointClicked);
					// Microsoft.Maps.Events.addHandler(self.directionWaypointLayer, 'mouseout', hideWaypointInfo);
					self.map.layers.insert(self.directionWaypointLayer);
				}

				function onWaypointClicked(e) {
					// var index = e.target.metadata.index;
					BingMapV8.onWaypointClick.fire(e.target.metadata).then(function (waypoint) {
						showPinInfoBox(self, e.target, waypoint);
					});
				}

				// always clear layer
				self.directionWaypointLayer.clear();

				_.each(wayPoints, function (wayPoint) {
					let wayPnt;
					if (angular.isDefined(wayPoint.latitude) && angular.isDefined(wayPoint.longitude) && basicsCommonUtilities.isLatLongValid(wayPoint)) {
						wayPnt = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(wayPoint.latitude, wayPoint.longitude)});
					} else if (angular.isDefined(wayPoint.addressline)) {
						wayPnt = new Microsoft.Maps.Directions.Waypoint({address: wayPoint.addressline});
					} else {
						wayPnt = new Microsoft.Maps.Directions.Waypoint({address: wayPoint.address});
					}
					self.directionManager.addWaypoint(wayPnt);
				});

				Microsoft.Maps.Events.addOne(self.directionManager, 'directionsUpdated', directionsUpdated);

				function directionsUpdated(e) {
					self.directionWaypointLayer.clear();
					if (e.route && e.route.length > 0) {
						const route = e.route[0];
						let waypointCnt = 0;
						let stepCount = 0;
						const waypointLabel = 'ABCDEFGHIJKLMNOPQRSTYVWXYZ';
						let pin = null;
						const wp = [];
						let step;
						let isWaypoint;
						let waypointColor;
						const SVG = '<circle cx=\'27\' cy=\'25\' r=\'3\' style=\'stroke-width:2;stroke:#ffffff;fill:#000000;\'/>' +
							'<polygon style=\'fill:rgba(0,0,0,0.5)\' points=\'21,1 27,25 21,18 21,1\'/>' +
							'<rect x=\'5\' y=\'2\' width=\'15\' height=\'15\' style=\'stroke-width:2;stroke:#000000;fill:{color}\'/>' +
							'<text x=\'12\' y=\'13\' style=\'font-size:10px;font-family:arial;fill:#ffffff;\' text-anchor=\'middle\'>{text}</text>';
						const ICON = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' width=\'50\' height=\'50\' viewBox=\'0 0 35 35\' xml:space=\'preserve\'>' +
							SVG + '</svg>';

						for (let i = 0; i < route.routeLegs.length; i++) {
							for (let j = 0; j < route.routeLegs[i].itineraryItems.length; j++) {
								stepCount++;
								isWaypoint = true;
								step = route.routeLegs[i].itineraryItems[j];
								if (j === 0) {
									if (i === 0) {
										// Start Endpoint, make it green.
										waypointColor = '#008f09';
									} else {
										// Midpoint Waypoint, make it gray,
										waypointColor = '#737373';
									}
								} else if (i === route.routeLegs.length - 1 && j === route.routeLegs[i].itineraryItems.length - 1) {
									// End waypoint, make it red.
									waypointColor = '#d60000';

								} else {
									// Instruction step
									isWaypoint = false;
								}
								if (isWaypoint) {
									pin = new Microsoft.Maps.Pushpin(step.coordinate, {
										icon: ICON,
										anchor: new Microsoft.Maps.Point(42, 39),
										color: waypointColor,
										text: waypointLabel[waypointCnt],   // Give waypoints a letter as a label.
										draggable: true
									});
									// Store the waypoint/step information in the metadata.
									pin.metadata = {
										entity: wayPoints[waypointCnt],
										index: waypointCnt,
										infoboxOffset: new Microsoft.Maps.Point(-25, 35)
									};
									Microsoft.Maps.Events.addHandler(
										pin,
										'dragend',
										function (args) {
											let draggedWaypoint = args.target.metadata.entity;
											draggedWaypoint.latitude = args.location.latitude;
											draggedWaypoint.longitude = args.location.longitude;
											self.waypointDragging = true;
											const center = self.map.getCenter();
											const zoom = self.map.getZoom();
											self.showRoutes(wayPoints).then(result => {
												self.map.setView({center: center, zoom: zoom});
											});
										}
									);
									waypointCnt++;
									wp.push(pin);
								}
							}
							data.distances.push(route.routeLegs[i].summary.distance);
						}
						defer.resolve(data);
						// Add the pins to the map.
						self.directionWaypointLayer.add(wp);
					}
				}

				Microsoft.Maps.Events.addHandler(self.directionManager, 'directionsError', function (directionsErrorEventArgs) {
					self.routeInfoBox.setOptions({
						location: self.map.getCenter(),
						title: 'Route Error',
						description: directionsErrorEventArgs.message,
						showPointer: false,
						visible: true
					});

					if (self.wayPointsAdrs.length >= 1) {
						self.markMultiple(self.wayPointsAdrs);
					}
				});

				self.directionManager.setRenderOptions({
					firstWaypointPushpinOptions: {visible: false},
					lastWaypointPushpinOptions: {visible: false},
					waypointPushpinOptions: {visible: false}
				});
				self.directionManager.calculateDirections();

				return defer.promise;
			};

			BingMapV8.prototype.calculateDistance = function (wayPoints) {
				const self = this;
				return self.showRoutes(wayPoints);
			};

			/**
			 * @description search location by bing map REST service.
			 * @param searchOptions
			 */
			BingMapV8.prototype.search = function (searchOptions) {

				const self = this,
					hasSuccessCallback = angular.isFunction(searchOptions.success),
					successCallback = function (location) {
						if (hasSuccessCallback) {
							searchOptions.success(location);
						}
					},
					errorCallback = function (e) {
						if (angular.isFunction(searchOptions.error)) {
							searchOptions.error(e);
						}
					};

				Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
					const searchManager = new Microsoft.Maps.Search.SearchManager(self.map);
					// encode string and replace all line breaks with simple spaces
					// if line breaks included bing responds with wrong result
					searchOptions.address = decodeURI(encodeURI(searchOptions.address).replace(/%0D/g, '%20'));

					const requestOptions = {
						where: searchOptions.address,
						bounds: Microsoft.Maps.LocationRect.fromEdges(85.5, -180, -85.5, 180),
						count: 1,
						callback: function (response) {
							if (response && response.results && response.results.length > 0 && isResponseResultValid(response.results[0], searchOptions)) {
								setLocationMark(response.results[0], searchOptions.searchOnly);
							} else {
								if (!searchOptions.searchOnly) {
									self.mark(null); // clear old mark.
								}
								successCallback(null); // clear old latitude and longitude.
							}
						},
						errorCallback: function () {
							errorCallback();
						}
					};
					try {
						searchManager.geocode(requestOptions);
					} catch (e) {
						errorCallback();
					}

					// }

				});

				function isResponseResultValid(result, searchOptions) {
					var zipCodeValidOrEmpty = _.toString(searchOptions.entity.ZipCode).length === 0 || _.isEqual(_.toString(result.address.postalCode), _.toString(searchOptions.entity.ZipCode));
					return searchOptions.entity.AddressModified || zipCodeValidOrEmpty; // check if zip codes are equal, if the result location in the right city
				}

				function setLocationMark(targetSource, searchOnly) {
					const location = {
						latitude: targetSource.location.latitude,
						longitude: targetSource.location.longitude,
						addressEntity: extractAddress(targetSource, false, false)
					};
					if (!searchOnly) {
						const markOptions = $.extend(location, {
							address: targetSource.address.formattedAddress
						});

						self.mark(markOptions);
					}
					successCallback(location);

					return location;
				}
			};

			BingMapV8.prototype.getMapSnapshotURL = (map, mapDimensions) => {
				if (map.directionManager.getAllWaypoints().length > 1) {
					return getMapSnapshotURLForRoute(map, mapDimensions);
				} else {
					return getMapSnapshotURLForPinpoint(map, mapDimensions);
				}
			};

			function getMapSnapshotURLForRoute(map, mapDimensions) {
				let httpString = 'https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/' + map.map.getCenter().latitude + ',' + map.map.getCenter().longitude
					+ '/' + map.map.getZoom() + '/Routes?driving?ur=at&c=en-GB';
				httpString += '&mapSize=' + mapDimensions.width + ',' + mapDimensions.height;
				let i = 0;
				if (map.directionManager.getAllWaypoints().length > 0) {

					const waypoints = map.directionManager.getAllWaypoints();
					let waypointString = '';
					waypoints.forEach((waypoint) => {
						waypointString = waypoint._waypointOptions.location ? waypoint._waypointOptions.location.latitude + ',' + waypoint._waypointOptions.location.longitude : encodeURI(waypoint._waypointOptions.address).replace(/%0D/g, '%20');
						httpString += '&wp.' + i++ + '=' + waypointString;
					});

					httpString += '&ra=routepath,routepathannotations,routeproperties,routeInfoCard,TransitFrequency&optmz=time&du=km&tt=departure&maxSolns=3&rpo=Points&jsonp=JSON_CALLBACK&key=' + BingMapV8.key;
				}
				return httpString;
			}

			function getMapSnapshotURLForPinpoint(map, mapDimensions) {
				let httpString = 'https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/' + map.map.getCenter().latitude + ',' + map.map.getCenter().longitude
					+ '/' + map.map.getZoom();
				httpString += '?mapSize=' + mapDimensions.width + ',' + mapDimensions.height;
				httpString += '&pp=' + map.selectedPin.geometry.y + ',' + map.selectedPin.geometry.x + ';54';
				httpString += '&mapLayer=Basemap,Buildings&key=' + BingMapV8.key;
				return httpString;
			}

			/**
			 * @description destroy bing map instance.
			 */
			BingMapV8.prototype.destroy = function () {
				Microsoft.Maps.Events.removeHandler(this.clickMapId);
				if (this.map && this.map.dispose) {
					this.map.dispose();
				}
				this.map = null;
			};

			return BingMapV8;
		}
	]);

})(angular, window);