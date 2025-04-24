(function () {
	'use strict';
	/* global angular, globals, moment, _ */

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonSerialProductionDialogService', [
		'$http', '$q', 'platformTranslateService',
		'basicsLookupdataLookupFilterService', 'platformDataValidationService', '$translate',
		'platformRuntimeDataService', '$injector',
		function ($http, $q, platformTranslateService,
			basicsLookupdataLookupFilterService, platformDataValidationService, $translate,
			platformRuntimeDataService, $injector) {
			let service = {};
			let formCfg;
			let alerts = [];
			let warnings = [];
			let isOKHandling = false,
				dataItem = null,
				subPuSiteId,
				subPuSiteChildrenIds,
				minProductionStart = null,
				maxProductionEnd = null,
				plannedQty, openQty, weekDays, watchWeekdaysFn, productionOverdue, validateBounds,
				calendarId, isCalculatingEndDate, isStartDateValid = false;
			let validDates = {};

			const prodPlaceFilterKey = 'serialProductionPlaceFilterBySite';

			service.getProdPlaceFilterKey = () => {
				return prodPlaceFilterKey;
			};

			let filters = [{
				key: prodPlaceFilterKey,
				fn: function (item) {
					return subPuSiteChildrenIds.indexOf(item.BasSiteFk) > -1;
				}
			}];

			service.registerProdPlaceFilter = () => {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};
			service.unregisterProdPlaceFilter = () => {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			function hasValidationError() {
				return !dataItem.ProductionPlaceFk || !endDateCalcFactorsValid() || productionOverdue;
			}

			function isStartDateBetweenProdSet(startDate = dataItem.StartDate) {
				return !validateBounds || (startDate >= minProductionStart && startDate <= maxProductionEnd);
			}

			function endDateCalcFactorsValid() {
				return dataItem.QuantityToProduce > 0 && dataItem.QuantityPerDay > 0 && isStartDateValid &&
					!Object.getOwnPropertyNames(weekDays).every((day)=> {
						return weekDays[day] === false;
					});
			}

			service.init = function (subPU, prodSetEvent) {
				setBusy(true);
				let defer = $q.defer();
				alerts.length = 0;
				warnings.length = 0;
				isOKHandling = false;
				productionOverdue = false;
				isStartDateValid = false;
				plannedQty = subPU.Quantity;
				openQty = subPU.OpenQuantity;
				subPuSiteId = subPU.SiteFk;
				minProductionStart = prodSetEvent.PlannedStart;
				maxProductionEnd = prodSetEvent.PlannedFinish;
				validateBounds = prodSetEvent.DateshiftMode === 1;
				calendarId = prodSetEvent.CalCalendarFk;
				watchWeekdaysFn = [];
				weekDays = {
					workOnMonday: true,
					workOnTuesday: true,
					workOnWednesday: true,
					workOnThursday: true,
					workOnFriday: true,
					workOnSaturday: false,
					workOnSunday: false,
				};
				validDates = {
					title: $translate.instant('productionplanning.common.serialProduction.validDatesTitle')
				};

				$http.get(globals.webApiBaseUrl + 'basics/sitenew/getchildrenids?siteid=' + subPuSiteId).then((responses) => {
					subPuSiteChildrenIds = responses.data;
					dataItem = {
						SubPlanningUnitFk: subPU.Id,
						PlannedQuantity: plannedQty,
						OpenQuantity: openQty,
						QuantityToProduce: 1,
						QuantityPerDay: 1,
						StartDate: prodSetEvent.PlannedStart,
						EndDate: null,
						ProductionPlaceFk: undefined,
						EmptyWeekday: true,
						weekDays: weekDays,
						calendarId: calendarId,
						validDates: validDates
					};
					validateQuantityToProduce(dataItem, dataItem.QuantityToProduce, 'QuantityToProduce');
					validateStartDate(dataItem, dataItem.StartDate, 'StartDate');
					calculateEndDate().then(endDate => {
						setBusy(false);
						defer.resolve(dataItem);
						//validateProductionPlace(dataItem, dataItem.ProductionPlaceFk, 'ProductionPlaceFk');
					});
				});
				return defer.promise;
			};

			service.getAlerts = function () {
				return alerts;
			};

			service.getWarnings = function () {
				return warnings;
			};
			service.handleOK = function () {
				isOKHandling = true;
				setBusy(true);

				return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/serialproduction', dataItem).then(function (response) {
					return response.data;
				}).finally(function () {
					isOKHandling = false;
					setBusy(false);
				});
			};

			service.isDisabled = function (button) {
				if (button === 'ok') {
					return isCalculatingEndDate || hasValidationError();
				} else {
					return false;
				}
			};

			service.getFromCfg = function getFromCfg() {
				if (!formCfg) {
					formCfg = {
						fid: 'productionplanning.common.serialProduction.',
						version: '1.0.0',
						showGrouping: false,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: [{
							gid: 'baseGroup',
							rid: 'plannedquantity',
							model: 'PlannedQuantity',
							sortOrder: 1,
							label$tr$: 'productionplanning.common.serialProduction.plannedQuantity',
							type: 'decimal',
							readonly: true
						}, {
							gid: 'baseGroup',
							rid: 'openquantity',
							model: 'OpenQuantity',
							sortOrder: 2,
							label$tr$: 'productionplanning.common.serialProduction.openQuantity',
							type: 'decimal',
							readonly: true
						}, {
							gid: 'baseGroup',
							rid: 'quantitytoproduce',
							model: 'QuantityToProduce',
							sortOrder: 3,
							label$tr$: 'productionplanning.common.serialProduction.quantityToProduce',
							type: 'integer',
							required: true,
							validator: validateQuantityToProduce,
							change: OnFactorChanged
						}, {
							gid: 'baseGroup',
							rid: 'quantityperday',
							model: 'QuantityPerDay',
							sortOrder: 4,
							label$tr$: 'productionplanning.common.serialProduction.quantityPerDay',
							type: 'integer',
							required: true,
							validator: validateQuantityPerDay,
							change: OnFactorChanged
						}, {
							gid: 'baseGroup',
							rid: 'startdate',
							model: 'StartDate',
							sortOrder: 5,
							label$tr$: 'productionplanning.common.serialProduction.startDate',
							type: 'dateutc',
							required: true,
							validator: validateStartDate,
							change: OnFactorChanged
						}, {
							gid: 'baseGroup',
							rid: 'enddate',
							model: 'EndDate',
							sortOrder: 6,
							label$tr$: 'productionplanning.common.serialProduction.endDate',
							type: 'dateutc',
							readonly: true
						}, {
							gid: 'baseGroup',
							rid: 'productionplacefk',
							model: 'ProductionPlaceFk',
							sortOrder: 6,
							label$tr$: 'productionplanning.common.serialProduction.resource',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'pps-production-place-dialog-lookup',
								lookupOptions: {
									lookupType: 'PpsProductionPlace',
									filterKey: prodPlaceFilterKey,
									version: 3
								}
							},
							required: true,
							validator: validateProductionPlace,
						}]
					};
					platformTranslateService.translateFormConfig(formCfg);
				}
				return formCfg;
			};

			function OnFactorChanged(entity, model) {
				if (entity[model]) {
					setBusy(true);
					calculateEndDate().then(endDate => {
						setBusy(false);
					});
				}
			}

			// service.watchWeekdays = (scope) => {
			// 	Object.getOwnPropertyNames(dataItem.weekDays).forEach((propName)=>{
			// 		watchWeekdaysFn.push(scope.$watch('dataItem.weekDays.'+propName, onWeekdayChanged));
			// 	});
			// };
			//
			// service.unwatchWeekdays = ()=>{
			// 	watchWeekdaysFn.forEach((unWatchFn)=>unWatchFn());
			// 	watchWeekdaysFn.length = 0;
			// };

			service.onWeekdayChanged = function onWeekdayChanged(){
				let isEmpty = Object.getOwnPropertyNames(dataItem.weekDays).every((propName) => {
					return dataItem.weekDays[propName] === false;
				});
				if (isEmpty) {
					addAlert4EmptyWeekdays();
				} else {
					removeAlert4EmptyWeekdays();
					setBusy(true);
					calculateEndDate().then(endDate => {
						setBusy(false);
					});
				}
			};

			let alert4EmptyWeekdays = {
				title: $translate.instant('productionplanning.common.serialProduction.weekDaysTitle'),
				message: $translate.instant('productionplanning.common.serialProduction.errors.noWeekdaySelected'),
				css: 'alert-info'
			};

			function addAlert4EmptyWeekdays() {
				let idx = alerts.indexOf(alert4EmptyWeekdays);
				if(idx < 0) {
					alerts[alerts.length] = alert4EmptyWeekdays;
				}
			}

			function removeAlert4EmptyWeekdays(){
				let idx = alerts.indexOf(alert4EmptyWeekdays);
				if(idx > -1){
					alerts.splice(idx, 1);
				}
			}

			let alert4ProductionOverdue = {
				title: $translate.instant('productionplanning.common.serialProduction.errors.productionDateOverdueTitle'),
				message: $translate.instant('productionplanning.common.serialProduction.errors.productionDateOverdueMsg'),
				css: 'alert-info'
			};

			function addAlert4ProductionOverdue(){
				let idx = alerts.indexOf(alert4ProductionOverdue);
				if(idx < 0) {
					alerts[alerts.length] = alert4ProductionOverdue;
				}
				productionOverdue = true;
			}

			function removeAlert4ProductionOverdue(){
				let idx = alerts.indexOf(alert4ProductionOverdue);
				if(idx > -1){
					alerts.splice(idx, 1);
				}
				productionOverdue = false;
			}

			let warning4QuantityToProduce = {
				message: $translate.instant('productionplanning.common.serialProduction.errors.warningQuantityToProduceExceed'),
				css: 'alert-warning'
			};

			function addWarning4QuantityToProduce(){
				let idx = warnings.indexOf(warning4QuantityToProduce);
				if(idx < 0) {
					warnings[warnings.length] = warning4QuantityToProduce;
				}
			}

			function removeWarning4QuantityToProduce(){
				let idx = warnings.indexOf(warning4QuantityToProduce);
				if(idx > -1){
					warnings.splice(idx, 1);
				}
			}

			function validateQuantityToProduce(entity, value, model) {
				let res = platformDataValidationService.isMandatory(value, model, {fieldName: $translate.instant('productionplanning.common.serialProduction.quantityToProduce')});
				if (res.valid) {
					if(value <= 0) {
						res = platformDataValidationService.createErrorObject('productionplanning.common.serialProduction.errors.zeroQuantityToProduce', null);
					}
					if(value > entity.OpenQuantity) {
						addWarning4QuantityToProduce();
					} else{
						removeWarning4QuantityToProduce();
					}
				}
				platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityToProduce');
				return res;
			}

			function validateQuantityPerDay(entity, value, model) {
				let res = platformDataValidationService.isMandatory(value, model, {fieldName: $translate.instant('productionplanning.common.serialProduction.quantityPerDay')});
				if(res.valid && value <= 0){
					res = platformDataValidationService.createErrorObject('productionplanning.common.serialProduction.errors.zeroQuantityPerDay', null);
				}
				platformRuntimeDataService.applyValidationResult(res, entity, 'QuantityPerDay');
				return res;
			}

			function validateStartDate(entity, value, model) {
				let res = platformDataValidationService.isMandatory(value, model, {fieldName: $translate.instant('productionplanning.common.serialProduction.startDate')});
				if (res.valid) {
					let errMsg = '';
					if (value < minProductionStart) { // this validation should be always active, independent of the Dateshift Mode(Ignore Bounds/Validate Bounds)
						errMsg = 'productionplanning.common.serialProduction.errors.startDateShouldNotBeLessThanPlannedFinishOfProdSetEventOfPU';
					}
					else if (!isStartDateBetweenProdSet(value)) {
						errMsg = 'productionplanning.common.serialProduction.errors.startDateExceed';
					}
					else if(!$injector.get('productionplanningCommonProductItemDataService').isAfterDateIfEngTaskEventShared(value)){
						errMsg = 'productionplanning.common.manualProduction.errors.shouldBeAfterEngineering';
					}
					if(errMsg !== ''){
						res = platformDataValidationService.createErrorObject(errMsg, null);
					}
				}
				platformRuntimeDataService.applyValidationResult(res, entity, 'StartDate');
				isStartDateValid = res.valid;
				return res;
			}

			function validateProductionPlace(entity, value, model) {
				let res = platformDataValidationService.isMandatory(value, model, {fieldName: $translate.instant('productionplanning.common.serialProduction.resource')});
				platformRuntimeDataService.applyValidationResult(res, entity, 'ProductionPlaceFk');
				return res;
			}

			function getDay2WeekDaysPropName(day) {
				switch (day){
					case 1: return 'workOnMonday';
					case 2: return 'workOnTuesday';
					case 3: return 'workOnWednesday';
					case 4: return 'workOnThursday';
					case 5: return 'workOnFriday';
					case 6: return 'workOnSaturday';
					case 0: return 'workOnSunday';
					default: throw new Error('input of day is invalid');
				}
			}

			function calculateEndDate() {
				if(!endDateCalcFactorsValid()) {
					return $q.resolve(null);
				}

				// let curDate = moment(dataItem.StartDate);
				// let estimateEndDate = moment(dataItem.StartDate);
				// let remainQty = dataItem.QuantityToProduce;
				// // calculate estimateEndDate
				// while(remainQty > 0){
				// 	let work = weekDays[getDay2WeekDaysPropName(curDate.day())];
				// 	if(work) {
				// 		remainQty = remainQty - dataItem.QuantityPerDay;
				// 	}
				// 	if(remainQty <= 0){
				// 		estimateEndDate = moment(curDate, 'YYYY-MM-DD').add(1, 'd').subtract(1, 's');
				// 		break;
				// 	}
				//
				// 	curDate = curDate.add(1, 'd');
				// }2
				//
				// // update EndDate, show error if necessary
				// dataItem.EndDate = estimateEndDate;
				// if(validateBounds) {
				// 	if(moment(estimateEndDate.format('YYYY-MM-DD')).isSameOrBefore(moment(maxProductionEnd.format('YYYY-MM-DD')))) { // just to compare the date
				// 		removeAlert4ProductionOverdue();
				// 	} else { //if(estimateEndDate.diff(maxProductionEnd) > 0) {
				// 		addAlert4ProductionOverdue();
				// 	}
				// }
				//
				// return estimateEndDate;

				isCalculatingEndDate = true;
				// send request to calculate end date
				return $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/serialproductiondates', dataItem).then(response => {
					isCalculatingEndDate = false;
					const prodDates = response.data;
					dataItem.EndDate = prodDates[prodDates.length - 1];
					dataItem.validDates.items = [];
					_.forEach(prodDates, function (date){
						var index = date.indexOf('T');
						dataItem.validDates.items .push(index < 0? date : date.slice(0, index));
					});

					// update EndDate, show error if necessary
					if(validateBounds) {
						if(moment(dataItem.EndDate).isSameOrBefore(moment(maxProductionEnd.format('YYYY-MM-DD')))) { // just to compare the date
							removeAlert4ProductionOverdue();
						} else { //if(estimateEndDate.diff(maxProductionEnd) > 0) {
							addAlert4ProductionOverdue();
						}
					}

					return prodDates[prodDates.length - 1];
				});
			}

			service.setBusyCallback = null;

			function setBusy(isBusy) {
				if (service.setBusyCallback) {
					service.setBusyCallback(isBusy);
				}
			}

			return service;
		}
	]);
})();