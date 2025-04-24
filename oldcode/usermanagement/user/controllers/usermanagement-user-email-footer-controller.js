/**
 * Created by baf on 04.03.2025
 */

(function (angular) {
	'use strict';

	const moduleName = 'usermanagement.user';

	angular.module(moduleName).controller('usermanagementUserEmailFooterController', UsermanagementUserEmailFooterController);

	UsermanagementUserEmailFooterController.$inject = ['$scope', 'usermanagementUserEmailFooterDataService', 'platformSpecificationContainerControllerService'];

	function UsermanagementUserEmailFooterController($scope, usermanagementUserEmailFooterDataService, platformSpecificationContainerControllerService) {
		platformSpecificationContainerControllerService.initSpecificationController($scope, usermanagementUserEmailFooterDataService);
	}
})(angular);
