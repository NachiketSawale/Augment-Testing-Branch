/**
 * $Id: resource-equipment-estimate-resource-configuration-service.js 22837 2021-12-16 21:32:19Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateResourceConfigurationService
	 * @function
	 *
	 * @description
	 * This is the config service for all plant assembly's Reesource views.
	 */
	angular.module(moduleName).factory('resourcePlantEstimateResourceConfigurationService',
		['$log', 'platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'estimateAssembliesResourceDetailLayout',
			'estimateMainUIConfigurationService', 'platformUIStandardExtentService',
			function ($log, platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, estimateAssembliesResourceDetailLayout,
			          estimateMainUIConfigurationService, platformUIStandardExtentService) {

				function getResourceDetailLayout() {
					let resourceLayoutOverloads = estimateMainUIConfigurationService.getEstimateMainResourceDetailLayout().overloads;
					delete resourceLayoutOverloads.costunit.formatter;

					// add overloads from estimate main resources
					_.each(estimateAssembliesResourceDetailLayout.groups[0].attributes, function (attr) {
						if (resourceLayoutOverloads[attr]) {
							estimateAssembliesResourceDetailLayout.overloads[attr] = resourceLayoutOverloads[attr];
						}
					});

					let codeEditorOptionsPath = 'code.grid.editorOptions.lookupOptions';
					let codeDetailOptionsPath = 'code.detail.options';
					let estresourcetypeshortkeyEditorOptionsPath = 'estresourcetypeshortkey.grid.editorOptions';

					if (_.has(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath)) {
						_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.usageContext', 'resourcePlantEstimateResourceDataService');
						_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterPlantAssemblyKey', 'resource-equipment-resources-self-assignment-filter');
						_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.plantAssembliesService', 'resourcePlantEstimateLineItemDataService');
						_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateMainResourceDynamicUserDefinedColumnService');

						_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);
						_.set(estimateAssembliesResourceDetailLayout.overloads, estresourcetypeshortkeyEditorOptionsPath + '.isTextEditable', true);

						_.set(estimateAssembliesResourceDetailLayout.overloads, codeDetailOptionsPath + '.usageContext', 'resourcePlantEstimateResourceDataService');
						_.set(estimateAssembliesResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterPlantAssemblyKey', 'resource-equipment-resources-self-assignment-filter');
						_.set(estimateAssembliesResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.plantAssembliesService', 'resourcePlantEstimateLineItemDataService');

						let descriptionEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
						let descriptionDetailOptionsPath = 'descriptioninfo.detail.options';

						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.usageContext', 'resourcePlantEstimateResourceDataService');
						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.filterPlantAssemblyKey', 'resource-equipment-resources-self-assignment-filter');
						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.plantAssembliesService', 'resourcePlantEstimateLineItemDataService');
						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateMainResourceDynamicUserDefinedColumnService');

						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionDetailOptionsPath + '.usageContext', 'resourcePlantEstimateResourceDataService');
						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionDetailOptionsPath + '.lookupOptions.filterPlantAssemblyKey', 'resource-equipment-resources-self-assignment-filter');
						_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionDetailOptionsPath + '.lookupOptions.plantAssembliesService', 'resourcePlantEstimateLineItemDataService');
					}
					return estimateAssembliesResourceDetailLayout;
				}

				let attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EstResourceDto',
					moduleSubModule: 'Estimate.Main'
				});

				if (attributeDomains) {
					attributeDomains = attributeDomains.properties;
					// use this column to replace EstResourceTypeFk
					attributeDomains.EstResourceTypeFkExtend = {domain: 'integer'};
					attributeDomains.EstResourceTypeShortKey = {domain: 'string'};
				}

				function EstimateAssembliesUIStandardService(layout, scheme, translateService) {
					platformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				EstimateAssembliesUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				EstimateAssembliesUIStandardService.prototype.constructor = EstimateAssembliesUIStandardService;

				let service =  new EstimateAssembliesUIStandardService(getResourceDetailLayout(), attributeDomains, estimateAssembliesTranslationService);

				platformUIStandardExtentService.extend(service, getResourceDetailLayout().addition);

				return service;
			}
		]);
})();
