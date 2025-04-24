
(function () {
	/*global angular,_*/
	'use strict';
	var moduleName = 'basics.riskregister';

	/**
	 * @ngdoc service
	 * @name basicsRiskregisterResourceConfigurationService
	 * @function
	 * @description
	 * basicsRiskregisterResourceConfigurationService is the data service for risk register resource data functions.
	 */
	angular.module(moduleName).factory('basicsRiskregisterResourceConfigurationService', [
		'$log', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'basicsRiskregisterResourcesUIConfiguration',
		function ($log, platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, basicsRiskregisterResourcesUIConfiguration) {

			function getResourceLayout(){
				var basicsRiskResourceDetailLayout = basicsRiskregisterResourcesUIConfiguration;

				var codeEditorOptionsPath = 'code.grid.editorOptions';
				var codeDetailOptionsPath = 'code.detail.options';

				if (_.has(basicsRiskResourceDetailLayout.overloads, codeEditorOptionsPath)) {
					_.set(basicsRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.usageContext', 'basicsRiskregisterResourcesDataService');
					_.set(basicsRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(basicsRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);
					_.set(basicsRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.useMasterData', true);

					_.set(basicsRiskResourceDetailLayout.overloads, codeDetailOptionsPath + '.usageContext', 'basicsRiskregisterResourcesDataService');
					_.set(basicsRiskResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(basicsRiskResourceDetailLayout.overloads, codeDetailOptionsPath + '.useMasterData', true);

					var descriptionInfoEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
					var descriptionInfoDetailOptionsPath = 'descriptioninfo.detail.options';

					_.set(basicsRiskResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.usageContext', 'basicsRiskregisterResourcesDataService');
					_.set(basicsRiskResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(basicsRiskResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.useMasterData', true);

					_.set(basicsRiskResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.usageContext', 'basicsRiskregisterResourcesDataService');
					_.set(basicsRiskResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(basicsRiskResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.useMasterData', true);
				}

				var resourceTypeEditorOptionsPath = 'estresourcetypefk.grid.editorOptions';
				if (_.has(basicsRiskResourceDetailLayout.overloads, resourceTypeEditorOptionsPath)) {
					_.set(basicsRiskResourceDetailLayout.overloads, resourceTypeEditorOptionsPath + '.usageContext', 'basicsRiskregisterResourcesDataService');

				}
				var resourceTypeDetailOptionsPath = 'estresourcetypefk.detail.options';
				if (_.has(basicsRiskResourceDetailLayout.overloads, resourceTypeDetailOptionsPath)) {
					_.set(basicsRiskResourceDetailLayout.overloads, resourceTypeDetailOptionsPath + '.usageContext', 'basicsRiskregisterResourcesDataService');

				}

				return basicsRiskResourceDetailLayout;
				//return basicsRiskregisterResourcesUIConfiguration;
			}

			var BaseService = platformUIStandardConfigService;
			var basicsRiskResourceDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'RiskResourcesDto', moduleSubModule: 'Basics.RiskRegister'} );
			if(basicsRiskResourceDomainSchema) {
				basicsRiskResourceDomainSchema = basicsRiskResourceDomainSchema.properties;
				//basicsRiskResourceDomainSchema.EstResourceTypeFk = {domain: 'integer'};
			}
			function BasicsRiskResourceUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BasicsRiskResourceUIStandardService.prototype = Object.create(BaseService.prototype);
			BasicsRiskResourceUIStandardService.prototype.constructor = BasicsRiskResourceUIStandardService;

			return new BaseService(getResourceLayout(), basicsRiskResourceDomainSchema, estimateMainTranslationService);
		}
	]);
})();
