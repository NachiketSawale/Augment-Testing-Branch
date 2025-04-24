(function (angular) {
	/* global globals */
	'use strict';
	let companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyPeriodsService
	 * @function
	 *
	 * @description
	 * basicsCompanyPeriodsService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyPeriodsService', [
		'$q', '$http', '_', '$injector', 'basicsCompanyYearService', 'platformDataServiceFactory',
		'platformDataValidationService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'basicsCompanyPeriodValidationProcessor',

		function (
			$q, $http, _, $injector, basicsCompanyYearService, platformDataServiceFactory,
			platformDataValidationService, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
			basicsCompanyPeriodValidationProcessor
		) {
			let serviceContainer;

			let basicsCompanyServiceOption = {
				flatNodeItem: {
					module: companyModule,
					serviceName: 'basicsCompanyPeriodsService',
					entityNameTranslationID: 'basics.company.entityPeriod',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/company/periods/'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/company/periods/'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CompanyPeriodDto',
						moduleSubModule: 'Basics.Company'
					}),basicsCompanyPeriodValidationProcessor],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let compYear = basicsCompanyYearService.getSelected();
								creationData.yearId = compYear.Id;
								creationData.traidingYear = compYear.TradingYear;
								creationData.year = compYear;
								creationData.tradingPeriod = 1;

								let listPeriod = serviceContainer.data.itemList;
								if (!_.isEmpty(listPeriod)) {
									// max Year Client
									let maxPeriodClient = _.maxBy(listPeriod, 'EndDate');
									let maxTradingPeriod = _.maxBy(listPeriod, 'TradingPeriod');
									creationData.startDateClient = maxPeriodClient.EndDate;
									creationData.tradingPeriod = maxTradingPeriod.TradingPeriod + 1;
								} else {
									let startDate = angular.copy(compYear.StartDate);
									creationData.startDateClient = startDate.subtract(1, 'd').format();
									creationData.tradingPeriod = compYear.TradingYear * 100 + 1;
								}
							}
						}
					},
					entityRole: {node: {itemName: 'Periods', parentService: basicsCompanyYearService}}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyServiceOption);
			// serviceContainer.data.newEntityValidator = basicsCompanyPeriodsValidationProcessor;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CompanyPeriodDto',
				moduleSubModule: 'Basics.Company',
				validationService: 'basicsCompanyPeriodsValidationService',
				mustValidateFields: ['StartDate','EndDate']
			});
			let service = serviceContainer.service;

			service.hasChildren = function hasChildren() {
				let selectedPeriod = service.getSelected();
				return $http.get(globals.webApiBaseUrl + 'basics/company/transheader/list', {params: {mainItemId: selectedPeriod.Id}})
					.then(function (response) {
						return response;
					},
					function (/* error */) {
					});
			};

			service.getPeriodsForYear = function getPeriodsForYear(companyYear) {
				let cache = serviceContainer.data.provideCacheFor(companyYear.Id, serviceContainer.data);
				if(!_.isNil(cache)) {
					return {
						loaded: true,
						periods: cache.loadedItems
					};
				}
				let items = _.filter(serviceContainer.data.itemList, function(item) {
					return item.CompanyYearFk === companyYear.Id;
				});

				return {
					loaded: !_.isNil(items),
					periods: !_.isNil(items) ? items : []
				};
			};

			service.asyncIsPeriodFieldAValidCompanyPeriodField = function asyncIsPeriodFieldAValidCompanyPeriodField(entity, value, fromTo, companyId){
				if (_.isNull(value)){
					return $q.resolve(true);
				}
				else {
					let asyncAddress = 'basics/company/periods/';
					let errorMsg = 'basics.company.';
					// let $tr$errorMsg = 'logistic.pricecondition.';
					if(fromTo === 'from'){
						asyncAddress += 'isdateastartofaperiod';
						errorMsg += 'errValidationIsNoStartDate';
					}
					else if(fromTo === 'to'){
						asyncAddress += 'isdateanendofaperiod';
						errorMsg += 'errValidationIsNoEndDate';
					}
					return $http.post(globals.webApiBaseUrl + asyncAddress,{ CompanyId: companyId, Date: value}).then(function (resposne) {
						return resposne.data ?
							platformDataValidationService.createSuccessObject():
							platformDataValidationService.createErrorObject(errorMsg);
					});
				}
			};

			return service;
		}]);
})(angular);
