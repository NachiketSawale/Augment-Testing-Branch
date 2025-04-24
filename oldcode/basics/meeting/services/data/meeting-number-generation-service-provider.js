/**
 * Created by chd on 5/10/2022.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.meeting';
	let meetingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name meetingNumberGenerationServiceProvider
	 * @description provides number generation services for meeting modules
	 */
	angular.module(moduleName).factory('meetingNumberGenerationServiceProvider', ['globals', '$q', '_', '$translate', 'platformDataServiceFactory',
		function (globals, $q, _, $translate, platformDataServiceFactory) {

			let numberGenerationService = function (serviceName) {
				let numberGenerationSettingInfo = {
					module: meetingModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/meeting/',
						endRead: 'numbergeneration'
					}
				};

				let container = platformDataServiceFactory.createNewComplete(numberGenerationSettingInfo);
				let service = container.service;
				container.data.dataLoaded = false;

				service.assertLoaded = function assertNumberGenerationSettingsLoaded() {
					let defer = $q.defer();
					service.load().then(
						function () {
							container.data.dataLoaded = true;
							defer.resolve(true);
						}
					);
					return defer.promise;

				};

				service.provideNumberDefaultText = function provideNumberDefaultText() {
					return $translate.instant('cloud.common.isGenerated');
				};

				service.assertLoaded();

				return service;
			};

			// service api
			return {
				getInstance: function getInstance(serviceName) {
					return numberGenerationService(serviceName);
				}
			};
		}

	]);

})(angular);

