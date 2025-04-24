/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.project';
	let projectMainModule = angular.module(moduleName);
	/**
     * @ngdoc service
     * @name estimateProjectEstimateRulesService
     * @function
     * @description
     * estimateProjectEstimateRulesService is the data service for project estimate rules item related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	angular.module(moduleName).factory('estimateProjectEstimateRulesService',
		['$injector', 'projectMainService', 'ServiceDataProcessArraysExtension', 'platformDataServiceFactory', 'PlatformMessenger', '$http', '$translate',
			'platformModalService', 'estimateProjectEstRuleMainValidationProcessService','platformModuleStateService',
			function ($injector, projectMainService, ServiceDataProcessArraysExtension, platformDataServiceFactory, PlatformMessenger, $http, $translate,
				platformModalService, estimateProjectEstRuleMainValidationProcessService, platformModuleStateService) {

				let prjEstRuleServiceOption = {
					hierarchicalNodeItem: {
						module: projectMainModule,
						serviceName: 'estimateProjectEstimateRulesService',
						httpCreate: {
							route: globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/',
							endCreate: 'createitem'
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'project/main/', endUpdate: 'update'},
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/',
							endRead: 'tree',
							initReadData: function initReadData(readData) {
								readData.projectFk = projectMainService.getIfSelectedIdElse(null);
							},
							usePostForRead: true
						},
						entitySelection: {},
						presenter: {
							tree: {
								parentProp: 'PrjEstRuleFk',
								childProp: 'PrjEstRules',
								childSort: true,
								isInitialSorted: true,
								sortOptions: {initialSortColumn: {field: 'Sorting', id: 'sorting'}, isAsc: true},

								initCreationData: function initCreationData(creationData) {
									let selectedItem = service.getSelected();
									creationData.projectFk = projectMainService.getIfSelectedIdElse(null);
									creationData.lastCode = selectedItem && selectedItem.Version === 0 ? selectedItem.Code : '';
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									$injector.get('estimateProjectEstRuleValidationService').setMaxCodeLength(readItems.codeMaxLenght);
									return $injector.get('estimateRuleSequenceLookupService').getListAsync().then(function () {
										return serviceContainer.data.handleReadSucceeded(readItems.tree, data);
									}
									);

								}

							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['PrjEstRules'])],
						entityRole: {
							node: {
								descField: 'DescriptionInfo',
								itemName: 'PrjEstRule',
								moduleName: 'cloud.desktop.moduleDisplayNameProjectMain',
								parentService: projectMainService
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(prjEstRuleServiceOption);
				let service = serviceContainer.service;
				let data = serviceContainer.data;

				data.newEntityValidator = estimateProjectEstRuleMainValidationProcessService;

				serviceContainer.service.createDeepCopy = function createDeepCopy() {
					$http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/deepcopy', serviceContainer.service.getSelected())
						.then(function (response) {
							// serviceContainer.data.handleOnCreateSucceeded(response.data.EstimateRule, serviceContainer.data);
							let copy = response.data.PrjEstRule;
							let creationData = {parent: null};
							if (copy.PrjEstRuleFk) {
								creationData.parent = data.getItemById(copy.PrjEstRuleFk, data);
							}
							if(copy.FormFk > 0){
								let completeDto = {formFk:copy.FormFk, contextFk:copy.Id, rubricFk: 79};
								$http.post(globals.webApiBaseUrl + 'basics/userform/data/saveruleformdata', completeDto);
							}

							data.onCreateSucceeded(copy, data, creationData);
						},
						function (/* error */) {
						});
				};

				service.onUpdateData = new PlatformMessenger();

				service.provideUpdateData = function (updateData) {
					service.onUpdateData.fire(updateData);
					return updateData;
				};

				let originalDeleteEntities = data.deleteEntities;
				data.deleteEntities = function deleteChildEntities(entities, data) {
					if (angular.isArray(entities)) {
						entities = _.clone(entities);

						if (entities.length > 0) {
							let postData = {
								ProjectEstRuleIds: _.map(entities, 'Id'),
								ProjectFk: entities[0].ProjectFk,
								MdcLineItemContextFk: entities[0].MdcLineItemContextFk
							};
							let responseData = [];
							return $http.post(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/candelete', postData).then(function (response) {
								responseData = response.data;
								// let message =
								let isAllRulesAssigned = false;
								let missingCodes = [];
								if (angular.isArray(responseData) && responseData.length > 0) {
									// If at least one ID received, some or all rules are associated.
									if (responseData.length === entities.length) {
										isAllRulesAssigned = true;
									} else {
										missingCodes = _.map(_.filter(entities, function (entity) {
											return _.indexOf(responseData, entity.Id) > -1;
										}), 'Code');
									}
								}
								if (isAllRulesAssigned) {
									let modalOptions = {
										headerTextKey: 'cloud.common.errorMessage',
										bodyTextKey: 'estimate.rule.dialog.allRulesAssignedMessage',
										iconClass: 'ico-error',
										width:'800px'
									};
									if(entities.length === 1){
										modalOptions.mainItemId = entities[0].Id;
										modalOptions.moduleIdentifer = 'project.main.est.rules';
										modalOptions.showNoButton = false;
										modalOptions.prjectId = entities[0].ProjectFk;
										modalOptions.yesBtnText = 'OK';
										return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions);
									}else{
										platformModalService.showDialog(modalOptions);
									}

								} else {
									let message = 'estimate.rule.dialog.deleteAllSelectedRulesMessage';
									if (missingCodes.length > 0) {
										missingCodes = _.join(missingCodes, ', ');
										message = $translate.instant('estimate.rule.dialog.deleteUnAssignedRulesMessage', {codes: missingCodes});
									}
									return platformModalService.showYesNoDialog(message, 'estimate.rule.dialog.confirmRuleDelete', 'no');

								}
							}).then(function (result) {
								if (result && result.yes) {
									let filteredEntities = _.filter(entities, function (entity) {

										// defect 93035, Project Rule: Estimate code validation still showed while delete the project rule
										// this is a common issue, below is a temporary solution for it
										let itemsWithSameCode = _.filter(service.getList(), function(item){
											return item.Id !== entity.Id && item.Code === entity.Code;
										});
										if(itemsWithSameCode && itemsWithSameCode.length > 0){
											_.forEach(itemsWithSameCode, function(itemWithSameCode){
												if(itemWithSameCode.__rt$data && itemWithSameCode.__rt$data.errors && itemWithSameCode.__rt$data.errors.Code){
													itemWithSameCode.__rt$data = {errors: {}};

													let modState = platformModuleStateService.state(service.getModule());
													modState.validation.issues = _.filter(modState.validation.issues, function(err) {
														// return err.entity.Id !== itemWithSameCode.Id || err.model !== model;
														return err.entity.Id !== itemWithSameCode.Id;
													});
												}
											});
										}

										return _.indexOf(responseData, entity.Id) === -1;
									});

									originalDeleteEntities(filteredEntities, data);
								}
							});
						}
					}
				};

				service.navigateToEstimateRule = function (item, triggerField) {
					let ruleViews = ['project.main.est.rules', 'project.main.est.rule.script'];

					let cloudCommonGridService = $injector.get('cloudCommonGridService');
					let list = [];
					cloudCommonGridService.flatten(service.getList(), list, 'PrjEstRules'); // Flatten the rules into list so that, also trees (if any) are shifted to list item.
					let ruleSelected = _.find(list, {Code: triggerField.Code}); // find the item.
					service.setSelected(ruleSelected);  // In services set selection for item.
					if (service.isSelection(ruleSelected)) {
						if (triggerField.ReloadScript) {
							$injector.get('estimateProjectEstRuleScriptService').load();
						}
					}

					$injector.get('estimateCommonNavigationService').navToRuleScript(triggerField, 911, '29', ruleViews, 'project.main.script');
				};

				return service;
			}]);
})(angular);
