/**
 * Created by anl on 8/12/2022.
 */
(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemProductTemplateService', ProductTemplateService);

	ProductTemplateService.$inject = ['$injector', 'productionplanningItemDataService',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService'];

	function ProductTemplateService($injector, itemDataService,
		platformDataServiceFactory,
		lookupDescriptorService) {

		let serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'productionplanningItemProductTemplateService',
				entityNameTranslationID: 'productionplanning.producttemplate.entityProductDescription',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/',
					endRead: 'list',
					usePostForRead: true,
					initReadData: function(readData) {
						const parentItem = itemDataService.getSelected();
						readData.Id = parentItem && parentItem.ProductDescriptionFk ? parentItem.ProductDescriptionFk : -1;
						return readData;
					}
				},
				//dataProcessor: [readonlyProcessor],
				entityRole: {
					leaf: {
						itemName: 'ProductTemplate',
						parentService: itemDataService
					}
				},
				actions: {}
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		let service = serviceContainer.service;

		const onListLoaded = (items) => {
			service.setSelected(items && items.length > 0 ? items[0] : null);
		};

		service.registerListLoaded(onListLoaded);

		service.handleFieldChanged = function(entity, field) {
			if (field === 'Code') {
				const selectedParent = itemDataService.getSelected();
				selectedParent.ProductDescriptionCode = entity.Code;
				itemDataService.gridRefresh();
			}
		};

		return service;
	}
})(angular);