/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * Created by zwz on 7/25/2022.
 */
(function () {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.product';
	const module = angular.module(moduleName);
	module.factory('productionplanningProductCuttingProductDataService', DataService);
	DataService.$inject = ['productionplanningCommonStatusLookupService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService',
		'productionplanningCommonProductProcessor',
		'platformDataServiceFactory'];

	function DataService(statusService,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataLookupFilterService,
		platformRuntimeDataService,
		productionplanningCommonProductProcessor,
		platformDataServiceFactory) {

		let serviceContainer;
		const serviceInfo = {
			flatRootItem: {
				module: module + '.cuttingproduct',
				serviceName: 'productionplanningProductCuttingProductDataService',
				entityNameTranslationID: 'productionplanning.product.cuttingProduct.listTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/product/cuttingproduct/',
					endRead: 'filtered',
					usePostForRead: true
				},
				presenter: {
					list: { }
				},
				entityRole: {
					root: {
						itemName: 'CuttingProduct',
						moduleName: 'productionplanning.product.cuttingProduct.moduleDisplayNameCuttingProduct',
					}
				},

				actions: {
					delete: false,
					create: {}
				}

			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceInfo);

		return serviceContainer.service;

	}

})();