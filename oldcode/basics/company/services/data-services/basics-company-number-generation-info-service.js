(function (angular) {
	/*global globals*/
	'use strict';

	var moduleName = 'basics.company';
	var company = angular.module(moduleName);
	company.factory('basicsCompanyNumberGenerationInfoService', ['_', 'platformDataServiceFactory', 'platformTranslateService',

		function (_, platformDataServiceFactory, platformTranslateService) {

			var service = {
				getNumberGenerationInfoService: getNumberGenerationInfoService,
				serviceCache: {}
			};

			function getNumberGenerationInfoService(serviceName, rubricID) {
				if (!_.isString(serviceName)) {
					throw new Error('ServiceName is null');
				}

				if (_.isObject(service.serviceCache[serviceName])) {
					return service.serviceCache[serviceName];
				} else {
					if (!_.isNumber(rubricID)) {
						throw new Error('rubricID is null');
					}
					var rubricId = rubricID;
					var generationSettingInfo = {
						module: company,
						serviceName: serviceName,
						presenter: {list: {}},
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/company/number/', endRead: 'generationinfo',
							initReadData: function initNumberReadData(readData) {
								readData.RubricId = rubricId;
							},
							usePostForRead: true
						}
					};

					var container = platformDataServiceFactory.createNewComplete(generationSettingInfo);
					var serviceFacade = container.service;
					var data = container.data;


					serviceFacade.hasToGenerateForRubricCategory = function hasToGenerateForRubricCategory(rubricCategoryId) {
						var catSettings = _.find(data.itemList, {RubricCatID: rubricCategoryId});

						return catSettings && catSettings.HasToCreate;
					};

					serviceFacade.provideNumberDefaultText = function provideNumberDefaultText(rubricCategoryId, current) {
						var translationObject = platformTranslateService.instant('cloud.common.isGenerated');
						var res = current;
						var catSettings = _.find(data.itemList, {RubricCatID: rubricCategoryId});

						if (!catSettings) {
							res = '';
						} else if (catSettings.HasToCreate && current !== translationObject.cloud.common.isGenerated) {
							res = translationObject.cloud.common.isGenerated;
						} else if (!catSettings.HasToCreate) {
							res = '';
						}

						return res;
					};
					
					service.serviceCache[serviceName] = serviceFacade;
					return serviceFacade;
				}
			}

			return service;


		}]);
})(angular);
