/* global  */
(function () {
	'use strict';
	var moduleName = 'defect.main';

	angular.module(moduleName).factory('defectMainStandardConfigurationService', ['platformUIStandardConfigService', 'defectMainTranslationService', 'platformSchemaService', 'defectMainHeaderLayout',

		function (platformUIStandardConfigService, defectMainTranslationService, platformSchemaService, defectMainHeaderLayout) {

			function getLayout(){
				defectMainHeaderLayout.overloads.quantitytotal = {};
				return defectMainHeaderLayout;
			}

			var BaseService = platformUIStandardConfigService;
			var defectDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'DfmDefectDto', moduleSubModule: 'Defect.Main'} );

			if(defectDomainSchema) {
				defectDomainSchema = defectDomainSchema.properties;
				defectDomainSchema.Info = { domain : 'image'};
				defectDomainSchema.Rule = { domain : 'imageselect'};
				defectDomainSchema.Param = { domain : 'imageselect'};
			}

			function DefectUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			DefectUIStandardService.prototype = Object.create(BaseService.prototype);
			DefectUIStandardService.prototype.constructor = DefectUIStandardService;

			return new BaseService( getLayout(), defectDomainSchema, defectMainTranslationService);
		}
	]);
})();
