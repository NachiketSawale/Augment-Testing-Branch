/**
 * Created by chlai on 2025/01/30
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.action';

	angular.module(moduleName).service('logisticActionItemTemplateSourceWindowControllerService', LogisticActionItemTemplateSourceWindowControllerService);

	LogisticActionItemTemplateSourceWindowControllerService.$inject = ['platformSourceWindowControllerService'];

	function LogisticActionItemTemplateSourceWindowControllerService(platformSourceWindowControllerService) {
		this.initSourceFilterController = function ($scope, uuid) {
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid, 'logisticActionContainerInformationService', 'logisticActionItemTemplateFilterService');
		};
	}
})(angular);