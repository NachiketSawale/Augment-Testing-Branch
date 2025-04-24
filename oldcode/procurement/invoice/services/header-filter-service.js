/**
 * Created by lnb on 10/21/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.invoice').factory('procurementInvoiceHeaderFilterService', [
		'$q', 'platformContextService', 'basicsLookupdataLookupFilterService', '$injector', '$http',
		'cloudDesktopSidebarService', 'procurementContextService', 'basicsLookupdataLookupDescriptorService', '_',
		function ($q, platformContextService, basicsLookupdataLookupFilterService, $injector, $http,
			sidebarService, moduleContext, basicsLookupdataLookupDescriptorService, _) {
			var service = {}, projectFk, self = this;

			var getProjectFk = function getProjectFk(currentItem, useCurrentFirst) {
				return useCurrentFirst && currentItem ? currentItem.ProjectFk : platformContextService.getApplicationValue(sidebarService.appContextProjectContextKey);
			};

			var filters = [
				{
					key: 'prc-invoice-billing-schema-filter',
					serverSide: true,
					fn: function (currentItem) {
						if (!currentItem || !currentItem.Id) {
							return '';
						}
						var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcConfigurationFk});

						return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
					}

				},
				{
					key: 'prc-invoice-rubric-category-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk = ' + moduleContext.invoiceRubricFk;
					}
				},
				{
					key: 'deferal-type-filter',
					serverSide: true,
					fn: function (/* currentItem */) {
						var parentItem = self.leadingService.getSelected();
						if (parentItem) {
							var CompanyFk = parentItem.CompanyFk;
							return 'ISLIVE=true And BasCompanyFk=' + CompanyFk;
						}
					}
				},
				{
					key: 'prc-invoice-configuration-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk = ' + moduleContext.invoiceRubricFk;
					}
				}, {
					key: 'prc-invoice-invType-filter',
					serverKey: 'prc-invoice-invType-filter',
					serverSide: true,
					fn: function (currentItem) {
						/* if(!currentItem){
							return '';
						}
						return 'RubricCategoryFk = ' + currentItem.RubricCategoryFk; */
						if (currentItem) {
							return 'Sorting > 0 And RubricCategoryFk=' + currentItem.RubricCategoryFk;
						}
					}
				},
				{
					key: 'prc-invoice-business-partner-filter',
					serverSide: true,
					serverKey: 'prc-invoice-business-partner-filter',
					fn: function (currentItem) {
						var ids = [];
						if (currentItem && currentItem.ConHeaderFk) {
							var conHeaderView = _.find(basicsLookupdataLookupDescriptorService.getData('ConHeaderView'), {Id: currentItem.ConHeaderFk});
							var businessPartnerFk = conHeaderView.BusinessPartnerFk;
							var businessPartner2Fk = conHeaderView.BusinessPartner2Fk;

							if (businessPartnerFk) {
								ids.push(businessPartnerFk);
							}
							if (businessPartner2Fk) {
								ids.push(businessPartner2Fk);
							}
						}
						return {
							Ids: ids
						};
					}
				},
				{
					key: 'prc-invoice-supplier-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-supplier-common-filter',
					fn: function (currentItem) {
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
							SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
						};
					}
				},
				{
					key: 'prc-invoice-subsidiary-filter',
					serverSide: true,
					serverKey: 'businesspartner-main-subsidiary-common-filter',
					fn: function (currentItem) {
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
							SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
						};
					}
				},
				{
					key: 'prc-invoice-bank-filter',
					serverSide: true,
					fn: function (currentItem) {
						var filterStr = 'IsLive = true ';
						var statusFilter = service.businessPartnerBankStatus();
						if (statusFilter && statusFilter.length > 0) {
							var bankStatusFilter = '';
							angular.forEach(statusFilter, function (item) {
								if (bankStatusFilter !== '') {
									bankStatusFilter = bankStatusFilter + ' or ';
								}
								bankStatusFilter = bankStatusFilter + ' BpdBankStatusFk = ' + item.Id;
							});
							if (bankStatusFilter !== '') {
								filterStr = filterStr + ' And (' + bankStatusFilter + ')';
							}
						}
						if (currentItem === null) {
							filterStr = filterStr + ' And BusinessPartnerFk = -1 ';
						} else {
							filterStr = filterStr + ' And BusinessPartnerFk = ' + currentItem.BusinessPartnerFk;
						}
						return filterStr;
					}
				},
				{
					key: 'prc-invoice-header-project-filter',
					serverSide: true,
					fn: function () {
						// return 'IsLive = true And CompanyFk=' + moduleContext.loginCompany;
						return {
							IsLive: true,
							CompanyFk: moduleContext.loginCompany
						};
					}
				},
				{
					key: 'prc-invoice-package-filter',
					serverSide: true,
					fn: function (currentItem) {
						if (!currentItem) {
							return null;
						}

						return {
							ProjectFk: getProjectFk(currentItem, true)
						};
					}
				},
				{
					key: 'prc-invoice-controlling-unit-filter',
					serverSide: true,
					serverKey: 'prc.con.controllingunit.by.prj.filterkey',
					fn: function () {
						var parentItem = self.leadingService.getSelected();
						if (parentItem) {
							projectFk = getProjectFk(parentItem, true);
							return {
								ByStructure: true,
								ExtraFilter: true,
								PrjProjectFk: projectFk,
								CompanyFk: null
							};

						}
					}
				},
				{
					key: 'prc-invoice-con-header-filter',
					serverKey: 'prc-invoice-con-header-filter',
					serverSide: true,
					fn: function (entity) {
						/* var parentItem = self.leadingService.getSelected();
						 if(!parentItem){
						 return '';
						 }
						 var filter = 'StatusIsInvoiced = false and StatusIsCanceled = false and StatusIsVirtual = false and StatusIsOrdered = true and StatusIsDelivered = false';

						 var pesHeaderFk = 0;
						 if (!!parentItem.PesHeaderFk) {
						 pesHeaderFk = parentItem.PesHeaderFk;
						 } else {
						 if (!!parentItem.BusinessPartnerFk) {
						 filter += ' AND BusinessPartnerFk = ' + parentItem.BusinessPartnerFk;
						 filter += ' OR BusinessPartner2Fk = ' + parentItem.BusinessPartnerFk;
						 }
						 if (!!parentItem.ProjectFk) {
						 filter += ' AND ProjectFk = ' + parentItem.ProjectFk;
						 }
						 if (!!parentItem.PrcPackageFk) {
						 filter += ' AND PrcPackageFk = ' + parentItem.PrcPackageFk;
						 }
						 if (!!parentItem.ControllingUnitFk) {
						 filter += ' AND ControllingUnitFk = ' + parentItem.ControllingUnitFk;
						 }

						 if (!!parentItem.PrcStructureFk) {
						 filter += ' AND PrcStructureFk = ' + parentItem.PrcStructureFk;
						 }
						 }
						 return {
						 customerFilter: filter,
						 pesHeaderFk: pesHeaderFk
						 }; */
						var parentItem = self.leadingService.getSelected();
						if (!parentItem) {
							return {};
						}
						var filterObj = {
							StatusIsInvoiced: false,
							StatusIsCanceled: false,
							StatusIsVirtual: false,
							StatusIsOrdered: true,
							IsFramework: false
							// StatusIsDelivered: false
						};
						if (parentItem.PesHeaderFk) {
							filterObj.PesHeaderFk = parentItem.PesHeaderFk;
						} else {
							if (parentItem.BusinessPartnerFk) {
								filterObj.BusinessPartnerFk = parentItem.BusinessPartnerFk;
							}
							if (parentItem.ProjectFk) {
								filterObj.ProjectFk = parentItem.ProjectFk;
							}
							if (parentItem.PrcPackageFk) {
								filterObj.PrcPackageFk = parentItem.PrcPackageFk;
							}
							if (parentItem.ControllingUnitFk) {
								filterObj.ControllingUnit = parentItem.ControllingUnitFk;
							}
							if (parentItem.PrcStructureFk) {
								filterObj.PrcStructureFk = parentItem.PrcStructureFk;
							}
							if (entity && !Object.prototype.hasOwnProperty.call(entity,'InvHeaderFk')) {
								filterObj.ExcludeCalloffContracts = true;
							}
						}
						return filterObj;
					}
				},
				{
					key: 'prc-invoice-pes-header-filter',
					serverKey: 'prc-invoice-pes-header-filter',
					serverSide: true,
					fn: function (entity) {
						var parentItem = self.leadingService.getSelected();
						if (!parentItem) {
							parentItem = entity;
						}
						if (parentItem) {
							return {
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsInvoiced: false,
								StatusIsAccepted : true,
								ConHeaderFk: parentItem.ConHeaderFk,
								BusinessPartnerFk: parentItem.BusinessPartnerFk,
								ProjectFk: parentItem.ProjectFk,
								PrcPackageFk: parentItem.PrcPackageFk,
								ControllingUnitFk: parentItem.ControllingUnitFk,
								PrcStructureFk: parentItem.PrcStructureFk,
								CompanyFk: parentItem.CompanyFk,
								IncludeCalloffContracts: true
							};
						}
					}
				},
				{
					key: 'prc-invoice-header-filter',
					serverKey: 'prc-invoice-header-filter',
					serverSide: true,
					fn: function () {
						/* var parentItem = self.leadingService.getSelected();
						if(!parentItem){
							return '';
						}
						var filter = 'IsPosted = true and IsChained = false and IsCanceled = false';
						if (parentItem.Id) {
							filter += ' AND Id !=' + parentItem.Id;
						}
						if (parentItem.BusinessPartnerFk) {
							filter += ' AND BusinessPartnerFk = ' + parentItem.BusinessPartnerFk;
						}

						if (parentItem.ConHeaderFk) {
							filter += ' AND ConHeaderFk = ' + parentItem.ConHeaderFk;
						}

						return filter; */
						var parentItem = self.leadingService.getSelected();
						if (parentItem) {
							return {
								// wui: comment these filter, according to new requirement from product manager.
								// IsPosted: true,
								// IsChained: false,
								IsCanceled: false,
								Id: parentItem.Id,
								BusinessPartnerFk: parentItem.BusinessPartnerFk,
								ConHeaderFk: parentItem.ConHeaderFk
							};
						}
					}

				},
				{
					key: 'prc-con-controlling-by-prj-filter',
					serverKey: 'prc.con.controllingunit.by.prj.filterkey',
					serverSide: true,
					fn: function (entity) {
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
							CompanyFk: platformContextService.getContext().clientId
						};
					}
				},
				{
					key: 'invoice-other-filter',
					serverKey: 'invoice-other-filter',
					serverSide: true,
					fn: function (entity) {
						return {
							invoiceFk: entity.InvHeaderFk
						};
					}
				},
				{
					key: 'bas-currency-conversion-filter',
					serverSide: true,
					serverKey: 'bas-currency-conversion-filter',
					fn: function (currentItem) {
						return {companyFk: currentItem.CompanyFk};
					}
				},
				{
					key: 'procurement-invoice-item-fixed-asset-filter',
					serverSide: true,
					fn: function (currentItem) {
						if (currentItem && currentItem.IsAssetManagement) {
							var etmContextFk = $injector.get('prcInvoiceGetEtmCompanyContext').getEtmContextFk();
							return etmContextFk ? (' EtmContextFk = ' + etmContextFk) : ' EtmContextFk = -1';
						} else {
							return ' EtmContextFk = -1';
						}
					}
				},
				{
					key: 'prc-con-contact-filter',
					serverSide: true,
					serverKey: 'prc-con-contact-filter',
					fn: function (currentItem) {
						return {
							BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
							SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
						};
					}
				},
				{
					key: 'invoice-company-businesspostinggroup-filter',
					serverKey: 'business-partner-main-businesspostinggroup-filter',
					serverSide: true,
					fn: function (item) {
						if (_.isEmpty(item)) {
							return {
								BpdSubledgerContextFk: null
							};
						}
						var companies = basicsLookupdataLookupDescriptorService.getData('company');
						return {
							BpdSubledgerContextFk: companies[item.CompanyFk].SubledgerContextFk
						};
					}
				}
			];

			/**
			 * register all filters
			 * this method aways call in contract-controller.js when controller loaded.
			 */
			service.registerFilters = function registerFilters(leadingService) {
				self.leadingService = leadingService;
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			/**
			 * remove register all filters
			 * this method aways call in contract-controller.js when controller destroy event called.
			 */
			service.unRegisterFilters = function unRegisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			service.businessPartnerBankStatus = function businessPartnerBankStatus() {
				var statusData = basicsLookupdataLookupDescriptorService.getData('businesspartner.main.bankStatus');
				if (statusData === null || angular.isUndefined(statusData)) {
					basicsLookupdataLookupDescriptorService.loadData('businesspartner.main.bankStatus');
				}
				return _.filter(statusData, function (item) {
					return item.Sorting !== 0 && item.IsDisabled === false;
				});
			};
			service.cashGetBankFk = [];
			service.getBusinessPartnerBankFk = function getBusinessPartnerBankFk(entity, businessPartnerFk) {
				var defer = $q.defer();
				if (businessPartnerFk) {
					if (_.find(service.cashGetBankFk, {Id: businessPartnerFk})) {
						defer.resolve(true);
						return defer.promise;
					}
					entity.BankFk = null;
					setBankTypeFkAfterBankChange(entity, entity.BankFk);
					service.cashGetBankFk.push({Id: businessPartnerFk});
					var supplierId = entity.SupplierFk ? entity.SupplierFk : 0;
					return $http.get(globals.webApiBaseUrl + 'businesspartner/main/bank/getdefault4supplier?businessPartnerId=' + businessPartnerFk + '&supplierId=' + supplierId).then(
						function (res) {
							service.cashGetBankFk = _.filter(service.cashGetBankFk, function (e) {
								return e.Id !== businessPartnerFk;
							});
							var data = res.data;
							if (data) {
								basicsLookupdataLookupDescriptorService.attachData({'businesspartner.main.bank': [data]});
								entity.BankFk = data.Id;
								setBankTypeFkAfterBankChange(entity, entity.BankFk);
							}
						}
					);
				}
				else {
					defer.resolve(true);
					return defer.promise;
				}
			};

			service.getBankFkBySupplierFk = function getBankFkBySupplierFk(entity, value) {
				if (value) {
					if (_.find(service.cashGetBankFk, {Id: value})) {
						return;
					}
					service.cashGetBankFk.push({Id: value});
					$http.get(globals.webApiBaseUrl + 'businesspartner/main/supplier/getbankfkbysupplier?id=' + value).then(
						function (res) {
							service.cashGetBankFk = _.filter(service.cashGetBankFk, function (e) {
								return e.Id !== value;
							});
							var data = res.data;
							if (data) {
								entity.BankFk = data;
								setBankTypeFkAfterBankChange(entity, entity.BankFk);
							}
						}
					);
				}
			};

			function setBankTypeFkAfterBankChange(entity, bankFk) {
				if (bankFk) {
					var banks = basicsLookupdataLookupDescriptorService.getData('businesspartner.main.bank');
					let bank = null;
					if (banks) {
						bank = _.find(banks, {Id: bankFk});
						if (bank && bank.BankTypeFk) {
							entity.BpdBankTypeFk = bank.BankTypeFk;
						}
					}
					if (!bank) {
						basicsLookupdataLookupDescriptorService.getItemByKey('businesspartner.main.bank', bankFk, {lookupType: 'businesspartner.main.bank'})
							.then(function (item) {
								bank = item;
								if (bank) {
									basicsLookupdataLookupDescriptorService.updateData('businesspartner.main.bank', [bank]);
									entity.BpdBankTypeFk = bank.BankTypeFk || entity.BpdBankTypeFk;
								}
							});
					}
				}
				else {
					entity.BpdBankTypeFk = null;
				}
			}

			return service;
		}]);
})(angular);