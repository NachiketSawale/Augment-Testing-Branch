/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/* global angular, globals, _ */
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc service
	 * @name basicsCostGroupCatalogDataService
	 * @description pprovides methods to access, create and update basics costGroupCatalog entities
	 */
	angular.module(moduleName).service('basicsCostGroupCatalogDataService', BasicsCostGroupCatalogDataService);

	BasicsCostGroupCatalogDataService.$inject = ['$timeout', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'basicsCostGroupsConstantValues'];

	function BasicsCostGroupCatalogDataService($timeout, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                basicsCommonMandatoryProcessor, basicsCostGroupsConstantValues) {
		var self = this;

		var fromUriNavigation = false;

		var defaultPageSize = 100;
		var sidebarSearchOptions = {
			moduleName: moduleName,
			enhancedSearchEnabled: false,
			pattern: '',
			pageSize: defaultPageSize,
			useCurrentClient: null,
			includeNonActiveItems: null,
			showOptions: false,
			showProjectContext: false,
			withExecutionHints: false
		};

		var serviceOption = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'basicsCostGroupCatalogDataService',
				entityNameTranslationID: 'basics.costgroups.listCostGroupCatalogTitle',
				httpCreate: {route: globals.webApiBaseUrl + 'basics/costgroupcat/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/costgroupcat/',
					endRead: 'listfiltered',
					usePostForRead: true,
					extendSearchFilter: function (filterRequest) {
						if (filterRequest.furtherFilters && filterRequest.furtherFilters.navInfo) {
							fromUriNavigation = true;
						}
					}
				},
				httpUpdate: {route: globals.webApiBaseUrl + 'basics/costgroupcat/'},
				httpDelete: {route: globals.webApiBaseUrl + 'basics/costgroupcat/'},
				entitySelection: {},
				actions: {delete: {}, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					basicsCostGroupsConstantValues.schemes.costGroupCatalog)],
				presenter: {
					list: {
						initCreationData: function initCreationData() {
						}
					}
				},
				entityRole: {
					root: {
						itemName: 'CostGroupCatToSave',
						moduleName: 'cloud.desktop.moduleDisplayNameCostGroup',
						codeField: 'Code',
						descField: 'DescriptionInfo.Description'
					}
				},
				translation: {
					uid: 'basicsCostGroupCatalogDataService',
					title: 'basics.costgroups.listCostGroupCatalogTitle',
					columns: [{
						header: 'cloud.common.entityDescription',
						field: 'DescriptionInfo'
					}],
					dtoScheme: basicsCostGroupsConstantValues.schemes.costGroupCatalog
				},
				sidebarSearch: { options: sidebarSearchOptions},
				sidebarWatchList: { active: true }
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'basicsCostGroupCatalogValidationService'
		}, basicsCostGroupsConstantValues.schemes.costGroupCatalog));

		var onReadSucceeded = serviceContainer.data.onReadSucceeded;
		serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
			onReadSucceeded(readData, data);
			if(fromUriNavigation){
				fromUriNavigation = false;
				$timeout(function(){
					self.goToFirst();
				},0);
			}
			return readData;
		};

		serviceContainer.service.getConcurrencyConfig = function(){
			return {
				mainService: serviceContainer.service,
				mergeInClientSide: true,
				conflictConfigs : [{
					typeName:'CostGroupCatEntity',
					title: 'basics.costgroups.listCostGroupCatalogTitle',
					configurationService: 'basicsCostGroupCatalogUIStandardService',
					dataService: serviceContainer.service,
				},
				{
					typeName:'CostGroupEntity',
					title: 'basics.costgroups.listCostGroupTitle',
					configurationService: 'basicsCostGroupUIStandardService',
					dataService: 'basicsCostGroupDataService'
				}]
			};
		};

		return serviceContainer.service;
	}
})(angular);