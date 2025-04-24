/**
 * Created by jie on 15/03/2023.
 */
(function (angular) {
	'use strict';
	let moduleName='basics.company';
	angular.module(moduleName).factory('basicsCompanyICPartnerCardDataService',[
		'globals','_','platformDataServiceFactory','basicsCompanyMainService','platformRuntimeDataService','platformContextService','basicsLookupdataLookupFilterService','basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService',
		function (globals,_,platformDataServiceFactory,basicsCompanyMainService,platformRuntimeDataService,platformContextService,basicsLookupdataLookupFilterService,basicsCommonMandatoryProcessor,
			basicsLookupdataLookupDescriptorService) {
			var service = {};
			var basicsCompanyICPartnerCardOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: 'basicsCompanyICPartnerCardDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/icpartner/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsCompanyMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						// canCreateCallBackFunc: canCreate,
						// canDeleteCallBackFunc: canDelete,
					},
					entityRole: {
						node: {
							itemName: 'CompanyICPartner',
							parentService: basicsCompanyMainService,
							doesRequireLoadAlways: true
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
								serviceContainer.service.containerData = data;
								_.forEach(readData, function (item) {
									if (_.isNil(item.PrcConfigurationBilFk)) {
										platformRuntimeDataService.readonly(item, [{field: 'MdcBillSchemaBilFk', readonly: true}]);
									}
									if (_.isNil(item.PrcConfigurationInvFk)) {
										platformRuntimeDataService.readonly(item, [{field: 'MdcBillSchemaInvFk', readonly: true}]);
									}
								});
								return dataRead;
							},
							initCreationData: function initNumberCreationData(creationData) {
								var selected = basicsCompanyMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyICPartnerCardOption);
			service = serviceContainer.service;
			var onSelectionChanged = function onSelectionChanged() {
				var currentItem = service.getSelected();
				if(currentItem) {
					if (_.isNil(currentItem.PrcConfigurationBilFk)) {
						platformRuntimeDataService.readonly(currentItem, [{field: 'MdcBillSchemaBilFk', readonly: true}]);
					}
					if (_.isNil(currentItem.PrcConfigurationInvFk)) {
						platformRuntimeDataService.readonly(currentItem, [{field: 'MdcBillSchemaInvFk', readonly: true}]);
					}
					if (_.isNil(currentItem.BasCompanyPartnerFk) || currentItem.BasCompanyPartnerFk === 0) {
						platformRuntimeDataService.readonly(currentItem, [{field: 'PrcConfigurationInvFk', readonly: true}]);
					}
				}
			};

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CompanyICPartnerDto',
				moduleSubModule: 'Basics.Company',
				validationService: 'basicsCompanyICPartnerCardValidationServiceProcessor',
				mustValidateFields: ['BpdCustomerFk','BpdSupplierFk','BasCompanyPartnerFk']
			});
			var filters = [
				{
					key: 'basics-company-controlling-by-prj-filter',
					serverKey: 'bas.company.controllingunit.by.prj.filterkey',
					serverSide: true,
					fn: function (entity) {
						return {
							ByStructure: true,
							ExtraFilter: false,
							PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
							CompanyFk: entity.BasCompanyFk,
							IsCompanyReadonly:function func(){ return true;},
							FilterKey:'bas.company.controllingunit.by.prj.filterkey'
						};
					}
				},
				{
					key: 'basics-company-customerledger-group',
					serverKey: 'basics-company-customer-ledger-group-filter',
					serverSide: true,
					fn: function (item) {
						return {
							BasCompanyFk: item.BasCompanyFk
						};
					}
				},
				{
					key: 'basics-company-supplier-filter',
					serverSide: true,
					serverKey: 'basics-company-supplier-common-filter',
					fn: function (item) {
						return {
							BasCompanyFk: item.BasCompanyFk
						};
					}
				},
				{
					key: 'configuration-bil-filter',
					serverSide: true,
					fn: function (item) {
						return {
							RubricFk: 7,
							CompanyPartnerFk:item.BasCompanyFk
						};
					}
				},
				{
					key: 'billingSchema-bil-filter',
					serverSide: true,
					fn: function (item) {
						if (item && item.PrcConfigurationBilFk) {
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: item.PrcConfigurationBilFk});
							if(config){
								return 'Id=' + item.BasCompanyFk + ' AND PrcConfigHeaderFk='+ config.PrcConfigHeaderFk;
							}
						}
					}
				},
				{
					key: 'configuration-inv-filter',
					serverSide: true,
					fn: function (item) {
						return {
							RubricFk: 28,
							CompanyPartnerFk:item.BasCompanyFk
						};
					}
				},
				{
					key: 'billingSchema-inv-filter',
					serverSide: true,
					fn: function (item) {
						if (item && item.PrcConfigurationInvFk) {
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: item.PrcConfigurationInvFk});
							if(config){
								return 'Id=' + item.BasCompanyFk + ' AND PrcConfigHeaderFk='+config.PrcConfigHeaderFk;
							}
						}
					}
				}];
			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};
			service.unregisterFilters = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};
			service.registerFilters();
			service.registerSelectionChanged(onSelectionChanged);
			return  service;
		}
	]);
})(angular);