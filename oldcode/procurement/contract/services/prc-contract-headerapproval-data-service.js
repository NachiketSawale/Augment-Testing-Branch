/**
 * Created by leo on 10.09.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('procurement.contract');
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name procurementContractHeaderApprovalDataService
	 * @description pprovides methods to access, create and update prc contract headerapproval entities
	 */
	myModule.service('procurementContractHeaderApprovalDataService', PrcContractHeaderapprovalDataService);

	PrcContractHeaderapprovalDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'procurementContractHeaderDataService','procurementContextService'];

	function PrcContractHeaderapprovalDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, procurementContractHeaderDataService,procurementContextService) {
		var self = this;
		var prcContractHeaderapprovalServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'procurementContractHeaderApprovalDataService',
				entityNameTranslationID: 'procurement.contract.entityApprovalId',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'procurement/contract/headerapproval/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = procurementContractHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = procurementContractHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Approval', parentService: procurementContractHeaderDataService}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName: 'ConHeaderApprovalDto', moduleSubModule: 'Procurement.Contract'})]
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(prcContractHeaderapprovalServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
