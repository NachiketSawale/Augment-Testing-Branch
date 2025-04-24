/**
 * Created by cakiral on 28.12.2020
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name logisticCardCreateDispatchNotesWizardService
	 * @description
	 */

	var moduleName = 'logistic.card';
	angular.module(moduleName).factory('logisticCardCreateDispatchNotesWizardService', ['_', '$http', '$translate', '$injector', '$q', 'moment', 'platformModalService', 'platformTranslateService', 'platformModalFormConfigService', 'logisticCardDataService',
		'logisticCardRecordDataService', 'basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',

		function (_, $http, $translate, $injector, $q, moment, platformModalService, platformTranslateService, platformModalFormConfigService, logisticCardDataService, logisticCardRecordDataService,
			basicsCommonChangeStatusService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {

			var service = {};
			var arrowIcon = ' &#10148; ';
			var arrowIconTo = ' &#10149; ';
			var modalCreateConfig = null;
			let selectedCards = null;
			var promiseIsReadyforDispatch = null;
			var isValid = false;

			var filters = [
				{
				key: 'logistic-card-dispatching-rubric-category-by-rubric-filter',
				fn: function filterCategoryByRubric(item) {
					return item.RubricFk === 34;
					}
				},
				{
					key: 'logistic-dispatching-rubric-category-lookup-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: 34 };//34 is rubric for dispatching.
					}
				}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.createDispatchNotesFromJobCards = function createDispatchNotesFromJobCards() {

				var title = $translate.instant('logistic.card.createDispatchNotesWizard.title');
				selectedCards = logisticCardDataService.getSelectedEntities();
				let cardIds = selectedCards.map(function (item) {
					return item.Id;
				});
				validateCards(selectedCards, cardIds, title);
				$q.all([promiseIsReadyforDispatch]).then(function () {
					if (isValid) {
						modalCreateConfig = {
							title: title,
							dataItem: {
								RubricCategory: null,
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
										model: 'RubricCategory',
										sortOrder: 1,
										label$tr$: 'logistic.card.entityBasRubricCategoryFk',
										label: 'Rubric Category',
										type: 'directive',
										directive: 'basics-lookupdata-lookup-composite',
										options: {
											lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
											descriptionMember: 'Description',
											lookupOptions: {
												filterKey: 'logistic-dispatching-rubric-category-lookup-filter',
												showClearButton: true,
												customIntegerProperty: 'BAS_RUBRIC_FK',
												required: true
											}
										},
										formatter: 'lookup',
										formatterOptions: {
											lookupType: 'RubricCategoryByRubricAndCompany',
											displayMember: 'Description'
										}
									}
								]
							},

							// action for OK button
							handleOK: function handleOK() {
								var dialogDispatching = modalCreateConfig.dataItem;
								var data = {
									RubricCategoryId: dialogDispatching.RubricCategory,
									JobCardIds: cardIds
								};

								$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/createdispatchingnotesfromjobcardwizard', data).then(function (response) {
									if (response && response.data && response.data.IsValidJobCardExisting) {
										// take over part: update job card and record
										logisticCardRecordDataService.takeOverFromCreateDispatchingJobCardWizard(response.data.SucceededJobCardRecords);
										logisticCardDataService.takeOverFromCreateDispatchingJobCardWizard(response.data.SucceededJobCards);


										// message part
										var infoString = informationStringForGeneratedDispatchHeaders(response.data.SucceededDispatchHeaders, response.data.SucceededJobCards);
										var notGeneratedInfoString = '';
										var generatedInfoString = $translate.instant('logistic.card.createDispatchNotesWizard.generatedInfo');
										var generalItemInfoString = response.data.SucceededJobCards.length + ' ' + generatedInfoString + '<br/>';
										var genaralNotGeneratedInfoString = $translate.instant('logistic.card.createDispatchNotesWizard.genaralNotGeneratedInfo') + '<br/>';
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
											bodyText: $translate.instant('logistic.card.createDispatchNotesWizard.noGeneratedAtAllInfo'),
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
					}
				});
			};

			function validationCheckForDispatchDialog(modalCreateConfig) {
				var result = true;
				var dataItem = null;
				if (modalCreateConfig) {
					dataItem = modalCreateConfig.dataItem;
					if (modalCreateConfig.dataItem && dataItem.RubricCategory) {
						result = false;
					}
				}
				return result;
			}

			function validateCards(cards, cardIds, title) {
				// Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: '',
					iconClass: 'ico-info',
					disableOkButton: false
				};
				isValid = true;
				var isCardSelected = true;

				// check if any card is selected
				if (cards.length === 0) {
					modalOptions.bodyText += arrowIcon + $translate.instant('cloud.common.noCurrentSelection');
					isValid = false;
					isCardSelected = false;
					platformModalService.showDialog(modalOptions);
				}
				// check if card has set Performing Job
				if (isCardSelected) {
					var errorCards = [];
					_.forEach(cards, function (card) {
						if (!card.JobPerformingFk) {
							isValid = false;
							errorCards.push(card);
						}
					});
					if (errorCards.length > 0) {
						modalOptions.bodyText += $translate.instant('logistic.card.createDispatchNotesWizard.noPerfomingJobIsSet') + '<br />';
						_.forEach(errorCards, function (card) {
							modalOptions.bodyText += arrowIcon + card.Code;
						});
					}
				}
				// check if card has status is is ready for dispatching and if the customize table has the ready for dispatching flag configured
				if (isCardSelected) {
					promiseIsReadyforDispatch = getCardStatesReadyForDispatching().then(function (readyStates) {
						if (readyStates && readyStates.length > 0) {
							let addHeader = true;
							_.forEach(cards, function (card) {
								if(!_.find(readyStates, function(state) {
									return state.Id === card.JobCardStatusFk;
								})) {
									if(addHeader) {
										modalOptions.bodyText += '<br />' + $translate.instant('logistic.card.createDispatchNotesWizard.noReadyForDispatchStatusIsSet') + '<br />';
										addHeader = false;
									}
									errorCards.push(card);
									modalOptions.bodyText += arrowIcon + card.Code;
									isValid = false;
								}
							});
						}
						else if (!readyStates || readyStates.length === 0){
							modalOptions.bodyText += $translate.instant('logistic.card.createDispatchNotesWizard.noStatusIsSetToIsReadyForDispatchInCustomize') + '<br />';
							isValid = false;
						}

						if (!isValid) {
							platformModalService.showDialog(modalOptions);
						}
					});
				}
			}

			function getCardStatesReadyForDispatching() {
				var lookup = $injector.get('basicsLookupdataSimpleLookupService');
				return lookup.refreshCachedData({
					valueMember: 'Id',
					displayMember: 'Description',
					lookupModuleQualifier: 'basics.customize.jobcardstatus',
					filter: {
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						customBoolProperty: 'ISREADYFORDISPATCHING'
					}
				}).then(function (response) {
					if (response) {
						return _.filter(response, function(state) {
							return state.Isreadyfordispatching;
						});
					}
				});
			}

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

			return service;
		}
	]);
})(angular);
