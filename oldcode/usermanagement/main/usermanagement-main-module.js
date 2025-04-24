/**
 * Created by rei on 23.05.2019.
 */
(function (angular) {
	/* global angular */
	'use strict';

	var moduleName = 'usermanagement.main';
	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadTranslation': ['platformTranslateService', function (platformTranslateService ) {
						return platformTranslateService.registerModule([moduleName, 'usermanagement.main'], true)
							.then(function () {
								var readValues=[
									{Id: 1, description$tr$: 'usermanagement.main.dialogTitleUser'},
								];
								platformTranslateService.translateObject(readValues, ['description']);
								return true;
							});
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}]).run();

})(angular);