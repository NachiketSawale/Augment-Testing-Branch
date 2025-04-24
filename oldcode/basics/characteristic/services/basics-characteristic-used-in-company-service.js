(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicUsedInCompanyService
	 * @function
	 * @description
	 * basicsCharacteristicUsedInCompanyService is the data service for Characteristic Used In Company.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicUsedInCompanyService',
		[  '$http',
			'platformDataServiceFactory',
			'basicsCharacteristicMainService',
			'ServiceDataProcessArraysExtension',
			'basicsCompanyImageProcessor',
			function ($http,
			          platformDataServiceFactory,
			          basicsCharacteristicMainService,
			          ServiceDataProcessArraysExtension,
			          basicsCompanyImageProcessor) {

				var serviceContainer = null;
				var serviceOptions = {
					hierarchicalRootItem: {
						module: angular.module(moduleName),
						serviceName: 'basicsCharacteristicUsedInCompanyService',
						httpRead: {
							// route: globals.webApiBaseUrl + 'basics/characteristic/usedincompany/',
							// endRead: 'tree'
							useLocalResource: true,
							resourceFunction: function (p1, p2, onReadSucceeded) {

								var parentEntity = basicsCharacteristicMainService.getSelected() || {};
								var newGroup = parentEntity.Version === 0;
								var endPoint;

								if (newGroup && parentEntity.CharacteristicGroupFk !== null) {
									endPoint = 'tree?mainItemId=' + parentEntity.CharacteristicGroupFk;  // copy settings from the parent node
								}
								else {
									endPoint = 'tree?mainItemId=' + parentEntity.Id;
								}

								return $http.get(globals.webApiBaseUrl + 'basics/characteristic/usedincompany/' + endPoint).then(function(response) {
									if (newGroup) {
										// serviceContainer.service.setList(response.data);    // sets modified flag!
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
						dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
						presenter: {
							tree: {
								parentProp: 'CompanyFk',
								childProp: 'Companies'
							}
						},
						entityRole: {
							leaf: {
								itemName: 'UsedInCompany',
								parentService: basicsCharacteristicMainService
							}
						},
						modification: {
							multi: {}
						},
						actions:{
							delete:false,
							create:false
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				return serviceContainer.service;
			}
		]);
})(angular);