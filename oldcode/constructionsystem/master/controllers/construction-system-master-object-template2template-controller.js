/**
 * Created by lvy on 9/7/2018.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterObjectTemplate2TemplateController
	 * @require $scope
	 * @description controller for construction System Master Object Template2Template Controller
	 */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterObjectTemplate2TemplateController', [
		'$injector',
		'$scope',
		'platformControllerExtendService',
		'platformGridControllerService',
		'constructionSystemMasterObjectTemplate2TemplateUIStandardService',
		'constructionSystemMasterObjectTemplate2TemplateDataService',
		'constructionSystemMasterObjectTemplateValidationService',
		function (
			$injector,
			$scope,
			platformControllerExtendService,
			gridControllerService,
			gridColumns,
			dataService,
			validationService) {

			platformControllerExtendService.initListController($scope, gridColumns, dataService, validationService, {costGroupConfig:{
				dataLookupType: 'ObjectTemplate2Template2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			}});

			dataService.load();
		}]);
})(angular);