/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonCreateDialogService',
		['_', '$rootScope', '$injector', '$translate', '$http', 'globals', 'platformDialogService', 'platformModalService', 'salesCommonCopyBoqWizardService', 'platformDataValidationService','platformPermissionService',
			function (_, $rootScope, $injector, $translate, $http, globals, platformDialogService, platformModalService, salesCommonCopyBoqWizardService, platformDataValidationService, platformPermissionService) {

				var contextInfo = {
					'sales.bid': {
						service: 'salesBidCreateBidDialogService',
						mainService: 'salesBidService',
						title: 'sales.bid.createBidTitle'
					}, 'sales.contract': {
						service: 'salesContractCreateContractDialogService',
						mainService: 'salesContractService',
						title: 'sales.contract.createContractTitle'
					}, 'sales.wip': {
						service: 'salesWipCreateWipDialogService', // TODO:
						mainService: 'salesWipService',
						title: 'sales.wip.createWipTitle'
					}, 'sales.billing': {
						service: 'salesBillingCreateBillDialogService',
						mainService: 'salesBillingService',
						title: 'sales.billing.createBillTitle'
					}
				};

				function isSalesSubModule() {
					return _.includes(['sales.bid', 'sales.contract', 'sales.wip', 'sales.billing'], $rootScope.currentModule);
				}

				function getCurService() {
					return $injector.get(_.get(contextInfo[$rootScope.currentModule], 'service'));
				}

				function getCurMainService() {
					return $injector.get(_.get(contextInfo[$rootScope.currentModule], 'mainService'));
				}

				function validateSettings() {
					var dataItem = getDataItem(); // TODO: this is a copy! Why?
					var curMainService = getCurMainService();
					if (curMainService.isConfigurableDialog()) {
						// original validation logic // TODO: needs to be checked
						function isValid() {
							// helper for submodule common validations
							function validateCommonFields(dataItem) {
								return !_.isNull(dataItem.BillingSchemaFk) && !_.isNull(dataItem.BusinesspartnerFk)
									&& !_.isNull(dataItem.RubricCategoryFk) && !_.isNull(dataItem.ProjectFk) && !_.isNull(dataItem.CurrencyFk) && !_.isNull(dataItem.ClerkFk)
									&& !_.isNull(dataItem.SubsidiaryFk) && !_.isNull(dataItem.ContractTypeFk) && !_.isNull(dataItem.CompanyResponsibleFk) && !_.isNull(dataItem.LanguageFk)
									&& !_.isNull(dataItem.ExchangeRate) && !_.isNull(dataItem.TaxCodeFk) && !_.isNull(dataItem.DateEffective) && !_.isNull(dataItem.BasSalesTaxMethodFk);
							}

							if ($rootScope.currentModule === 'sales.bid') {
								if (dataItem.TypeEntity.IsMain) {
									return validateCommonFields(dataItem) && dataItem.Code !== '';
								} else if (dataItem.TypeEntity.IsSide || dataItem.TypeEntity.IsChange) {
									return validateCommonFields(dataItem) && dataItem.Code !== '' && !_.isNull(dataItem.BidHeaderFk);
								}
							} else if ($rootScope.currentModule === 'sales.contract') {
								if (dataItem.TypeEntity.IsMain || dataItem.TypeEntity.IsFrameworkCallOff) {
									return validateCommonFields(dataItem) && dataItem.Code !== '';
								} else if (dataItem.TypeEntity.IsSide) {
									return validateCommonFields(dataItem) && dataItem.Code !== '' && !_.isNull(dataItem.OrdHeaderFk);
								} else if (dataItem.TypeEntity.IsChange) {
									return validateCommonFields(dataItem) && dataItem.Code !== '' && !_.isNull(dataItem.PrjChangeFk) && !_.isNull(dataItem.OrdHeaderFk);
								}
							} else if ($rootScope.currentModule === 'sales.wip') {
								return validateCommonFields(dataItem) && !_.isNull(dataItem.OrdHeaderFk) && dataItem.Code !== '';
							} else if ($rootScope.currentModule === 'sales.billing') {
								return validateCommonFields(dataItem) && !_.isNull(dataItem.InvoiceTypeFk) && !_.isNull(dataItem.CustomerFk) && !_.isNull(dataItem.TypeFk) && !_.isNull(dataItem.PaymentTermFk) && dataItem.BillNo !== '';
							}
						}

						var layout = curMainService.configuredCreateLayout;
						dataItem = layout.dataItem;	// overwriting since above a copy is used

						var configuredCreateExtension = $injector.get('platformDataServiceConfiguredCreateExtension');
						configuredCreateExtension.validateDataEntity({
							dataItem: dataItem,
							formConfiguration: layout.formConfiguration
						});

						function validateAllMandatoryFields(dlgLayout) {
							var allValid = true;
							_.forEach(dlgLayout.formConfiguration.rows, function (row) {
								if (allValid && row && row.required && row.visible) {
									allValid = allValid && platformDataValidationService.isMandatory(_.get(dlgLayout.dataItem, row.model), row.model).valid;
								}
							});
							return allValid;
						}

						var isvalid = isValid(); // original validation logic
						var allCheckedValid = validateAllMandatoryFields(layout);

						return allCheckedValid; // TODO: && isvalid; // some of the common fields might not be available in the configurable dialog, hence removed here for now.
					} else {
						return getValidateDataItemFunc()(dataItem);
					}
				}

				function getDataItem() {
					var curMainService = getCurMainService();
					if (curMainService.isConfigurableDialog()) {
						return initDataItem();
					} else {
						return dataItem;
					}
				}

				var dataItem = null;

				function getBoqDataItem() {
					return boqDataItem;
				}
				function initBoqDataItem() {
					boqDataItem = {};
				}
				var boqDataItem = null;

				function initDataItem() {
					var service = getCurService();
					var func = _.get(service, 'getCopyOfInitDataItem');
					dataItem = _.isFunction(func) ? func() : null;
					return dataItem;
				}

				function getTitle() {
					var title = _.get(contextInfo[$rootScope.currentModule], 'title');
					return $translate.instant(title);
				}

				function getFormConfig() {
					var service = getCurService();
					var func = _.get(service, 'getFormConfig');
					return _.isFunction(func) ? func() : null;
				}

				function getCreationData() {
					var service = getCurService();
					var func = _.get(service, 'getCreationDataFromDataItem');
					return _.isFunction(func) ? func(getDataItem()) : null;
				}

				function getCallHttpCreateFunc() {
					var service = getCurMainService();
					var func = _.get(service, 'callHttpCreate');
					return _.isFunction(func) ? func : null;
				}

				function getValidateDataItemFunc() {
					var service = getCurService();
					var func = _.get(service, 'validateDataItem');
					return _.isFunction(func) ? func : null;
				}

				function createDialog() {
					getCurService().resetToDefault().then(function () {

						initDataItem();
						initBoqDataItem();
						$injector.get('salesCommonFunctionalRoleService').setIsFunctionalRoleRestriction(false);
						// data.initDataItem populated here; we will take a copy, see initDataItem()
						salesCommonCopyBoqWizardService.init(getDataItem(), getBoqDataItem());

						platformDialogService.showDialog({
							// TODO: headerText$tr$ / headerTextKey (see also headerText in salesCommonCreateDialogController)
							showOkButton: true,
							showCloseButton: true,
							showCancelButton: true,
							resizeable: false, // TODO: not working correctly => thus set to false
							templateUrl: globals.appBaseUrl + 'sales.common/partials/sales-common-create-dialog.html', // TODO: check bodyTemplateUrl
							controller: 'salesCommonCreateDialogController'
						}).then(function (result) {
							var creationData = getCreationData();
							var postData = salesCommonCopyBoqWizardService.getPostData();
							var configuredCreationData = getDataItem();
							var curMainService = getCurMainService();
							if (curMainService.isConfigurableDialog() && result.cancel === false) {
								curMainService.configuredCreate(configuredCreationData, postData);
							}
							if (result.ok) {
								if (result.ok && $rootScope.currentModule === 'sales.wip') {
									$http.get(globals.webApiBaseUrl + 'sales/contract/relatedcontracts?contractId=' + creationData.OrdHeaderFk).then(function (response) {
										creationData._contracts = response.data;
										$injector.get('salesWipService').createWipViaCommonDialog(creationData);
									});
								}
								else {
									getCallHttpCreateFunc()(creationData, postData);
								}
							} else {
								platformDataValidationService.removeDeletedEntityFromErrorList(creationData, getCurMainService());
							}
						});
					});
				}
				// api
				var service = {
					getTitle: getTitle,
					validateSettings: validateSettings,
					getDataItem: getDataItem,
					getBoqDataItem: getBoqDataItem,
					getFormConfig: getFormConfig,
					showDialog: createDialog,
					getCurMainService: getCurMainService,
					getCurService: getCurService,
				};
				return service;
			}
		]);

	salesCommonModule.factory('salesCommonFunctionalRoleService', ['globals', 'platformPermissionService', '$log', '$q', '$http', '$injector', '_','permissions',
		function (globals, platformPermissionService, $log, $q, $http, $injector, _, permissions) {
			var service = {};

			let isFunctionalRoleRestriction = false;
			service.applyFunctionalRole = function applyFunctionalRole(contract) {
				if (!_.isNil(contract) && !_.isNil(contract.BillingMethodFk)) {
					return service.getBillingMethodById(contract.BillingMethodFk).then(function (response) {
						if (response && response.data) {
							platformPermissionService.functionalRole(response.data.AccessFunctionalRoleFk);
						}
					});
				} else {
					platformPermissionService.functionalRole(null);
				}
			};
			service.hasExecutePermission = function hasExecutePermission(contract, descriptor) {
				if (!_.isNil(contract) && !_.isNil(contract.BillingMethodFk)) {
					return service.getBillingMethodById(contract.BillingMethodFk).then(function (response) {
						if (response && response.data) {
							platformPermissionService.loadFunctionalRoles([response.data.AccessFunctionalRoleFk]); //TODO: check if is really needed
							//info for Patrick:
							//used again 'functionalRole' in order to get the correct result from 'functionalRoleHas' function, based on the configuration in roles module
							//seems 'loadFunctionalRoles' is not sufficient
							platformPermissionService.functionalRole(response.data.AccessFunctionalRoleFk);
							return platformPermissionService.functionalRoleHas(response.data.AccessFunctionalRoleFk, descriptor, permissions.execute);
						}
						return false;
					});
				}
				return Promise.resolve(true);
			};
			service.updateFunctionalRoleRestrictionInfo = function updateFunctionalRoleRestrictionInfo(hasPermission) {
				service.setIsFunctionalRoleRestriction(!hasPermission);
			};
			service.getBillingMethodById = function getBillingMethodById(billingMethodId) {
				return $http.get(globals.webApiBaseUrl + 'sales/contract/getbillingmethodbyid?id=' + billingMethodId);
			};
			service.getIsFunctionalRoleRestriction = function getIsFunctionalRoleRestriction() {
				return isFunctionalRoleRestriction;
			};
			service.setIsFunctionalRoleRestriction = function setIsFunctionalRoleRestriction(value) {
				isFunctionalRoleRestriction = value;
			};
			service.getContractById = function getContractById(contractId) {
				return $http.get(globals.webApiBaseUrl + 'sales/contract/byid?id=' + contractId).then(function (response) {
					return response.data;
				});
			};
			service.loadFunctionalRolesForBillingMethods = function loadFunctionalRolesForBillingMethods() {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/SalesBillingMethod/list').then(function (response) {
					var roleIds = _.uniq(_.map(response.data, 'AccessFunctionalRoleFk'));
					return platformPermissionService.loadFunctionalRoles(roleIds);
				});
			};
			/**
			 * Apply or unapply the functional role of the given billing method.
			 * The billing method is assigned to a contract
			 * @param contractEntityOrId contract entity, id of a contract, or null
			 * @returns {*}
			 * @remarks
			 * if null is passed, we will unapply the current functional role
			 * this can be the case, if no contract is available on the selected entity,
			 * e.g. qto header without contract
			 */
			service.handleFunctionalRole = function handleFunctionalRole(contractEntityOrId) {
				if (_.isUndefined(contractEntityOrId) || (_.isObject(contractEntityOrId) && !_.has(contractEntityOrId, 'Id'))) {
					$log.warn('Invalid parameter passed to salesCommonFunctionalRoleService:handleFunctionalRole()');
					return;
				}
				// if null is passed => unapply current functional role
				if (contractEntityOrId === null) {
					service.applyFunctionalRole(null);
					return;
				}
				var contractEntityPromise = _.isObject(contractEntityOrId) ? $q.when(contractEntityOrId) : service.getContractById(contractEntityOrId);
				return contractEntityPromise.then(function (contract) {
					if (contract) {
						service.applyFunctionalRole(contract);
					}
				});
			};

			return service;
		}]);
})();