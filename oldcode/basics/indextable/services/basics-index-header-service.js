/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let basicsIndexTableModule = angular.module('basics.indextable');

	/**
     * @ngdoc service
     * @name basicsIndexHeaderService
     * @function
     *
     * @description
     * basicsUnitMainService is the data service for all index header related functionality.
     */
	basicsIndexTableModule.factory('basicsIndexHeaderService', ['$translate', '$injector', 'platformDataServiceFactory', 'platformPermissionService', 'basicsIndexTableValidationProcessService',

		function ($translate, $injector, platformDataServiceFactory, platformPermissionService, basicsIndexTableValidationProcessService) {

			let basicsIndexHeaderServiceOption = {
				flatRootItem: {
					module: basicsIndexTableModule,
					serviceName: 'basicsIndexHeaderService',
					entityNameTranslationID: 'basics.indextable.indexHeaderTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/indexheader/',
						usePostForRead: true
					},
					translation: {
						uid: 'basicsIndexHeaderService',
						title: 'basics.indextable.indexHeaderTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					},
					entityRole: {
						root: {
							codeField: 'Code',
							itemName: 'IndexHeader',
							moduleName: 'cloud.desktop.indexTable'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function(result, data) {
								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'basics.indextable',
							enhancedSearchEnabled: false,
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

			let serviceContainer = platformDataServiceFactory.createNewComplete(basicsIndexHeaderServiceOption);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			data.newEntityValidator = basicsIndexTableValidationProcessService;

			return service;

		}]);
})(angular);

