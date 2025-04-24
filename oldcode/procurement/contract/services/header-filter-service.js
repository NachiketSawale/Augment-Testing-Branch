/**
 * Created by lnb on 10/21/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_, moment */
	angular.module('procurement.contract').factory('procurementContractHeaderFilterService', [
		'$q',
		'$http',
		'basicsLookupdataLookupFilterService',
		'platformContextService',
		'cloudDesktopSidebarService',
		'procurementContextService',
		'basicsLookupdataLookupDescriptorService',
		'$injector',
		'basicsLookupdataSimpleLookupService',
		function (
			$q,
			$http,
			basicsLookupdataLookupFilterService,
			platformContextService,
			sidebarService,
			moduleContext,
			basicsLookupdataLookupDescriptorService,
			$injector,
			basicsLookupdataSimpleLookupService) {
			var service = {};

			var getProjectFk = function getProjectFk(useCurrentFirst, currentItem) {
				return useCurrentFirst && currentItem ? currentItem.ProjectFk : platformContextService.getApplicationValue(sidebarService.appContextProjectContextKey);
			};

			// project filter
			var filters = [{
				key: 'prc-con-billing-schema-filter',
				serverSide: true,
				fn: function (currentItem) {
					if (!currentItem || !currentItem.Id) {
						return '1=2';
					}

					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcHeaderEntity.ConfigurationFk});

					return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
				}
			}, {
				key: 'prc-con-header-project-filter',
				serverSide: true,
				fn: function (currentItem) {
					if (currentItem.PackageFk) {
						return {PackageFk: currentItem.PackageFk};
					} else {
						return {};
					}
				}
			},
			{
				key: 'prc-con-quote-filter',
				serverKey: 'prc-con-quote-filter',
				serverSide: true,
				fn: function (currentItem) {
					return {ProjectFk: getProjectFk(true, currentItem)};
				}
			},
			// Basic data
			{
				key: 'prc-con-clerk-filter',
				serverSide: true,
				fn: function () {
					// currentItem = getCurrentItem();'CompanyFk=' + platformContextService.clientId +
					return 'IsLive=true';
				}
			},
			// Strategy
			{
				key: 'prc-con-strategy-filter',
				serverSide: true,
				fn: function (currentItem) {
					if (!currentItem || !currentItem.Id) {
						return {
							Id: -1
						};
					}

					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.PrcHeaderEntity.ConfigurationFk});

					return {
						PrcConfigheaderFk: config.PrcConfigHeaderFk
					};
				}
			},
			// supplier
			{
				key: 'prc-con-supplier-filter',
				serverSide: true,
				serverKey: 'businesspartner-main-supplier-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
						SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
					};
				}
			},
			// contact
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
			// contact2
			{
				key: 'prc-con-contact2-filter',
				serverSide: true,
				serverKey: 'prc-con-contact2-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartner2Fk : null,
						SubsidiaryFk: currentItem !== null ? currentItem.Subsidiary2Fk : null
					};
				}
			},
			// supplier2
			{
				key: 'prc-con-supplier2-filter',
				serverSide: true,
				serverKey: 'businesspartner-main-supplier-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartner2Fk : null,
						SubsidiaryFk: currentItem !== null ? currentItem.Subsidiary2Fk : null
					};
				}
			},
			// conSubsidiaryFilter
			{
				key: 'prc-con-subsidiary-filter',
				serverSide: true,
				serverKey: 'businesspartner-main-subsidiary-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
						SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
					};
				}
			},
			// conSubsidiary2Filter
			{
				key: 'prc-con-subsidiary2-filter',
				serverSide: true,
				serverKey: 'businesspartner-main-subsidiary-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartner2Fk : null,
						SupplierFk: currentItem !== null ? currentItem.Supplier2Fk : null

					};
				}
			},
			{
				key: 'prc-con-bank-filter',
				serverSide: true,
				fn: function (currentItem) {
					var filterStr = 'IsLive = true ';
					var filterService = $injector.get('procurementInvoiceHeaderFilterService');
					var statusFilter = filterService.businessPartnerBankStatus();
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
			// Material catalog
			{
				key: 'prc-con-material-catalog-filter',
				serverSide: true,
				filterIsFramework: true,
				fn: function (currentItem) {
					if (currentItem) {
						var dateOrdered = currentItem.DateOrdered || Date.now();
						var dateOrderedISO = 'DateTime(' + window.moment(dateOrdered).utc().format('YYYY,MM,DD') + ')';
						var filter = ' (Validfrom = null or Validfrom<=' + dateOrderedISO + ') ';
						filter += 'And (Validto=null or Validto>= ' + dateOrderedISO + ') ';
						if (service.isFrameworkCatalogTypes && service.isFrameworkCatalogTypes.length) {
							var  typeFilterStr = '(';
							_.forEach(service.isFrameworkCatalogTypes, function (catalogType, idx) {
								typeFilterStr += 'MaterialCatalogTypeFk = ' + catalogType.Id;
								if (service.isFrameworkCatalogTypes.length - 1 === idx) {
									typeFilterStr += ')';
								}
								else {
									typeFilterStr += ' or ';
								}
							});
							filter = typeFilterStr + ' And ' + filter;
						}
						else {
							filter = 'MaterialCatalogTypeFk = -1 And ' + filter;
						}
						return filter;
					}
					return '1=2';
				}
			},
			// controllingUnitFilter
			{
				key: 'prc-con-controlling-unit-filter',
				serverSide: true,
				serverKey: 'basics.masterdata.controllingunit.filterkey',
				fn: function (currentItem) {
					return {
						ProjectFk: getProjectFk(true, currentItem)
					};
				}
			},
			// package
			{
				key: 'prc-con-package-filter',
				serverSide: true,
				fn: function (currentItem) {
					// todo-wui: using new lookup search approach.
					return {
						ProjectFk: getProjectFk(true, currentItem),
						BasCompanyFk: currentItem.CompanyFk
					};
				}
			},
			// prjChange
			{
				key: 'prc-con-change-filter',
				serverSide: true,
				fn: function (currentItem) {
					return 'ProjectFk = ' + getProjectFk(true, currentItem);
				}
			},
			// conHeaderFilter
			{
				key: 'prc-con-header-filter',
				serverKey: 'prc-con-header-filter',
				serverSide: true,
				fn: function (currentItem) {
					/* var filter = 'ProjectFk=' + getProjectFk(true, currentItem);
							filter += ' And Id!=' + currentItem.Id || 0;
							return filter; */
					return {
						ProjectFk: getProjectFk(true, currentItem),
						Id: currentItem.Id || 0,
						ConHeaderFk: 0,
						IsFramework: false
					};
				}
			},
			{
				key: 'prc-con-configuration-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = ' + moduleContext.contractRubricFk;
				}
			},
			{
				key: 'prc-req-configuration-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = ' + moduleContext.requisitionRubricFk;
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
				key: 'prc-con-subsidiary-filter-for-order-proposal',
				serverSide: true,
				serverKey: 'businesspartner-main-subsidiary-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.bpdBusinessPartnerFk : null
					};
				}
			},
			{
				key: 'prc-con-supplier-filter-for-order-proposal',
				serverSide: true,
				serverKey: 'businesspartner-main-supplier-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.bpdBusinessPartnerFk : null
					};
				}
			},
			{
				key: 'prc-con-contact-filter-for-order-proposal',
				serverSide: true,
				serverKey: 'prc-con-contact-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.bpdBusinessPartnerFk : null
					};
				}
			},
			{
				key: 'prc-con-package-filter-for-order-proposal',
				serverSide: true,
				serverKey: 'prc-invoice-package-filter',
				fn: function (currentItem) {
					if (!currentItem) {
						return null;
					}
					return {
						ProjectFk: getProjectFk(true, currentItem)
					};
				}
			},
			// Master Restriction Material catalog
			{
				key: 'prc-con-master-restriction-material-catalog-filter',
				serverSide: true,
				fn: function (currentItem) {
					if (currentItem) {
						var dateOrdered = currentItem.DateOrdered || Date.now();
						var dateOrderedISO = 'DateTime(' + window.moment(dateOrdered).utc().format('YYYY,MM,DD') + ')';
						var filter = ' (Validfrom = null or Validfrom<=' + dateOrderedISO + ') ';
						filter += 'And (Validto=null or Validto>= ' + dateOrderedISO + ') ';
						return filter;
					}
					return '1=2';
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
				key: 'prc-contract-sales-contract-filter',
				serverSide: true,
				fn: function (item) {
					var filter = '';
					var currentItem = item;
					if (!currentItem) {
						return '';
					}

					if (currentItem.ProjectFk) {
						filter += ' ProjectFk=' + currentItem.ProjectFk;
					}

					return filter;
				}
			},
			{
				key: 'procurement-contract-businesspartner-businesspartner-filter',
				serverSide: true,
				serverKey: 'procurement-contract-businesspartner-businesspartner-filter',
				fn: function () {
					return {
						ApprovalBPRequired: true,
					};
				}
			},
			{
				key: 'procurement.contract.clerk-role-filter',
				serverSide: false,
				fn: function (currentItem) {
					return currentItem.IsForContract === true;
				}
			}, {
				key: 'prc-con-address-filter',
				serverSide: true,
				fn: function (currentItem) {
					return {
						ProjectFk: getProjectFk(true, currentItem),
						BasCompanyFk: currentItem.CompanyFk
					};
				}
			},
			{
				key: 'prc-con-wic-cat-boq-filter',
				serverSide: false,
				serverKey: 'prc-con-wic-cat-boq-filter',
				fn: function(entity) {
					var today = moment.utc().format('YYYY MM DD');
					if (
						(!_.has(entity, 'WicBoq.ValidFrom') || !entity.WicBoq.ValidFrom || (moment.utc(moment(entity.WicBoq.ValidFrom).format('YYYY MM DD')).isBefore(today) || moment.utc(moment(entity.WicBoq.ValidFrom).format('YYYY MM DD')).isSame(today))) &&
						(!_.has(entity, 'WicBoq.ValidTo') || !entity.WicBoq.ValidTo || (moment.utc(moment(entity.WicBoq.ValidTo).format('YYYY MM DD')).isAfter(today) || moment.utc(moment(entity.WicBoq.ValidTo).format('YYYY MM DD')).isSame(today)))
					) {
						return true;
					}
					return false;
				}
			}
			];
			service.getIsFrameworkTypes = function () {
				var catalogTypeLookupOptions = {
					displayMember: 'Description',
					valueMember: 'Id',
					lookupModuleQualifier: 'basics.materialcatalog.type',
					lookupType: 'basics.materialcatalog.type',
					filter: { customBoolProperty: 'ISFRAMEWORK' }
				};
				return basicsLookupdataSimpleLookupService.refreshCachedData(catalogTypeLookupOptions).then(function (res) {
					var promise;
					if (res && res.length) {
						var defer = $q.defer();
						defer.resolve(res);
						promise = defer.promise;
					}
					else if (res === false) {
						promise = basicsLookupdataSimpleLookupService.getList(catalogTypeLookupOptions);
					}
					promise.then(function (res2) {
						service.isFrameworkCatalogTypes = [];
						if (res2 && res2.length) {
							var types = _.orderBy(res2, ['Id']);
							types = _.filter(types, function (i) {
								return i.sorting && i.isLive && i.Isframework;
							});
							if (types && types.length) {
								service.isFrameworkCatalogTypes = types;
							}
						}
						basicsLookupdataLookupDescriptorService.removeData('isFrameworkCatalogType');
						if (service.isFrameworkCatalogTypes.length) {
							basicsLookupdataLookupDescriptorService.addData('isFrameworkCatalogType', service.isFrameworkCatalogTypes);
						}
					});
				});
			};
			service.getIsFrameworkTypes();
			/**
			 * register all filters
			 * this method aways call in contract-controller.js when controller loaded.
			 */
			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			/**
			 * remove register all filters
			 * this method aways call in contract-controller.js when controller destroy event called.
			 */
			service.unRegisterFilters = function unRegisterFilters() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			return service;
		}]);
})(angular);