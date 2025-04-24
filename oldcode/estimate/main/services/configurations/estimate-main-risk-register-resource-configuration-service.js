
(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainRiskRegisterResourceConfigurationService
     * @function
     * @description
     * estimateMainRiskRegisterResourceConfigurationService is the data service for risk register resource data functions.
     */
	angular.module(moduleName).factory('estimateMainRiskRegisterResourceConfigurationService', [
		'$log', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'basicsRiskregisterResourcesUIConfiguration',
		function ($log, platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, basicsRiskregisterResourcesUIConfiguration) {

			function getResourceLayout(){
				let estimateRiskResourceDetailLayout = basicsRiskregisterResourcesUIConfiguration;

				let codeEditorOptionsPath = 'code.grid.editorOptions';
				let codeDetailOptionsPath = 'code.detail.options';

				if (_.has(estimateRiskResourceDetailLayout.overloads, codeEditorOptionsPath)) {
					_.set(estimateRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.usageContext', 'estimateMainRiskResourcesDataService');
					_.set(estimateRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);
					_.set(estimateRiskResourceDetailLayout.overloads, codeEditorOptionsPath + '.useMasterData', true);

					_.set(estimateRiskResourceDetailLayout.overloads, codeDetailOptionsPath + '.usageContext', 'estimateMainRiskResourcesDataService');
					_.set(estimateRiskResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateRiskResourceDetailLayout.overloads, codeDetailOptionsPath + '.useMasterData', true);

					let descriptionInfoEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
					let descriptionInfoDetailOptionsPath = 'descriptioninfo.detail.options';

					_.set(estimateRiskResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.usageContext', 'estimateMainRiskResourcesDataService');
					_.set(estimateRiskResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateRiskResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.useMasterData', true);

					_.set(estimateRiskResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.usageContext', 'estimateMainRiskResourcesDataService');
					_.set(estimateRiskResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateRiskResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.useMasterData', true);
				}

				let resourceTypeEditorOptionsPath = 'estresourcetypefk.grid.editorOptions';
				if (_.has(estimateRiskResourceDetailLayout.overloads, resourceTypeEditorOptionsPath)) {
					_.set(estimateRiskResourceDetailLayout.overloads, resourceTypeEditorOptionsPath + '.usageContext', 'estimateMainRiskResourcesDataService');

				}
				let resourceTypeDetailOptionsPath = 'estresourcetypefk.detail.options';
				if (_.has(estimateRiskResourceDetailLayout.overloads, resourceTypeDetailOptionsPath)) {
					_.set(estimateRiskResourceDetailLayout.overloads, resourceTypeDetailOptionsPath + '.usageContext', 'estimateMainRiskResourcesDataService');

				}

				return estimateRiskResourceDetailLayout;
				// return basicsRiskregisterResourcesUIConfiguration;
			}

			let BaseService = platformUIStandardConfigService;
			let estimateRiskResourceDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'RiskResourcesDto', moduleSubModule: 'Basics.RiskRegister'} );
			if(estimateRiskResourceDomainSchema) {
				estimateRiskResourceDomainSchema = estimateRiskResourceDomainSchema.properties;
				// basicsRiskResourceDomainSchema.EstResourceTypeFk = {domain: 'integer'};
			}
			function EstimateRiskResourceUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateRiskResourceUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateRiskResourceUIStandardService.prototype.constructor = EstimateRiskResourceUIStandardService;

			return new BaseService(getResourceLayout(), estimateRiskResourceDomainSchema, estimateMainTranslationService);
		}
	]);
})();
