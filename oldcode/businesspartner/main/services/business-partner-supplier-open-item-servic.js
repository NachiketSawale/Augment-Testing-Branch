/**
 * Created by zjo on 10.18.2022
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businesspartnerSupplierOpenItemService', [
		'_', '$http','platformDataServiceFactory', 'businesspartnerMainSupplierDataService','businesspartnerMainHeaderDataService','platformContextService','ServiceDataProcessDatesExtension',
		function (_, $http,platformDataServiceFactory, businesspartnerMainSupplierDataService,businesspartnerMainHeaderDataService,platformContextService,ServiceDataProcessDatesExtension) {

			let serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'businesspartnerSupplierOpenItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/main/itwofinance/',
						endRead: 'supplieropenitems',
						initReadData: function(readData) {
							let supplierId = 0;
							if( businesspartnerMainSupplierDataService.getSelected() !== null) {
								supplierId = businesspartnerMainSupplierDataService.getSelected().Id;
							}
							const companyId = platformContextService.signedInClientId;
							readData.filter = '?companyId=' + companyId + '&supplierId=' + supplierId;
						}},
					presenter: {
						list: {
							incorporateDataRead: function (result, data) {
								if(_.isNil(businesspartnerMainSupplierDataService.getSelected())){ result = [];}
								_.each(result,function(item) {
									item.Id = item['Vendor_No'] + item['Transaction_No'] + Math.random().toString(36).slice(-8);
								});
								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['Posting_Date', 'Pmt_Discount_Date', 'Due_Date','Document_Date'])],
					entityRole: {
						root: {
							itemName: 'SupplierOpenItem'
						}
					}
				}
			};
			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			serviceContainer.data.doUpdate = null;
			businesspartnerMainSupplierDataService.registerSelectionChanged(updateOpenItem);
			function updateOpenItem() {
				if(_.isNil(businesspartnerMainSupplierDataService.getSelected())) {
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
