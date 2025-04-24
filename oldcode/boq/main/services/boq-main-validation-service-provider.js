/**
 * Created by bh on 24.11.2016.
 */

(function () {
	/* global _, globals */
	'use strict';

	var boqMainModule = 'boq.main';

	/**
	 * @ngdoc service
	 * @name salesCommonBoqValidationServiceProvider
	 * @description provides boq validation services for common modules
	 */
	angular.module(boqMainModule).factory('boqMainValidationServiceProvider', ['$injector', '$q', '$http', 'platformRuntimeDataService', 'platformDataValidationService', 'boqMainCommonService',
		function ($injector, $q, $http, platformRuntimeDataService, platformDataValidationService, boqMainCommonService) {

			var service = {};
			var latestCreatedValidationService = null;
			var skipAsyncValidateRef = false;

			var validateReference = function validateReference(entity, newVal, boqMainService) {

				// The reference number of the root item is currently always regarded as valid and not checked against any rules
				var boqMainCommonService = $injector.get('boqMainCommonService');
				var errorMessage = {};
				if (boqMainCommonService.isRoot(entity)) {
					let loadedBoqContext = boqMainService.getCallingContextType();
					let boqListService = null;

					if(loadedBoqContext === 'Project') {
						boqListService = $injector.get('boqProjectService');
					}else if(loadedBoqContext==='Wic'){
						boqListService=$injector.get('boqWicCatBoqService');
					}
					else if(loadedBoqContext === 'PrcPackage'){
						let procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
						let procurementContextService = $injector.get('procurementContextService');
						boqListService = procurementCommonPrcBoqService.getService(procurementContextService.getMainService(), boqMainService);
					}else if(loadedBoqContext === 'LeadingStructureToProjectBoq' || $injector.get('estimateMainWicboqToPrjboqCompareDataForWicService').getIsOpening()){
						boqListService = $injector.get('estimateMainWicboqToPrjboqCompareDataForWicService');
						loadedBoqContext = 'LeadingStructureToProjectBoq';
					}

					var items = boqListService.getList();
					var foundItem = _.filter(items, function(boqItem) {
						if(loadedBoqContext !== 'LeadingStructureToProjectBoq'){
							return boqItem.BoqRootItem.Reference === newVal;
						}else{
							return !boqItem.BoqItemFk && boqItem.Reference === newVal;
						}
					});

					if(_.isArray(foundItem) && foundItem.length > 0 && foundItem[0].BoqRootItem.Id !== entity.Id) {
						return {
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'boq.main.referenceInUse',
							error$tr$param: {}
						}; // The new reference is already in use and is not applied and remains in the old valid state.
					}
					else {
						return {
							valid: true,
							apply: true,
							error: '...',
							error$tr$: '',
							error$tr$param: {}
						};
					}
				}

				if (newVal !== entity.Reference) {

					// Do some formatting of the entered reference number, i.e. fill with leading spaces or zeros and
					// add final dot if missing or neccessary.
					newVal = boqMainService.getFormattedReferenceNumber(entity, newVal);
					var multipleOccurrences = _.filter(boqMainService.getUnfilteredList(), function (boqItem) {
						return boqItem.Reference === newVal;
					}).length > 1;

					// Check if the new reference is already used elsewhere
					var simplyFinalDotAdded = (entity.Reference + '.' === newVal);
					var simplyFinalDotRemoved = (entity.Reference === (newVal + '.'));
					var revertToSavedValue = (entity.Reference === newVal); // This should be true if the user reverts has changes back to the former valid value. But for safety reasons we validate the value again.
					var foundBoqItemByReference = boqMainService.getBoqItemByReference(newVal);
					if (!multipleOccurrences && (simplyFinalDotAdded || simplyFinalDotRemoved || revertToSavedValue || !foundBoqItemByReference || foundBoqItemByReference.Id === entity.Id)) {
						// The new reference isn't used yet.
						// Now check for valid reference number.
						if (!boqMainService.isReferenceValidForThisItem(newVal, entity, errorMessage)) {
							return {
								valid: false,
								apply: true,
								error: !_.isEmpty(errorMessage.errorMessage) ? errorMessage.errorMessage : '...',
								error$tr$: _.isEmpty(errorMessage.errorMessage) ? 'boq.main.invalidReference' : null,
								error$tr$param: {}
							}; // The new reference is not applied and remains in the old valid state
						}
					}
					else {
						return {
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'boq.main.referenceInUse',
							error$tr$param: {}
						}; // The new reference is already in use and is not applied and remains in the old valid state.
					}
				}
				return {
					valid: true,
					apply: true,
					error: '...',
					error$tr$: '',
					error$tr$param: {}
				}; // Passed validation -> everything fine.
			};

			var ValidationServiceProvider = function(boqMainService) {
				var self = this;

				this.asyncValidateBoqLineTypeFk = function (boqItem, propValue, propName) {
					const boqMainLineTypes = $injector.get('boqMainLineTypes');
					var changeSucceeded = true;
					var result = true;

					function createErrorResult() {
						var errorResult = platformDataValidationService.createErrorObject('boq.main.setSubdescriptionError', {});
						errorResult.apply = false;
						errorResult.valid = true;
						return errorResult;
					}

					function finishValidation(result) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(boqItem, propValue, propName, boqMainService);
						platformRuntimeDataService.applyValidationResult(result, boqItem, propName);
						return platformDataValidationService.finishAsyncValidation(result, boqItem, propValue, propName, asyncMarker, self, boqMainService);
					}

					// Check if the line type has been changed to a subdescription
					if (boqMainCommonService.isSubDescriptionType(propValue)) {
						// Bingo, a subdescription is set.
						// For a subdescription needs a lead description as parent we look for it in the predecessing items of the subdescription on
						// the current hierarchy level. If we can find a lead description of position everything is fine, i.e. validation succeeds if not the validation fails.
						var searchConfig = {
							searchPreviousOnly: true,
							searchSameLevelOnly: true,
							includeSelectedItem: false
						};

						if (!boqMainService.findFittingItem(boqItem, boqMainLineTypes.position, searchConfig)) {
							result = createErrorResult();
							changeSucceeded = false;
							boqItem._originBoqLineTypeFk = boqItem.BoqLineTypeFk; // Save original value for possibly later resetting
						}
					}

					if (changeSucceeded && boqItem.BoqLineTypeFk === boqMainLineTypes.position) {
						return boqMainService.getDependentEstimateItems(boqItem).then(function (response1) {
							return boqMainService.detachDependentEstimateItems(boqItem, response1).then(function (response2) {
								if (!response2) {
									result = createErrorResult();
								}
								return finishValidation(result);
							});
						});
					} else {
						return $q.when(finishValidation(result));
					}
				};

				this.validateRule = function (entity, value, model) {
					var validResult = true;
					platformRuntimeDataService.applyValidationResult(validResult, entity, 'Rule');
					platformDataValidationService.finishValidation(validResult, entity, value, model, self, boqMainService);
				};

				this.validateAAN = function (boqItem, aan) {
					var result = true;

					if (boqItem.IsCrbBoq) {
						return $injector.get('boqMainCrbBoqItemService').validateAAN(boqItem, aan, self, boqMainService);
					} else if (aan && aan !== parseInt(aan).toString()) { // is 'value' not a number?
						result = {valid: false, apply: true, error$tr$: 'boq.main.invalidGaebAGN'};
					} else {
						boqItem._originAAN = boqItem.AAN;  // store original value (needed for select awarded items)
					}

					return result;
				};

				this.validateAGN = function (boqItem, agn) {
					var result = true;

					if (boqItem.IsCrbBoq) {
						return $injector.get('boqMainCrbBoqItemService').validateAGN(boqItem, agn, self, boqMainService);
					} else if (agn && agn !== parseInt(agn).toString()) { // is 'value' not a number?
						result = {valid: false, apply: true, error$tr$: 'boq.main.invalidGaebAGN'};
					} else {
						boqItem._originAGN = boqItem.AGN;  // store original value
					}

					platformRuntimeDataService.applyValidationResult(result, boqItem, 'AGN');
					platformDataValidationService.finishValidation(result, boqItem, agn, 'AGN', self, boqMainService);
					return result;
				};

				this.validateBasItemType2Fk = function (boqItem, basItemType2Fk) {
					if (boqItem.IsCrbBoq) {
						$injector.get('boqMainCrbBoqItemService').validateBasItemType2Fk(boqItem, basItemType2Fk, self, boqMainService);
						return true;
					} else {
						boqItem._originAAN = boqItem.AAN;  // store original value (needed for select awarded items)
						return true;
					}
				};

				this.validateQuantity = function (boqItem) {
					boqItem._originQuantity = boqItem.Quantity;  // store original value, needed for a comparision with property 'QuantityAdj'
					return true;
				};

				// Validator function for Reference column
				this.validateReference = function syncValidateReference(entity, value, model) {
					var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					var result = validateReference(entity, value, boqMainService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					boqMainService.fireItemModified(entity);

					// Below code added for ALM 133159 as its not good way to update the value of reference in entity in validation service
					// Instead we should have a callback on click of Ok button of validation wizard dialog. New ALM created for this 139806
					if (result.valid) {
						var boqMainChangeService = $injector.get('boqMainChangeService');
						var boqMainCommonService = $injector.get('boqMainCommonService');
						entity.Reference = value;
						boqMainChangeService.reactOnChangeOfBoqItem(entity, model, boqMainService, boqMainCommonService, true);
					}

					return platformDataValidationService.finishValidation(result, entity, value, model, self, boqMainService);
				};

				if (!skipAsyncValidateRef) {
					this.asyncValidateReference = function asyncValidateReference(entity, value, model) {

						var returnPromise = $q.when(true);

						// The following check is only done if the entity has been saved yet, i.e. we don't want already saved items be assigned to another base boq element.
						// The assignment of base boq items is only active in case the item has just been created.
						if (boqMainService.hasItemBeenSavedYet(entity) && entity.Reference !== value) {
							// Check if this new reference number is already in use in a related base boq and the corresponding base boq item differs from the one that's possibly already linked to the changed version boq item (-> entity)
							// If so, this isn't allowed either.
							var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, boqMainService);

							asyncMarker.myPromise = boqMainService.getBaseBoqItemByReferenceNumber(entity, value).then(function (baseBoqItem) {
								if ((baseBoqItem && baseBoqItem.Id !== entity.BoqItemPrjItemFk) || (!baseBoqItem && entity.BoqItemPrjItemFk !== null)) {
									// Notify the user that the reference number already exists in the base boq and no relocation of the base boq link is allowed
									boqMainService.fireItemModified(entity);
									return platformDataValidationService.finishAsyncValidation({
										valid: false,
										apply: true,
										error: '...',
										error$tr$: 'boq.main.referenceInUseInBaseBoq',
										error$tr$param: {}
									}, entity, value, model, asyncMarker, self, boqMainService);
								} else {
									boqMainService.fireItemModified(entity);
									return platformDataValidationService.finishAsyncValidation({
										valid: true,
										apply: true,
										error: '...',
										error$tr$: '',
										error$tr$param: {}
									}, entity, value, model, asyncMarker, self, boqMainService);
								}
							},
							function () {
								boqMainService.fireItemModified(entity);
								return platformDataValidationService.finishAsyncValidation({
									valid: true,
									apply: true,
									error: '...',
									error$tr$: '',
									error$tr$param: {}
								}, entity, value, model, asyncMarker, self, boqMainService);
							}
							);

							returnPromise = asyncMarker.myPromise;
						}

						return returnPromise;
					};
				}

				this.asyncValidateMdcCostCodeFk = function (boqItem, costCodeFk) {
					var defer = $q.defer();
					if (costCodeFk === null) {
						defer.resolve(true);
					} else {
						var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
						var promiseArr = [basicsLookupdataLookupDescriptorService.loadItemByKey('costcode', costCodeFk)];
						var moduleName = angular.isFunction(boqMainService.getModuleName) && boqMainService.getModuleName();
						if (moduleName === 'procurement.pes') {
							var parentService = angular.isFunction(boqMainService.parentService) ? boqMainService.parentService() : boqMainService.parentService;
							var parentEntity = parentService && angular.isFunction(parentService.getSelected) && parentService.getSelected();
							if (parentEntity) {
								promiseArr.push(checkBoqItemsByOtherBoqHeader(boqItem, parentEntity.PrcBoqFk, parentEntity.ConHeaderFk));
							}
						}
						$q.all(promiseArr).then(function (result) {
							// Copy specific properties from cost code to boq item
							var costCode = result[0];
							if ((!result[1] || !result[1].data) && costCode) {
								if (!boqItem.PriceOc) {
									boqItem.PriceOc = costCode.Rate;
								}

								boqMainService.calcItemsPriceHoursNew(boqItem, true);

								if (boqItem.IsUrb) {
									boqMainService.recalcUrbs(boqItem); // The price has changed so the according urbs have to be recalculated
								}
							}
							defer.resolve(true);
						});
					}

					return defer.promise;
				};

				this.asyncValidateIncluded = function asyncValidateIncluded(entity, value, model) {
					return asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askDeleteUnitRate', 'boq.main.confirmDeleteUnitRate', true);
				};

				this.asyncValidateNotSubmitted = function asyncValidateIncluded(entity, value, model) {
					return asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askDeleteUnitRate', 'boq.main.confirmDeleteUnitRate', true);
				};

				this.asyncValidateRecordingLevel = function asyncValidateRecordingLevel(entity, value, model) {

					let returnPromise = $q.when(true);
					let boqMainCommonService = $injector.get('boqMainCommonService');

					// Recursively look for boq items having a quantity assigned.
					// If so, display a warnung letting the user decide if he wants to go on with setting the RecordingLevel for all visited items accordingly.
					let findQuantityRecursivelyVisitorObject = {
						visitBoqItemFn: function findQuantityRecursively(parentItem, boqItem, lineType, level, visitorObject) {

							if (!boqMainCommonService.isTextElementWithoutReference(boqItem)) {
								if (boqItem.Quantity !== 0) {
									visitorObject.HasQuantities = true;
									visitorObject.visitBoqItemFn = undefined; // to stop further iteration
									return false;
								} else {
									visitorObject.HasQuantities = false;
								}
							}

							return true;
						}
					};

					boqMainService.visitBoqItemRecursively(entity, findQuantityRecursivelyVisitorObject);

					if (findQuantityRecursivelyVisitorObject.HasQuantities) {
						returnPromise = asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfRecordingLevel', 'boq.main.confirmChangeOfRecordingLevel');
					}

					return returnPromise;
				};

				this.asyncValidatePercentageQuantity = function asyncValidatePercentageQuantity(entity, value, model) {
					return asyncValidatePercentageValues(entity, value, model);
				};

				this.asyncValidateCumulativePercentage = function asyncValidateCumulativePercentage(entity, value, model) {
					return asyncValidatePercentageValues(entity, value, model);
				};

				this.validatePrcStructureFk = function validatePrcStructureFk(entity, value, model) {
					if (boqMainService.onProcurementStructureChanged) {
						boqMainService.onProcurementStructureChanged.fire({newValue: value});
					}
					return true;
				};

				// The following validation is currently only done in Sales Wip and Sales Billing
				if (boqMainService.getServiceName() === 'salesWipBoqStructureService' || boqMainService.getServiceName() === 'salesBillingBoqStructureService') {
					this.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
						let returnPromise = $q.when(true);

						if (determineExistanceOfQtoDetails(entity)) {
							returnPromise = asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfQuantityIfQtoDetailsExist', 'boq.main.confirmChangeOfQuantityIfQtoDetailsExist');
						}

						return returnPromise;
					};

					this.asyncValidateTotalQuantity = function asyncValidateTotalQuantity(entity, value, model) {
						let returnPromise = $q.when(true);

						if (determineExistanceOfQtoDetails(entity)) {
							returnPromise = asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfQuantityIfQtoDetailsExist', 'boq.main.confirmChangeOfQuantityIfQtoDetailsExist');
						}

						return returnPromise;
					};

					this.asyncValidateTotalPrice = function asyncValidateTotalQuantity(entity, value, model) {
						let returnPromise = $q.when(true);

						if (determineExistanceOfQtoDetails(entity)) {
							returnPromise = asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfQuantityIfQtoDetailsExist', 'boq.main.confirmChangeOfQuantityIfQtoDetailsExist');
						}

						return returnPromise;
					};
				}

				function determineExistanceOfQtoDetails(entity) {
					let boqMainCommonService = $injector.get('boqMainCommonService');

					// Recursively look for boq items having qto details assigned.
					let determineExistanceOfQtoDetailsVisitorObject = {
						hasQtoDetailsAndIsIQ: false,
						visitBoqItemFn: function findQtoDetailsRecursively(parentItem, boqItem, lineType, level, visitorObject) {

							if (!boqMainCommonService.isTextElementWithoutReference(boqItem)) {
								if (boqItem.HasQtoDetailsAndIsIQ) {
									visitorObject.hasQtoDetailsAndIsIQ = true;
									visitorObject.visitBoqItemFn = undefined; // to stop further iteration
									return false;
								} else {
									visitorObject.hasQtoDetailsAndIsIQ = false;
								}
							}

							return true;
						}
					};

					boqMainService.visitBoqItemRecursively(entity, determineExistanceOfQtoDetailsVisitorObject);

					return determineExistanceOfQtoDetailsVisitorObject.hasQtoDetailsAndIsIQ;
				}

				function determineInconsistentSettingOfPercentageColumn(entity, model) {
					let boqMainCommonService = $injector.get('boqMainCommonService');
					let propertyName = model;

					// Recursively look for boq items having a quantity assigned.
					// If so, display a warning letting the user decide if he wants to go on with setting the RecordingLevel for all visited items accordingly.
					let determineConsistentSettingVisitorObject = {
						consistentValue: undefined,
						isInconsistent: false,
						visitBoqItemFn: function findQuantityRecursively(parentItem, boqItem, lineType, level, visitorObject) {

							if (!boqMainCommonService.isTextElementWithoutReference(boqItem)) {
								if (visitorObject.consistentValue !== undefined && _.isNumber(boqItem[propertyName]) && boqItem[propertyName] !== visitorObject.consistentValue) {
									visitorObject.isInconsistent = true;
									visitorObject.visitBoqItemFn = undefined; // to stop further iteration
									return false;
								} else {
									visitorObject.isInconsistent = false;
									visitorObject.consistentValue = boqItem[propertyName];
								}
							}

							return true;
						}
					};

					boqMainService.visitBoqItemRecursively(entity, determineConsistentSettingVisitorObject);

					return determineConsistentSettingVisitorObject.isInconsistent;
				}

				function checkBoqItemsByOtherBoqHeader(boqItem, prcBoqFk, contractFk) {
					if (boqItem.BoqItemPrjBoqFk && boqItem.BoqItemPrjItemFk && prcBoqFk > 0 && contractFk > 0) {
						return $http.get(globals.webApiBaseUrl + 'procurement/common/boq/checkboqitemsbyotherboqheader?prjBoqFk=' + boqItem.BoqItemPrjBoqFk +
							'&prjItemFk=' + boqItem.BoqItemPrjItemFk + '&prcBoqFk=' + prcBoqFk + '&contractFk=' + contractFk);
					} else {
						var defer = $q.defer();
						defer.resolve({data: false});

						return defer.promise;
					}
				}

				function asyncValidateAskBeforeValidating(entity, value, model, dialogMessage, dialogTitle, useTemporaryResetProperty, useTemporaryOldValueProperty) {
					var returnPromise = $q.when(true);
					var platformModalService = $injector.get('platformModalService');
					var doValidate = _.isBoolean(value) ? value : true;
					entity['Reset_' + model] = undefined;
					entity['OldValueOf_' + model] = entity[model];

					if (doValidate) {
						var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, boqMainService);

						asyncMarker.myPromise = platformModalService.showYesNoDialog(dialogMessage, dialogTitle).then(function (response) {
							if (response.yes) {
								boqMainService.fireItemModified(entity);
								return platformDataValidationService.finishAsyncValidation({
									valid: true,
									apply: true,
									error: '...',
									error$tr$: '',
									error$tr$param: {}
								}, entity, value, model, asyncMarker, self, boqMainService);
							} else {
								// Add temporary property to entity to trigger resetting to false
								entity['Reset_' + model] = true;
								boqMainService.fireItemModified(entity);
								return platformDataValidationService.finishAsyncValidation({
									valid: true,
									apply: false,
									error: '...',
									error$tr$: '',
									error$tr$param: {}
								}, entity, value, model, asyncMarker, self, boqMainService);
							}
						},
						function () {
							boqMainService.fireItemModified(entity);
							return platformDataValidationService.finishAsyncValidation({
								valid: true,
								apply: true,
								error: '...',
								error$tr$: '',
								error$tr$param: {}
							}, entity, value, model, asyncMarker, self, boqMainService);
						});

						returnPromise = asyncMarker.myPromise;
					}

					if (!useTemporaryResetProperty) {
						delete entity['Reset_' + model];
					}

					if (!useTemporaryOldValueProperty) {
						delete entity['OldValueOf_' + model];
					}

					return returnPromise;
				}

				function asyncValidatePercentageValues(entity, value, model) {
					let returnPromise = $q.when(true);
					let hasQtoDetails = false;

					if (boqMainService.getServiceName() === 'salesWipBoqStructureService' || boqMainService.getServiceName() === 'salesBillingBoqStructureService') {
						hasQtoDetails = determineExistanceOfQtoDetails(entity);
						if (hasQtoDetails) {
							returnPromise = asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfQuantityIfQtoDetailsExist', 'boq.main.confirmChangeOfQuantityIfQtoDetailsExist', false, true);
							returnPromise = returnPromise.then(function (response) {
								if (response.apply) {
									return determineInconsistentSettingOfPercentageColumn(entity, model);
								} else {
									return response;
								}
							},
							function (response) {
								return response;
							}).then(function (response) {
								if (_.isBoolean(response) && response) {
									return asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfPercentageValue', 'boq.main.confirmChangeOfRecordingLevel', false, true);
								} else {
									return response;
								}
							});
						}
					}

					if ((!hasQtoDetails || boqMainService.getServiceName() === 'procurementPesBoqItemService') && determineInconsistentSettingOfPercentageColumn(entity, model)) {
						returnPromise = asyncValidateAskBeforeValidating(entity, value, model, 'boq.main.askChangeOfPercentageValue', 'boq.main.confirmChangeOfRecordingLevel', false, true);
					}

					return returnPromise;
				}

				var commonValServ = $injector.get('boqMainCommonFeaturesService');
				var validata = commonValServ.getDetailValidation(boqMainService);
				angular.extend(this, validata);
				var asyncVal = commonValServ.getAsyncDetailValidation(boqMainService);
				angular.extend(this, asyncVal);

				let additionalColumnsForPriceConditionCalc = [];
				if (boqMainService.getServiceName() === 'salesWipBoqStructureService'){
					additionalColumnsForPriceConditionCalc = ['TotalQuantity', 'QuantityTarget', 'CumulativePercentage', 'PercentageQuantity', 'ExSalesRejectedQuantity'];
				}

				commonValServ.additionalAsync(this, boqMainService, additionalColumnsForPriceConditionCalc);

				// We do this only once
				skipAsyncValidateRef = false;

				// region For Bulk Edit Validation
				/**
				 * Validate Prc Price Condition Fk For Bulk Config
				 * @param entity
				 * @param value
				 * @param model
				 * @param isFromPriceCondition
				 * @returns {*}
				 */
				this.validatePrcPriceConditionFkForBulkConfig = function validatePrcPriceConditionFkForBulkConfig(entity, value, model, isFromPriceCondition) {
					if (Object.prototype.hasOwnProperty.call(entity, 'PrcPriceconditionFk')) {
						entity.PrcPriceconditionFk = value;
					}
					let res = {valid: true, apply: true, error: '', error$tr$: ''};

					if (value) {
						if (entity[model] === value) {
							res.valid = false;
							res.error = model + ' has already exist';
						}
					}
					if (boqMainCommonService.isSurchargeItem(entity)) {
						res.valid = false;
						res.error = 'Surcharge Item can not change price condition';
					}

					if (res.valid) {
						entity[model] = value;
						boqMainService.markItemAsModified(entity);
						setBulkPriceConditionInformation(entity, value);
					} else if (!isFromPriceCondition) {
						res.valid = true;
					}
					return platformDataValidationService.finishValidation(res, entity, value, model, self, boqMainService);
				};

				/**
				 * Set Bulk Price Condition Information
				 * @param entity
				 * @param value
				 */
				function setBulkPriceConditionInformation(entity, value) {

					let headerService = boqMainService.parentService();
					let module = boqMainService.getModuleName();
					let projectFk = -1, headerId = -1, exchangeRate = 1;
					if (headerService) {
						if (module === 'boq.main') {
							projectFk = headerId = headerService.getSelectedProjectId();
						} else if (module === 'procurement.package') {
							headerId = headerService.getSelected().PackageFk;
							projectFk = headerService.getSelected().ProjectFk;
						} else if (module === 'procurement.quote.requisition') {
							headerId = headerService.getSelected().QtnHeaderFk;
							projectFk = headerService.getSelected().ProjectFk;
						} else if (module === 'procurement.pes') {
							headerId = $injector.get('procurementPesHeaderService').getSelected().Id;
							projectFk = $injector.get('procurementPesHeaderService').getSelected().ProjectFk;
						} else {
							headerId = headerService.getSelected().Id;
							projectFk = headerService.getSelected().ProjectFk;
						}
						if (headerService.getSelected()) {
							let headerEntity = headerService.getSelected();
							if (headerEntity.ExchangeRate) {
								exchangeRate = headerEntity.ExchangeRate;
							}
						}
					}

					let modState = $injector.get('platformModuleStateService').state(headerService ? headerService.getModule() : boqMainService.getModule());
					let parentElemState = headerService ? headerService.assertPath(modState.modifications, false, entity) : boqMainService.assertPath(modState.modifications, false, entity);
					let parentItemName = boqMainService.getItemName();
					let parentItem2Save = parentElemState[parentItemName + 'ToSave'];
					let boqItemInfo = null;
					if (module === 'procurement.requisition' || module === 'procurement.contract') {
						parentItem2Save = parentElemState.PrcBoqCompleteToSave ? parentElemState.PrcBoqCompleteToSave.BoqItemCompleteToSave : null;
					} else if (module === 'procurement.package') {
						if (parentElemState.PrcPackage2HeaderToSave) {
							let prcPackage2HeaderToSave = _.find(parentElemState.PrcPackage2HeaderToSave, {MainItemId: headerService.getSelected().Id});
							parentItem2Save = prcPackage2HeaderToSave && prcPackage2HeaderToSave.PrcBoqCompleteToSave ? prcPackage2HeaderToSave.PrcBoqCompleteToSave.BoqItemCompleteToSave : null;
						}
					} else if (module === 'procurement.quote') {
						if (parentElemState.QtnRequisitionToSave) {
							let qtnRequisitionToSave = _.find(parentElemState.QtnRequisitionToSave, {MainItemId: headerService.getSelected().Id});
							parentItem2Save = qtnRequisitionToSave && qtnRequisitionToSave.PrcBoqCompleteToSave ? qtnRequisitionToSave.PrcBoqCompleteToSave.BoqItemCompleteToSave : null;
						}
					} else if (module === 'procurement.pes') {
						if (parentElemState.PesBoqToSave) {
							let prcPackage2HeaderToSave = _.find(parentElemState.PesBoqToSave, {MainItemId: headerService.getSelected().Id});
							parentItem2Save = prcPackage2HeaderToSave ? prcPackage2HeaderToSave.BoqItemToSave : null;
						}
					} else if (module === 'boq.main' && !headerService) {
						boqItemInfo = parentItem2Save = parentElemState;
					}
					if (parentItem2Save) {
						boqItemInfo = boqItemInfo || _.find(parentItem2Save, {BoqItem: {Id: entity.Id}});
						if (boqItemInfo) {
							if (Object.prototype.hasOwnProperty.call(boqItemInfo, 'BulkEditPriceConditionToSave')) {
								if (!boqItemInfo.BulkEditPriceConditionToSave.MainItemIds.includes(entity.Id)) {
									boqItemInfo.BulkEditPriceConditionToSave.MainItemIds.push(entity.Id);
								}
							} else {
								boqItemInfo.BulkEditPriceConditionToSave = {
									MainItemIds: [entity.Id],
									PriceConditionFk: value,
									ExchangeRate: exchangeRate,
									HeaderName: module,
									HeaderId: headerId,
									ProjectFk: projectFk
								};
							}
							parentElemState.hasBulkEditPriceConditionUpdate = true;
						}
					}
				}
				// endregion
			};

			service.getInstance = function getInstance(boqMainService) {
				latestCreatedValidationService = new ValidationServiceProvider(boqMainService);
				return latestCreatedValidationService;
			};

			service.skipAsyncValidateReference = function skipAsyncValidateReference(skip) {
				skipAsyncValidateRef = skip;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}
	]);

})();
