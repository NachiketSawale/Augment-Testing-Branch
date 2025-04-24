(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsCompanyNumberController',
		['$scope', 'basicsCompanyRubricCategoryIndexService', 'basicsCompanyNumberUIStandardService', 'basicCompanyNumberValidationService', 'platformGridControllerService', 'platformTranslateService',
			function ($scope, basicsCompanyRubricCategoryIndexService, basicsCompanyNumberUIStandardService, basicCompanyNumberValidationService, platformGridControllerService, platformTranslateService) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'ParentId',
					childProp: 'Children',
					enableConfigSave: true,
					statusbar: true
				};

				platformTranslateService.translateGridConfig(basicsCompanyNumberUIStandardService.getStandardConfigForListView().columns);
				$scope.gridId = '051e986eb1c34784a13c38d549f57a1b';
				platformGridControllerService.initListController($scope, basicsCompanyNumberUIStandardService, basicsCompanyRubricCategoryIndexService, basicCompanyNumberValidationService, myGridConfig);

			}
		]);
})();