(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.txinterface';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				var options = {
					'moduleName': moduleName,
					'resolve': {
						registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
							(platformPermissionService, permissionObjectType) => {
								return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
							}],
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);

})(angular);





