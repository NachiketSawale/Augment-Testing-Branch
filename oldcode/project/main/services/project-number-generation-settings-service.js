/**
 * Created by Frank Baedeker on 19.08.2015
 */
(function (angular) {
	/*global globals*/
	'use strict';

	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * projectLocationMainService is the data service for all location related functionality.
	 */
	projectMainModule.factory('projectMainNumberGenerationSettingsService', ['_', 'platformDataServiceFactory','platformTranslateService',

		function (_, platformDataServiceFactory, platformTranslateService) {

			var projectNumberGenerationSettingInfo = {
				module: projectMainModule,
				serviceName: 'projectMainNumberGenerationSettingsService',
				entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
				presenter: { list: {} },
				httpRead: { route: globals.webApiBaseUrl + 'project/main/numbergeneration/', endRead: 'list' }// jshint ignore:line
			};

			var container = platformDataServiceFactory.createNewComplete(projectNumberGenerationSettingInfo);
			var service = container.service;
			var data = container.data;

			service.hasToGenerateForRubricCategory = function hasToGenerateForRubricCategory(rcID) {
				var catSettings = _.find(data.itemList, { RubricCatID: rcID});

				return catSettings && catSettings.HasToCreate;
			};

			service.provideNumberDefaultText = function provideNumberDefaultText(rcID, current) {
				var translationObject = platformTranslateService.instant('cloud.common.isGenerated');
				var res = current;
				var catSettings = _.find(data.itemList, { RubricCatID: rcID});

				if(!catSettings) {
					res = '';
				}
				else if(catSettings.HasToCreate && current !== translationObject.cloud.common.isGenerated) {
					res = translationObject.cloud.common.isGenerated;
				}
				else if(!catSettings.HasToCreate){
					res = '';
				}

				return res;
			};

			return service;

		}]);
})(angular);
