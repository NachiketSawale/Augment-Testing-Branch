/**
 * Created by xsi on 2015-12-14.
 */
(function(angular){
	'use strict';
	var moduleName='constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterAssemblyController',
		['$scope', '$translate', 'procurementCommonHelperService', 'constructionSystemMasterAssemblyService',
			'platformGridControllerService', 'constructionSystemMasterAssemblyUIStandardService',
			'constructionSystemMasterAssemblyValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $translate, procurementCommonHelperService, constructionSystemMasterAssemblyService,
				platformGridControllerService, constructionSystemMasterAssemblyUIStandardService,
				constructionSystemMasterAssemblyValidationService) {
				platformGridControllerService.initListController($scope,constructionSystemMasterAssemblyUIStandardService,
					constructionSystemMasterAssemblyService,constructionSystemMasterAssemblyValidationService, {});

				$scope.$on('$destroy', function () {

				});

			}

		]);

})(angular);
