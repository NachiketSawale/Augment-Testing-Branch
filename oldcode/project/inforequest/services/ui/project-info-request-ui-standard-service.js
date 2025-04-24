(function () {
	'use strict';
	let moduleName = 'project.inforequest';
	/**
	 * @ngdoc service
	 * @name projectInfoRequestUIStandardService
	 * @function
	 *
	 * @description
	 * This service is currently only used for structure container. the original one is in container-information-service.js => one day the config and logic from
	 * information-service should be moved here!
	 */
	angular.module(moduleName).factory('projectInfoRequestUIStandardService',
		['$injector', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'projectInfoRequestTranslationService', 'platformSchemaService',

			function ($injector, platformUIStandardConfigService, platformLayoutHelperService, projectInfoRequestTranslationService, platformSchemaService) {
				function createMainDetailLayout() {
					return {
						fid: 'project.project.plant.detailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: ['code', 'description', 'projectfk', 'modelfk', 'markerfk', 'objectsetfk', 'requeststatusfk', 'requestgroupfk', 'requesttypefk', 'specification', 'clerkraisedbyfk', 'clerkresponsiblefk', 'clerkcurrentfk', 'contactfk', 'dateraised', 'datedue', 'headerfk', 'remark']
							},
							{
								gid: 'userDefTextGroup',
								attributes: ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
							}
						],
					};
				}

				let resDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let resAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'InfoRequestDto',
					moduleSubModule: 'Project.InfoRequest'
				});
				resAttributeDomains = resAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;


				let baseService = new BaseService(resDetailLayout, resAttributeDomains, projectInfoRequestTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();
