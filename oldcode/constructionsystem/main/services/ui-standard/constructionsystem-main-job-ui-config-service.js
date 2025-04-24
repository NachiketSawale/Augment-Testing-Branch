/**
 * Created by wui on 4/6/2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceUIConfigService
	 * @description provides validation methods for instance
	 */
	angular.module(moduleName).service('constructionSystemMainJobUIConfigService', [
		'platformUIConfigInitService',
		'constructionSystemMainUIConfigurationService',
		'constructionsystemMainTranslationService',
		function (platformUIConfigInitService, constructionSystemMainUIConfigurationService, constructionsystemMainTranslationService) {
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: constructionSystemMainUIConfigurationService.getConstructionSystemMainJobDetailLayout(),
				dtoSchemeId: {typeName: 'CosJobDto', moduleSubModule: 'ConstructionSystem.Main'},
				translator: constructionsystemMainTranslationService
			});
		}
	]);

})(angular);