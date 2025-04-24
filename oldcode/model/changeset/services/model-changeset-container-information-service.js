/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// noinspection JSAnnotator
	const module = angular.module('model.changeset');

	/**
	 * @ngdoc service
	 * @name modelChangesetContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	module.factory('modelChangesetContainerInformationService', ['$injector', 'modelChangeSetClipboardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, modelChangeSetClipboardService) {

			const service = {};
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) { // jshint ignore: line
				let config = {};
				switch (guid) {
					case 'f66eca7800444d81b0acf695ba348d29': // modelChangeSetListController
						config = $injector.get('modelChangeSetConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'modelChangeSetConfigurationService';
						config.dataServiceName = 'modelChangeSetDataService';
						config.validationServiceName = null;
						config.listConfig = {
							type: 'model.changeset',
							dragDropService: modelChangeSetClipboardService

						};
						break;
					case '46f270d1fcce425c85b26dbfc9288b9d': // modelChangeSetDetailController
						config = $injector.get('modelChangeSetConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'modelChangeSetConfigurationService';
						config.dataServiceName = 'modelChangeSetDataService';
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
	]);
})(angular);
