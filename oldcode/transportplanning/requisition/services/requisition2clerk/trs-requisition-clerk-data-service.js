(function () {
	'use strict';
	/*global angular, _*/

	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);
	module.factory('trsRequisitionClerkDataService', [
		'platformDataServiceProcessDatesBySchemeExtension', 'productionplanningCommonClerkProcessor',
		'transportplanningRequisitionMainService', 'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		function (platformDataServiceProcessDatesBySchemeExtension, clerkProcessor,
		          parentService, platformDataServiceFactory,
		          basicsCommonMandatoryProcessor) {
			var service;
			var serviceName = 'trsRequisitionClerkDataService';
			var serviceInfo = {
				flatLeafItem: {
					module: module,
					serviceName: serviceName,
					entityNameTranslationID: 'transportplanning.requisition.req2clerk.entityReq2Clerk',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'Requisition2ClerkDto',
						moduleSubModule: 'TransportPlanning.Requisition'
					}), clerkProcessor],
					httpCRUD: {
						route: globals.webApiBaseUrl + 'transportplanning/requisition/requisition2clerk/',
						endRead: 'list'
					},
					entityRole: {
						leaf: {
							itemName: 'Requisition2Clerk',
							parentService: parentService,
							parentFilter: 'requisitionId'
						}
					},
					actions: {
						create: 'flat',
						delete: true,
						canDeleteCallBackFunc: canDelete
					},
					presenter: {
						list: {

							initCreationData: function (creationData) {
								//set Id for creation
								var selected = parentService.getSelected();
								if (selected) {
									creationData.Id = selected.Id;
								}
							}
						}
					}
				}
			};

			function canDelete(selectedItem) {
				return _.isNil(selectedItem.From);
			}

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			service = container.service;
			container.data.usesCache = false;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Requisition2ClerkDto',
				moduleSubModule: 'TransportPlanning.Requisition',
				validationService: 'trsRequisitionClerkValidationService'
			});

			return service;
		}
	]);
})();