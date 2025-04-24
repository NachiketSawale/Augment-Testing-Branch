(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc service
	 * @name resourceCatalogConstantValues
	 * @function
	 *
	 * @description
	 * resourceCatalogConstantValues provides definitions and constants frequently used in resource skill module
	 */
	angular.module(moduleName).value('resourceCatalogConstantValues', {
		schemes: {
			catalog: {typeName: 'CatalogDto', moduleSubModule: 'Resource.Catalog'},
			catalogRecord: {typeName: 'CatalogRecordDto', moduleSubModule: 'Resource.Catalog'},
			priceIndex: {typeName: 'CatalogPriceIndexDto', moduleSubModule: 'Resource.Catalog'}
		},
		uuid: {
			container: {
				catalogList: 'd6267b2141db4c6f831d20c3f95f48f9',
				catalogDetail: 'd5983c44f2e243e4971ba9c82a73f0b0',
				catalogRecordList: 'bae34453f83744d3a6f7e53b7851e657',
				catalogRecordDetail: 'b6d25f959003460cbf03529c91ad5894',
				priceIndexList: '99a21ea527b44736892593accc5e6b6f',
				priceIndexDetail: '85f0ed0cc8b3488297e3b411b17e5a5b',
				translation: 'c3471218f5694e6f89273acee90547be'
			}
		}
	});
})(angular);
