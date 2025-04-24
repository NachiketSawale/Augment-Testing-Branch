/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.enterprise');

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseDispatcherDataService
	 * @description provides methods to access, create and update resource enterprise dispatcher entities
	 */
	myModule.service('resourceEnterpriseDispatcherDataService', ResourceEnterpriseDispatcherDataService);

	ResourceEnterpriseDispatcherDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension'];

	function ResourceEnterpriseDispatcherDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {
		var self = this;
		var resourceEnterpriseDispatcherServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceEnterpriseDispatcherDataService',
				entityNameTranslationID: 'resource.enterprise.dispatcherEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/enterprise/dispatcher/',
					usePostForRead: true,
					endRead: 'filtered'
				},
				actions: { create: false, delete: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'BasicsCustomizeLogisticsDispatcherGroupDTO',
					moduleSubModule: 'Basics.Customize'
				})],
				entityRole: {root: {itemName: 'Dispatcher', moduleName: 'cloud.desktop.moduleDisplayNameResourceEnterprise'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'resource.enterprise',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						useIdentification: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEnterpriseDispatcherServiceOption, self);
		serviceContainer.data.Initialised = true;
	}

})(angular);
