/**
 * Created by zwz on 9/17/2019.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningCommonEventValidationServiceExtension
	 * @function
	 * @requires platform:platformDataValidationService
	 * @description
	 * productionplanningCommonEventValidationServiceExtension adds common validation methods to validation services of ppsEvent or ppsDerivedEvent(like EngTask, TrsRoute and so on)
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('productionplanningCommonEventValidationServiceExtension',ValidationServiceExtension);
	ValidationServiceExtension.$inject = ['platformDataValidationService', 'platformDateshiftHelperService', '_', 'moment', 'productionplanningCommonEventDateshiftService', 'productionplanningCommonActivityDateshiftService'];
	function ValidationServiceExtension(platformDataValidationService, dateshiftHelperService, _, moment, ppsCommonEventDateshiftService, ppsCommonActivityDateshiftService) {


		/**
		 * @ngdoc function
		 * @name addMethodsForEvent
		 * @description Public function that adds validation functions to a passed validation service.
		 * The added methods apply to properties of an event entity and can be used for events and specialised events.
		 *
		 * @param {Object} service: The validation service the new methods are added to.
		 * @param {Object} dataServ: The dataService the validation service is attached to.
		 * @param {Object| string} [dateshiftConfig]: An optional config object for dateshift operations.
		 * Alternatively, a string can be passed to indicate a dateshift configuration based on a module id.
		 * @param { boolean } [useVds]: An optional flag. If set to true, VirtualDataService will be used for validation.
		 **/
		this.addMethodsForEvent = function addMethodsForEvent(service, dataServ, dateshiftConfig, useVds, dateshiftId) {
			service.validateEventTypeFk = function (entity, value, model) {
				var newValue = (value === 0 && entity.Version === 0) ? entity.EventTypeFk : value;
				return platformDataValidationService.validateMandatory(entity, newValue, model, service, dataServ);
			};

			function processResult(valid, apply) {
				var result = {};
				if (_.isObject(valid)) {
					result = valid;
				} else if (_.isBoolean(valid)) {
					result.valid = valid;
				}
				result.apply = apply;
				return result;
			}

			function postProcessPlannedTime(entity, originalDate, newDate, includeFinish) {
				function setNewMoment(momValue, diff) {
					return moment.isMoment(momValue)? moment(momValue.add(diff, 'seconds')) : momValue;
				}
				//only edit Earliest/Latest fields!
				var diff = newDate.diff(originalDate, 'seconds');
				if (includeFinish) {
					entity.PlannedFinish = setNewMoment(entity.PlannedFinish, diff);
				}
				//workaround for other fields right now
				entity.EarliestStart = setNewMoment(entity.EarliestStart, diff);
				entity.LatestStart = setNewMoment(entity.LatestStart, diff);
				entity.EarliestFinish = setNewMoment(entity.EarliestFinish, diff);
				entity.LatestFinish = setNewMoment(entity.LatestFinish, diff);
			}

			if (useVds === true) {
				ppsCommonActivityDateshiftService.extendDateshiftActivityValidation(service, dataServ, dateshiftConfig, dateshiftId);

				//standard implementation for planned time with the assumption of a field that updates all other date fields.
				service.asyncValidatePlannedTime = function asyncValidatePlannedTime (entity, value, model) {
					var orginalValue = moment(entity[model]);
					return ppsCommonActivityDateshiftService.shiftActivityAsync(entity, value, 'PlannedStart', dataServ, dateshiftConfig, dateshiftId, ppsCommonActivityDateshiftService.getMainEntityName(dataServ)).then((dsResult) => {
						postProcessPlannedTime(entity, orginalValue, dsResult.value, dsResult.dateshiftCancelled);
						value = dsResult.value;
						entity.PlannedTime = dsResult.value;
						return processResult(true, dsResult.apply);
					});
				};
			} else {

				service.asyncValidatePlannedStart = function (entity, value, model) {
					return ppsCommonEventDateshiftService.shiftEventAsync(entity, value, model, dataServ, dateshiftConfig).then(function (dsResult) {
						value = dsResult.value;
						var validationResult = service.validateDate(entity, value, model, value, entity.PlannedFinish, 'PlannedFinish');
						return processResult(validationResult, dsResult.apply);
					});
				};

				service.asyncValidatePlannedFinish = function (entity, value, model) {
					return ppsCommonEventDateshiftService.shiftEventAsync(entity, value, model, dataServ, dateshiftConfig).then(function (dsResult) {
						value = dsResult.value;
						var validationResult = service.validateDate(entity, value, model, entity.PlannedStart, value, 'PlannedStart');
						return processResult(validationResult, dsResult.apply);
					});
				};

				//standard implementation for planned time with the assumption of a field that updates all other date fields.
				service.asyncValidatePlannedTime = function (entity, value, model) {
					var orginalValue = moment(entity[model]);
					return ppsCommonEventDateshiftService.shiftEventAsync(entity, value, model, dataServ, dateshiftConfig).then(function (dsResult) {
						postProcessPlannedTime(entity, orginalValue, dsResult.value, dsResult.dateshiftCancelled);
						value = dsResult.value;
						return processResult(true, dsResult.apply);
					});
				};

			}

			service.validateEarliestStart = function (entity, value, model) {
				return service.validateDate(entity, value, model, value, entity.EarliestFinish, 'EarliestFinish');
			};
			service.validateEarliestFinish = function (entity, value, model) {
				return service.validateDate(entity, value, model, entity.EarliestStart, value, 'EarliestStart');
			};

			service.validateLatestStart = function (entity, value, model) {
				return service.validateDate(entity, value, model, value, entity.LatestFinish, 'LatestFinish');
			};
			service.validateLatestFinish = function (entity, value, model) {
				return service.validateDate(entity, value, model, entity.LatestStart, value, 'LatestStart');
			};

			service.validateDate = function (entity, value, model, startDate, endDate, relModel) {
				return platformDataValidationService.validatePeriod(startDate, endDate, entity, model, service, dataServ, relModel);
			};
		};

		this.addMethodsForDerivedEvent = function (service) {
			service.validateEntity = function (entity) {
				var fields = ['Code', 'PlannedStart', 'PlannedFinish', 'EarliestStart', 'EarliestFinish', 'LatestStart', 'LatestFinish'];
				_.each(fields,function (field) {
					if (service['validate' + field]) {
						var result = service['validate' + field](entity, entity[field], field);
						if ((result === true || (result && result.valid)) && entity.__rt$data.errors && entity.__rt$data.errors[field]) {
							delete entity.__rt$data.errors[field];
						}
					}
				});
			};
		};
	}
})();
