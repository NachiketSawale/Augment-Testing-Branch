/**
 * Created by clv on 2/8/2018.
 */
(function (angular){

	'use strict';

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).service('constructionSystemMasterObject2ParamUIStandardService',
		['platformUIConfigInitService','constructionSystemMasterObject2ParamDetailLayout',
			'platformUIStandardExtentService', 'constructionsystemMainTranslationService',

			function (platformUIConfigInitService, layout,
				platformUIStandardExtentService, TranslationService){

				platformUIConfigInitService.createUIConfigurationService({
					service: this,
					layout: layout,
					dtoSchemeId: {typeName: 'Instance2ObjectParamDto', moduleSubModule: 'ConstructionSystem.Main'},
					translator: TranslationService
				});

				platformUIStandardExtentService.extend(this, layout.addition);

			}]);
})(angular);