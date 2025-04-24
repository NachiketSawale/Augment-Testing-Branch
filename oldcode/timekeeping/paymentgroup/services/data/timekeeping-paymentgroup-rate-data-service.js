/**
 * Created by leo on 10.02.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.paymentgroup');

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentGroupRateDataService
	 * @description pprovides methods to access, create and update timekeeping paymentgroup rate entities
	 */
	myModule.service('timekeepingPaymentGroupRateDataService', TimekeepingPaymentGroupRateDataService);

	TimekeepingPaymentGroupRateDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'timekeepingPaymentGroupDataService',
		'timekeepingPaymentGroupConstantValues', 'basicsCommonMandatoryProcessor', 'platformContextService', 'cloudDesktopSidebarService'];

	function TimekeepingPaymentGroupRateDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, timekeepingPaymentGroupDataService,
		timekeepingPaymentGroupConstantValues, basicsCommonMandatoryProcessor, platformContextService, cloudDesktopSidebarService) {
		var self = this;
		var timekeepingPaymentGroupRateServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingPaymentGroupRateDataService',
				entityNameTranslationID: 'timekeeping.paymentgroup.paymentGroupRateEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/paymentgroup/rate/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingPaymentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingPaymentGroupConstantValues.schemes.rate)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingPaymentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						incorporateDataRead: function(readItems, data){
							let request = cloudDesktopSidebarService.getFilterRequestParams();
							if (request.UseCurrentClient){
								let clientId = platformContextService.signedInClientId;
								readItems = _.filter(readItems, function(item){
									return (item.CompanyFk === clientId);
								});
							}
							return data.handleReadSucceeded(readItems, data);
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Rates', parentService: timekeepingPaymentGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingPaymentGroupRateServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingPaymentGroupRateValidationService'
		}, timekeepingPaymentGroupConstantValues.schemes.rate));
	}
})(angular);
