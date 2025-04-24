/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name projectMainStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module(moduleName).factory('basicsCustomizeConfigurationService', ['platformUIConfigInitService', 'platformSchemaService', 'basicCustomizeTranslationService', 'basicsCustomizeFieldTranslateProcessor',

		function (platformUIConfigInitService, platformSchemaService, basicCustomizeTranslationService) {

			var service = {};

			function createEntityClassDescriptionLayout() {
				return {
					fid: 'basics.customize.entitytypedetailform',
					version: '0.2.4',
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['action', 'name', 'type', 'modulename', 'dbtablename']
						}
					],
					overloads: {
						name: {
							readonly: true
						},
						type: {
							readonly: true
						},
						modulename: {
							readonly: true
						},
						dbtablename: {
							readonly: true
						}
					}
				};
			}

			var entityLayout = createEntityClassDescriptionLayout();
			var entityAttDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'EntityClassDescriptionDTO',
				moduleSubModule: 'Basics.Customize'
			}).properties;
			var listConfig = platformUIConfigInitService.provideConfigForListView(entityLayout, entityAttDomains, basicCustomizeTranslationService);

			service.getStandardConfigForListView = function () {
				return listConfig;
			};

			return service;
		}
	]);
})();
