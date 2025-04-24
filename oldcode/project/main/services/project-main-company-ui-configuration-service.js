/**
 * Created by chin-han.lai on 18/08/2023
 */

(function () {

	'use strict';

	let moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainCompanyUIConfigurationService
	 * @function
	 *
	 * @description
	 * projectMainCompanyUIConfigurationService
	 */
	angular.module(moduleName).factory('projectMainCompanyUIConfigurationService',
		[  'platformUIStandardConfigService',
			'projectMainTranslationService',
			'platformSchemaService',
			'projectMainConstantValues',
			function (platformUIStandardConfigService,
				projectMainTranslationService,
				platformSchemaService,
				projectMainConstantValues) {

				let BaseService = platformUIStandardConfigService;
				let projectsCompanyLayout = {

					'fid': 'project.main.publishcompany.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['code', 'companyname', 'checked']
						}
					],

					'overloads': {
						'code': {
							readonly: true
						},
						'companyname': {
							readonly: true
						}
					}
				};

				let projectDomainSchema = platformSchemaService.getSchemaFromCache(projectMainConstantValues.schemes.company);
				if (projectDomainSchema) {
					projectDomainSchema = projectDomainSchema.properties;
					projectDomainSchema.Checked ={ domain : 'boolean'};
				}
				function ProjectUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;
				return new BaseService(projectsCompanyLayout, projectDomainSchema, projectMainTranslationService);
			}
		]);
})(angular);