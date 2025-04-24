/* global d3, moment globals Platform */
/**
 *
 * @ngdoc service
 * @name scheduling.main.schedulingMainGANTTService
 * @function
 * @requires schedulingMainService, calendarUtilitiesService
 *
 * @description
 * #GANTTService
 * 1) Provides data for the GANTT control, collecting it from several injected services
 */
/* jshint -W072 */ // many parameters because of dependency injection
// noinspection JSAnnotator
angular.module('scheduling.main').factory('schedulingMainGANTTService', ['_', 'schedulingMainChartService', '$log', '$timeout', '$http', '$q', '$injector', 'schedulingMainService', 'platformPermissionService', 'calendarUtilitiesService',
	'schedulingMainRelationshipAllService',
	'schedulingMainEventAllService', 'platformModalFormConfigService', 'schedulingMainActivityStandardConfigurationService', 'schedulingMainRelationshipConfigurationService', 'schedulingMainChartSettingsService', 'platformDialogService',
	'ServiceDataProcessDatesExtension', 'schedulingMainEventTypeService', 'basicsCustomizeEventIconService', 'schedulingMainRelationshipValidationService', 'schedulingMainActivityValidationService', 'schedulingMainPrintingProviderService',
	'schedulingMainChartprintLookupService', 'schedulingMainHammockAllService',
	function (_, chartservice, $log, $timeout, $http, $q, $injector, activityservice, platformPermissionService, calendarUtilitiesService, rsservice, eventservice, modalconfig, activitylayout, rslayout, settingsservice, modal, Processdates,
		eventtypeservice, eventiconservice, schedulingMainRelationshipValidationService, schedulingMainActivityValidationService, printservice, printlookup, hammockservice) {
		'use strict';

		// chart presentation, activity state, activity type

		var baselinemap, ganttactivities = new Map(),
			middle = new Map(),
			activityinfo = new Map(),
			legends = new Map(),
			baselinedates = {
				min: null,
				max: null
			};

		var service = Object.create(chartservice, {
			'icondefinitions': {
				writable: true,
				enumerable: true,
				value: new Map()
			},
			'progressdates': {
				writable: true,
				enumerable: true,
				value: new Map()
			}, // holds additional data for one activity
			'eventicons': {
				writable: true,
				enumerable: true,
				value: new Map()
			}
		});

		service.getSelectedActivity = function (containerId) {
			// permission check
			if (!platformPermissionService.hasWrite(containerId.toLowerCase())) {
				return [];
			}

			var result = activityservice.getSelected();

			if (result && (result.ActivityTypeFk !== 2) && settingsservice.plannedTmplIsVisible(containerId)) {
				return [result];
			} else {
				return [];
			}
		};

		service.setSelectedActivity = function setSelectedActivity(item) {
			activityservice.setSelected(item);
		};

		var splitsmap = new Map();
		var progresssplitsmap = new Map();
		var breaks = [];

		service.getSplits = function () {
			return splitsmap;
		};

		service.getProgressSplits = function () {
			return progresssplitsmap;
		};

		service.getBreaks = function () {
			return breaks;
		};

		service.getProgresslines = function (containerId) {
			return getSettings(containerId).showProgresslines ? settingsservice.getProgresslines(containerId).filter(function (item) {
				return item.show && moment.isMoment(item.date);
			})
				.sort(function (item1, item2) {
					return item1.date - item2.date;
				}) : [];
		};

		service.getEvents = function getEvents(containerId) {
			return (getSettings(containerId).showEvents && (settingsservice.plannedTmplIsVisible(containerId) || settingsservice.currentTmplIsVisible(containerId))) ? // now events are visible on current and planned ALM 117612
				eventservice.getList().filter(function (event) {
					// return event.IsDisplayed;

					// workaround for process dates issue to be investigated
					if (event.IsDisplayed) {
						if (event.Date) {
							event.Date = moment.utc(event.Date);
						}
						if (event.EndDate) {
							event.EndDate = moment.utc(event.EndDate);
						}
						return moment.isMoment(event.Date);
					}
				}) : [];
		};

		service.getRelationships = function getRelationships(containerId) {
			return (getSettings(containerId).showRelationships && settingsservice.getActiveTemplates(containerId).length > 0) ?
				_.concat($injector.get('schedulingMainRelationshipService').getList(),rsservice.getList()) ||  [] : [];
			// rsservice.getList() || [] : [];
		};

		service.getSettings = getSettings;

		function getSettings(containerId) {
			return settingsservice.getGANTTsettings(containerId);
		}

		service.getHammocks = function getHammocks(containerId) {
			var settings = getSettings(containerId);
			if (settings && !settings.showHammock) {
				return [];
			}
			if (activityservice.getSelected()) {
				return activityservice.getSelectedEntities().filter(function (item) {
					return item.ActivityTypeFk === 5 && item.Id !== -1;
				});
			} else {
				return [];
			}
		};

		service.getHammockColor = function getHammockColor() {
			if (activityservice.getSelected() && activityservice.getSelected().ActivityTypeFk === 5) {
				return service.colors.get(activityservice.getSelected().ChartPresentationFk) || 'green';
			} else {
				return 'green';
			}
		};

		service.addHammockActivity = function addHammockActivity3(targethammockid, activitytoaddid) {
			var hammockActivity = activityservice.getItemById(targethammockid);
			var addedActivity = activityservice.getItemById(activitytoaddid);
			var activities = [];
			var ids = _.map(hammockservice.getHammockList(), 'ActivityMemberFk');
			_.forEach(ids, function (id) {
				activities.push(activityservice.getItemById(id));
			});
			activities.push(addedActivity);
			hammockservice.CreateHammockCompleteAndSync2(hammockActivity, activities).then(function (response) {
				var hammockvalidation = $injector.get('schedulingMainHammockValidationService');
				var newhammock = response.data[0];
				hammockvalidation.validateActivityMemberFk(newhammock, activitytoaddid, 'ActivityMemberFk');
				hammockvalidation.asyncValidateActivityMemberFk(newhammock, activitytoaddid, 'ActivityMemberFk');
			});
		};

		service.getHammockActivities = function getHammockActivities(containerId) {
			var settings = getSettings(containerId);
			if (settings && !settings.showHammock) {
				return [];
			}
			return _.map(hammockservice.getHammockList(), 'ActivityMemberFk');
		};

		var fireDataUpdatedSlow = _.debounce(function () {
			service.dataUpdated.fire();
		}, 75); // Initializes debounced firing function for dataUpdated which will not fire more than once every 75 milliseconds, no matter how often it gets called. (3 frames of 60 frames per second)

		var fireDataUpdatedFast = _.debounce(function () {
			service.dataUpdated.fire();
		}, 15); // Initializes debounced firing function for dataUpdated which will not fire more than once every 15 milliseconds (1 frame of 60 frames per second)

		service.update = fireDataUpdatedSlow; // make it accessible from outside

		service.updateFast = fireDataUpdatedFast;

		service.getProgressDate = getProgressDate;

		service.lookupEventtype = function lookupEventtype(id) {
			return eventservice.getTypeDescriptionOf(id);
		};

		service.loadBaselines = function loadBaselines(containerId, newItem) {
			return settingsservice.loadBaselines(containerId, newItem).then(loadbaselineActivities(containerId)).then(
				function () {
					prepareActivityData(containerId);
					fireDataUpdatedSlow();
				});
		};

		service.loadbaselineActivities = loadbaselineActivities;

		service.editRelationship = editRelationship;

		service.editActivity = editActivity;

		service.showSettings = showSettings;

		service.showTemplates = showTemplates;

		service.showPrintSettings = showPrintSettings;

		service.preparePrintData = preparePrintDataAsync;

		service.registerBaselinesChanged = function registerBaselinesChanged(handler) {
			settingsservice.baselinesChanged.register(handler);
		};

		service.unregisterBaselinesChanged = function registerBaselinesChanged(handler) {
			settingsservice.baselinesChanged.unregister(handler);
		};

		service.load = load;

		service.clearMaps = function (containerId) {
			if (containerId) {
				ganttactivities.delete(containerId);
				middle.delete(containerId);
			} else {
				ganttactivities.clear();
				middle.clear();
			}
		};

		service.insertNewTask = activityservice.insertNewTask;

		service.getActivities = function (containerId) {
			return ganttactivities.get(containerId) || [];
		};

		service.setSelectedActivityId = function setSelectedActivityId(id) {
			var defer = $q.defer();
			var item = service.getActivity(id);
			if (item) {
				return activityservice.setSelected(item);
			}
			defer.resolve(null); // no match
			return defer.promise;
		};

		service.getMiddle = function getMiddle(containerId) {
			return middle.get(containerId) || [0, 1];
		};

		setupHandlers();

		// Connected with all used data services
		service.connectToUsingDataServices = function connectToUsingDataServices(guid) {
			// calendarUtilitiesService.addUsingContainer(guid); // calendarUtilitiesServices does not have method addusing yet
			rsservice.addUsingContainer(guid);
			eventservice.addUsingContainer(guid);
			eventtypeservice.addUsingContainer(guid);
		};

		// Disconnect from all used data services
		service.disconnectFromUsingDataServices = function disconnectFromUsingDataServices(guid) {
			// calendarUtilitiesService.removeUsingContainer(guid); // calendarUtilitiesServices does not have method addusing yet
			rsservice.removeUsingContainer(guid);
			eventservice.removeUsingContainer(guid);
			eventtypeservice.removeUsingContainer(guid);
		};

		service.scrolling = new Platform.Messenger();

		service.savePosition = new Platform.Messenger();

		service.getFilteredRelationships = getFilteredRelationships;

		service.addRelationship = function(parentActivityFk, childActivityFk, relationKindFk) {
			rsservice.addRelationship(parentActivityFk, childActivityFk, relationKindFk)
				.then(function (result) {
					let rs = result.RelationshipsToSave;
					if (_.isArray(rs) && rs.length > 0) {
						$http.get(globals.webApiBaseUrl + 'scheduling/main/relationship/list?mainItemId=' + rs[0].Id).then(function (response) {
							if (response.data) {
								rsservice.takeOverRelations(response.data, true);
							}
						});

						// rsservice.loadAllRelationships().then(function(result) {
						// });
					}
					// item may changed due to the relationship creation
					var modifiedItem = activityservice.getItemById(childActivityFk);
					if (modifiedItem) {
						activityservice.markItemAsModified(modifiedItem);
					}
					// serviceContainer.data.onDataFilterChanged(); // refresh for relationships
				});
		};

		service.loadEventTypes = loadEventTypes;

		service.getTimeRange = getTimeRange;

		service.getActivityInfo = function (containerId) {
			if (getSettings(containerId).showBarInformation) {
				return activityinfo.get(containerId) || [];
			} else {
				return [];
			}
		};

		service.getAccessProperty = getAccessPropertyForRS;

		service.rawsplits = [];

		return service;

		function load(containerId) {
			if (!containerId) {
				throw 'no containerId';
			}
			hammockservice.load(); // synchronous load of hammock. display via handler on selection changed;
			settingsservice.loadSettings(containerId); // settings are now synchronous and no longer return a promise
			// The following services are needed as a minimum
			var minimum = $q.all([settingsservice.loadTemplates(containerId), loadEventTypes(), service.getHolidaysAsync()]);

			// The following services are optional
			var additionaldata = [settingsservice.loadLookups(containerId), loadSplitActivities(containerId),
				loadbaselineActivities(containerId), loadProgressDates(containerId), service.loadPresentationAttributes(),
				printlookup.getList(({
					lookupType: 'schedulingMainChartprintLookupService',
					displayMember: 'description'
				}))];
			minimum.then(function () {
				updateProgresstemplates(containerId); // update templates before
				prepareActivityData(containerId);
				prepareActivityInfo(containerId);
				// here you could fire dataupdated but right now assignactivities already does.
				// In Angular 1.5 there may be an any operator for promises, which would be preferred to the
				// following solution
				additionaldata.forEach(function (promise) {
					promise.then(function () {
						prepareActivityData(containerId);
						getSettings(containerId).showWeekends = !getSettings(containerId).shouldHideWeekends; // workaround for initial freeze if weekends are off
						fireDataUpdatedSlow();
					});
				});
			});
			return minimum;
		}

		function loadEventTypes() {
			var eventtypesAsync = $q.defer();
			var eventiconmap = new Map(),
				icondefinitions = new Map();
			// eventtypeservice.assertEventTypes(); // Ensure the types are actually loaded;
			eventtypeservice.load().then(function () {
				var eventtypes = eventtypeservice.getList();
				// get the first icon url
				var newiconurl = eventiconservice.getItemById(eventtypes[0].Icon).res;
				if (!newiconurl) {
					return eventtypesAsync.promise;
				}
				var iconuri = newiconurl.split(['#'])[0];

				$http.get(iconuri).then(function (result) {
					var htmlDoc = new DOMParser().parseFromString(result.data, 'text/html');
					var svgdocument = d3.select(htmlDoc);
					eventtypes.forEach(function (eventtype) {
						var newiconurl = eventiconservice.getItemById(eventtype.Icon).res;
						if (newiconurl) {
							var iconid = newiconurl.split(['#'])[1];
							var newiconpath = svgdocument.select('svg#' + iconid + ' path'); // access the event icon template via d3 selectors...
							if (!newiconpath.empty()) {
								icondefinitions.set(iconid, newiconpath.attr('d'));
								eventiconmap.set(eventtype.Id, '#' + iconid);
							}
						}
					});
					service.icondefinitions = icondefinitions;
					service.eventicons = eventiconmap;
					eventtypesAsync.resolve(eventiconmap);
				});
			});

			return eventtypesAsync.promise;
		}

		function refreshSplitActivities() {
			splitsmap.clear();
			progresssplitsmap.clear();
			breaks.length=0;
			var lastactivity = 0;

			_.forEach(service.rawsplits, function (el) {
				var item = service.getActivity(el.ActivityFk);
				if (lastactivity !== el.ActivityFk) {
					var filtered = service.rawsplits.filter(split=>split.ActivityFk === el.ActivityFk && split.IsBreak === false);
					var durationsum = 0;
					filtered.forEach(function(item) {
						durationsum+= item.PlannedDuration;
					});
					splitsmap.set(el.ActivityFk, []);
					var splitsarray = [];
					splitsarray.remaining = durationsum * item.PercentageCompletion / 100;
					progresssplitsmap.set(el.ActivityFk, splitsarray);
				}

				var array = splitsmap.get(el.ActivityFk);
				array.push({start:moment.utc(el.PlannedStart), end:moment.utc(el.PlannedEnd).endOf('d')});
				splitsmap.set(el.ActivityFk, array);

				var arrayprogress = progresssplitsmap.get(el.ActivityFk);
				var piecelength = moment.utc(el.PlannedEnd).diff(moment.utc(el.PlannedStart), 'days') + 1;
				if (!arrayprogress.stop) {
					if (el.IsBreak) {
						arrayprogress.push({start:moment.utc(el.PlannedStart), end:moment.utc(el.PlannedEnd).endOf('d')});
					}
					else if (arrayprogress.remaining > piecelength) {
						arrayprogress.remaining = arrayprogress.remaining-piecelength;
						arrayprogress.push({start:moment.utc(el.PlannedStart), end:moment.utc(el.PlannedEnd).endOf('d')});
					} else {
						// var newend = moment.utc(el.PlannedStart).clone().add(arrayprogress.remaining, 'days');
						var newend = moment.utc(el.PlannedStart).clone();
						while (arrayprogress.remaining > 0) {
							// let's say we have 10 days, now we walk through the days and add them or skip them if they
							// are weekends
							newend.add(1, 'days');
							// if is weekend do not subtract from modified duration
							if (isWeekend(newend)) {
								// add another day;
								newend.add(1, 'days');
							} else {
								arrayprogress.remaining--;
							}
						}
						if (arrayprogress.remaining !== 0) {
							newend.add(arrayprogress.remaining * 24, 'hours');
						}

						arrayprogress.push({start:moment.utc(el.PlannedStart), end:newend});
						arrayprogress.push({start:newend, end:moment.utc(item.PlannedFinish).endOf('d')});
						arrayprogress.stop = true;
					}
				}

				progresssplitsmap.set(el.ActivityFk, arrayprogress);
				if (el.IsBreak) {
					breaks.push({id:el.Id, a_id:el.ActivityFk, start:moment.utc(el.PlannedStart), end:moment.utc(el.PlannedEnd).endOf('d')});
				}
				lastactivity = el.ActivityFk;
			});
		}

		function loadSplitActivities() {
			var mypromise = $q.defer();
			var activityids = _.map(service.activities, 'Id');
			if (activityids.count === 0) {
				mypromise.resolve([]);
			}
			$http({url: globals.webApiBaseUrl + 'scheduling/main/splits/getsplitsbyactivity', method: 'post', data: {
				activityids: activityids
			},  timeout: 1000}).then(function (response) {
				service.rawsplits = response.data;
				refreshSplitActivities();
				mypromise.resolve(service.rawsplits);
				fireDataUpdatedSlow();
			});
			// throw message that new data is ready
			return mypromise.promise;
		}

		function getTimeRange(containerId) {
			var chartinterval = service.schedule ? service.schedule.ScheduleChartIntervalFk : 1; // there is not always a selected schedule

			switch (chartinterval) {
				case 1: // Project start. Uses previous behaviour
					return getProjectTimeRange(containerId);
				case 2: // Start of year
					return [moment.utc().startOf('year'), moment.utc().endOf('year')];
				case 3: // Start of quarter
					return [moment.utc().startOf('quarter'), moment.utc().endOf('quarter')];
				case 4: // Custom start date
					// if option "custom start date" is set but there is no custom start we use the old default behaviour
					if (!moment.isMoment(service.schedule.ChartIntervalStartDate)) {
						return getProjectTimeRange(containerId);
					} else {
						return [moment.utc(service.schedule.ChartIntervalStartDate), (moment.isMoment(service.schedule.ChartIntervalEndDate) ? moment.utc(service.schedule.ChartIntervalEndDate) : moment.utc(service.schedule.ChartIntervalStartDate)
							.add(3, 'months'))];
					}
			}
		}

		function getProjectTimeRange(containerId) {
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

			var settings = getSettings(containerId);
			var hasBaselines = _.findIndex(settingsservice.getActiveTemplates(containerId), ['category', 'Baseline']) !== -1;
			var hasActual = _.findIndex(settingsservice.getActiveTemplates(containerId), ['type', 'actual']) !== -1;
			var hasPlanned = _.findIndex(settingsservice.getActiveTemplates(containerId), ['type', 'planned']) !== -1;
			var hasCurrent = _.findIndex(settingsservice.getActiveTemplates(containerId), ['type', 'current']) !== -1;

			if (hasActual) {
				let actualstarts = _.compact(_.map(service.activities, 'ActualStart'));
				if (actualstarts.length > 0 ) {
					mindates.push(moment.min(actualstarts));
				}
				let actualFinishs = _.compact(_.map(service.activities, 'ActualFinish'));
				if (actualFinishs.length > 0 ) {
					maxdates.push(moment.max(actualFinishs));
				}
			}

			if (hasPlanned) {
				let plannedstarts = _.compact(_.map(service.activities, 'PlannedStart'));
				if (plannedstarts.length > 0 ) {
					mindates.push(moment.min(plannedstarts));
				}
				let plannedFinishs = _.compact(_.map(service.activities, 'PlannedFinish'));
				if (plannedFinishs.length > 0 ) {
					maxdates.push(moment.max(plannedFinishs));
				}
			}

			if (hasCurrent) {
				let currentstarts = _.compact(_.map(service.activities, 'CurrentStart'));
				if (currentstarts.length > 0 ) {
					mindates.push(moment.min(currentstarts));
				}
				let currentFinishs = _.compact(_.map(service.activities, 'CurrentFinish'));
				if (currentFinishs.length > 0 ) {
					maxdates.push(moment.max(currentFinishs));
				}
			}

			// NO activities visible? Use current as default
			if (mindates.length === 0) {
				let currentstarts = _.compact(_.map(service.activities, 'CurrentStart'));
				if (currentstarts.length > 0 ) {
					mindates.push(moment.min(currentstarts));
				}
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
			if (settings.showEvents) {
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

			// also take baselines into consideration

			if (hasBaselines) {
				mindates.push(baselinedates.min);
				maxdates.push(baselinedates.max);
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
		}

		function setupHandlers() {
			// Services to listen to
			// mainservice (activity service)
			// event service
			// relationship service ... is a directly dependent service
			// no processing for activities. they are ready to use, just a notification
			rsservice.loadAllRelationships();
			eventservice.loadAllEvents();

			activityservice.registerItemModified(processActivities);
			activityservice.registerDataModified(processActivities);
			activityservice.registerListLoaded(function () {
				rsservice.loadAllRelationships();
				eventservice.loadAllEvents();
				service.collectionChanged.fire();
				activityinfo.forEach(function (value, key, map) {
					settingsservice.loadLookups(key).then(function () {
						map.set(key, prepareActivityInfo(key));
					});
				});
			});
			activityservice.registerSelectionChanged(function () {
				rsservice.onDataFilterChanged();
				eventservice.onDataFilterChanged();
			});
			activityservice.registerBaselineCreated(refreshBaselines);

			// ... however

			// event depends on activity ....

			rsservice.registerListLoaded(processRelationships);
			rsservice.registerItemModified(processRelationships);
			rsservice.registerDataModified(processRelationships);

			eventservice.registerListLoaded(processEvents);
			eventservice.registerDataModified(processEvents);
			eventservice.registerItemModified(processEvents);

			hammockservice.registerListLoaded(function () {
				service.selectionChanged.fire();
			});
			hammockservice.registerItemModified(function () {
				service.selectionChanged.fire();
			});
			hammockservice.registerDataModified(function () {
				service.selectionChanged.fire();
			});
		}

		// refresh baselines for ALL containers, since we do not know which ones are open
		function refreshBaselines() {
			var containerIds = settingsservice.getStoredContainerIds();
			_.forEach(containerIds, function (containerId) {
				service.loadBaselines(containerId, true);
			}); // I hope this is not too inefficient
		}

		function processActivities() {
			hammockservice.load();
			ganttactivities.forEach(function (value, key, map) {
				map.set(key, prepareActivityData(key)); // shoulddisable
				// prepareActivityData(key); // shouldenable
			});
			activityinfo.forEach(function (value, key, map) {
				map.set(key, prepareActivityInfo(key));
			});
			refreshSplitActivities();
			fireDataUpdatedSlow();
		}

		function processRelationships() {
			fireDataUpdatedSlow();
		}

		function processEvents() {
			fireDataUpdatedSlow();
		}

		function showSettings(containerId) {
			service.lastContainerID = containerId;
			modal.showDialog({
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/dialog.html',
				controller: 'schedulingMainSettingsDialogController',
				width: '650px',
				resizeable: true
			});
		}

		function showTemplates(containerId) {
			service.lastContainerID = containerId;
			modal.showDialog({
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/dialog.html',
				controller: 'schedulingMainTemplatesDialogController',
				resizeable: true
			});
		}

		function showPrintSettings(containerId) {
			service.lastContainerID = containerId;
			modal.showDialog({
				templateUrl: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/gantt-print.html',
				controller: 'schedulingMainGanttPrintSettingsController',
				resizeable: true,
				minWidth: '620px',
				minHeight: '500px'
			});
		}

		function editRelationship(id, dialogscope) {
			var relationship = rsservice.getItemById(id);
			if (!relationship) {
				return;
			}
			var relationshipOld = _.clone(relationship); // store previous values
			var parentactivity, dialogConfig, formconfig;
			var rsvalidation = $injector.get('schedulingMainSuccessorValidationService');
			parentactivity = service.getActivity(relationship.ParentActivityFk);
			activityservice.setSelected(parentactivity);
			formconfig = rslayout.getStandardConfigForDetailView();
			formconfig.skipTools = true;
			formconfig.addValidationAutomatically = false;
			dialogConfig = {
				title: service.translate('scheduling.main.detailRelationshipTitle'),
				dataItem: relationship,
				// validationService: schedulingMainRelationshipValidationService,
				formConfiguration: formconfig,
				handleOK: function handleOK() {
					var button = d3.select('button.btn-default').node();
					if (button) {
						button.focus(); // workaround for issue that on blur is not triggered
						$timeout(function () {
							dialogscope.$applyAsync(function () {
								var modifications = [],
									validations = [];
								// make a 'diff' with old and new values
								_.forOwn(relationship, function (value, property) {
									if (relationshipOld[property] !== value) {
										modifications.push({
											property: property,
											value: value
										});
									}
								});
								// retrigger validation with the old unchanged relationship
								// validate changes in a loop
								_.forEach(modifications, function (mod) {
									validations.push(rsvalidation.doAsyncValidation(relationship, mod.value, mod.property));
								});

								$q.all(validations).then(function () {
									fireDataUpdatedSlow();
								});
							});
						});
					}
				},
				handleCancel: function handleCancel() {
					var button = d3.select('button.cancel').node();
					if (button) {
						button.focus(); // workaround for issue that on blur is not triggered
						$timeout(function () {
							dialogscope.$applyAsync(function () {
								var modifications = [],
									validations = [];
								// make a 'diff' with old and new values
								_.forOwn(relationshipOld, function (value, property) {
									if (relationship[property] !== value) {
										modifications.push({
											property: property,
											value: value
										});
									}
								});
								_.merge(relationship, relationshipOld);

								var tracking = $injector.get('platformDataServiceModificationTrackingExtension');
								tracking.clearModificationsInRoot(rsservice);
								tracking.clearModificationsInRoot(activityservice);

								// retrigger validation with the old unchanged relationship
								// validate changes in a loop
								_.forEach(modifications, function (mod) {
									validations.push(rsvalidation.doAsyncValidation(relationship, mod.value, mod.property));
								});

								$q.all(validations).then(function () {
									tracking.clearModificationsInRoot(rsservice);
									tracking.clearModificationsInRoot(activityservice);
									fireDataUpdatedSlow();
								});
							});
						});
					}
				},
				customBtn1: {
					label: service.translate('cloud.common.delete'),
					action: function () {

						rsservice.deleteItem(relationship);
						// rsvalidation.doAsyncValidation(relationship); // retrigger validation to remove read-only flags
						fireDataUpdatedSlow();
					}
				},
				scope: dialogscope
			};
			modalconfig.showDialog(dialogConfig);
		}

		function editActivity(activity, dialogscope) {
			var dialogConfig, formconfig;
			var activityclone = _.clone(activity);
			formconfig = activitylayout.getStandardConfigForDetailView();
			formconfig.skipTools = true;
			dialogConfig = {
				title: service.translate('scheduling.main.activitydetails'),
				dataItem: activity,
				validationService: schedulingMainActivityValidationService,
				formConfiguration: formconfig,
				handleOK: function handleOK() {
					// _.merge(activity, activityclone);
					activityservice.markItemAsModified(activity);
					// activityservice.doUpdate(); // no explicit update. need to change selection to save or click save button
					fireDataUpdatedSlow();
				},
				handleCancel: function handleCancel() {
					_.merge(activity, activityclone);
					activityservice.markItemAsModified(activity);
					fireDataUpdatedSlow();
				},
				scope: dialogscope
			};
			modalconfig.showDialog(dialogConfig);
		}

		function loadProgressDates(containerId) {
			var mypromise = $q.defer();
			// Load progress (if there are progressdates defined)
			if (_.find(settingsservice.getProgresslines(containerId),
				function (progressline) {
					return moment.isMoment(progressline.date);
				})) {
				var linedatearray = settingsservice.getProgresslines(containerId)
					.filter(function (item) {
						return item.date;
					})
					.map(function (item) {
						return item.date;
					});

				var activityids;
				activityids = _.map(service.activities, 'Id');
				$http.post(globals.webApiBaseUrl + 'scheduling/main/progressline/getlinedates', {
					LineDates: linedatearray,
					activityids: activityids
				}).then(function (response) {
					var data = response.data;
					service.progressdates.clear();
					_.forEach(data, function (element) {
						var currentlinedate, submap;
						currentlinedate = element.LineDate.substr(0, 10);
						submap = new Map();
						_.forEach(element.StateDates, function (subelement) {
							submap.set(subelement.ActivityId, {
								stateDate: moment.utc(subelement.StateDate),
								progress: (subelement.PercentageComplete / 100.0)
							});
						});
						service.progressdates.set(currentlinedate, submap);
					});
					mypromise.resolve(data);
					// throw message that new data is ready
					fireDataUpdatedSlow();
				});
			} else {
				mypromise.resolve([]); // resolve promise with empty array if there were no progressdates defined
			}
			return mypromise.promise;
		}

		function nomatch(item) {
			return item < 0;
		}

		// returns bool, expects moment obj
		function isWeekend(date) {
			if (!moment.isMoment(date)) {
				return false;
			}
			var dayindex = date.day();
			if (dayindex === 0) {
				dayindex = 7;
			}
			var isweekend = service.weekends.find(x=>x===dayindex);
			return !!isweekend;
		}

		// prio 1 current prio 2 planned prio 3 actual
		function updateProgresstemplates(containerId) {
			settingsservice.updateProgresstemplates(containerId);

			var findresult = [];
			var access = getAccessProperty(containerId, findresult);
			if (_.every(findresult, nomatch)) {
				return; // we stop processing
			}

			// update getter in progress templates
			_.forEach(settingsservice.getTemplatemap(containerId), function (currenttemplate) {
				// TOTAL progress (not by due date/line date)
				if (currenttemplate.type === 'progress') {
					if (!currenttemplate.progressdate) {
						// intentionally returning undefined OR date value
						// noinspection FunctionWithInconsistentReturnsJS
						currenttemplate.accessstart = function (item) {
							if (item.PercentageCompletion) { // only return a value if Completion is defined.
								return item[access + 'Start']; // this will skip trying to draw completion bars
							}
						};
						currenttemplate.accessend = function (item) {
							// draw a bar
							if (progresssplitsmap.has(item.Id)) {
								return item[access + 'Finish'].endOf('day');
							} else {
								var modifiedduration = item.PlannedDuration * item.PercentageCompletion / 100;
								var newend = item[access + 'Start'].clone();
								while (modifiedduration > 0) {
									// let's say we have 10 days, now we walk through the days and add them or skip them if they
									// are weekends
									newend.add(1, 'days');
									// if is weekend do not subtract from modified duration
									if (isWeekend(newend)) {
										// add another day;
										newend.add(1, 'days');
									} else {
										modifiedduration--;
									}
								}
								if (modifiedduration !== 0) {
									newend.add(modifiedduration * 24, 'hours');
								}
								return newend;
							}
						};
					} else {
						/* jshint -W083 */ // Intentionally adding function in small loop
						currenttemplate.accessstart = function (item) {
							if (item.ActivityTypeFk === 1) {
								return item[access + 'Start'];
							} else {
								return null;
							}
						};
						currenttemplate.accessend = function (item) { // key linedate comes from template
							// var duration, currentfinish;
							return item[access + 'Finish'].endOf('day');
							/* var progressratio = getProgressDate(currenttemplate.progressdate, item.Id);
							if (progressratio) {
								duration = moment.duration((item[access + 'Finish'] - item[access + 'Start']) * progressratio.progress);
								currentfinish = item[access + 'Start'].clone();
								currentfinish.add(duration);
								return currentfinish;
							} else {
								return item[access + 'Start'];
							} */
						};
					}
				}
			});
		}

		// also in chartbase, progressline component
		function getProgressDate(linedate, activityId) {
			var datekey, result1;
			if (moment.isMoment(linedate)) {
				datekey = linedate.toISOString();
			}
			datekey = datekey.substr(0, 10);
			result1 = service.progressdates.get(datekey);
			if (result1) {
				return result1.get(activityId);
			} else {
				return undefined; // to prevent jshint warning
			}
		}

		function prepareActivityInfo(containerId, filtered) {
			var infoitems;
			var printmode = !!filtered;
			if (!filtered) {
				infoitems = activityinfo.get(containerId) || [];
				infoitems.length = 0;
				activityinfo.set(containerId, infoitems);
			} else {
				infoitems = [];
			}

			// If current setting is off, just stop
			if (!getSettings(containerId).showBarInformation) {
				return infoitems;
			}

			var formatters = settingsservice.getActivityInfo(containerId);
			_.forEach(service.activities.filter(function (item) {
				return !filtered || filtered.has(item.Id);
			}),
			function (act) {
				var currentformatter = _.find(formatters, {
					type: act.ActivityTypeFk
				});

				var access = getAccessPropertyForRS(containerId);

				if (currentformatter) {
					infoitems.push({
						id: act.Id,
						left: currentformatter.left(act, printmode),
						middle: currentformatter.middle(act, printmode),
						right: currentformatter.right(act, printmode),
						start: act[access + 'Start'],
						end: act[access + 'Finish']
					});
				}
			});
			return infoitems;
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

		function preparePrintDataAsync(containerId, withTable, withAllRelationships) {
			var printdataAsync = $q.defer();
			var printsettings = getSettings(containerId).printing;

			/*
			settings().printing.reportFooter = report.FileName;
			settings().printing.reportFooterPath = report.FilePath.replace('\\', ':'); // path seperators break json


			*/

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
				var result = preparePrintData(containerId, withTable, withAllRelationships);
				printservice.headerreport = response[0];
				printservice.footerreport = response[1];
				printdataAsync.resolve(result);
			});

			return printdataAsync.promise;
		}

		function preparePrintData(containerId, withTable, withAllRelationships) {

			function getGridState(containerId) {
				var platformGridAPI = $injector.get('platformGridAPI');
				var result = platformGridAPI.grids.getGridState(containerId, false);
				if (_.isObject(result)) {
					return result;
				} else {
					// map with id and visual index
					var itemsmap = new Map();
					for (var i = 0; i < service.activities.length; i++) {
						var activity = service.activities[i];
						itemsmap.set(activity.Id, i * 25 /* verticalscale(i) */ );
					}

					return {
						filteredItems: itemsmap
					};
				}
			}

			var sortcode = {
				sort: 'Code',
				sortAsc: true
			};

			var mygridstate = getGridState(containerId);
			var filteredItems = mygridstate.filteredItems;
			var activitiesByTemplate = prepareActivityData(containerId, filteredItems, true);
			// prepareActivityTableData will also modify filtereditems and add dummy elements to activitiesbytemplate
			var activitytabledata = prepareActivityTableData(withTable, mygridstate, containerId, true);

			return {
				activitiesByTemplate: activitiesByTemplate,
				activities: activitytabledata,
				activityinfo: prepareActivityInfo(containerId, filteredItems),
				settings: getPrintSettings(),
				weekends: getSettings(containerId).showWeekends ? service.weekends : [],
				holidays: getSettings(containerId).showHolidays ? service.holidays.forEach(function (holiday) {
					holiday.Text = _.escape(holiday.Text);
				}) : [],
				relationships: withAllRelationships ? getFilteredRelationships(containerId, filteredItems, sortcode, null, true) : [],
				timelines: getSettings(containerId).showTimelines ? service.timelines.forEach(function (timeline) {
					timeline.Text = _.escape(timeline.Text);
				}) : [],
				events: service.getEvents(containerId).map(function (e) {
					return {
						Id: e.Id,
						Date: e.Date,
						EndDate: e.EndDate,
						EventTypeFk: e.EventTypeFk,
						ActivityFk: e.ActivityFk
					};
				}),
				icondefinitions: service.convertMapToObject(service.icondefinitions),
				eventicons: service.convertMapToObject(service.eventicons),
				progresslines: service.getProgresslines(containerId),
				progressdates: service.convertMapToObject(service.progressdates),
				verticalIndex: service.convertMapToObject(filteredItems),
				legends: getLegends(containerId, getSettings(containerId).showCritical),
				workingDays: service.workingDays,
				exceptionDates: service.exceptionDates,
				translations: service.translations
			};

			// Add critical color if available
			function getLegends(containerId, showCritical) {
				var sublegends = legends.get(containerId);
				// if we display at least one critical item and current print settings show it, add it to the legend
				if (showCritical && sublegends.hasCritical) { // Handle critical path
					sublegends.set('isCritical', {
						name: 'Critical Path',
						count: 1,
						color: '#FF0000'
					});
				}

				// if we have progresslines, add them to the legend
				var colorscale = d3.scaleOrdinal(d3.schemeCategory10); // we re-create the color scale as used by the progresslines control
				_.forEach(_.filter(service.getProgresslines(containerId), 'show'), function (item) {
					var progressdate = moment.utc(item.date);
					sublegends.set(progressdate.format(), {
						name: 'Progress as of ' + progressdate.format('ll'),
						count: 1,
						color: colorscale(item.date)
					});
				});

				return service.getValuesFromMap(sublegends);
			}

			function getPrintSettings() {
				var settings = angular.copy(getSettings(containerId).printing);
				var timerange = getTimeRange(containerId);

				if (settings.useReportRange) {
					if (settings.reportRangeStart) {
						settings.minimum = settings.reportRangeStart;
					} else {
						settings.minimum = timerange[0];
					}

					if (settings.reportRangeEnd) {
						settings.maximum = settings.reportRangeEnd;
					} else {
						settings.maximum = timerange[1];
					}
				} else {
					settings.minimum = timerange[0];
					settings.maximum = timerange[1];
				}

				// copy other settings
				settings.verticalLines = getSettings(containerId).verticalLines;
				settings.showVerticalLines = getSettings(containerId).showVerticalLines;
				settings.showCritical = getSettings(containerId).showCritical;
				settings.timescalePosition = getSettings(containerId).timescalePosition;
				settings.showWeekends = getSettings(containerId).showWeekends;
				settings.locale = moment.locale();

				return settings;
			}

			function prepareActivityTableData(withTable, gridState, GridcontainerId, printmode) {
				if (!withTable) {
					return [];
				}

				var containerinfo = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid('13120439D96C47369C5C24A2DF29238D');
				var infolist = new Map();
				var formattercache = new Map(); // prevent calling getformatter repeatedly for each row
				var mappedactivity, mappedactivities = [];
				var visiblecolumns = _.intersectionWith(containerinfo.layout.columns, getSettings(containerId).printing.columns, function (a, b) {
					return a.id === b; // was field
				});

				containerinfo.layout.columns.forEach(function (item) {
					infolist.set(item.id, {
						formatter: item.formatter,
						formatterOptions: item.formatterOptions,
						field: item.field
					});
				});

				var columns = [],
					headers = [],
					columnwidths = [];
				getSettings(containerId).printing.columns.forEach(function (column) {
					var mappeditem = _.find(containerinfo.layout.columns, {
						id: column
					});
					if (mappeditem && mappeditem._width > 0) {
						columns.push(mappeditem.id);
						headers.push(_.escape(mappeditem.name)); // some header names had bad hyphens that break the string
						columnwidths.push(mappeditem._width);
					}
				});

				getSettings(containerId).printing.columns = columns;
				getSettings(containerId).printing.headers = headers;
				getSettings(containerId).printing.columnwidths = columnwidths;

				if (gridState.groups.size > 0) {
					gridState.groups.forEach(function (element, index) {
						if (_.isNumber(element)) { // it's an activity and we deal with it as activity
							mappedactivity = {
								id: element
							};
							var act = service.getActivity(element);
							_.forEach(visiblecolumns, function (col) {
								formattercache.set(col.id, settingsservice.getFormatter(col.id, infolist));
								mappedactivity[col.id] = formattercache.get(col.id)(act, printmode);
								if (act.nodeInfo) {
									mappedactivity._level = act.nodeInfo.level;
								} else {
									mappedactivity._level = act.ParentActivityFk===null?0:-1;
								}
							});
							mappedactivities.push(mappedactivity);
						} else { // it's a group and we deal with it as a group
							mappedactivity = {
								id: -index,
								$isGrouping: true,
								_level: 0,
								visualIndex: element.visualIndex,
								bartype: {
									up: 0,
									down: 0
								}
							};
							mygridstate.filteredItems.set(mappedactivity.id, element.visualIndex); // we add visual indexes for the new group elements. activities already have index entrys.
							activitiesByTemplate[0].push(mappedactivity);
							_.forEach(visiblecolumns, function (col) {
								if (col.id === 'description') {
									mappedactivity.description = element.title;
								} else {
									mappedactivity[col.id] = '';
								}
							});
							mappedactivities.push(mappedactivity);
						}
					});
				} else {
					gridState.filteredItems.forEach(function (val, key) {
						mappedactivity = {
							id: key
						};
						var act = service.getActivity(key);
						_.forEach(visiblecolumns, function (col) {
							formattercache.set(col.id, settingsservice.getFormatter(col.id, infolist));
							mappedactivity[col.id] = formattercache.get(col.id)(act, printmode);
						});
						mappedactivities.push(mappedactivity);
					});
				}

				return mappedactivities;
			}
		}

		// Note: prepareActivityData will fill ganttactivities with current template information
		// as well as property 'middle'. This property includes the values for the current planned template.
		function prepareActivityData(containerId, filtered, printmode) {
			var sublegends = legends.get(containerId);
			if (!sublegends) {
				sublegends = new Map();
				legends.set(containerId, sublegends);
			} else {
				sublegends.clear();
			}
			sublegends.hasCritical = false;
			var activitydata = [];
			if (!filtered) {
				activitydata = ganttactivities.get(containerId);
				if (!activitydata) {
					activitydata = [];
					ganttactivities.set(containerId, activitydata);
				} else {
					activitydata.length = 0;
				}
			}

			// foreach active template (ready for display and print)
			_.forEach(settingsservice.getActiveTemplates(containerId), function (template) {
				var activetmpl;

				// if no match (which can only happen after a downgrade, that means templates have been deleted
				// we will just use the first template

				activetmpl = _.find(settingsservice.templates, function (tmpl) {
					return template.templatekey === tmpl.id;
				}) || settingsservice.templates[0];

				function buildSub() {
					var subarray = [],
						result;

					_.forEach(service.activities, function (activity) {
						var key;
						if ((!filtered || filtered.has(activity.Id)) && template.accessstart(activity) && template.accessend(activity)) {
							var bartype = findBartype(activity);
							var newItem = {
								id: activity.Id,
								visualIndex: activity.visualIndex || filtered ? filtered.get(activity.Id) : null,
								start: template.accessstart(activity),
								end: template.accessend(activity),
								bartype: bartype,
								templatetype: template.type,
								isCritical: activity.IsCritical,
								note: printmode? '' : activity.Note, // note is not actually visible in printout
								float: activity.FreeFloatTime,
								simpleMilestone: activity.ActivityTypeFk === 3 ? (activity.PlannedDuration === 0) : null,
								color: template.overrideColors ? (service.colors.get(activity.ChartPresentationFk) || null) : null
							};
							subarray.push(newItem);
							// now also add entries for the legend
							if (activity.IsCritical) {
								sublegends.hasCritical = true; // we display at least one critical item and will add it in the legend
							}
							if (template.overrideColors &&
								activity.ChartPresentationFk !== null && activity.ChartPresentationFk !== undefined) {
								key = activetmpl.id + '-' + template.Id + '-' + activity.ChartPresentationFk;
								if (!sublegends.has(key)) {
									sublegends.set(key, {
										name: template.type + ': ' + lookupFk('ChartPresentationFk', activity.ChartPresentationFk),
										count: 1,
										color: service.colors.get(activity.ChartPresentationFk),
										// pattern, bar height etc. maybe later
									});
								} else {
									result = sublegends.get(key);
									result.count += 1; // no. of occurences can be used for sorting the legend
								}
							} else {
								key = activetmpl.id + '-' + template.Id + '-' + activity.ActivityTypeFk + '-' + activity.ActivityStateFk;
								if (!sublegends.has(key)) {
									sublegends.set(key, {
										name: template.type + ': ' + lookupFk('ActivityTypeFk', activity.ActivityTypeFk) +
											': ' + lookupFk('ActivityStateFk', activity.ActivityStateFk),
										count: 1,
										color: bartype.fill
										// pattern, bar height etc. maybe later
									});
								} else {
									result = sublegends.get(key);
									result.count += 1; // no. of occurences can be used for sorting the legend
								}
							}
						}
					});
					return subarray;
				}

				// sublegends.clear();
				activitydata.push(buildSub());

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

				function findBartype(act) {
					var match, result;
					var defaulttmpl = {
						'up': 0.2,
						'down': 0.8,
						'fill': '#BFDDF2',
					};
					// I search for my type and state.
					match = activetmpl.templates.filter(function (tl1) {
						return tl1.type === act.ActivityTypeFk && tl1.state === act.ActivityStateFk;
					});
					if (match.length === 0) { // If I do not find type and state I search just for type.
						match = activetmpl.templates.filter(function (tl1) {
							return tl1.type === act.ActivityTypeFk;
						});
					}

					// Special case root entity. Could be defined as a seperate ActivityType in Customize later
					if (act.ActivityTypeFk === -1) {
						match = activetmpl.templates.filter(function (tl1) {
							return tl1.type === 2; // we use the same template as for the summary activity
						});
					}

					if (match.length === 0) { // If I still not find anything(should not be the case), I plot the default template.
						result = defaulttmpl;
					} else {
						result = match[0].bartype;
					}
					var myresult = _.clone(result);
					myresult.editable = (act.ActivityTypeFk !== -1
					&& act.ActivityTypeFk !== 2
					&& template.type === 'planned');
					// special case standalone subschedules are also editable ALM 125393
					if (act.ActivityTypeFk === 4 && act.Predecessor.length === 0 && act.Successor.length === 0 && template.type === 'planned') {
						myresult.editable = true;
					}

					myresult.canShowCritical = act.ActivityTypeFk !== -1 && act.ActivityTypeFk !== 2 && (template.type === 'planned' || template.type === 'current');
					myresult.type = template.type;
					myresult.hammock = (act.ActivityTypeFk === 5);
					if (myresult.editable) { // also store values for middle (for correct display of selection handles)
						middle.set(containerId, [myresult.up, myresult.down]);
					}
					if (template.type.startsWith('baseline')) {
						myresult.baseline = true;
					}
					return myresult;
				}
			});

			return activitydata; // shoulddisable
		}

		// Will get the right access property based on priority of visible layers
		// Priority 1: Current, Priority 2: Planned, Priority 3: Actual
		// The construct with array found enables to check if there is at least one match
		function getAccessProperty(containerId, found) {
			var access = '';
			var findresult = found || [];
			// Priority 3: Actual
			findresult[0] = _.findIndex(settingsservice.getActiveTemplates(containerId), {
				type: 'actual'
			});
			if (findresult[0] > -1) {
				access = 'Actual';
			}
			// Priority 2: Planned
			findresult[1] = _.findIndex(settingsservice.getActiveTemplates(containerId), {
				type: 'planned'
			});
			if (findresult[1] > -1) {
				access = 'Planned';
			}
			// Priority 1: Current
			findresult[2] = _.findIndex(settingsservice.getActiveTemplates(containerId), {
				type: 'current'
			});
			if (findresult[2] > -1) {
				access = 'Current';
			}

			return access;
		}

		// Will get the right access property based on order of visible layers excluding baselines
		function getAccessPropertyForRS(containerId, found) {
			var findresult = found || [];
			var mapped = {
				'actual': 'Actual',
				'planned': 'Planned',
				'current': 'Current',
			};
			var result = _.last(_.sortBy(settingsservice.getActiveTemplates(containerId), ['layer']));
			if (result) {
				findresult[0] = 1;
				var result2 = mapped[result.type];
				if (result2) {
					return result2;
				} else {
					return 'Current';
				}
			}
		}

		function getFilteredRelationships(containerId, filteredItems, sortColumn, rawfiltereditems, printmode) {
			if (!filteredItems) {
				throw new Error('need filtereditems');
			}
			var rsmap = [];
			if (!getSettings(containerId).showRelationships) {
				return rsmap;
			}
			var rawfiltered = (rawfiltereditems && rawfiltereditems.size > 0) ? rawfiltereditems : filteredItems; // contains items that are not virtualized
			var filteredrelationships;
			// filtered relationships mean both ends are in the activity collection
			filteredrelationships = service.getRelationships(containerId).filter(function (item) {
				return (rawfiltered.has(item.ParentActivityFk) && rawfiltered.has(item.ChildActivityFk));
			});

			filteredrelationships = filteredrelationships.sort((a, b) => {return b.ChildActivityFk - a.ChildActivityFk;});
			// Scan active templates
			var findresult = [];
			var access = getAccessPropertyForRS(containerId, findresult);

			// Priority 4: don't show any relationships
			if (_.every(findresult, nomatch)) {
				return rsmap;
			}

			_.forEach(filteredrelationships, function (rs) {
				var newpoint = generatePoints(rs, access);
				if (newpoint) {
					rsmap.push(newpoint);
				}
			});

			return rsmap;

			/* jshint -W074 */ // Still no better idea to resolve cylomatic complexity
			function generatePoints(rl, access) {
				var endpoint;
				var parentx, parenty2, childx, childy1; // , sortresult, childGreaterThanParent = true;

				var parent = service.getActivity(rl.ParentActivityFk);
				var child = service.getActivity(rl.ChildActivityFk);
				if (!parent || !child) {
					return false;
				}
				var points = [];

				parenty2 = printmode ? rl.ParentActivityFk : rawfiltered.get(rl.ParentActivityFk) / 25;
				childy1 = printmode ? rl.ChildActivityFk : rawfiltered.get(rl.ChildActivityFk) / 25;

				// Also handle milestone case (which is ALWAYS relationship to finish

				switch (rl.RelationKindFk) {
					case 2:
						/* Finish-Finish */
						parentx = parent[access + 'Finish'];
						childx = child[access + 'Finish'];
						break;
					case 3:
						/* Start-Finish */
						parentx = parent[access + 'Start'];
						childx = child[access + 'Finish'];
						break;
					case 4:
						/* Start-Start */
						parentx = parent[access + 'Start'];
						childx = child[access + 'Start'];
						break;
						/* Finish-Start */
					case 1:
						// Case 1 is the same as default
						parentx = parent[access + 'Finish'];
						childx = child[access + 'Start'];
						break;
					default:
						parentx = parent[access + 'Finish'];
						childx = child[access + 'Start'];
				}

				if (!parentx || !childx) { // we don't have enough data to draw relationships (often the case with actual version
					return false; // because not all activities have actualstart and actualfinish values
				}

				// Special case milestone as relationship child
				if (child.ActivityTypeFk === 3) {
					childx = child[access + 'Finish'];
				}
				// Special case simple milestone
				if (parent.ActivityTypeFk === 3 && parent.PlannedDuration === 0) {
					parentx = parent[access + 'Finish'];
				}
				if (child.ActivityTypeFk === 3 && child.PlannedDuration === 0) {
					childx = child[access + 'Finish'];
				}

				points.push({
					t: parentx,
					h: parenty2,
					hadjust: 0.8 /* 'down' */
				});
				points.push({
					t: parentx,
					h: 'halfy',
					hadjust: 0.5 /* 'down/up' */
				});
				points.push({
					t: childx,
					h: 'halfy',
					hadjust: 0.5 /* 'down/up' */
				});
				points.push({
					t: childx,
					h: childy1,
					hadjust: 0.2 /* 'up - 4' */
				});
				endpoint = {
					t: childx,
					h: childy1,
					hadjust: 0.2 /* 'up' */
				};

				return {
					id: rl.Id,
					points: points,
					endpoint: endpoint,
					isCritical: (access === 'Planned' || access === 'Current') ? rl.IsCritical : false,
					parentId: rl.ParentActivityFk,
					childId: rl.ChildActivityFk,
					parenty: printmode ? rl.ParentActivityFk : parenty2 * 25,
					childy: printmode ? rl.ChildActivityFk : childy1 * 25
				};
			}
		}

		function loadbaselineActivities(containerId) {
			var baselinesAsync = $q.defer();
			var dateProcessor = new Processdates(['plannedstart', 'plannedfinish', 'currentstart', 'currentfinish']);
			// Note: this service here is the only client service that accesses baselines in bulk. Therefore we go directly
			// to the server and do not have a standard baseline client service.
			var baselineids = settingsservice.baselineids;
			if (baselineids.length === 0) {
				baselinedates.min = null;
				baselinedates.max = null;
				baselinesAsync.resolve([]);
				return baselinesAsync.promise;
			}
			return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/baselines', {
				Filter: settingsservice.baselineids
			})
				.then(function (response) {
					var baseitems;

					// throw away information not needed
					baseitems = response.data.map(function (el) {

						var baseitem = {
							baseline: el.BaselineFk,
							id: el.BaseActivityFk,
							plannedstart: el.PlannedStart,
							plannedfinish: el.PlannedFinish,
							currentstart: el.CurrentStart,
							currentfinish: el.CurrentFinish
						};
						dateProcessor.processItem(baseitem);
						if (!baselinedates.min || baseitem.currentstart < baselinedates.min) {
							baselinedates.min = baseitem.currentstart;
						}
						if (!baselinedates.max || baseitem.currentfinish > baselinedates.max) {
							baselinedates.max = baseitem.currentfinish;
						}
						return baseitem;
					});

					// group those baseitems by baseline
					baselinemap = _.groupBy(baseitems, function (item) {
						return item.baseline;
					});

					// modify getter of baseline templates
					_.forEach(settingsservice.getTemplatemap(containerId), function (currenttemplate) {
						if (currenttemplate.type === 'baseline-planned') {
							/* jshint -W083 */ // Intentionally adding function in small loop
							currenttemplate.accessstart = function (activity) {
								var baseline = _.find(baselinemap[currenttemplate.baselineid], {
									id: activity.Id
								});

								if (baseline) {
									return baseline.plannedstart;
								} else {
									return null;
								}
							};
							currenttemplate.accessend = function (activity) {
								var baseline = _.find(baselinemap[currenttemplate.baselineid], {
									id: activity.Id
								});

								if (baseline) {
									return baseline.plannedfinish;
								} else {
									return null;
								}
							};
						} else if (currenttemplate.type === 'baseline-current') {
							/* jshint -W083 */ // Intentionally adding function in small loop
							currenttemplate.accessstart = function (activity) {
								var baseline = _.find(baselinemap[currenttemplate.baselineid], {
									id: activity.Id
								});

								if (baseline) {
									return baseline.currentstart;
								} else {
									return null;
								}
							};
							currenttemplate.accessend = function (activity) {
								var baseline = _.find(baselinemap[currenttemplate.baselineid], {
									id: activity.Id
								});

								if (baseline) {
									return baseline.currentfinish;
								} else {
									return null;
								}
							};
						}
					});
				});
		}
	}
]);
