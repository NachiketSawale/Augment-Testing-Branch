/**
 * Created by chd on 3/6/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementChangeOrderContextService',
		['$timeout', 'basicsLookupdataLookupDataService', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService', 'PlatformMessenger',
			'cloudDesktopPinningContextService',
			function ($timeout, lookupDataService, platformContextService, basicsLookupdataLookupDescriptorService, cloudDesktopSidebarService, PlatformMessenger,
				cloudDesktopPinningContextService) {
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

				service.init();
				return service;

			}]);
})(angular);