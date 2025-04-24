/**
 * Created by lvy on 4/17/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceHeaderParameterUIConfigService
	 * @description provides validation methods for instance header parameter
	 */
	angular.module(moduleName).service('constructionSystemMainInstanceHeaderParameterUIConfigService',
		['platformUIConfigInitService', 'constructionSystemMainUIConfigurationService',
			'constructionsystemMainTranslationService', 'platformUIStandardExtentService',

			function (platformUIConfigInitService, constructionSystemMainUIConfigurationService,
				constructionsystemMainTranslationService, platformUIStandardExtentService) {
				var layout = constructionSystemMainUIConfigurationService.getConstructionSystemMainInstanceHeaderParameterDetailLayout();
				platformUIConfigInitService.createUIConfigurationService({
					service: this,
					layout: layout,
					dtoSchemeId: { typeName: 'InstanceHeaderParameterDto', moduleSubModule: 'ConstructionSystem.Main' },
					translator: constructionsystemMainTranslationService
				});
				platformUIStandardExtentService.extend(this, layout.addition);
			}
		]);

})(angular);
