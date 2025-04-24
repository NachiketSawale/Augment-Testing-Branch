/**
 * Created by joshi on 11.10.2016.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global moment */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainDurationCalculatorService
	 * @function
	 *
	 * @description
	 * estimateMainDurationCalculatorService is the data service for line item duration calculations.
	 */
	estimateMainModule.factory('estimateMainDurationCalculatorService',
		['$q', 'PlatformMessenger', 'basicsUnitLookupDataService', 'calendarUtilitiesService',
			function ($q, PlatformMessenger, basicsUnitLookupDataService, calendarUtilitiesService) {

				let service = {
					getDuration: getDuration
				};

				function getDuration(lineItem) {
					if(!lineItem){
						return;
					}

					let fromDate =  moment.isMoment(lineItem.FromDate) ? lineItem.FromDate : moment.utc(lineItem.FromDate),
						toDate =  moment.isMoment(lineItem.ToDate) ? lineItem.ToDate : moment.utc(lineItem.ToDate);

					if(Date.parse(toDate) < Date.parse(fromDate)) {
						let defer = $q.defer();

						defer.resolve(null);
						return defer.promise;
					}

					return getUomItem(lineItem.BasUomFk).then(function(result){
						let uomItem = result;
						if(!uomItem){
							return;
						}
						let defer = $q.defer();
						switch(uomItem.UomTypeFk){
							// case 1:// Freie Mengeneinheit
							// it is Days between FROMDATE and TODATE
							// defer.resolve(getDays(fromDate, toDate));
							// break;
							// case 2://Kalendertage
							// qty = getDaysFrmCalendar(fromDate, toDate, lineItem.ProjectFk);
							// break;
							case 3:// Arbeitstage laut Kalender
								defer.resolve( getWorkingDaysFrmCalendar(fromDate, toDate, lineItem.ProjectFk));
								break;
							case 4:// Woche
								defer.resolve(getWeeks(fromDate, toDate));
								break;
							case 5:// Monat
								defer.resolve(getMonths(fromDate, toDate));
								break;
							case 6:// Jahr
								defer.resolve(getYears(fromDate, toDate));
								break;
							case 7:// Arbeitsstunden laut Kalender
								defer.resolve(getWorkingHoursFrmCalendar(fromDate, toDate, lineItem.ProjectFk));
								break;
							default:
								defer.resolve(getDays(fromDate, toDate));
								break;

						}
						return defer.promise;
					});
				}

				function getUomItem(uomFk) {
					return basicsUnitLookupDataService.getItemByIdAsync(uomFk, {lookupType:'Uom', dataServiceName:'basicsUnitLookupDataService'})
						.then(function(uom){
							return uom;
						});
				}

				function getWorkingHoursFrmCalendar(fromDate, toDate, prjId) {
					return calendarUtilitiesService.getWorkingHours(prjId, fromDate, toDate);
				}

				function getDays(fromDate, toDate) {
					return toDate.diff(fromDate, 'days', true);
				}

				function getWorkingDaysFrmCalendar(fromDate, toDate, prjId) {
					return calendarUtilitiesService.getWorkingDays(prjId, fromDate, toDate);
				}

				function getWeeks(fromDate, toDate) {
					return toDate.diff(fromDate, 'week', true);
				}

				function getMonths(fromDate, toDate) {
					return toDate.diff(fromDate, 'month', true);
				}

				function getYears(fromDate, toDate) {
					return toDate.diff(fromDate, 'year', true);
				}

				return service;
			}]);
})(angular);
