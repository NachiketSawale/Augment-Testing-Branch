(function (angular) {
	/* global globals,Platform */
	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserformFormDataListService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsUserformFormDataListService', [
		'$http',
		'basicsUserformMainService',
		'platformDataServiceFactory',
		'ServiceDataProcessDatesExtension',
		function (
			$http,
			basicsUserformMainService,
			platformDataServiceFactory,
			ServiceDataProcessDatesExtension) {

			var serviceFactoryOptions = {
				flatLeafItem: {
					serviceName: 'basicsUserformFormDataListService',
					httpCRUD: {route: globals.webApiBaseUrl + 'basics/userform/data/'},
					entityRole: {leaf: {itemName: 'FormData', parentService: basicsUserformMainService}},
					dataProcessor: [new ServiceDataProcessDatesExtension(['InsertedAt', 'UpdatedAt'])]
					// translation:{uid: 'basicsUserformMainService', title: 'Translation', colHeader: ['Description'], descriptors: ['DescriptionInfo']}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

			// region overloads

			// events
			serviceContainer.service.formDataDeleted = new Platform.Messenger();
			serviceContainer.service.createFormDataRequested = new Platform.Messenger();

			serviceContainer.service.createItem = function () {
				serviceContainer.service.createFormDataRequested.fire();
			};

			serviceContainer.service.deleteItem = function () {

				var entity = serviceContainer.service.getSelected();
				$http.get(globals.webApiBaseUrl + 'basics/userform/data/deletebyid?id=' + entity.Id).then(function () {
					serviceContainer.service.formDataDeleted.fire();
				});
			};

			// endregion

			return serviceContainer.service;

		}]);
})(angular);
