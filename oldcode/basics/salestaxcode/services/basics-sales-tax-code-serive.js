/*
 * Created by lcn on 11/4/2021.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var basicsSalesTaxCodeModule = angular.module('basics.salestaxcode');

	basicsSalesTaxCodeModule.factory('basicsSalesTaxCodeMainService', ['$injector', 'platformDataServiceFactory','basicsCommonMandatoryProcessor',

		function ($injector, platformDataServiceFactory,mandatoryProcessor) {
			var basicsSalesTaxCodeServiceOption = {
				flatRootItem: {
					module: basicsSalesTaxCodeModule,
					serviceName: 'basicsSalesTaxCodeMainService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/salestaxcode/', endCreate: 'createnew' },
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/salestaxcode/', endUpdate: 'updatetx'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/salestaxcode/', endRead: 'filtered',usePostForRead: true},
					httpDelete: {route: globals.webApiBaseUrl + 'basics/salestaxcode/', endDelete: 'deletetx'},
					entityRole: {
						root: {
							itemName: 'MdcSalesTaxCode',
							moduleName: 'cloud.desktop.moduleDisplayNameBasicsSalesTaxCode'
						}
					},
					translation: {
						uid: 'basicsSalesTaxCodeMainService',
						title: 'basics.salestaxcode.entitySalesTaxCodeTitle',
						columns: [{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
					},
					presenter: {
						list: {
							incorporateDataRead: function (result, data) {
								var res = serviceContainer.data.handleReadSucceeded(result, data);

								return res;
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'basics.salestaxcode',
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: null,
							pinningOptions: null,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsSalesTaxCodeServiceOption);
			var service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'MdcSalesTaxCodeDto',
				moduleSubModule: 'Basics.SalesTaxCode',
				validationService: 'basicsSalesTaxCodeValidationService',
				mustValidateFields: ['Code']
			});

			return service;

		}]);
})(angular);
