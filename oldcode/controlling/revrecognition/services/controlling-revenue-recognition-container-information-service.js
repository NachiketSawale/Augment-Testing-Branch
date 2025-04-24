/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var controllingRevenueRecognitionModule = angular.module('controlling.revrecognition');

	/**
     * @ngdoc service
     * @name controllingRevenueRecognitionContainerInformationService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */
	controllingRevenueRecognitionModule.factory('controllingRevenueRecognitionContainerInformationService', [
		function () {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(/* guid */) {
				var config = {};
				/* TODO: check code below
                                switch (guid) {
                                    case 'mainEntityGuid': // controllingRevenueRecognitionMainEntityNameListController
                                        config.layout = $injector.get('controllingRevenueRecognitionMainEntityNameConfigurationService').getStandardConfigForListView();
                                        config.ContainerType = 'Grid';
                                        config.standardConfigurationService = 'controllingRevenueRecognitionMainEntityNameConfigurationService';
                                        config.dataServiceName = 'controllingRevenueRecognitionMainEntityNameDataService';
                                        config.validationServiceName = null;
                                        config.listConfig = {
                                            initCalled: false,
                                            grouping: true
                                        };
                                        break;
                                    case 'mainEntityDetailsGuid': // controllingRevenueRecognitionMainEntityNameDetailController
                                        config.layout = $injector.get('controllingRevenueRecognitionMainEntityNameConfigurationService').getStandardConfigForDetailView();
                                        config.ContainerType = 'Detail';
                                        config.standardConfigurationService = 'controllingRevenueRecognitionMainEntityNameConfigurationService';
                                        config.dataServiceName = 'controllingRevenueRecognitionMainEntityNameDataService';
                                        config.validationServiceName = null;
                                        break;
                                }
                */

				return config;
			};

			return service;
		}
	]);
})(angular);
