/* global moment, d3 */
/* jshint -W072 */ // many parameters because of dependency injection
angular.module('scheduling.main').factory('schedulingMainLobService', ['_', '$log', '$injector', '$q', '$http', 'schedulingMainChartService', 'schedulingMainService', 'platformPermissionService', 'schedulingMainChartSettingsService', 'projectLocationMainService', 'platformModalService', 'projectMainService', '$translate', 'schedulingMainChartprintLookupService', 'schedulingMainPrintingProviderService',
	function (_, $log, $injector, $q, $http, chartservice, activityservice, platformPermissionService, settingsservice, locationservice, modalservice, project, t, printlookup, printservice) {
		/* global globals */
		'use strict';
		// platformTranslateService
		var _locations = [],
			colorscale = d3.scaleOrdinal(d3.schemeCategory10);
		var service = Object.create(chartservice, {
			lobActivities: {
				value: [],
				enumerable: true,
				writable: true
			},
			'hasLocations': {
				get: function () {
					return _locations.length > 0;
				},
				enumerable: true
			}
		});
		service.getSelectedActivity = function (containerId) {
			// Permission check
			if (!platformPermissionService.hasWrite(containerId.toLowerCase())) {
				return [];
			}

			var result = activityservice.getSelected();
			if (filterLobActivities(result)) {
				return [result];
			} else {
				return [];
			}
		};

		service.getTimeRange = function getTimeRange(containerId) {
			var mindate, maxdate,
				keydates = {
					min: null,
					max: null
				},
				eventdates = {
					min: null,
					max: null
				},
				mindates = [],
				maxdates = [];

			let plannedstarts = _.compact(_.map(service.activities, 'PlannedStart'));
			if (plannedstarts.length > 0 ) {
				mindates.push(moment.min(plannedstarts));
			}
			let actualstarts = _.compact(_.map(service.activities, 'ActualStart'));
			if (actualstarts.length > 0 ) {
				mindates.push(moment.min(actualstarts));
			}
			let currentstarts = _.compact(_.map(service.activities, 'CurrentStart'));
			if (currentstarts.length > 0 ) {
				mindates.push(moment.min(currentstarts));
			}
			let plannedFinishs = _.compact(_.map(service.activities, 'PlannedFinish'));
			if (plannedFinishs.length > 0 ) {
				maxdates.push(moment.max(plannedFinishs));
			}
			let actualFinishs = _.compact(_.map(service.activities, 'ActualFinish'));
			if (actualFinishs.length > 0 ) {
				maxdates.push(moment.max(actualFinishs));
			}
			let currentFinishs = _.compact(_.map(service.activities, 'CurrentFinish'));
			if (currentFinishs.length > 0 ) {
				maxdates.push(moment.max(currentFinishs));
			}

			// also take keydates into consideration
			var keydatesmin = _.compact(_.map(service.timelines, 'Date'));
			if (keydatesmin.length > 0) {
				keydates.min = moment.min(keydatesmin);
				keydates.max = moment.max(keydatesmin);
			}
			var keydatesmax = _.compact(_.map(service.timelines, 'EndDate'));
			if (keydatesmin.length > 0 && keydatesmax.length > 0) {
				keydates.max = moment.max([keydates.max, moment.max(keydatesmax)]);
			} else if (keydatesmax.length > 0) {
				keydates.max = moment.max(keydatesmax);
			}

			// also take eventdates into consideration
			if (service.getSettings(containerId).showEvents) {
				var eventdatesmin = _.compact(_.map(service.getEvents(containerId), 'Date'));
				if (eventdatesmin.length > 0) {
					eventdates.min = moment.min(eventdatesmin);
					eventdates.max = moment.max(eventdatesmin);
				}

				var eventdatesmax = _.compact(_.map(service.getEvents(containerId), 'EndDate'));
				if (eventdatesmin.length > 0 && eventdatesmax.length > 0) {
					eventdates.max = moment.max([eventdates.max, moment.max(eventdatesmax)]);
				} else if (eventdatesmax.length > 0) {
					eventdates.max = moment.max(eventdatesmax);
				}

				mindates.push(eventdates.min);
				maxdates.push(eventdates.max);
			}

			mindates = _.compact(mindates);
			if (mindates.length > 0) {
				mindate = moment.min(mindates);
			} else {
				mindate = moment.utc();
			}
			maxdates = _.compact(maxdates);
			if (maxdates.length > 0) {
				maxdate = moment.max(maxdates);
			} else { // all maxdates may be null
				maxdate = mindate.clone().add(6, 'months');
			}

			mindate.startOf('day');
			maxdate.endOf('day');



			return [mindate, maxdate];
		};

		service.setSelectedActivity = function setSelectedActivity(item) {
			activityservice.setSelected(item);
		};

		service.getVisibleLocations = function (containerId) {
			service.getLocations(containerId, true);
			var visibleLocations = _locations.filter(function (loc) {
				return !loc.LocationParentFk;
			});
			_.forEach(visibleLocations, function(loc) {
				loc.visible = _.findIndex(service.getSettings(containerId).hiddenLocations, function(a) {
					return a === loc.Id;
				}) === -1;
			});
			return visibleLocations;
		};

		service.setVisibleLocations = function (containerId, locations) {
			service.getSettings(containerId).hiddenLocations = locations.filter(function(loc) { return loc.visible === false; }).map(function (loc) { return loc.Id; } );
		};

		service.getLocations = function (containerId, nofilter) { // on-demand sorting
			var sortOrder = service.getSettings(containerId).sortOrder;
			_locations = sortLocations(_locations, sortOrder, 0);
			return nofilter? _locations : filterLocations(_locations);

			function filterLocations(locs) {
				var locations = _.clone(locs);
				locations = locations.filter(function (element) {
					return _.findIndex(service.getSettings(containerId).hiddenLocations, function(a) {
						return a === element.Id;
					}) === -1 && element.IsShownInChart && element.Quantity && element.Quantity > 0.0;
				});
				locations.forEach(function (loc) {
					loc.Locations = loc.Locations || [];
					loc.Locations = loc.Locations.filter(function (element) {
						return element.IsShownInChart && element.Quantity && element.Quantity > 0.0;
					});
					filterLocations(loc.Locations);
				});

				return locations;
			}
		};

		service.getSettings = function getSettings(containerId) {
			return settingsservice.getLobsettings(containerId);
		};
		service.saveSettings = function saveSettings(containerId) {
			settingsservice.saveSettings(containerId);
		};
		service.getLabels = getLabels;

		// internal fields
		var locationlist = []; // helper array for getLocationById. We do not use location services' getById method because our locations are specially filtered
		var legends = new Map(),
			setcolor = new Map(),
			criticals = new Map(); // only simple map as all containers share the same legend for lob.

		// formatters
		var containerinfo = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid('13120439D96C47369C5C24A2DF29238D');
		var infolist = new Map();
		containerinfo.layout.columns.forEach(function (item) {
			infolist.set(item.id, {
				formatter: item.formatter,
				formatterOptions: item.formatterOptions,
				field: item.field
			});
		});

		// messengers and listeners
		var fireDataUpdated = _.debounce(function () {
			if (_locations.length > 0) {
				service.dataUpdated.fire();
			}
		}, 0); // Initializes debounced firing function for dataUpdated which will not fire more than once every 100 milliseconds, no matter how often it gets called.

		// Loads data from dependent services that are not child services of schedulingmain service
		// and therefore not triggered by parent service
		service.load = load;

		service.showSettings = showSettings;

		service.showPrintSettings = showPrintSettings;

		service.preparePrintData = preparePrintDataAsync;

		service.update = fireDataUpdated; // make it accessible from outside

		setupHandlers();

		// Connected with all used data services
		service.connectToUsingDataServices = function connectToUsingDataServices(guid) {
			locationservice.addUsingContainer(guid);
			project.addUsingContainer(guid);
		};

		// Disconnect from all used data services
		service.disconnectFromUsingDataServices = function disconnectFromUsingDataServices(guid) {
			locationservice.removeUsingContainer(guid);
			project.removeUsingContainer(guid);
		};

		return service;

		// returns activities that 1) have no children of their own
		// 2) have a location
		// 3) are not of type "do not show" (corresponds to ActivityPresentationFk 4)
		// 4) the product of the location quantity and all quantities of parent locations is greater 0

		// This function is used in two places: 1) to filter out those activities that get displayed and are contained in the property lobactivities
		// 2) It is used on the selectedItem of the mainservice to only display it if it fits the above criteria
		function filterLobActivities(item) {
			if (!item || !item.LocationFk || item.ActivityPresentationFk === 4 || (item.Activities && item.Activities.length > 0)) {
				return null;
			}

			var rootitem = findRootItem(item.ParentActivityFk);

			if (!criticals.get(item.ParentActivityFk)) {
				criticals.set(item.ParentActivityFk, true);
			}

			if (!item.IsCritical) {
				criticals.set(item.ParentActivityFk, false); // only if ALL children are critical the parent gets label "critical"
			}

			var colorid = -1;
			if (rootitem) {
				if (rootitem.ChartPresentationFk !== null) {
					colorid = rootitem.ChartPresentationFk;
					item._color = service.colors.get(colorid);
					setcolor.set(item.Id, true);
				} else {
					colorid = item.ParentActivityFk;
					item._color = colorscale(item.ParentActivityFk);
					setcolor.set(item.Id, false);
				}
			} else { // special case for root groups
				item._color = colorscale(1);
			}

			item._colorid = colorid;

			return calcLocationQnty(item);

			function calcLocationQnty(item) {
				var result = 1.0;
				var recursioncount = 1;
				// we need our activity map for efficient lookup
				var firstlocation = getLocationById(item.LocationFk);
				if (firstlocation) {
					calcLocationProduct(firstlocation);
				} else {
					result = 0;
				}

				return result;

				function calcLocationProduct(location) {
					var nextlocation;
					if (recursioncount > 30) { // recursioncount is fallback against endless recursion if we
						// accidentally setup locations in a loop
						return;
					}
					recursioncount += 1;

					if (location.Quantity && location.Quantity > 0) {
						result *= location.Quantity;
						nextlocation = getLocationById(item.LocationFk);
						if (nextlocation) {
							calcLocationProduct(nextlocation);
						}
					} else {
						result = 0;
					}
				}

				function getLocationById(id) {
					return _.find(locationlist, {
						Id: id || 0
					});
				}
			}

			function findRootItem(id) {
				id = id || 0;
				var rootid = id;
				var startitem = service.getActivity(id);
				while (startitem) {
					startitem = service.getActivity(startitem.ParentActivityFk);
					if (startitem) {
						rootid = startitem.Id;
					}
				}

				return service.getActivity(rootid);
			}
		}

		function lookupFk(type, id) {
			switch (type) {
				case 'ChartPresentationFk':
					return service.presentation.get(id);
				case 'ActivityStateFk':
					return service.activitystate.get(id);
				case 'ActivityTypeFk':
					if (id === 1) {
						return service.translate('scheduling.main.barInformation.activity');
					} else if (id === 2) {
						return service.translate('scheduling.main.barInformation.summary');
					} else if (id === 3) {
						return service.translate('scheduling.main.barInformation.milestone');
					}
			}
		}

		function load(containerId) {
			var minimum = $q.all([loadLocationsAsync(), settingsservice.loadSettings(containerId), service.getHolidaysAsync()]);
			var additionaldata = [service.loadPresentationAttributes(), printlookup.getList(({
				lookupType: 'schedulingMainChartprintLookupService',
				displayMember: 'description'
			}))];
			minimum.then(function () {
				assignActivities();
				// here you could fire dataupdated but right now assignactivities already does.
				// In Angular 1.5 there may be an any operator for promises, which would be preferred to the
				// following solution
				additionaldata.forEach(function (promise) {
					promise.then(function () {
						settingsservice.getLobsettings(containerId).showWeekends = !settingsservice.getLobsettings(containerId).shouldHideWeekends; // workaround for initial freeze if weekends are off
						fireDataUpdated();
					});
				});
			});
		}

		function setupHandlers() {
			locationservice.registerItemModified(function () {
				processLocationsAndActivities();
			});
			locationservice.registerDataModified(function () {
				processLocationsAndActivities();
			});

			activityservice.registerSelectedProjectChanged(processLocationsAndActivities);
			activityservice.registerListLoaded(processLocationsAndActivities); // only relevant for reload button
			activityservice.registerDataModified(assignActivities); // when loading we have both events, therefore double work. solution?
			activityservice.registerItemModified(assignActivities);
		}

		function showSettings(containerId) {
			service.lastContainerID = containerId;
			modalservice.showDialog({
				headerTextKey: 'boq.main.gaebExport',
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/dialog.html',
				controller: 'schedulingMainLobSettingsDialogController'
			});
		}

		function processLocationsAndActivities() {
			loadLocationsAsync().then(assignActivities);
		}

		// if we do not have a selected project id we do not proceed
		// depends on schedule project id
		// we get that from the scheduling service
		function loadLocationsAsync() {
			var locationp = $q.defer();
			var selectedProjectId = activityservice.getSelectedProjectId();
			if (!selectedProjectId) {
				_locations = [];
				locationp.reject('need project id');
				return locationp.promise; // stop processing. wait for setting
			}

			var currentproject = project.getSelected();
			if (currentproject && currentproject.Id === selectedProjectId) { // locally loaded locations by project main service
				_locations = processLocations(locationservice.getTree());
				if (_locations.length > 0) {
					locationp.resolve(_locations);
				} else {
					locationp.reject('no locations');
				}
			} else {
				locationservice.getLocationStructure(selectedProjectId).then(function (ret) { // project is not loaded, therefore manual load of locations
					// alternative solution would be to trigger the loading of the project in the scheduling main service.
					// if we have more services that we use that depend on project, we should switch to this solution
					_locations = processLocations(ret.data);
					if (_locations.length > 0) {
						locationp.resolve(_locations);
					} else {
						locationp.reject('no locations');
					}
				});
			}

			return locationp.promise;
		}

		function sortLocations(locations, sortOrder, level) {
			var ascending = sortOrder[level];
			if (typeof (ascending) === 'undefined') { // default for all levels is true
				ascending = true;
			}
			// IMPORTANT NOTE: asc and desc are swapped here because from the Javascript side drawing starts from top
			// but from user side drawing starts from bottom
			locations = _.orderBy(locations, ['Code'], ascending ? ['desc'] : ['asc']);
			locations.forEach(function (loc) {
				loc.Locations = sortLocations(loc.Locations, sortOrder, level + 1);
			});

			// now that Locations are already sorted by Code, sort them by field 'Sorting'
			// We therefore achieve the following sorting order: 1. Sorting, 2. Code.
			locations = _.orderBy(locations, ['Sorting'], ascending ? ['desc'] : ['asc']);
			locations.forEach(function (loc) {
				loc.Locations = sortLocations(loc.Locations, sortOrder, level + 1);
			});

			return locations;
		}

		function processLocations(loc) {
			var locations = filterLocations(loc);
			locationlist.length = 0;
			flatten(locations, locationlist, 'Locations');
			return locations;

			function filterLocations(locations) {
				locations = locations.filter(function (element) {
					return element.IsShownInChart && element.Quantity && element.Quantity > 0.0;
				});
				locations.forEach(function (loc) {
					loc.Locations = loc.Locations || [];
					loc.Locations = loc.Locations.filter(function (element) {
						return element.IsShownInChart && element.Quantity && element.Quantity > 0.0;
					});
					filterLocations(loc.Locations);
				});

				return locations;
			}
		}

		function flatten(input, output, childProp) {
			var i;
			for (i = 0; i < input.length; i++) {
				output.push(input[i]);
				if (input[i][childProp] && input[i][childProp].length > 0) {
					flatten(input[i][childProp], output, childProp);
				}
			}
			return output;
		}

		// returns activities that 1) have no children of their own
		// 2) have a location
		// 3) are not of type "do not show" (corresponds to ActivityPresentationFk 4)
		// 4) the product of the location quantity and all quantities of parent locations is greater 0
		// This function also fires a data changed message
		function assignActivities() {
			legends.clear();
			var activities = activityservice.getList();
			var activityarray = [];
			var group, subgroup, filteredsubgroup, parent;

			// we group the flat activities by their immediate parent
			var flatwithparent = _.groupBy(activities, function (n) {
				return n.ParentActivityFk;
			});

			/* jshint -W089 */ // object with prototype 'null'
			for (group in flatwithparent) {
				// we filter out groups without children, we also filter out children that do not have a location or whose location quantity is 0. root groups are a special case and grouped under a temporary root group.
				subgroup = flatwithparent[group];
				if (subgroup) {
					filteredsubgroup = subgroup.filter(filterLobActivities);
					if (filteredsubgroup.length > 0) {
						/* jshint -W083 */ // little function
						parent = activities
							.filter(function (item) {
								return item.Id === filteredsubgroup[0].ParentActivityFk;
							})[0];

						if (filteredsubgroup[0].ParentActivityFk === null) {
							parent = {
								Code: t.instant('scheduling.main.activityRootSummaryCode'),
								Description: t.instant('scheduling.main.activityRootSummaryDescription'),
								id: 'rootgroup'
							};
						}
						// fallback for unset loblabelplacementfk
						if (_.isNull(parent.LobLabelPlacementFk)) {
							parent.LobLabelPlacementFk = 3; // 1 means hidden, 2 left 3 centered 4 right aligned label;
						}
						activityarray.push({
							id: subgroup[0].ParentActivityFk,
							code: parent.Code,
							alignment: parent.LobLabelPlacementFk,
							filteredActivities: filteredsubgroup
						});
					}
				}
			}

			// fallback for empty array
			if (activityarray.length === 0) {
				activityarray.push({
					id: -1,
					filteredActivities: []
				});
			}

			service.lobActivities = activityarray;

			fireDataUpdated();

			return activityarray;
		}

		function getLabels(containerId, printmode) {
			var labels = [];

			// Group Level 1 provides code
			// Group Level 2: find middle item and provide start/finish
			service.lobActivities.forEach(function (group) {
				// To determine the middle item we just sort by PlannedStart, then take the middle item
				group.filteredActivities.sort(function (a, b) {
					return a.PlannedStart - b.PlannedStart;
				});
				var middleindex = getMiddleIndex(group.filteredActivities);

				if (service.getSettings(containerId).showBarInformation === 'summary') {
					_.forEach(group.filteredActivities, function (activity, index) {
						if (index === middleindex) {
							var groupobject = {
								Id: group.id,
								Code: buildCode(containerId, group.id, false, printmode),
								LocationFk: activity.LocationFk,
								PlannedStart: activity.PlannedStart,
								PlannedFinish: activity.PlannedFinish,
								ActivityPresentationFk: activity.ActivityPresentationFk,
								Alignment: activity.LobLabelPlacementFk
							};
							labels.push(groupobject);
						}
					});
				} else if (service.getSettings(containerId).showBarInformation === 'activity') {
					// check if group has subelements with lob label option set or not,
					// if true use label on activity level, if false use label on summary level
					var filteredagain = _.filter(group.filteredActivities,
						function (element) {
							return !_.isNull(element.LobLabelPlacementFk) && element.LobLabelPlacementFk > 1;
						});

					if (filteredagain.length === 0) { // we use the labels on summary level
						var comparableindex = group.LobLabelPlacementFk === 1 ? 0 : group.LobLabelPlacementFk === 3 ? middleindex : group.filteredActivities.length - 1;
						_.forEach(group.filteredActivities, function (activity, index) {
							if (index === comparableindex && group.alignment && group.alignment !== 1) {
								var groupobject = {
									Id: group.id,
									Code: buildCode(containerId, group.id, false, printmode), // what is that mode setting (arg 3)
									LocationFk: activity.LocationFk,
									PlannedStart: activity.PlannedStart,
									PlannedFinish: activity.PlannedFinish,
									ActivityPresentationFk: activity.ActivityPresentationFk,
									Alignment: group.alignment
								};
								labels.push(groupobject);
							}
						});
					} else {
						_.forEach(filteredagain, function (activity) { // we use the labels on activity level
							var singleobject = {
								Id: activity.Id,
								Code: buildCode(containerId, activity.Id, false, printmode), // what is that mode setting (arg 3)
								LocationFk: activity.LocationFk,
								PlannedStart: activity.PlannedStart,
								PlannedFinish: activity.PlannedFinish,
								ActivityPresentationFk: activity.ActivityPresentationFk,
								Alignment: activity.LobLabelPlacementFk
							};
							labels.push(singleobject);
						});
					}
				} else {
					return labels; // case 'none' or other weird case
				}
			});

			return labels;

			function getMiddleIndex(myarray) {
				var length = myarray.length;
				return Math.ceil(length / 2) - 1;
			}

			function buildCode(containerId, groupId, mode, printmode) {
				var activity = service.getActivity(groupId) || {
					Code: t.instant('scheduling.main.activityRootSummaryCode'),
					Description: t.instant('scheduling.main.activityRootSummaryDescription'),
					ActivityTypeFk: 2
				}; // if no match this can only mean we are dealing with artifical root group (temporary group wrapped around all root items)
				if (!service.getSettings(containerId).showBarInformation) {
					return null;
				}
				var index = activity.ActivityTypeFk - 1;
				if (index > 2) {
					index = 0;
				}
				var barinfo = service.getSettings(containerId).barinformation[index];
				var result;
				if (index === 1 || index === 2) {
					if (mode && activity.LobLabelPlacementFk === 2) {
						result = settingsservice.getFormatter(barinfo.left, infolist)(activity, printmode) || '';
					} else if (mode && activity.LobLabelPlacementFk === 3) {
						result = settingsservice.getFormatter(barinfo.middle, infolist)(activity, printmode) || '';
					} else if (mode && activity.LobLabelPlacementFk === 4) {
						result = settingsservice.getFormatter(barinfo.right, infolist)(activity, printmode) || '';
					} else {
						result = (settingsservice.getFormatter(barinfo.left, infolist)(activity, printmode) || '') + ' ' + (settingsservice.getFormatter(barinfo.middle, infolist)(activity, printmode) || '') + ' ' + (settingsservice.getFormatter(barinfo.right, infolist)(activity, printmode) || '');
					}
				} else if (index === 0) {
					if (!mode) {
						result = (settingsservice.getFormatter(barinfo.left, infolist)(activity, printmode) || '') + ' ' + (settingsservice.getFormatter(barinfo.middle, infolist)(activity, printmode) || '') + ' ' + (settingsservice.getFormatter(barinfo.right, infolist)(activity, printmode) || '');
					} else {
						switch (activity.LobLabelPlacementFk) {
							case 2:
								result = settingsservice.getFormatter(barinfo.left, infolist)(activity, printmode) || '';
								break;
							case 3:
								result = settingsservice.getFormatter(barinfo.middle, infolist)(activity, printmode) || '';
								break;
							case 4:
								result = settingsservice.getFormatter(barinfo.right, infolist)(activity, printmode) || '';
								break;
						}
					}
				}
				return result;
			}
		}

		function preparePrintData(containerId) {
			var currentprintsettings = getSettings(containerId);
			return {
				locations: getPrintLocations(containerId),
				activitiesByTemplate: [],
				settings: currentprintsettings,
				weekends: getWeekends(),
				holidays: getHolidays(),
				activities: [],
				relationships: [],
				locActivities: getLocActivities(),
				labels: service.getLabels(containerId, true),
				timelines: settingsservice.getLobsettings(containerId).showTimelines ? service.timelines.forEach(function (timeline) {
					timeline.Text = _.escape(timeline.Text);
				}) : [],
				exceptionDates: getExceptionDates(),
				workingDays: service.workingDays,
				legends: getLegends(),
				translations: service.translations
			};

			function getLegends() {
				var legends = new Map();
				service.lobActivities.forEach(function (level1) {
					level1.filteredActivities.forEach(function (item) {
						if (!legends.has(item._colorid)) {
							var parent = service.getActivity(item.ParentActivityFk);
							if (currentprintsettings.showCritical && (item.IsCritical || criticals.get(item.ParentActivityFk) === true)) { // Handle critical path
								legends.set('isCritical', {
									name: 'Critical Path',
									count: 1,
									color: '#FF0000'
								});
							} else {
								legends.set(item._colorid, {
									name: _.escape(setcolor.get(item.Id) ? lookupFk('ChartPresentationFk', item._colorid) : parent ? parent.Description : t.instant('scheduling.main.activityRootSummaryDescription')),
									count: 1,
									color: item._color
									// pattern, bar height etc. maybe later
								});
							}
						} else {
							legends.get(item._colorid).count++; // no. of occurences can be used for sorting the legend
						}
					});
				});

				return service.getValuesFromMap(legends);
			}

			function getHolidays() {
				return settingsservice.getLobsettings(containerId).showWeekends ? service.holidays.forEach(function (holiday) {
					holiday.Text = _.escape(holiday.Text);
				}) : [];
			}

			function getExceptionDates() { // throw out description infos that are not needed for printing. also
				return service.exceptionDates.map(function (item) { // unescaped tokens in description info can break JSON
					var newitem = _.clone(item);
					newitem.DescriptionInfo = null;
					return newitem;
				});
			}

			function getWeekends() {
				return settingsservice.getLobsettings(containerId).showWeekends ? service.weekends : [];
			}

			function getPrintLocations(containerId) {
				var printmode = true;
				var loccopy = _.cloneDeep(service.getLocations(containerId)); // using property service.locations instead of field _locations to trigger sorting
				var flatlocs = [];
				flatten(loccopy, flatlocs, 'Locations');
				flatlocs.forEach(function (e) { // we have to throw out helper properties generated by d3 layout helper because of
					e.children = undefined; // circular references. the structure is generated again on the server.
					e.dx = undefined;
					e.dy = undefined;
					e.parent = undefined;
					if (printmode) {
						var description = e.DescriptionInfo.DescriptionTr || e.DescriptionInfo.Description;
						e._description = JSON.stringify(description).slice(1, -1);
						e.DescriptionInfo = undefined;
						e.Code = JSON.stringify(e.Code).slice(1, -1);
					}
				});

				return loccopy;
			}

			function getSettings(containerId) {
				var settings = angular.copy(settingsservice.getLobsettings(containerId).printing);
				var timerange = service.timerange;

				if (settings.useReportRange) {
					if (settings.reportRangeStart) {
						settings.minimum = settings.reportRangeStart.isBefore(timerange[0]) ? timerange[0] : settings.reportRangeStart;
					} else {
						settings.minimum = timerange[0];
					}

					if (settings.reportRangeEnd) {
						settings.maximum = settings.reportRangeEnd.isAfter(timerange[1]) ? timerange[1] : settings.reportRangeEnd;
					} else {
						settings.maximum = timerange[1];
					}
				} else {
					settings.minimum = timerange[0];
					settings.maximum = timerange[1];
				}

				// copy some more settings for printing purposes
				var moresettings = settingsservice.getLobsettings(containerId);
				settings.verticalLines = moresettings.verticalLines;
				settings.showVerticalLines = moresettings.showVerticalLines;
				settings.showCritical = moresettings.showCritical;
				settings.timescalePosition = moresettings.timescalePosition;
				settings.showWeekends = moresettings.showWeekends;
				settings.locationbarwidth = moresettings.locationbarwidth;
				settings.showLocationConnections = moresettings.showLocationConnections;
				settings.locale = moment.locale();

				return settings;
			}

			function getLocActivities() {
				var mappedShallow = [];
				service.lobActivities.forEach(function (level1) {
					var filtered = level1.filteredActivities.map(function (item) {
						return {
							Id: item.Id,
							ParentActivityFk: item.ParentActivityFk,
							LocationFk: item.LocationFk,
							ActivityPresentationFk: item.ActivityPresentationFk,
							Quantity: item.Quantity,
							PlannedStart: item.PlannedStart,
							PlannedFinish: item.PlannedFinish,
							IsCritical: item.IsCritical,
							_color: item._color,
							_rootcolor: item._rootcolor,
							_description: item.DescriptionInfo ? item.DescriptionInfo.Translated : null
						};
					});
					mappedShallow.push({
						filteredActivities: filtered
					});
				});
				return mappedShallow;
			}
		}

		/**
		 * @ngdoc function
		 * @name getReport
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns an report object from the server.
		 * @param {( int )} reportId The ID of the report
		 * @returns { object } An report object
		 */
		function getReport(reportId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/reporting/report/reportById?id=' + reportId
			})
				.then(function (response) {
					return response.data;
				}, function (error) {
					$log.error(error);
				});
		}

		function preparePrintDataAsync(containerId) {
			var printdataAsync = $q.defer();
			var printsettings = settingsservice.getLobsettings(containerId).printing;

			function loadHeadersAsync() {
				var loadHeaders = $q.defer();
				if (service.activities.length === 0 || printsettings.reportHeaderId < 0) { // skip service call
					printsettings.reportHeader = '';
					printsettings.reportHeaderPath = '';
					loadHeaders.resolve('');
				} else {
					getReport(printsettings.reportHeaderFk).then(function (localreport) {
						printsettings.reportHeader = localreport.FileName;
						printsettings.reportHeaderPath = localreport.FilePath.replace('\\', ':'); // path seperators break json
						$http.get(globals.webApiBaseUrl + 'scheduling/main/reporting/createheader', {
							params: {
								activityid: service.activities.filter(function (item) {
									return item.Id >= 0;
								})[0].Id,
								reportname: printsettings.reportHeader,
								reportpath: printsettings.reportHeaderPath.replace(':', '\\'),
								useReportRange: printsettings.useReportRange,
								reportRangeStart: printsettings.reportRangeStart || new moment.utc(),
								reportRangeEnd: printsettings.reportRangeEnd || new moment.utc()
							}
						}).then(function (response) {
							loadHeaders.resolve(response.data);
						});
					});
				}
				return loadHeaders.promise;
			}

			function loadFootersAsync() {
				var loadFooters = $q.defer();
				if (service.activities.length === 0 || printsettings.reportFooterId < 0) { // skip service call
					printsettings.reportFooter = '';
					printsettings.reportFooterPath = '';
					loadFooters.resolve('');
				} else {
					getReport(printsettings.reportFooterFk).then(function (localreport) {
						printsettings.reportFooter = localreport.FileName;
						printsettings.reportFooterPath = localreport.FilePath.replace('\\', ':'); // path seperators break json
						$http.get(globals.webApiBaseUrl + 'scheduling/main/reporting/createfooter', {
							params: {
								activityid: service.activities.filter(function (item) {
									return item.Id >= 0;
								})[0].Id,
								reportname: printsettings.reportFooter,
								reportpath: printsettings.reportFooterPath.replace(':', '\\'),
							}
						}).then(function (response) {
							loadFooters.resolve(response.data);
						});
					});
				}
				return loadFooters.promise;
			}

			$q.all([loadHeadersAsync(), loadFootersAsync()]).then(function (response) {
				var result = preparePrintData(containerId);
				printservice.headerreport = response[0];
				printservice.footerreport = response[1];
				printdataAsync.resolve(result);
			});

			return printdataAsync.promise;
		}

		function showPrintSettings(containerId) {
			service.lastContainerID = containerId;
			modalservice.showDialog({
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/lob-print.html',
				controller: 'schedulingMainLobPrintSettingsController'
			});
		}
	}
]);
