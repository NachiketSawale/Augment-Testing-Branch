(function () {
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTemplateDocumentUiStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Document entities
	 */
	angular.module(moduleName).factory('schedulingTemplateActivityTemplateDocumentUiStandardService',
		['platformUIStandardConfigService', '$injector', 'schedulingTemplateTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, schedulingTemplateTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						'fid': 'scheduling.template.documentdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'documenttypefk', 'activitytemplatefk', 'date', 'originfilename']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.basDocumenttype'),
							activitytemplatefk: {
								detail: {
									type: 'directive',
									directive: 'scheduling-activity-template-lookup-dialog'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'scheduling-activity-template-lookup-dialog'
									},
									formatter: 'lookup',
									formatterOptions: {
										url: {
											getList: 'scheduling/template/activitytemplate/listall',
											getDefault: 'scheduling/template/activitytemplate/listall',
											getItemByKey: 'scheduling/template/activitytemplate/getItemById',
											getSearchList: 'scheduling/template/activitytemplate/listall'

										},
										lookupType: 'activitytemplatefk',
										displayMember: 'Code'
									}
								}
							},
							originfilename: {readonly: true}
						}
					};
				}

				var schedulingTemplateDocumentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityTemplateDocumentDto',
					moduleSubModule: 'Scheduling.Template'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function DocUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				DocUIStandardService.prototype = Object.create(BaseService.prototype);
				DocUIStandardService.prototype.constructor = DocUIStandardService;

				return new BaseService(schedulingTemplateDocumentDetailLayout, documentAttributeDomains, schedulingTemplateTranslationService);
			}
		]);
})();
