(function (angular) {

	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc service
	 * @name basicsCostGroupsContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCostgroupsContainerInformationService', ['$injector', 'basicsCostGroupsStandardConfigurationService', 'platformLayoutHelperService', 'basicsCostGroupsConstantValues',
		'basicsLookupdataConfigGenerator',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, basicsCostGroupsStandardConfigurationService, platformLayoutHelperService, basicsCostGroupsConstantValues, basicsLookupdataConfigGenerator) {

			var service = {};
			var self = this;
			var guids = basicsCostGroupsConstantValues.uuid.container;

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case guids.costGroupCatalogList:{
						let costGroupCatalogListConfig = {
							initCalled: false, columns: [],
							type: 'costGroupCatalog', dragDropService: $injector.get('basicsCommonClipboardService'),
						};
						config = platformLayoutHelperService.getStandardGridConfig(service.getCostGroupCatalogServiceInfo(), null, costGroupCatalogListConfig);
						break;
					}
					case guids.costGroupCatalogDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getCostGroupCatalogServiceInfo());
						break;
					case guids.costGroupList:
						var listConfig = {
							initCalled: false, columns: [], parentProp: 'CostGroupFk', childProp: 'ChildItems',
							type: 'costGroup', dragDropService: $injector.get('basicsCostGroupClipboardService'),
							cellChangeCallBack: function cellChangeCallBack(arg) {
								var field = arg.grid.getColumns()[arg.cell].field;
								if (field === 'LeadQuantityCalc' || field === 'NoLeadQuantity' || field ==='UomFk') {
									$injector.get('basicsCostGroupDataService').calculateQuantity(arg.item, field);
								}
							}
						};
						config = platformLayoutHelperService.getGridConfig(service.getCostGroupServiceInfo(), null, listConfig);
						break;
					case guids.costGroupDetails:
						config = platformLayoutHelperService.getStandardDetailConfig(service.getCostGroupServiceInfo());
						break;
				}

				return config;
			};

			service.getCostGroupCatalogServiceInfo = function getCostGroupCatalogServiceInfo() {
				return {
					standardConfigurationService: 'basiceCostGroupCatalogLayoutService',
					dataServiceName: 'basicsCostGroupCatalogDataService',
					validationServiceName: 'basicsCostGroupCatalogValidationService'
				};
			};

			service.getCostGroupCatalogLayout = function getCostGroupCatalogLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.costgroups.costgroupcatalog',
					['code', 'descriptioninfo','islive']);

				res.overloads = platformLayoutHelperService.getOverloads(['descriptioninfo'], self);
				res.addAdditionalColumns = true;

				return res;
			};

			service.getCostGroupServiceInfo = function getCostGroupServiceInfo() {
				return {
					standardConfigurationService: 'basicsCostGroupLayoutService',
					dataServiceName: 'basicsCostGroupDataService',
					validationServiceName: 'basicsCostGroupValidationService'
				};
			};

			service.getCostGroupLayout = function getCostGroupLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.costgroups.costgroup',
					['code', 'descriptioninfo', 'quantity', 'uomfk', 'referencequantitycode','leadquantitycalc','noleadquantity','islive']);

				res.overloads = platformLayoutHelperService.getOverloads(['code', 'uomfk', 'descriptioninfo','islive'], self);
				res.addAdditionalColumns = true;

				return res;
			};

			this.getOverload = function getOverloads(overload) {
				var ovl = null;

				switch (overload) {
					case 'code':
						ovl = {
							detail: {maxLength: 32},
							grid: {maxLength: 32}
						};
						break;
					case 'uomfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						});
						break;
					case 'descriptioninfo':
						ovl = {
							detail: {maxLength: 252},
							grid: {maxLength: 252}
						};
						break;
					case 'islive':
						ovl={
							readonly: true
						};
						break;
				}

				return ovl;
			};

			return service;
		}
	]);
})(angular);