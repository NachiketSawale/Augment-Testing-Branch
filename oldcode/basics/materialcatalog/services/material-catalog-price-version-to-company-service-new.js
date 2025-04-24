/**
 * Created by chi on 6/2/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersion2CompanyServiceNew', basicsMaterialCatalogPriceVersion2CompanyService);

	basicsMaterialCatalogPriceVersion2CompanyService.$inject = ['$http', 'platformDataServiceFactory', 'basicsMaterialCatalogPriceVersionService',
		'basicsCompanyImageProcessor', 'ServiceDataProcessArraysExtension', 'basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor'];

	function basicsMaterialCatalogPriceVersion2CompanyService($http, platformDataServiceFactory, basicsMaterialCatalogPriceVersionService,
		basicsCompanyImageProcessor, ServiceDataProcessArraysExtension, basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor) {
		var serviceContainer = null;
		var service = null;
		var serviceOptions = {
			hierarchicalRootItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialCatalogPriceVersion2CompanyServiceNew',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function (r1, r2, onReadSucceeded) {
						var parentEntity = basicsMaterialCatalogPriceVersionService.getSelected() || {};
						var newGroup = parentEntity.Version === 0;
						var catalogItem = basicsMaterialCatalogPriceVersionService.parentService().getSelected();
						if (!catalogItem) {
							onReadSucceeded([], serviceContainer.data);
							return;
						}
						var endPoint = 'tree?mainItemId=' + parentEntity.Id + '&mdcContextId=' + catalogItem.MdcContextFk;
						return $http.get(globals.webApiBaseUrl + 'basics/materialcatalog/priceversion2company/' + endPoint).then(function (response) {
							if (newGroup) {
								onReadSucceeded(response.data, serviceContainer.data);
								angular.forEach(serviceContainer.service.getList(), function (value) {
									if (value.Checked) {
										serviceContainer.service.markItemAsModified(value);
									}
								});
							}
							else {
								onReadSucceeded(response.data, serviceContainer.data);
							}
						});

					}
				},
				dataProcessor: [basicsMaterialCatalogPriceVersion2CompanyReadonlyProcessor, new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
				presenter: {
					tree: {
						parentProp: 'CompanyFk',
						childProp: 'Companies'
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Companies',
						parentService: basicsMaterialCatalogPriceVersionService
					}
				},
				modification: {
					multi: {}
				},
				actions: {
					delete: false,
					create: false
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		service = serviceContainer.service;

		service.fieldChangeCallBack = fieldChangeCallBack;
		return service;
		//////////////////////////
		function fieldChangeCallBack(arg) {
			var item = arg.item;

			var catalogItem = basicsMaterialCatalogPriceVersionService.parentService().getSelected();

			if (item.Companies && item.Companies.length > 0) {  // node has child items
				setStateRecursive(item, item.Checked);
			}

			////////////////
			function setStateRecursive(item, newState) {
				if(catalogItem.MdcContextFk === item.ContextFk){
					item.Checked = newState;
					service.markItemAsModified(item);
				}
				var len = item.Companies ? item.Companies.length : 0;
				for (var i = 0; i < len; i++) {
					setStateRecursive(item.Companies[i], newState);
				}
			}
		}
	}
})(angular);