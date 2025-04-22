/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipAccrualService', ['_', 'moment', 'globals', 'platformDataServiceFactory', 'salesWipService', 'ServiceDataProcessDatesExtension',
		function (_, moment, globals, platformDataServiceFactory, salesWipService, ServiceDataProcessDatesExtension) {

			var serviceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'salesWipAccrualService',
					httpRead: {
						route: globals.webApiBaseUrl + 'sales/wip/accrual/',
						endRead: 'list'
					},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								var list = readItems.Main;
								var transHeaders = readItems.TransactionHeader;
								_.forEach(list, function (item) {
									if (item.CompanyTransaction) {
										var found = _.find(transHeaders, {Id: item.CompanyTransaction.CompanyTransheaderFk});
										if (found) {
											item.CompanyTransaction.CompanyTransHeader = found.Description;
										}
										_.forEach(['PostingDate', 'VoucherDate'], function (field) {
											if (_.get(item.CompanyTransaction, field)) {
												_.set(item.CompanyTransaction, field, moment.utc(_.get(item.CompanyTransaction, field)));
											}
										});
									}
								});

								return data.handleReadSucceeded(list, data);
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'WipAccrual', parentService: salesWipService}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['DateEffective'])],
					actions: {create: false, delete: false}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions),
				service = serviceContainer.service;

			return service;
		}]);
})(angular);