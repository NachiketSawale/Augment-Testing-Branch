/**
 * Created by zjo on 10.18.2022
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businesspartnerCustomerOpenItemService', [
		'_', '$http','platformDataServiceFactory', 'businesspartnerMainCustomerDataService','businesspartnerMainHeaderDataService','platformContextService','ServiceDataProcessDatesExtension',
			function (_, $http,platformDataServiceFactory, businesspartnerMainCustomerDataService,businesspartnerMainHeaderDataService,platformContextService,ServiceDataProcessDatesExtension) {

			let serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerCustomerOpenItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/main/itwofinance/',
						endRead: 'customeropenitems',
						initReadData: function(readData) {
							let customerId = 0;
							if(businesspartnerMainCustomerDataService.getSelected() !== null) {
								customerId = businesspartnerMainCustomerDataService.getSelected().Id;
							}
							const companyId = platformContextService.signedInClientId;
							readData.filter = '?companyId=' + companyId + '&customerId=' + customerId;
						}},
					presenter: {
						list: {
							incorporateDataRead: function (result, data) {
								if(_.isNil(businesspartnerMainCustomerDataService.getSelected())){ result = [];}
								_.each(result,function(item) {
									item.Id = item['Customer_No'] + item['Transaction_No'] + Math.random().toString(36).slice(-8);
								});
								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['Posting_Date', 'Pmt_Discount_Date', 'Due_Date','Document_Date'])],
					entityRole: {
						root: {
							itemName: 'CustomerOpenItem'
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			serviceContainer.data.doUpdate = null;
			businesspartnerMainCustomerDataService.registerSelectionChanged(updateOpenItem);
			function updateOpenItem() {
				if(_.isNil(businesspartnerMainCustomerDataService.getSelected())) {
					service.setList([]);
				} else {
					service.load();
				}
			}
			service.setShowHeaderAfterSelectionChanged(null);
			return service;

		}
	]);
})(angular);
