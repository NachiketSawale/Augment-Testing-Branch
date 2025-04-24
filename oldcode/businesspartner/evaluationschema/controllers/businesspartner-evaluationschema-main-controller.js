(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.evaluationschema';
	angular.module(moduleName).controller('businesspartnerEvaluationschemaController',
		['$scope', '$timeout', 'mainViewService', 'businesspartnerEvaluationschemaHeaderService',
			'platformMainControllerService', 'businesspartnerEvaluationschemaTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $timeout, mainViewService, mainService, mainControllerService, translateService) {
				let opt = {search: true, infos: false, wizards: false, auditTrail: '9ae293634af24deaab9f297dd1aba8e3'};
				let result = mainControllerService.registerCompletely($scope, mainService, {}, translateService, moduleName, opt);
				// enable filters in contract header filter service
				mainService.registerSidebarFilter();
				$scope.$on('$destroy', function () {
					mainControllerService.unregisterCompletely(mainService, result, translateService, opt);
				});

			}]);
})(angular);
