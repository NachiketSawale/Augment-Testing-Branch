(function (angular, globals) {
	'use strict';
	angular.module('cloud.desktop').directive('cloudDesktopSearchGoogleDatesearch',
		['_', 'cloudDesktopSidebarService', '$http', 'moment', 'cloudDesktopSidebarDateSearchService',
			function (_, cloudDesktopSidebarService, $http, moment, cloudDesktopSidebarDateSearchService) { // jshint ignore:line
				return {
					restrict: 'A',
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-google-datesearch.html',
					link: function (scope) {

						cloudDesktopSidebarDateSearchService.onFilterChanged.register(onFilterChanged);
						cloudDesktopSidebarService.onModuleChanged.register(onModuleChanged);
						cloudDesktopSidebarService.onAutoFilterChanged.register(onAutoFilterChanged);

						var autoFilter = {};
						const propertyNameArray = { dateParameters: 'dateParameters', radiusParameters: 'radiusParameters' };

						// initiliaze autofiler here
						if (cloudDesktopSidebarService.getAutoFilter('google', propertyNameArray.dateParameters) && !cloudDesktopSidebarDateSearchService.filterRequested()) {
							autoFilter = cloudDesktopSidebarService.getAutoFilter('google', propertyNameArray.dateParameters);
							// cloudDesktopSidebarDateSearchService.resetFilter(cloudDesktopSidebarService.filterRequest, autoFilter);
							var event = null;
							var args = {
								searchType: 'google',
								parameters: autoFilter,
								options: cloudDesktopSidebarService.filterRequest
							};
							onAutoFilterChanged(event, args);
						} else {
							if (scope.searchOptions.filterRequest.moduleName !== cloudDesktopSidebarDateSearchService.currentModule) {
								onModuleChanged(scope.searchOptions.filterRequest);
							}
						}
						scope.dateParameters = cloudDesktopSidebarDateSearchService.selectedParameters;

						scope.dateConfig = {
							dateSelectOptions: {
								displayMember: 'Label',
								valueMember: 'Id',
								watchItems: true,
								items: cloudDesktopSidebarDateSearchService.currentSearchColumns
							},
							calendarOptions: {
								showClear: false,
								disablePopup: true
							},
							dateTagOptions: [],
							sliderOptions: {
								range: true,
								ticks: [0, 1439],
								tooltip: 'show',
								formatter: function (value) {
									return moment().startOf('day').add(value, 'minute').format('HH:mm');
								}
							},
							onSelectTag: function (tag) {
								scope.dateParameters.selectedTag = tag.Name;
								if (setDateSearch()) {
									triggerSearch();
								}
							},
							onTabSelect: function (tabId) {
								_.forEach(scope.dateParameters.tab, function (item) {
									item = false;
								});
								_.set(scope.dateParameters.tab, tabId, true);
								setDateSearch();
							}
						};

						// flag to prevent date filter from triggering
						// needs to be done when changing module or initializing the directive
						var initialFilter = true;

						function onModuleChanged(options) {
							cloudDesktopSidebarDateSearchService.resetFilter(options);
							cloudDesktopSidebarDateSearchService.filterRequested(false);
							initialFilter = true;
						}

						function onAutoFilterChanged(event, args) {
							if (args.searchType !== 'google') {
								return;
							}
							cloudDesktopSidebarDateSearchService.resetFilter(args.options, args.parameters);
							cloudDesktopSidebarDateSearchService.filterRequested(true);
							initialFilter = true;
						}

						function onFilterChanged() {
							scope.dateConfig.dateSelectOptions.items = cloudDesktopSidebarDateSearchService.currentSearchColumns;
							scope.dateParameters = cloudDesktopSidebarDateSearchService.selectedParameters;
							// if datesearch is valid -> set dateSearch
							setDateSearch();
						}

						function setDateSearch() {
							// always set parameters
							cloudDesktopSidebarDateSearchService.setParameters(scope.dateParameters);

							var field = scope.dateParameters.parameters.field;
							var value;
							var additionalParameters = [];
							if (scope.dateParameters.tab.calendar && scope.dateParameters.parameters.date) {
								var isoDate = scope.dateParameters.parameters.date.utcOffset(0)
									.set({hour: 0, minute: 0, second: 0, millisecond: 0});
								var timeSearch;
								if (scope.dateParameters.parameters.time) {
									var dateString = scope.dateParameters.parameters.date.format('DD.MM.YYYY');
									scope.dateParameters.formattedDate =
										dateString +
										' - ' +
										moment().startOf('day').add(scope.dateParameters.parameters.time[0], 'minute').format('HH:mm') +
										' | ' +
										dateString +
										' - ' +
										moment().startOf('day').add(scope.dateParameters.parameters.time[1], 'minute').format('HH:mm');
									timeSearch = scope.dateParameters.parameters.time[0] > 0 || scope.dateParameters.parameters.time[1] < 1439;
								} else {
									timeSearch = false;
								}
								if (timeSearch) {
									var startDate = moment(isoDate).add(scope.dateParameters.parameters.time[0], 'minute');
									var endDate = moment(isoDate).add(scope.dateParameters.parameters.time[1], 'minute');
									value = '[2,["rg",[["dt",{"v":"' + startDate.toJSON() + '"}],["dt",{"v":"' + endDate.toJSON() + '"}]],{}]]';
								} else {
									value = '[2,["dt",{"v":"' + isoDate.toJSON() + '"}]]';
								}
							} else if (scope.dateParameters.tab.tags && scope.dateParameters.selectedTag) {
								var tag = _.find(scope.environmentExpressionOptions.items, {Name: scope.dateParameters.selectedTag});
								if (tag) {
									value = '[2,["ee",{"v":["' + tag.Kind + '",' + tag.Id + ']}]]';
									if (!_.isNil(tag.Parameters)) {
										additionalParameters = _.map(tag.Parameters, (v, i) => {
											return {
												Token: `${field}_PARAMETER${i + 1}`,
												Value: JSON.stringify(v)
											};
										});
									}
								}
							}

							if (value && field) {
								// set search request
								scope.searchOptions.filterRequest.dateSearch = [{
									Token: field,
									Value: value
								}];
								scope.searchOptions.filterRequest.dateSearch.push(...additionalParameters);
								return true;
							} else {
								return false;
							}
						}

						function triggerSearch() {
							// set autofilter
							cloudDesktopSidebarService.setAutoFilter('google', scope.dateParameters, propertyNameArray.dateParameters);
							if (scope.searchOptions.filterRequest.includeDateSearch === false) {
								scope.searchOptions.filterRequest.includeDateSearch = true;
							}
							scope.searchOptions.onStartSearch();
						}

						cloudDesktopSidebarDateSearchService.fetchVariablePeriods().then(function (result) {
							scope.dateConfig.dateTagOptions = result;
							scope.environmentExpressionOptions.items = result;
							onFilterChanged();
						});

						// scope.$watch('searchOptions.filterRequest.includeDateSearch', function watchFn(newVal, oldVal) {
						// 	if (newVal && newVal !== oldVal && setDateSearch()) {
						// 		triggerSearch();
						// 	}
						// });

						scope.$watchGroup(['dateParameters.parameters.field',
							'dateParameters.parameters.date', 'dateParameters.parameters.time'], function watchFn(newVal, oldVal) {

							if (initialFilter) {
								initialFilter = false;
								return;
							}

							// evaluate changes
							if (setDateSearch() && (newVal[0] !== oldVal[0] || (moment.isMoment(newVal[1]) && !newVal[1].isSame(oldVal[1])) || !_.isEqual(newVal[2], oldVal[2]))) {
								triggerSearch();
							}
						});

						scope.environmentExpressionOptions = {
							displayMember: 'Name',
							onSelect: scope.dateConfig.onSelectTag,
							items: [],
							editMode: true
						};

						// un-register on destroy
						scope.$on('$destroy', function () {
							cloudDesktopSidebarService.onAutoFilterChanged.unregister(onAutoFilterChanged);
							cloudDesktopSidebarService.onModuleChanged.unregister(onModuleChanged);
							cloudDesktopSidebarDateSearchService.onFilterChanged.unregister(onFilterChanged);
						});
					}
				};
			}
		]
	);
})(angular, globals);
