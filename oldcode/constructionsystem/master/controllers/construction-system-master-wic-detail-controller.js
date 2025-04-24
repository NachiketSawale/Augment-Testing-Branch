/**
 * Created by xsi on 2015-12-24.
 */
(function(angular){
	'use strict';
	var moduleName='constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterWicDetailController',
		['$scope', '$translate', 'procurementCommonHelperService', 'constructionSystemMasterWicService',
			'platformDetailControllerService', 'constructionSystemMasterWicUIStandardService',
			'constructionSystemMasterWicValidationService','platformTranslateService',
			/* jshint -W072 */
			function ($scope, $translate, procurementCommonHelperService, constructionSystemMasterWicService,
				platformDetailControllerService, constructionSystemMasterWicUIStandardService,
				constructionSystemMasterWicValidationService,platformTranslateService) {

				platformDetailControllerService.initDetailController($scope, constructionSystemMasterWicService,
					constructionSystemMasterWicValidationService,constructionSystemMasterWicUIStandardService, {
						getTranslate: function () {
							return platformTranslateService.instant;
						}
					});

				$scope.$on('$destroy', function () {

				});

			}

		]);

})(angular);