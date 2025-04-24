(function (){
	'use strict';
	/* global angular */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsProductGenericDocumentDataService', [
		'ppsCommonGenericDocumentDataServiceFactory', 'platformRuntimeDataService',
		function (dataServiceFactory, platformRuntimeDataService){
			let serviceOptions = {
				module: 'productionplanning.product',
				entityNameTranslationID: 'productionplanning.product.documentListTitle',
				serviceName: 'ppsProductGenericDocumentDataService',
				parentServiceName: 'productionplanningProductMainService',
				url: 'productionplanning/common/product/document/',
				parentFilter: 'productFk',
				uploadServiceKey: 'pps-product',
				createBtn: true,
				deleteBtn: true,
				readonlyKeys: 'PRODUCTTEMPLATE',
				dataProcessor: [{
					processItem: (item) => {
						if (item.Version > 0) {
							platformRuntimeDataService.readonly(item, [{field: 'From', readonly: true}]);
						}
					}
				}]
			};
			return dataServiceFactory.getOrCreateService(serviceOptions);
		}
	]);
})();