/**
 * Created by baf on 12.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplierConstantValues
	 * @function
	 *
	 * @description
	 * logisticPlantSupplierConstantValues provides definitions and constants frequently used in logistic plant-supplier module
	 */
	angular.module(moduleName).value('logisticPlantSupplierConstantValues', {
		schemes: {
			plantSupplier: { typeName: 'PlantSupplierDto', moduleSubModule: 'Logistic.Plantsupplier' },
			plantSupplyItem: { typeName: 'PlantSupplyItemDto', moduleSubModule: 'Logistic.Plantsupplier' }
		},
		uuid: {
			container: {
				plantSupplierList: 'e3d637f3ac74405d9b1bb6ad9e657533',
				plantSupplierDetails: 'ab47bC6a89d94ff5b6099ba32c4a584c',
				plantSupplyItemList: '6b48b5efc7074d6b970212972b484139',
				plantSupplyItemDetails: '5f1bee9c5ae844889ab4b40d47535a12'
			}
		},
		rubricId: 105
	});
})(angular);