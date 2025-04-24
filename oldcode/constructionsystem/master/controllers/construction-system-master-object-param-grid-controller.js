/**
 * Created by xsi on 2017-03-01.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterObjectParamListController', [
		'$scope', 'platformGridControllerService', 'constructionSystemMasterObject2ParamUIStandardService',
		'constructionSystemMasterObjectParamService','constructionSystemCommonObjectParamValidationService', '$injector', '_',
		function ($scope, platformGridControllerService, uiConfigService, dataService,validationService, $injector, _) {

			var parentService = $injector.get('constructionSystemMasterModelObjectDataService');
			platformGridControllerService.initListController($scope, uiConfigService, dataService, validationService(dataService, parentService), {});
			var removeItems = ['create'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});
		}

	]);
})(angular);
