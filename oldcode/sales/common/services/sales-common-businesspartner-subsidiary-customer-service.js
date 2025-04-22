/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global globals, _ */
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesCommonBusinesspartnerSubsidiaryCustomerService', [
		'$injector',
		'$q',
		'$http',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService',
		'salesBillingBillTypeLookupOptions',
		'basicsLookupdataSimpleLookupService',
		function (
			$injector,
			$q,
			$http,
			basicsLookupdataLookupFilterService,
			platformRuntimeDataService,
			salesBillingBillTypeLookupOptions,
			basicsLookupdataSimpleLookupService
		) {

			var filters = [
				{
					key: 'sales-common-subsidiary-filter',
					serverSide: true,
					serverKey: 'sales-common-subsidiary-filter',
					fn: function (item) {
						return {
							BusinessPartnerFk: item.BusinesspartnerFk || null,
							CustomerFk: item.CustomerFk || null
						};
					}
				},
				{
					key: 'sales-common-customer-filter',
					serverSide: true,
					serverKey: 'sales-common-customer-filter',
					fn: function (item) {
						return {
							BusinessPartnerFk: item.BusinesspartnerFk || null,
							SubsidiaryFk: item.SubsidiaryFk || null
						};
					}
				},
				{ // TODO: almost the same filters like sales-common-customer-filter and sales-common-subsidiary-filter
					key: 'sales-common-subsidiary-billto-filter',
					serverSide: true,
					serverKey: 'sales-common-subsidiary-filter',
					fn: function (item) {
						return {
							BusinessPartnerFk: item.BusinesspartnerBilltoFk || null,
							CustomerFk: item.CustomerBilltoFk || null
						};
					}
				},
				{
					key: 'sales-common-customer-billto-filter',
					serverSide: true,
					serverKey: 'sales-common-customer-filter',
					fn: function (item) {
						return {
							BusinessPartnerFk: item.BusinesspartnerBilltoFk || null,
							SubsidiaryFk: item.SubsidiaryBilltoFk || null
						};
					}
				}
			];

			function getCustomerCompanyList(customerId) {
				return $http.get(globals.webApiBaseUrl + 'businesspartner/main/customercompany/list?mainItemId=' + customerId);
			}

			function getCustomerList(businessPartnerId) {
				// remarks: lookupType: 'customer' is returning for all customers the SubledgerContextFk = 0
				// so we will take another server api here (services/businesspartner/main/customer/list?mainItemId=<businessPartnerId>)
				// TODO: check why SubledgerContext is always 0
				// var dataServiceName = 'businessPartnerCustomerLookupDataService';
				// return $injector.get(dataServiceName).getList({
				//  lookupType: 'customer',
				//  dataServiceName: dataServiceName
				// }).then(function (customerEntities) {
				return $http.get(globals.webApiBaseUrl + 'businesspartner/main/customer/list?mainItemId=' + businessPartnerId);
			}

			function setSubsidiaryByCustomer(customerEntity, curItem, colName) {
				var salesCommonContextService = $injector.get('salesCommonContextService');
				if (_.get(customerEntity, 'SubsidiaryFk') > 0) {
					// subsidiary: set address of current customer
					if(colName === 'CustomerFk'){
						curItem.SubsidiaryFk = customerEntity.SubsidiaryFk;
					}else{
						curItem.SubsidiaryBilltoFk = customerEntity.SubsidiaryFk;
					}
				}
				// any restrictions for the company? (see #100317)
				if(colName === 'CustomerFk'){
					return getCustomerCompanyList(customerEntity.Id).then(function (response) {
						var custCompanyRestriction = _.first(_.filter(response.data, {BasCompanyFk: salesCommonContextService.getCompany().Id}));
						if (custCompanyRestriction) {
							curItem.VatGroupFk = custCompanyRestriction.VatGroupFk;
							curItem.PaymentTermFiFk = custCompanyRestriction.BasPaymentTermFiFk;
							curItem.PaymentTermPaFk = custCompanyRestriction.BasPaymentTermPaFk;
						} else if (_.get(customerEntity, 'VatGroupFk') > 0) {
							curItem.VatGroupFk = customerEntity.VatGroupFk;
							curItem.PaymentTermFiFk = customerEntity.PaymentTermFiFk;
							curItem.PaymentTermPaFk = customerEntity.PaymentTermPaFk;
						}
						if (Object.prototype.hasOwnProperty.call(curItem, 'PaymentTermFk')) {
							var types = basicsLookupdataSimpleLookupService.getData(salesBillingBillTypeLookupOptions);
							var typeItem = _.find(types, {Id: curItem.TypeFk});
							if (!_.isNil(typeItem)) {
								var paymentTermFk = typeItem.IsProgress ? curItem.PaymentTermPaFk : curItem.PaymentTermFiFk;
								if (!_.isNil(paymentTermFk)) {
									curItem.PaymentTermFk = paymentTermFk;
								}
							}
						}
					});
				}else{
					return $q.when(null);
				}
			}

			function setSubsidiaryByBusinessPartner(businessPartnerId, curItem,colName) {
				if (!businessPartnerId) {
					return $q.when(null);
				}
				// subsidiary: set main address of current bp
				return $http.get(globals.webApiBaseUrl + 'businesspartner/main/subsidiary/lookup?bpId=' + businessPartnerId)
					.then(function (response) {
						var data = response && response.data;
						var mainSubsidiary = _.find(data, {IsMainAddress: true});
						if(colName === 'BusinesspartnerFk'){
							curItem.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;
						}else{
							curItem.SubsidiaryBilltoFk = mainSubsidiary ? mainSubsidiary.Id : null;
						}
						return null;
					});
			}

			function setCustomerByBusinessPartner(businessPartnerId, curItem, colName) {
				var salesCommonContextService = $injector.get('salesCommonContextService');
				return getCustomerList(businessPartnerId).then(function (response) {
					var customerList = _.get(response, 'data.Main');
					// respect the subledger context
					var subsidiaryFk = null;
					if(colName === 'BusinesspartnerFk'){
						subsidiaryFk = curItem.SubsidiaryFk;
					}else{
						subsidiaryFk = curItem.SubsidiaryBilltoFk;
					}
					var customer = _.first(_.filter(customerList, { Id: curItem.CustomerFk }));

					// if curItem do not have customerFk
					if (customer === null || customer === undefined) {
						customer = _.first(_.orderBy(_.filter(customerList, {
							BusinessPartnerFk: businessPartnerId,
							SubledgerContextFk: salesCommonContextService.getCompany().SubledgerContextFk,
							SubsidiaryFk: subsidiaryFk
						}), ['Code']));
					}

					// if no customer found with related subsidiary
					if (customer === null || customer === undefined) {
						customer = _.first(_.orderBy(_.filter(customerList, {
							BusinessPartnerFk: businessPartnerId,
							SubledgerContextFk: salesCommonContextService.getCompany().SubledgerContextFk,
							SubsidiaryFk: null
						}), ['Code']));
					}
					if(colName === 'BusinesspartnerFk'){
						curItem.CustomerFk = customer ? customer.Id : null;
					}else{
						curItem.CustomerBilltoFk = customer ? customer.Id : null;
					}


					// any restrictions for the company? (see #100317)
					if(colName === 'BusinesspartnerFk' && !_.isNil(curItem.CustomerFk)){
						return getCustomerCompanyList(curItem.CustomerFk).then(function (response) {
							var custCompanyRestriction = _.first(_.filter(response.data, {BasCompanyFk: salesCommonContextService.getCompany().Id}));
							if (custCompanyRestriction) {
								curItem.VatGroupFk = custCompanyRestriction.VatGroupFk;
								curItem.PaymentTermFiFk = custCompanyRestriction.BasPaymentTermFiFk;
								curItem.PaymentTermPaFk = custCompanyRestriction.BasPaymentTermPaFk;
							} else if (_.get(customer, 'VatGroupFk') > 0) {
								curItem.VatGroupFk = customer.VatGroupFk;
								curItem.PaymentTermFiFk = customer.PaymentTermFiFk;
								curItem.PaymentTermPaFk = customer.PaymentTermPaFk;
							}
							if (Object.prototype.hasOwnProperty.call(curItem, 'PaymentTermFk')) {
								var types = basicsLookupdataSimpleLookupService.getData(salesBillingBillTypeLookupOptions);
								var typeItem = _.find(types, {Id: curItem.TypeFk});
								if (!_.isNil(typeItem)) {
									var paymentTermFk = typeItem.IsProgress ? curItem.PaymentTermPaFk : curItem.PaymentTermFiFk;
									if (!_.isNil(paymentTermFk)) {
										curItem.PaymentTermFk = paymentTermFk;
									}
								}
							}
						});
					}

				});
			}

			function populateRelatedValues(dataService, curItem, colName, value) {
				if (colName === 'BusinesspartnerFk' || colName === 'BusinesspartnerBilltoFk') {
					var businesspartnerId = value;
					var isReadOnly = businesspartnerId === null;
					if(colName === 'BusinesspartnerFk'){
						platformRuntimeDataService.readonly(curItem, [{field: 'SubsidiaryFk', readonly: isReadOnly}]);
					}else{
						platformRuntimeDataService.readonly(curItem, [{field: 'SubsidiaryBilltoFk', readonly: isReadOnly}]);
					}

					// try to set main address
					if (!isReadOnly) {
						return setSubsidiaryByBusinessPartner(businesspartnerId, curItem, colName).then(function () {
							return setCustomerByBusinessPartner(businesspartnerId, curItem, colName).then(function () {
								if(dataService) {
									dataService.fireItemModified(curItem);
								}
							});
						});
					}
					else{
						if(colName === 'BusinesspartnerFk'){
							curItem.SubsidiaryFk = null;
							curItem.CustomerFk = null;
						}else{
							curItem.SubsidiaryBilltoFk = null;
							curItem.CustomerBilltoFk = null;
						}

						return $q.when(null);
					}
				}
				// else if (colName === 'SubsidiaryFk') {
				//
				// }
				else if (colName === 'CustomerFk' || colName === 'CustomerBilltoFk') {
					// set business partner (from customer) if not set yet
					var customerId = value;
					if (customerId) {
						var dataServiceName = 'businessPartnerCustomerLookupDataService';
						return $injector.get(dataServiceName).getItemByIdAsync(customerId, {
							lookupType: 'customer',
							dataServiceName: dataServiceName
						}).then(function (customerEntity) {
							if(colName === 'CustomerFk'){
								curItem.BusinesspartnerFk = customerEntity.BusinessPartnerFk;
							}else{
								curItem.BusinesspartnerBilltoFk = customerEntity.BusinessPartnerFk;
							}

							return setSubsidiaryByCustomer(customerEntity, curItem, colName).then(function () {
								if (dataService) {
									dataService.fireItemModified(curItem);
								}
							});
						});
					} else {
						return $q.when(null);
					}
				}
			}

			var service = {
				handleCellChanged: function handleCellChanged(arg, dataService, colName) {
					var col = colName || arg.grid.getColumns()[arg.cell].field;
					var curItem = arg.item;
					populateRelatedValues(dataService, curItem, col, curItem[col]);
				},
				populateRelatedValues: populateRelatedValues,
				registerFilters: function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(filters);
				},
				unregisterFilters: function unregisterFilters() {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}
			};

			return service;
		}]);
})();
