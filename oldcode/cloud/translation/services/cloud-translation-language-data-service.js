/**
 * Created by baf on 2016-05-30
 */
(function () {
	'use strict';
	const cloudTlsModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationLanguageDataService
	 * @function
	 *
	 * @description
	 * cloudTranslationLanguageDataService is a data service for managing scripts applied in steps of generic wizards
	 */
	cloudTlsModule.factory('cloudTranslationLanguageDataService', ['$injector', '$http', 'cloudTranslationResourceDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'globals', 'cloudTranslationLanguageValidationService',

		function ($injector, $http, cloudTranslationResourceDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, globals, cloudTranslationLanguageValidationService) {

			const loadTranslationLanguages = function loadTranslationLanguages(data, readData, readDoneCallback) {
				if (data && data.itemList && data.itemList.length === 0) {
					data.httpReadRoute = globals.webApiBaseUrl + 'cloud/translation/language/';
					data.endRead = 'listLanguage';
					data.usePostForRead = true;
					const httpServ = $injector.get('platformDataServiceHttpResourceExtension');

					return httpServ.readDataUsingHttpPost(readData, data, readDoneCallback);
				}

				return data.itemList || [];
			};

			const cloudTlsLanguageDataServiceOption = {
				flatLeafItem: {
					module: cloudTlsModule,
					serviceName: 'cloudTranslationLanguageDataService',
					entityNameTranslationID: 'basics.config.entityTranslation',
					httpCreate: {
						route: globals.webApiBaseUrl + 'cloud/translation/language/',
						endCreate: 'createLanguage'
					},
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadTranslationLanguages
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TranslationDto',
						moduleSubModule: 'Cloud.Translation'
					}), cloudTranslationLanguageValidationService.getIsSystemProcessor()],
					actions: {delete: true, create: 'flat'},
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

			const serviceContainer = platformDataServiceFactory.createNewComplete(cloudTlsLanguageDataServiceOption);

			serviceContainer.service.assertLanguagesLoaded = function assertLanguagesLoaded() {
				loadTranslationLanguages(serviceContainer.data, { filter: ''}, serviceContainer.data.handleReadSucceeded);
			};

			serviceContainer.service.getLiveLanguages = function (){
				return $http.get(globals.webApiBaseUrl + 'cloud/translation/language/getLive').then(function (res){
					return (res.status === 200) ? res.data : [];
				});
			};

			return serviceContainer.service;
		}
	]);
})();