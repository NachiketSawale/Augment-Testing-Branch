/**
 * Created by lvy on 6/1/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterObjectTemplateController
	 * @require $scope
	 * @description controller for construction System Master Object Template Controller
	 */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterObjectTemplateController', [
		'$injector',
		'$scope',
		'platformControllerExtendService',
		'platformGridControllerService',
		'constructionSystemMasterObjectTemplateUIStandardService',
		'constructionSystemMasterObjectTemplateDataService',
		'constructionSystemMasterObjectTemplateValidationService',
		function (
			$injector,
			$scope,
			platformControllerExtendService,
			gridControllerService,
			gridColumns,
			dataService,
			validationService) {

			platformControllerExtendService.initListController($scope, gridColumns, dataService, validationService, {costGroupConfig: {
				dataLookupType: 'ObjectTemplate2CostGroups',
				identityGetter: function (entity) {
					return {
						MainItemId: entity.Id
					};
				}
			}});

		}]);
})(angular);
