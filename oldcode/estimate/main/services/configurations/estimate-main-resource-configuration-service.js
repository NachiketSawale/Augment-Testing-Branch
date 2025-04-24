/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainResourceConfigurationService
	 * @function
	 * @description
	 * estimateMainResourceConfigurationService is the data service for estimate line item resource data functions.
	 */
	angular.module(moduleName).factory('estimateMainResourceConfigurationService', [
		'$injector','$log', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'estimateMainUIConfigurationService', 'platformUIStandardExtentService',
		function ($injector, $log, platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, estimateMainUIConfigurationService, platformUIStandardExtentService) {

			function getResourceLayout(){
				let estimateMainResourceDetailLayout = estimateMainUIConfigurationService.getEstimateMainResourceDetailLayout();

				let codeEditorOptionsPath = 'code.grid.editorOptions.lookupOptions';
				let codeDetailOptionsPath = 'code.detail.options';

				let estresourcetypeshortkeyEditorOptionsPath = 'estresourcetypeshortkey.grid.editorOptions';

				if (_.has(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath)) {
					_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.usageContext', 'estimateMainResourceService');
					_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');
					_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateMainResourceDynamicUserDefinedColumnService');
					_.set(estimateMainResourceDetailLayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);
					_.set(estimateMainResourceDetailLayout.overloads, estresourcetypeshortkeyEditorOptionsPath + '.isTextEditable', true);

					_.set(estimateMainResourceDetailLayout.overloads, codeDetailOptionsPath + '.usageContext', 'estimateMainResourceService');
					_.set(estimateMainResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateMainResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');
					_.set(estimateMainResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateMainResourceDynamicUserDefinedColumnService');

					let descriptionInfoEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
					let descriptionInfoDetailOptionsPath = 'descriptioninfo.detail.options';

					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.usageContext', 'estimateMainResourceService');
					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoEditorOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');

					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.usageContext', 'estimateMainResourceService');
					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-main-resources-assembly-type-filter');
					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');
					_.set(estimateMainResourceDetailLayout.overloads, descriptionInfoDetailOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateMainResourceDynamicUserDefinedColumnService');

					let resourceDetail = {
						'grid': {
							editor: 'directive',
							editorOptions: {
								'directive': 'estimate-main-detail-column-directive',
							},
							'formatter': function (row, cell, value, columnDef, dataContext) {
								return  $injector.get('basicsCommonStringFormatService').detail2CultureFormatter(row, cell, value, columnDef, dataContext);
							},
							'grouping': {'generic': false}
						}
					};
					_.forEach($injector.get('estimateMainSystemVariablesHelperService').getUsingDetailColumns(), col =>{
						estimateMainResourceDetailLayout.overloads[col.toLowerCase()] = resourceDetail;
					});
				}

				return estimateMainResourceDetailLayout;
			}

			let BaseService = platformUIStandardConfigService;
			let estResourceDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'EstResourceDto', moduleSubModule: 'Estimate.Main'} );
			if(estResourceDomainSchema) {
				estResourceDomainSchema = estResourceDomainSchema.properties;
				estResourceDomainSchema.EstResourceTypeFkExtend = {domain: 'integer'};
				estResourceDomainSchema.PrcPackageStatusFk ={ domain : 'integer'};

				estResourceDomainSchema.Currency1Fk = {domain: 'integer'};
				estResourceDomainSchema.Currency2Fk = {domain: 'integer'};
				estResourceDomainSchema.CostExchangeRate1 = {domain: 'money'};
				estResourceDomainSchema.CostExchangeRate2 = {domain: 'money'};

				estResourceDomainSchema.BusinessPartner = {domain: 'string'};

				estResourceDomainSchema.Gc = {domain: 'money'};
				estResourceDomainSchema.Ga = {domain: 'money'};
				estResourceDomainSchema.Am = {domain: 'money'};
				estResourceDomainSchema.Rp = {domain: 'money'};
				estResourceDomainSchema.ItemInfo = { domain : 'string'};
				estResourceDomainSchema.ExternalCode = { domain : 'description'};
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			let service = new BaseService(getResourceLayout(), estResourceDomainSchema, estimateMainTranslationService);

			platformUIStandardExtentService.extend(service, getResourceLayout().addition);

			return service;
		}
	]);
})();
