/**
 * Created by zwz on 2019/12/9.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';
	/**
	 * @ngdoc service
	 * @name ppsCommonCustomColumnsServiceTranslationExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * ppsCommonCustomColumnsServiceTranslationExtension adds methods to translation service(like productionplanningCommonTranslationService and so on) for Custom Columns
	 *
	 */
	angular.module(moduleName).service('ppsCommonCustomColumnsServiceTranslationExtension', Extension);

	Extension.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function Extension(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		this.addMethodsForCustomColumnsTranslation = function (translationServ, data, moduleIds) {

			translationServ.setTranslationForCustomColumns = function () {
				// update data.words with customColumns words
				moduleIds.forEach(function (moduleId) {
					var customColumnsService = customColumnsServiceFactory.getService(moduleId);
					customColumnsService.setTranslation(data.words);
				});
				// for translations of customColumns, we need to "override" corresponding settings of translation service
				// 1. reset data.toTranslate
				data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
				// 2. reset interface of translation service with data
				platformTranslationUtilitiesService.addTranslationServiceInterface(translationServ, data);
				// 3. reload translations with data
				platformTranslationUtilitiesService.loadModuleTranslation(data);
			};
		};

	}
})(angular);
