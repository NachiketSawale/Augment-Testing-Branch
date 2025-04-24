(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonDeliveryScheduleValidationService
	 * @description provides validation methods for delivery Schedule
	 */
	angular.module('procurement.common').factory('procurementCommonDeliveryScheduleValidationService',
		['$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'moment',function ($translate, platformDataValidationService, platformRuntimeDataService,moment) {
			return function (dataService) {
				var service = {};

				// to miss errors throws by form controller validation calling.
				service.validateModel = function () {
				};

				service.validateTimeRequired = function validateTimeRequired(entity, value) {
					if (value && value.isValid()) {
						value.toJSON = function () {
							return value.format('HH:mm:ss');
						};
					}

					return true;
				};

				// validate quantity and recalculate
				service.validateQuantity = function validateQuantity(entity, value, model/* , apply, errorParam */) {
					if (parseInt(value) < 0) {
						return false;
					}
					entity.Quantity = value;
					dataService.calculateQuantity();
					dataService.fireItemModified(entity);
					var result = {apply: true, valid: true};
					if (dataService.Scheduled.openQuantity === 0 || dataService.Scheduled.openQuantity === dataService.Scheduled.totalQuantity) {
						service.AllvalidateQuantity(true);
					}
					else {
						service.AllvalidateQuantity(false);
						result = {
							apply: false,
							error: $translate.instant('procurement.common.delivery.deliveryScheduleCalculateOpenQuantityError'),
							valid: false
						};
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					dataService.gridRefresh();
					return result;
				};

				service.validateDateRequired = function validateDateRequired(entity, value/* , model, apply, errorParam */) {
					var result = true;
					if (parseInt(value) < 0) {
						return false;
					}
					var DateRequired = dataService.calculateDateRequired();
					var DateValue = window.moment(value).utc();
					//  var result = dataService.calculateDateRequired() === window.moment(value).utc().format('DD/MM/YYYY');
					var duration = _.round(moment.duration(DateRequired.diff(DateValue)).asDays());
					if (duration > 0) {
						result = {
							apply: true,
							error: $translate.instant('procurement.common.delivery.deliveryModifyRequiredByError'),
							valid: false
						};
					}
					// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.validateNewDateRequired = function validateNewDateRequired(entity, value/* , model, apply, errorParam */) {
					var result = true;
					if (parseInt(value) < 0) {
						return false;
					}
					var NewDateRequired = dataService.calculateNewDateRequired();
					if(NewDateRequired)
					{
						var DateValue = window.moment(value).utc();
						//  var result = dataService.calculateDateRequired() === window.moment(value).utc().format('DD/MM/YYYY');
						var duration = _.round(moment.duration(NewDateRequired.diff(DateValue)).asDays());
						if (duration > 0) {
							result = {
								apply: true,
								error: $translate.instant('procurement.common.delivery.deliveryModifyRequiredByError'),
								valid: false
							};
						}
					}

					return result;
				};

				service.AllvalidateQuantity = function AllvalidateQuantity(apply) {
					var result = {apply: true, valid: true};
					if (!apply) {
						result = {
							apply: false,
							error: $translate.instant('procurement.common.delivery.deliveryScheduleCalculateOpenQuantityError'),
							valid: false
						};
					}
					_.each(dataService.getList(), function (item) {
						platformRuntimeDataService.applyValidationResult(result, item, 'Quantity');
						platformDataValidationService.finishValidation(result, item, item.Quantity, 'Quantity', service, dataService);
					});

				};

				service.validateRunningNumber = function (entity, value, model) {
					var result = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), 'RunningNumber', value, entity.Id, {object: $translate.instant('procurement.common.delivery.runningNumber')});

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

					return result;
				};
				return service;
			};
		}]);

})(angular);
