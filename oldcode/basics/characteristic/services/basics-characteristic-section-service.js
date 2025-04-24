(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicSectionService
	 * @function
	 * @description
	 * basicsCharacteristicSectionService is the data service for Characteristic Section.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicSectionService',
		[  '$http',
			'platformDataServiceFactory',
			'basicsCharacteristicMainService',
			function ($http,
			          platformDataServiceFactory,
			          basicsCharacteristicMainService) {
				var serviceContainer = null;
				var serviceFactoryOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsCharacteristicSectionService',
						httpRead: {
							// route: globals.webApiBaseUrl + 'basics/characteristic/section/',
							// endRead: 'list'
							useLocalResource: true,
							resourceFunction: function (p1, p2, onReadSucceeded) {

								var parentEntity = basicsCharacteristicMainService.getSelected() || {};
								var newGroup = parentEntity.Version === 0;
								var endPoint;

								if (newGroup) {
									if (parentEntity.CharacteristicGroupFk === null) { // root
										endPoint = 'list';  // offer all sections
									}
									else {
										endPoint = 'selected?mainItemId=' + parentEntity.CharacteristicGroupFk;  // offer only selected sections of the parent node
									}
								}
								else {
									endPoint = 'list?mainItemId=' + parentEntity.Id;
								}

								return $http.get(globals.webApiBaseUrl + 'basics/characteristic/section/' + endPoint).then(function(response) {
									if (newGroup) {
										serviceContainer.service.setList(response.data);    // sets modified flag!
									}
									else {
										onReadSucceeded(response.data, serviceContainer.data);
									}
								});

							}
						},
						entityRole: {
							leaf: {
								itemName: 'Section',
								parentService: basicsCharacteristicMainService
							}
						},
						actions:{
							delete:false,
							create:false
						}
						// dataProcessor: [basicsCharacteristicSectionTranslateProcessor]
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
				serviceContainer.service.validateModel = validateModel;

				function validateModel(currentItem, value, field) {
					if (field === 'Checked') {
						serviceContainer.service.markItemAsModified(currentItem);
					}

					return true;
				}
				return serviceContainer.service;
			}
		]);
})(angular);