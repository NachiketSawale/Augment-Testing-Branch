(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicAutomaticAssignmentService
	 * @function
	 * @description
	 * basicsCharacteristicAutomaticAssignmentService is the data service for Characteristic Automatic Assignment.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicAutomaticAssignmentService',
		['platformDataServiceFactory', 'basicsCharacteristicCharacteristicService',
			function (platformDataServiceFactory, basicsCharacteristicCharacteristicService) {
				var serviceOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsCharacteristicAutomaticAssignmentService',
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/characteristic/automaticassignment/',
							endRead: 'list'
						},
						entityRole: {
							leaf: {
								itemName: 'AutomaticAssignment',
								parentService: basicsCharacteristicCharacteristicService
							}
						},
						actions: {
							delete: false,
							create: false
						}
						// dataProcessor: [basicsCharacteristicSectionTranslateProcessor]
					}
				};

				return platformDataServiceFactory.createNewComplete(serviceOptions).service;
			}
		]);
})(angular);