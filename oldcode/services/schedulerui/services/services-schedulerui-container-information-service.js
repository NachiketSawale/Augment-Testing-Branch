/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var servicesScheduleruiModule = angular.module('services.schedulerui');

	/**
	 * @ngdoc service
	 * @name servicesScheduleruiContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	servicesScheduleruiModule.factory('servicesScheduleruiContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '77f863ec4d5748d2a534addd53ecfc50':
						config.layout = $injector.get('servicesSchedulerUIJobLayoutService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'servicesSchedulerUIJobLayoutService';
						config.dataServiceName = 'servicesSchedulerUIJobDataService';
						config.validationServiceName = 'servicesSchedulerUIValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case '1587d52539e346e89cffaaea211ab644':
						config.layout = $injector.get('servicesSchedulerUIJobLayoutService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'servicesSchedulerUIJobLayoutService';
						config.dataServiceName = 'servicesSchedulerUIJobDataService';
						config.validationServiceName = 'servicesSchedulerUIValidationService';
						break;
					case 'b4af02249edc42d28eaf7d71f08ff199':
						config.layout = $injector.get('servicesSchedulerUIChildJobLayoutService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'servicesSchedulerUIChildJobLayoutService';
						config.dataServiceName = 'servicesSchedulerUIChildJobDataService';
						config.validationServiceName = null;
						break;
					case 'baecfb65369043f4b302449ea35fa49b':
						config.layout = $injector.get('servicesSchedulerUIChildJobLayoutService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'servicesSchedulerUIChildJobLayoutService';
						config.dataServiceName = 'servicesSchedulerUIChildJobDataService';
						config.validationServiceName = null;
						break;
				}

				return config;
			};
			/*
			service.initializeContainerConfigurations = function initializeContainerConfigurations(conf, layout, dto) {
				const layouts = service.provideContainerConfigurations(layout, dto);
				conf.detailConfig = layouts.detailLayout;
				conf.listConfig = layouts.listLayout;
			};

			service.provideContainerConfigurations = function provideContainerConfigurations(layout, dto) {
				const scheme = platformSchemaService.getSchemaFromCache({
					typeName: dto,
					moduleSubModule: 'services.schedulerui'
				}).properties;

				scheme.Log = {domain: 'action'};
				scheme.Parameter = {domain: 'remark'};
				const configs = {};

				configs.detailLayout = platformUIConfigInitService.provideConfigForDetailView(layout, scheme, servicesScheduleruiTranslationService);
				configs.listLayout = platformUIConfigInitService.provideConfigForListView(layout, scheme, servicesScheduleruiTranslationService);

				return configs;
			};

			*/

			return service;
		}
	]);
})(angular);
