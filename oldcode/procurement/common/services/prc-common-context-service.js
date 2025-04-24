/**
 * Created by lnb on 10/21/2014.
 */
(function (angular) {
	/* global globals,_ */
	'use strict';

	var moduleName = 'procurement.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementContextService',
		['$timeout', 'basicsLookupdataLookupDataService', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService', 'PlatformMessenger',
			'cloudDesktopPinningContextService', '$http', '$injector', '$translate',
			function ($timeout, lookupDataService, platformContextService, basicsLookupdataLookupDescriptorService, cloudDesktopSidebarService, PlatformMessenger,
				cloudDesktopPinningContextService, $http, $injector, $translate) {
				var service = {};
				var moduleContext = {};
				var timeout = {};

				service.leadingServiceKey = 'prc.current.leadingService';
				service.prcCommonMainService = 'prc.current.mainservice';
				service.itemDataServiceKey = 'prc.current.itemDataService';
				service.moduleReadOnlyKey = 'prc.current.readOnly';
				service.moduleStatusKey = 'prc.current.leading.status';
				service.itemDataContainerKey = 'prc.current.itemDataContainer';

				/**
				 * @ngdoc event
				 * @name applicationValueChanged
				 * @methodOf procurement:procurementContextService
				 * @description Messenger that fires events when an application values has been changed
				 */
				service.moduleValueChanged = new PlatformMessenger();
				/**
				 * @ngdoc function
				 * @name setModuleValue
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description sets an module defined value
				 * @param key {string} key name of property to be inserted or updated
				 * @param {*} value module defined data
				 */
				service.setModuleValue = function setModuleValue(key, value) {
					if (angular.isString(key)) {
						if (angular.isUndefined(value)) {
							value = null;
						}

						if (timeout[key]) {
							$timeout.cancel(timeout[key]);
						}

						if (!moduleContext[key] || moduleContext[key].val !== value) {
							moduleContext[key] = {val: value};
							service.moduleValueChanged.fire(key);
						}
					}
				};
				/**
				 * @ngdoc function
				 * @name getApplicationValue
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description gets an module defined value
				 * @param key {string} name of property to retrieve
				 * @returns {*} value of key or null
				 */
				service.getModuleValue = function getModuleValue(key) {
					if (angular.isString(key) && Object.prototype.hasOwnProperty.call(moduleContext,key)) {
						return moduleContext[key].val;
					}
					return null;
				};
				/**
				 * @ngdoc function
				 * @name removeModuleValue
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description removes an module defined value
				 * @param key {string} name of property to retrieve
				 * @returns {*} true if there was an item , false if not found
				 */
				service.removeModuleValue = function removeModuleValue(key) {
					if (angular.isString(key) && Object.prototype.hasOwnProperty.call(moduleContext,key)) {
						if (!timeout[key]) {
							timeout[key] = $timeout(function () {
								delete moduleContext[key];
								timeout[key] = null;
							}, 1000);
						}

						return true;
					}
					return false;
				};

				/**
				 * @ngdoc function
				 * @name init
				 * @function
				 * @methodOf procurement.contract.procurementContractHeaderValueService
				 * @description init function
				 */
				service.init = function init() {
					if (service.isInitialized) {
						return;
					}
					if (angular.isUndefined(service.loginCompany)) {
						return;
					}
					service.isInitialized = true;
					basicsLookupdataLookupDescriptorService.loadItemByKey('project', service.loginProject);
					lookupDataService.getItemByKey('company', service.loginCompany, {}).then(function (company) {
						if (company) {
							service.companyCurrencyId = company.CurrencyFk;
							service.companyTaxCode = company.TaxCodeFk;
							service.companyLedgerContextFk = company.LedgerContextFk;
						}
					}, function (error) {
						window.console.error(error);
					});

				};

				/**
				 * @ngdoc function
				 * @name getMainService
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get main service in current module
				 */
				service.getMainService = function getMainService() {
					return service.getModuleValue(service.prcCommonMainService);
				};

				/**
				 * @ngdoc function
				 * @name getLeadingService
				 * @function
				 * @methodOf service:procurement:procurementContextService
				 * @description get leading service of current module
				 * @returns {service} leading service
				 */
				service.getLeadingService = function getLeadingService() {
					return service.getModuleValue(service.leadingServiceKey);
				};

				/**
				 * @ngdoc function
				 * @name setMainService
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description set main service in current module
				 */
				service.setMainService = function setMainService(moduleService) {
					service.setModuleValue(service.prcCommonMainService, moduleService);
				};

				service.setLeadingService = function setLeadingService(leadingService) {
					service.setModuleValue(service.leadingServiceKey, leadingService);
				};

				/**
				 * @ngdoc function
				 * @name setItemDataService
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description set item data service in current module
				 */
				service.setItemDataService = function setItemDataService(itemDataService) {
					service.setModuleValue(service.itemDataServiceKey, itemDataService);
				};
				/**
				 * @ngdoc function
				 * @name getItemDataService
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get item data service in current module
				 */
				service.getItemDataService = function getItemDataService() {
					return service.getModuleValue(service.itemDataServiceKey);
				};

				/**
				 * @ngdoc function
				 * @name setItemDataService
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description set item data service in current module
				 */
				service.setItemDataContainer = function (itemDataContainer) {
					service.setModuleValue(service.itemDataContainerKey, itemDataContainer);
				};

				/**
				 * @ngdoc function
				 * @name getItemDataService
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get item data service in current module
				 */
				service.getItemDataContainer = function () {
					return service.getModuleValue(service.itemDataContainerKey);
				};

				/**
				 * @ngdoc function
				 * @name setModuleReadOnly
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description set readonly status in current module
				 */
				service.setModuleReadOnly = function setModuleReadOnly(readOnly) {
					service.setModuleValue(service.moduleReadOnlyKey, readOnly);
				};
				/**
				 * @ngdoc function
				 * @name setModuleReadOnly
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get readonly status in current module
				 */
				service.getModuleReadOnly = function getModuleReadOnly() {
					return service.getModuleValue(service.moduleReadOnlyKey);
				};

				/**
				 * @ngdoc function
				 * @name setModuleStatus
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description set module status in current module
				 */
				service.setModuleStatus = function setModuleStatus(readOnly) {
					service.setModuleValue(service.moduleStatusKey, readOnly);
				};
				/**
				 * @ngdoc function
				 * @name setModuleReadOnly
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get module status in current module
				 */
				service.getModuleStatus = function getModuleStatus() {
					return service.getModuleValue(service.moduleStatusKey);
				};


				/**
				 * @ngdoc function
				 * @name setModuleReadOnly
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get module status in current module
				 */
				service.getModuleName = function getModuleStatus() {
					var mainService = service.getMainService();
					if (!mainService) {
						throw new Error('The main service should be set!');
					}

					return mainService.getModule().name;
				};

				// define properties
				Object.defineProperties(service, {
					'loginCompany': {
						get: function () {
							return platformContextService.clientId;
						},
						enumerable: true
					},
					'loginProject': {
						get: function () {
							var projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							return projectContext ? projectContext.id : null;
						},
						enumerable: true
					},
					'mdcContextFk': {
						get: function () {
							return platformContextService.getApplicationValue('mdcContext');
						},
						enumerable: true
					},
					'ledgerContextFk': {
						get: function () {
							return platformContextService.getApplicationValue('mdcLedgerContextFk');
						},
						enumerable: true
					},
					'isReadOnly': {
						get: function () {
							var moduleStatus = service.getModuleValue(service.moduleStatusKey) || {};
							return moduleStatus.Isreadonly || moduleStatus.IsReadonly || service.getModuleReadOnly();
						},
						enumerable: true
					},
					'exchangeRate': {
						get: function () {
							return service.getModuleValue('ExchangeRate');
						},
						set: function (value) {
							service.setModuleValue('ExchangeRate', value);
						},
						enumerable: true
					},
					'requisitionRubricFk': {
						get: function () {
							return 23;
						},
						enumerable: true
					},
					'rfqRubricFk': {
						get: function () {
							return 24;
						},
						enumerable: true
					},
					'quoteRubricFk': {
						get: function () {
							return 25;
						},
						enumerable: true
					},
					'contractRubricFk': {
						get: function () {
							return 26;
						},
						enumerable: true
					},
					'pesRubricFk': {
						get: function () {
							return 27;
						},
						enumerable: true
					},
					'packageRubricFk': {
						get: function () {
							return 31;
						},
						enumerable: true
					},
					'invoiceRubricFk': {
						get: function () {
							return 28;
						},
						enumerable: true
					}

				});

				service.overview = {
					keys: {
						data: 1,
						headerText: 2,
						itemText: 3,
						attachment: 4,
						boq: 5,
						milestone: 6,
						sub: 7,
						general: 8,
						item: 9
					},
					translation: {
						1: 'data',
						2: 'headerText',
						3: 'itemText',
						4: 'attachment',
						5: 'boq',
						6: 'milestone',
						7: 'sub',
						8: 'general',
						9: 'item'
					}
				};

				service.addToolCopyMainCallOffItem = function addToolCopyMainCallOffItem($scope, dataService) {
					var createBtnIdx = _.findIndex($scope.tools.items, {'id': 'create'});
					var contractParentService = $injector.get('procurementContractHeaderDataService');
					var headerSelectedItem = contractParentService.getSelected();
					var copyMainCallOffItem = {
						id: 'copyMainCallOffItems',
						caption: 'procurement.common.copyMainContractItems',
						type: 'item',
						iconClass: 'control-icons ico-copy-action1-2',
						fn: function () {
							headerSelectedItem = contractParentService.getSelected();
							if (headerSelectedItem) {
								if (dataService.getList().length > 0) {
									var modalOptions = {
										headerTextKey: 'procurement.common.copyMainContractItems',
										bodyTextKey: $translate.instant('procurement.contract.confirmCopyMainCallOffHeader'),
										showYesButton: true,
										showNoButton: true,
										iconClass: 'ico-question'
									};
									var platformModalService = $injector.get('platformModalService');
									return platformModalService.showDialog(modalOptions).then(function (result) {
										if (result.yes) {
											getCopyMainItem();
										}
									});
								} else {
									getCopyMainItem();
								}
							}

							function getCopyMainItem() {
								contractParentService.update().then(function () {
									$http.get(globals.webApiBaseUrl + 'procurement/contract/change/copymainitems?itemId=' + headerSelectedItem.Id)
										.then(function (response) {
											if (_.isNil(response) || (response.data !== null && response.data.length === 0)) {
												var platformModalService = $injector.get('platformModalService');
												platformModalService.showMsgBox($translate.instant('procurement.contract.noneCopyMainCallOffHeader'), 'Info', 'ico-info');
											} else {
												dataService.setList(response.data);
												contractParentService.clearModifications();
												var procurementCommonTotalDataService = $injector.get('procurementCommonTotalDataService');
												var totalDataService = procurementCommonTotalDataService.getService(service.getMainService());
												if (totalDataService) {
													totalDataService.load();
												}
												dataService.load();
												var validationService = $injector.get('procurementCommonPrcItemValidationService')(dataService);
												validationService.checkContractItemReadOnly(contractParentService, dataService.getList());
											}
										});
								});
							}
						}
					};
					if (headerSelectedItem) {
						var tbcopyMainCallOffItem = _.find($scope.tools.items, {'id': 'copyMainCallOffItems'});
						if (tbcopyMainCallOffItem) {
							tbcopyMainCallOffItem.disabled = headerSelectedItem.ConHeaderFk === null;
							if(dataService.canCreate() === false) {
								tbcopyMainCallOffItem.disabled = true;
							}
						} else {
							copyMainCallOffItem.disabled = headerSelectedItem.ConHeaderFk === null;
							if(dataService.canCreate() === false) {
								copyMainCallOffItem.disabled = true;
							}
							$scope.tools.items.splice(createBtnIdx + 1, 0, copyMainCallOffItem);
						}
						$scope.tools.update();
						service.checkCallOffHeaderConStatus(headerSelectedItem, contractParentService);
					} else {
						if (angular.isUndefined(_.find($scope.tools.items, {'id': 'copyMainCallOffItems'}))) {
							copyMainCallOffItem.disabled = true;
							$scope.tools.items.splice(createBtnIdx + 1, 0, copyMainCallOffItem);
							$scope.tools.update();
						}
					}
				};

				service.checkCallOffHeaderConStatus = function checkCallOffHeaderConStatus(entity, conService) {
					if (!entity || !entity.ConHeaderFk) {
						return;
					}
					var contractlist = conService.getList();
					if (_.find(contractlist, {Id: entity.ConHeaderFk})) {
						var headerEntity = _.find(contractlist, {Id: entity.ConHeaderFk});
						conStatus(headerEntity.ConStatusFk);
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/contract/header/get?id=' + entity.ConHeaderFk).then(function (result) {
							if (result && result.data) {
								conStatus(result.data.ConStatusFk);
							}
						});
					}

					function conStatus(statusId) {
						lookupDataService.getItemByKey('ConStatus', statusId).then(function (data) {
							if (data && data.IsReadonly === true) {
								var itemDataService = $injector.get('procurementCommonPrcItemDataService').getService(conService);
								itemDataService.updateCopyMainCallOffItemsTool(true);
							}
						});
					}
				};

				/**
				 * @ngdoc function
				 * @name canAddDeleteItemByConfiguration
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description can create and delete boq item by prcConfiguration (IsMaterial and IsService)
				 */
				service.canAddDeleteItemByConfiguration = function canAddDeleteItemByConfiguration(itemService) {
					var parentService = itemService.parentService();
					var configFk = null;
					if (itemService.hasSelection() && itemService.getSelected().PrcHeaderEntity) {
						configFk = itemService.getSelected().PrcHeaderEntity.ConfigurationFk;
					} else if (parentService && parentService.hasSelection() && parentService.getSelected().PrcHeaderEntity) {
						configFk = parentService.getSelected().PrcHeaderEntity.ConfigurationFk;
					} else if (parentService && parentService.hasSelection() && parentService.getSelected().PrcConfigurationFk) {
						configFk = parentService.getSelected().PrcConfigurationFk;
					} else if (parentService && parentService.parentService() && parentService.parentService().getSelected()) {
						configFk = parentService.parentService().getSelected().PrcConfigurationFk;
					}
					if (configFk !== null) {
						var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: configFk});
						if (config && config.IsService === false) {
							return false;
						}
					}
					return true;
				};

				/**
				 * @ngdoc function
				 * @name getDialogActionBtnId
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description get default action button Id for Dialog (e.g: yes, no, ok)
				 * @param id {string} guidId for Dialog
				 * @returns {*} Get the selected buttonId by the user(yes/no/ok)
				 */
				service.getDialogActionBtnId = function getDialogActionBtnId(id) {
					let defaultSel = _.find(service.defaultDialogSelectList, {Id: id});
					if (defaultSel) {
						return defaultSel.ActionBtnId;
					}
					return 'ok';
				};

				/**
				 * @ngdoc function
				 * @name setDialogActionBtnId
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description set dialog default action buttonId in cache
				 * @param id {string} guidId for Dialog
				 * @param option {object} action buttonId after selected by the user
				 */
				service.setDialogActionBtnId = function setDialogActionBtnId(id, option) {
					if (!service.defaultDialogSelectList) {
						service.defaultDialogSelectList = [];
					}
					var actionBtn = 'ok';
					for (var i in option) {
						if (i) {
							actionBtn = i;
						}
					}
					var defaultSel = _.find(service.defaultDialogSelectList, {Id: id});
					if (defaultSel) {
						defaultSel.ActionBtnId = actionBtn;
					} else {
						service.defaultDialogSelectList.push({Id: id, ActionBtnId: actionBtn});
					}
				};

				service.showDialogTemp = {
					createPackageFromTemplateDialogId: $injector.get('platformCreateUuid')(),
					poChangeModalQuestionDialogId: $injector.get('platformCreateUuid')(),
					isContractNoteDialogId: $injector.get('platformCreateUuid')(),
					isContractNoteReqDialogId: $injector.get('platformCreateUuid')(),
				};
				var platformDialogService = $injector.get('platformDialogService');
				var $q = $injector.get('$q');
				/**
				 * @ngdoc function
				 * @name showDialogAndAgain
				 * @function
				 * @methodOf procurement:procurementContextService
				 * @description show the Dialog have dontShowAgain option and remember this selection in cache(it can't use this option when the cancel button)
				 * @param dialogOptions {object} option for Dialog, must to have id
				 * @returns {*} dialog result (e.g: [yes: true])
				 */
				service.showDialogAndAgain = function showDialogAndAgain(dialogOptions) {
					var deferred = $q.defer();
					if (dialogOptions.dontShowAgain) {
						dialogOptions.dontShowAgain = {
							showOption: true,
							defaultActionButtonId: service.getDialogActionBtnId(dialogOptions.id)
						};
					}
					platformDialogService.showDialog(dialogOptions).then(function (result) {
						service.setDialogActionBtnId(dialogOptions.id, result);
						deferred.resolve(result);
					});
					return deferred.promise;
				};

				service.init();
				return service;

			}]);
})(angular);