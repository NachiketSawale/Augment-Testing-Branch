(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningTemplatesProductDataService
	 * @function
	 *
	 * @description
	 * productionplanningTemplatesProductDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.producttemplate';
	var module = angular.module(moduleName);

	module.factory('productionplanningTemplatesProductDataService', DataService);

	DataService.$inject = ['basicsLookupdataLookupDescriptorService',
		'productionplanningCommonProductDataServiceFactory',
		'productionplanningCommonProductValidationFactory',
		'productionplanningProducttemplateMainService',
		'productionplanningCommonStatusLookupService'];
	function DataService(basicsLookupdataLookupDescriptorService,
						 dataServiceFactory,
						 validationServiceFactory,
						 parentService,
						 statusService) {
		var commomPruductFk;
		var serviceOption = {
			flatNodeItem: {
				serviceName: 'productionplanningTemplatesProductDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'customlistbyforeignkey',
					initReadData: function initReadData(readData) {
						let mainItemId = parentService.getSelected().Id || -1;
						readData.filter = `?foreignKey=ProductDescriptionFk&mainItemId=${mainItemId}`;
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = readData.Main ? {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							} : readData;
							var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
							if (commomPruductFk) {
								service.setSelected(service.getItemById(commomPruductFk));
							}
							return dataRead;
						},

						initCreationData: function (creationData) {
							creationData.Id = parentService.getSelected().Id;
							creationData.PKey1 = parentService.getSelected().PpsStrandPatternFk;
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: parentService,
						parentFilter: 'descriptionFk'
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canDeleteCallBackFunc: function (selectedItem) {
						if (selectedItem.Version <= 0) {
							return true;
						}

						if(!_.isNil(selectedItem.PpsItemStockFk) && selectedItem.PpsItemStockFk !== selectedItem.ItemFk){
							return false;
						}

						if(selectedItem.ProductStatusFk){
							return statusService.allowProductToBeDeleted(serviceContainer.data.selectedEntities);
						}

						return false;
					}
				}
			},
			isNotRoot: true
		};

		/* jshint -W003 */
		var serviceContainer = dataServiceFactory.createService(serviceOption);
		var service = serviceContainer.service;

		service.selectItemByID = function selectItemByID(eventProductFk) {
			commomPruductFk = eventProductFk;
			var item = service.getItemById(eventProductFk);
			service.setSelected(item);
		};

		service.onEntityPropertyChanged = function (entity, field) {
			if (field === 'InstallSequence') {
				entity.UpdateInstallSequence = true;
			}
		};

		serviceContainer.data.newEntityValidator = validationServiceFactory.getNewEntityValidator(serviceContainer.service);

		return service;
	}
})(angular);

