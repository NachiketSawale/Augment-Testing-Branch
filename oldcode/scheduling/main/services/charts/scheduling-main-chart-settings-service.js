/* global moment globals Platform */

/**
 *
 * @ngdoc service
 * @name scheduling.main.schedulingMainLobService
 * @function
 * @requires schedulingMainService, projectLocationMainService, calendarUtilitiesService
 *
 * @description
 * #LOBService
 * 1) Provides data for the LOB control, collecting it from several injected services
 * 2) Keeps settings during the lifetime of the app for controllers and directives in the scheduling.main
 * module but does not persist them.
 * ## Settings version
 * Settings and templates have a version property. The current settings version is 0.51, the current template version is 0.4.
 * settingsversions between 0.5 and 0.59 are merged with current defaults and a possible additions of new keys.
 * settingsversion of 0.6 or higher leads to replacement with new defaults. This also means that settings included in default views
 * that are saved under system are ignored if not saved again.
 * For the templates there is no merge, they get replaced if versions do not match.
 */
/* jshint -W072 */ // many parameters because of dependency injection
angular.module('scheduling.main') /* leave this as SERVICE, because I need the constructor */
	.service('schedulingMainChartSettingsService', ['_', '$http', '$q', '$injector', 'schedulingMainService', 'mainViewService',
		function(_, http, $q, $injector, schedulingMainService, mainViewService) {
			'use strict';
			var lobdefaults, ganttdefaults;
			var templatemapid = 10,
				persistenttemplates = new Map(),
				baselinetemplates = new Map(),
				baselines = new Map(),
				progresstemplates = new Map(),
				schedulefks = [],
				settingsversion = 1.1, // settingsversions between 0.5 and 0.59 are merged with current defaults and a possible additions of new keys.
				// settingsversion of 0.6 or higher leads to replacement with new defaults. This also means that default views that are saved under system
				// are ignored if not saved again.
				templateversion = 0.7,
				service = this;

			// maps for multiple "instances" of settings and template map data
			var lobsettings = new Map(),
				ganttsettings = new Map(),
				progresslines = new Map(),
				lookupcache = new Map();

			// service.settingsLoaded = new Platform.Messenger(); // this messenger will also provide the current culture in it's event arguments
			service.templatesLoaded = new Platform.Messenger();
			service.baselinesChanged = new Platform.Messenger();
			lobdefaults = {
				sortOrder: [true, true, true, true],
				flipAxis: false,
				showCritical: false,
				showProgress: false,
				criticalColor: '#FF0000',
				showWeekends: true,
				showHolidays: true,
				showTimelines: true,
				verticalLines: [true, true, true],
				timescalePosition: 'bottom', // top, bottom, both,
				locationbarwidth: 176,
				showVerticalLines: false,
				showLocationConnections: false,
				hiddenLocations: [], // contains fks of hidden locations, all others are visible by default
				printing: {
					papersize: 'A3',
					orientation: 'landscape',
					timescalePosition: 'bottom', // top, bottom, both
					margin: [0, 2.0, 6.0, 1.0],
					/* top,right,bottom,left in cm */
					spanX: 1,
					spanY: 1,
					minimum: new moment.utc(),
					maximum: new moment.utc().add(6, 'months'),
					reportRangeStart: null,
					reportRangeEnd: null,
					useReportRange: false,
					reportHeader: '',
					reportHeaderPath: '',
					reportHeaderHeight: 0,
					reportHeaderOnlyFirst: false,
					reportFooter: '',
					reportFooterPath: '',
					reportFooterId: -1,
					reportHeaderId: -1,
					headerId: -1,
					footerId: -1,
					reportFooterHeight: 0,
					reportFooterOnlyLast: false,
					showLegend: true
				},
				barinformation: [{
					type: 1,
					middle: 'description'
				}, {
					type: 2
				}, {
					type: 3
				}],
				showBarInformation: 'summary' // 'none', 'summary', 'activity'
			};
			ganttdefaults = {
				showRelationships: true,
				showSeparatedRelationships: true,
				showEvents: true,
				showProgresslines: false,
				showCurrentBaseline: true,
				showPlannedBaseline: true,
				progresslinecolors: ['#7986CB', '#81c784', '#ba68c8', '#ffe0b2', '#ffb74d'],
				showCritical: false,
				showWeekends: true,
				showHolidays: true,
				criticalColor: '#FF0000',
				criticalBorderWidth: '1px',
				showTimelines: true,
				showNoteIcon: true,
				verticalLines: [true, true, true],
				timescalePosition: 'top', // top, both
				showHammock: true,
				showVerticalLines: false,
				printing: {
					papersize: 'A3',
					orientation: 'landscape',
					timescalePosition: 'top', // top, both
					margin: [0, 2.0, 7.0, 1.0],
					/* top,right,bottom,left in cm */
					spanX: 1,
					spanY: 1,
					showTable: true,
					columns: ['code', 'description', 'quantity', /* uom does not exist */ 'plannedstart', 'plannedfinish', 'plannedduration'],
					headers: [null, null, null, null, null, 'Duration'],
					columnwidths: [100, 100, 100, 100, 100, 100],
					minimum: new moment.utc(),
					maximum: new moment.utc().add(6, 'months'),
					reportRangeStart: null,
					reportRangeEnd: null,
					useReportRange: false,
					reportHeader: '',
					reportHeaderPath: '',
					reportHeaderHeight: 0,
					reportHeaderOnlyFirst: false,
					reportFooter: '',
					reportFooterPath: '',
					reportFooterId: -1,
					reportHeaderId: -1,
					headerId: -1,
					footerId: -1,
					reportFooterHeight: 0,
					reportFooterOnlyLast: false,
					showLegend: true
				},
				barinformation: [{
					type: 1,
					middle: 'description'
				}, {
					type: 2
				}, {
					type: 3
				}, {
					type: 5
				}],
				showBarInformation: false
			};

			Object.defineProperties(service, {
				templates: {
					value: [],
					writable: true,
					enumerable: true
				},
				activitystates: {
					value: [],
					writable: true,
					enumerable: true
				},
				baselines: {
					value: [],
					writable: true,
					enumerable: true
				},
				baselineids: {
					get: function() {
						return service.baselines.map(function(baseline) {
							return baseline.Id;
						});
					},
					enumerable: true
				}
			});

			service.getProgresslines = function getProgresslines(containerId) {
				if (!progresslines.has(containerId)) {
					progresslines.set(containerId, [{
						show: false,
						date: null,
						color: null
					}, {
						show: false,
						date: null,
						color: null
					}, {
						show: false,
						date: null,
						color: null
					}, {
						show: false,
						date: null,
						color: null
					}, {
						show: false,
						date: null,
						color: null
					}, ]);
				}

				return progresslines.get(containerId);
			};

			// lobsettings
			service.getLobsettings = function getLobsettings(containerId) {
				if (!containerId) {
					return;
				}
				return lobsettings.get(containerId);
			};
			// ganttsettings
			service.getGANTTsettings = function getGANTTsettings(containerId) {
				if (!containerId) {
					return;
				}
				return ganttsettings.get(containerId);
			};
			service.getTemplatemap = function getTemplatemap(containerId) {
				var progresstmpl = progresstemplates.get(containerId) || [];
				var filteredprogresstemplates = progresstmpl.filter(function(item) {
					return item.progressdate;
				});
				let t = $injector.get('$translate');

				return (persistenttemplates.get(containerId) || []).concat(baselinetemplates.get(containerId) || [], filteredprogresstemplates).sort(function(item1, item2) {
					item1.versionname = t.instant(item1.versionname);
					if (item1.category) {
						item1.category = t.instant(item1.category);
					}
					return item1.layer - item2.layer;
				});
			};
			// activeTemplates
			service.getActiveTemplates = function(containerId) {
				return service.getTemplatemap(containerId).filter(function(element) {
					return element.visible;
				});
			};

			service.getStoredContainerIds = getStoredContainerIds;

			function getStoredContainerIds() {
				// Map.values() not supported in IE
				var containerIds = [];
				persistenttemplates.forEach(function(value, key) {
					containerIds.push(key);
				});
				return containerIds;
			}

			// This getter function wraps the templates property because lookup control only refreshes when using service not simple array property
			service.getTemplates = getTemplates;
			service.getTemplate = getTemplate;
			service.loadTemplates = loadTemplates;
			service.saveTemplates = saveTemplates;
			service.loadSettings = loadSettings;
			service.saveSettings = saveSettings;
			service.clearSettings = clearSettings;
			service.updateProgresstemplates = updateProgresstemplates;
			service.updateBaselinetemplates = updateBaselinetemplates;
			service.plannedTmplIsVisible = plannedTmplIsVisible;
			service.currentTmplIsVisible = currentTmplIsVisible;
			service.loadBaselines = loadBaselines;
			service.getActivityInfo = getActivityInfo;
			service.loadLookups = loadLookups;
			service.getFormatter = getFormatter;

			return service;

			// This getter function wraps the templates property because lookup control only refreshes when using service not simple array property
			function getTemplates() {
				return service.templates;
			}

			function getTemplate(id) {
				var result = _.find(service.templates, function(element) {
					return element.id === id;
				});
				if (!result) {
					result = service.templates[0];
				}

				return result;
			}

			function clearSettings() {
				lobsettings.clear();
				ganttsettings.clear();
				baselinetemplates.clear();
				baselines.clear();
				progresstemplates.clear();
			}

			function loadSettings(containerId) {
				var mergedlobsettings, mergedganttsettings;
				// Initialize with defaults, then overwrite if settings are stored
				lobsettings.set(containerId, angular.copy(lobdefaults));
				ganttsettings.set(containerId, angular.copy(ganttdefaults));
				persistenttemplates.set(containerId, localTemplatemapDefaults());
				var settings = mainViewService.customData(containerId, 'chartsettings');
				if (correctVersion(settings, settingsversion)) { // will merge settings changes within
					if (settings.lob) {
						// do a merge, then modify some settings
						mergedlobsettings = _.merge(lobdefaults, settings.lob);
						mergedlobsettings.shouldHideWeekends = !settings.lob.showWeekends;
						mergedlobsettings.showWeekends = true;
						mergedlobsettings.printing.reportRangeStart = settings.lob.printing.reportRangeStart ? moment.utc(settings.lob.printing.reportRangeStart) : null;
						mergedlobsettings.printing.reportRangeEnd = settings.lob.printing.reportRangeEnd ? moment.utc(settings.lob.printing.reportRangeEnd) : null;
						lobsettings.set(containerId, mergedlobsettings);
					}
					if (settings.gantt) {
						// do a merge, then modify some settings
						mergedganttsettings = _.merge(ganttdefaults, settings.gantt);
						mergedganttsettings.shouldHideWeekends = !settings.gantt.showWeekends;
						mergedganttsettings.showWeekends = true;
						mergedganttsettings.printing.reportRangeStart = settings.gantt.printing.reportRangeStart ? moment.utc(settings.gantt.printing.reportRangeStart) : null;
						mergedganttsettings.printing.reportRangeEnd = settings.gantt.printing.reportRangeEnd ? moment.utc(settings.gantt.printing.reportRangeEnd) : null;
						ganttsettings.set(containerId, mergedganttsettings);
					}
					if (settings.templatemap) {
						addTemplatemapAccessors(settings.templatemap); // always add accessors
						persistenttemplates.set(containerId, settings.templatemap);
					}
				}

				function localTemplatemapDefaults() {
					var result =
						[{
							Id: 2,
							layer: 11,
							visible: true,
							type: 'planned',
							versionname: 'scheduling.main.chart-settings.versions.planned',
							templatekey: 1
						}, {
							Id: 3,
							layer: 12,
							visible: false,
							type: 'actual',
							versionname: 'scheduling.main.chart-settings.versions.actual',
							templatekey: 2
						}, {
							Id: 1,
							layer: 13,
							visible: false,
							type: 'current',
							versionname: 'scheduling.main.chart-settings.versions.current',
							templatekey: 1
						}, {
							Id: 4,
							layer: 20,
							visible: false,
							type: 'progress',
							versionname: 'scheduling.main.chart-settings.versions.progress',
							templatekey: 2,
							category: 'scheduling.main.chart-settings.categories.progress'
						}];
					addTemplatemapAccessors(result);
					return result;
				}

				function addTemplatemapAccessors(templatemap) {
					function e() {}

					_.forEach(templatemap, function(tmplgroup) {
						// Add appropriate access function on group element
						// TBD: make this switch less redundant by building default accessor functions
						_.assign({
							overrideColors: false
						}, tmplgroup); // add prop overrideColors if missing
						switch (tmplgroup.type) {
							case 'current': // current is a special case that shows actual if available, else it shows planned
								tmplgroup.accessstart = function(item) {
									return item.CurrentStart;
								};
								tmplgroup.accessend = function(item) {
									return item.CurrentFinish;
								};
								break;
							case 'planned':
								tmplgroup.accessstart = function(item) {
									return item.PlannedStart;
								};
								tmplgroup.accessend = function(item) {
									return item.PlannedFinish;
								};
								break;
							case 'actual':
								tmplgroup.accessstart = function(item) {
									return item.ActualStart;
								};
								tmplgroup.accessend = function(item) {
									return item.ActualFinish;
								};
								break;
							default:
								tmplgroup.accessstart = e;
								tmplgroup.accessend = e;
								break;
						}
					});
				}
			}

			// called on scope destroy and persist settings using layout system's custom data
			function saveSettings(containerId) {
				if (!containerId) {
					return;
				}
				// saving settings via layout system
				mainViewService.customData(containerId, 'chartsettings', {
					version: settingsversion,
					lob: lobsettings.get(containerId),
					gantt: ganttsettings.get(containerId),
					templatemap: persistenttemplates.get(containerId)
				});
			}

			function updateProgresstemplates(containerId) {
				var i, newitem, currentprogress;

				function e() {}

				// Initialize
				if (!progresstemplates.get(containerId) || progresstemplates.get(containerId).length === 0) {
					progresstemplates.set(containerId, []);
					for (i = 0; i <= 4; i++) {
						newitem = {
							Id: i + 100,
							visible: false,
							layer: i + 21,
							type: 'progress',
							progressdate: null,
							versionname: '',
							templatekey: 2,
							category: 'scheduling.main.chart-settings.categories.progress',
							accessstart: e, // Real access function may be re-assigned below
							accessend: e
						};
						progresstemplates.get(containerId).push(newitem);
					}
				}

				let t = $injector.get('$translate');


				// Update
				_.forEach(progresstemplates.get(containerId), function(currentitem, i) {
					currentprogress = service.getProgresslines(containerId)[i];
					if (moment.isMoment(currentprogress.date)) {
						currentitem.versionname = t.instant('scheduling.main.chart-settings.versions.progress') + currentprogress.date.format('ll');
						currentitem.progressdate = currentprogress.date;
					} else {
						currentitem.versionname = '';
						currentitem.progressdate = null;
					}
				});
			}

			function correctVersion(settingsobject, version) {
				var lowerboundary = Math.floor(version * 10) / 10;
				var upperboundary = lowerboundary + 0.1;

				return settingsobject && settingsobject.version &&
					settingsobject.version >= lowerboundary && settingsobject.version < upperboundary;
			}

			// note: includes version check
			function loadTemplatesAsync() {
				var templatesAsync = $q.defer();
				http.get(globals.webApiBaseUrl + 'scheduling/main/settings/load', {
					params: {
						key: 'templates'
					}
				})
					.then(function(response) {
						var templatecollection = JSON.parse(response.data.Value);
						// check for version number
						if (!correctVersion(templatecollection, templateversion)) {
							templatecollection.templates = localTemplateDefaults();
						}

						templatesAsync.resolve(templatecollection);

						function localTemplateDefaults() {
							return [{
								id: 1,
								name: 'scheduling.main.chart-settings.templates.current',
								templates: [{
									type: 1,
									state: null,
									bartype: {
										id: 10,
										up: 0.2,
										down: 0.8,
										fill: '#7FB2D7'
									}
								}, {
									type: 2,
									state: null,
									bartype: {
										id: 10,
										up: 0.3,
										down: 0.5,
										iconstart: 'triangle-down',
										iconend: 'triangle-down',
										fill: '#000000'
									}
								}, {
									type: 4,
									state: null,
									bartype: {
										id: 10,
										up: 0.2,
										down: 0.8,
										fill: '#C5CAE9'
									}
								}, {
									type: 3,
									state: null,
									bartype: {
										id: 10,
										up: 0,
										down: 0,
										iconend: 'diamond',
										fill: '#000000'
									}
								}]
							}, {
								id: 2,
								name: 'scheduling.main.chart-settings.templates.progress',
								templates: [{
									type: 1,
									state: null,
									bartype: {
										id: 10,
										up: 0.2,
										down: 0.8,
										fill: '#7986CB'
									}
								}, {
									type: 2,
									state: null,
									bartype: {
										id: 10,
										up: 0.3,
										down: 0.5,
										iconstart: 'triangle-down',
										iconend: 'triangle-down',
										fill: '#7986CB'
									}
								}, {
									type: 4,
									state: null,
									bartype: {
										id: 10,
										up: 0.2,
										down: 0.8,
										fill: '#C5CAE9'
									}
								}, {
									type: 3,
									state: null,
									bartype: {
										id: 10,
										up: 0,
										down: 0,
										iconend: 'diamond',
										fill: '#7986CB'
									}
								}]
							}, {
								id: 3,
								name: 'scheduling.main.chart-settings.templates.baseline',
								templates: [{
									type: 1,
									state: null,
									bartype: {
										id: 10,
										up: 0.8,
										down: 1,
										fill: '#BDBDBD'
									}
								}, {
									type: 2,
									state: null,
									bartype: {
										id: 10,
										up: 0.3,
										down: 0.5,
										iconstart: 'triangle-down',
										iconend: 'triangle-down',
										fill: '#BDBDBD'
									}
								}, {
									type: 4,
									state: null,
									bartype: {
										id: 10,
										up: 0.2,
										down: 0.8,
										fill: '#C5CAE9'
									}
								}, {
									type: 3,
									state: null,
									bartype: {
										id: 10,
										up: 0,
										down: 0,
										iconend: 'diamond',
										fill: '#BDBDBD'
									}
								}]
							}];
						}
					})
					.catch(function() {
						templatesAsync.reject();
					});

				return templatesAsync.promise;
			}

			function loadActivityStatesAsync() {
				// basics.customize.activitytype

				var activitystatesAsync = $q.defer();
				$injector.invoke(['basicsLookupdataSimpleLookupService', function(basicsLookupdataSimpleLookupService) {
					basicsLookupdataSimpleLookupService.getList({
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.activitystate'
					}).then(function(response) {
						activitystatesAsync.resolve(response);
					})
						.catch(function() {
							activitystatesAsync.reject();
						});
				}]);

				return activitystatesAsync.promise;
			}

			// the chain starts with the loaded or updated event of the main service (which is called MAIN service for a reason)

			function loadBaselinesAsync(containerId, hasNewItem) {
				var baselinesAsync = $q.defer();

				// get schedulefks (indirectly) from activity service (main service);
				var newschedulefks = getactivityschedules();

				// check if resulting schedule fks are still the same, this could be the case even if
				// activities have changed. if yes, stop here, EXCEPT when we know there was a new item added
				var difference = _.difference(newschedulefks, schedulefks); // new array has to come first
				if (hasNewItem || difference.length > 0) {
					service.baselines.length = 0; // reset loaded baselines as schedule has changed
					schedulefks = newschedulefks;
					// listbyschedule....
					http.post(globals.webApiBaseUrl + 'scheduling/main/baseline/listbyschedule', {
						Filter: schedulefks
					}).then(function(response) {
						var baselines = response.data;
						var bsl = updateBaselinetemplates(baselines, containerId);
						baselinesAsync.resolve([baselines, bsl]);
						service.baselinesChanged.fire();
					});
				} else {
					baselinesAsync.resolve(null);
				}

				return baselinesAsync.promise;

				function getactivityschedules() {
					return _.uniq(schedulingMainService.getList().map(function(item) {
						return item.ScheduleFk;
					}));
				}
			}

			function updateBaselinetemplates(baselines, containerId) {
				function e() {} // do nothing function
				var newbaselinetemplates = [],
					settings = ganttsettings.get(containerId);

				if (!settings.showPlannedBaseline && !settings.showCurrentBaseline) {
					baselinetemplates.set(containerId, newbaselinetemplates);
					return newbaselinetemplates;
				}

				var previousBaselinetemplates = baselinetemplates.get(containerId),
					previousBaselinetemplate;
				let t = $injector.get('$translate');


				_.forEach(baselines, function(baseline, i) {
					if (settings.showCurrentBaseline) {
						var baselineCurrentTmpl = {
							baselineid: baseline.Id,
							Id: templatemapid,
							visible: false,
							layer: i + 1,
							type: 'baseline-current',
							versionname: baseline.Description + t.instant('scheduling.main.chart-settings.versions.baselinecurrent'),
							templatekey: 3,
							category: 'scheduling.main.chart-settings.categories.baseline',
							/* jshint -W083 */ // Intentionally adding function in small loop
							accessstart: e, // Real access function is re-assigned in GANTT service
							accessend: e
						};
						// restore previous mapping, layer and visibility
						previousBaselinetemplate = _.find(previousBaselinetemplates, {
							'baselineid': baseline.Id,
							'type': 'baseline-current'
						});
						if (previousBaselinetemplate) {
							baselineCurrentTmpl.visible = previousBaselinetemplate.visible;
							baselineCurrentTmpl.layer = previousBaselinetemplate.layer;
							baselineCurrentTmpl.templatekey = previousBaselinetemplate.templatekey;
						}
						newbaselinetemplates.push(baselineCurrentTmpl);
						templatemapid += 1;
					}
					if (settings.showPlannedBaseline) {
						var baselinePlannedTmpl = {
							baselineid: baseline.Id,
							Id: templatemapid,
							visible: false,
							layer: i + 1,
							type: 'baseline-planned',
							versionname: baseline.Description + t.instant('scheduling.main.chart-settings.versions.baselineplanned'),
							templatekey: 3,
							category: 'scheduling.main.chart-settings.categories.baseline',
							/* jshint -W083 */ // Intentionally adding function in small loop
							accessstart: e, // Real access function is re-assigned in GANTT service
							accessend: e
						};
						// restore previous mapping, layer and visibility
						previousBaselinetemplate = _.find(previousBaselinetemplates, {
							'baselineid': baseline.Id,
							'type': 'baseline-planned'
						});
						if (previousBaselinetemplate) {
							baselinePlannedTmpl.visible = previousBaselinetemplate.visible;
							baselinePlannedTmpl.layer = previousBaselinetemplate.layer;
							baselinePlannedTmpl.templatekey = previousBaselinetemplate.templatekey;
						}
						newbaselinetemplates.push(baselinePlannedTmpl);
						templatemapid += 1;
					}
				});

				baselinetemplates.set(containerId, newbaselinetemplates);
				return newbaselinetemplates;
			}

			function loadBaselines(containerId, hasNewItem) {
				return loadBaselinesAsync(containerId, hasNewItem).then(function(result) {
					if (result) {
						service.baselines = result[0];
						// baselinetemplates.set(containerId, result[1]);
					}
					service.templatesLoaded.fire();
				});
			}

			// for the transition to promises, as long as other parts still use async, well...
			function loadTemplates(containerId) {
				let t = $injector.get('$translate');
				return $q.all([loadTemplatesAsync(), loadActivityStatesAsync(), loadBaselines(containerId)])
					.then(function(combinedresult) {
						service.templates = combinedresult[0].templates;
						service.templates.forEach(tmpl => {
							tmpl.name = t.instant(tmpl.name);
						});
						// persistenttemplates.set(containerId, combinedresult[0].templates);
						service.activitystates = combinedresult[1];
						service.templatesLoaded.fire();
					})
					.catch(function() {});
			}

			function saveTemplates() {
				return http.post(globals.webApiBaseUrl + 'scheduling/main/settings/save', {
					key: 'templates',
					value: JSON.stringify({
						version: templateversion,
						templates: service.templates
					})
				});
			}

			function plannedTmplIsVisible(containerId) {
				let t = $injector.get('$translate');

				var filtered = service.getTemplatemap(containerId).filter(function(item) {
					item.versionname = t.instant(item.versionname);
					return item.type === 'planned' && item.visible;
				});
				return filtered.length > 0;
			}

			function currentTmplIsVisible(containerId) {
				var filtered = service.getTemplatemap(containerId).filter(function(item) {
					return item.type === 'current' && item.visible;
				});
				return filtered.length > 0;
			}

			function getLookuptype(item) {
				var opt = item.formatterOptions ? item.formatterOptions : item;
				if (opt.dataServiceName) {
					return 1;
				} else if (opt.lookupSimpleLookup) {
					return 2;
				} else if (opt.lookupType) {
					return opt.lookupType;
				}
			}

			function loadLookups(containerId) {
				// only load lookups if we have any activity data
				if (schedulingMainService.getList().length === 0) {
					return $q.defer().promise;
				}

				var info = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid('13120439D96C47369C5C24A2DF29238D');
				var lookuplist = new Map();
				info.layout.columns.forEach(function(item) {
					if (item.formatter === 'lookup') {
						lookuplist.set(item.id, {
							formatterOptions: item.formatterOptions,
							type: getLookuptype(item),
							field: item.field
						});
					}
				});
				var activelookups = new Map();
				ganttsettings.get(containerId).barinformation.forEach(function(barinfo) {
					_.forOwn(barinfo, function(myprop, key) {
						if (key !== 'type') {
							var formatter = lookuplist.get(myprop);
							if (formatter) {
								activelookups.set(myprop, formatter);
							}
						}
					});
				});

				// only load those lookups that are in use, others are loaded by the grid. to load ALL replace
				// activelookups with lookuplist in the next line
				return $q.all(lookuplist.forEach(function(opt) {
					var lookupservice;
					switch (opt.type) {
						case 1:
							lookupservice = $injector.get(opt.formatterOptions.dataServiceName);
							if (_.isFunction(lookupservice.setFilter)) {
								lookupservice.setFilter(opt.formatterOptions.filter(schedulingMainService.getList()[0]));
							}

							return lookupservice.getList(opt.formatterOptions);
						case 2:
							lookupservice = $injector.get('basicsLookupdataSimpleLookupService');
							return lookupservice.getList(opt.formatterOptions);
						case 3:
							lookupservice = $injector.get('basicsLookupdataLookupDataService');
							return lookupservice.getList(opt.formatterOptions.lookupType);
						default: // for lookups we do not understand yet
							if ($injector.has(opt.type+'LookupDataService')) {
								lookupservice = $injector.get('basicsLookupdataLookupDataService');
								var result = lookupservice.getList(opt.formatterOptions.lookupType).then(function (data) {
									lookupcache.set(opt.formatterOptions.lookupType, data);
								});
								return result;
							} else {
								return getEmptyString;
							}
					}
				}));
			}

			function getEmptyString() {
				return '';
			}

			function getActivityInfo(containerId) {
				var info = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid('13120439D96C47369C5C24A2DF29238D');
				var infolist = new Map();
				info.layout.columns.forEach(function(item) {
					infolist.set(item.id, {
						formatter: item.formatter,
						formatterOptions: item.formatterOptions,
						name: item.name,
						field: item.field
					});
				});
				var activityinfo = ganttsettings.get(containerId).barinformation.map(function(barinfo) {
					return {
						type: barinfo.type,
						left: getFormatter(barinfo.left, infolist, true),
						middle: getFormatter(barinfo.middle, infolist, true),
						right: getFormatter(barinfo.right, infolist, true)
					};
				});

				return activityinfo;
			}

			function getFormatter(id, infolist, graphical) {
				var outerresult;
				var domainservice = $injector.get('platformGridDomainService');
				// from field to domain/formatter
				var info = infolist.get(id);
				if (!info || !info.formatter) {
					return getEmptyString;
				}
				var field = info.field;
				switch (info.formatter) {
					case 'lookup': // replace UNUSABLE lookup formatter from platformGridDomainService
						outerresult = createlookupFormatter(info.formatterOptions);
						break;
					case 'boolean':
						outerresult = getBoolean;
						break;
					case 'action': // cases we cannot handle like images
					case 'colorpicker':
					case 'color':
					case 'image':
					case 'select':
					case 'imageselect':
						outerresult = getEmptyString;
						break;
					default:
						var formatterfunction = domainservice.formatter(info.formatter);
						if (!formatterfunction) {
							formatterfunction = info.formatter;
						}
						outerresult = function wrapperfunction(activity, printmode) {
							var value, result;
							value = activity[field];
							result = formatterfunction(null, null, value, {
								field: field
							}, activity);
							if (printmode) {
								if (!_.isString(result)) { // in case formatter does NOT return string
									result = JSON.stringify(result);
								}
								result = JSON.stringify(result).slice(1, -1);
							}
							return result;
						};
				}

				if (!outerresult) {
					outerresult = getEmptyString;
				}
				return outerresult;

				function getBoolean(act) {
					if (graphical) { // for the graphic on the right
						return (!_.isNil(act[field]) ? '' : 'Not ') + info.name;
					} else { // for the table on the left
						return !_.isNil(act[field]) ? '\u2713' : '';
					}
				}

				function createlookupFormatter(formatterOptions) {
					var lookupservice;
					switch (getLookuptype(formatterOptions)) {
						case 1:
							lookupservice = $injector.get(formatterOptions.dataServiceName);
							// 1. get lookupservice from formatterOptions
							// 2. get valuebyid (synchronous, since we know that lookup is already loaded)
							return function namedLookupFormatter(activity, printmode) {
								if (!_.isNumber(activity[field]) || activity[field] < 0) { // if no lookup value is set do not lookup
									return '';
								}

								var result = lookupservice.getItemById(activity[field], formatterOptions);
								return stringify(result, formatterOptions.displayMember, printmode);
							};
						case 2:
							lookupservice = $injector.get('basicsLookupdataSimpleLookupService');
							return function simpleLookupFormatter(activity, printmode) {
								if (!_.isNumber(activity[field]) || activity[field] < 0) { // if no lookup value is set do not lookup
									return '';
								}

								var result = lookupservice.getItemByIdSync(activity[field], formatterOptions);
								return stringify(result, formatterOptions.displayMember, printmode);
							};
						case 3:
							lookupservice = $injector.get('basicsLookupdataLookupDataService');
							return function basicLookupFormatter(activity, printmode) {
								if (!_.isNumber(activity[field]) || activity[field] < 0) { // if no lookup value is set do not lookup
									return '';
								}

								var result = _.find(lookupservice.getSearchList(formatterOptions.lookupType, ''), {
									Id: activity[field]
								});
								return stringify(result, formatterOptions.displayMember, printmode);
							};
						default:
							lookupservice = $injector.get('basicsLookupdataLookupDataService');
							return function basicLookupFormatter(activity, printmode) {
								if (!_.isNumber(activity[field]) || activity[field] < 0) { // if no lookup value is set do not lookup
									return '';
								}

								var result = _.find(lookupcache.get(formatterOptions.lookupType), {
									Id: activity[field]
								});
								return stringify(result, formatterOptions.displayMember, printmode);
							};
					}

					function stringify(result, displayMember, printmode) {
						var formatted = _.get(result, displayMember, '');
						if (printmode) {
							if (!_.isString(result)) { // in case formatter does NOT return string
								result = JSON.stringify(result);
							}
							formatted = JSON.stringify(formatted).slice(1, -1);
						}
						return formatted;
					}
				}
			}
		}
	]);
