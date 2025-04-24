/**
 * Created by xsi on 2016-03-11.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceParameterUIConfigService
	 * @description provides validation methods for instance parameter
	 */
	angular.module(moduleName).service('constructionSystemMainInstanceParameterUIConfigService',
		['platformUIConfigInitService', 'constructionSystemMainUIConfigurationService',
			'constructionsystemMainTranslationService', 'platformUIStandardExtentService',

			function (platformUIConfigInitService, constructionSystemMainUIConfigurationService,
				constructionsystemMainTranslationService, platformUIStandardExtentService) {
				var layout = constructionSystemMainUIConfigurationService.getConstructionSystemMainInstanceParameterDetailLayout();
				platformUIConfigInitService.createUIConfigurationService({
					service: this,
					layout: layout,
					dtoSchemeId: {typeName: 'InstanceParameterDto', moduleSubModule: 'ConstructionSystem.Main'},
					translator: constructionsystemMainTranslationService
				});
				platformUIStandardExtentService.extend(this, layout.addition);
			}
		]);

})(angular);
