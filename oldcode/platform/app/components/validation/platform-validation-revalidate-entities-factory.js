/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function platformValidationRevalidationEntitiesFactory(angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformValidationRevalidationEntitiesFactory
	 * @function
	 * @requires _,  platformSchemaService, platformDataValidationService, platformValidationServiceFactory, platformRuntimeDataService
	 * @description
	 * platformValidationRevalidationEntitiesFactory adds revalidaton functionalty to a container's validation service.
	 */
	angular.module('platform').service('platformValidationRevalidationEntitiesFactory', PlatformValidationRevalidationEntitiesFactory);

	PlatformValidationRevalidationEntitiesFactory.$inject = ['_', '$q', 'platformSchemaService', 'platformDataValidationService', 'platformValidationServiceFactory', 'platformRuntimeDataService'];

	function PlatformValidationRevalidationEntitiesFactory(_, $q, platformSchemaService, platformDataValidationService, platformValidationServiceFactory, platformRuntimeDataService) {
		let selfRevalService = this;
		let getProperty = function getProperty(object, property, fallback) {
			return Object.prototype.hasOwnProperty.call(object, property) ? object[property] : fallback;
		};
		let returnTruePromise = function truePromise() {
			return $q.resolve(true);
		};

		class ErrorTrackerCache {
			constructor() {
				this.errorableEntities = [];
			}

			addEntity(entity) {
				let errEntity = {Id: entity.Id};
				this.errorableEntities.push(errEntity);
				return errEntity;
			}

			fieldAlreadyHasBeenValidatedAsError(entity, model) {
				let errEntity = _.find(this.errorableEntities, errEntity => errEntity.Id === entity.Id);
				if (errEntity) {
					if (Object.prototype.hasOwnProperty.call(errEntity, model)) {
						return errEntity[model];
					}
				}
				return false;
			}

			getErrorEntity(entity) {
				let errEntity = _.find(this.errorableEntities, errEntity => errEntity.Id === entity.Id);
				if (!errEntity) {
					errEntity = this.addEntity(entity);
				}
				return errEntity;
			}

			addFieldError(entity, model) {
				this.getErrorEntity(entity)[model] = true;
			}

			removeFieldError(entity, model) {
				this.getErrorEntity(entity)[model] = false;
			}

			applyResult(res, entity, model) {
				if (_.isBoolean(res)) {
					this.getErrorEntity(entity)[model] = !res;
				} else if (_.isObject(res)) {
					if (Object.prototype.hasOwnProperty.call(res, 'valid')) {
						this.getErrorEntity(entity)[model] = !res.valid;
					}
				}
			}
		}

		class RevalidateSpecificationHelper {
			constructor(specification) {
				this.specification = specification;
				this.customValidations = getProperty(specification, 'customValidations', []);
				this.revalidationGlobals = getProperty(specification, 'globals', {});
				this.globalRevalidateGridFallback = false;
				this.globalRevalidateOnlySameEntityFallback = false;
				this.globalRevalidateCellOnlyIfHasErrorFallBack = false;
				this.globalRevalidateIfHasError = getProperty(this.revalidationGlobals, 'revalidateCellOnlyIfHasError', this.globalRevalidateCellOnlyIfHasErrorFallBack);
			}

			isRevalidateOnlySameEntity(lastChangedEntity, lastChangedModel) {
				let costumValidation = this.getCustomValidation(lastChangedModel, this.customValidations);
				if (costumValidation) {
					return getProperty(costumValidation, 'revalidateOnlySameEntity', getProperty(this.revalidationGlobals, 'revalidateOnlySameEntity', this.globalRevalidateOnlySameEntityFallback));
				} else {
					return getProperty(this.revalidationGlobals, 'revalidateOnlySameEntity', this.globalRevalidateOnlySameEntityFallback);
				}
			}

			isRevalidationEnabled(model, lastChangedRevalidationFields) {
				if (lastChangedRevalidationFields) {
					if (_.isBoolean(lastChangedRevalidationFields)) {
						return lastChangedRevalidationFields;
					} else {
						return !!this.getRevalidationField(model, lastChangedRevalidationFields);
					}
				} else {
					return getProperty(this.revalidationGlobals, 'revalidateGrid', this.globalRevalidateGridFallback);
				}
			}

			isRevalidateOnlyIfHasError(model, lastChangedSRevalidationFields) {
				if (!lastChangedSRevalidationFields) {
					if (!_.isBoolean(lastChangedSRevalidationFields)) {
						let revalidationField = this.getRevalidationField(model, lastChangedSRevalidationFields);
						return !!revalidationField && getProperty(revalidationField, 'onlyIfHasError', this.globalRevalidateIfHasError);
					} else {
						return this.globalRevalidateIfHasError;
					}
				} else {
					return this.globalRevalidateIfHasError;
				}
			}

			getRevalidationField(model, lastChangedSRevalidationFields) {
				return _.find(lastChangedSRevalidationFields, rV => rV.model === model);
			}

			getCustomValidation(propName) {
				return _.find(this.customValidations || [], cV => cV.model === propName);
			}

			getCustomValidations(filter) {
				return _.filter(this.customValidations || [], filter);
			}

			getCustomValidationFn(model) {
				return getProperty(this.getCustomValidation(model), 'validation', undefined);
			}

			getCustomAsyncValidationFn(model) {
				return getProperty(this.getCustomValidation(model), 'asyncValidation', undefined);
			}

			isCustomValidation(propName) {
				return this.getCustomValidation(propName);
			}

			hasGridRevalidation(propName) {
				return Object.prototype.hasOwnProperty.call(this.getCustomValidation(propName), 'revalidateGrid');
			}
		}

		class Revalidation {
			constructor(specificationInfo, dataService, validateService, objProperties) {
				this.errorTrackerCache = new ErrorTrackerCache();
				this.dataService = dataService;
				this.validateService = validateService;
				this.objProperties = objProperties;
				this.specificationInfo = specificationInfo;

				this.preFieldValidations = this.catchPreRevalidationFieldValidations();
				this.fieldValidations = this.buildUpFieldValidations();
			}
			catchPreRevalidationFieldValidations(){
				let self = this;
				let res = {};
				_.forEach(this.specificationInfo.getCustomValidations(() => true), function (customValidation){
					res[customValidation.model] = self.validateService[platformValidationServiceFactory.getFuncName(customValidation.model)];
				});
				return res;
			}
			buildUpFieldValidations(){
				let self = this;
				let res = {};
				_.forEach(this.specificationInfo.getCustomValidations(() => true), function (customValidation){
					res[customValidation.model] = self.buildFieldValidationMethod(customValidation.model);
				});
				return res;
			}

			resetErrorTrackerCache() {
				this.errorTrackerCache = new ErrorTrackerCache();
			}

			buildFieldValidationMethod(model){
				let validationChain = [
					this.preFieldValidations[model],
					this.specificationInfo.getCustomValidationFn(model),
					this.getExtraFunc(this)
				];
				return selfRevalService.validateChain(validationChain);
			}
			getExtraFunc(self){
				return function (entity, value, model, entities){
					let extraFunc = self.validateService[platformValidationServiceFactory.getExtraFuncName(model)];
					return _.isFunction(extraFunc) ? extraFunc(entity, value, model, entities) : true;
				};
			}
			getCustomGridValidationMethod(orgEntity) {
				let self = this;
				return function customGridValidationMethod(entity, value, model, entities) {
					let res = self.fieldValidations[model](entity, value, model, entities);
					platformDataValidationService.finishValidation(res, orgEntity, value, model, self.validateService, self.dataService);
					return res;
				};
			}

			getCustomGridAsyncValidationMethod(extraAsyncFuncName, customValidateMethod, orgEntity) {
				let self = this;
				return function customGridValidationMethod(entity, value, model, entities) {
					let cVMPromise = _.isFunction(customValidateMethod) ? customValidateMethod(entity, value, model, entities) : returnTruePromise();
					return cVMPromise.then(function postCustomValidate(res1) {
						return self.asyncReturnResultOrApplyGridExtraFunc(res1, extraAsyncFuncName, entity, value, model, entities).then(function postCustomValidation(res2) {
							platformDataValidationService.finishValidation(res2, orgEntity, value, model, self.validateService, self.dataService);
							return $q.resolve(res2);
						});
					});
				};
			}

			returnResultOrApplyGridExtraFunc(res, extraFuncName, entity, value, model, entities) {
				if ((res === true || res.valid === true) && !!extraFuncName && this.validateService[extraFuncName]) {
					return this.validateService[extraFuncName](entity, value, model, entities);
				}
				return res;
			}

			asyncReturnResultOrApplyGridExtraFunc(res, extraFuncName, entity, value, model, entities) {
				if ((res === true || res.valid === true) && !!extraFuncName && this.validateService[extraFuncName]) {
					return this.validateService[extraFuncName](entity, value, model, entities);
				}
				return $q.resolve(res);
			}

			needsToBeRevalidated(entity, model, lastChangedSRevalidationFields) {
				return !this.specificationInfo.isRevalidateOnlyIfHasError(model, lastChangedSRevalidationFields) || platformRuntimeDataService.hasError(entity, model);
			}

			isNotLastChangedCell(entity, model, lastChangedEntity, lastChangedModel) {
				return model !== lastChangedModel || entity.Id !== lastChangedEntity.Id;
			}

			isNotLastChangedEntity(entity, lastChangedEntity) {
				return entity.Id !== lastChangedEntity.Id;
			}

			revalidateField(entity, model, entities, validateFieldCallBack, orgEntity) {
				let customGridValidation = this.getCustomGridValidationMethod(orgEntity);
				let res = customGridValidation(entity, entity[model], model, entities);
				this.applyValidationResult(res, orgEntity, model);
			}

			asyncRevalidateField(entity, model, entities, validateFieldCallBack, orgEntity) {
				let self = this;
				let asyncExtraFuncName = platformValidationServiceFactory.getExtraAsyncFuncName(model);
				let customGridValidation = this.getCustomGridAsyncValidationMethod(asyncExtraFuncName, validateFieldCallBack, orgEntity);
				return customGridValidation(entity, entity[model], model, entities).then(function postCustomGridValidation(res) {
					self.applyValidationResult(res, orgEntity, model);
				});
			}

			applyValidationResult(res, orgEntity, model) {
				platformRuntimeDataService.applyValidationResult(res, orgEntity, model);
				this.errorTrackerCache.applyResult(res, orgEntity, model);
			}

			getUpdatedList(lastChangedEntity, lastChangedValue, lastChangedModel) {
				let entities = _.filter(this.dataService.getList(), entity => lastChangedEntity.Id !== entity.Id);
				entities.push(this.getUpdatedEntity(lastChangedEntity, lastChangedValue, lastChangedModel));
				return entities;
			}

			getUpdatedEntity(lastChangedEntity, lastChangedValue, lastChangedModel) {
				let clonedLastChangedEntity = _.clone(lastChangedEntity);
				clonedLastChangedEntity[lastChangedModel] = lastChangedValue;
				return clonedLastChangedEntity;
			}

			revalidateEntity(entity, lastChangedModel, lastChangedEntity, entities) {
				let customValidation = this.specificationInfo.getCustomValidation(lastChangedModel);
				let lastChangedsRevalidationFields = customValidation.revalidateGrid;
				let hasBeenChanged = false;
				for (let model in this.objProperties) {
					if (Object.prototype.hasOwnProperty.call(this.objProperties, model)) {
						if (
							!this.errorTrackerCache.fieldAlreadyHasBeenValidatedAsError(entity, model) &&
							this.isNotLastChangedCell(entity, model, lastChangedEntity, lastChangedModel) &&
							this.specificationInfo.isRevalidationEnabled(model, lastChangedsRevalidationFields) &&
							this.needsToBeRevalidated(entity, model, lastChangedsRevalidationFields)) {
							let customValidationFn = this.specificationInfo.getCustomValidationFn(model);
							if (customValidation) {
								let orgEntity = this.isNotLastChangedEntity(entity, lastChangedEntity) ? entity : lastChangedEntity;
								this.revalidateField(entity, model, entities, customValidationFn, orgEntity);
								hasBeenChanged = true;
							}
						}
					}
				}
				return hasBeenChanged;
			}

			asyncRevalidateEntity(entity, lastChangedModel, lastChangedEntity, entities) {
				let customValidation = this.specificationInfo.getCustomValidation(lastChangedModel);
				let lastChangedsRevalidationFields = customValidation.revalidateGrid;
				let hasBeenChanged = false;
				let returnPromises = [];
				for (let model in this.objProperties) {
					if (Object.prototype.hasOwnProperty.call(this.objProperties, model)) {
						if (
							!this.errorTrackerCache.fieldAlreadyHasBeenValidatedAsError(entity, model) &&
							this.isNotLastChangedCell(entity, model, lastChangedEntity, lastChangedModel) &&
							this.specificationInfo.isRevalidationEnabled(model, lastChangedsRevalidationFields) &&
							this.needsToBeRevalidated(entity, model, lastChangedsRevalidationFields)) {
							let customValidationFn = this.specificationInfo.getCustomAsyncValidationFn(model);
							if (customValidation) {
								let orgEntity = this.isNotLastChangedEntity(entity, lastChangedEntity) ? entity : lastChangedEntity;
								returnPromises.push(this.asyncRevalidateField(entity, model, entities, customValidationFn, orgEntity));
								hasBeenChanged = true;
							}
						}
					}
				}
				return $q.all(returnPromises).then(function postRevalidateEntity() {
					return hasBeenChanged;
				});
			}

			revalidateOtherFields(lastChangedEntity, lastChangedValue, lastChangedModel, updatedList) {
				let self = this;
				let entities = updatedList ? updatedList : this.getUpdatedList(lastChangedEntity, lastChangedValue, lastChangedModel);
				let revalidationEntities = this.specificationInfo.isRevalidateOnlySameEntity(lastChangedEntity, lastChangedModel) ?
					[this.getUpdatedEntity(lastChangedEntity, lastChangedValue, lastChangedModel)] :
					updatedList;
				_.forEach(revalidationEntities, function revalidateEachEntity(revalidationEntity) {
					let revalidated = self.revalidateEntity(revalidationEntity, lastChangedModel, lastChangedEntity, entities);
					if (revalidated && self.isNotLastChangedEntity(revalidationEntity, lastChangedEntity)) {
						self.dataService.fireItemModified(revalidationEntity);
					}
				});
			}

			asyncRevalidateOtherFields(lastChangedEntity, lastChangedValue, lastChangedModel, updatedList) {
				let self = this;
				let entities = updatedList ? updatedList : this.getUpdatedList(lastChangedEntity, lastChangedValue, lastChangedModel);
				let revalidationEntities = this.specificationInfo.isRevalidateOnlySameEntity(lastChangedEntity, lastChangedModel) ?
					[this.getUpdatedEntity(lastChangedEntity, lastChangedValue, lastChangedModel)] :
					updatedList;
				let returnPromises = [];
				_.forEach(revalidationEntities, function revalidateEachEntity(revalidationEntity) {
					let promise = self.asyncRevalidateEntity(revalidationEntity, lastChangedModel, lastChangedEntity, entities).then(function postRevalidateEntity(revalidated) {
						if (revalidated && self.isNotLastChangedEntity(revalidationEntity, lastChangedEntity)) {
							self.dataService.fireItemModified(revalidationEntity);
						}
					});
					returnPromises.push(promise);
				});
				return $q.all(returnPromises);
			}

			getGridRevalidationMethod() {
				let self = this;
				return function gridRevalidationMethod(entity, value, model) {
					self.resetErrorTrackerCache();
					let updatedList = self.getUpdatedList(entity, value, model, self.dataService);
					let customGridValidationMethod = self.getCustomGridValidationMethod(entity);
					let res = customGridValidationMethod(entity, value, model, updatedList);
					self.revalidateOtherFields(entity, value, model, updatedList);
					return res;
				};
			}

			getAsyncGridRevalidationMethod(model, extraFuncName) {
				let self = this;
				let validation = this.specificationInfo.getCustomAsyncValidationFn(model);
				return function gridRevalidationMethod(entity, value, model) {
					let updatedList = self.getUpdatedList(entity, value, model, self.dataService);
					let returnPromises = [];
					let customGridValidationMethod = self.getCustomGridAsyncValidationMethod(extraFuncName, validation, entity);
					returnPromises.push(customGridValidationMethod(entity, value, model, updatedList));
					returnPromises.push(self.asyncRevalidateOtherFields(entity, value, model, updatedList));
					return $q.all(returnPromises).then(function postGridRevalidation(res) {
						return res[0];
					}); // return res[0]: returning result of customGridValidationMethod
				};
			}
		}

		/**
		 * @ngdoc function
		 * @name addValidationServiceInterface
		 * @function adds all needed validation methods to the interface of an validation service
		 * @methodOf platform.platformValidationRevalidationEntitiesFactory
		 * @description adds a validation to the container's validation service that implements a revalidation
		 *  functionality to the grid. Important!! As this is only for synchronos validations it will only work
		 *  on leaf or node container not on root container.
		 * @param schemeId {object} contains information on dto scheme
		 * @param specification {object} contains one array of customValidations and an object globals
		 *  customValidations(array<object>)) with following object properties:
		 *   model(string): field name, the validation acts on
		 *   validation: custom validation method which takes: entity, value, model, entities and gives back
		 *    an error object or boolean. The finishValidation process has not to be triggered within this method.
		 *   revalidateGrid(array<object>, optionally): object, with following properties
		 *    model that specifies the column where revalidation is enabled,
		 *    onlyIfHasError (bool, optionally): Enables revalidation only if the revalidation field has a error.
		 *   revalidateGrid (bool, optionally): Enables all columns will be revalidated,
		 *   revalidateOnlySameEntity (bool, optionally): enables revalidation only at the same entity from where the last
		 *    modification triggered that revalidation. Wins against global.
		 *  globals(object, optionally) with following object properties:
		 *   revalidateCellOnlyIfHasError(bool): Enables globally cell revalidation only of the field to be revalidated
		 *    has an error,
		 *  revalidateOnlySameEntity(bool): Enables revalidation only at the same line of the grid, where the last changed
		 *   cell resides,
		 *  revalidateGrid(bool): Enables globally whole grid revalidation.
		 *  Generally locals that conversing globals are winning against globals. If revalidateGrid an
		 *  revalidateOnlySameEntity both enabled, globally all columns, only of the same line are revalidated.
		 * @param validateService {object} service to be created
		 * @param dataService {object} data service which belongs to the validation service
		 */

		this.addValidationServiceInterface = function addValidationServiceInterface(schemeId, specification, validateService, dataService) {
			let scheme = platformSchemaService.getSchemaFromCache(schemeId);
			let objProperties = scheme.properties;
			let specificationInfo = new RevalidateSpecificationHelper(specification);
			let revalidation = new Revalidation(specificationInfo, dataService, validateService, objProperties);
			for (let propName in objProperties) {
				if (Object.prototype.hasOwnProperty.call(objProperties, propName)) {
					if (specificationInfo.isCustomValidation(propName)) {
						if (specificationInfo.hasGridRevalidation(propName)) {
							this.addGridRevalidationMethod(propName, validateService, revalidation);
						} else {
							this.addCustomValidationToService(propName, validateService, dataService, specificationInfo);
						}
					}
				}
			}
		};

		this.addGridRevalidationMethod = function addGridRevalidationMethod(propName, validateService, revalidation) {
			let funcName = platformValidationServiceFactory.getFuncName(propName);
			let asyncFuncName = platformValidationServiceFactory.getAsyncFuncName(propName);
			let extraAsyncFuncName = platformValidationServiceFactory.getExtraAsyncFuncName(propName);
			validateService[funcName] = revalidation.getGridRevalidationMethod();
			validateService[asyncFuncName] = revalidation.getAsyncGridRevalidationMethod(propName, extraAsyncFuncName);
		};

		this.addCustomValidationToService = function addCustomValidationToService(propName, validateService, dataService, specificationInfo) {
			let funcName = platformValidationServiceFactory.getFuncName(propName);
			let extraFuncName = platformValidationServiceFactory.getExtraFuncName(propName);
			let asyncFuncName = platformValidationServiceFactory.getAsyncFuncName(propName);
			let extraAsyncFuncName = platformValidationServiceFactory.getExtraAsyncFuncName(propName);

			validateService[funcName] = this.getCustomValidationMethod(validateService, extraFuncName, dataService, specificationInfo.getCustomValidationFn(propName));
			validateService[asyncFuncName] = this.getCustomAsyncValidationMethod(validateService, extraAsyncFuncName, dataService, specificationInfo.getCustomAsyncValidationFn(propName));
		};

		this.returnResultOrApplyExtraAsyncFunc = function returnResultOrApplyExtraAsyncFunc(res, validateService, extraAsyncFuncName, entity, value, model) {
			if ((res === true || res.valid === true) && !!extraAsyncFuncName && validateService[extraAsyncFuncName]) {
				return validateService[extraAsyncFuncName](entity, value, model);
			}
			return $q.resolve(res);
		};

		this.getCustomValidationMethod = function getCustomValidationMethod(validateService, extraFuncName, dataService, customValidateMethod) {
			return function customValidationMethod(entity, value, model) {
				let res = _.isFunction(customValidateMethod) ? customValidateMethod(entity, value, model) : true;
				res = platformValidationServiceFactory.returnResultOrApplyExtraFunc(res, validateService, extraFuncName, entity, value, model);
				platformDataValidationService.finishValidation(res, entity, value, model, validateService, dataService);
				return res;
			};
		};

		this.getCustomAsyncValidationMethod = function getCustomAsyncValidationMethod(validateService, extraAsyncFuncName, dataService, customAsyncValidateMethod) {
			let self = this;
			return function customAsyncValidationMethod(entity, value, model) {
				return (_.isFunction(customAsyncValidateMethod) ? customAsyncValidateMethod(entity, value, model) : returnTruePromise()).then(function postCustomAsyncValdiate(res1) {
					return self.returnResultOrApplyExtraAsyncFunc(res1, validateService, extraAsyncFuncName, entity, value, model).then(function postExtraAsyncFunc(res2) {
						platformDataValidationService.finishValidation(res2, entity, value, model, validateService, dataService);
						return res2;
					});
				});
			};
		};

		this.validateChain = function validateChain(validationChain){
			return function (entity, value, model, entities){
				let res = true;
				_.forEach(_.filter(validationChain, item => _.isFunction(item)), function (validation) {
					if(res === true || res.valid === true){
						res = validation(entity, value, model, entities);
					}
				});
				return res;
			};
		};
	}
})(angular);
