/**
 * Created by balkanci on 02.12.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.common').controller('matrixFontController', ['$scope', '_', 'basicsCommonFontDataservice', 'platformGridControllerService', 'basicsCommonFontStandardService', 'platformToolbarService', 'platformGridAPI', 'basicsCommonRuleAdapterService', 'basicsCommonRuleEditorService',
		function ($scope, _, basicsCommonFontDataservice, platformGridControllerService, basicsCommonFontStandardService, platformToolbarService, platformGridAPI, basicsCommonRuleAdapterService, ruleEditorService) {
			const gridConfig = {initCalled: false, columns: []};
			$scope.entityName = 'Font';
			$scope.gridId = '7b055f899e2642d193b0f75e603b18ee';
			basicsCommonRuleAdapterService.addRuleEditorAdapter($scope, basicsCommonFontDataservice);
			platformGridControllerService.initListController($scope, basicsCommonFontStandardService, basicsCommonFontDataservice, {}, gridConfig);
			$scope.manager = ruleEditorService.getDefaultManager(true);
		}
	]);
})(angular);

