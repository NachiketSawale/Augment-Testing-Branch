/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';

	// Layout specs
	angular.module(moduleName).value('estimateAssembliesResourceDetailLayout', {
		'fid': 'estimate.assemblies.resource.detailform',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'change':'change',
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['estresourcetypeshortkey', 'code', 'descriptioninfo', 'descriptioninfo1','quantitydetail', 'quantity', 'basuomfk', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
					'productivityfactordetail', 'productivityfactor', 'efficiencyfactordetail1', 'efficiencyfactor1', 'efficiencyfactordetail2', 'efficiencyfactor2', 'quantityfactorcc', 'quantityreal', 'quantityinternal', 'quantitytotal',
					'costunit', 'bascurrencyfk', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costfactorcc', 'costunitsubitem', 'costunitlineitem', 'costtotal', 'hoursunit', 'hoursunitsubitem', 'hoursunitlineitem',
					'hoursunittarget', 'hourstotal', 'hourfactor', 'islumpsum', 'isdisabled','isindirectcost', 'commenttext', 'estcosttypefk', 'estresourceflagfk','iscost','sorting', 'dayworkrateunit', 'dayworkratetotal',
					'co2source', 'co2sourcetotal', 'co2project', 'co2projecttotal', 'costuom','workoperationtypefk']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],

		'overloads': {},
		'addition': {
			grid: [
				{
					'afterId': 'estresourcetypeshortkey',
					'id': 'estresourcetypeshortkeydescription',
					'field': 'EstResourceTypeFkExtend',
					name: 'Description',
					width: 120,
					formatter: 'lookup',
					name$tr$: 'estimate.main.estResourceTypeDescription',
					'sortable': true,
					'readonly': true,
					'directive': 'estimate-main-resource-type-lookup',
					formatterOptions: {
						lookupType: 'resourcetype',
						displayMember: 'DescriptionInfo.Translated',
						dataServiceName: 'estimateMainResourceTypeLookupService'
					}
				}
			]
		}
	});

	// TODO: make ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateAssembliesResourceConfigurationService',
		['$log', 'platformUIStandardConfigService', 'platformSchemaService', 'estimateAssembliesTranslationService', 'estimateAssembliesResourceDetailLayout', 'estimateMainUIConfigurationService', 'platformUIStandardExtentService',
			function ($log, platformUIStandardConfigService, platformSchemaService, estimateAssembliesTranslationService, estimateAssembliesResourceDetailLayout, estimateMainUIConfigurationService, platformUIStandardExtentService) {

				function getResourceDetailLayout() {
						let resourceLayoutOverloads = estimateMainUIConfigurationService.getEstimateMainResourceDetailLayout().overloads;

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
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.usageContext', 'estimateAssembliesResourceService');
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-assemblies-resources-self-assignment-filter');
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateAssembliesResourceDynamicUserDefinedColumnService');
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.lookupOptions.isFastDataRecording', true);
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeEditorOptionsPath + '.isTextEditable', true);
							_.set(estimateAssembliesResourceDetailLayout.overloads, estresourcetypeshortkeyEditorOptionsPath + '.isTextEditable', true);

							_.set(estimateAssembliesResourceDetailLayout.overloads, codeDetailOptionsPath + '.usageContext', 'estimateAssembliesResourceService');
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
							_.set(estimateAssembliesResourceDetailLayout.overloads, codeDetailOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-assemblies-resources-self-assignment-filter');

							let descriptionEditorOptionsPath = 'descriptioninfo.grid.editorOptions';
							let descriptionDetailOptionsPath = 'descriptioninfo.detail.options';

							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.usageContext', 'estimateAssembliesResourceService');
							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-assemblies-resources-self-assignment-filter');
							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionEditorOptionsPath + '.lookupOptions.userDefinedConfigService', 'estimateAssembliesResourceDynamicUserDefinedColumnService');

							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionDetailOptionsPath + '.usageContext', 'estimateAssembliesResourceService');
							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionDetailOptionsPath + '.lookupOptions.filterKey', 'estimate-assemblies-resources-assembly-type-filter');
							_.set(estimateAssembliesResourceDetailLayout.overloads, descriptionDetailOptionsPath + '.lookupOptions.filterAssemblyKey', 'estimate-assemblies-resources-self-assignment-filter');
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

				let service = new EstimateAssembliesUIStandardService(getResourceDetailLayout(), attributeDomains, estimateAssembliesTranslationService);

				platformUIStandardExtentService.extend(service, getResourceDetailLayout().addition);

				return service;
			}
		]);
})();
