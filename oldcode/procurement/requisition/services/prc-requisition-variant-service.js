/**
 * Created by alm on 5/26/2022.
 */

(function () {
	'use strict';
	let moduleName = 'procurement.requisition';

	angular.module(moduleName).factory('procurementRequisitionVariantService', ['globals','procurementRequisitionVariantReadonlyProcessor','basicsCommonMandatoryProcessor','platformDataServiceFactory', 'procurementRequisitionHeaderDataService',
		function (globals,readonlyProcessor, basicsCommonMandatoryProcessor, platformDataServiceFactory, mainDataService) {

			let serviceOptions = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementRequisitionVariantService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'procurement/requisition/variant/'
					},
					dataProcessor: [readonlyProcessor],
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						node: {
							itemName: 'RequisitionVariant',
							parentService: mainDataService
						}
					},
					actions:{
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: function () {
							return !mainDataService.getModuleState().IsReadonly;
						},
						canDeleteCallBackFunc: function () {
							return !mainDataService.getModuleState().IsReadonly;
						}
					}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = container.service;

			function incorporateDataRead(readItems, data) {
				return data.handleReadSucceeded(readItems, data, true);
			}

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ReqVariantDto',
				moduleSubModule: 'Procurement.Requisition',
				validationService: 'procurementRequisitionVariantValidationService',
				mustValidateFields: ['Code']
			});

			return service;
		}]);
})();
