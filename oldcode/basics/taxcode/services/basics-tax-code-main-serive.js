/*
 * Created by alm on 08.31.2020.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var basicsTaxCodeModule = angular.module('basics.taxcode');

	basicsTaxCodeModule.factory('basicsTaxCodeMainService', ['$injector', 'platformDataServiceFactory','basicsCommonMandatoryProcessor','ServiceDataProcessDatesExtension',

		function ($injector, platformDataServiceFactory,mandatoryProcessor,serviceDataProcessDatesExtension) {
			var basicsTaxCodeServiceOption = {
				flatRootItem: {
					module: basicsTaxCodeModule,
					serviceName: 'basicsTaxCodeMainService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/taxcode/', endCreate: 'createnew' },
					httpUpdate: {route: globals.webApiBaseUrl + 'basics/taxcode/', endUpdate: 'updatetx'},
					httpRead: {route: globals.webApiBaseUrl + 'basics/taxcode/', endRead: 'filtered',usePostForRead: true},
					httpDelete: {route: globals.webApiBaseUrl + 'basics/taxcode/', endDelete: 'deletetx'},
					entityRole: {
						root: {
							itemName: 'MdcTaxCode',
							moduleName: 'cloud.desktop.moduleDisplayNameBasicsTaxCode'
						}
					},
					translation: {
						uid: 'basicsTaxCodeMainService',
						title: 'basics.taxcode.entityTaxCodeTitle',
						columns: [{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						},{
							header: 'cloud.common.entityComment',
							field: 'CommentTranslateInfo'
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
							moduleName: 'basics.taxcode',
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
					},
					dataProcessor: [ new serviceDataProcessDatesExtension([ 'ValidFrom', 'ValidTo'])],
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsTaxCodeServiceOption);
			var service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'MdcTaxCodeDto',
				moduleSubModule: 'Basics.TaxCode',
				validationService: 'basicsTaxCodeValidationService',
				mustValidateFields: ['Code']
			});

			return service;

		}]);
})(angular);
