/**
 * Created by lcn on 2019-07-04.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonGeneratePaymentScheduleController', ['$scope', '$injector', '$translate', 'procurementCommonGeneratePaymentScheduleValidationService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'platformModalService', 'params', '$http', 'basicsLookupdataLookupDescriptorService', 'moment',
		function ($scope, $injector, $translate, procurementCommonGeneratePaymentScheduleValidationService,
			platformRuntimeDataService, basicsLookupdataLookupDescriptorService, platformModalService, params, $http, lookupDescriptorService, moment) {

			// init current item.


			var lookUpItems = lookupDescriptorService.getData('TaxCode');
			var lookUpItem = lookUpItems[params.selectedLead.TaxCodeFk];
			var vatPercent = lookUpItem ? lookUpItem.VatPercent : 0;

			$scope.repeatOption = [
				{id: 1, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.weekly')},
				{id: 2, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.monthly')},
				{id: 3, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.quarterly')},
				{id: 4, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.userSpecified')}
			];
			var selectMultipleItems = (params.selectedLeads && params.selectedLeads.length > 1 && params.multipleSelection);
			var inPackageSelectMultiple = (selectMultipleItems && params.moduleName === 'procurement.package');
			var inContractSelectMultiple = (selectMultipleItems && params.moduleName === 'procurement.contract');
			$scope.occurenceDisable = true;
			$scope.currentItem = getInitValue();
			var validationService = procurementCommonGeneratePaymentScheduleValidationService.getValidationService({
				moduleName: params.moduleName, alltotal: params.alltotal, vatPercent: vatPercent
			});

			function getInitValue() {
				var selectedTotal = params.selectedtotal || {Id: 0, ValueNetOc: 0, GrossOc: 0};
				var defaultTotal = {
					Id: selectedTotal.Id,
					ValueNetOc: selectedTotal.ValueNetOc,
					GrossOc: selectedTotal.GrossOc,
				};

				if (params.moduleName === 'procurement.contract') {
					var mainAndChangeOrder = basicsLookupdataLookupDescriptorService.getData('ConMainAndChangeOrder');
					if (mainAndChangeOrder && mainAndChangeOrder['-1']) {
						defaultTotal = {
							Id: -1,
							ValueNetOc: mainAndChangeOrder['-1'].ValueNetOc,
							GrossOc: mainAndChangeOrder['-1'].GrossOc
						};
					}
				}

				let result = {
					ScurveFk: 0,
					CodeMask: '##',
					DescriptionMask: 'Payment-##',
					TotalCost: defaultTotal ? defaultTotal.ValueNetOc : null,
					TotalOcGross: defaultTotal ? defaultTotal.GrossOc : null,
					StartWork: params.selectedLead.ValidFrom || params.selectedLead.PlannedStart || null,
					EndWork: params.selectedLead.ValidTo || params.selectedLead.PlannedEnd || null,
					ExchangeRate: params.selectedLead.ExchangeRate,
					VatPercent: vatPercent,
					HeaderFk: params.selectedLead.PrcHeaderFk,
					IsDelay: false,
					OcPercent: 1,
					RadioType: '0',// 0: sCurve,1:userFrequence
					Repeat: '1',
					Occurence: 0
				};
				if (selectMultipleItems) {
					var ids = _.map(params.selectedLeads, function (p) {
						return p.Id;
					});
					ids.sort();
					result.Ids = ids;
					result.MultipleSelection = true;
					result.Placeholder = '***';
					result.MultipleTotalType = -1;
					result.Entities = params.selectedLeads;
				}
				return result;
			}

			$scope.config = {
				rt$readonly: function () {
					return _.gt($scope.currentItem.RadioType, '0');// >0
				}
			};

			$scope.radioOptionChanged = function () {
				$scope.repeatOptionChanged();

				var item = $scope.currentItem;
				if (_.gt(item.RadioType, '0')) {// >0
					item.IsDelay = false;
				} else {
					if (!selectMultipleItems) {
						platformRuntimeDataService.applyValidationResult(validationService.validateEndWork(item, item.EndWork, 'EndWork', true), item, 'EndWork');
					}
				}
			};

			$scope.repeatOptionChanged = function () {
				if ($scope.currentItem.Repeat === '4') {
					$scope.occurenceDisable = false;
					$scope.currentItem.Occurence = 1;
					$scope.occurenceChanged();
				} else {
					$scope.occurenceDisable = true;
					calculation();
				}
			};

			$scope.occurenceChanged = function () {
				var item = $scope.currentItem;
				if (_.gt(item.RadioType, '0')) {// >0
					if (!selectMultipleItems) {
						platformRuntimeDataService.applyValidationResult(validationService.validateEndWork(item, item.EndWork, 'EndWork'), item, 'EndWork');
					}
				}
			};

			function calculation() {
				const result = validationService.calculateOccurrence($scope.currentItem);

				if (!result) {
					$scope.currentItem.Occurence = null;
					return;
				}
				if (result.type === 'error') {
					platformRuntimeDataService.applyValidationResult(result.message, $scope.currentItem, 'EndWork');
				} else {
					validationService.removeError($scope.currentItem, 'EndWork');
				}
				$scope.currentItem.Occurence = result.occurence;
			}

			function ocPercent() {
				if ($scope.currentItem.TotalCost === 0 || $scope.currentItem.TotalOcGross === 0) {
					return 0;
				} else {
					return parseFloat($scope.currentItem.TotalOcGross / $scope.currentItem.TotalCost);
				}

			}

			$scope.steps = [{
				number: 0, title: 'procurement.common.wizard.generatePaymentSchedule.wizard', buttons: [{
					label: 'cloud.common.ok', action: goToOk, disable: function () {
						return !canToOk();
					}
				}, {
					label: 'cloud.common.cancel', action: close
				}]
			}, {
				number: 1, title: 'procurement.common.wizard.generatePaymentSchedule.succeed', buttons: [{
					label: 'basics.common.ok', action: success
				}]
			}];

			$scope.modalOptions = {
				headerText: $translate.instant('procurement.common.wizard.generatePaymentSchedule.wizard'),
				cancel: function () {
					$scope.$close(false);
				}
			};

			function goToOk() {
				$scope.isLoading = true;
				$scope.currentItem.OcPercent = ocPercent();

				var currentItem = angular.copy($scope.currentItem);
				currentItem.RadioType = _.toInteger(currentItem.RadioType);
				currentItem.Repeat = _.toInteger(currentItem.Repeat);
				if (params.moduleName === 'sales.contract') {
					currentItem.HeaderFk = params.selectedLead.Id;
					$http.post(globals.webApiBaseUrl + 'sales/contract/paymentschedule/generateByWizard', currentItem).then(function () {
						setCurrentStep(1);
						$scope.isLoading = false;
					}).catch(function () {
						$scope.isLoading = false;
					});
				} else {
					if (inPackageSelectMultiple || inContractSelectMultiple) {
						let items = [];
						currentItem.Entities = null;
						var promise;
						if (inPackageSelectMultiple) {
							let procurementPackageTotalDataService = $injector.get('procurementPackageTotalDataService');
							promise = procurementPackageTotalDataService.getSameTotalsFromPackages(currentItem.Ids);
						}
						else if (inContractSelectMultiple) {
							let contractTotalDataService = $injector.get('procurementContractTotalDataService');
							promise = contractTotalDataService.getSameTotalsFromContracts(currentItem.Ids, currentItem.Entities);
						}
						promise.then(function (totals) {
							if (totals && totals.length) {
								_.forEach(params.selectedLeads, function(s) {
									let i = _.clone(currentItem);
									let total = _.find(totals, {TotalKindFk: currentItem.MultipleTotalType, HeaderFk: s.Id});
									i.HeaderFk = s.PrcHeaderFk;
									i.TotalCost = total.ValueNetOc;
									i.TotalOcGross = total.GrossOc;
									i.StartWork = s.ValidFrom || s.PlannedStart || null;
									i.EndWork = s.ValidTo || s.PlannedEnd || null;
									items.push(i);
								});
								$http.post(globals.webApiBaseUrl + 'procurement/common/paymentchedule/saveentities', items).then(function () {
									setCurrentStep(1);
									$scope.isLoading = false;
								}).catch(function () {
									$scope.isLoading = false;
								});
							}
						});
					}
					else {
						$http.post(globals.webApiBaseUrl + 'procurement/common/paymentchedule/save', currentItem).then(function () {
							setCurrentStep(1);
							$scope.isLoading = false;
						}).catch(function () {
							$scope.isLoading = false;
						});
					}
				}
			}

			function canToOk() {
				var entity = $scope.currentItem;
				if (entity.__rt$data && entity.__rt$data.errors && (entity.__rt$data.errors['StartWork'] || entity.__rt$data.errors['EndWork'] || entity.__rt$data.errors['TotalCost'] || entity.__rt$data.errors['TotalOcGross'] || entity.__rt$data.errors['MultipleTotalType'])) {// jshint ignore:line
					return false;
				}
				var isScurveFk = _.eq(entity.RadioType, '0') && entity.ScurveFk;// =0
				var isUserFrequence = _.gt(entity.RadioType, '0') && entity.Occurence !== '' && !_.isNil(entity.Occurence);// >0
				return !!(entity.CodeMask && entity.DescriptionMask && entity.StartWork && entity.EndWork && (isScurveFk || isUserFrequence));

			}

			function close() {
				$scope.$close(false);
			}

			function success() {
				$scope.$close(true);
			}

			function setCurrentStep(value) {
				$scope.currentStep = angular.copy($scope.steps[value]);
			}

			let asyncalidateMultipleTotalType = validationService.getAsyncalidateMultipleTotalType(params.moduleName);
			function getTotalOcNetColumn() {
				if (!selectMultipleItems) {
					return {
						'rid': 'totalocnet',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet'),// 'type': 'decimal',
						'type': 'directive',
						'model': 'TotalCost',
						'validator': validationService.validateTotalCost,
						'directive': 'basics-common-total-cost-composite',
						'options': {
							'lookupDirective': params.moduleName === 'procurement.contract' ? 'contract-total-drop-down' :
								'package-total-drop-down', 'descriptionMember': 'ValueNetOc'
						}
					};
				}
				else {
					return {
						'rid': 'multipleTotalType',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet'),
						'type': 'directive',
						'model': 'MultipleTotalType',
						'asyncValidator': asyncalidateMultipleTotalType,
						'directive': 'prc-common-multiple-total-type-composite',
						'options': {
							'lookupDirective': params.moduleName === 'procurement.contract' ? 'contracts-total-drop-down' :
								'packages-total-drop-down'
						}
					};
				}
			}

			var formConfig = {
				'fid': 'paymentschedule', 'version': '1.0.0',     // if same version setting can be reused, otherwise discard settings
				'showGrouping': false, 'groups': [{
					'gid': 'basicData',
					'header$tr$': 'procurement.common.wizard.generatePaymentSchedule.wizard',
					'isOpen': true,
					'visible': true,
					'sortOrder': 1
				}], 'rows': [
					{
						'rid': 'codemask',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.codeMask'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.codeMask'),
						'type': 'description',
						'model': 'CodeMask',
						'maxLength': 16
					}, {
						'rid': 'descriptionmask',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.descriptionMask'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.descriptionMask'),
						'type': 'description',
						'model': 'DescriptionMask',
						'maxLength': 252
					},
					getTotalOcNetColumn(),
					{
						'rid': 'totalocgross',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcGross'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcGross'),
						'type': params.multipleSelection ? 'description' : 'money',
						'model': params.multipleSelection ? 'Placeholder' : 'TotalOcGross',
						'validator': params.multipleSelection ? undefined : validationService.validateTotalOcGross,
						'readonly': !!params.multipleSelection
					}, {
						'rid': 'startwork',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.startDate'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.startDate'),
						'type': params.multipleSelection ? 'description' : 'dateutc',
						'model': params.multipleSelection ? 'Placeholder' : 'StartWork',
						'validator': params.multipleSelection ? undefined : validationService.validateStartWork,
						'readonly': !!params.multipleSelection
					}, {
						'rid': 'endwork',
						'gid': 'basicData',
						'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.endDate'),
						'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.endDate'),
						'type': params.multipleSelection ? 'description' : 'dateutc',
						'model': params.multipleSelection ? 'Placeholder' : 'EndWork',
						'validator': params.multipleSelection ? undefined : validationService.validateEndWork,
						'readonly': !!params.multipleSelection
					}
				]
			};

			if (params.moduleName === 'sales.contract') {
				var deleteBtnIdx = _.findIndex(formConfig.rows, function (item) {
					return item.model === 'TotalCost';
				});
				var totalInSalesCon = {
					'rid': 'totalcost',
					'gid': 'basicData',
					'label$tr$': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet'),
					'label': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet'),
					'type': 'money',
					'model': 'TotalCost',
					'validator': validationService.validateTotalCostForSalesCon
				};
				formConfig.rows.splice(deleteBtnIdx, 1, totalInSalesCon);
			}

			$scope.formContainerOptions = {};
			$scope.formContainerOptions.formOptions = {
				configure: formConfig, showButtons: [], validationMethod: function () {
				}
			};

			setCurrentStep(0);

			if (inPackageSelectMultiple || inContractSelectMultiple) {
				if (params.moduleName === 'procurement.package') {
					let procurementPackageTotalDataService = $injector.get('procurementPackageTotalDataService');
					procurementPackageTotalDataService.getSameTotalsFromPackages($scope.currentItem.Ids).then(function (list) {
						if (list && list.length) {
							$scope.currentItem.MultipleTotalType = list[0].TotalKindFk;
						}
						asyncalidateMultipleTotalType($scope.currentItem, $scope.currentItem.MultipleTotalType, 'MultipleTotalType')
							.then(function (result) {
								platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'MultipleTotalType');
							});
					});
				}
				else {
					asyncalidateMultipleTotalType($scope.currentItem, $scope.currentItem.MultipleTotalType, 'MultipleTotalType')
						.then(function (result) {
							platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'MultipleTotalType');
						});
				}
			}

		}]);

	angular.module(moduleName).factory('procurementCommonGeneratePaymentScheduleValidationService', ['$q', '$translate', '$injector', 'platformRuntimeDataService', 'platformDataValidationService', 'moment', function ($q, $translate, $injector, platformRuntimeDataService, platformDataValidationService, moment) {

		function constructor(alltotal, vatPercent) {

			var service = {};

			service.removeError = function (entity, model) {
				if (entity.__rt$data && entity.__rt$data.errors) {
					if (model === 'EndWork' || model === 'StartWork') {
						delete entity.__rt$data.errors.EndWork;
						delete entity.__rt$data.errors.StartWork;
					} else {
						delete entity.__rt$data.errors[model];
					}
				}
			};

			function createErrorObject(transMsg, errorParam) {
				return {
					apply: true, valid: false, error: '...', error$tr$: transMsg, error$tr$param$: errorParam
				};
			}

			function toFormat(Date) {
				return moment.utc(Date).startOf('day');
			}

			function calculation(entity) {
				const result = service.calculateOccurrence(entity);
				if (!result) {
					return true;
				}
				if (result.type === OccurrenceType.ERROR) {
					return result.message;
				}
				if (result.type === OccurrenceType.REGULAR) {
					entity.Occurence = result.occurence;
				}
				return true;
			}

			// Frequency enumeration: represents the frequency type as string values.
			const Frequency = {
				WEEKLY: '1',
				MONTHLY: '2',
				QUARTERLY: '3',
				USER_SPECIFIED: '4'
			};

			// Error keys enumeration: used to generate error messages.
			const ErrorKeys = {
				INVALID_DURATION: 'procurement.common.wizard.generateDeliverySchedule.deliveryModifyInvalidDuration',
				OCCURENCE_ERROR: 'procurement.common.wizard.generateDeliverySchedule.deliveryModifyOccurenceByError'
			};

			// Occurrence types enumeration: represents the type of occurrence calculation result.
			const OccurrenceType = {
				REGULAR: 'regular',          // Normal occurrence calculation based on fixed frequency.
				USER_SPECIFIED: 'userSpecified', // Custom user-specified occurrence.
				ERROR: 'error'               // Indicates an error during calculation.
			};

			// Step map: maps frequency types to their corresponding moment.js time unit.
			const StepMap = {
				[Frequency.WEEKLY]: 'weeks',
				[Frequency.MONTHLY]: 'months',
				[Frequency.QUARTERLY]: 'quarters'
			};

			/**
			 * Determines if the duration between start and end is too short to satisfy the specified frequency.
			 *
			 * @param {Object} start - A moment.js object representing the start date.
			 * @param {Object} end - A moment.js object representing the end date.
			 * @param {string} repeat - The frequency type (from Frequency enum).
			 * @returns {boolean} - Returns true if the duration is less than one unit of the specified frequency.
			 */
			const isDurationTooShort = (start, end, repeat) => {
				const step = StepMap[repeat];
				if (!step) {
					return false;// Invalid frequency
				}
				const diff = end.diff(start, step, true);
				return diff < 1;
			};

			/**
			 * Calculates the occurrence of an entity based on its start/end dates and repeat frequency.
			 *
			 * For frequencies WEEKLY, MONTHLY, QUARTERLY, it increments the date by the corresponding step
			 * until the current date is not before the end date (comparing on day-level). The result is the number
			 * of occurrence nodes.
			 *
			 * For USER_SPECIFIED frequency, it calculates the duration in days.
			 *
			 * Returns an object with:
			 *    - type: (OccurrenceType) Type of the occurrence calculation result.
			 *    - occurence: The calculated number of nodes (or null if an error occurred).
			 *    - message: (Optional) The error message if a duration error is detected.
			 *
			 * @param {Object} entity - An object containing properties: StartWork, EndWork, Repeat, Occurence.
			 * @returns {Object|null} - The result object or null if dates are invalid.
			 */
			service.calculateOccurrence = function (entity) {
				// Convert entity dates to moment.js objects using toFormat().
				const start = toFormat(entity.StartWork);
				const end = toFormat(entity.EndWork);
				const repeat = entity.Repeat;

				// Validate the dates: must be valid and start must be before end.
				if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
					return null;
				}

				// Check if the duration between start and end is too short for the specified frequency.
				if (isDurationTooShort(start, end, repeat)) {
					return {
						type: OccurrenceType.ERROR,
						occurence: null,
						message: createErrorObject(ErrorKeys.INVALID_DURATION, {}, true)
					};
				}

				// Special handling for user-specified frequency.
				if (repeat === Frequency.USER_SPECIFIED) {
					// Calculate duration in days (rounded to an integer, then add 1).
					const duration = _.round(moment.duration(end.diff(start)).asDays(), 0) + 1;
					// If duration is positive but less than the expected occurrence value, return an error.
					if (duration > 0 && duration < entity.Occurence) {
						return {
							type: OccurrenceType.ERROR,
							occurence: null,
							message: createErrorObject(ErrorKeys.OCCURENCE_ERROR, {}, true)
						};
					}
					// Otherwise, return the user-specified type.
					return {
						type: OccurrenceType.USER_SPECIFIED,
						occurence: null
					};
				}

				// For regular frequencies, get the corresponding step unit from the StepMap.
				const step = StepMap[repeat];
				if (!step) {
					return null;
				}

				// Calculate difference based on the unit (day, week, month, etc.)
				const diff = end.diff(start, step, true);
				const count = Math.ceil(diff)+ 1;

				// Return a regular occurrence result.
				return {
					type: OccurrenceType.REGULAR,
					occurence: count
				};
			};

			service.validateStartWork = function (entity, value, model) {
				var result = platformDataValidationService.isMandatory(value, 'start date');
				if (!result.valid) {
					return result;
				}

				if (value && entity.EndWork) {
					if (Date.parse(entity.EndWork) <= Date.parse(value)) {
						return createErrorObject('cloud.common.Error_EndDateTooEarlier', {}, true);
					} else {
						service.removeError(entity, model);
					}
				}

				entity.StartWork = value;
				if (_.gt(entity.RadioType, '0')) {
					return calculation(entity);
				}
				return true;
			};

			service.validateEndWork = function (entity, value, model, clearError) {
				if (clearError) {
					service.removeError(entity, model);
				}
				var result = platformDataValidationService.isMandatory(value, 'end date');
				if (!result.valid) {
					return result;
				}

				if (entity.StartWork && value) {
					if (Date.parse(value) <= Date.parse(entity.StartWork)) {
						return createErrorObject('cloud.common.Error_EndDateTooEarlier', {}, true);
					} else {
						service.removeError(entity, model);
					}
				}

				entity.EndWork = value;
				if (_.gt(entity.RadioType, '0')) {
					return calculation(entity);
				}
				return true;
			};

			service.validateScurveFk = function (entity, value, model) {
				return platformDataValidationService.isMandatory(value, model);
			};

			service.validateTotalCost = function (entity, value, model, isInclude, grossOc) {
				if (value > 0 || value < 0) {
					if (isInclude && grossOc) {
						entity.TotalOcGross = grossOc;
					}
					if (isInclude === false) {
						entity.TotalOcGross = parseFloat((value * (1 + vatPercent / 100)).toFixed(2));
					}
					service.removeError(entity, model);
					return true;
				} else {
					return createErrorObject('procurement.common.wizard.generatePaymentSchedule.noZero', {}, true);
				}
			};

			service.getAsyncalidateMultipleTotalType = function (modName) {
				return function asyncalidateMultipleTotalType(entity, value) {
					if (value) {
						var getTotalsPromise, msg;
						var totalService;
						if (modName === 'procurement.package') {
							totalService = $injector.get('procurementPackageTotalDataService');
							getTotalsPromise = totalService.getSameTotalsFromPackages(entity.Ids);
						}
						else {
							totalService = $injector.get('procurementContractTotalDataService');
							getTotalsPromise = totalService.getSameTotalsFromContracts(entity.Ids, entity.Entities);
						}
						return getTotalsPromise.then(function (list) {
							if (list && list.length) {
								let sameKindTotals = _.filter(list, {TotalKindFk: value});
								if (sameKindTotals && sameKindTotals.length) {
									let codeStr = '';
									_.forEach(sameKindTotals, function (s) {
										if (!s.ValueNetOc) {
											let leadEntity = _.find(entity.Entities, {Id: s.HeaderFk});
											if (leadEntity) {
												codeStr += (codeStr === '') ? leadEntity.Code : (',' + leadEntity.Code);
											}
										}
									});
									if (codeStr === '') {
										return true;
									}
									else {
										msg = $translate.instant('procurement.common.wizard.generatePaymentSchedule.noZero');
										msg += ', ' + $translate.instant('procurement.common.wizard.generatePaymentSchedule.valueInPackagesIsZero',
											{
												'code' : codeStr
											});
										return {
											apply: true, valid: false, error: msg, error$tr$param$: {}
										};
									}
								}
								return true;
							}
							else {
								msg = $translate.instant('procurement.common.wizard.generatePaymentSchedule.mustSelectSourceOfTotalOcNet',
									{
										'totalOcNet': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet')
									});
								return {
									apply: true, valid: false, error: msg, error$tr$param$: {}
								};
							}
						});
					}
					else {
						let defer = $q.defer();
						let msg = $translate.instant('procurement.common.wizard.generatePaymentSchedule.mustSelectSourceOfTotalOcNet',
							{
								'totalOcNet': $translate.instant('procurement.common.wizard.generatePaymentSchedule.totalOcNet')
							});
						defer.resolve({
							apply: true, valid: false, error: msg, error$tr$param$: {}
						});
						return defer.promise;
					}
				};
			};

			service.validateTotalCostForSalesCon = function (entity, value, model) {
				if (value > 0 || value < 0) {
					entity.TotalOcGross = parseFloat((value * (1 + vatPercent / 100)).toFixed(2));
					service.removeError(entity, model);
					return true;
				} else {
					return createErrorObject('procurement.common.wizard.generatePaymentSchedule.noZero', {}, true);
				}
			};

			service.validateTotalOcGross = function (entity, value, model) {
				if (value > 0 || value < 0) {
					service.removeError(entity, model);
					return true;
				} else {
					return createErrorObject('procurement.common.wizard.generatePaymentSchedule.noZero', {}, true);
				}
			};

			return service;
		}

		var validationServiceCache = {};

		function getValidationService(option) {

			var moduleName = option.moduleName;
			if (!Object.prototype.hasOwnProperty.call(validationServiceCache, moduleName)) {
				validationServiceCache[moduleName] = constructor.apply(null, [option.alltotal, option.vatPercent]);
			}
			return validationServiceCache[moduleName];
		}

		return {
			getValidationService: getValidationService
		};
	}]);

})(angular);