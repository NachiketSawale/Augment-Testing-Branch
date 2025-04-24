/**
 * Created by joshi on 20.01.2015.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc self
	 * @name platformDataValidationService
	 * @function
	 *
	 * @description
	 * The platformDataValidationService provides common validation functions required by different modules
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformDataValidationService', PlatformDataValidationService);

	PlatformDataValidationService.$inject = ['_', '$q', '$http', 'platformObjectHelper', 'platformRuntimeDataService', 'platformModuleStateService', '$injector'];

	function PlatformDataValidationService(_, $q, $http, platformObjectHelper, platformRuntimeDataService, platformModuleStateService, $injector) {
		var self = this;
		var nextAsyncID = 1;

		// validate the  mandatory and uniq field
		this.validateMandatoryUniqEntity = function validateMandatoryUniqEntity(entity, value, model, itemList, validationService, dataService) {
			var res = self.isUniqueAndMandatory(itemList, model, value, entity.Id, {object: model.toLowerCase()});

			return self.finishValidation(res, entity, value, model, validationService, dataService);
		};

		this.validateMandatoryUniqErrorEntity = function validateMandatoryUniqErrorEntity(entity, value, model, itemList, validationService, dataService, error) {
			var res = self.isUniqueAndMandatory(itemList, model, value, entity.Id, {object: error});

			return self.finishValidation(res, entity, value, model, validationService, dataService);
		};

		this.validateMandatory = function validateMandatory(entity, value, model, validationService, dataService) {
			var res = self.isMandatory(value, model, {object: model.toLowerCase()});

			return self.finishValidation(res, entity, value, model, validationService, dataService);
		};

		this.validateUrl = function validateUrl(entity, value, model, validationService, dataService) {

			var reg;
			if(value) {
				if(['http','https','ftp','ftps','file','www.'].some((word) => value.startsWith(word))) {
					if (value.startsWith('www.')) {
						reg = new RegExp('(^|s)((https?://)?[w-]+(.[w-]+)+.?(:d+)?(/S*)?)');
					} else {
						reg = new RegExp('^((http[s]?|ftp[s]?|file):\\/)?\\/?((\\/\\w+)*\\/)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$', 'i');
					}
				}else {
					if (value.startsWith('\\')) {
						reg = new RegExp('((w+)*)([w]+[^#?s]+)(.*)?(#[w]+)?');
					} else {
						if(value.length<50)
						{
							reg = new RegExp('^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
						}
					}
				}
			}

			var valid = {
				valid: _.isNil(value) || _.isEmpty(value) || (reg && reg.test(value)),
				error$tr$: 'platform.errorMessage.url'
			};

			if(dataService) {
				platformRuntimeDataService.applyValidationResult(valid, entity, model);
				return self.finishValidation(valid, entity, value, model, validationService, dataService);
			}else {
				return platformRuntimeDataService.applyValidationResult(valid, entity, model);
			}
		};

		// validate that a field value is unique
		this.validateIsUniqueComposite = function validateIsUniqueComposite(entity, modelsAndValues, itemList, errMsg, validationService, dataService) {
			var res = self.isUniqueComposite(itemList, modelsAndValues, entity, errMsg);

			var first = _.clone(modelsAndValues[0]);

			if (res.Valid) {
				modelsAndValues[0].value = entity[first.model];

				var filter = function (item) {
					return item.Id !== entity.Id && _.reduce(modelsAndValues, function (mav, res) {
						return res && item[mav.model] === mav.value;
					}, true);
				};

				angular.forEach(_.filter(itemList, filter), function (item) {
					_.reduce(modelsAndValues, function (mav, res) {
						platformRuntimeDataService.applyValidationResult(true, item, mav.model);
						return res;
					}, true);
				});
			}

			return self.finishValidation(res, entity, first.value, first.model, validationService, dataService);
		};

		this.validateIsUnique = function validateIsUnique(entity, value, model, itemList, validationService, dataService) {
			var res = self.isValueUnique(itemList, model, value, entity.Id, {object: model.toLowerCase()});

			return self.finishValidation(res, entity, value, model, validationService, dataService);
		};

		this.validateWithCallback = function validateWithCallback(entity, value, model, callbackFn, itemList, transMsg, errorParam, apply, validationService, dataService) {
			var res = callbackFn(entity, value, model, itemList, transMsg, errorParam, apply);

			return self.finishValidation(res, entity, value, model, validationService, dataService);
		};

		this.asyncValidateWithCallback = function asyncValidateWithCallback(entity, value, model, callbackFn, itemList, transMsg, errorParam, apply, validationService, dataService) {
			var asyncMarker = self.registerAsyncCall(entity, value, model, dataService);

			var res = callbackFn(entity, value, itemList, transMsg, errorParam, apply);
			if (!res && (!res.error$tr$ && transMsg)) {
				res = self.createErrorObject(transMsg, errorParam, apply);
			}

			return self.finishAsyncValidation(res, entity, value, model, asyncMarker, validationService, dataService);
		};

		this.asyncValidateIsUnique = function asyncValidateIsUnique(httpRoute, entity, model, value, validationService, dataService, errorParam) {
			var asyncMarker = self.registerAsyncCall(entity, value, model, dataService);

			asyncMarker.myPromise = self.isAsyncUnique(httpRoute, entity, value, model, errorParam).then(function (response) {
				return self.finishAsyncValidation(response, entity, value, model, asyncMarker, validationService, dataService);
			});

			return asyncMarker.myPromise;
		};

		this.isMandatory = function isMandatory(value, model, errorParam) {
			if (self.isEmptyProp(value)) {
				return self.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', errorParam || {fieldName: model.toLowerCase()});
			}
			return self.createSuccessObject();
		};

		this.isUniqueComposite = function isUniqueComposite(itemList, modelsAndValues, entity, errMsg) {
			if (_.some(itemList, function (item) {
				return item.Id !== entity.id && _.reduce(modelsAndValues, function (res, mav) {
					return res && item[mav.model] === mav.value;
				}, true);
			})) {
				return self.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: errMsg});
			} else {
				return {apply: true, valid: true, error: ''};
			}
		};

		this.isUnique = function isUnique(itemList, model, value, id, allowNull) {
			// TODO may be  should check in domainService
			if (!allowNull && !value) {
				return self.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: model.toLowerCase()});
			}
			if (allowNull && !value) {
				return self.createSuccessObject();
			}

			if (_.some(itemList, function (item) {
				return platformObjectHelper.getValue(item, model) === value && item.Id !== id;
			})) {
				return self.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase()});
			} else {
				// update other item
				var oldValue = platformObjectHelper.getValue(_.find(itemList, {Id: id}), model);
				var filter = function (item) {
					return oldValue && oldValue === platformObjectHelper.getValue(item, model);
				};
				angular.forEach(_.filter(itemList, filter), function (item) {
					platformRuntimeDataService.applyValidationResult(true, item, model);
				});
				return {apply: true, valid: true, error: ''};
			}
		};

		this.isUniqueAndMandatory = function isUniqueAndMandatory(itemList, model, value, id, errorParam) {
			var result = self.isMandatory(value, model, errorParam);
			if (!result.valid) {
				return result;
			}

			return self.isValueUnique(itemList, model, value, id, errorParam);
		};

		this.isValueUnique = function isValueUnique(itemList, model, value, id, errorParam) {
			var item = _.find(itemList, function (item) {
				return platformObjectHelper.getValue(item, model) === value && item.Id !== id;
			});

			if (item) {
				return self.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || {object: model.toLowerCase()});
			}

			return self.createSuccessObject();
		};

		this.isAsyncUnique = function isAsyncUnique(httpRoute, entity, value, model, errorParam) {
			var defer = $q.defer();
			var id = entity.Id || 0;
			$http.get(httpRoute + '?id=' + id + '&&' + model + '=' + value).then(function (result) {
				if (!result.data) {
					defer.resolve(self.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || {object: model.toLowerCase()}));
				} else {
					defer.resolve(true);
				}
			});

			return defer.promise;
		};

		this.isSynAndAsyncUnique = function isSynAndAsyncUnique(itemList, httpRoute, entity, value, model, errorParam) {
			var result = self.isUniqueAndMandatory(itemList, model, value, entity.Id, errorParam);
			if (!result.valid) {
				var defer = $q.defer();
				defer.resolve(result);
				return defer.promise;
			} else {
				return self.isAsyncUnique(httpRoute, entity, value, model, errorParam);
			}
		};

		this.isGroupUnique = function isGroupUnique(itemList, groupObject, id, error, errorParam, apply) {
			if (itemList.length <= 1) {
				return true;
			}

			var itemFilter = {};
			for (var prop in groupObject) {
				if (!groupObject.hasOwnProperty(prop)) {
					continue;
				}
				itemFilter[prop] = groupObject[prop];
			}

			var candidates = _.filter(itemList, itemFilter);
			var found = _.filter(candidates, function (cand) {
				return cand.Id !== id;
			});

			if (found && found.length >= 1) {
				return self.createErrorObject(error, errorParam || {}, apply);
			}

			return self.createSuccessObject();
		};

		this.isAsyncGroupUnique = function isAsyncGroupUnique(httpRoute, groupObject, id, error, errorParam, apply) {
			var defer = $q.defer();
			var route = httpRoute + '?id=' + id;

			_.each(Object.getOwnPropertyNames(groupObject), function (prop) {
				route = route + '&&' + prop + '=' + groupObject[prop];
			});

			$http.get(route).then(function (result) {
				if (!result.data) {
					defer.resolve(self.createErrorObject(error, errorParam || {}, apply));
				} else {
					defer.resolve({apply: true, valid: true, error: ''});
				}
			});

			return defer.promise;
		};

		this.validatePeriod = function (startDate, endDate, entity, model, validationService, dataService, relModel) {
			if (startDate && endDate) {
				if (Date.parse(endDate) < Date.parse(startDate)) {
					var res = self.createErrorObject('cloud.common.Error_EndDateTooEarlier', {}, true);

					return self.finishWithError(res, entity, endDate, model, validationService, dataService);
				} else {
					self.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);
				}
			} else {
				self.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);
			}

			return true;
		};

		this.validatePeriodBetweenValidFromAndEndWarranty = function (validFromUTC, endWarrantyUTC, entity, model, validationService, dataService, relModel) {
			if (validFromUTC && endWarrantyUTC) {
				if (endWarrantyUTC > validFromUTC) {
					var res = self.createErrorObjectForSpecified('', {}, true);

					return self.finishWithError(res, entity, endWarrantyUTC, model, validationService, dataService);
				} else {
					self.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);
				}
			} else {
				self.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);
			}

			return true;
		};

		this.validatePeriodSimple = function validatePeriodSimple(startDate, endDate) {
			var res;
			if (startDate && endDate) {
				if (Date.parse(endDate) < Date.parse(startDate)) {
					res = self.createErrorObject('cloud.common.Error_EndDateTooEarlier', {}, true);
				} else {
					res = self.createSuccessObject();
				}
			} else {
				res = self.createSuccessObject();
			}
			return res;
		};

		this.isOverlap = function isOverlap(itemList, model, value, entity) {
			var overlap = function (item) {
				return item.Id !== entity.Id &&
					Math.max(item.PointsTo, entity.to) - Math.min(item.PointsFrom, entity.from) < item.PointsTo + entity.to - item.PointsFrom - entity.from;
				//	(( item.PointsFrom < entity.from && entity.from < item.PointsTo) || (item.PointsFrom < entity.to && entity.to < item.PointsTo) ||
				//	( entity.from < item.PointsFrom && item.PointsFrom < entity.to) || (entity.from < item.PointsTo && item.PointsTo < entity.to));
			};

			if (entity && entity.__rt$data && entity.__rt$data.errors) {
				delete entity.__rt$data.errors.PointsFrom;
				delete entity.__rt$data.errors.PointsTo;
			}

			if (!value && value !== 0) {
				return self.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: model.toLowerCase()}, true);
			} else {
				if (entity.from > entity.to) {
					return self.createErrorObject('cloud.common.greaterValueErrorMessage', {
						object: model.toLowerCase(),
						value: value
					}, true);
				}

				if (_.some(itemList, overlap)) {
					return self.createErrorObject('cloud.common.overlapValueErrorMessage', {object: model.toLowerCase()}, true);
				}
			}

			return {apply: true, valid: true, error: ''};
		};

		this.isAmong = function isAmong(entity, value, model, start, end) {
			if (value < start || value > end) {
				return self.createErrorObject('cloud.common.amongValueErrorMessage', {
					object: model.toLowerCase(),
					rang: start + '-' + end
				}, true);
			}
			return true;
		};

		this.isTotal = function isAmong(itemList, entity, value, model, criterion) {
			var sum = _.sumBy(itemList, function (item) {
				return platformObjectHelper.getValue(item, model);
			});
			sum = sum + value - platformObjectHelper.getValue(entity, model);

			if (Math.abs(sum - criterion) > Math.pow(10, 0 - 6)) {
				return self.createErrorObject('cloud.common.totalValueErrorMessage', {
					object: model.toLowerCase(),
					criterion: criterion
				}, true);
			} else {
				angular.forEach(itemList, function (item) {
					platformRuntimeDataService.applyValidationResult(true, item, model);
				});
			}

			return true;
		};

		this.validateIsNullOrInRange = function validateIsNullOrInRange(entity, value, model, start, end, validationService, dataService) {
			var res = _.isNull(value) || self.isAmong(entity, value, model, start, end);
			return self.finishValidation(res, entity, value, model, validationService, dataService);
		};

		// check if a value is null, undefined or empty string
		this.isEmptyProp = function isEmptyProp(value) {
			return angular.isUndefined(value) || value === null || value === '';
		};

		this.finishWithError = function finishWithError(errObj, entity, value, model, validationService, dataService) {
			// Store Error Object
			self.addToErrorList(errObj, entity, value, model, validationService, dataService);

			return errObj;
		};

		this.createErrorObject = function createErrorObject(transMsg, errorParam) {
			return {
				apply: true,
				valid: false,
				error: '...',
				error$tr$: transMsg,
				error$tr$param$: errorParam
			};
		};

		this.createErrorObjectForSpecified = function createErrorObjectForSpecified(transMsg, errorParam) {
			return {
				apply: true,
				valid: false,
				error: 'The Job Valid From Date is before the Warranty Dates of the Component from Plant',
				error$tr$: transMsg,
				error$tr$param$: errorParam
			};
		};

		this.createSuccessObject = function createSuccessObject() {
			return {apply: true, valid: true, error: ''};
		};

		this.finishAsyncValidation = function finishAsyncValidation(result, entity, value, model, asyncMarker, validationService, dataService) {
			self.finishValidation(result, entity, value, model, validationService, dataService);

			if (asyncMarker && asyncMarker.callID) {
				self.cleanUpAsyncMarker(asyncMarker, dataService);
			}

			return result;
		};

		this.finishValidation = function finishValidation(result, entity, value, model, validationService, dataService) {
			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}

			if (result === true || result && result.valid) {
				self.removeFromErrorList(entity, model, validationService, dataService);

				return result;
			} else {
				return self.finishWithError(result, entity, value, model, validationService, dataService);
			}
		};

		this.registerAsyncCall = function registerAsyncCall(entity, field, value, dataService) {
			var modState = platformModuleStateService.state(dataService.getModule());
			if (!modState.validation) {
				modState.validation = {asyncCalls: []};
			}
			if (!modState.validation.asyncCalls) {
				modState.validation.asyncCalls = [];
			}

			var asyncCall = {
				callID: nextAsyncID,
				entity: entity,
				filed: field,
				value: value,
				dataService: dataService
			};

			++nextAsyncID;

			modState.validation.asyncCalls.push(asyncCall);

			return asyncCall;
		};

		this.registerAsyncCallByModuleName = function registerAsyncCallByModuleName(entity, field, value, moduleName, validationPromise) {
			var modState = platformModuleStateService.state(moduleName);
			if (!modState.validation) {
				modState.validation = {asyncCalls: []};
			}
			if (!modState.validation.asyncCalls) {
				modState.validation.asyncCalls = [];
			}

			var asyncCall = {
				callID: nextAsyncID,
				entity: entity,
				filed: field,
				value: value,
				moduleName: moduleName,
				myPromise: validationPromise
			};

			++nextAsyncID;

			modState.validation.asyncCalls.push(asyncCall);

			return asyncCall;
		};

		this.cleanUpAsyncMarker = function cleanUpAsyncMarker(asyncMarker, dataService) {
			var modState = platformModuleStateService.state(dataService.getModule());

			if (modState.validation && modState.validation.asyncCalls) {
				modState.validation.asyncCalls = _.filter(modState.validation.asyncCalls, function (call) {
					return call.callID !== asyncMarker.callID;
				});
			}
		};

		this.cleanUpAsyncMarkerByModuleName = function cleanUpAsyncMarkerByModuleName(asyncMarker, moduleName) {
			var modState = platformModuleStateService.state(moduleName);

			if (modState.validation && modState.validation.asyncCalls) {
				modState.validation.asyncCalls = _.filter(modState.validation.asyncCalls, function (call) {
					return call.callID !== asyncMarker.callID;
				});
			}
		};

		this.addToErrorList = function addToErrorList(errObj, entity, value, model, validatorService, dataService) {
			var modState = platformModuleStateService.state(dataService.getModule());
			var error = errObj;

			if (!_.isObject(errObj)) {
				error = {
					valid: false,
					error: '...',
					error$tr$: 'cloud.common.Error_HasError'
				};
			}

			error.entity = entity;
			error.value = value;
			error.model = model;
			error.valideSrv = validatorService;
			error.dataSrv = dataService;
			if (_.endsWith(model, '.Translated')) {
				error.model = _.split(model, '.')[0];
			}

			modState.validation.issues.push(error);
		};

		this.removeDeletedEntityFromErrorList = function removeDeletedEntityFromErrorList(entity, dataService) {
			var modState = platformModuleStateService.state(dataService.getModule());

			modState.validation.issues = _.filter(modState.validation.issues, function (err) {
				return err.entity.Id !== entity.Id;
			});
		};

		this.removeDeletedEntitiesFromErrorList = function removeDeletedEntitiesFromErrorList(entities, dataService) {
			var modState = platformModuleStateService.state(dataService.getModule());

			modState.validation.issues = _.filter(modState.validation.issues, function (issue) {
				return !_.find(entities, function (entity) {
					return issue.entity.Id === entity.Id;
				});
			});
		};

		this.removeFromErrorList = function removeFromErrorList(entity, model, validationService, dataService) {
			var modState = platformModuleStateService.state(dataService.getModule());

			var searchKey = model;
			if (_.endsWith(model, '.Translated')) {
				searchKey = _.split(model, '.')[0];
			}

			modState.validation.issues = _.filter(modState.validation.issues, function (err) {
				return err.entity.Id !== entity.Id || err.model !== searchKey;
			});
		};

		this.hasErrors = function hasErrors(dataService) {
			var modState = platformModuleStateService.state(dataService.getModule ? dataService.getModule() : dataService.getService().getModule());

			if (modState.validation && modState.validation.issues) {
				return !_.isEmpty(modState.validation.issues);
			}

		};

		this.ensureNoRelatedError = function ensureNoRelatedError(entity, model, relModels, validationService, dataService) {
			if (entity && entity.__rt$data && entity.__rt$data.errors) {
				_.forEach(relModels, function (relModel) {
					if (entity.__rt$data.errors[relModel]) {
						delete entity.__rt$data.errors[relModel];

						self.removeFromErrorList(entity, relModel, validationService, dataService);
					}
				});

				self.removeFromErrorList(entity, model, validationService, dataService);
			}
		};

		/**
		 * @ngdoc function
		 * @name validationsOngoing
		 * @function
		 * @methodOf platformDataValidationService
		 * @description checks  for pending asyncValidations
		 * @param rootService {object} module´s  rootService.
		 */
		this.validationsOngoing = function validationOngoing(rootService) {
			if (!rootService) {
				throw 'RootService required';
			}
			var modState = platformModuleStateService.state(rootService.getModule ? rootService.getModule() : rootService.getService().getModule());
			return modState.validation && !_.isEmpty(modState.validation.asyncCalls);
		};

		this.isResultValid = function isResultValid(res) {
			return (res === true || res.valid === true);
		};
	}
})(angular);