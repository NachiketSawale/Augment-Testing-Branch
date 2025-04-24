(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.factory('productionplanningMountingReq2BizPartnerDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory', 'productionplanningMountingRequisitionDataService', 'basicsCommonMandatoryProcessor'];

	function DataService(platformDataServiceFactory, parentService, basicsCommonMandatoryProcessor) {
		var container = {};

		var serviceInfo = {
			flatNodeItem: {
				module: module,
				serviceName: 'productionplanningMountingReq2BizPartnerDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/mounting/requisition/bizpartner/'
				},
				entityRole: {
					node: {
						itemName: 'Req2BizPartner',
						parentService: parentService
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var selected = parentService.getSelected();
							if (selected) {
								creationData.Id = selected.Id;
							}
						},
						handleCreateSucceeded: function (item) {
							var items = container.data.itemList;
							if (_.isArray(items) && items.length > 0) {
								item.Sorting = _.maxBy(items, 'Sorting').Sorting + 1;
							}
						}
					}
				}
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'Requisition2BizPartnerDto',
			moduleSubModule: 'ProductionPlanning.Mounting',
			validationService: 'productionplanningMountingReq2BizPartnerValidationService'
		});

		return container.service;
	}
})();
