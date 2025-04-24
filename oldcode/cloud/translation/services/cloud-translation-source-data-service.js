/**
 * Created by baf on 2016-06-01
 */
(function () {
	'use strict';
	const cloudTlsModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationSourceDataService
	 * @function
	 *
	 * @description
	 * cloudTranslationSourceDataService is a data service for managing translation sources
	 */
	cloudTlsModule.factory('cloudTranslationSourceDataService', ['$injector', 'cloudTranslationResourceDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'globals',

		function ($injector, cloudTranslationResourceDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, globals) {

			const loadTranslationSources = function loadTranslationSources(data, readData, readDoneCallback) {
				if (data && data.itemList && data.itemList.length === 0) {
					data.httpReadRoute = globals.webApiBaseUrl + 'cloud/translation/source/';
					data.endRead = 'listSource';
					const httpServ = $injector.get('platformDataServiceHttpResourceExtension');

					return httpServ.readDataUsingHttpPost(readData, data, readDoneCallback);
				}

				return data.itemList || [];
			};

			const cloudTlsSourceDataServiceOption = {
				flatLeafItem: {
					module: cloudTlsModule,
					serviceName: 'cloudTranslationSourceDataService',
					entityNameTranslationID: 'basics.config.entitySource',
					// httpCreate: {route: globals.webApiBaseUrl + 'cloud/translation/source/', endCreate:'createSource'},
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadTranslationSources
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'SourceDto',
						moduleSubModule: 'Cloud.Translation'
					})],
					actions: {delete: true, create: false},
					entityRole: {
						leaf: {
							itemName: 'Languages',
							parentService: cloudTranslationResourceDataService
						}
					},
					modification: {multi: true},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.filter = '';
							}
						}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(cloudTlsSourceDataServiceOption);

			serviceContainer.service.assertSourcesLoaded = function assertLanguagesLoaded() {
				loadTranslationSources(serviceContainer.data, { filter: ''}, serviceContainer.data.handleReadSucceeded);
			};

			return serviceContainer.service;
		}
	]);
})();