/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.common';

	angular.module(moduleName).controller('salesCommonCreateDialogTabBoqController',
		['_', '$scope', 'platformTranslateService', 'salesCommonCreateDialogService', 'salesCommonCopyBoqWizardService',
			function (_, $scope, platformTranslateService, salesCommonCreateDialogService, salesCommonCopyBoqWizardService) {

				var formConfig = salesCommonCopyBoqWizardService.getFormConfig();
				platformTranslateService.translateFormConfig(formConfig);

				$scope.dataItem = salesCommonCreateDialogService.getBoqDataItem();

				$scope.formContainerOptions = {
					formOptions: {
						configure: formConfig
					}
				};
			}]);

})();
