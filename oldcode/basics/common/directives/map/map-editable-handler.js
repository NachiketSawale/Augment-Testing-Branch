/**
 * Created by wui on 4/8/2015.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */ // ignore too many parameters error.
	angular.module('basics.common').directive('basicsCommonMapEditableHandler', [
		'basicsLookupdataLookupDataService',
		'$q',
		'$translate',
		'$rootScope',
		'basicsCommonMapKeyService',
		'PlatformMessenger',
		'$window',
		'platformModalService',
		'basicsLookupdataLookupDescriptorService',
		'$',
		'_',
		'math',
		function (
			basicsLookupdataLookupDataService,
			$q,
			$translate,
			$rootScope,
			basicsCommonMapKeyService,
			PlatformMessenger,
			$window,
			platformModalService,
			basicsLookupdataLookupDescriptorService,
			$,
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

				var messageType = {
					default: 'default',
					info: 'info',
					error: 'error'
				};

				var messages = {
					loadingMap: $translate.instant('basics.common.map.message.loadingMap'),
					mapLoaded: $translate.instant('basics.common.map.message.mapLoaded'),
					mapLoadFailed: $translate.instant('basics.common.map.message.mapLoadFailed'),
					searching: $translate.instant('basics.common.map.message.searching'),
					searchCompleted: $translate.instant('basics.common.map.message.searchCompleted'),
					addressNotFound: $translate.instant('basics.common.map.message.addressNotFound'),
					searchError: $translate.instant('basics.common.map.message.searchError')
				};

				this.handlerName = 'basicsCommonMapEditableHandler';

				this.mapOptions = {
					showScalebar: true,
					customizeOverlays: true,
					showBreadcrumb: true
				};

				this.onMapClick = new PlatformMessenger();

				this.initialize = function (scope) {
					var self = this;
					scope.entity._initialized = false;
					scope.entity._messageType = messageType.info;
					scope.entity._message = messages.loadingMap;
					scope.entity._messageName = 'loadingMap';

					scope.pickLocation = function () {
						self.onMapClick.fire();
					};

					var toolsItems = [
						{
							id: 't80',
							sort: 20,
							caption: 'basics.common.map.iconPickLocation',
							iconClass: 'control-icons ico-location2 ',
							type: 'check',
							fn: function () {
								scope.pickLocation();
							}
						},
						{
							id: 't90',
							sort: 30,
							caption: 'basics.common.map.iconExpandMap',
							iconClass: 'control-icons ico-map-new-tab ',
							type: 'item',
							fn: function () {
								showMapToNewTab(scope);
							}
						}
						// ,
						// {
						// id: 't95',
						// sort: 40,
						// caption: 'cloud.common.toolbarSetting',
						// iconClass: 'tlb-icons ico-settings ',
						// type: 'item',
						// fn: function () {
						// platformModalService.showDialog({
						// templateUrl: globals.appBaseUrl + 'basics.common/templates/dialog-map-settings.html'
						// });
						// }
						// }
					];
					scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: toolsItems,
						update: function () {
							scope.tools.version += 1;
						}
					};
				};

				/**
				 * @description do initialization after map instance is ready.
				 * @param mapScope it is scope of 'platformBingMap' directive
				 * @param map map instance.
				 */
				this.onMapApiReady = function (mapScope, map) {
					const self = this;
					this.onMapApiLoaded(mapScope);
					const dataCache = {
						country: null,
						state: null,
						states: []
					};
					let isPickLocationActive = false;


					if (mapScope.entity && mapScope.entity.isShowMapForRadiusSearch) {
						const mapContentElem = document.getElementsByClassName('modal-content ui-resizable');
						if (mapContentElem[0]) {
							mapContentElem[0].style.height = '600px';
						}
					}

					const tryUpdateState = function (location, entity) {
						// Try to capture the best match state.
						if (location.addressEntity.State) {
							const stateTerms = [location.addressEntity.State].concat(location.addressEntity.State.split(/[\s-]/g));
							const matchedStates = _.filter(dataCache.states, (state) => {
								return _.some(stateTerms, (term) => {
									return state.Description.indexOf(term) > -1;
								});
							});
							const evaluatedState = _.map(matchedStates, (state) => {
								return {
									state: state,
									weight: _.sumBy(stateTerms, term => {
										return state.Description === term ? 10 : (state.Description.indexOf(term) > -1 ? 1 : 0);
									})
								};
							});
							const matchedState = evaluatedState.length ? _.maxBy(evaluatedState, 'weight') : null;
							if (matchedState) {
								entity.StateFk = matchedState.state.Id;
							}
						}
					};

					const getCountryAndState = function () {
						const promises = [];

						if (mapScope.entity.CountryFk) {
							if (!dataCache.country || dataCache.country.Id !== mapScope.entity.CountryFk) {
								const countries = basicsLookupdataLookupDescriptorService.loadData('Country');
								if (angular.isFunction(countries.then)) { // return promise
									promises.push(countries);
									countries.then(function () {
										dataCache.country = basicsLookupdataLookupDescriptorService.getLookupItem('Country', mapScope.entity.CountryFk);
									});
								} else {
									dataCache.country = null;
								}

								// States
								const statePromise = basicsLookupdataLookupDataService.getSearchList('State', 'CountryFk=' + mapScope.entity.CountryFk).then(result => {
									dataCache.states = result;
								});
								promises.push(statePromise);
							}
						} else {
							dataCache.states = [];
							dataCache.country = null;
						}

						if (mapScope.entity.StateFk) {
							if (!dataCache.state || dataCache.state.Id !== mapScope.entity.StateFk) {
								const stateRes = basicsLookupdataLookupDataService.getItemByKey('State', mapScope.entity.StateFk);
								if (angular.isFunction(stateRes.then)) { // return promise
									promises.push(stateRes);
									stateRes.then(function (data) {
										dataCache.state = data;
									});
								} else {
									dataCache.state = stateRes;
								}
							}
						} else {
							dataCache.state = null;
						}

						return $q.all(promises).then(function () {
							return dataCache;
						});
					};

					self.onMapClick.register(onMapClick);

					function onMapClick() {
						if (!map || !map.map) {
							return;
						}

						isPickLocationActive = !isPickLocationActive;

						if (isPickLocationActive) {
							$('.map-content').addClass('cursorHair');
							map.onMapClick.register(handleMapClick);
						} else {
							$('.map-content').removeClass('cursorHair');
							map.onMapClick.unregister(handleMapClick);
						}
					}

					$rootScope.safeApply(function () {
						mapScope.$parent.isMapReady = true;
					});

					mapScope.$watch('entity.SearchAddress', function (newValue, oldValue) {
						const scopeEntity = mapScope.entity;
						if (scopeEntity.clickMapToFindAddress === true) {
							// the address is updated by the user clicking on the map, no need to search again
							// after a search, set back the flag to make search available again
							scopeEntity.clickMapToFindAddress = false;
							return; // stop here
						}

						if (newValue) {
							// ALM 145013, Prevent always send search request even address already existed and nothing changed.
							if (scopeEntity.Latitude && scopeEntity.Longitude && scopeEntity.SearchAddress === oldValue) {
								map.mark({
									latitude: scopeEntity.Latitude,
									longitude: scopeEntity.Longitude,
									address: scopeEntity.Address
								});

								if (!scopeEntity._initialized) {
									scopeEntity._initialized = true;
								}

								return;
							}

							// JIRA DEV-22806, Change the fetching mechanism.
							if(!scopeEntity.AddressModified) {
								if ((!scopeEntity.ZipCode || !scopeEntity.ZipCode.trim()) && (!scopeEntity.City || !scopeEntity.City.trim())) {
									if (!scopeEntity._initialized) {
										scopeEntity._initialized = true;
									}
									return;
								}
							}

							getCountryAndState().then(function (dataCache) {
								$rootScope.safeApply(function () {
									scopeEntity._messageType = messageType.default;
									scopeEntity._message = messages.searching;
									scopeEntity._messageName = 'searching';
								});

								map.search({
									address: scopeEntity.Address,
									entity: scopeEntity,
									country: dataCache.country,
									state: dataCache.state,
									success: function (location) {
										if (!scopeEntity._initialized) {
											scopeEntity._initialized = true;
											if (location) {
												scopeEntity._messageType = messageType.info;
												scopeEntity._message = messages.searchCompleted;
												scopeEntity._messageName = 'searchCompleted';
											} else {
												scopeEntity._messageType = messageType.error;
												scopeEntity._message = messages.addressNotFound;
												scopeEntity._messageName = 'addressNotFound';
											}
											return;
										}

										$rootScope.safeApply(function () {
											if (location) {
												const addressEntity = location.addressEntity;
												/* var addressModified = mapScope.entity.AddressModified;
												angular.extend(
													mapScope.entity, // -> update data
													{clickMapToFindAddress: true, AddressModified: addressModified} // add a flag to prevent search twice
												); */
												scopeEntity.Latitude = math.round(location.latitude, coordinate_precision);
												scopeEntity.Longitude = math.round(location.longitude, coordinate_precision);

												scopeEntity._messageType = messageType.info;
												scopeEntity._message = messages.searchCompleted;
												scopeEntity._messageName = 'searchCompleted';

												if (addressEntity.ZipCode && (!scopeEntity.ZipCode || !scopeEntity.ZipCode.trim())) {
													scopeEntity.ZipCode = addressEntity.ZipCode;
												}
												if (addressEntity.City && (!scopeEntity.City || !scopeEntity.City.trim())) {
													scopeEntity.City = addressEntity.City;
												}
												if (addressEntity.County && (!scopeEntity.County || !scopeEntity.County.trim())) {
													scopeEntity.County = addressEntity.County;
												}

												// Try to capture the best match state.
												tryUpdateState(location, scopeEntity);
											} else {
												scopeEntity.Latitude = 0;
												scopeEntity.Longitude = 0;

												scopeEntity._messageType = messageType.error;
												scopeEntity._message = messages.addressNotFound;
												scopeEntity._messageName = 'addressNotFound';
											}
										});
									},
									error: function (err) {
										$rootScope.safeApply(function () {
											scopeEntity._messageType = messageType.error;
											scopeEntity._messageName = 'error';
											scopeEntity._message = err ? err.message ? err.message : err : messages.searchError;
										});
									}
								});
							});
						} else {
							map.mark(null); // clear old mark.
							scopeEntity.Latitude = 0;
							scopeEntity.Longitude = 0;
						}
					});

					mapScope.$on('$destroy', function () {
						if (isPickLocationActive) {
							$('.map-content').removeClass('cursorHair');
						}
						map.destroy();
						self.onMapClick.unregister(onMapClick);
					});

					function handleMapClick(location) {

						// update current address via map click
						updateAddressViaMapClick(location);

						map.mark({
							latitude: location.latitude,
							longitude: location.longitude,
							address: mapScope.entity.Address,
							disableSetCenter: true
						});
						mapScope.entity.Latitude = math.round(location.latitude, coordinate_precision);
						mapScope.entity.Longitude = math.round(location.longitude, coordinate_precision);
					}

					// update current address via map click
					function updateAddressViaMapClick(location) {
						if (!location.addressEntity) {
							return; // no data to update
						}

						// the country ISO2 code returned from map
						if (location.addressEntity.CountryCodeISO2) {
							var iso2 = location.addressEntity.CountryCodeISO2,
								countriesList = basicsLookupdataLookupDescriptorService.getData('Country'),
								newCountryItem = _.find(countriesList, function (item) {
									return item.Iso2 === iso2.toUpperCase();
								}) || {};
							// update country
							if (newCountryItem.Id) {
								location.addressEntity.CountryFk = newCountryItem.Id;
							}
						}

						// Try to capture the best match state.
						tryUpdateState(location, mapScope.entity);

						$rootScope.safeApply(function () {
							angular.extend(
								mapScope.entity, // -> update data
								location.addressEntity,
								{clickMapToFindAddress: true} // add a flag to prevent search twice
							);
						});
					}
				};

				this.onMapApiLoaded = function (mapScope) {
					$rootScope.safeApply(function () {
						mapScope.entity._messageType = messageType.info;
						mapScope.entity._message = messages.mapLoaded;
					});
				};

				this.onMapApiLoadFailed = function (mapScope) {
					$rootScope.safeApply(function () {
						mapScope.entity._messageType = messageType.error;
						mapScope.entity._message = messages.mapLoadFailed;
					});
				};

				this.initElement = function (element) {
					element.css({
						display: 'flex',
						'flex-direction': 'column'
					});
				};

				function showMapToNewTab(scope) {
					basicsCommonMapKeyService.getMapOptions().then(function (data) {
						var url = '',
							address = scope.entity;

						switch (data.Provider) {
							case 'bingv8':
							case 'bing': {
								url = '//www.bing.com/maps';
							}
								break;
							case 'google': {
								url = '//maps.google.com';
							}
								break;
							case 'openstreet': {
								url = '//www.openstreetmap.org';
							}
								break;
							case 'baidu': {
								url = '//api.map.baidu.com';
							}
								break;
						}

						if (address && address.Latitude && address.Longitude) {
							if (data.Provider === 'openstreet') {
								url += _.template(
									'/?mlat=<%=lat%>&mlon=<%=lon%>#map=15/<%=lat%>/<%=lon%>'
								)({
									lat: address.Latitude,
									lon: address.Longitude
								});
							} else if (data.Provider === 'baidu') {
								url += _.template(
									'/marker?location=<%=lat%>,<%=lon%>&title=<%=title%>&content=<%=content%>&coord_type=gcj02&output=html&src=itwo40.rib-software.com'
								)({
									lat: address.Latitude,
									lon: address.Longitude,
									title: address.Address,
									content: address.Address
								});
							} else {
								url = url + '/?q=' + address.Latitude + ',' + address.Longitude;
							}
						}

						$window.open(url, '_blank');
					});
				}

			}

		}
	]);

})(angular);