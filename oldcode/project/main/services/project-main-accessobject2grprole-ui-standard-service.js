(function () {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainAccessObject2GrpRoleUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of unit area entities
	 */
	angular.module(moduleName).factory('projectMainAccessObject2GrpRoleUIStandardService',
		['platformUIStandardConfigService', '$injector', 'projectMainTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, projectMainTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						'fid': 'project.main.accessObject2GrpRoleDetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['accessrolefk', 'accessgroupfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							accessrolefk:{
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'usermanagement-right-role-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'usermanagement-right-role-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Name'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'AccessRole',
										displayMember: 'Name'
									}
								}
							},
							accessgroupfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'usermanagement-group-group-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'usermanagement-group-group-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Name'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'AccessGroup',
										displayMember: 'Name'
									}
								}
							}
						}
					};
				}

				var projectMainAccessObject2GrpRoleDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var projectMainAccessObject2GrpRoleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'AccessObject2GrpRoleDto',
					moduleSubModule: 'Project.Main'
				});
				projectMainAccessObject2GrpRoleAttributeDomains = projectMainAccessObject2GrpRoleAttributeDomains.properties;


				function ProjectMainAccessObject2GrpRoleUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectMainAccessObject2GrpRoleUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectMainAccessObject2GrpRoleUIStandardService.prototype.constructor = ProjectMainAccessObject2GrpRoleUIStandardService;

				return new BaseService(projectMainAccessObject2GrpRoleDetailLayout, projectMainAccessObject2GrpRoleAttributeDomains, projectMainTranslationService);
			}
		]);
})();
