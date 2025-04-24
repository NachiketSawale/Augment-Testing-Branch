/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// noinspection JSAnnotator
	const module = angular.module('model.change');

	/**
	 * @ngdoc service
	 * @name modelChangeContainerInformationService
	 * @function
	 *
	 * @description
	 */
	module.factory('modelChangeContainerInformationService', modelChangeContainerInformationService);

	modelChangeContainerInformationService.$inject = ['$injector'];

	function modelChangeContainerInformationService($injector) {

		const service = {};
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case '35f7e04a283b44a9b726be260b886ea1': // modelChangeListController
					config = $injector.get('modelChangeConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'modelChangeConfigurationService';
					config.dataServiceName = 'modelChangeDataService';
					config.validationServiceName = null;
					break;
				case '37b54001f96f479ab3babd481b500d2b': // modelChangeDetailController
					config = $injector.get('modelChangeConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'modelChangeConfigurationService';
					config.dataServiceName = 'modelChangeDataService';
					config.validationServiceName = null;
					break;

				// grouped imports from model.main
				case '36abc91df46f4129a78cc26fe79a6fdc': // modelMainObjectInfoListController
				case '114f1a46eaee483d829648e7dd60a63c': // modelMainObjectInfoDetailController
				case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
				case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
					break;
			}

			return config;
		};

		return service;
	}
})(angular);
