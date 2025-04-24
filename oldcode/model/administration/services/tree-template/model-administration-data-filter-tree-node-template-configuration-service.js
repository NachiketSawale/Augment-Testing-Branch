
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.administration').service('modelAdministrationDataFilterTreeNodeTemplateConfigurationService',
		ModelAdministrationDataFilterTreeNodeTemplateConfigurationService);

	ModelAdministrationDataFilterTreeNodeTemplateConfigurationService.$inject = [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'modelAdministrationUIConfigurationService', '$translate',
		'modelAdministrationTranslationService'
	];

	function ModelAdministrationDataFilterTreeNodeTemplateConfigurationService(
		platformUIStandardConfigService,
		platformSchemaService,
		modelAdministrationUIConfigurationService, $translate,
		modelAdministrationTranslationService
	) {

		const BaseService = platformUIStandardConfigService;

		// Define the Data Tree Node Template Layout configuration
		function getDataTreeNodeTemplateLayout() {
			return {
				fid: 'model.administration.dataFilterTreeTemplate',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['description', 'nodetype', 'action', 'sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				overloads: {
					nodetype:
					{
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: getNodeTypeSelectItems(),
								valueMember: 'id',
								displayMember: 'description'
							},
							editor: 'select',
							editorOptions: {
								items: getNodeTypeSelectItems(),
								valueMember: 'id',
								displayMember: 'description'
							}
						},
						detail: {
							'readonly': true
						}
					},
				},
			};
		}

		function getNodeTypeSelectItems() {
			return [
				{ id: 'AttributeFilter', description: $translate.instant('model.administration.filterTreeTemplate.attribute') },
				{ id: 'FixedNode', description: $translate.instant('model.administration.filterTreeTemplate.fixed') },
				{ id: 'ObjectSetList', description: $translate.instant('model.administration.filterTreeTemplate.object') }

			];
		}

		// Retrieve and configure domain schema for ModelFilterTreeNodeTemplateDto
		let domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ModelFilterTreeNodeTemplateDto',
			moduleSubModule: 'Model.Administration'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
			domainSchema.Value = { domain: 'dynamic' };
			domainSchema.Action = { domain: 'action' };  // Add 'action' domain for Action attribute
		}

		// Use the defined layout for DataTreeNodeTemplate
		const layout = getDataTreeNodeTemplateLayout();

		return new BaseService(layout, domainSchema, modelAdministrationTranslationService);
	}
})(angular);

