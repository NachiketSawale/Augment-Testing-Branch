(function (angular) {
	'use strict';

	var moduleName = 'basics.import';

	const appBasicsImport = angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function(platformSchemaService){

							// platformSchemaService.initialize();

						}	]
					}
				};

				platformLayoutService.registerModule(options);
			}
		]);
	appBasicsImport.run(['$templateCache', 'platformSchemaService', function ($templateCache) {
		$templateCache.loadTemplateFile('basics.import/templates/basics-import-custom-grid.html');

	}]);
})(angular);





