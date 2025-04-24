/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceInitialValidationDataProcessorFactory
	 * @function
	 * @requires _, platformSchemaService, platformDataValidationService
	 * @description
	 * platformDataServiceInitialValidationDataProcessorFactory adds data processor(s behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformValidationServiceFactory', PlatformValidationServiceFactory);

	PlatformValidationServiceFactory.$inject = ['_', '$injector', 'platformSchemaService', 'platformDataValidationService', 'platformValidationPeriodOverlappingService'];

	function PlatformValidationServiceFactory(_, $injector, platformSchemaService, platformDataValidationService, platformValidationPeriodOverlappingService) {
		var self = this;

		this.candidateIsInArray = function candidateIsInArray(candidate, array) {
			return !!_.find(array || [], function (entry) {
				return entry === candidate;
			});
		};

		this.isAdministrative = function isAdministrative(model) {
			return self.candidateIsInArray(model.toLowerCase(), ['id', 'insertedat', 'insertedby', 'updatedat', 'updatedby', 'version']);
		};

		this.isNotUnitFk = function isNotUnitFk(model) {
			return !self.candidateIsInArray(model.toLowerCase(), ['uomfk', 'unitfk', 'basuomfk', 'basunitfk']);
		};

		this.isMandatory = function isMandatory(property, specification) {
			return self.candidateIsInArray(property, specification.mandatory);
		};

		this.isUnique = function isUnique(property, specification) {
			return self.candidateIsInArray(property, specification.uniques);
		};

		this.isPeriod = function isPeriod(property, specification) {
			return !!_.find(specification.periods || [], function (period) {
				return period.from === property || period.to === property;
			});
		};

		this.getPeriod = function getPeriod(property, specification) {
			return _.find(specification.periods, function (period) {
				return period.from === property || period.to === property;
			});
		};

		this.isRange = function isRange(property, specification) {
			return !!_.find(specification.ranges || [], function (range) {
				return range.name === property;
			});
		};

		this.getRange = function getRange(property, specification) {
			return _.find(specification.ranges || [], function (range) {
				return range.name === property;
			});
		};

		this.isMandatoryOrUnique = function isMandatoryOrUnique(property, specification) {
			return self.isMandatory(property, specification) || self.isUnique(property, specification);
		};

		this.isMandatoryAndUnique = function isMandatoryAndUnique(property, specification) {
			return self.isMandatory(property, specification) && self.isUnique(property, specification);
		};

		this.returnResultOrApplyExtraFunc = function returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model) {
			if ((res === true || res.valid === true) && !!extraFuncName && validateService[extraFuncName]) {
				return validateService[extraFuncName](entity, value, model);
			}
			return res;
		};

		this.getFuncName = function getFuncName(propName) {
			return 'validate' + propName;
		};

		this.getExtraFuncName = function getFuncName(propName) {
			return 'validateAdditional' + propName;
		};

		this.getAsyncFuncName = function getAsyncFuncName(propName) {
			return 'asyncValidate' + propName;
		};

		this.getExtraAsyncFuncName = function getExtraAsyncFuncName(propName) {
			return 'asyncValidateAdditional' + propName;
		};

		/**
		 * @ngdoc function
		 * @name addValidationServiceInterface
		 * @function add all needed validation methods to the interface of an validation service
		 * In case additional validation is needed for one property, please add a function with the naming convention
		 * validateAdditional[FieldName] taking the standard parameter entity, value and model
		 * @methodOf platform.PlatformDataServiceDataProcessorExtension
		 * @description adds data processor(s) to data services
		 * @param schemeId {object} contains information on dto scheme
		 * @param specification {object} contains three arrays
		 *  mandatory (property names as string): All properties to be validated as mandatory fields,
		 *  uniques  (property names as string): All properties to be validated as unique fields,
		 *  periods as array of objects with from and to property names as strings: All periods (from <-> to) to be validated
		 *  periods array object can optionally have property checkOverlapping set to be true or false:
		 *    If checkOverlapping is true, additionally all periods will be validated weather they are overlapping each other.
		 *    From or to fields that are null, will be interpreted as minus infinity or respectively plus infinity
		 *    Important!!: checkOverlapping will only work on leaf or node container not on root container.
		 * @param validateService {object} service to be created
		 * @param dataService {object} data service which belongs to the validation service
		 */
		this.addValidationServiceInterface = function addValidationServiceInterface(schemeId, specification, validateService, dataService) {
			var scheme = platformSchemaService.getSchemaFromCache(schemeId);

			var objProperties = scheme.properties;
			self.addValidationServiceInterfaceFromProperties(objProperties, specification, validateService, dataService, schemeId);
		};

		/**
		 * @ngdoc function
		 * @name addValidationServiceInterface
		 * @function add all needed validation methods to the interface of an validation service
		 * In case additional validation is needed for one property, please add a function with the naming convention
		 * validateAdditional[FieldName] taking the standard parameter entity, value and model
		 * @methodOf platform.PlatformDataServiceDataProcessorExtension
		 * @description adds data processor(s) to data services
		 * @param objProperties [{object}] contains list of property description objects which may provide
		 *  a field named domoain if lookup specific new creation validation is needed
		 * @param specification {object} contains three arrays
		 *  mandatory (property names as string): All properties to be validated as mandatory fields,
		 *  uniques  (property names as string): All properties to be validated as unique fields,
		 *  periods as array of objects with from and to property names as strings: All periods (from <-> to) to be validated
		 *  periods array object can optionally have property checkOverlapping set to be true or false:
		 *    If checkOverlapping is true, additionally all periods will be validated weather they are overlapping each other.
		 *    From or to fields that are null, will be interpreted as minus infinity or respectively plus infinity
		 *    Important!!: checkOverlapping will only work on leaf or node container not on root container.
		 * @param validateService {object} service to be created
		 * @param dataService {object} data service which belongs to the validation service
		 * @param schemeId {object} contains information on dto scheme, only needed when overlapping is to be checked.
		 */
		this.addValidationServiceInterfaceFromProperties = function addValidationServiceInterfaceFromProperties(objProperties, specification, validateService, dataService, schemeId) {
			for (var propName in objProperties) {
				if (objProperties.hasOwnProperty(propName)) {
					var funcName = this.getFuncName(propName);
					var extraFuncName = this.getExtraFuncName(propName);
					if (self.isMandatoryOrUnique(propName, specification)) {

						if (self.isMandatoryAndUnique(propName, specification)) {
							var muProp = objProperties[propName];
							if (muProp !== null && muProp.domain === 'lookup') {
								self.addMandatoryUniqueLookupPropertyValidationToService(validateService, funcName, extraFuncName, dataService);
							} else if (muProp !== null && muProp.domain === 'translation') {
								self.addMandatoryUniqueTranslationPropertyValidationToService(validateService, funcName, extraFuncName, dataService, propName);
							} else {
								self.addMandatoryUniquePropertyValidationToService(validateService, funcName, extraFuncName, dataService);
							}
						} else if (self.isMandatory(propName, specification)) {
							var mProp = objProperties[propName];
							if (mProp !== null && mProp.domain === 'lookup') {
								self.addMandatoryLookupPropertyValidationToService(validateService, funcName, extraFuncName, dataService);
							} else if (mProp !== null && mProp.domain === 'translation') {
								self.addMandatoryTranslationPropertyValidationToService(validateService, funcName, extraFuncName, dataService, propName);
							} else {
								self.addMandatoryPropertyValidationToService(validateService, funcName, extraFuncName, dataService);
							}
						} else if (self.isUnique(propName, specification)) {
							self.addUniquePropertyValidationToService(validateService, funcName, extraFuncName, dataService);
						}
					}

					if (self.isPeriod(propName, specification)) {
						var period = self.getPeriod(propName, specification);
						if (period.checkOverlapping) {
							self.addPeriodAndOverlappingValidationToService(validateService, funcName, extraFuncName, dataService, propName, period, schemeId);
						} else {
							self.addPeriodValidationToService(validateService, funcName, extraFuncName, dataService, propName, period);
						}

					}

					if (self.isRange(propName, specification)) {
						var range = self.getRange(propName, specification);
						self.addRangeValidationToService(validateService, funcName, extraFuncName, dataService, propName, range);
					}
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name determineMandatoryProperties
		 * @function Determine all mandatory properties from the scheme of an dto
		 * @methodOf platform.PlatformDataServiceDataProcessorExtension
		 * @description Determine all mandatory properties from the scheme of an dto
		 * @param schemeId {object} contains information on dto scheme
		 */
		this.determineMandatoryProperties = function determineMandatoryProperties(schemeId) {
			var mandatoryProperties = [];
			var scheme = platformSchemaService.getSchemaFromCache(schemeId);

			var objProperties = scheme.properties;
			for (var propName in objProperties) {
				if (objProperties.hasOwnProperty(propName) && objProperties[propName].mandatory === true && !self.isAdministrative(propName)) {
					mandatoryProperties.push(propName);
				}
			}

			return mandatoryProperties;
		};

		this.addMandatoryUniqueLookupPropertyValidationToService = function addMandatoryUniqueLookupPropertyValidationToService(validateService, funcName, extraFuncName, dataService) {
			validateService[funcName] = function (entity, value, model) {
				var res = self.validateMandatoryUniqueEntityLookupProperty(entity, value, model, validateService, dataService);

				return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
			};
		};

		this.addMandatoryUniqueTranslationPropertyValidationToService = function addMandatoryUniqueTranslationPropertyValidationToService(validateService, funcName, extraFuncName, dataService, propName) {
			validateService[funcName] = function (entity, value, model) {
				if(propName && model === propName + '.Translated' ) {
					var res = self.validateMandatoryUniqueEntityTranslationProperty(entity, value, propName, validateService, dataService);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, propName);
				}
				else {
					var res = self.validateMandatoryUniqueEntityTranslationProperty(entity, value, model, validateService, dataService);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
				}
			};
		};

		this.addMandatoryUniquePropertyValidationToService = function addMandatoryUniquePropertyValidationToService(validateService, funcName, extraFuncName, dataService) {
			validateService[funcName] = function (entity, value, model) {
				var res = self.validateMandatoryUniqueEntityProperty(entity, value, model, validateService, dataService);

				return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
			};
		};

		this.addMandatoryLookupPropertyValidationToService = function addMandatoryLookupPropertyValidationToService(validateService, funcName, extraFuncName, dataService) {
			validateService[funcName] = function (entity, value, model) {
				var res = self.validateMandatoryEntityLookupProperty(entity, value, model, validateService, dataService);

				return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
			};
		};

		this.addMandatoryTranslationPropertyValidationToService = function addMandatoryTranslationPropertyValidationToService(validateService, funcName, extraFuncName, dataService, propName) {
			validateService[funcName] = function (entity, value, model) {
				if(propName && model === propName + '.Translated' ) {
					var res = self.validateMandatoryEntityTranslationProperty(entity, value, propName, validateService, dataService);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, propName);
				} else {
					var res = self.validateMandatoryEntityTranslationProperty(entity, value, model, validateService, dataService);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
				}
			};
		};

		this.addMandatoryPropertyValidationToService = function addMandatoryPropertyValidationToService(validateService, funcName, extraFuncName, dataService) {
			validateService[funcName] = function (entity, value, model) {
				var res = self.validateMandatoryEntityProperty(entity, value, model, validateService, dataService);

				return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
			};
		};

		this.addUniquePropertyValidationToService = function addUniquePropertyValidationToService(validateService, funcName, extraFuncName, dataService) {
			validateService[funcName] = function (entity, value, model) {
				var res = self.validateUniqueEntityProperty(entity, value, model, validateService, dataService);

				return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
			};
		};

		this.addPeriodAndOverlappingValidationToService = function addPeriodAndOverlappingValidationToService(validateService, funcName, extraFuncName, dataService, property, period, schemeId) {
			var validateFromPeriodAndOverlaping = function (entity, value, model, entities) {
				var res = self.validateFromPeriodSimpleEntityProperty(true, entity, value, period.from, validateService, dataService, period.to);
				return self.validateFromOverlappingEntityProperty(res, entity, value, period.from, validateService, dataService, period.to, entities);
			};
			var validateToPeriodAndOverlaping = function (entity, value, model, entities) {
				var res = self.validateToPeriodSimpleEntityProperty(true, entity, value, period.to, validateService, dataService, period.from);
				return self.validateToOverlappingEntityProperty(res, entity, value, period.to, validateService, dataService, period.from, entities);
			};

			var specification = {
				customValidations: [
					{
						model: period.from,
						validation: validateFromPeriodAndOverlaping,
						revalidateGrid: [
							{
								model: period.from
							},
							{
								model: period.to
							}
						]
					},
					{
						model: period.to,
						validation: validateToPeriodAndOverlaping,
						revalidateGrid: [
							{
								model: period.from
							},
							{
								model: period.to
							}
						]
					}
				],
				globals: {
					revalidateCellOnlyIfHasError: true,
					revalidateOnlySameEntity: false,
					revalidateGrid: false
				}
			};
			$injector.get('platformValidationRevalidationEntitiesFactory').addValidationServiceInterface(schemeId, specification, validateService, dataService);
		};

		this.addPeriodValidationToService = function addPeriodValidationToService(validateService, funcName, extraFuncName, dataService, property, period) {
			if (property === period.from) {
				validateService[funcName] = function (entity, value, model) {
					var res = self.validateFromPeriodEntityProperty(entity, value, model, validateService, dataService, period.to);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
				};
			} else if (property === period.to) {
				validateService[funcName] = function (entity, value, model) {
					var res = self.validateToPeriodEntityProperty(entity, value, model, validateService, dataService, period.from);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
				};
			}
		};

		this.addRangeValidationToService = function addRangeValidationToService(validateService, funcName, extraFuncName, dataService, property, range) {
			if (property === range.name) {
				validateService[funcName] = function (entity, value, model) {
					var res = self.validateRangeEntityProperty(entity, value, model, validateService, dataService, range.from, range.to);

					return self.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
				};
			}
		};

		this.validateMandatoryUniqueEntityLookupProperty = function validateMandatoryUniqueEntityLookupProperty(entity, value, model, validateService, dataService) {
			if (value === 0 && entity.Version === 0) {
				value = null;
			}
			var entities = dataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, entities, validateService, dataService);
		};

		function getValueFromTranslation(value) {
			var val = null;
			if (value) {
				if (_.isString(value.Description)) {
					val = value.Description;
				} else if (_.isNull(value.Description)) {
					val = null;
				} else if (_.isString(value)) {
					val = value;
				}
			}

			return val;
		}

		this.validateMandatoryUniqueEntityTranslationProperty = function validateMandatoryUniqueEntityTranslationProperty(entity, value, model, validateService, dataService) {
			var entities = dataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, getValueFromTranslation(value), model, entities, validateService, dataService);
		};

		this.validateMandatoryUniqueEntityProperty = function validateMandatoryUniqueEntityProperty(entity, value, model, validateService, dataService) {
			var entities = dataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, entities, validateService, dataService);
		};

		this.validateMandatoryEntityLookupProperty = function validateMandatoryEntityLookupProperty(entity, value, model, validateService, dataService) {
			if (value === 0 && entity.Version === 0 && self.isNotUnitFk(model)) {
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, validateService, dataService);
		};

		this.validateMandatoryEntityTranslationProperty = function validateMandatoryEntityTranslationProperty(entity, value, model, validateService, dataService) {
			return platformDataValidationService.validateMandatory(entity, getValueFromTranslation(value), model, validateService, dataService);
		};

		this.validateMandatoryEntityProperty = function validateMandatoryEntityProperty(entity, value, model, validateService, dataService) {
			return platformDataValidationService.validateMandatory(entity, value, model, validateService, dataService);
		};

		this.validateUniqueEntityProperty = function validateUniqueEntityProperty(entity, value, model, validateService, dataService) {
			var entities = dataService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, entities, validateService, dataService);
		};

		this.validateFromOverlappingEntityProperty = function validateFromOverlappingEntityProperty(res, entity, value, model, validateService, dataService, toModel, enities) {
			if (platformDataValidationService.isResultValid(res)) {
				return platformValidationPeriodOverlappingService.validateFrom(entity, value, model, validateService, dataService, toModel, enities);
			}
			return res;
		};

		this.validateToOverlappingEntityProperty = function validateToOverlappingEntityProperty(res, entity, value, model, validateService, dataService, fromModel, entities) {
			if (platformDataValidationService.isResultValid(res)) {
				return platformValidationPeriodOverlappingService.validateTo(entity, value, model, validateService, dataService, fromModel, entities);
			}
			return res;
		};

		this.validateFromPeriodEntityProperty = function validateFromPeriodEntityProperty(entity, value, model, validateService, dataService, toModel) {
			return platformDataValidationService.validatePeriod(value, entity[toModel], entity, model, validateService, dataService, toModel);
		};

		this.validateToPeriodEntityProperty = function validateToPeriodEntityProperty(entity, value, model, validateService, dataService, fromModel) {
			return platformDataValidationService.validatePeriod(entity[fromModel], value, entity, model, validateService, dataService, fromModel);
		};

		this.validateFromPeriodSimpleEntityProperty = function validateFromPeriodSimpleEntityProperty(res, entity, value, model, validateService, dataService, toModel) {
			if (platformDataValidationService.isResultValid(res)) {
				return platformDataValidationService.validatePeriodSimple(value, entity[toModel], entity, model, validateService, dataService, toModel);
			}
			return res;
		};

		this.validateToPeriodSimpleEntityProperty = function validateToPeriodSimpleEntityProperty(res, entity, value, model, validateService, dataService, fromModel) {
			if (platformDataValidationService.isResultValid(res)) {
				return platformDataValidationService.validatePeriodSimple(entity[fromModel], value, entity, model, validateService, dataService, fromModel);
			}
			return res;
		};

		this.validateRangeEntityProperty = function validateRangeEntityProperty(entity, value, model, validateService, dataService, fromValue, toValue) {
			return platformDataValidationService.isAmong(entity, value, model, fromValue, toValue);
		};
	}
})(angular);