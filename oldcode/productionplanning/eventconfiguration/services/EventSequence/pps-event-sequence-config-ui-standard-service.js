/**
 * Created by anl on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	//extendGrouping
	angular.module(moduleName).value('ppsEventConfigLayoutConfig', {
		addition: {
			grid: extendGrouping([
				{
					afterId: 'sitefk',
					id: 'siteDesc',
					field: 'SiteFk',
					name: 'Site-Description',
					name$tr$: 'basics.site.entityDesc',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SiteNew',
						displayMember: 'DescriptionInfo.Description',
						width: 140,
						version: 3
					}
				}
			])
		}
	});

	angular.module(moduleName).factory('productionplanningEventconfigurationLayout', EventSequenceConfig);
	EventSequenceConfig.$inject = ['basicsLookupdataConfigGenerator', 'productionplanningCommonLayoutHelperService'];

	function EventSequenceConfig(basicsLookupdataConfigGenerator, ppsCommonLayoutHelperService) {
		return {
			'fid': 'productionplanning.eventconfiguration.eventconfiglayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['description', 'eventseqconfigfk', 'istemplate', 'islive']
				},
				{
					gid: 'queryGroup',
					attributes: ['materialfk', 'materialgroupfk', 'sitefk', 'quantityfrom', 'quantityto',
						'isdefault', 'mounting', 'reproductioneng', 'reproduction', 'matsitegrpfk']
				},
				{
					gid: 'ppsCreationGroup',
					attributes: ['itemtypefk']
				},
				{
					gid: 'automaticGroup',
					attributes: ['seqeventsplitfromfk', 'seqeventsplittofk', 'splitafterquantity', 'splitdayoffset']
				},
				{
					gid: 'certificateGroup',
					attributes: ['ceactive', 'cefield1', 'cefield2', 'cefield3', 'cefield4']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				eventseqconfigfk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EventSequence',
							displayMember: 'Description',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-event-config-filter'
							},
							directive: 'productionplanning-event-configuration-sequence-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								filterKey: 'pps-event-config-filter',
								showClearButton: true
							},
							lookupDirective: 'productionplanning-event-configuration-sequence-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				materialgroupfk: {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								filterKey: 'pps-material-group-filter'
							},
							lookupDirective: 'basics-material-material-group-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								filterKey: 'pps-material-group-filter'
							},
							lookupDirective: 'basics-material-material-group-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialGroup',
							displayMember: 'Code'
						}
					}
				},
				sitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-event-seq-config-factory-site-filter',
								processDataKey: 'IsFactory'
							},
							directive: 'basics-site-site-x-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true,
								filterKey: 'pps-event-seq-config-factory-site-filter',
								processDataKey: 'IsFactory'
							},
							lookupDirective: 'basics-site-site-x-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				seqeventsplitfromfk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(),
				seqeventsplittofk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(),
				itemtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig(
					'basics.customize.ppsitemtype',
					'Description',
					{
						showIcon: true
					}
				),
				materialfk: ppsCommonLayoutHelperService.provideMaterialLookupOverload(),
				matsitegrpfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig(
					'basics.customize.ppsmaterialsitegroup',
					'Description',
					{
						showIcon: true
					}
				),
			}
		};
	}

	angular.module(moduleName).factory('productionplanningEventconfigurationSequenceUIStandardService', EventconfigurationUIStandardService);

	EventconfigurationUIStandardService.$inject = ['platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningEventconfigurationTranslationService',
		'platformSchemaService',
		'productionplanningEventconfigurationLayout',
		'productionplanningEventconfigurationSequenceDataService',
		'ppsEventConfigLayoutConfig'];

	function EventconfigurationUIStandardService(
		platformUIStandardConfigService,
		platformUIStandardExtentService,
		translationService,
		platformSchemaService,
		eventConfigLayout,
		sequenceDataService,
		ppsEventConfigLayoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'EventSeqConfigDto',
			moduleSubModule: 'ProductionPlanning.EventConfiguration'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;

		var service = new BaseService(eventConfigLayout, ruleSetAttributeDomains, translationService);

		platformUIStandardExtentService.extend(service, ppsEventConfigLayoutConfig.addition, ruleSetAttributeDomains);

		var detailView = service.getStandardConfigForDetailView();
		_.forEach(detailView.rows, function (row) {
			row.change = function (entity, field) {
				sequenceDataService.handleFieldChanged(entity, field);
			};
		});

		return service;
	}
})(angular);