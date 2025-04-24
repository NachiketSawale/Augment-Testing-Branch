/**
 * Created by baf on 2018-08-29.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	angular.module(moduleName).service('logisticDispatchingSourceWindowControllerService', LogisticDispatchingSourceWindowControllerService);

	LogisticDispatchingSourceWindowControllerService.$inject = ['platformSourceWindowControllerService'];

	function LogisticDispatchingSourceWindowControllerService(platformSourceWindowControllerService) {
		this.initSourceFilterController = function ($scope, uuid) {
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid, 'logisticDispatchingContainerInformationService', 'logisticDispatchingSourceFilterService');
		};
	}
})(angular);