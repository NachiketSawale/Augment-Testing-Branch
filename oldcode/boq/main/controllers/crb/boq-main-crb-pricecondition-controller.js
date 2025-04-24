(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');

	angularModule.value('conditionTypes',
		{
			none: 0,
			discount: 1,
			vat: 2,
			tradediscount: 3,
			retention: 4,
			other: 5
		});

	angularModule.value('calculationTypes',
		{
			none: 0,
			percentage: 1,
			lumpsum: 2
		});

	angularModule.factory('boqMainCrbPriceconditionService', ['$http', 'platformGridControllerService', 'platformDialogService', 'boqMainCrbService', 'boqMainCrbPriceconditionUiService', 'boqMainCrbPriceconditionDataService', 'boqMainCrbPriceconditionValidationService',
		function ($http, platformGridControllerService, platformDialogService, boqMainCrbService, boqMainCrbPriceconditionUiService, boqMainCrbPriceconditionDataService, boqMainCrbPriceconditionValidationService) {
			var dataService;

			return {
				initController: function (scope, boqMainService) {
					var currentBoqItemBeforeCalculation;

					function calculate() {
						var rootService = boqMainService;
						while (_.isObject(rootService.parentService())) {
							rootService = rootService.parentService();
						}

						rootService.update().then(function (response) { // A possible change of the module headers payment term must be saved
							if (response) {
								dataService.updatePaymentTerm().then(function (response) {
									if (response) {
										rootService.update().then(function (response) { // A possible change of anything must be saved
											if (response) {
												$http.post(globals.webApiBaseUrl + 'boq/main/crbpricecondition/' + 'calculate?boqHeaderId=' + boqMainService.getRootBoqItem().BoqHeaderFk)
													.then(function (response) {
														if (_.isObject(response.data = JSON.parse(response.data))) {
															if (_.isEmpty(response.data.ErrorText)) {
																currentBoqItemBeforeCalculation = boqMainService.getSelected();
																boqMainService.load();

																var generalsService = _.find(rootService.getChildServices(), function (cs) {
																	return cs.getServiceName() === 'salesCommonGeneralsService';
																});
																if (generalsService) {
																	generalsService.load();
																}
															} else {
																platformDialogService.showErrorBox(response.data.ErrorText, 'cloud.common.errorMessage');
															}
														}
													});
											}
										});
									}
								});
							}
						});
					}

					function onBoqItemsLoaded() {
						if (currentBoqItemBeforeCalculation) {
							boqMainService.setSelected(currentBoqItemBeforeCalculation);
							currentBoqItemBeforeCalculation = undefined;
						}
					}

					dataService = boqMainCrbPriceconditionDataService.getServiceContainer(boqMainService).service;
					var gridConfig = {
						columns: [],
						cellChangeCallBack: function (arg) {
							dataService.propertyChanged(arg.item, arg.grid.getColumns()[arg.cell].field);
						}
					};

					platformGridControllerService.initListController(scope, boqMainCrbPriceconditionUiService, dataService, boqMainCrbPriceconditionValidationService, gridConfig);

					boqMainCrbService.tryDisableContainer(scope, boqMainService, false);
					scope.addTools([{
						id: 'calculate',
						caption: 'basics.billingschema.dirtyRecalculate',
						type: 'item',
						iconClass: 'control-icons ico-recalculate',
						permission: '#c',
						fn: calculate,
						disabled: function () {
							return !boqMainService.isCrbBoq() || !_.some(dataService.getList());
						}
					}]);

					scope.dataService = dataService;
					boqMainCrbPriceconditionValidationService.setDataService(dataService);

					boqMainService.registerListLoaded(onBoqItemsLoaded);
					boqMainService.registerSelectionChanged(dataService.onCurrentBoqChanged);
					dataService.registerEntityDeleted(boqMainCrbPriceconditionValidationService.priceconditionDeleted);
					scope.$on('$destroy', function () {
						boqMainService.unregisterListLoaded(onBoqItemsLoaded);
						boqMainService.unregisterSelectionChanged(dataService.onCurrentBoqChanged);
						dataService.unregisterEntityDeleted(boqMainCrbPriceconditionValidationService.priceconditionDeleted);
					});
				}
			};
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionUiService', ['platformUIStandardConfigService', 'platformContextService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'boqMainTranslationService',
		function (PlatformUIStandardConfigService, platformContextService, platformSchemaService, basicsLookupdataConfigGenerator, boqMainTranslationService) {
			function formatConditionAmount(row, cell, value, column, priceCondition) {
				return priceCondition.Level === '00' ? '' : '<div class="flex-box flex-align-center"><span class="flex-element text-right">' +
					(priceCondition.IsConsidered ? '' : '(') +
					priceCondition.ConditionAmount.toLocaleString(platformContextService.getCulture(), {minimumFractionDigits: 2, maximumFractionDigits: 2}) +
					(priceCondition.IsConsidered ? '' : ')') +
					'</span></div>';
			}

			function overloadCrbPriceconditionFk() {
				var ret;

				ret = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'boqMainCrbPriceconditionDataService', valMember: 'Id', dispMember: 'Level', gridLess: true, additionalColumns: false});
				ret.required = true; // any other way to delete the clear button (showClearButton/required) does not work

				return ret;
			}

			function overloadPaymentTermFk() {
				var ret;

				ret = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm');
				ret.readonly = true;

				return ret;
			}

			var domainSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'CrbPriceconditionDto'});
			var gridLayout =
				{
					fid: 'boq.main.crb.pricecondition.grid.config',
					addValidationAutomatically: true,
					enableColumnSort: false,
					groups: [{
						'gid': 'basicData',
						'attributes': ['level', 'crbpriceconditionfk', 'crbpriceconditiontypefk', 'description', 'isconsidered', 'calculationtype', 'referenceamount', 'taxcodefk', 'conditionpercentage', 'conditionamount', 'calculationamount', 'paymenttermfk']
					},
					{'gid': 'entityHistory', 'isHistory': true}],
					overloads:
						{
							crbpriceconditionfk: overloadCrbPriceconditionFk(),
							referenceamount: {readonly: true},
							taxcodefk: {
								grid:
									{
										formatter: 'lookup',
										formatterOptions: {lookupType: 'TaxCode', displayMember: 'Code'},
										editor: 'lookup',
										editorOptions: {directive: 'basics-master-data-context-tax-code-lookup'}
									}
							},
							conditionamount: {grid: {formatter: formatConditionAmount}},
							calculationamount: {readonly: true},
							paymenttermfk: overloadPaymentTermFk(),
							crbpriceconditiontypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
								{
									dataServiceName: 'boqMainCrbPriceconditionConditionTypeLookupDataService',
									valMember: 'Id',
									dispMember: 'Code',
									gridLess: true,
									additionalColumns: false
								}),
							calculationtype: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
								{
									dataServiceName: 'boqMainCrbPriceconditionCalculationTypeLookupDataService',
									valMember: 'Id',
									dispMember: 'Code',
									gridLess: true,
									additionalColumns: false
								})
						}
				};

			// Disables the sorting
			_.forEach(Object.values(gridLayout.groups[0].attributes), function (column) {
				if (!_.isObject(gridLayout.overloads[column])) {
					gridLayout.overloads[column] = {};
				}
				if (!_.isObject(gridLayout.overloads[column].grid)) {
					gridLayout.overloads[column].grid = {};
				}
				gridLayout.overloads[column].grid.sortable = false;
			});

			return new PlatformUIStandardConfigService(gridLayout, domainSchema.properties, boqMainTranslationService);
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionValidationService', ['$q', 'platformDataValidationService', 'platformRuntimeDataService', 'conditionTypes',
		function ($q, platformValidationService, platformRuntimeDataService, conditionTypes) {
			var dataService;
			var validationService = {};

			function isValid(result) {
				return result === true || result && result.valid;
			}

			function finishValidation(result, object, propValue, propName, asyncMarker) {
				if (!isValid(result)) {
					result = platformValidationService.createErrorObject(result);
				}

				platformRuntimeDataService.applyValidationResult(result, object, propName);
				return platformValidationService.finishAsyncValidation(result, object, propValue, propName, asyncMarker, validationService, dataService);
			}

			function checkLevelIsUnique(priceCondition) {
				var result = platformValidationService.isUniqueAndMandatory(dataService.getList(), 'Level', priceCondition.Level, priceCondition.Id, {object: 'Level'.toLowerCase()});
				return finishValidation(result, priceCondition, priceCondition.Level, 'Level');
			}

			function checkCrbPriceconditionFkIsLower(checkedPricecondition) {
				var result;
				var referencedPriceCondition;

				// Must refer to a lower level!
				result = true;
				referencedPriceCondition = dataService.getPricecondition(checkedPricecondition.CrbPriceconditionFk);
				if (_.isObject(referencedPriceCondition) && checkedPricecondition.Level < referencedPriceCondition.Level) {
					result = 'boq.main.errorCrbPriceconditionLevel';
				}

				return finishValidation(result, checkedPricecondition, checkedPricecondition.CrbPriceconditionFk, 'CrbPriceconditionFk');
			}

			function checkCrbPriceconditionFkForVatReference(checkedPricecondition) {
				var firstVatPricecondition;
				var vatReferencedPricecondition;

				firstVatPricecondition = _.find(dataService.getList(), ['CrbPriceconditionTypeFk', conditionTypes.vat]);
				vatReferencedPricecondition = _.findLast(dataService.getList(), function (pc) {
					return pc.Level < (_.isObject(firstVatPricecondition) ? firstVatPricecondition.Level : 100);
				});

				// VAT lines must always refer to the last lines before VAT!
				var result = true;
				if (checkedPricecondition.CrbPriceconditionTypeFk === conditionTypes.vat && checkedPricecondition.CrbPriceconditionFk !== vatReferencedPricecondition.Id) {
					result = 'boq.main.errorCrbPriceconditionVatReference';
				}

				return finishValidation(result, checkedPricecondition, checkedPricecondition.CrbPriceconditionFk, 'CrbPriceconditionFk');
			}

			function checkConditionTypeForVatSequence(checkedPricecondition) {
				var result;
				var previousPricecondition;
				var previousVatPricecondition;

				// VAT lines must always be in direct sequence!
				result = true;
				if (checkedPricecondition.CrbPriceconditionTypeFk === conditionTypes.vat) {
					previousPricecondition = _.findLast(dataService.getList(), function (pc) {
						return pc.Level < checkedPricecondition.Level;
					});
					previousVatPricecondition = _.findLast(dataService.getList(), function (pc) {
						return pc.Level < checkedPricecondition.Level && pc.CrbPriceconditionTypeFk === conditionTypes.vat;
					});

					if (_.isObject(previousVatPricecondition) && previousVatPricecondition !== previousPricecondition) {
						result = 'boq.main.errorCrbPriceconditionVatSequence';
					}
				}

				return finishValidation(result, checkedPricecondition, checkedPricecondition.CrbPriceconditionTypeFk, 'CrbPriceconditionTypeFk');
			}

			function checkConditionTypeRestrictionForTradeDiscount(checkedPricecondition) {
				var result;

				// Not more than 1 Skonto allowed
				result = true;
				if (checkedPricecondition.CrbPriceconditionTypeFk === conditionTypes.tradediscount && (1 < _.filter(dataService.getList(), {CrbPriceconditionTypeFk: conditionTypes.tradediscount}).length)) {
					result = 'boq.main.errorCrbPriceconditionTooManyTradeDiscounts';
				}

				return finishValidation(result, checkedPricecondition, checkedPricecondition.CrbPriceconditionTypeFk, 'CrbPriceconditionTypeFk');
			}

			function checkTaxCodeFk(checkedPricecondition) {
				// The 'TaxCodeFk' only may exist once and cannot be 'null'!
				var ret = null;
				var result = true;

				if (_.some(dataService.getList(), function (pc) {
					return pc !== checkedPricecondition &&
						pc.CrbPriceconditionTypeFk === conditionTypes.vat && checkedPricecondition.CrbPriceconditionTypeFk === conditionTypes.vat &&
						pc.TaxCodeFk === checkedPricecondition.TaxCodeFk;
				})) {
					result = 'boq.main.errorCrbPriceconditionVatUnique';
				} else if (checkedPricecondition.CrbPriceconditionTypeFk === conditionTypes.vat) {
					ret = platformValidationService.validateMandatory(checkedPricecondition, checkedPricecondition.TaxCodeFk, 'TaxCodeFk', validationService, dataService);
				}

				if (ret === null) {
					ret = finishValidation(result, checkedPricecondition, checkedPricecondition.TaxCodeFk, 'TaxCodeFk');
				}

				return ret;
			}

			function check(changedPricecondition, changedPropertyChecks, additionalChecks) {
				var result = true;

				_.forEach(dataService.getList(), function (checkedPricecondition) {
					var result2 = true;

					_.forEach(changedPropertyChecks, function (checkFunc) {
						if (isValid(result2)) {
							result2 = checkFunc(checkedPricecondition);
						}

						if (changedPricecondition === checkedPricecondition) {
							result = result2;
						}
					});

					_.forEach(additionalChecks, function (checkFunc) {
						if (isValid(result2)) {
							result2 = checkFunc(checkedPricecondition);
						}
					});
				});

				return result;
			}

			/* function asyncCheck(checkFunc, changedPricecondition, propValue, propName) { // bre: Not really necessary to be 'async' but a helpful sample
				var asyncMarker;

				changedPricecondition[propName] = propValue;

				asyncMarker = platformValidationService.registerAsyncCall(changedPricecondition, propName, propValue, dataService);
				asyncMarker.myPromise = $q.when(checkFunc())
												  .then(function(result) {
														return finishValidation(result, changedPricecondition, propValue, propName, asyncMarker);
													});

				return asyncMarker.myPromise;
			} */

			validationService.setDataService = function (dataServiceParam) {
				dataService = dataServiceParam;
			};

			validationService.priceconditionDeleted = function () {
				check(null, null, [checkLevelIsUnique, checkConditionTypeForVatSequence, checkConditionTypeRestrictionForTradeDiscount, checkCrbPriceconditionFkForVatReference, checkTaxCodeFk]);
			};

			validationService.validateLevel = function (changedPricecondition, level) {
				var result;

				changedPricecondition.Level = level;
				result = check(changedPricecondition, [checkLevelIsUnique], [checkCrbPriceconditionFkIsLower, checkConditionTypeForVatSequence, checkCrbPriceconditionFkForVatReference]);

				return result;
			};

			validationService.validateCrbPriceconditionFk = function (changedPricecondition, crbPriceconditionFk) {
				var result;

				changedPricecondition.CrbPriceconditionFk = crbPriceconditionFk;
				result = check(changedPricecondition, [checkCrbPriceconditionFkIsLower, checkCrbPriceconditionFkForVatReference], null);

				return result;
			};

			validationService.validateDescription = function (changedPricecondition, description) {
				return platformValidationService.validateMandatory(changedPricecondition, description, 'Description', validationService, dataService);
			};

			validationService.validateCrbPriceconditionTypeFk = function (changedPricecondition, conditionType) {
				var result;

				changedPricecondition.CrbPriceconditionTypeFk = conditionType;

				result = check(changedPricecondition, [checkConditionTypeForVatSequence, checkConditionTypeRestrictionForTradeDiscount], [checkCrbPriceconditionFkForVatReference, checkTaxCodeFk]);

				return result;
			};

			validationService.validateTaxCodeFk = function (changedPricecondition, taxCodeFk) {
				var result;

				changedPricecondition.TaxCodeFk = taxCodeFk;
				result = check(changedPricecondition, [checkTaxCodeFk]);

				return result;
			};

			return validationService;
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionConditionTypeLookupDataService', ['$q', 'platformLookupDataServiceFactory', 'platformContextService', 'conditionTypes',
		function ($q, platformLookupDataServiceFactory, platformContextService, conditionTypes) {
			var culture = platformContextService.getCulture();
			var codes = _.startsWith(culture, 'fr') ? ['Brut', 'Rabais', 'TVA', 'Escompte', 'Retenue', 'Divers'] :
				_.startsWith(culture, 'it') ? ['Lordo', 'Riduzione', 'IVA', 'Sconto', 'Ritenzione', 'Altri'] :
					['Brutto', 'Rabatt', 'MWST', 'Skonto', 'R\u00fcckbehalt', '\u00dcbrige'];
			var lookupConditionTypes = [{Id: 0, Code: codes[0]}, {Id: 1, Code: codes[1]}, {Id: 2, Code: codes[2]}, {Id: 3, Code: codes[3]}, {Id: 4, Code: codes[4]}, {Id: 5, Code: codes[5]}];
			var service = platformLookupDataServiceFactory.createInstance({}).service;

			service.getLookupData = function () {
				return $q.when(_.filter(lookupConditionTypes, function (conditionType) {
					return conditionType.Id !== conditionTypes.none;
				}));
			};

			service.getItemById = function (id) {
				return _.find(lookupConditionTypes, ['Id', id]);
			};

			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			return service;
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionCalculationTypeLookupDataService', ['$q', 'platformLookupDataServiceFactory', 'platformContextService', 'calculationTypes',
		function ($q, platformLookupDataServiceFactory, platformContextService, calculationTypes) {
			var culture = platformContextService.getCulture();
			var lookupCalculationTypes = [{Id: 0, Code: ''}, {Id: 1, Code: '%'}, {Id: 2, Code: _.startsWith(culture, 'fr') ? 'MF' : _.startsWith(culture, 'it') ? 'F' : 'P'}];
			var service = platformLookupDataServiceFactory.createInstance({}).service;

			service.getLookupData = function () {
				return $q.when(_.filter(lookupCalculationTypes, function (calculationType) {
					return calculationType.Id !== calculationTypes.none;
				}));
			};

			service.getItemById = function (id) {
				return _.find(lookupCalculationTypes, ['Id', id]);
			};

			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			return service;
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionDataService', ['$q', '$http', 'platformDataServiceFactory', 'platformRuntimeDataService', 'platformDialogService', 'basicsCommonMandatoryProcessor', 'basicsCostGroupType', 'boqMainCrbPriceconditionScopeDataService', 'conditionTypes', 'calculationTypes',
		function ($q, $http, platformDataServiceFactory, platformRuntimeDataService, platformDialogService, basicsCommonMandatoryProcessor, basicsCostGroupType,
			boqMainCrbPriceconditionScopeDataService, conditionTypes, calculationTypes) {
			var serviceContainer;
			var boqMainService;
			var crbCostgrpCatAssigns;
			var baseRoute = globals.webApiBaseUrl + 'boq/main/crbpricecondition/';

			function getLastPricecondition() {
				var allPriceConditions = serviceContainer.service.getList();
				return _.isEmpty(allPriceConditions) ? null : _.maxBy(allPriceConditions, 'Level');
			}

			function is0Level(priceCondition) {
				return priceCondition.Level === '00';
			}

			function updateCellStates(priceCondition) {
				platformRuntimeDataService.readonly(priceCondition, [{field: 'IsConsidered', readonly: priceCondition.CrbPriceconditionTypeFk === conditionTypes.vat},
					{field: 'TaxCodeFk', readonly: priceCondition.CrbPriceconditionTypeFk !== conditionTypes.vat},
					{field: 'CalculationType', readonly: priceCondition.CrbPriceconditionTypeFk === conditionTypes.vat},
					{field: 'ConditionAmount', readonly: priceCondition.CalculationType === calculationTypes.percentage},
					{field: 'ConditionPercentage', readonly: priceCondition.CalculationType !== calculationTypes.percentage || [conditionTypes.vat, conditionTypes.tradediscount].includes(priceCondition.CrbPriceconditionTypeFk)}]);
				platformRuntimeDataService.hideContent(priceCondition, ['ConditionPercentage'], priceCondition.CalculationType !== calculationTypes.percentage);
			}

			return {
				getServiceContainer: function (boqMainServiceParam) {
					if (boqMainService !== boqMainServiceParam) {
						serviceContainer = null;
						boqMainService = boqMainServiceParam;
					}

					// Creates the service
					if (!_.isObject(serviceContainer)) {
						var serviceOptions =
							{
								flatLeafItem:
									{
										serviceName: 'boqMainCrbPriceconditionDataService', // used among others by the validation service
										entityRole: {node: {itemName: 'CrbPricecondition', parentService: boqMainService}},
										actions:
											{
												delete: true, create: 'flat',
												canCreateCallBackFunc: function () {
													var lastPriceCondition = getLastPricecondition();
													return boqMainService.isCrbBoq() && serviceContainer.data.doNotLoadOnSelectionChange && (!_.isObject(lastPriceCondition) || lastPriceCondition.Level !== '99'); // doNotLoadOnSelectionChange: then the priceconditions are loaded
												}
											},
										httpRead:
											{
												route: baseRoute, endRead: 'list',
												initReadData: function (readData) {
													_.forEach(serviceContainer.data.childServices, function (childService) {
														childService.clearCache();
													});
													serviceContainer.data.updateSelectionchangeBehaviour(true);
													var rootBoqItem = boqMainService.getRootBoqItem();
													if (_.isObject(rootBoqItem)) {
														readData.filter = '?boqHeaderId=' + rootBoqItem.BoqHeaderFk;
													}
												}
											},
										httpCreate: {route: baseRoute, endCreate: 'create'},
										dataProcessor: [{
											processItem: function (priceCondition) {
												if (is0Level(priceCondition)) {
													platformRuntimeDataService.readonly(priceCondition, true);
													platformRuntimeDataService.hideContent(priceCondition, ['CrbPriceconditionFk', 'Description', 'IsConsidered', 'ReferenceAmount', 'CalculationType', 'ConditionAmount'], true);
												}

												updateCellStates(priceCondition);
											}
										}],
										presenter: {
											list: {
												incorporateDataRead: function (readData, data) {
													var rootBoqItem = boqMainService.getRootBoqItem();
													if (boqMainService.isCrbBoq() && rootBoqItem) {
														$http.get(globals.webApiBaseUrl + 'boq/main/crb/costgroupcat/' + 'getassigns?boqHeaderId=' + rootBoqItem.BoqHeaderFk)
															.then(function (response) {
																crbCostgrpCatAssigns = response.data;
															}
															);
													}

													return serviceContainer.data.handleReadSucceeded(readData, data);
												},
												handleCreateSucceeded: function (newPriceCondition) {
													var lastPriceCondition = getLastPricecondition();

													// Sets the defaults
													newPriceCondition.BoqHeaderFk = boqMainService.getSelected().BoqHeaderFk;
													newPriceCondition.Level = _.padStart(_.isObject(lastPriceCondition) ? (parseInt(lastPriceCondition.Level) + 1).toString() : '0', 2, '0');
													newPriceCondition.CrbPriceconditionFk = is0Level(newPriceCondition) ? null : lastPriceCondition.Id;
													newPriceCondition.Description = is0Level(newPriceCondition) ? 'Gross' : '';
													newPriceCondition.CrbPriceconditionTypeFk = is0Level(newPriceCondition) ? conditionTypes.none : conditionTypes.other;
													newPriceCondition.CalculationType = is0Level(newPriceCondition) ? calculationTypes.none : calculationTypes.percentage;
													newPriceCondition.IsConsidered = true;

													// There is no must to have any price condition. But if the first one is created (level 00) the next level is created too.
													if (!_.isObject(lastPriceCondition)) {
														serviceContainer.service.createItem();
													}
													serviceContainer.data.markItemAsModified(newPriceCondition, serviceContainer.data); // the programmatically created item must be 'registered'

													return newPriceCondition;
												}
											}
										}
									}
							};
						serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

						serviceContainer.service.onCurrentBoqChanged = function (e, args) {
							if (e === null && args === null) { // 'args' contains the current BOQ item
								var priceconditionScopeDataService;
								serviceContainer.data.updateSelectionchangeBehaviour(false);
								priceconditionScopeDataService = boqMainCrbPriceconditionScopeDataService.getServiceContainer(serviceContainer.service);
								priceconditionScopeDataService.data.clearContent(priceconditionScopeDataService.data);
							}
						};

						serviceContainer.service.getCostGroupType = function (code) {
							var crbCostgrpCatAssign = _.find(crbCostgrpCatAssigns, {'Code': code});
							return crbCostgrpCatAssign.IsProjectCatalog ? basicsCostGroupType.projectCostGroup : basicsCostGroupType.licCostGroup;
						};

						serviceContainer.service.getCostgroupCatId = function (code) {
							var crbCostgrpCatAssign = _.find(crbCostgrpCatAssigns, {'Code': code});
							return crbCostgrpCatAssign ? crbCostgrpCatAssign.BasCostgroupCatFk : undefined;
						};

						serviceContainer.service.getProjectId = function () {
							return boqMainService.getSelectedProjectId();
						};

						// Enables the usage of 'boqMainService' as parent service
						serviceContainer.data.usesCache = false;
						serviceContainer.data.clearContentBase = serviceContainer.data.clearContent;
						serviceContainer.data.updateSelectionchangeBehaviour = function (doNotLoadOnSelectionChange) {
							if (!doNotLoadOnSelectionChange) {
								serviceContainer.data.clearContentBase(serviceContainer.data);
							}

							serviceContainer.data.forceChildServiceUnload    = true;
							serviceContainer.data.doNotLoadOnSelectionChange = doNotLoadOnSelectionChange;
							serviceContainer.data.clearContent               = doNotLoadOnSelectionChange ? function(){} : serviceContainer.data.clearContentBase;
						};

						// Ensures to have always a sorted list
						serviceContainer.data.getList = function () {
							return _.orderBy(serviceContainer.data.itemList, 'Level');
						};

						// Restricts the deletion by considering property 'CrbPriceconditionFk' and triggers the calculation
						serviceContainer.service.deleteSelection = function deleteSelection() {
							var ret;
							var selectedPriceConditions = serviceContainer.service.getSelectedEntities();
							var remainingPriceConditions = _.filter(serviceContainer.service.getList(), function (pc) {
								return !_.includes(selectedPriceConditions, pc);
							});

							if (_.some(remainingPriceConditions, function (pc) {
								return pc.CrbPriceconditionFk !== null && !_.isObject(_.find(remainingPriceConditions, ['Id', pc.CrbPriceconditionFk]));
							})) {
								platformDialogService.showInfoBox('boq.main.errorCrbPriceconditionDeleted');
								selectedPriceConditions = [];
							}

							ret = serviceContainer.service.deleteEntities(selectedPriceConditions);

							return ret;
						};

						serviceContainer.service.updatePaymentTerm = function (priceConditionWithPaymentTerm) {
							if (!priceConditionWithPaymentTerm) {
								priceConditionWithPaymentTerm = _.find(serviceContainer.service.getList(), ['CrbPriceconditionTypeFk', conditionTypes.tradediscount]);
								if (priceConditionWithPaymentTerm) {
									serviceContainer.data.markItemAsModified(priceConditionWithPaymentTerm, serviceContainer.data);
								} else {
									return $q.when(false);
								}
							}

							priceConditionWithPaymentTerm.ConditionPercentage = 0;

							return $http.get(baseRoute + 'paymentterm?boqHeaderId=' + boqMainService.getRootBoqItem().BoqHeaderFk)
								.then(function (response) {
									if (response.data) {
										priceConditionWithPaymentTerm.PaymentTermFk = response.data.Id;
										priceConditionWithPaymentTerm.PaymentTerm = response.data.DiscountDays;
										priceConditionWithPaymentTerm.ConditionPercentage = response.data.DiscountPercent;
										serviceContainer.service.gridRefresh();
									} else {
										platformDialogService.showErrorBox('boq.main.errorCrbMissingPaymentTerm', 'cloud.common.errorMessage');
									}

									return response.data;
								});
						};

						serviceContainer.service.propertyChanged = function (priceCondition, propertyName) {
							switch (propertyName) {
								case 'CrbPriceconditionTypeFk': {
									updateCellStates(priceCondition);

									priceCondition.TaxCodeFk = null;
									priceCondition.PaymentTermFk = null;
									priceCondition.PaymentTerm = null;

									if (priceCondition.CrbPriceconditionTypeFk === conditionTypes.vat) {
										priceCondition.IsConsidered = true;
										if (priceCondition.CalculationType !== calculationTypes.percentage) {
											priceCondition.CalculationType = calculationTypes.percentage;
											priceCondition.ConditionAmount = 0;
										}
									} else if (priceCondition.CrbPriceconditionTypeFk === conditionTypes.tradediscount) {
										serviceContainer.service.updatePaymentTerm(priceCondition);
									}
								}
									break;
								case 'CalculationType': {
									updateCellStates(priceCondition);
									priceCondition.ConditionPercentage = 0;
								}
									break;
								case 'TaxCodeFk': {
									if (priceCondition.TaxCodeFk !== null) {
										priceCondition.ConditionPercentage = 0;
										$http.get(globals.webApiBaseUrl + 'basics/masterdata/taxcode/vatpercent?taxCodeId=' + priceCondition.TaxCodeFk)
											.then(function (response) {
												if (response.data !== null) {
													priceCondition.ConditionPercentage = response.data;
													serviceContainer.service.gridRefresh();
												}
											});
									}
								}
									break;
							}
						};

						serviceContainer.service.getPricecondition = function (id) {
							return _.find(serviceContainer.service.getList(), ['Id', id]);
						};

						serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(
							{
								typeName: 'CrbPriceconditionDto',
								moduleSubModule: 'Boq.Main',
								validationService: 'boqMainCrbPriceconditionValidationService',
								mustValidateFields: true
							});
					}

					return serviceContainer;
				},

				// Lookup functions for property 'CrbPriceconditionFk'
				getLookupData: function () {
					var currentPriceCondition = serviceContainer.service.getSelected();
					var filteredList = _.filter(serviceContainer.service.getList(), function (priceCondition) {
						return priceCondition.Level < currentPriceCondition.Level;
					});

					return $q.when(filteredList);
				},
				resetCache: function () {
					return $q.when([]);
				},
				getItemById: function (id) {
					return serviceContainer.service.getItemById(id);
				},
				getItemByIdAsync: function (id) {
					return $q.when(serviceContainer.service.getItemById(id));
				}
			};
		}
	]);

	// #region pricecondition scope

	angularModule.controller('boqMainCrbPriceconditionScopeController', ['$scope', 'boqMainCrbPriceconditionScopeService',
		function ($scope, boqMainCrbPriceconditionScopeService) {
			boqMainCrbPriceconditionScopeService.initController($scope);
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionScopeService', ['platformGridControllerService', 'platformGridAPI', 'boqMainCrbPriceconditionScopeUiService', 'boqMainCrbPriceconditionScopeValidationService', 'boqMainCrbPriceconditionScopeDataService',
		function (platformGridControllerService, platformGridAPI, boqMainCrbPriceconditionScopeUiService, boqMainCrbPriceconditionScopeValidationService, boqMainCrbPriceconditionScopeDataService) {
			var dataService;

			return {
				initController: function (scope) {
					scope.gridId = 'F107C60282E84D6792284B6ECCBE60F5';

					dataService = boqMainCrbPriceconditionScopeDataService.getServiceContainer(scope.dataService).service;
					platformGridControllerService.initListController(scope, boqMainCrbPriceconditionScopeUiService, dataService, boqMainCrbPriceconditionScopeValidationService, {skipToolbarCreation: true});
					boqMainCrbPriceconditionScopeUiService.setDataService(dataService.parentService());
					boqMainCrbPriceconditionScopeValidationService.setDataService(dataService);

					scope.$parent.addTools([
						{
							id: 'crbNewScope',
							caption: 'boq.main.crbNewPriceconditionScope',
							iconClass: 'tlb-icons ico-db-new',
							type: 'item',
							permission: '#c',
							disabled: function () {
								return !dataService.canCreate();
							},
							fn: function () {
								platformGridAPI.grids.commitAllEdits();
								return dataService.createItem();
							}
						},
						{
							id: 'crbDelScope',
							caption: 'boq.main.crbDelPriceconditionScope',
							iconClass: 'tlb-icons ico-db-delete',
							type: 'item',
							permission: '#d',
							disabled: function () {
								return !dataService.canDelete();
							},
							fn: function () {
								return dataService.deleteSelection();
							}
						}]);
					scope.$parent.tools.update();

					dataService.registerEntityDeleted(boqMainCrbPriceconditionScopeValidationService.priceconditionScopeDeleted);
					scope.$on('$destroy', function () {
						dataService.unregisterEntityDeleted(boqMainCrbPriceconditionScopeValidationService.priceconditionScopeDeleted);
					});
				}
			};
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionScopeUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'basicsCostGroupLookupConfigService', 'boqMainTranslationService',
		function (PlatformUIStandardConfigService, platformSchemaService, basicsCostGroupLookupConfigService, boqMainTranslationService) {
			var uiService;
			var dataService;

			function getOverloadItem(code) {
				return basicsCostGroupLookupConfigService.provideProjectConfig(
					{
						costGroupTypeGetter: function () {
							return dataService.getCostGroupType(code);
						},
						catalogIdGetter: function () {
							return dataService.getCostgroupCatId(code);
						},
						projectIdGetter: function () {
							return dataService.getProjectId();
						}
					});
			}

			var domainSchema = platformSchemaService.getSchemaFromCache({moduleSubModule: 'Boq.Main', typeName: 'CrbPriceconditionScopeDto'});
			var gridLayout =
				{
					fid: 'boq.main.crb.priceconditionscope.grid.config',
					addValidationAutomatically: true,
					groups: [{'gid': 'basicData', 'attributes': ['costgroupkagfk', 'costgroupoglfk']},
						{'gid': 'entityHistory', 'isHistory': true}],
					overloads:
						{
							costgroupkagfk: getOverloadItem('001'),
							costgroupoglfk: getOverloadItem('002')
						}
				};

			uiService = new PlatformUIStandardConfigService(gridLayout, domainSchema.properties, boqMainTranslationService);
			uiService.setDataService = function (dataServiceParam) {
				dataService = dataServiceParam;
			};

			return uiService;
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionScopeValidationService', ['platformDataValidationService', 'platformRuntimeDataService',
		function (platformValidationService, platformRuntimeDataService) {
			var dataService;
			var validationService = {};

			function finishValidation(equalScopes, aScope, propValue, propName) {
				var result = (equalScopes.length > 1 && _.includes(equalScopes, aScope)) ? platformValidationService.createErrorObject('boq.main.errorCrbPriceconditionScopeUnique') : true;
				platformRuntimeDataService.applyValidationResult(result, aScope, propName);
				return platformValidationService.finishAsyncValidation(result, aScope, propValue, propName, null, validationService, dataService);
			}

			function checkIsUnique(changedScope, propValue, propName) {
				var allScopes = dataService.getList();
				var equalScopes = [];

				if (_.isObject(changedScope)) {
					changedScope[propName] = propValue;
				}

				_.forEach(allScopes, function (aScope1) {
					_.forEach(allScopes, function (aScope2) {
						if (aScope1 !== aScope2 && !_.includes(equalScopes, aScope1) && aScope1.CostgroupKagFk === aScope2.CostgroupKagFk && aScope1.CostgroupOglFk === aScope2.CostgroupOglFk) {
							equalScopes.push(aScope1);
						}
					});
				});

				_.forEach(Object.values(allScopes), function (aScope) {
					finishValidation(equalScopes, aScope, aScope.CostgroupKagFk, 'CostgroupKagFk');
					finishValidation(equalScopes, aScope, aScope.CostgroupOglFk, 'CostgroupOglFk');
				});

				return _.isObject(changedScope) ? finishValidation(equalScopes, changedScope, propValue, propName) : true;
			}

			validationService.validateCostgroupKagFk = function (changedPriceconditionScope, propValue, propName) {
				return checkIsUnique(changedPriceconditionScope, propValue, propName);
			};
			validationService.validateCostgroupOglFk = function (changedPriceconditionScope, propValue, propName) {
				return checkIsUnique(changedPriceconditionScope, propValue, propName);
			};
			validationService.priceconditionScopeDeleted = function () {
				checkIsUnique();
			};

			validationService.setDataService = function (dataServiceParam) {
				dataService = dataServiceParam;
			};

			return validationService;
		}
	]);

	angularModule.factory('boqMainCrbPriceconditionScopeDataService', ['platformDataServiceFactory', 'platformRuntimeDataService', 'basicsCommonMandatoryProcessor', 'conditionTypes',
		function (platformDataServiceFactory, platformRuntimeDataService, basicsCommonMandatoryProcessor, conditionTypes) {
			var serviceContainer;
			var priceconditionDataService;
			var baseRoute = globals.webApiBaseUrl + 'boq/main/crbpricecondition/';

			return {
				getServiceContainer: function (boqMainCrbPriceconditionDataService) {
					if (priceconditionDataService !== boqMainCrbPriceconditionDataService) {
						serviceContainer = null;
						priceconditionDataService = boqMainCrbPriceconditionDataService;
					}

					// Creates the service
					if (!_.isObject(serviceContainer)) {
						var serviceOptions =
							{
								flatLeafItem:
									{
										serviceName: 'boqMainCrbPriceconditionScopeDataService', // used among others by the validation service
										entityRole: {leaf: {itemName: 'CrbPriceconditionScope', parentService: priceconditionDataService}},
										actions:
											{
												delete: true, create: 'flat',
												canCreateCallBackFunc: function () {
													var currentPricecondition = priceconditionDataService.getSelected();
													return _.isObject(currentPricecondition) && currentPricecondition.Level !== '00' && currentPricecondition.CrbPriceconditionTypeFk !== conditionTypes.tradediscount;
												}
											},
										httpRead:
											{
												route: baseRoute, endRead: 'scopes',
												initReadData: function (readData) {
													readData.filter = '?priceconditionId=' + priceconditionDataService.getSelected().Id;
												}
											},
										httpCreate: {route: baseRoute, endCreate: 'createscope'},
										dataProcessor: [{
											processItem: function (priceconditionScope) {
												platformRuntimeDataService.readonly(priceconditionScope, [{field: 'CostgroupKagFk', readonly: !priceconditionDataService.getCostgroupCatId('001')},
													{field: 'CostgroupOglFk', readonly: !priceconditionDataService.getCostgroupCatId('002')}]);
											}
										}],
										presenter: {
											list: {
												handleCreateSucceeded: function (newPriceconditionScope) {
													newPriceconditionScope.CrbPriceconditionFk = priceconditionDataService.getSelected().Id;
													return newPriceconditionScope;
												}
											}
										}
									}
							};
						serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

						serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(
							{
								typeName: 'CrbPriceconditionScopeDto',
								moduleSubModule: 'Boq.Main',
								validationService: 'boqMainCrbPriceconditionScopeValidationService',
								mustValidateFields: true
							});
					}

					return serviceContainer;
				}
			};
		}
	]);

	// #endregion

})();
