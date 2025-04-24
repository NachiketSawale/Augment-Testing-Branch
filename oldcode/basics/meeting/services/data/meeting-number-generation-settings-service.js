/**
 * Created by chd on 5/10/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';
	let serviceName = 'meetingNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name meetingNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * meetingNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory(serviceName, ['meetingNumberGenerationServiceProvider',
		function (meetingNumberGenerationServiceProvider) {
			return meetingNumberGenerationServiceProvider.getInstance(serviceName);
		}]);
})(angular);
