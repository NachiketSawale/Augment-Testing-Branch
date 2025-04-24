/**
 * Created by xsi on 2016-03-08.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceUIConfigService
	 * @description provides validation methods for instance
	 */
	angular.module(moduleName).service('constructionSystemMainInstanceUIConfigService',
		['platformUIConfigInitService', 'platformSchemaService', 'constructionSystemMainUIConfigurationService', 'constructionsystemMainTranslationService',

			function (platformUIConfigInitService, platformSchemaService, constructionSystemMainUIConfigurationService,
				constructionsystemMainTranslationService) {
				var dtoScheme = platformSchemaService.getSchemaFromCache({typeName: 'InstanceDto', moduleSubModule: 'ConstructionSystem.Main'}).properties;
				dtoScheme['ChangeOption.IsCopyLineItems'] = {domain: 'boolean'};
				dtoScheme['ChangeOption.IsMergeLineItems'] = {domain: 'boolean'};
				dtoScheme['ChangeOption.IsChange'] = {domain: 'boolean'};

				platformUIConfigInitService.createUIConfigurationService({
					service: this,
					layout: constructionSystemMainUIConfigurationService.getConstructionSystemMainInstanceDetailLayout(),
					dtoSchemeId: {typeName: 'InstanceDto', moduleSubModule: 'ConstructionSystem.Main'},
					translator: constructionsystemMainTranslationService
				});
			}
		]);

})(angular);