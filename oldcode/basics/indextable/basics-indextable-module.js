/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.indextable';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {


				var options = {
					moduleName: moduleName,
					resolve: {
						loadDomains: ['$q', 'platformSchemaService',

							function ($q, platformSchemaService) {
								return $q.all([platformSchemaService.getSchemas([
									{typeName: 'BasIndexHeaderDto', moduleSubModule: 'Basics.IndexTable'},
									{typeName: 'BasIndexDetailDto', moduleSubModule: 'Basics.IndexTable'}
								])
								]);
							}]
					}
				};

				platformLayoutService.registerModule(options);
			}
		]);


})(angular);





