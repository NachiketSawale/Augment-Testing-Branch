/**
 * Created by shen on 10/23/2022
 */

(function () {
	'use strict';
	let moduleName = 'project.main';
	let projectMainModule = angular.module(moduleName);
	let basicsCustomizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name projectMainHeaderTextUiStandardService
	 * @description is used for header text controller
	 */
	projectMainModule.factory('projectMainHeaderTextUiStandardService', ['platformUIStandardConfigService', 'platformSchemaService', 'projectMainTranslationService', 'platformUIStandardExtentService', 'basicsLookupdataConfigGenerator',
		function (platformUIStandardConfigService, platformSchemaService, projectMainTranslationService, platformUIStandardExtentService, basicsLookupdataConfigGenerator) {

			let projectHeaderTextLayout = {
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'translationInfos': {
					'extraModules': [moduleName, basicsCustomizeModule],
				},
				'groups': [{
					'gid': 'baseGroup',
					'attributes': ['bastextmoduletypefk']
				}],
				'overloads': {
					'bastextmoduletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype',null,
						{
							filterKey: 'project-main-bas-text-type-filter'
						})
				},
				'addition': {
					'grid': [],
					'detail': []
				}
			};

			let BaseService = platformUIStandardConfigService,
				domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ProjectHeaderblobDto',
					moduleSubModule: 'Project.Common'
				});

			if (domainSchema) {
				domainSchema = domainSchema.properties;

				// add domain for name
				domainSchema.TextType = {domain: 'string'};
			}

			function UIStandardService(layout, scheme, translationService) {
				BaseService.call(this, layout, scheme, translationService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			let service = new BaseService(projectHeaderTextLayout, domainSchema, projectMainTranslationService);
			platformUIStandardExtentService.extend(service, projectHeaderTextLayout.addition, domainSchema);

			// override getStandardConfigForDetailView
			let basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
			service.getStandardConfigForDetailView = function (){
				return angular.copy(basicGetStandardConfigForDetailView());
			};

			return service;
		}
	]);
})();
