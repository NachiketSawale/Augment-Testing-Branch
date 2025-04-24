(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.factory('productionplanningMountingReq2ContactDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory', 'productionplanningMountingReq2BizPartnerDataService',
		'basicsCommonMandatoryProcessor', 'platformGridAPI'];

	function DataService(platformDataServiceFactory, parentService,
	                     basicsCommonMandatoryProcessor, platformGridAPI) {
		var container = {};

		var serviceInfo = {
			flatLeafItem: {
				module: module,
				serviceName: 'productionplanningMountingReq2ContactDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/mounting/requisition/contact/'
				},
				entityRole: {
					leaf: {
						itemName: 'Req2Contact',
						parentService: parentService
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var selected = parentService.getSelected();
							if (selected) {
								creationData.Id = selected.Id;
								creationData.PKey1 = selected.BizPartnerFk;
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
			typeName: 'Requisition2ContactDto',
			moduleSubModule: 'ProductionPlanning.Mounting',
			validationService: 'productionplanningMountingReq2ContactValidationService'
		});

		container.service.refreshSelectedRow = function () {
			var selectedItem = container.service.getSelected();
			if (!_.isNil(selectedItem)) {
				platformGridAPI.rows.refreshRow({gridId: '3ffa784706a24bd99918b3d72ed52687', item: selectedItem});
			}
		};

		return container.service;
	}
})();
