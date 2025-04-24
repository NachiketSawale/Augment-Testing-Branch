/**
 * Created by anl on 2/5/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).service('productionplanningActivityReservedForActivityContainerService', ReservedForActivityContainerService);

	ReservedForActivityContainerService.$inject = ['platformModuleInitialConfigurationService', 'productionplanningActivityReservedForActivityLayoutServiceFactory'];

	function ReservedForActivityContainerService(platformModuleInitialConfigurationService, reservedForActivityLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, moduleCIS, moduleName, parentService) {
			var modConf = platformModuleInitialConfigurationService.get(moduleName);

			var config = reservedForActivityLayoutServiceFactory.prepareConfig(containerUid, scope, modConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, moduleCIS, moduleName, parentService) {
			var modConf = platformModuleInitialConfigurationService.get(moduleName);

			var config = reservedForActivityLayoutServiceFactory.prepareConfig(containerUid, scope, modConf, parentService);
			moduleCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);