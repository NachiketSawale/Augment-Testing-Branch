(function (angular) {
	'use strict';

	/**
	 * Mocks for use in controlling structure unit tests.
	 */

	// some base modules
	angular.module('platform-helper', []);
	angular.module('cloud.common', ['platform-helper']);


	// controlling structure module
	var moduleName = 'controlling.structure';
	var contrStructModule = angular.module(moduleName, ['cloud.common']);

	// defining some constants
	contrStructModule.constant('_', _);
	contrStructModule.constant('moment', moment);
	contrStructModule.constant('globals', {webApiBaseUrl: ''});
	contrStructModule.constant('PlatformMessenger', function Messenger() {
		this.register = angular.noop;
		this.unregister = angular.noop;
		this.fire = angular.noop;
	});

	// mocks for some angular services
	// - company information
	contrStructModule.factory('controllingStructureContextService', ['controllingStructureTestUnitTestdataProvider',
		function (controllingStructureTestUnitTestdataProvider) {
			return {
				getCompany: function getCompany() {
					return controllingStructureTestUnitTestdataProvider.getCompany();
				}
			};
		}]);

	// - project information
	contrStructModule.factory('projectMainForCOStructureService', ['controllingStructureTestUnitTestdataProvider',
		function (controllingStructureTestUnitTestdataProvider) {
			return {
				getSelected: function getSelected() {
					return controllingStructureTestUnitTestdataProvider.getProject();
				}
			};
		}]);

	// - controlling units
	contrStructModule.factory('controllingStructureMainService', ['controllingStructureTestUnitTestdataProvider',
		function (controllingStructureTestUnitTestdataProvider) {
			return {
				getList: function getList() {
					controllingStructureTestUnitTestdataProvider.getControllingUnits();
				},
				gridRefresh: angular.noop // do nothing
			};
		}]);

	// - calendar Utilities
	contrStructModule.factory('calendarUtilitiesService', ['$q', 'controllingStructureTestUnitTestdataProvider',
		function ($q, controllingStructureTestUnitTestdataProvider) {
			return {
				// TODO: check if use httpbackend instead!
				getCalendarIdFromCompany: function getCalendarIdFromCompany() {
					var company = controllingStructureTestUnitTestdataProvider.getCompany();
					return $q.when(company.CalendarFk);
				}
			};
		}]);

})(angular);