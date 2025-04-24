/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {
	/* global globals */
	'use strict';
	var basicsSalesTaxCodeModule = angular.module('basics.salestaxcode');

	basicsSalesTaxCodeModule.factory('basicsSalesTaxMatrixService', ['$injector', 'platformDataServiceFactory', 'basicsSalesTaxCodeMainService','basicsCommonMandatoryProcessor',

		function ($injector, platformDataServiceFactory, parentService,basicsCommonMandatoryProcessor) {
			var basicsSalesTaxMatrixServiceOption = {
				flatLeafItem: {
					module: basicsSalesTaxCodeModule,
					serviceName: 'basicsSalesTaxMatrixService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/salestaxcode/salestaxmatrix/', endCreate: 'createnew' },
					httpUpdate: { route: globals.webApiBaseUrl + 'basics/salestaxcode/salestaxmatrix/', endUpdate: 'updatetcm'},
					httpRead: { route: globals.webApiBaseUrl + 'basics/salestaxcode/salestaxmatrix/', endRead: 'listtcm'},
					httpDelete: { route: globals.webApiBaseUrl + 'basics/salestaxcode/salestaxmatrix/', endDelete: 'deletetcm'},
					entityRole: {
						leaf: {
							itemName: 'MdcSalesTaxMatrix',
							parentService: parentService
						}
					},
					translation: {
						uid: 'basicsSalesTaxMatrixService',
						title: 'basics.salestaxcode.entitySalesTaxMatrixTitle',
						columns: [{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
					},
					presenter: {
						list: {
							handleCreateSucceeded: function initCreationData(newData) {
								var selectedItem = parentService.getSelected();
								if (selectedItem) {
									newData.SalesTaxCodeFk = selectedItem.Id;
								}
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsSalesTaxMatrixServiceOption);


			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'MdcSalesTaxMatrixDto',
				moduleSubModule: 'Basics.SalesTaxCode',
				validationService: 'basicsSalesTaxMatrixValidationService',
				mustValidateFields: ['SalesTaxGroupFk']
			});

			var service = serviceContainer.service;
			return service;

		}]);
})(angular);
