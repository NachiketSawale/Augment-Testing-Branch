(function (angular) {
	'use strict';

	var moduleName = 'basics.export';

	angular.module(moduleName, ['ui.router', 'platform']);
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

})(angular);





