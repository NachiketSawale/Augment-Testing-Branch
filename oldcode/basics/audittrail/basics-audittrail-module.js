(function (angular) {
	'use strict';

	var moduleName = 'basics.audittrail';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {   // --> see basicsAuditTrailPopupService (resolver will never be called!)
					//		'loadDomains': ['platformSchemaService', function(platformSchemaService){
					//			return platformSchemaService.getSchemas([
					//				{ typeName: 'LogEntity', moduleSubModule: 'Basics.AuditTrail'}
					//			]);
					//
					//		}]
					//		'loadModuleInfo': ['basicsDependentDataModuleLookupService', function (basicsDependentDataModuleLookupService) {
					//			basicsDependentDataModuleLookupService.loadData();
					//		}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);





