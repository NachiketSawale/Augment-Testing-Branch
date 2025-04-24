/**
 * Created by csalopek on 14.08.2017.
 */

(function (angular) {

	'use strict';
	var schedulingExtSysModule = angular.module('scheduling.extsys');

	/**
	 * @ngdoc service
	 * @name schedulingExtSysContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingExtSysModule.factory('schedulingExtsysContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			/* jshint -W074 */ // There is no complexity, try harder J.S.Hint
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '281b93e2ae5641bb9f644c74d5aefb5b': // schedulingExtSysCalendarListController
						config.layout = $injector.get('schedulingExtSysUIStandardService').getCalendarLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingExtSysUIStandardService';
						config.dataServiceName = 'schedulingExtSysCalendarService';
						config.validationServiceName = 'schedulingExtSysCalendarValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'fe9fa2d886f643b29ca009bb9fe7ac53': // schedulingExtSysCalendarDetailController
						config = $injector.get('schedulingExtSysUIStandardService').getCalendarLayout();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingExtSysUIStandardService';
						config.dataServiceName = 'schedulingExtSysCalendarService';
						config.validationServiceName = 'schedulingExtSysCalendarValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);
