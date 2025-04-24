(function (angular){
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).constant('basicsMaterialFilterId', {
		catalogAndGroup: 'CatalogAndGroup',
		prcStructure: 'PrcStructure',
		catalogType: 'CatalogType',
		materialType: 'MaterialType',
		attribute: 'Attribute',
		uom: 'Uom',
		weightType: 'WEIGHT_TYPE',
		weightNumber: 'WEIGHT_NUMBER',
		priceList: 'PriceList',
	});

})(angular);