(function () {

	'use strict';

	angular.module('productionplanning.item').factory('ppsItemGanttMappingServiceFactory', PpsItemGanttMappingServiceFactory);

	PpsItemGanttMappingServiceFactory.$inject = ['_', 'moment', 'platformGridAPI', 'platformGanttTemplateService'];

	function PpsItemGanttMappingServiceFactory(_, moment, platformGridAPI, platformGanttTemplateService) {
		var factory = this;
		var templates = platformGanttTemplateService.getTemplates();

		// var dtos = factory.mapElements(service.getList())

		// function implementMemberAccess(field, element, value) {
		// 	// nullable values are accepted
		// 	if (!_.isUndefined(value)) {
		// 		element[field] = value;
		// 	}
		// 	return element[field];
		// }

		// function implementNumberMemberAccess(field, element, value) {
		// 	// nullable values are accepted
		// 	if (_.isNumber(value) || value === null) {
		// 		element[field] = value;
		// 	}
		// 	return element[field];
		// }

		factory.createNewGanttMappingService = function createNewGanttMappingService(config) {
			var mappingService = this;

			// don't change config here. this is just the fallback
			var localconfig = {
				templatemaps: [],
				containerId: 0,
				bartype: 'ActivityType',
				barstate: ''
			};

			_.merge(localconfig, config);

			// public mapping functions
			mappingService.mapElements = mapElements;
			mappingService.mapRelationships = mapRelationships;
			mappingService.getValidationServiceFacade = createValidationServiceFacade;
			mappingService.getCalendarChartData = getCalendarChartData;

			function mapElements(elements) {
				var mapped = [];
				// filter element with start and end is null
				elements = elements.filter((element) => {
					return element.PlannedStart !== null && element.PlannedFinish !== null;
				});
				localconfig.templatemaps.forEach(function (templatemap) {
					var templateGroup = _.find(templates, {
						'id': templatemap.templatekey
					});
					templateGroup.type = templatemap.type;
					mapped.push(mapElement(elements, localconfig, templateGroup));
				});

				return mapped;
			}

			function mapElement(elements, localconfig, templateGroup) {
				var barStart, barEnd;

				switch (templateGroup.type) {
					case 'current':
						barStart = 'CurrentStart';
						barEnd = 'CurrentFinish';
						break;
					case 'planned':
						barStart = 'PlannedStart';
						barEnd = 'PlannedFinish';
						break;
					case 'actual':
						barStart = 'ActualStart';
						barEnd = 'ActualFinish';
						break;
				}

				return elements.map(function (element, myindex) {
					/*id rowIndex barStart barEnd barConfig*/
					return Object.create({}, {
						'id': {
							get: function () {
								return element.Id;
							},
							enumerable: true
						},
						'rowIndex': {
							value: myindex,
							enumerable: true,
						},
						'isSelectable': {
							get: function () {
								return !element.IsLocked && element.HasWriteRight && (element.ActivityType === 1 || element.ActivityType === 5); // Item must not be a milestone or summary
							},
							enumerable: true
						},
						'barStart': {
							get: function () {
								return element[barStart];
							},
							set: function (value) {
								element[barStart] = value;
							}
						},
						'barEnd': {
							get: function () {
								return element[barEnd];
							},
							set: function (value) {
								element[barEnd] = value;
							}
						},
						'isLocked': {
							get: function () {
								return element.IsLocked || false;
							},
							set: function (value) {
								element.IsLocked = value;
							}
						},
						'barConfig': {
							get: function barConfigurationOfElement() {
								// configobject
								// templatemap
								// templates
								var barinfo = {
									up: 0.2,
									down: 0.8,
									fill: '#7FB2D7'
								};
								var mytype = localconfig;

								// type // state
								var bartype = element[mytype.bartype];
								var barstate = element[mytype.barstate];

								var barinfos = _.filter(templateGroup.templates, {
									'type': bartype
								});
								barinfo = _.find(barinfos, {
									'state': barstate
								});
								if (!barinfo) {
									barinfo = barinfos[0];
								}

								//barinfo.bartype.editable = true;
								barinfo.bartype.editable = element.HasWriteRight;
								//editable = (act.ActivityTypeFk === 1 || act.ActivityTypeFk === 3 || act.ActivityTypeFk === 5) && template.type === 'planned';
								// Is item editable or not. For example baseline items are not editable. By default we make all templates editable here.

								return barinfo.bartype;
							}
						}
					});
				});
			}

			function mapRelationships(rs, elements) {
				var mapped = [];
				// filter element with start and end is null
				elements = elements.filter((element) => {
					return element.PlannedStart !== null && element.PlannedFinish !== null;
				});
				localconfig.templatemaps.forEach(function (templatemap) {
					var templateGroup = _.find(templates, {
						'id': templatemap.templatekey
					});
					templateGroup.type = templatemap.type;
					mapped.push(mapRelationship(elements, rs, localconfig, templateGroup));
				});

				return mapped[0];
			}

			function mapRelationship(elements, rs, localconfig, templateGroup) {
				var barStart, barEnd;
				switch (templateGroup.type) {
					case 'current':
						barStart = 'CurrentStart';
						barEnd = 'CurrentFinish';
						break;
					case 'planned':
						barStart = 'PlannedStart';
						barEnd = 'PlannedFinish';
						break;
					case 'actual':
						barStart = 'ActualStart';
						barEnd = 'ActualFinish';
						break;
				}

				return rs.map(generatePoints);

				function generatePoints(rl) {
					var endpoint;
					var parentx, parenty2, childx, childy1;

					var parent = _.find(elements, {
						'Id': rl.CompositePredecessorFk
					});
					var child = _.find(elements, {
						'Id': rl.CompositeSuccessorFk
					});
					if (!parent || !child) {
						return false;
					}
					var points = [];

					parenty2 = rl.CompositePredecessorFk;
					childy1 = rl.CompositeSuccessorFk;

					// Also handle milestone case (which is ALWAYS relationship to finish

					switch (rl.RelationKindFk) {
						case 2:
							/*Finish-Finish*/
							parentx = parent[barEnd];
							childx = child[barEnd];
							break;
						case 3:
							/*Start-Finish*/
							parentx = parent[barStart];
							childx = child[barEnd];
							break;
						case 4:
							/*Start-Start*/
							parentx = parent[barStart];
							childx = child[barStart];
							break;
						/*Finish-Start*/
						case 1:
							/* jshint -W086 */ // Fall-through intended because case 1 is also default
							parentx = parent[barEnd];
							childx = child[barStart];
							break;
						default:
							parentx = parent[barEnd];
							childx = child[barStart];
					}

					// Special case milestone as relationship child
					if (child.ActivityTypeFk === 3) {
						childx = child[barEnd];
					}

					points.push({
						t: parentx,
						h: parenty2,
						hadjust: 0.8 /*'down'*/
					});
					points.push({
						t: parentx,
						h: 'halfy',
						hadjust: 0.5 /*'down/up'*/
					});
					points.push({
						t: childx,
						h: 'halfy',
						hadjust: 0.5 /*'down/up'*/
					});
					points.push({
						t: childx,
						h: childy1,
						hadjust: 0.2 /*'up - 4'*/
					});
					endpoint = {
						t: childx,
						h: childy1,
						hadjust: 0.2 /*'up'*/
					};

					return {
						id: rl.Id,
						parentid: parenty2,
						childid: childy1,
						points: points,
						endpoint: endpoint,
						isCritical: rl.IsCritical
					};
				}
			}

			function createValidationServiceFacade() {
				var serviceFacade = {};

				switch (localconfig.templatemaps[0].type) {
					case 'planned':
						serviceFacade.validateActivityOnDraw = function validateActivityOnDraw(activityModel, scope) {
							var activities = scope.orgiginalLeftGridData;
							var gridId = scope.leftGridId;
							if (!_.isNil(activityModel)) {
								var startMoment = (moment(activityModel.BarStart).utc().diff(activityModel.barStart, 'seconds') !== 0) ? moment(activityModel.BarStart).utc() : activityModel.barStart;
								var endMoment = (moment(activityModel.BarEnd).utc().diff(activityModel.barEnd, 'seconds') !== 0) ? moment(activityModel.BarEnd).utc() : activityModel.barEnd;
								var trigger = {
									Id: _.find(activities, function (activity) {
										return activity.Id === activityModel.id;
									}).OriginalId,
									OriginalId: _.find(activities, function (activity) {
										return activity.Id === activityModel.id;
									}).OriginalId,
									PlannedStart: startMoment,//moment(activityModel.BarStart),
									PlannedFinish: endMoment//moment(activityModel.BarEnd)
								};

								var shiftedEvents;
								if (activityModel.circle === 'mid') {
									// asuming virtual shift
									shiftedEvents = scope.dateshiftConfig.dataService.shiftVirtualEntity(trigger,
										scope.dateshiftConfig.entityName,
										scope.dateshiftConfig.dateshiftId,
										'fullShift',
										true,
										'OriginalId');
									//shiftedEvents = scope.dateShiftHelperService.shiftDate(scope.leftGridDataService.getServiceName(), trigger, false, 'dualShift');
								} else {
									shiftedEvents = scope.dateshiftConfig.dataService.shiftVirtualEntity(trigger,
										scope.dateshiftConfig.entityName,
										scope.dateshiftConfig.dateshiftId,
										undefined,
										true,
										'OriginalId');
									//shiftedEvents = scope.dateShiftHelperService.shiftDate(scope.leftGridDataService.getServiceName(), trigger);
								}

								// todo: this part must work without updating the real dataservice
								// if (shiftedEvents.length > 0) {
								// 	_.forEach(shiftedEvents, (event) => {
								// 		// set gridData
								// 		var gridElements = _.filter(scope.leftGridData, {OriginalId: event.Id});
								// 		gridElements.forEach((gridElement) => {
								// 			gridElement[scope.leftGridDataService.config.start] = moment(event[scope.leftGridDataService.config.start]);
								// 			gridElement[scope.leftGridDataService.config.end] = moment(event[scope.leftGridDataService.config.end]);
								// 		});
								//
								// 		// set rowData
								// 		var rowData = _.filter(platformGridAPI.rows.getRows(gridId), {OriginalId: event.Id});
								// 		rowData.forEach((data) => {
								// 			data[scope.leftGridDataService.config.start] = moment(event[scope.leftGridDataService.config.start]);
								// 			data[scope.leftGridDataService.config.end] = moment(event[scope.leftGridDataService.config.end]);
								// 			// refresh rowData
								// 			platformGridAPI.rows.refreshRow({gridId: gridId, item: event});
								// 		});
								// 	});
								// }

								// todo this part can be removed because gridrefresh is working
								// let event = shiftedEvent;
								// scope.leftGridDataService.gridRefresh();
								// scope.leftGridData = scope.leftGridDataService.getList();
								// if (event) {
								// 	// set gridData
								// 	var gridElement = _.find(scope.leftGridData, {OriginalId: event.OriginalId});
								// 	gridElement[scope.leftGridDataService.config.start] = moment(event[scope.leftGridDataService.config.start]);
								// 	gridElement[scope.leftGridDataService.config.end] = moment(event[scope.leftGridDataService.config.end]);
								// 	// mark item as modified to save changes
								// 	//scope.leftGridDataService.markItemAsModified(gridElement);
								//
								// 	// set rowData
								// 	var rowData = _.find(platformGridAPI.rows.getRows(gridId), {OriginalId: event.OriginalId});
								// 	if (!_.isUndefined(rowData)) {
								// 		rowData[scope.leftGridDataService.config.start] = moment(event[scope.leftGridDataService.config.start]);
								// 		rowData[scope.leftGridDataService.config.end] = moment(event[scope.leftGridDataService.config.end]);
								// 		// refresh rowData
								// 		platformGridAPI.rows.refreshRow({gridId: gridId, item: event});
								// 	}
								// }
								// todo: remove this part after gridRefresh is working
								// _.forEach(shiftedEvents, function (event) {
								// 	if (event.hasChanged) {
								// 		// set gridData
								// 		var gridElement = _.find(scope.leftGridData, {Id: event.Id});
								// 		gridElement[scope.leftGridDataService.config.start] = moment(event[scope.leftGridDataService.config.start]);
								// 		gridElement[scope.leftGridDataService.config.end] = moment(event[scope.leftGridDataService.config.end]);
								// 		// mark item as modified to save changes
								// 		//scope.leftGridDataService.markItemAsModified(gridElement);
								//
								// 		// set rowData
								// 		var rowData = _.find(platformGridAPI.rows.getRows(gridId), {Id: event.Id});
								// 		if (!_.isUndefined(rowData)) {
								// 			rowData[scope.leftGridDataService.config.start] = moment(event[scope.leftGridDataService.config.start]);
								// 			rowData[scope.leftGridDataService.config.end] = moment(event[scope.leftGridDataService.config.end]);
								// 			// refresh rowData
								// 			platformGridAPI.rows.refreshRow({gridId: gridId, item: event});
								// 		}
								// 	}
								// });
							}

							var checkedItems = [];
							findAndUpdateChildItems(scope.leftGridData, false);

							function findAndUpdateChildItems(items, parent) {
								var minStartArr = [];
								var minStart;
								var maxFinishArr = [];
								var maxFinish;

								_.forEach(items, function (item) {
									var checked = _.find(checkedItems, function (checkItem) {
										return item[scope.leftGridDataService.config.id] === checkItem[scope.leftGridDataService.config.id];
									}) || false;
									if (item.ChildItems && item.ChildItems.length > 0 && !checked) {
										checkedItems.push(item);
										findAndUpdateChildItems(item.ChildItems, item);
									}
									if (!_.isNull(item[scope.leftGridDataService.config.start])) {
										minStartArr.push(item[scope.leftGridDataService.config.start]);
									}
									if (!_.isNull(item[scope.leftGridDataService.config.end])) {
										maxFinishArr.push(item[scope.leftGridDataService.config.end]);
									}
								});
								if (minStartArr.length > 0) {
									minStart = moment.min(minStartArr);
								}
								if (maxFinishArr.length > 0) {
									maxFinish = moment.max(maxFinishArr);
								}

								if (parent && _.isObject(parent)) {
									parent[scope.leftGridDataService.config.start] = moment(minStart);
									parent[scope.leftGridDataService.config.end] = moment(maxFinish);

									// set rowData
									var rowData = _.find(platformGridAPI.rows.getRows(gridId), {Id: parent.Id});
									if (!_.isUndefined(rowData)) {
										rowData[scope.leftGridDataService.config.start] = moment(parent[scope.leftGridDataService.config.start]);
										rowData[scope.leftGridDataService.config.end] = moment(parent[scope.leftGridDataService.config.end]);
										// refresh rowData
										platformGridAPI.rows.refreshRow({gridId: gridId, item: parent});
									}
								}
							}
						};
						break;
					default:
						// eslint-disable-next-line no-console
						console.warn('No validationServiceFacade implemented for type: ' + localconfig.type);
						break;
				}
				return serviceFacade;
			}

			/**
			 *@ngdoc function
			 *@name productionplanning.item:ppsItemGanttMappingServiceFactory getCalendarChartData
			 *@param {object} productionplanningItemEventService
			 *@description returns calendarData from dataService to be used in a chart.
			 *
			 */
			function getCalendarChartData(service) {
				var calendarData = [];
				if (service.calendarData) {
					if (_.isMap(service.calendarData)) {
						calendarData = Array.from(service.calendarData.values()).length > 0 ? _.cloneDeep(Array.from(service.calendarData.values())[0]) : [];
					} else {
						calendarData = _.cloneDeep(service.calendarData);
					}
					_.forEach(calendarData, function (data) {
						data.holidays = [];
						_.forEach(data.ExceptionDaysUnfiltered, function (day) {
							var holiday = {
								'Start': moment(day.ExceptDate.startOf('day')),
								'End': moment(day.ExceptDate.endOf('day')),
								'Color': day.BackgroundColor
							};
							data.holidays.push(holiday);
						});
					});
				}

				return (calendarData.length > 0) ? calendarData[0] : [];
			}

			return mappingService;
		};

		return factory;
	}
})();
