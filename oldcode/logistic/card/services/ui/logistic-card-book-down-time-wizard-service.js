(function (angular) {
	/* global globals */
	'use strict';

	angular.module('logistic.card').factory('logisticCardBookDownTimeWizardService', ['_', '$http', '$translate', '$injector', '$q', 'moment', 'platformModalService', 'platformTranslateService', 'platformModalFormConfigService', 'logisticCardDataService',
		'basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator', 'platformRuntimeDataService', 'platformDataValidationService', 'platformContextService',

		function (_, $http, $translate, $injector, $q, moment, platformModalService, platformTranslateService, platformModalFormConfigService, logisticCardDataService,
			basicsCommonChangeStatusService, basicsLookupdataConfigGenerator, platformRuntimeDataService, platformDataValidationService, platformContextService) {

			var service = {};
			var isDefaultForWOT = true;
			var arrowIcon = ' &#10148; ';
			var isCodeUniqueFlagAsync = true;
			var isCodeUniqueFlagSync = true;
			var modalCreateConfig = null;
			var startOfDowntimeDispatch = null;
			var endOfDowntimeDispatch = null;
			var isPlantLocationFound = true;
			var promise1 = null;
			var promise2 = null;
			var promise3 = null;
			service.bookDowntime = function bookDowntime() {

				var title = $translate.instant('logistic.card.bookDownTimeWizard.bookDowntimeTitle');
				var jobCard = logisticCardDataService.getSelected();
				var isValid = validateJobCard(jobCard, title);
				if (isValid) {
					$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/create').then(function (response) {
						if (response && response.data) {
							startOfDowntimeDispatch = response.data;
							$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/create').then(function (response) {
								if (response && response.data) {
									endOfDowntimeDispatch = response.data;
									modalCreateConfig = {
										title: title,
										dataItem: {
											// GUI binding properties => Dispatch1 = startOfDowntimeDispatch and Dispatch2 = endOfDowntimeDispatch
											Dispatch1RubricCategoryFk: startOfDowntimeDispatch.RubricCategoryFk,
											Dispatch1Code: startOfDowntimeDispatch.Code,
											Dispatch1Job1Fk: null,
											Dispatch1Job2Fk: jobCard.JobFk,
											Dispatch1Description: jobCard.Description,
											Dispatch1WorkOperationTypeFk: jobCard.WorkOperationTypeFk,

											Dispatch2RubricCategoryFk: endOfDowntimeDispatch.RubricCategoryFk,
											Dispatch2Code: endOfDowntimeDispatch.Code,
											Dispatch2Job1Fk: jobCard.JobFk,
											Dispatch2Job2Fk: null,
											Dispatch2Description: jobCard.Description,
											Dispatch2WorkOperationTypeFk: null,
										},

										formConfiguration: {
											version: '1.0.0',
											showGrouping: false,
											groups: [
												{
													gid: 'baseGroup',
												}
											],
											rows: [
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Start of Downtime Dispatch Note Information:',
													label$tr$: 'logistic.card.bookDownTimeWizard.startOfDowntimeDispatch',
													sortOrder: 1
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													model: 'Dispatch1RubricCategoryFk',
													required: true,
													sortOrder: 2,
													additionalColumns: false,
													label$tr$: 'cloud.common.entityBasRubricCategoryFk',
													label: 'Rubric Category',
													validator: validateSelectedRubricCatForDispatch1,
													type: 'directive',
													directive: 'basics-lookupdata-lookup-composite',
													options: {
														lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
														descriptionMember: 'Description',
														lookupOptions: {
															filterKey: 'logistic-dispatching-rubric-category-lookup-filter',
															showClearButton: true
														}
													},
													formatter: 'lookup',
													formatterOptions: {
														lookupType: 'RubricCategoryByRubricAndCompany',
														displayMember: 'Description'
													}
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Code',
													required: true,
													label$tr$: 'logistic.card.bookDownTimeWizard.downTimeCode',
													model: 'Dispatch1Code',
													type: 'code',
													sortOrder: 3,
													asyncValidator: isCodeUniqueAsync,
													validator: isCodeUniqueSync,
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Description',
													label$tr$: 'logistic.card.bookDownTimeWizard.downTimeDescription',
													type: 'description',
													options: {
														showClearButton: true,
													},
													model: 'Dispatch1Description',
													readonly: false,
													sortOrder: 4
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Performing Job',
													label$tr$: 'logistic.dispatching.performingJob',
													type: 'directive',
													directive: 'logistic-job-paging-lookup',
													readOnly: true,
													options: {
														showClearButton: false,
													},
													model: 'Dispatch1Job1Fk',
													readonly: true,
													sortOrder: 5
												},

												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Receiving Job',
													label$tr$: 'logistic.dispatching.receivingJob',
													type: 'directive',
													directive: 'logistic-job-paging-lookup',
													readOnly: true,
													options: {
														showClearButton: false,
													},
													model: 'Dispatch1Job2Fk',
													readonly: true,
													sortOrder: 6
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'End of Downtime Dispatch Note Information:',
													label$tr$: 'logistic.card.bookDownTimeWizard.endOfDowntimeDispatch',
													sortOrder: 7
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													model: 'Dispatch2RubricCategoryFk',
													sortOrder: 8,
													additionalColumns: false,
													label$tr$: 'cloud.common.entityBasRubricCategoryFk',
													label: 'Rubric Category',
													validator: validateSelectedRubricCatForDispatch2,
													type: 'directive',
													directive: 'basics-lookupdata-lookup-composite',
													options: {
														lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
														descriptionMember: 'Description',
														lookupOptions: {
															filterKey: 'logistic-dispatching-rubric-category-lookup-filter',
															showClearButton: true
														}
													},
													formatter: 'lookup',
													formatterOptions: {
														lookupType: 'RubricCategoryByRubricAndCompany',
														displayMember: 'Description'
													}
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Code',
													required: true,
													label$tr$: 'logistic.card.bookDownTimeWizard.downTimeCode',
													model: 'Dispatch2Code',
													type: 'code',
													sortOrder: 9,
													asyncValidator: isCodeUniqueAsync,
													validator: isCodeUniqueSync,
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Description',
													label$tr$: 'logistic.card.bookDownTimeWizard.downTimeDescription',
													type: 'description',
													options: {
														showClearButton: true,
													},
													model: 'Dispatch2Description',
													readonly: false,
													sortOrder: 10
												},
												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Performing Job',
													label$tr$: 'logistic.dispatching.performingJob',
													type: 'directive',
													directive: 'logistic-job-paging-lookup',
													readOnly: true,
													options: {
														showClearButton: false,
													},
													model: 'Dispatch2Job1Fk',
													readonly: true,
													sortOrder: 11
												},

												{
													gid: 'baseGroup',
													rid: 'group',
													label: 'Receiving Job',
													label$tr$: 'logistic.dispatching.receivingJob',
													type: 'directive',
													directive: 'logistic-job-paging-lookup',
													options: {
														showClearButton: false,
													},
													model: 'Dispatch2Job2Fk',
													readonly: true,
													sortOrder: 12
												},
											]
										},

										// action for OK button
										handleOK: function handleOK() {
											initDataFromGUI(modalCreateConfig.dataItem);
											var data = {
												JobCardFk: jobCard.Id,
												ActualStart: jobCard.ActualStart,
												ActualEndFinish: jobCard.ActualFinish,
												PlantFk: jobCard.PlantFk,
												PlantCode: $injector.get('resourceEquipmentPlantLookupDataService').getItemById(jobCard.PlantFk, {lookupType: 'resourceEquipmentPlantLookupDataService'}).Code,
												WorkOperation1TypeFk: jobCard.WorkOperationTypeFk,
												WorkOperation2TypeFk: modalCreateConfig.dataItem.Dispatch2WorkOperationTypeFk,
												WorkOperationTypeDefaultFk: modalCreateConfig.WorkOperationTypeDefault,
												ProcurementStructureFk: modalCreateConfig.ProcurementStructureFk,


												DispatchHeader: [startOfDowntimeDispatch, endOfDowntimeDispatch]
											};

											$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/bookdowntimewizard', data).then(function (response) {
												if (response && response.data) {
													var infoString = '';
													var number = 2;
													_.forEach(response.data, function (datas) {
														infoString += '<br />' + ` &#1012${number}; ` + datas.DispatchHeader[0].Code;
														number++;
													});

													var modalOptions = {
														headerText: $translate.instant(title),
														bodyText: $translate.instant('logistic.card.bookDownTimeWizard.infoCreatedSuccessful') + infoString,
														iconClass: 'ico-info',
														disableOkButton: false
													};
													platformModalService.showDialog(modalOptions);
												}
											});
										},
										dialogOptions: {
											disableOkButton: function () {
												return validationCheckForBookDownTime(modalCreateConfig);
											}
										},
									};
									evaluatePlantByCurrentPlantLocation(jobCard.ActualStart, jobCard.PlantFk, title).then(function (response) {
										if (response) {

											modalCreateConfig.dataItem.Dispatch1Job1Fk = response.JobFk;
											modalCreateConfig.dataItem.Dispatch2Job2Fk = response.JobFk;
											modalCreateConfig.dataItem.Dispatch2WorkOperationTypeFk = response.WorkOperationTypeFk;
										}
									});

									getDefaultWorkOperationTypeByContext(title).then(function (response) {
										modalCreateConfig.WorkOperationTypeDefault = response.Id;
									});

									setCodeByRubricCat(modalCreateConfig.dataItem);

									getProcurmentStructureFkByPlant(jobCard).then(function (response) {
										modalCreateConfig.ProcurementStructureFk = response.data.ProcurementStructureFk;
									});

									platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
									$q.all([promise1, promise2, promise3]).then(function () {
										if (isPlantLocationFound && isDefaultForWOT) {
											platformModalFormConfigService.showDialog(modalCreateConfig);
										}
									});
								}
							});
						}
					});

				}
			};

			function validateJobCard(jobcard, title) {
				// Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: '',
					iconClass: 'ico-info',
					disableOkButton: false
				};
				var isValid = true;
				var isCurrentSelection = true;

				if (!jobcard) {
					modalOptions.bodyText += arrowIcon + $translate.instant('cloud.common.noCurrentSelection');
					isValid = false;
					isCurrentSelection = false;
					platformModalService.showDialog(modalOptions);
				}
				if (!jobcard.PlantFk && isCurrentSelection) {
					modalOptions.bodyText += arrowIcon + $translate.instant('logistic.card.bookDownTimeWizard.infoNoPlantInJobCard');
					isValid = false;
				}
				if (!jobcard.ActualStart && isCurrentSelection) {
					modalOptions.bodyText += '<br />' + arrowIcon + $translate.instant('logistic.card.bookDownTimeWizard.infoNoActualStartDateInJobCard');
					isValid = false;
				}
				if (!jobcard.ActualFinish && isCurrentSelection) {
					modalOptions.bodyText += '<br />' + arrowIcon + $translate.instant('logistic.card.bookDownTimeWizard.infoNoActualFinishDateInJobCard');
					isValid = false;
				}
				if (!jobcard.WorkOperationTypeFk && isCurrentSelection) {
					modalOptions.bodyText += '<br />' + arrowIcon + $translate.instant('logistic.card.bookDownTimeWizard.infoNoWOTInJobCard');
					isValid = false;
				}
				if (!isValid && isCurrentSelection) {
					platformModalService.showDialog(modalOptions);
				}
				return isValid;
			}

			function initDataFromGUI(dataItem) {
				startOfDowntimeDispatch.RubricCategoryFk = dataItem.Dispatch1RubricCategoryFk;
				startOfDowntimeDispatch.Code = dataItem.Dispatch1Code;
				startOfDowntimeDispatch.Job1Fk = dataItem.Dispatch1Job1Fk;
				startOfDowntimeDispatch.Job2Fk = dataItem.Dispatch1Job2Fk;
				startOfDowntimeDispatch.Description = dataItem.Dispatch1Description;
				endOfDowntimeDispatch.RubricCategoryFk = dataItem.Dispatch2RubricCategoryFk;
				endOfDowntimeDispatch.Code = dataItem.Dispatch2Code;
				endOfDowntimeDispatch.Job1Fk = dataItem.Dispatch2Job1Fk;
				endOfDowntimeDispatch.Job2Fk = dataItem.Dispatch2Job2Fk;
				endOfDowntimeDispatch.Description = dataItem.Dispatch2Description;
				endOfDowntimeDispatch.Code = dataItem.Dispatch2Code;
			}

			function validationCheckForBookDownTime(modalCreateConfig) {
				var result = true;
				var dataItem = null;
				if (modalCreateConfig) {
					dataItem = modalCreateConfig.dataItem;
					if (modalCreateConfig.dataItem && dataItem.Dispatch1RubricCategoryFk && dataItem.Dispatch1Code && dataItem.Dispatch1Job1Fk && dataItem.Dispatch1Job2Fk && dataItem.Dispatch1Description &&
						dataItem.Dispatch2RubricCategoryFk && dataItem.Dispatch2Code && dataItem.Dispatch2Job1Fk && dataItem.Dispatch2Job2Fk && dataItem.Dispatch2Description &&
						isCodeUniqueFlagAsync && isCodeUniqueFlagSync) {
						result = false;
					}
				}
				return result;
			}

			function evaluatePlantByCurrentPlantLocation(date, plantFk, title) {
				var dateString = moment(date).format('YYYY-MM-DD');
				promise1 = $http.get(globals.webApiBaseUrl + 'logistic/job/plantallocation/filterbyclosestdate', {
					params: {
						date: dateString,
						plantFk: plantFk
					}
				}).then(function (response) {
					if (response.data) {
						isPlantLocationFound = true;
						return response.data;
					} else {
						var modalOptions = {
							headerText: $translate.instant(title),
							bodyText: arrowIcon + $translate.instant('logistic.card.bookDownTimeWizard.infoNoLocatedPlantFoundInJobCard'),
							iconClass: 'ico-info',
							disableOkButton: false
						};
						platformModalService.showDialog(modalOptions);
						isPlantLocationFound = false;
					}
				});
				return promise1;
			}

			function getProcurmentStructureFkByPlant(jobCard) {
				var plantId = {Id: jobCard.PlantFk};
				promise3 = ($http.post(globals.webApiBaseUrl + 'resource/equipment/plant/getbyid', plantId)
					.then(function (response) {
						return response;
					}));

				return promise3;
			}

			function getDefaultWorkOperationTypeByContext(title) {
				var context = platformContextService.getContext();
				promise2 = $http.get(globals.webApiBaseUrl + 'resource/wot/workoperationtype/getdefaultbycontext', {
					params: {
						contextFk: context.clientId,
					}
				}).then(function (response) {
					if (response.data) {
						isDefaultForWOT = true;
						return response.data;
					}
					else {
						isDefaultForWOT = false;
						var modalOptions = {
							headerText: $translate.instant(title),
							bodyText: arrowIcon + $translate.instant('logistic.card.bookDownTimeWizard.infoDefineDefaultForWOT'),
							iconClass: 'ico-info',
							disableOkButton: false
						};
						platformModalService.showDialog(modalOptions);
					}
				});
				return promise2;
			}

			function isCodeUniqueSync(entity, value, model) {
				var isValid = true;
				if (model.includes('1')) {
					if (value === entity.Dispatch2Code) {
						isValid = false;
					}

				}
				if (model.includes('2')) {
					if (value === entity.Dispatch1Code) {
						isValid = false;
					}
				}
				if (!isValid) {
					isCodeUniqueFlagSync = isValid;
					return platformDataValidationService.finishValidation({
						apply: true,
						valid: isValid,
						error$tr$: 'cloud.common.uniqueValueErrorMessage',
						error$tr$param: {object: model.toLowerCase()}
					}, entity, value, model, logisticCardDataService, logisticCardDataService);
				} else {
					isCodeUniqueFlagSync = isValid;
					return platformDataValidationService.finishValidation(isValid, entity, value, model, logisticCardDataService, logisticCardDataService);
				}
			}

			function isCodeUniqueAsync(entity, value, model) {
				if (isCodeUniqueFlagSync) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticCardDataService);
					asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'logistic/dispatching/header/isCodeUnique' + '?code=' + value).then(function (response) {
						if (!response.data) {
							setFlagIsCodeUnique(entity, model, false);
							return platformDataValidationService.finishAsyncValidation({
								valid: false,
								apply: true,
								error: '...',
								error$tr$: 'cloud.common.uniqueValueErrorMessage',
								error$tr$param: {object: model.toLowerCase()}
							}, entity, value, model, asyncMarker, service, logisticCardDataService);
						} else {
							setFlagIsCodeUnique(entity, model, true);
							return platformDataValidationService.finishValidation(true, entity, value, model, logisticCardDataService, logisticCardDataService);
						}
					});
					return asyncMarker.myPromise;
				}
				return $q.when();
			}

			function setFlagIsCodeUnique(entity, model, flag) {
				isCodeUniqueFlagAsync = flag;
			}

			function setCodeByRubricCat(entity) {
				var value = entity.Dispatch1RubricCategoryFk;
				var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'Dispatch1Code',
						readonly: true
					}, {field: 'Dispatch2Code', readonly: true}]);
					entity.Dispatch1Code = infoService.provideNumberDefaultText(value, entity.Dispatch1Code);
					entity.Dispatch2Code = infoService.provideNumberDefaultText(value, entity.Dispatch2Code);
				}
			}

			function validateSelectedRubricCatForDispatch1(entity, value, model) {

				if (entity.Dispatch1RubricCategoryFk !== value || entity.Version === 0) {
					var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
					if (infoService.hasToGenerateForRubricCategory(value)) {
						platformRuntimeDataService.readonly(entity, [{field: 'Dispatch1Code', readonly: true}]);
						entity.Dispatch1Code = infoService.provideNumberDefaultText(value, entity.Dispatch1Code);
					} else {
						entity.Dispatch1Code = '';
						platformRuntimeDataService.readonly(entity, [{field: 'Dispatch1Code', readonly: false}]);
					}
					platformDataValidationService.validateMandatory(entity, entity.Dispatch1Code, 'Dispatch1Code', service, logisticCardDataService);
					return platformDataValidationService.finishValidation(!_.isNil(entity.Dispatch1RubricCategoryFk), entity, value, model, service, logisticCardDataService);
				}
			}

			function validateSelectedRubricCatForDispatch2(entity, value, model) {

				if (entity.Dispatch2RubricCategoryFk !== value || entity.Version === 0) {
					var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
					if (infoService.hasToGenerateForRubricCategory(value)) {
						platformRuntimeDataService.readonly(entity, [{field: 'Dispatch2Code', readonly: true}]);
						entity.Dispatch2Code = infoService.provideNumberDefaultText(value, entity.Dispatch2Code);
					} else {
						entity.Dispatch2Code = '';
						platformRuntimeDataService.readonly(entity, [{field: 'Dispatch2Code', readonly: false}]);
					}
					platformDataValidationService.validateMandatory(entity, entity.Dispatch2Code, 'Dispatch2Code', service, logisticCardDataService);
					return platformDataValidationService.finishValidation(!_.isNil(entity.Dispatch2RubricCategoryFk), entity, value, model, service, logisticCardDataService);
				}
			}

			return service;
		}

	]);
})(angular);


