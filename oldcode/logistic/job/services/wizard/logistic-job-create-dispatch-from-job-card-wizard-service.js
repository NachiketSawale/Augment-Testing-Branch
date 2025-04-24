(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'logistic.job';
	angular.module(moduleName).service('logisticJobCreateDispatchFromJobCardWizardService', LogisticJobCreateDispatchFromJobCardWizardService);

	LogisticJobCreateDispatchFromJobCardWizardService.$inject = ['_', 'logisticJobDataService', 'basicsCommonChangeStatusService', '$translate', '$http',
		'platformModalService', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
		'platformModalFormConfigService', 'platformSidebarWizardCommonTasksService', '$q', '$injector',
		'logisticJobPlantLocationDataService', 'logisticJobAdjustAllocationDialogService', 'platformLayoutHelperService', 'platformRuntimeDataService', 'platformDataValidationService'];

	function LogisticJobCreateDispatchFromJobCardWizardService(_, logisticJobDataService, basicsCommonChangeStatusService, $translate, $http,
		platformModalService, basicsLookupdataConfigGenerator, platformTranslateService,
		platformModalFormConfigService, platformSidebarWizardCommonTasksService, $q, $injector,
		logisticJobPlantLocationDataService, logisticJobAdjustAllocationDialogService,
		platformLayoutHelperService, platformRuntimeDataService, platformDataValidationService) {
		var service = {};

		var arrowIcon = ' &#10148; ';
		var arrowIconTo = ' &#10149; ';
		var isCodeUniqueFlagAsync = true;
		var isCodeUniqueFlagSync = true;
		var isValid = false;
		var promiseIsReadyForDispatch;
		var JobCardStatusFk = null;
		var selectedCards = [];
		var isRequestIsActive = false;
		var formerSelectedCard = null;
		var title = $translate.instant('logistic.job.createDispatchNotesWizard.title');

		service.createDispatchNoteFromJobCard = function createDispatchNoteFromJobCard() {

			var selectedJobs = logisticJobDataService.getSelectedEntities();
			validateJobs(selectedJobs, title);

			$q.all([promiseIsReadyForDispatch]).then(function () {
				if (isValid) {
					var modalCreateConfig = {
						title: title,
						dataItem: {
							jobCardFk: null,
							DispatchRubricCategoryFk: null,
							DispatchCode: null,
						},
						formConfiguration: {
							fid: 'logistic.job.wizardCreate',
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup'
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'jobCard',
									label: 'Job Card',
									label$tr$: 'logistic.card.cardListTitle',
									model: 'jobCardFk',
									required: true,
									sortOrder: 1,
									type: 'directive',
									directive: 'logistic-card-dialog-lookup',
									options: {
										showClearButton: true,
										additionalFilters: [{
											projectFk: 'ProjectFk',
											projectFkReadOnly: true,

											jobFk: 'Id',
											jobFkReadOnly: true,

											statusFk: 'JobCardStatusFk',
											statusFkReadOnly: true,
											statusFkVisible: false,

											getAdditionalEntity: function () {
												var selectedJob = $injector.get('logisticJobDataService').getSelected();
												if (!selectedJob) {
													selectedJob = {
														'ProjectFk': null,
														'Id': null
													};
												}
												// add additional JobCardStatus property to selected Job
												selectedJob.JobCardStatusFk = JobCardStatusFk;
												return selectedJob;
											},
										}],
									},
								},
								{
									gid: 'baseGroup',
									rid: 'group',
									model: 'DispatchRubricCategoryFk',
									sortOrder: 2,
									label$tr$: 'cloud.common.entityBasRubricCategoryFk',
									label: 'Rubric Category',
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'dispatch-nodes-rubric-category-lookup-filter',
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
									model: 'DispatchCode',
									type: 'code',
									sortOrder: 3,
									asyncValidator: isCodeUniqueAsync,
									validator: null,
								},

							]
						},
						handleOK: function handleOK(result) {
							selectedCards.push(result.data.jobCardFk);
							var data = {
								RubricCategoryId: result.data.DispatchRubricCategoryFk,
								JobCardIds: [result.data.jobCardFk],
								Code: result.data.DispatchCode
							};
							$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/createdispatchingnotesfromjobcardwizard', data).then(function (response) {
								if (response && response.data && response.data.IsValidJobCardExisting) {
									// message part
									var infoString = informationStringForGeneratedDispatchHeaders(response.data.SucceededDispatchHeaders, response.data.SucceededJobCards);
									var notGeneratedInfoString = '';
									var generatedInfoString = $translate.instant('logistic.job.createDispatchNotesWizard.generatedInfo');
									var generalItemInfoString = response.data.SucceededJobCards.length + ' ' + generatedInfoString + '<br/>';
									var genaralNotGeneratedInfoString = $translate.instant('logistic.job.createDispatchNotesWizard.genaralNotGeneratedInfo') + '<br/>';
									var notGeneratedInfoStringItems = informationStringForNotGeneratedJobCards(response.data.NotSucceededJobCards);

									if (notGeneratedInfoStringItems !== '') {
										notGeneratedInfoString = genaralNotGeneratedInfoString + notGeneratedInfoStringItems;
									}

									var modalOptions = {
										headerText: $translate.instant(title),
										bodyText: generalItemInfoString + infoString + '<br/>' + notGeneratedInfoString,
										iconClass: 'ico-info',
										disableOkButton: false
									};
									platformModalService.showDialog(modalOptions);
								}
								else {
									var modalOptionsfailed = {
										headerText: $translate.instant(title),
										bodyText: $translate.instant('logistic.job.createDispatchNotesWizard.noGeneratedAtAllInfo'),
										iconClass: 'ico-info',
										disableOkButton: false
									};
									platformModalService.showDialog(modalOptionsfailed);
								}
							});
						},
						dialogOptions: {
							disableOkButton: function () {
								return validationCheckForDispatchDialog(modalCreateConfig);
							}
						},
					};
					platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
					platformModalFormConfigService.showDialog(modalCreateConfig);

					setDefaultForRubricCategory(modalCreateConfig);

				}
			});
		};

		function informationStringForGeneratedDispatchHeaders(succededDispatchHeader, succeededJobCards) {
			var infoString = '';

			for (var i = 0; i < succededDispatchHeader.length; i++) {
				var cardCode = succeededJobCards[i].Code;
				var dispatchCode = succededDispatchHeader[i].Code;

				infoString += arrowIcon + cardCode + arrowIconTo + dispatchCode;
			}

			return infoString;
		}

		function informationStringForNotGeneratedJobCards(notSucceededCards) {

			var infoString = '';
			var arrayKeys = Object.keys(notSucceededCards);
			_.forEach(selectedCards, function (card) {

				for (var i = 0; i < arrayKeys.length; i++) {
					var key = arrayKeys[i];
					if (card.Code === key) {
						infoString += arrowIcon + card.Code;
					}
				}
			});
			return infoString;
		}

		function getCardIsReadyForDispatchStatus() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/jobcardstatus/list').then(function (response) {
				if (response.data) {
					var isready = _.find(response.data, {IsReadyForDispatching: true});
					var isReadyForDispatchingId = isready && isready.Id ? isready.Id : null;
					return isReadyForDispatchingId;
				}
			});
		}

		function checkJobCardsHasActivitiesAndRecords(JobCards) {
			var jobCards = [];
			jobCards.push(JobCards);
			var jobCardIds = jobCards.map(function (item) {
				return item.Id;
			});
			return $http.post(globals.webApiBaseUrl + 'logistic/card/card/checkifjobcardhasctivitiesandrecords', jobCardIds).then(function (response) {
				if (response) {
					return response;
				}
			});
		}

		function setDefaultForRubricCategory(modalCreateConfig) {
			var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
			var lookupList = infoService.getLookupData();
			var item = _.find(lookupList, {CanCreate: true});
			modalCreateConfig.dataItem.DispatchRubricCategoryFk = item.RubricCatID;

			// code generate part
			if (infoService.hasToGenerateForRubricCategory(item.RubricCatID)) {
				platformRuntimeDataService.readonly(modalCreateConfig.dataItem, [{
					field: 'DispatchCode',
					readonly: true
				}]);
				modalCreateConfig.dataItem.DispatchCode = infoService.provideNumberDefaultText(item.RubricCatID, modalCreateConfig.dataItem.DispatchCode);
			} else {
				modalCreateConfig.dataItem.DispatchCode = '';
				platformRuntimeDataService.readonly(modalCreateConfig.dataItem, [{
					field: 'DispatchCode',
					readonly: false
				}]);
			}
		}

		function validateSelectedRubricCatForDispatch(entity, value, model) {
			if (entity.DispatchRubricCategoryFk !== value || entity.Version === 0) {
				var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('logisticDispatchingHeaderNumberInfoService', 34);
				if (infoService.hasToGenerateForRubricCategory(value)) {
					platformRuntimeDataService.readonly(entity, [{field: 'DispatchCode', readonly: true}]);
					entity.DispatchCode = infoService.provideNumberDefaultText(value, entity.DispatchCode);
				} else {
					entity.DispatchCode = '';
					platformRuntimeDataService.readonly(entity, [{field: 'DispatchCode', readonly: false}]);
				}
				platformDataValidationService.validateMandatory(entity, entity.DispatchCode, 'DispatchCode', logisticJobDataService, logisticJobDataService);
				return platformDataValidationService.finishValidation(!_.isNil(entity.DispatchRubricCategoryFk), entity, value, model, logisticJobDataService, logisticJobDataService);
			}
		}

		function isCodeUniqueAsync(entity, value, model) {
			if (isCodeUniqueFlagSync) {
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, logisticJobDataService);
				asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'logistic/dispatching/header/isCodeUnique' + '?code=' + value).then(function (response) {
					if (!response.data) {
						setFlagIsCodeUnique(entity, model, false);
						return platformDataValidationService.finishAsyncValidation({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'cloud.common.uniqueValueErrorMessage',
							error$tr$param: {object: model.toLowerCase()}
						}, entity, value, model, asyncMarker, logisticJobDataService, logisticJobDataService);
					} else {
						setFlagIsCodeUnique(entity, model, true);
						return platformDataValidationService.finishValidation(true, entity, value, model, logisticJobDataService, logisticJobDataService);
					}
				});
				return asyncMarker.myPromise;
			}
			return $q.when();
		}

		function setFlagIsCodeUnique(entity, model, flag) {
			isCodeUniqueFlagAsync = flag;
		}

		function validationCheckForDispatchDialog(modalCreateConfig) {

			var modalOptionsfailed = {
				headerText: $translate.instant(title),
				bodyText: '',
				iconClass: 'ico-info',
				disableOkButton: false
			};

			var result = true;
			var dataItem = null;
			var selectionChanged = false;
			var selectedCard = $injector.get('logisticCardDialogLookupDataService').getSelected();

			if (selectedCard && selectedCard !== formerSelectedCard) {
				formerSelectedCard = selectedCard;
				selectionChanged = true;
			}

			if (selectionChanged && selectedCard && !selectedCard.JobPerformingFk) {
				//Error MessageText
				isValid = false;
				modalOptionsfailed.bodyText += arrowIcon + $translate.instant('logistic.job.createDispatchNotesWizard.noPerfomingJobIsSet');
				platformModalService.showDialog(modalOptionsfailed);
			}

			if (selectedCard && selectedCard.JobPerformingFk && !isRequestIsActive && selectionChanged) {
				isRequestIsActive = true;
				checkJobCardsHasActivitiesAndRecords(selectedCard).then(function (response) {
					isRequestIsActive = false;
					if (response.data === false) {
						isValid = false;
						modalOptionsfailed.bodyText += arrowIcon + $translate.instant('logistic.job.createDispatchNotesWizard.jobCardNoRecords');
						platformModalService.showDialog(modalOptionsfailed);
					} else {
						isValid = true;
					}
				});

			}
			if (isValid && modalCreateConfig) {
				dataItem = modalCreateConfig.dataItem;
				if (modalCreateConfig.dataItem && dataItem.jobCardFk && dataItem.DispatchRubricCategoryFk && dataItem.DispatchCode) {
					result = false;
				}
			}
			if(!isValid) {
				modalCreateConfig.dataItem.jobCardFk = null;
			}

			return result;
		}

		function validateJobs(jobs, title) {
			//Error MessageText
			var modalOptions = {
				headerText: $translate.instant(title),
				bodyText: '',
				iconClass: 'ico-info',
				disableOkButton: false
			};
			isValid = true;
			var isJobSelected = true;

			// check if any job is selected
			if (jobs.length === 0) {
				modalOptions.bodyText += arrowIcon + $translate.instant('cloud.common.noCurrentSelection');
				isValid = false;
				isJobSelected = false;
				platformModalService.showDialog(modalOptions);
			}

			// check if the customize table has the ready for dispatching flag configured => Yes! Set JobCardStatusFk
			if (isJobSelected) {
				promiseIsReadyForDispatch = getCardIsReadyForDispatchStatus().then(function (readyForDispatchingId) {
					if (readyForDispatchingId) {
						JobCardStatusFk = readyForDispatchingId;
						isValid = true;
					}
					else {
						modalOptions.bodyText += $translate.instant('logistic.job.createDispatchNotesWizard.noStatusIsSetToIsReadyForDispatchInCustomize') + '<br />';
						isValid = false;
					}
					if (!isValid) {
						platformModalService.showDialog(modalOptions);
					}
				});
			}
		}

		return service;
	}

})(angular);
