/**
 * Created by jhe on 11/16/2018.
 */
(function (angular) {
	/* global globals, Platform */
	'use strict';
	var moduleName = 'basics.accountingjournals';
	var basicsAccountingJournalsModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsAccountingJournalsMainService
	 * @function
	 *
	 * @description
	 * basicsUnitMainService is the data service for all unit related functionality.
	 */
	basicsAccountingJournalsModule.factory('basicsAccountingJournalsMainService', ['$http', '$translate', '$injector', 'platformDataServiceFactory',
		'platformPermissionService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsAccountingJournalsFilterService',
		'basicsCommonMandatoryProcessor', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',

		function ($http, $translate, $injector, platformDataServiceFactory,
			platformPermissionService, platformDataServiceProcessDatesBySchemeExtension, filterService,
			mandatoryProcessor, basicsLookupdataLookupDescriptorService, platformRuntimeDataService) {

			var serviceContainer;
			var onFilterUnLoaded = new Platform.Messenger();
			var onFilterLoaded = new Platform.Messenger();

			var basicsAccountingJournalsServiceOption = {
				flatRootItem: {
					module: basicsAccountingJournalsModule,
					serviceName: 'basicsAccountingJournalsMainService',
					entityNameTranslationID: 'basics.accountingJournals.accountingJournalsListContainerTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/accountingJournals/',
						usePostForRead: true
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'AccountingJournalsDto',
						moduleSubModule: 'Basics.AccountingJournals'
					}), {
						processItem: function processItem(hdr) {
							platformRuntimeDataService.readonly(hdr, hdr.IsSuccess);
						}
					}],
					actions: {
						delete: true,
						create: 'flat'
					},
					entityRole: {
						root: {
							codeField: 'AccountingJournals',
							itemName: 'AccountingJournals',
							moduleName: 'cloud.desktop.moduleDisplayNameAccountingJournals'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: null,
							showOptions: false,
							showProjectContext: false,
						}
					},
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(basicsAccountingJournalsServiceOption);
			var service = serviceContainer.service;

			// filters register and un-register, it will call by the contract-module.js
			service.registerFilters = function () {
				filterService.registerFilters();
				onFilterLoaded.fire(moduleName);
			};

			// unload filters
			service.unRegisterFilters = function () {
				filterService.unRegisterFilters();
				onFilterUnLoaded.fire(moduleName);
			};

			service.selectTransactionHeader = function (Ids, triggerField) {
				if ('CompanyTransheaderFk' === triggerField) {
					$http.post(globals.webApiBaseUrl + 'basics/accountingJournals/list', {PKeys: Ids}).then(function (response) {
						var items = {
							FilterResult: null,
							dtos: response.data.Main || []
						};
						return serviceContainer.data.handleReadSucceeded(items, serviceContainer.data);
					});
				}
			};

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'AccountingJournalsDto',
				moduleSubModule: 'Basics.AccountingJournals',
				validationService: 'basicsAccountingJournalsValidationService',
				mustValidateFields: ['CompanyYearFk', 'CompanyPeriodFk', 'TransactionTypeFk', 'PostingDate']
			});

			serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
				if (deleteParams.entity) {
					if (deleteParams.entity.CompanyYearFk === null) {
						deleteParams.entity.CompanyYearFk = 0;
					}
					if (deleteParams.entity.CompanyPeriodFk === null) {
						deleteParams.entity.CompanyPeriodFk = 0;
					}
					if (deleteParams.entity.TradingYear === null) {
						deleteParams.entity.TradingYear = 0;
					}
					if (deleteParams.entity.TradingPeriod === null) {
						deleteParams.entity.TradingPeriod = 0;
					}
					if (deleteParams.entity.BasCompanyTransheaderFk === null) {
						deleteParams.entity.BasCompanyTransheaderFk = 0;
					}
				}
			};

			// load lookup items, and cache in front end.
			basicsLookupdataLookupDescriptorService.loadData(['CompanyTransHeaderStatus']);

			function incorporateDataRead(readData, data) {

				basicsLookupdataLookupDescriptorService.attachData(readData);

				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				var dataRead = serviceContainer.data.handleReadSucceeded(result, data);

				return dataRead;
			}

			service.canDelete = function canDelete() {
				var hdr = service.getSelected();
				return !!hdr && !hdr.IsSuccess;
			};

			return service;

		}]);
})(angular);