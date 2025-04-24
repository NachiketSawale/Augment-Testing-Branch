/**
 * Created by baf on 23.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc service
	 * @name resourceWotConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceWotConditionConstantValues provides definitions and constants frequently used in resource wot module
	 */
	angular.module(moduleName).value('resourceWotConstantValues', {
		schemes: {
			workOperationType: {typeName: 'WorkOperationTypeDto', moduleSubModule: 'Resource.Wot'},
			operationPlantType: {typeName: 'Operation2PlantTypeDto', moduleSubModule: 'Resource.Wot'}
		},
		uuid: {
			container: {
				workOperationTypeList: '5c10bdee259d4d9d87fd84a396183093',
				workOperationTypeDetails: '8c9b09fc5ce34a468e28cfaa40ece637',
				operationPlantTypeList: '8bf3d2a2d03a4ae99aab2ad090c77a53',
				operationPlantTypeDetails: '84f1b6d1a8d44840a5c13965dd32e411'
			}
		}
	});
})(angular);
