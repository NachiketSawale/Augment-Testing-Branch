
/**
 * Created by anl on 29/4/2022.
 */


(function () {
	'use strict';
	let moduleName = 'productionplanning.formulaconfiguration';


	angular.module(moduleName).factory('ppsFormulaConfigurationParameterLayout', [
		'basicsLookupdataLookupFilterService',
		'ppsFormulaConfigurationDomainTypes',
		function (basicsLookupdataLookupFilterService,
			ppsFormulaConfigurationDomainTypes) {
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'pps-formula-configuration-parameter-display-domain-type-filter',
					fn: function (item) {
						return item.Id === ppsFormulaConfigurationDomainTypes.Text ||
							item.Id === ppsFormulaConfigurationDomainTypes.Quantity ||
							item.Id === ppsFormulaConfigurationDomainTypes.Boolean;
					}
				}
			]);

			let layout = {
				fid: 'productionplanning.formulaconfiguration.parameter',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['descriptioninfo', 'variablename', 'ppsformulaversionfk', 'basdisplaydomainfk', 'value']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				overloads: {
					ppsformulaversionfk: {
						readonly:true,
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								directive: 'pps-formula-configuration-version-combobox',
								displayMember: 'FormulaVersion',
							},
							formatter: 'lookup',
							formatterOptions: {
								version: 3,
								valueMember: 'Id',
								displayMember: 'FormulaVersion',
								lookupType: 'PpsFormulaVersion'
							},
						}
					},
					basdisplaydomainfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-dependent-data-domain-combobox',
								lookupOptions: {
									filterKey: 'pps-formula-configuration-parameter-display-domain-type-filter',
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											args.entity.Value = null;
										}
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsDependentDataDomain',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					value: {
						grid: {
							maxLength: 252,
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								column.editorOptions = null;
								column.formatterOptions = null;
								switch (item.BasDisplayDomainFk) {
									case ppsFormulaConfigurationDomainTypes.Boolean:
										return 'boolean';
									case ppsFormulaConfigurationDomainTypes.Text:
										return 'description';
									case ppsFormulaConfigurationDomainTypes.Quantity:
										return 'decimal';
									default:
										return 'description';
								}
							}
						}
					}
				}
			};
			return layout;
		}
	]);

	angular.module(moduleName).factory('ppsFormulaConfigurationParameterLayoutConfig', [
		'platformObjectHelper',
		function (platformObjectHelper) {
			return {
				addition: {
					grid: platformObjectHelper.extendGrouping([])
				}
			};
		}
	]);

	angular.module(moduleName).factory('productionplanningFormulaConfigurationParameterUIStandardService', ParameterUIStandardService);

	ParameterUIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionPlanningFormulaConfigurationTranslationService',
		'ppsFormulaConfigurationParameterLayout',
		'ppsFormulaConfigurationParameterLayoutConfig'];

	function ParameterUIStandardService(platformSchemaService,
		platformUIStandardConfigService,
		platformUIStandardExtentService,
		translationServ,
		layout,
		layoutConfig) {

		let BaseService = platformUIStandardConfigService;

		let dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PpsParameterDto',
			moduleSubModule: 'ProductionPlanning.FormulaConfiguration'
		});
		var schemaProperties = dtoSchema.properties;

		function paramUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}
		paramUIStandardService.prototype = Object.create(BaseService.prototype);
		paramUIStandardService.prototype.constructor = paramUIStandardService;

		let service = new BaseService(layout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

		return service;
	}
})();