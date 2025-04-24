(function () {
	'use strict';
	/* global _ */
	let moduleName = 'project.plantassembly';

	// TODO: make ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('projectPlantAssemblyResourceConfigurationService',
		['$log', 'platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'estimateAssembliesResourceDetailLayout', 'estimateMainUIConfigurationService', 'platformUIStandardExtentService',
			function ($log, platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, estimateAssembliesResourcelayout, estimateMainUIConfigurationService, platformUIStandardExtentService) {

				function getResourceDetailLayout() {
					let resourceLayoutOverloads = estimateMainUIConfigurationService.getEstimateMainResourceDetailLayout().overloads;
					delete resourceLayoutOverloads.costunit.formatter;


					// add overloads from estimate main resources
					_.each(estimateAssembliesResourcelayout.groups[0].attributes, function (attr) {
						if (resourceLayoutOverloads[attr]) {
							estimateAssembliesResourcelayout.overloads[attr] = resourceLayoutOverloads[attr];
						}
					});

					if(!_.isUndefined(resourceLayoutOverloads.workoperationtypefk)){
						let columnName = 'workoperationtypefk';
						if(estimateAssembliesResourcelayout.groups[0].attributes.indexOf(columnName) === -1){
							estimateAssembliesResourcelayout.groups[0].attributes.push(columnName);
						}
						estimateAssembliesResourcelayout.overloads[columnName] = resourceLayoutOverloads[columnName];
					}

					if(!_.isUndefined(resourceLayoutOverloads.plantassemblytypefk)){
						let columnName = 'plantassemblytypefk';
						if(estimateAssembliesResourcelayout.groups[0].attributes.indexOf(columnName) === -1){
							estimateAssembliesResourcelayout.groups[0].attributes.push(columnName);
						}
						estimateAssembliesResourcelayout.overloads[columnName] = resourceLayoutOverloads[columnName];
					}

					let codeEditorOptionsPath = 'code.grid.editorOptions.lookupOptions';
					let codeDetailOptionsPath = 'code.detail.options';
					let estresourcetypeshortkeyEditorOptionsPath = 'estresourcetypeshortkey.grid.editorOptions';

					if (_.has(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath)) {
						_.set(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath + '.usageContext', 'projectPlantAssemblyResourceService');
						_.set(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
						_.set(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');
						_.set(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterPrjAssemblyKey', 'project-assembly-resources-prj-assembly-priority-filter');
						// _.set(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'projectPlantAssemblyResourceDynamicUserDefinedColumnService');

						_.set(estimateAssembliesResourcelayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);
						_.set(estimateAssembliesResourcelayout.overloads, estresourcetypeshortkeyEditorOptionsPath + '.isTextEditable', true);

						_.set(estimateAssembliesResourcelayout.overloads, codeDetailOptionsPath + '.usageContext', 'projectPlantAssemblyResourceService');
						_.set(estimateAssembliesResourcelayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
						_.set(estimateAssembliesResourcelayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-assemblies-resources-self-assignment-filter');

						let descriptionEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
						let descriptionDetailOptionsPath = 'descriptioninfo.detail.options';

						_.set(estimateAssembliesResourcelayout.overloads, descriptionEditorOptionsPath + '.usageContext', 'projectPlantAssemblyResourceService');
						_.set(estimateAssembliesResourcelayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
						_.set(estimateAssembliesResourcelayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-main-resources-prj-assembly-priority-filter');
						_.set(estimateAssembliesResourcelayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.filterPrjAssemblyKey', 'project-assembly-resources-prj-assembly-priority-filter');
						// _.set(estimateAssembliesResourcelayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'projectPlantAssemblyResourceDynamicUserDefinedColumnService');

						_.set(estimateAssembliesResourcelayout.overloads, descriptionDetailOptionsPath + '.usageContext', 'projectPlantAssemblyResourceService');
						_.set(estimateAssembliesResourcelayout.overloads, descriptionDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
						_.set(estimateAssembliesResourcelayout.overloads, descriptionDetailOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-assemblies-resources-self-assignment-filter');
					}

					estimateAssembliesResourcelayout.addition = {
						grid: [
							{
								'id': 'ismanual',
								'field': 'IsManual',
								name: 'IsManual',
								width: 120,
								formatter: 'boolean'
							}
						]
					};

					return estimateAssembliesResourcelayout;
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
					attributeDomains.IsManual = {domain:'boolean'};
					attributeDomains.WorkOperationTypeFk = {domain:'lookup'};
				}

				function EstimateAssembliesUIStandardService(layout, scheme, translateService) {
					platformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				EstimateAssembliesUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				EstimateAssembliesUIStandardService.prototype.constructor = EstimateAssembliesUIStandardService;

				let service = new EstimateAssembliesUIStandardService(getResourceDetailLayout(), attributeDomains, estimateAssembliesTranslationService);

				platformUIStandardExtentService.extend(service, getResourceDetailLayout().addition);

				return service;
			}
		]);
})();
