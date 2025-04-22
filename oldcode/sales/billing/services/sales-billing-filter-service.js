/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingFilterService', ['_','$injector', 'basicsLookupdataLookupFilterService','platformContextService','basicsLookupdataLookupDescriptorService', 'salesCommonRubric',
		function (_,$injector, basicsLookupdataLookupFilterService,platformContextService,basicsLookupdataLookupDescriptorService, salesCommonRubric) {

			var registered = false;
			var filters = [
				{
					key: 'sales-billing-contract-filter',
					fn: function (contract, entity) {
						// show only contracts with status of type 'ordered'
						if (!$injector.get('salesCommonStatusHelperService').checkIsOrderedByStatusId(contract.OrdStatusFk)) {
							return false;
						}
						// if project already selected, show only contracts from project, otherwise all
						return entity.ProjectFk ? contract.ProjectFk === entity.ProjectFk : !!contract;
					}
				},
				{
					key: 'sales-billing-contract-filter-by-server',
					serverKey: 'sales-billing-contract-filter-by-server',
					serverSide: true,
					fn: function (bill) {
						return {
							ProjectId: bill.ProjectFk
						};
					}
				},
				{
					key: 'sales-billing-bill-filter',
					fn: function (bill, entity) {
						// if project already selected, show only bills from project, otherwise all
						// if we have even a contract selected, show only bills from contract
						if (entity.OrdHeaderFk !== null) {
							return entity.OrdHeaderFk === bill.OrdHeaderFk;
						} else {
							return entity.ProjectFk ? bill.ProjectFk === entity.ProjectFk : !!bill;
						}
					}
				},
				{
					key: 'sales-billing-relatedbill-filter-by-server',
					serverKey: 'sales-billing-relatedbill-filter-by-server',
					serverSide: true,
					fn: function (bill/* , state */) {
						return {
							MainBillId: bill.Id,
							ContractId: bill.OrdHeaderFk,
							ProjectId: bill.ProjectFk
						};
					}
				},
				{
					key: 'sales-billing-previous-bill-from-contract',
					serverKey: 'sales-billing-previous-bill-from-contract',
					serverSide: true,
					fn: function (ordHeader) {
						return {
							ContractId: ordHeader.Id
						};
					}
				},
				{
					key: 'sales-billing-previousbill-filter-by-server',
					serverKey: 'sales-billing-previousbill-filter-by-server',
					serverSide: true,
					fn: function (bill/* , state */) {
						// if project already selected, show only bills from project, otherwise all
						// if we have even a contract selected, show only bills from contract
						return {
							OrdHeaderFk: bill.OrdHeaderFk,
							ProjectFk: bill.ProjectFk
						};
					}
				},
				{
					key: 'sales-billing-rubric-category-by-rubric-filter',
					serverKey: 'rubric-category-by-rubric-company-lookup-filter',
					serverSide: true,
					fn: function () {
						return { Rubric: salesCommonRubric.Billing };
					}
				},
				{
					key: 'sales-billing-configuration-filter',
					serverSide: true,
					fn: function (entity) {
						var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
						return `RubricFk=${salesCommonRubric.Billing}${rubricCat}`;
					}
				},
				{
					key: 'saleTaxCodeByLedgerContext-filter',
					serverSide: false,
					fn: function (item) {
						var loginCompanyFk = platformContextService.clientId;
						var LedgerContextFk;
						if (loginCompanyFk) {
							var companies = basicsLookupdataLookupDescriptorService.getData('Company');
							let company = _.find(companies, {Id: loginCompanyFk});
							if (company) {
								LedgerContextFk = company.LedgerContextFk;
							}
						}
						return (item.LedgerContextFk === LedgerContextFk) && item.IsLive;
					}
				},
				{
					key: 'sales-billing-type-with-rubric-filter',
					fn: function (types) {
						var companyBillingType = $injector.get('salesBillingService').getCompanyCategoryList();
						if (companyBillingType !== null && companyBillingType.length > 0) {
							var filterData = _.filter(companyBillingType, { 'RubricCategoryFk': types.BasRubricCategoryFk });
							if (filterData.length > 0) {
								return types;
							}
							else {
								return null;
							}
						}
						else {
							return types;
						}
					}
				}
			];

			function registerBillingFilters() {
				if (!registered) {
					basicsLookupdataLookupFilterService.registerFilter(filters);
					registered = true;
				}
			}

			function unregisterBillingFilters() {
				if (registered) {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					registered = false;
				}
			}

			// service api
			return {
				registerBillingFilters: registerBillingFilters,
				unregisterBillingFilters: unregisterBillingFilters
			};

		}]);
})();
