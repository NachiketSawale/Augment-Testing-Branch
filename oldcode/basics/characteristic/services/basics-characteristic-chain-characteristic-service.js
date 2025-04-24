(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 * @description
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicChainCharacteristicService',
		['platformDataServiceFactory',
			'basicsCharacteristicCharacteristicService',
			function (platformDataServiceFactory,
			          basicsCharacteristicCharacteristicService) {
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsCharacteristicChainCharacteristicService',
						httpCreate: {
							route: globals.webApiBaseUrl + 'basics/characteristic/chain/'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/characteristic/chain/',
							endRead: 'list'
						},
						entityRole: {
							leaf: {
								itemName: 'CharacteristicChain',
								parentService: basicsCharacteristicCharacteristicService
							}
						},
						actions: {
							delete: true,
							create: 'flat'
						}
					}
				};

				return platformDataServiceFactory.createNewComplete(serviceOptions).service;
			}
		]);
})(angular);