(function () {
	'use strict';
	/* global globals, angular */
	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).factory('ppsStatusTriggerRuleLayout', Layout);

	Layout.$inject = ['platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'basicsCommonGridFormatterHelper',
		'ppsConfigurationStatusInheritedRuleColumnLookupFactory'];

	function Layout(platformTranslateService,
		basicsLookupdataConfigGenerator,
		basicsCommonGridFormatterHelper,
		columnLookupFactory) {

		const sourceStatusDetailLookupInfo = {
			12: { lookup: columnLookupFactory.getSourceStatusColumnLookupConfig(12).detail },
			13: { lookup: columnLookupFactory.getSourceStatusColumnLookupConfig(13).detail },
		};

		const targetStatusDetailLookupInfo = {
			12: { lookup: columnLookupFactory.getTargetStatusColumnLookupConfig(12).detail },
			13: { lookup: columnLookupFactory.getTargetStatusColumnLookupConfig(13).detail },
			15: { lookup: columnLookupFactory.getTargetStatusColumnLookupConfig(15).detail },
		};

		return {
			fid: 'productionplanning.configuration.statustriggerrule',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['sorting', 'sourceentityfk', 'possiblesourcestatus', 'requiredsourcestatus', 'targetentityfk', 'targetstatusid', 'islive', 'remark']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				sourceentityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					readonly: true,
				}),
				targetentityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					readonly: true,
				}),
				possiblesourcestatus: {
					grid: {
						formatter: sourceStatusFormatter,
						editor: 'dynamic',
						domain: sourceStatusEditor,
					},
					detail: {
						type: 'directive',
						directive: 'pps-dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'SourceEntityFk',
							lookupInfo: sourceStatusDetailLookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: true,
							lookupOptions: {
								showClearButton: true,
							},
						}
					},
				},
				requiredsourcestatus: {
					grid: {
						formatter: sourceStatusFormatter,
						editor: 'dynamic',
						domain: sourceStatusEditor,
					},
					detail: {
						type: 'directive',
						directive: 'pps-second-dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'SourceEntityFk',
							lookupInfo: sourceStatusDetailLookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: true,
							lookupOptions: {
								showClearButton: true,
							},
						}
					},
				},
				targetstatusid: {
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: (item, column) => {
							const config = columnLookupFactory.getTargetStatusColumnLookupConfig(item.TargetEntityFk);
							column.editorOptions = config.grid.editorOptions;
							column.formatterOptions = config.grid.formatterOptions;

							return 'lookup';
						},
					},
					detail: {
						type: 'directive',
						directive: 'dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'TargetEntityFk',
							lookupInfo: targetStatusDetailLookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: true,
							lookupOptions: {
								showClearButton: true,
							},
						}
					},
				},
			},
		};

		function sourceStatusFormatter(cow, cell, value, columnDef, dataContext) {
			value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
			const status = columnLookupFactory.getStatus(dataContext.SourceEntityFk);

			if (Array.isArray(value)) {
				value = value.map(i => getDescription(status[i])).join(', ');
			}

			return addErrorMarkup(value, columnDef, dataContext);
		}

		function addErrorMarkup(value, columnDef, dataContext) {
			try {
				const error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
				if (error) {
					if (error.error$tr$) {
						platformTranslateService.translateObject(error, 'error');
					}
					return '<div class="invalid-cell" title="' + error.error + '">' + value + '</div>';
				}
			} catch (e) {
			}

			return value;
		}

		function sourceStatusEditor(item, column) {
			const config = columnLookupFactory.getSourceStatusColumnLookupConfig(item.SourceEntityFk);
			column.editorOptions = config.grid.editorOptions;

			return 'lookup';
		}

		function getDescription(data) {
			if (!data) {
				return;
			}

			if (data.DescriptionInfo && data.DescriptionInfo.Translated && data.DescriptionInfo.Translated.length > 0) {
				return data.DescriptionInfo.Translated;
			} else if (data.Description && data.Description.length > 0) {
				return data.Description;
			} else {
				return data.Code;
			}
		}
	}

	angular.module(moduleName).factory('ppsStatusInheritedTriggeringUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIStandardConfigService',
		'platformSchemaService',
		'productionplanningConfigurationTranslationService',
		'ppsStatusTriggerRuleLayout'];

	function UIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, ppsStatusTriggerRuleLayout) {
		const BaseService = platformUIStandardConfigService;

		const attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsStatusTriggerRuleDto',
			moduleSubModule: 'ProductionPlanning.Configuration'
		});

		const schemaProperties = attributeDomains.properties;

		const service = new BaseService(ppsStatusTriggerRuleLayout, schemaProperties, translationService);

		return service;
	}
})();