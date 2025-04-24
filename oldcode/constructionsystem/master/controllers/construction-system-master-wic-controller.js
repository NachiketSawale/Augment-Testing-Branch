/**
 * Created by xsi on 2015-12-23.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterWicController',
		['$scope', 'constructionSystemMasterWicService', 'platformGridControllerService',
			'constructionSystemMasterWicUIStandardService', 'constructionSystemMasterWicValidationService',
			'constructionSystemMasterClipboardService',
			/* jshint -W072 */
			function ($scope, constructionSystemMasterWicService, platformGridControllerService,
				constructionSystemMasterWicUIStandardService, constructionSystemMasterWicValidationService,
				constructionSystemMasterClipboardService) {

				platformGridControllerService.initListController($scope, constructionSystemMasterWicUIStandardService,
					constructionSystemMasterWicService, constructionSystemMasterWicValidationService,
					{dragDropService: constructionSystemMasterClipboardService});
			}
		]);

})(angular);
