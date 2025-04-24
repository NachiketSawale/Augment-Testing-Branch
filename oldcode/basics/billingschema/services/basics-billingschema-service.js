/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.billingschema';

	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaService
	 * @function
	 *
	 * @description
	 * basicsBillingSchemaService is the main data service for all billing schema related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsBillingSchemaService', ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {
			var sidebarSearchOptions = {
				serviceName: 'basicsBillingSchemaService',
				moduleName: moduleName,  // required for filter initialization
				enhancedSearchEnabled: true,
				pattern: '',
				useCurrentClient: false,
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: false,
				withExecutionHints: true
			};
			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/billingschema/',
						endRead: 'list',
						usePostForRead: true
					},
					presenter: {
						list: {
						}
					},
					dataProcessor: [
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'BillingSchemaDto', moduleSubModule: 'Basics.BillingSchema'
						})
					],
					actions: {
						delete: {},
						create: 'flat'
					},
					entityRole: {
						root: {
							descField: 'DescriptionInfo.Translated',
							itemName: 'BillingSchema',
							moduleName: 'cloud.desktop.moduleDisplayNameBillingSchema',
							addToLastObject: true,
							lastObjectModuleName: moduleName
						}
					},
					translation: {
						uid: 'basicsBillingSchemaService',
						title: 'basics.billingschema.billingSchemaListContainerTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'BillingSchemaDto', moduleSubModule: 'Basics.BillingSchema' }
					},
					entitySelection: {},
					longText: {
						relatedContainerTitle: 'basics.billingschema.billingSchemaListContainerTitle',
						relatedGridId: '0DE5C7C7D34D45A7A0EB39172FBD3796',
						longTextProperties: [{
							displayProperty: 'Remark',
							propertyTitle: 'basics.billingschema.entityRemark'
						}]
					},
					sidebarSearch: {options: sidebarSearchOptions}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			return serviceContainer.service;
		}]);
})(angular);