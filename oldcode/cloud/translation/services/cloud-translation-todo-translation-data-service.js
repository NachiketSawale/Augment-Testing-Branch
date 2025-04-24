/**
 * Created by aljami on 12.03.2020
 */
(function (angular) {
	'use strict';
	const cloudTlsModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationTodoTranslationDataService
	 * @function
	 *
	 * @description
	 * cloudTranslationTodoTranslationDataService is a data service for managing todo translations
	 */
	cloudTlsModule.factory('cloudTranslationTodoTranslationDataService', ['$injector', '$http', 'platformDataServiceFactory', 'globals',

		function ($injector, $http, platformDataServiceFactory, globals) {

			const cloudTlsTodoTlsDataServiceOption = {
				flatLeafItem: {
					module: cloudTlsModule,
					serviceName: 'cloudTranslationTodoTranslationDataService',
					entityNameTranslationID: 'cloud.translation.toDoTranslationEntity',
					httpRead: {
						route: globals.webApiBaseUrl + 'cloud/translation/todo/',
						usePostForRead: false,
						endRead: 'list'
					},

					actions: {delete: false, create: false},
					entityRole: {
						root: {}
					},
					entitySelection: {},
					presenter: {
						list: {}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(cloudTlsTodoTlsDataServiceOption);
			const service = serviceContainer.service;

			service.loadTodoTranslations = function (culture) {
				return $http.get(globals.webApiBaseUrl + 'cloud/translation/todo/listfiltered?culture=' + culture).then(function (result) {
					return result.data;
				});
			};

			service.clearModifications = function (data) {
				serviceContainer.data.doClearModifications(null, data);
			};

			return service;
		}
	]);
})(angular);
