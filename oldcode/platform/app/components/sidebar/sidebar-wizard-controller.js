/**
 @ngdoc controller
 * @name platformSidebarWizardsController
 * @function
 *
 * @description
 * platformSidebarWizardsController
 */

(function () {
	'use strict';

	angular.module('platform').controller('platformSidebarWizardsController', ['$scope', 'platformSidebarWizardConfigService',
		function ($scope, platformSidebarWizardConfigService) {

			platformSidebarWizardConfigService.setCurrentScope($scope);

			$scope.$on('$destroy', function () {
				platformSidebarWizardConfigService.setCurrentScope(null);
			});

		}]);
})();