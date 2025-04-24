/**
 * Created by baf on 27.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingConstantValues
	 * @function
	 *
	 * @description
	 * resourcePlantpricingConstantValues provides definitions and constants frequently used in resource plantpricing module
	 */
	angular.module(moduleName).value('resourcePlantpricingConstantValues', {
		schemes: {
			pricelistType: {typeName: 'PricelistTypeDto', moduleSubModule: 'Resource.Plantpricing'},
			pricelist: {typeName: 'PricelistDto', moduleSubModule: 'Resource.Plantpricing'},
			estPricelist: {typeName: 'EstPricelistDto', moduleSubModule: 'Resource.Plantpricing'}
		},
		uuid: {
			container: {
				pricelistTypeList: '03d826201fda4a318c0ac1d7937b3a81',
				pricelistTypeDetails: 'eed809fca1ab4cb9ab3df7964dd2d28c',
				pricelistList: 'b3e5fc95b1a6496c9d83fb923abf100b',
				pricelistDetails: 'bb28b8eba1604d95a1d0acc24f7b188d',
				estPricelistList: 'fb0d5f61d72e426c847cd01b0d74008d',
				estPricelistDetails: '69fc598b3b3645279ff52a862f4e0b45'
			}
		}
	});
})(angular);
