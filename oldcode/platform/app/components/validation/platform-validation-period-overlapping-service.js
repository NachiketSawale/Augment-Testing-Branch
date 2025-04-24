/**
 * Created by nitsche on 26.07.2018
 */

(function (angular) {
	/* globals moment */
	'use strict';
	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformValidationPeriodOverlappingService
	 * @function
	 *
	 * @description
	 * This service provides validation weather a From- and To-date pair series not overlapping each other.
	 **/
	angular.module(moduleName).service('platformValidationPeriodOverlappingService', PlatformValidationPeriodOverlappingService);

	PlatformValidationPeriodOverlappingService.$inject = ['_', 'platformRuntimeDataService', 'platformDataValidationService'];

	function PlatformValidationPeriodOverlappingService(_, platformRuntimeDataService, platformDataValidationService) {
		var self = this;

		var getNonOverlapingSuccessObject = function () {
			return platformDataValidationService.createSuccessObject();
		};

		var getNonOverlapingErrorObject = function (errorparams) {
			return platformDataValidationService.createErrorObject('cloud.common.Error_PeriodOverlapping', errorparams);
		};

		var finishValidation = platformDataValidationService.finishValidation;

		var getNewEntity = function getNewEntity(entity, value, model) {
			var clonedValueEntity = _.clone(entity);
			clonedValueEntity[model] = value;
			return clonedValueEntity;
		};

		this.validateValue = function (newEntity, entities, fromField, toField) {
			var zeroDate = new moment(-8000000000000); // replace here with lowest possible representable date
			var infinityDate = new moment(8000000000000); // replace here with highest possible representable date
			var enititiesWithoutValue = _.filter(entities, function (entity) {
				return entity.Id !== newEntity.Id;
			});
			var mapToLowerProperty = function (entity) {
				return entity[fromField] !== null ? entity[fromField] : zeroDate;
			};
			var mapToUpperProperty = function (entity) {
				return entity[toField] !== null ? entity[toField] : infinityDate;
			};

			return _.every(enititiesWithoutValue, function (entity) {
				return isNotInPeriodOfFirst(entity, newEntity, mapToLowerProperty, mapToUpperProperty) && isNotInPeriodOfFirst(newEntity, entity, mapToLowerProperty, mapToUpperProperty);
			});
		};
		this.validateFrom = function (entity, value, model, validateService, dataService, toField, enities) {
			var newEntity = getNewEntity(entity, value, model);
			var valid = this.validateValue(newEntity, enities, model, toField);
			var validationStatus = valid ? getNonOverlapingSuccessObject() : getNonOverlapingErrorObject({object: model.toLowerCase()});
			return finishValidation(validationStatus, entity, value, model, validateService, dataService);
		};
		this.validatePeriod = function (entity, value, model, validateService, dataService, toField, entities) {
			let newEntity = getNewEntity(entity, value, model);
			let valid = this.validateValue(newEntity, entities, model, toField);
			return valid ? getNonOverlapingSuccessObject() : getNonOverlapingErrorObject({object: model.toLowerCase()});
		};
		this.validateTo = function (entity, value, model, validateService, dataService, fromField, enities) {
			var newEntity = getNewEntity(entity, value, model);
			var valid = this.validateValue(newEntity, enities, fromField, model);
			var validationStatus = valid ? getNonOverlapingSuccessObject() : getNonOverlapingErrorObject({object: model.toLowerCase()});
			return finishValidation(validationStatus, entity, value, model, validateService, dataService);
		};

		this.validate = function (entity, value, model, validateService, dataService, entities, fromField) {
			var newEntity = getNewEntity(entity, value, model);
			var valid = this.validateValue(newEntity, entities, fromField, model);
			var validationStatus = valid ? getNonOverlapingSuccessObject() : getNonOverlapingErrorObject({object: model.toLowerCase()});
			return finishValidation(validationStatus, entity, value, model, validateService, dataService);
		};

		this.validateEntities = function (entities, fromField, toField, dataService, skipValidationId) {
			var self = this;
			var validationResults = [];
			_.forEach(entities, function (entity) {
				if (!skipValidationId || (!!entity.Id && entity.Id !== skipValidationId)) {
					// var hasToFieldError = platformRuntimeDataService.hasErrorWithId(entity,toField,periodeValidatioErrorId);
					// var hasFromFieldError = platformRuntimeDataService.hasErrorWithId(entity,fromField,periodeValidatioErrorId);
					var hasToFieldError = self.hasError(entity, toField);
					var hasFromFieldError = self.hasError(entity, fromField);
					if (hasFromFieldError || hasToFieldError) {
						var result = self.validateValue(entity, entities, fromField, toField);
						validationResults.push({entity: entity, status: result});
					}
				}
			});
			return validationResults;
		};

		this.hasError = function (entity, model) {
			var hasFieldError = platformRuntimeDataService.hasError(entity, model);
			return hasFieldError !== '' ? !!hasFieldError : true;
		};

		this.validateValueAndEntities = function (value, valueEntity, entities, model, dataService, fromField, toField) {
			var clonedValueEntity = _.clone(valueEntity);
			clonedValueEntity[model] = value;
			var newEntities = _.filter(entities, function (entity) {
				return entity.Id !== valueEntity.Id;
			});
			newEntities.push(clonedValueEntity);
			this.validateEntities(newEntities, fromField, toField, dataService, valueEntity.Id);

			return this.validateValue(clonedValueEntity, entities, fromField, toField)({object: model.toLowerCase()});
		};
		this.validatePeriodAndOverlapping2 = function (validationService,dataService) {
			return function (entity,valueFrom,modelFrom,valueTo,modelTo) {
				let res = platformDataValidationService.validatePeriodSimple(valueFrom,valueTo);
				if(platformDataValidationService.isResultValid(res)){
					return this.validatePeriod(
						entity, value, model, validationService, dataService, 'ValidTo',
						_.filter(entities,e => e.WorkOperationTypeFk === entity.WorkOperationTypeFk && e.PricingGroupFk === entity.PricingGroupFk)
					);
				}
				else{
					return res;
				}
			};
		};
		this.validatePeriodAndOverlappingFrom = function validatePeriodOverlappingFrom(entity, value, model, validateService, dataService, toModel) {
			var res;
			var periodValid = this.validatePeriod(value, entity[toModel], entity, model, validateService, dataService, toModel); // startDate, endDate, entity, model, validationService, dataService, relModel
			if (_.isObject(periodValid) && periodValid.valid || _.isBoolean(periodValid) && periodValid) {
				var notOverlapping = this.validateValueAndEntities(value, entity, dataService.getList(), model, dataService, model, toModel);
				if (!notOverlapping) {
					notOverlapping = self.createErrorObject('cloud.common.Error_PeriodOverlapping', {object: model.toLowerCase()});
				}
				res = self.finishValidation(notOverlapping, entity, value, model, validateService, dataService);
			} else {
				res = periodValid;
			}
			return res;
		};

		this.validatePeriodAndOverlappingTo = function validatePeriodOverlappingTo(entity, value, model, validateService, dataService, fromModel) {
			var res;
			var periodValid = this.validatePeriod(entity[fromModel], value, entity, model, validateService, dataService, fromModel);
			if (_.isObject(periodValid) && periodValid.valid || _.isBoolean(periodValid) && periodValid) {
				var notOverlapping = this.validateValueAndEntities(value, entity, dataService.getList(), model, dataService, fromModel, model);
				if (!notOverlapping) {
					notOverlapping = self.createErrorObject('cloud.common.Error_PeriodOverlapping', {object: model.toLowerCase()});
				}
				res = self.finishValidation(notOverlapping, entity, value, model, validateService, dataService);
			} else {
				res = periodValid;
			}
			return res;
		};

		var isNotInPeriodOfFirst = function isNotInPeriodOfFirst(firstEntity, secondEntity, mapToLowerBound, mapToUpperBound) {
			var lowerBoundIsNotInPeriodOfFirst = !(mapToLowerBound(firstEntity) <= mapToLowerBound(secondEntity) && mapToLowerBound(secondEntity) <= mapToUpperBound(firstEntity));
			var upperBoundIsNotInPeriodOfFirst = !(mapToLowerBound(firstEntity) <= mapToUpperBound(secondEntity) && mapToUpperBound(secondEntity) <= mapToUpperBound(firstEntity));
			return lowerBoundIsNotInPeriodOfFirst && upperBoundIsNotInPeriodOfFirst;
		};
	}
})(angular);
