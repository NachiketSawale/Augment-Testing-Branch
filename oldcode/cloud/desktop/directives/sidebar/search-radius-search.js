(function (angular, globals) {
	'use strict';
	angular.module('cloud.desktop').directive('cloudDesktopSearchGoogleRadiussearch',
		['$http', '_', 'cloudDesktopSidebarService', '$translate', 'cloudDesktopSidebarRadiusSearchService', 'cloudDesktopBulkSearchDataService', 'basicsCommonMapKeyService',
			function ($http, _, cloudDesktopSidebarService, $translate, cloudDesktopSidebarRadiusSearchService, cloudDesktopBulkSearchDataService, basicsCommonMapKeyService) { // jshint ignore:line
				return {
					restrict: 'A',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-radiussearch.html',
					link: function (scope) {


						// show map per default
						const originalMapState = basicsCommonMapKeyService.mapOptions.showByDefault;
						basicsCommonMapKeyService.updateMapState(true);

						cloudDesktopSidebarRadiusSearchService.onFilterChanged.register(onFilterChanged);
						cloudDesktopSidebarService.onModuleChanged.register(onModuleChanged);
						cloudDesktopSidebarService.onAutoFilterChanged.register(onAutoFilterChanged);

						var bulkSearchActive = cloudDesktopSidebarService.currentSearchType === 'bulk';
						var googleSearchActive = cloudDesktopSidebarService.currentSearchType === 'google';
						var bulkFormSearchActive = cloudDesktopSidebarService.currentSearchType === 'bulkForm';

						const propertyNameArray = { dateParameters: 'dateParameters', radiusParameters: 'radiusParameters' };

						var tPrefix = 'procurement.common.findBidder.location';
						scope.locationOptions = {
							locationSelectOptions: {
								displayMember: 'Label',
								valueMember: 'Id',
								watchItems: true,
								items: [
									{
										Id: 'RadiusMode',
										Label: $translate.instant(tPrefix + '.distance.title')
									},
									{
										Id: 'RegionalMode',
										Label: $translate.instant(tPrefix + '.regional.title')
									}
								]
							},
							distanceSelectOptions: {
								displayMember: 'DescriptionInfo.Translated',
								valueMember: 'Id',
								watchItems: true,
								items: []
							},
							regionLookupOptions: {
								valueMember: 'Id',
								displayMember: 'Description'
							},
							addressLookupOptions: {

							}
						};

						// the object must look like that, because the autfilter will restore also parameters from
						// the datesearch which will then be in the root
						scope.location = {
							RadiusParameters: {}
						};

						// the rfq address get set here
						if (cloudDesktopSidebarRadiusSearchService.rfqAddressInfo !== undefined
							&& cloudDesktopSidebarRadiusSearchService.rfqAddressInfo !== 'null') {
							scope.location.RadiusParameters = { radiusMode: 'RadiusMode' };
							let addressFk = cloudDesktopSidebarRadiusSearchService.rfqAddressInfo;
							$http.post(globals.webApiBaseUrl + 'basics/common/address/getaddressesbyid', [addressFk]).then(function (addressDto) {
								scope.location.RadiusParameters.addressInformation = {
									AddressLine: addressDto.data[0].addressLine,
									Street: addressDto.data[0].street,
									ZipCode: addressDto.data[0].zipCode,
									City: addressDto.data[0].city,
									County: addressDto.data[0].county,
									CountryFk: addressDto.data[0].countryFk,
									StateFk: addressDto.data[0].stateFk,
									Latitude: addressDto.data[0].latitude,
									Longitude: addressDto.data[0].longitude,
									Supplement: addressDto.data[0].supplement
								};
								setRegionSearch();
							});

						} else {
							scope.location.RadiusParameters = cloudDesktopSidebarRadiusSearchService.selectedParameters;
						}

						var filterData;
						if (bulkSearchActive) {
							filterData = cloudDesktopSidebarService.getAutoFilter('bulk', propertyNameArray.radiusParameters);
							if (filterData) {
								setInitialLocationParameters(filterData);
							}
						}

						if (bulkFormSearchActive) {
							filterData = cloudDesktopSidebarService.getAutoFilter('bulkForm', propertyNameArray.radiusParameters);
							scope.searchOptions = scope.searchFormOptions;
							if (filterData) {
								setInitialLocationParameters(filterData);
							}
						}
						if (googleSearchActive) {
							filterData = cloudDesktopSidebarService.getAutoFilter('google', propertyNameArray.radiusParameters);
							if (filterData) {
								setInitialLocationParameters(filterData);
							}
						}

						// flag to prevent region filter from triggering
						// needs to be done when changing module or initializing the directive
						var initialFilter = true;

						function onModuleChanged(options) {
							cloudDesktopSidebarRadiusSearchService.resetFilter(options);
							cloudDesktopSidebarRadiusSearchService.filterRequested(false);
							initialFilter = true;
						}

						function onAutoFilterChanged(event, args) {
							cloudDesktopSidebarRadiusSearchService.resetFilter(args.options, args.parameters);
							cloudDesktopSidebarRadiusSearchService.filterRequested(true);
							setInitialLocationParameters(args.parameters);
						}

						function onFilterChanged() {
							scope.location.RadiusParameters = cloudDesktopSidebarRadiusSearchService.selectedParameters;
							// if datesearch is valid -> set dateSearch
							setRegionSearch();
						}

						function setRegionSearch() {
							// always set parameters
							cloudDesktopSidebarRadiusSearchService.setParameters(scope.location.RadiusParameters);

							var param = scope.location.RadiusParameters;
							if (_.isEmpty(param)) {
								return false;
							}

							if (param.radiusMode === 'RadiusMode' &&
								param.radiusId > 0 &&
								!_.isNil(param.addressInformation) &&
								!_.isNil(param.addressInformation.Latitude) &&
								!_.isNil(param.addressInformation.Longitude)
							) {
								res = {};
								res.Token = 'ADDCOL_FILTER_BusinessPartnerEntity_LocationDistanceSearch';
								res.Value = '[3,null,["[]",[["d",{"v":';
								res.Value += param.addressInformation.Latitude;
								res.Value += '}],["d",{"v":';
								res.Value += param.addressInformation.Longitude;
								res.Value += '}],["i",{"v":';
								res.Value += param.radiusId;
								res.Value += '}]],{}]]';

								scope.searchOptions.filterRequest.radiusSearch = [res];
								return true;

							} else if (param.radiusMode === 'RegionalMode' &&
										param.regionId > 0
							) {
								var res = {};
								res.Token = 'ADDCOL_FILTER_BusinessPartnerEntity_RegionalSearch';
								res.Value = '[3,null,["[]",[["i",{"v":';
								res.Value += param.regionId;
								res.Value += '}],["s",{"v":"';
								res.Value += !_.isNil(param.regionInput) ? param.regionInput : '';
								res.Value += '"}]],{}]]';

								scope.searchOptions.filterRequest.radiusSearch = [res];
								return true;
							}

							return false;
						}

						function triggerSearch() {
							// set autofilter
							if (bulkSearchActive) {
								var bulkFilter = cloudDesktopSidebarService.getAutoFilter('bulk', propertyNameArray.radiusParameters);
								if (bulkFilter) {
									Object.assign(bulkFilter, scope.location);
								}
								cloudDesktopSidebarService.setAutoFilter('bulk', scope.location, propertyNameArray.radiusParameters);
							}
							if (bulkFormSearchActive) {
								var bulkFormFilter = cloudDesktopSidebarService.getAutoFilter('bulkForm', propertyNameArray.radiusParameters);
								if (bulkFormFilter) {
									Object.assign(bulkFormFilter, scope.location);
								}
								cloudDesktopSidebarService.setAutoFilter('bulkForm', scope.location, propertyNameArray.radiusParameters);
							}
							if (googleSearchActive) {
								var autoFilter = cloudDesktopSidebarService.getAutoFilter('google', propertyNameArray.radiusParameters);
								if (autoFilter && autoFilter.hasOwnProperty('formattedDate')) {
									Object.assign(autoFilter.formattedDate, scope.location);
									Object.assign(autoFilter.parameters, scope.location);
									Object.assign(autoFilter.selectedTag, scope.location);
									Object.assign(autoFilter.tab, scope.location);
								}
								cloudDesktopSidebarService.setAutoFilter('google', scope.location, propertyNameArray.radiusParameters);
							}
							if (scope.searchOptions.filterRequest.includeRadiusSearch === false) {
								scope.searchOptions.filterRequest.includeRadiusSearch = true;
							}
							scope.searchOptions.onStartSearch();
						}

						function setInitialLocationParameters(filterData) {
							if (!_.isEmpty(filterData)) {
								if (filterData.hasOwnProperty('RadiusParameters')) {
									scope.location.RadiusParameters = { radiusMode: filterData.RadiusParameters.radiusMode };
									if (filterData.RadiusParameters.radiusId) {
										scope.location.RadiusParameters.radiusId = filterData.RadiusParameters.radiusId;
										scope.location.RadiusParameters.addressInformation = {
											AddressLine: filterData.RadiusParameters.addressInformation.AddressLine,
											Address: filterData.RadiusParameters.addressInformation.AddressLine,
											Street: filterData.RadiusParameters.addressInformation.Street,
											ZipCode: filterData.RadiusParameters.addressInformation.ZipCode,
											City: filterData.RadiusParameters.addressInformation.City,
											County: filterData.RadiusParameters.addressInformation.County,
											CountryFk: filterData.RadiusParameters.addressInformation.CountryFk,
											StateFk: filterData.RadiusParameters.addressInformation.StateFk,
											Latitude: filterData.RadiusParameters.addressInformation.Latitude,
											Longitude: filterData.RadiusParameters.addressInformation.Longitude,
											Supplement: filterData.RadiusParameters.addressInformation.Supplement
										};
									}
									if (filterData.RadiusParameters.regionId) {
										scope.location.RadiusParameters.regionId = filterData.RadiusParameters.regionId;
										scope.location.RadiusParameters.regionInput = filterData.RadiusParameters.regionInput;
									}

									setRegionSearch();
								}
							}
						}

						cloudDesktopSidebarRadiusSearchService.fetchDistances().then(function (result) {
							scope.locationOptions.distanceSelectOptions.items = result;
							onFilterChanged();
						});

						scope.$watchGroup(['location.RadiusParameters.radiusMode',
							'location.RadiusParameters.radiusId',
							'location.RadiusParameters.regionId',
							'location.RadiusParameters.regionInput',
							'location.RadiusParameters.addressInformation.Latitude',
							'location.RadiusParameters.addressInformation.Longitude',
							'searchOptions.filterRequest.includeRadiusSearch'
						], function watchFn(newVal, oldVal) {

							if (initialFilter) {
								initialFilter = false;
								return;
							}

							var bulkSearchReady = false;
							if (bulkSearchActive &&
									!_.isNil(cloudDesktopBulkSearchDataService)
							){

								var filterDefinition = scope.searchOptions.selectedItem.currentDefinition;
								if (!_.isNil(filterDefinition) &&
											 cloudDesktopBulkSearchDataService.validateFilterDefinition(filterDefinition).isValid
											 ){
									bulkSearchReady = true;
								}
							}

							// evaluate changes
							if (setRegionSearch() &&
								(bulkSearchActive || googleSearchActive || bulkFormSearchActive) || bulkSearchReady &&
								(newVal[0] !== oldVal[0] ||
									newVal[1] !== oldVal[1] ||
									newVal[2] !== oldVal[2] ||
									newVal[3] !== oldVal[3] ||
									newVal[4] !== oldVal[4] ||
									newVal[5] !== oldVal[5] ||
									newVal[6] !== oldVal[6])
							) {
								showWarriningText(false);
								triggerSearch();
							} else {
								showWarriningText(true);
								scope.searchOptions.filterRequest.radiusSearch = [];
							}
						});

						function showWarriningText(showWarning) {
							if (showWarning) {

								let div = document.getElementsByClassName('warning-text-radius-search');
								if (document.getElementsByClassName('warning-text-radius-search').length === 0) {
									div = document.createElement('div');
									div.append($translate.instant('cloud.desktop.googleRadiusSearchAddressInvalidWarning'));
									div.style = 'color: red';
									div.classList.add('warning-text-radius-search');
								} else {
									div = div[0];
									div.hidden = false;
								}

								document.getElementsByClassName('search-google-radiussearch')[0].before(div);
								document.getElementsByClassName('search-google-radiussearch')[0].style.border = 'solid 1px rgba(210, 0, 0, 0.4)';

							} else {
								document.getElementsByClassName('search-google-radiussearch')[0].style.border = '';
								let div = document.getElementsByClassName('warning-text-radius-search');
								if (div.length > 0) {
									div[0].hidden = true;
								}
							}
						}

						// un-register on destroy
						scope.$on('$destroy', function () {
							// cloudDesktopSidebarService.onAutoFilterChanged.unregister(onAutoFilterChanged);
							cloudDesktopSidebarService.onModuleChanged.unregister(onModuleChanged);
							cloudDesktopSidebarRadiusSearchService.onFilterChanged.unregister(onFilterChanged);

							// set map to default
							basicsCommonMapKeyService.updateMapState(originalMapState);
						});


					}
				};
			}
		]
	);
})(angular, globals);
