/*
 * $Id: project-calendar-container-information-service.js 535284 2019-02-27 06:26:30Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var projectCalendarModule = angular.module('project.calendar');

	/**
	 * @ngdoc service
	 * @name projectCalendarContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	projectCalendarModule.factory('projectCalendarContainerInformationService', ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		function (_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
			var service = {};
			var dynamicConfigurations = {};

			service.getExceptionDayLayout = function getExceptionDayLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'project.calendar.exceptionday',
					['code', 'descriptioninfo', 'comment', 'workoperationtypefk', 'exceptdate', 'backgroundcolor',
						'fontcolor', 'isworkday', 'isshowninchart', 'isreleased', 'workstart', 'workend']);
				res.overloads = platformLayoutHelperService.getOverloads(['workoperationtypefk'], service);
				return res;
			};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '359b6aa7d45d45688229a7d6444b1b4c': // projectCalendarCalendarListController
						config.layout = $injector.get('projectCalendarCalendarConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectCalendarCalendarConfigurationService';
						config.dataServiceName = 'projectCalendarCalendarDataService';
						config.validationServiceName = 'projectCalendarCalendarValidationService';
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
					case 'bc9bfd0c36bf4c4aa7f9f40d109e35c1': // projectCalendarCalendarDetailController
						config.layout = $injector.get('projectCalendarCalendarConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectCalendarCalendarConfigurationService';
						config.dataServiceName = 'projectCalendarCalendarDataService';
						config.validationServiceName = 'projectCalendarCalendarValidationService';
						break;
					case 'ee297e5e837b4d9ab6fe1029874ab1a3': // projectCalendarExceptionDayListController
						config.layout = $injector.get('projectCalendarExceptionDayLayoutService');
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectCalendarExceptionDayLayoutService';
						config.dataServiceName = 'projectCalendarExceptionDayDataService';
						config.validationServiceName = 'projectCalendarExceptionDayValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'da054f29c8d04d0aa8f4aa33fb946408': // projectCalendarExceptionDayDetailController
						config.layout = $injector.get('projectCalendarExceptionDayLayoutService');
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectCalendarExceptionDayLayoutService';
						config.dataServiceName = 'projectCalendarExceptionDayDataService';
						config.validationServiceName = 'projectCalendarExceptionDayValidationService';
						break;
					default:
						config = service.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
						break;
				}

				return config;
			};
			service.hasDynamic = function hasDynamic(guid) {
				return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
			};

			service.takeDynamic = function takeDynamic(guid, config) {
				dynamicConfigurations[guid] = config;
			};

			service.getOverload = function getOverload(overload) {
				var ovl = null;

				switch (overload) {
					case 'workoperationtypefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'resourceWorkOperationTypeLookupDataService'
					}); break;
				}
				return ovl;
			};

			return service;
		}
	]);
})(angular);
