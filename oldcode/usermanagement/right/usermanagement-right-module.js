/**
 * Created by sandu on 15.09.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.right';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'AccessRoleDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'AccessRole2RoleDto', moduleSubModule: 'UserManagement.Main'},
							{typeName: 'DescriptorStructureDto', moduleSubModule: 'UserManagement.Main'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', 'usermanagementRightDetailLayout', function (platformTranslateService, usermanagementRightDetailLayout) {
						return platformTranslateService.registerModule([moduleName], true)
							.then(function () {
								platformTranslateService.translateObject(usermanagementRightDetailLayout, ['toolTip']);
								return true;
							});
					}],
	                loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
		                var wizardData = new basicsConfigWizardSidebarService.WizardData('usermanagementRightWizardService',
			                '4b341a72494f4c93a904d9b871f23147',
			                'copyRole', true
		                );
		                var wizardDataAssignRight = new basicsConfigWizardSidebarService.WizardData('usermanagementRightWizardService',
			                'c3d105291e55445b8ed853040cc9ab81',
			                'assignRights', true, false
		                );
		                var wizardDataDeleteRight = new basicsConfigWizardSidebarService.WizardData('usermanagementRightWizardService',
			                '12fdc3b060a940b5a85f24051063bdef',
			                'deleteRights', true, false
		                );
		                var wizardDataAssignCategory = new basicsConfigWizardSidebarService.WizardData('usermanagementRightWizardService',
			                'dba9fb9cb13f4cd0b5dd7e9895d7db1b',
			                'assignCategory', true, false
		                );

		                var wizards = [];
		                wizards.push(wizardData);
		                wizards.push(wizardDataAssignRight);
		                wizards.push(wizardDataDeleteRight);
		                wizards.push(wizardDataAssignCategory);
		                basicsConfigWizardSidebarService.registerWizard(wizards);
	                }]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}]);

})(angular);