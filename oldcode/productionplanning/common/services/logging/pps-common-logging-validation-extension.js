/**
 * Created by zov on 19/06/2019.
 */
(function () {
	'use strict';
	/* global angular, _, globals */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommonLoggingValidationExtension', ppsCommonLoggingValidationExtension);
	ppsCommonLoggingValidationExtension.$inject = ['platformSchemaService', 'platformDataValidationService',
		'platformValidationByDataService', 'ppsCommonLoggingConstant',
		'platformRuntimeDataService', 'ppsCommonLoggingUndefinedFieldProcessorFactory',
		'ppsCommonLoggingEntityTypeProcessorFactory', 'moment',
		'$injector', '$q', 'platformModuleStateService'];
	function ppsCommonLoggingValidationExtension(platformSchemaService, platformDataValidationService,
		platformValidationByDataService, ppsCommonLoggingConstant,
		platformRuntimeDataService, ppsCommonLoggingUndefinedFieldProcessorFactory,
		ppsCommonLoggingEntityTypeProcessorFactory, moment,
		$injector, $q, platformModuleStateService) {

		var validationSrvsCache = [];
		var logDisplayedReasonPropName = ppsCommonLoggingConstant.DisplayedReasonPropName;
		var logReasonPropName = ppsCommonLoggingConstant.ReasonPropName;
		var logRemarkPropName = ppsCommonLoggingConstant.RemarkPropName;
		var logModInfoPropName = ppsCommonLoggingConstant.ModificationInfoPropName;
		var logModPropsPropName = ppsCommonLoggingConstant.ModificationPropsPropName;
		var logModPropPropName = ppsCommonLoggingConstant.ModifiedPropPropName;
		var logModPropRequiredPropName = ppsCommonLoggingConstant.LogRequiredPropName;
		var logModPropReasonGroupPropName = ppsCommonLoggingConstant.LogReasonGroupPropName;

		function getModificationInfoByEntity(entity) {
			return entity[logModInfoPropName];
		}

		function clearModificationInfoByEntity(entity) {
			if(entity){
				delete entity[logModInfoPropName];
				delete entity[logDisplayedReasonPropName];
			}
		}

		function setModificationInfo(entity, propName, newValue, logConfigType, logRequired, logReasonGroupId, logReasonDescription) {
			if (!entity[logModInfoPropName]) {
				entity[logModInfoPropName] = {};
				entity[logModInfoPropName][logModPropsPropName] = [];
			}
			if (propName === 'DescriptionInfo') {
				propName = 'DescriptionInfo.Translated';
				newValue = newValue.Translated;
			}
			var modProp = ppsCommonLoggingConstant.FindModifiedProp(entity, propName);
			if (!modProp) {
				entity[logModInfoPropName][logModPropsPropName].push(createModifiedPropObj(entity, propName, newValue, logConfigType, logRequired, logReasonGroupId, logReasonDescription));
			} else {
				if(!isValueEqual(modProp[ppsCommonLoggingConstant.OldValuePropName], newValue)){ // jshint ignore:line
					modProp[ppsCommonLoggingConstant.NewValuePropName] = newValue;
				}
				// remove not needed
				// else{
				// _.remove(entity[logModInfoPropName][logModPropsPropName], modProp); // remove if value not changed
				// }
			}
		}

		function setDataService(entity, dataSrv) {
			entity.getDataService = function() {
				return dataSrv;
			};
		}

		function isValueEqual(value1, value2) {
			var equal = value1 === value2;
			if (!equal) {
				if (moment.isMoment(value1) && moment.isMoment(value2)) {
					equal = value1.isSame(value2);
				} else if (_.isString(value1) && _.isString(value2)) {
					equal = value1.trim() === value2.trim();
				}
			}

			return equal;
		}

		function createModifiedPropObj(entity, propName, newValue, logConfigType, logRequired, logReasonGroupId, logReasonDescription) {
			var result = {};
			result[ppsCommonLoggingConstant.ModifiedPropPropName] = propName;
			result[ppsCommonLoggingConstant.NewValuePropName] = newValue;
			result[ppsCommonLoggingConstant.LogConfigTypePropName] = logConfigType;
			result[ppsCommonLoggingConstant.LogRequiredPropName] = logRequired;
			result[ppsCommonLoggingConstant.LogReasonGroupPropName] = logReasonGroupId;
			result[ppsCommonLoggingConstant.LogReasonDescription] = logReasonDescription;
			Object.defineProperty(result, ppsCommonLoggingConstant.OldValuePropName, { // OldValue is readonly
				configurable: false,
				writable: false,
				enumerable: true,
				value: _.get(entity, propName)
			});
			return result;
		}

		function extendValidationFunctions(dataSrv, validationSrv, translationSrv, schemaOption, isLogEnableOnProperty) {
			// add function validate ModificationInfo
			var validateModInfo = function (entity, value, model) {
				var validateResult = platformDataValidationService.createSuccessObject();
				if (entity.Version > 0 || _.isUndefined(entity.Version) || _.isNull(entity.Version)) {
					var modProps = ppsCommonLoggingConstant.GetModifiedProps(entity);
					if (modProps) {
						var logRequiredProps = modProps.filter(function (item) {
							return item.LogRequired;
						});
						if (logRequiredProps.length > 0) {
							var allEmpty = logRequiredProps.every(function (item) {
								return !item[logReasonPropName] && !item[logRemarkPropName];
							});
							if (allEmpty) {
								validateResult = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage');
							} else {
								var existEmpty = logRequiredProps.some(function (item) {
									return !item[logReasonPropName] && !item[logRemarkPropName];
								});
								if (existEmpty) {
									validateResult = platformDataValidationService.createErrorObject('productionplanning.common.updateReasonInvalid');
								}
							}
						}
					}
				}

				// to fix validation issue in form
				// control-validation.js line:29
				// _.get(entity, field, modelValue)
				// if entity[model]===undefined, above statement will return modelValue, it cause no validation
				if (!validateResult.valid && entity[model] === undefined) {
					entity[model] = null;
				}

				return platformDataValidationService.finishValidation(validateResult, entity, value, model, validationSrv, dataSrv);
			};
			validationSrv['validate' + logModInfoPropName] = validateModInfo;

			var askForLog = function (entity, value, model, postFn) {
				var defer = $q.defer();
				showLoggingDialog(cloneEntityWithSpecificModifiedProp(entity, model), schemaOption, translationSrv, true).then(function (result) {
					if (result.ok) {
						setUpdateReasons(entity, result.value);
						validate(validateModInfo, entity);
					} else if (result.applyAll) {
						if (angular.isFunction(entity.getDataService)) {
							var entities = getModifiedEntitiesInCurrentModule(entity);
							setUpdateReasonsAndValidateEntities(entities, entity, result.value, validateModInfo);
						}
					}
				}).finally(function () {
					defer.resolve((postFn || angular.noop)());
				});
				return defer.promise;
			};

			// override validate functions
			var scheme = platformSchemaService.getSchemaFromCache(schemaOption);
			var objProperties = scheme.properties;
			var onPropertyChanged = function (entity, value, model, isAsync) {
				if (model.includes('event_type_slot') || model.includes('clerk_role_slot')) {
					return $q.when();
				}
				var logCfg = null;
				if (entity.From === 'PU' && scheme.schema.endsWith('.EngTask2ClerkDto')){ // HackCode, for skip condition that the engtask2clerk is "PPSItem2Clerk" actually. At the moment, logging of PPSItem2Clerk has not been supported yet.(by zwz on 2022/6/2 #128338)
					logCfg = {
						logEnable: undefined,
						logConfigType: undefined,
						logRequired: false,
						logReasonGroupId: null,
						logReasonDescription: ''
					};
				} else {
					if (isModified(entity, value, model) || (model === 'IsLive')) {
						let entityType = null;
						if (_.isFunction(entity.getType) && !_.isUndefined(model)) {
							entityType = entity.getType(model);
						} else if (!_.isUndefined(entity.EventTypeFk)) {
							entityType = entity.EventTypeFk;
						} else if (!_.isUndefined(entity.ClerkRoleFk)) {
							entityType = entity.ClerkRoleFk;
						}

						logCfg = isLogEnableOnProperty(schemaOption, model, entityType);
					}
				}

				if(logCfg && logCfg.logEnable){ // need logging
					if(!isAsync) {
						setModificationInfo(entity, model, value, logCfg.logConfigType, logCfg.logRequired, logCfg.logReasonGroupId, logCfg.logReasonDescription);
						setDataService(entity, dataSrv);
						validate(validateModInfo, entity);
					}
					else {
						if(logCfg.logConfigType !== 2) { // not equal to "silent", then show logging dialog
							return askForLog(entity, value, model);
						} else {
							return $q.when();
						}
					}
				} else if(isAsync) { // no need logging, but return promise
					return $q.when();
				}
			};

			// do extend validation functions
			Object.getOwnPropertyNames(objProperties).forEach(function (propName) {
				var funcName = 'validate' + propName;
				if (validationSrv[funcName]) {
					var orgValidateFun = validationSrv[funcName];
					validationSrv[funcName] = function (entity, value, model) {
						if (!model.includes('event_type_slot')) {
							onPropertyChanged(entity, value, model);
						}
						return orgValidateFun.apply(validationSrv, arguments);
					};
				} else {
					validationSrv[funcName] = function (entity, value, model) {
						if (!model.includes('event_type_slot')) {
							onPropertyChanged(entity, value, model);
						}
						return platformDataValidationService.createSuccessObject();
					};
				}

				const asyncFuncName = 'asyncValidate' + propName;
				if (validationSrv[asyncFuncName]) {
					var orgAsyncValidateFun = validationSrv[asyncFuncName];
					validationSrv[asyncFuncName] = function (entity, value, model) {
						var defer = $q.defer();
						var orgPromise = orgAsyncValidateFun.apply(validationSrv, arguments);
						var loggingPromise = onPropertyChanged(entity, value, model, true);
						$q.all([orgPromise, loggingPromise]).then(function (responses) {
							defer.resolve(responses[0]);
						});
						return defer.promise;
					};
				} else {
					validationSrv[asyncFuncName] = function (entity, value, model) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataSrv);
						asyncMarker.myPromise = onPropertyChanged(entity, value, model, true).finally(function () {
							return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, validationSrv, dataSrv);
						});
						return asyncMarker.myPromise;
					};
				}

				const asyncFuncNameForBulkConfig = 'asyncValidate' + propName + 'ForBulkConfig';
				if (validationSrv[asyncFuncNameForBulkConfig]) {
					var orgAsyncValidateFunForBulkConfig = validationSrv[asyncFuncNameForBulkConfig];
					validationSrv[asyncFuncNameForBulkConfig] = function (entity, value, model) {
						var defer = $q.defer();
						var orgPromise = orgAsyncValidateFunForBulkConfig.apply(validationSrv, arguments);
						$q.when(orgPromise).then(function (responses) {
							defer.resolve(responses[0]);
						});
						return defer.promise;
					};
				} else {
					validationSrv[asyncFuncNameForBulkConfig] = function (entity, value, model) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataSrv);
						asyncMarker.myPromise = $q.when(platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, validationSrv, dataSrv));
						return asyncMarker.myPromise;
					};
				}
			});
		}

		function cloneEntityWithSpecificModifiedProp(entity, propName, logRequired, logReasonGroupId) {
			var modProp = ppsCommonLoggingConstant.FindModifiedProp(entity, propName);
			if(!modProp){
				modProp = {};
				modProp[logModPropPropName] = propName;
				modProp[logModPropRequiredPropName] = logRequired;
				modProp[logModPropReasonGroupPropName] = logReasonGroupId;
			}

			var clone = _.clone(entity);
			clone[logModInfoPropName] = {};
			_.set(clone, logModInfoPropName + '.' + logModPropsPropName, [modProp]);
			return clone;
		}

		function appendProcessors(dataSrv, schemaOption) {
			const processor = dataSrv.getDataProcessor();
			processor.push(ppsCommonLoggingUndefinedFieldProcessorFactory.getProcessor(schemaOption));
			processor.push(ppsCommonLoggingEntityTypeProcessorFactory.getProcessor(schemaOption));
		}

		function isModified(entity, value, model) {
			if (entity.Version === 0 || model === logReasonPropName || model === logRemarkPropName) {
				return false;
			}

			var realModel = (model === 'DescriptionInfo') ? 'DescriptionInfo.Translated' : model;
			return !isValueEqual(_.get(entity, realModel, value), value);
		}

		function extendValidation(dataSrv, validationSrv, translationSrv, schemaOption, isLogEnableOnProperty) {
			if (validationSrvsCache.indexOf(validationSrv) < 0) {
				validationSrvsCache.push(validationSrv);
				appendProcessors(dataSrv, schemaOption);
				extendValidationFunctions(dataSrv, validationSrv, translationSrv, schemaOption, isLogEnableOnProperty);
			}
		}

		function showLoggingDialog(entity, schemaOption, translationSrv, showApplyAllBtn= false, showOkBtn= true) {
			var dialogService = $injector.get('ppsCommonLoggingUpdateReasonsDialogService');
			var dialogOptions = {
				width: '600px',
				resizeable: true,
				headerTextKey: 'productionplanning.common.editUpdateReasons',
				bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.common/partials/pps-common-form-detail.html',
				footerTemplateUrl: globals.appBaseUrl + 'productionplanning.common/partials/pps-common-form-detail-footer.html',
				showOkButton: showOkBtn,
				showCancelButton: true,
				disableOkButton: dialogService.disableOkButton,
				params: {
					controllerService: dialogService,
					controllerInitParam: {
						entity: entity,
						getModifiedProps: function () {
							return _.get(entity, logModInfoPropName + '.' + logModPropsPropName) || [];
						},
						schemaOption: schemaOption,
						translationSrv: translationSrv,
						showApplyallButton: showApplyAllBtn
					},
				}
			};
			return $injector.get('platformModalService').showDialog(dialogOptions);
		}

		function setUpdateReasonsAndValidateEntities(entities, modifiedEntity, reason, validaSrv) {
			setUpdateReasons(modifiedEntity, reason);
			validate(validaSrv, modifiedEntity);

			entities = entities === null ? getModifiedEntitiesInCurrentModule(modifiedEntity) : entities;
			entities.forEach(function(entity2BSetReason) {
				try {
					if (ppsCommonLoggingConstant.HasSameLogReasonGroup(entity2BSetReason, modifiedEntity) &&
						ppsCommonLoggingConstant.GetModifiedProps(entity2BSetReason).LogConfigType !== 2) {
						setUpdateReasons(entity2BSetReason, reason);
					}
				} finally {
					validate(validaSrv, entity2BSetReason);
				}
			});
		}

		function setUpdateReasons(entity, reason) {
			$injector.get('ppsCommonLoggingUpdateReasonsDialogService').setUpdateReasons(entity, reason);
		}

		function validate(validaSrv, entity) {
			var validationResult = validaSrv(entity, entity[logModInfoPropName], logModInfoPropName);
			platformRuntimeDataService.applyValidationResult(validationResult, entity, logModInfoPropName);
		}

		function getModifiedEntitiesInCurrentModule(entity) {
			const ToSave = 'ToSave';
			var entities = [];

			var rootService = getRootService(entity.getDataService());
			var modState = platformModuleStateService.state(rootService.getModule());
			var modifications = modState.modifications;

			var itemName = rootService.getItemName();
			var mainItem = modifications[itemName];
			if (mainItem) {
				entities = entities.concat(mainItem);
			}

			var itemToSaveKeys = Object.keys(modifications).filter(function(item){
				return item.lastIndexOf(ToSave) >= 0;
			});

			for(let key of itemToSaveKeys) {
				var itemToSave = modifications[key];
				if (angular.isArray(itemToSave) && itemToSave.length > 0) {
					if (itemToSave[0].MainItemId === undefined) {
						entities = entities.concat(itemToSave);
					} else {
						var items = itemToSave.map(function(prop) {
							return prop[key.replace(ToSave, '')];
						});
						entities = entities.concat(items);
					}
				}
			}

			return entities;
		}

		var getRootService = function(dataService) {
			while (dataService.parentService()) {
				dataService = dataService.parentService();
			}
			return dataService;
		};

		return {
			extendValidation: extendValidation,
			getModificationInfo: getModificationInfoByEntity,
			clearModificationInfo: clearModificationInfoByEntity,
			showLoggingDialog: showLoggingDialog,
			getModifiedEntitiesInCurrentModule: getModifiedEntitiesInCurrentModule,
			setUpdateReasons: setUpdateReasons,
			setUpdateReasonsAndValidateEntities: setUpdateReasonsAndValidateEntities
		};
	}
})();