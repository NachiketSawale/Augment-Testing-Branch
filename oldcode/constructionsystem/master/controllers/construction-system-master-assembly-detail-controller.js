/**
 * Created by xsi on 2015-12-23.
 */
(function(angular){
	'use strict';
	var moduleName='constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterAssemblyDetailController',
		['$scope','platformDetailControllerService','constructionSystemMasterAssemblyService',
			'constructionSystemMasterAssemblyValidationService','constructionSystemMasterAssemblyUIStandardService',
			'platformTranslateService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function($scope,platformDetailControllerService,constructionSystemMasterAssemblyService,
				constructionSystemMasterAssemblyValidationService,constructionSystemMasterAssemblyUIStandardService,
				platformTranslateService){
				platformDetailControllerService.initDetailController($scope,constructionSystemMasterAssemblyService,
					constructionSystemMasterAssemblyValidationService,constructionSystemMasterAssemblyUIStandardService,{
						getTranslate: function () {
							return platformTranslateService.instant;
						}
					});
			}

		]);

})(angular);
