(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.engineering';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringHeaderDataService
	 * @function
	 *
	 * @description
	 * productionplanningEngineeringHeaderDataService is the data service for engineering header.
	 */

	angModule.factory('productionplanningEngineeringHeaderDataService', productionplanningEngineeringHeaderDataService);
	productionplanningEngineeringHeaderDataService.$inject = [
		'$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'cloudDesktopSidebarService',
		'projectMainService',
		'productionplanningEngineeringHeaderStatusLookupService'

	];

	function productionplanningEngineeringHeaderDataService($injector, platformDataServiceFactory,
															platformDataServiceProcessDatesBySchemeExtension,
															basicsLookupdataLookupDescriptorService,
															basicsCommonMandatoryProcessor,
															cloudDesktopSidebarService,
															parentService,
															engHeaderStatusServ) {
		var serviceInfo = {
			flatNodeItem: {
				module: angModule,
				serviceName: 'productionplanningEngineeringHeaderDataService',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EngHeaderDto',
					moduleSubModule: 'ProductionPlanning.Engineering'
				})],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/header/',
					endRead: 'listbyproject',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = parentService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				entityRole: {
					node: {
						itemName: 'EngHeader',
						parentService: parentService,
						parentFilter: 'projectId'
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
						handleCreateSucceeded: function (newItem) {
							//set ClerkFk field by current logged user
							var clerkServ = $injector.get('basicsClerkUtilitiesService');
							clerkServ.getClientByUser().then(function (data) {
								if (data && data.Id !== 0 && data.Id !== null && data.Id !== undefined) {
									newItem.ClerkFk = data.Id;
								}
							});
						},
						initCreationData: function (creationData) {
							var selected = parentService.getSelected();
							if (selected) {
								creationData.Pkey1 = selected.Id;
							}
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canDeleteCallBackFunc: function (selectedItem) {
						//First, exclude situtation of "selected item is new unsaved"
						if (selectedItem.Version <= 0) {
							return true;
						}
						//Then, exclude situtation of "the status of selected item is invalid"
						if (!selectedItem.EngStatusFk) {
							return false;
						}

						//At last, return result(true or false) according to the valid status of selected item
						var statusList = engHeaderStatusServ.getList();
						var status = _.find(statusList, {Id: selectedItem.EngStatusFk});
						return status && status.Isdeletable;
					}
				},
				entityNameTranslationID: 'productionplanning.engineering.entityEngHeader'
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EngHeaderDto',
			moduleSubModule: 'ProductionPlanning.Engineering',
			validationService: 'productionplanningEngineeringHeaderValidationService',
			mustValidateFields: ['Code']
		});

		//for navigational function
		container.service.searchByCalId = function (id) {
			var item = container.service.getItemById(id);
			//if item is null(maybe because the service hasn't load data), then we search by it immediately.
			if (!item) {
				cloudDesktopSidebarService.filterSearchFromPKeys([id]);
			}
			else {
				container.service.setSelected(item);
			}
		};

		return container.service;

	}
})(angular);
