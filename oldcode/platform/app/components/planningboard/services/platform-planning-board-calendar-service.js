(function () {

	'use strict';

	angular.module('platform').service('platfromPlanningBoardCalendarService', PlatfromPlanningBoardCalendarService);

	PlatfromPlanningBoardCalendarService.$inject = ['moment', '$http', '$q', 'platformModalFormConfigService', 'calendarUtilitiesService'];

	function PlatfromPlanningBoardCalendarService(moment, $http, $q, platformModalFormConfigService, calendarUtilitiesService) {
		var service = this;

		let calendarCache = new Map();

		// onCalendarDateTooltipDblClick
		service.openCalendarDayEditDialog = (dateObject, planningboardDataService) => {
			let isNonExceptionDay = false;
			let description = '';
			let workEnd = moment.utc(dateObject.day.endOf('d').toString());
			let workStart = moment.utc(dateObject.day.startOf('d').toString());
			let backgroundColor = null;

			let formConfig = {
				fid: 'productionplanning.productionplace.phase.integration.dialog',
				version: '1.0.0',
				groups: [{
					gid: '1',
					isOpen: true
				}],
				rows: [
					{
						gid: '1',
						rid: 'isNonExceptionDay',
						model: 'isNonExceptionDay',
						type: 'boolean',
						label: 'Working day',
						visible: true
					},
					{
						gid: '1',
						rid: 'Description',
						model: 'description',
						type: 'description',
						label: 'Description',
						visible: true
					},
					{
						gid: '1',
						rid: 'WorkStart',
						model: 'workStart',
						type: 'time',
						label: 'Work Start',
						visible: true
					},
					{
						gid: '1',
						rid: 'WorkEnd',
						model: 'workEnd',
						type: 'time',
						label: 'Work End',
						visible: true,
					},
					{
						gid: '1',
						rid: 'BackgroundColor',
						model: 'backgroundColor',
						type: 'color',
						label: 'Background Color',
						visible: true
					}
				]
			};

			let supplierCalendar = planningboardDataService.calendarInUse;
			const chachedCalendarForService = service.getCachedCalendars(planningboardDataService.getSupplierConfig().uuid)
			if (chachedCalendarForService && chachedCalendarForService.has(dateObject.calendarId)) {
				supplierCalendar = chachedCalendarForService.get(dateObject.calendarId);
			}

			if (dateObject.type === 'exday' && supplierCalendar.ExceptionDays.map(x => x.ExceptDate.format('YYYYMMDD')).includes(dateObject.day.format('YYYYMMDD'))) {
				let clickedexceptionDay = supplierCalendar.ExceptionDays.find(x => x.ExceptDate.format('YYYYMMDD') === dateObject.day.format('YYYYMMDD'));

				isNonExceptionDay = clickedexceptionDay.IsWorkday;
				description = clickedexceptionDay.DescriptionInfo.Description;
				workEnd = clickedexceptionDay.WorkEnd ? moment(clickedexceptionDay.WorkEnd, 'HH:mm:ss') : workEnd;
				workStart = clickedexceptionDay.WorkStart ? moment(clickedexceptionDay.WorkStart, 'HH:mm:ss') : workStart;
				backgroundColor = clickedexceptionDay.BackgroundColor;
			}


			let dialogConfig = {
				title: dateObject.day.format('DD/MM/yyyy'),
				resizeable: true,
				showOkButton: true,
				formConfiguration: formConfig,
				dataItem: {
					 isNonExceptionDay: isNonExceptionDay,
					 description: description,
					 workEnd: workEnd,
					 workStart: workStart,
					 backgroundColor: backgroundColor
				},
			};

			platformModalFormConfigService.showDialog(dialogConfig).then(function (result) {
				if (result.ok) {
					let promise = {};

					if (dateObject.type === 'exday' && supplierCalendar.ExceptionDays.map(x => x.ExceptDate.format('YYYYMMDD')).includes(dateObject.day.format('YYYYMMDD'))) {
						promise = $http.get(globals.webApiBaseUrl + 'scheduling/calendar/exceptionday/list?mainItemId=' + supplierCalendar.CalendarId);
					} else {
						promise = $http.post(globals.webApiBaseUrl + 'scheduling/calendar/exceptionday/create', { PKey1: supplierCalendar.CalendarId });
					}
					promise.then((calendarObject) => {
						let updateObject = {
							'EntitiesCount': 1,
							'ExceptionDaysToSave': [

							],
							'MainItemId': supplierCalendar.CalendarId
						};
						let foundExceptionDay = _.isArray(calendarObject.data) ? calendarObject.data.find(y => moment(y.ExceptDate).isSame(dateObject.day)) : calendarObject.data;
						foundExceptionDay.IsWorkday = result.data.isNonExceptionDay;

						foundExceptionDay.WorkStart = result.data.workStart.format('HH:mm:ss');
						foundExceptionDay.WorkEnd = result.data.workEnd.format('HH:mm:ss');
						foundExceptionDay.ExceptDate = dateObject.day.toISOString();
						foundExceptionDay.DescriptionInfo.Description = foundExceptionDay.DescriptionInfo.Translated = result.data.description;
						if (result.data.backgroundColor) {
							foundExceptionDay.BackgroundColor = result.data.backgroundColor;
						}
						updateObject.ExceptionDaysToSave.push(foundExceptionDay);

						$http.post(globals.webApiBaseUrl + 'scheduling/calendar/update', updateObject).then((r) => {
							if (planningboardDataService.getDateshiftConfig()) {
								let calendarData = planningboardDataService.getDateshiftConfig().dateShiftHelperService.getCalendarData(planningboardDataService.getDateshiftConfig().dataService.getServiceName());
								planningboardDataService.getDateshiftConfig().dataService.updateCalendarData(calendarData, planningboardDataService.getDateshiftConfig().dataService.getServiceName());
							}
							planningboardDataService.loadCalendarOnly(true);

						});
					});
				}
			});
		};

		service.getCalendarsByIds = (serviceId, calendarIds = [], startDate = null, endDate = null, forceReload = false) =>  {
			let promiseList = [];

			if (!calendarCache.has(serviceId)) {
				calendarCache.set(serviceId, new Map());
			}

			const filteredCalendars = !forceReload ? calendarIds.filter(cId => !calendarCache.get(serviceId).has(cId)) : calendarIds;

			filteredCalendars.forEach(cId => {
				// calendarUtilitiesService is a module service, but it has all calendar fns... are we allowed to use it in platform?
				// its already been long used in ds calendar service
				promiseList.push(calendarUtilitiesService.getCalendarChartDataInRange(cId, startDate, endDate).then(result => {
					calendarCache.get(serviceId).set(cId, result);
				}));
			});
			return $q.all(promiseList).then(() => {
				return calendarCache.get(serviceId);
			});
		}

		service.getCachedCalendars = (serviceId) =>  {
			return calendarCache.get(serviceId);
		}

		return service;
	}
})(angular);