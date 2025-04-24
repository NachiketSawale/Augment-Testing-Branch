/**
 * Created by balkanci on 02.12.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.common').controller('matrixBackgroundController', ['$scope', '_', 'basicsCommonBackgroundDataservice', 'platformGridControllerService', 'basicsCommonMatrixBackgroundStandardService', 'basicsCommonRuleAdapterService', 'basicsCommonRuleEditorService',
		function ($scope, _, basicsCommonBackgroundDataservice, platformGridControllerService, basicsCommonMatrixBackgroundStandardService, basicsCommonRuleAdapterService, ruleEditorService) {
			const gridConfig = {initCalled: false, columns: []};
			$scope.gridId = '6669ec89b72448eab7b4888452365374';
			$scope.entityName = 'Background';
			basicsCommonRuleAdapterService.addRuleEditorAdapter($scope, basicsCommonBackgroundDataservice);
			platformGridControllerService.initListController($scope, basicsCommonMatrixBackgroundStandardService, basicsCommonBackgroundDataservice, {}, gridConfig);
			$scope.manager = ruleEditorService.getDefaultManager(true);
		}
	]);

})(angular);

