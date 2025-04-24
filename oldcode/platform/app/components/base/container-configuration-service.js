/*
 * $Id: container-controller-service.js 380292 2016-06-29 12:48:02Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name platformContainerConfigurationService
	 * @function
	 *
	 * @description
	 * Service to do the initializing in a flat item list controller
	 **/
	angular.module('platform').service('platformContainerConfigurationService', PlatformContainerConfigurationService);

	PlatformContainerConfigurationService.$inject = ['platformSchemaService', 'platformUIConfigInitService'];

	function PlatformContainerConfigurationService(platformSchemaService, platformUIConfigInitService) {
		this.createConfiguration = function createConfiguration(module, dto, layout, transService) {
			var scheme = platformSchemaService.getSchemaFromCache({
				moduleSubModule: module,
				typeName: dto
			}).properties;

			var configs = {};

			configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, transService);
			configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, transService);

			return configs;
		};
	}
})();
