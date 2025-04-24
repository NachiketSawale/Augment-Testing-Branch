/**
 * Created by zos on 10/28/2015.
 */
(function () {


	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	var moduleName = 'procurement.package';

	/**
	 * @ngdoc service
	 * @name packageEstimateResourceUIStandardService
	 * @function
	 *
	 * @description
	 * packageEstimateResourceUIStandardService is the config service for all estimate views.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('packageEstimateResourceUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService','procurementPackageUIConfigurationService', 'procurementPackageTranslationService',
			function (platformUIStandardConfigService, platformSchemaService, procurementPackageUIConfigurationService, translationService) {

				function getResourceLayout(){
					var estimateMainResourceDetailLayout = procurementPackageUIConfigurationService.getPackageEstResourceLayout();

					var codeEditorOptionsPath = 'code.grid.editorOptions';
					var codeDetailOptionsPath = 'code.detail.options';

					if (_.has(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath)) {
						_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.usageContext', 'estimateMainResourceService');
						_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
						_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);

						_.set(estimateMainResourceDetailLayout.overloads, codeDetailOptionsPath + '.usageContext', 'estimateMainResourceService');
						_.set(estimateMainResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');

						var descriptionInfoEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
						var descriptionInfoDetailOptionsPath = 'descriptioninfo.detail.options';

						_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.usageContext', 'estimateMainResourceService');
						_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');

						_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.usageContext', 'estimateMainResourceService');
						_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					}

					return estimateMainResourceDetailLayout;
				}

				var BaseService = platformUIStandardConfigService;
				var estResourceDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'} );
				if (estResourceDomainSchema) {
					estResourceDomainSchema = estResourceDomainSchema.properties;
					estResourceDomainSchema.EstResourceTypeFkExtend = {domain: 'integer'};
					estResourceDomainSchema.ExternalCode = { domain : 'description'};
				}
				function EstimateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

				return new BaseService(getResourceLayout(), estResourceDomainSchema, translationService);
			}
		]);
})();