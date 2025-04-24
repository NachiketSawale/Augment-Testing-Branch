/**
 * Created by xai on 4/18/2018.
 */
(function () {

	'use strict';
	var moduleName = 'basics.materialcatalog';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsMaterialcatalogSyncCatalogBasicSetController',
		['$scope', '$translate', 'platformTranslateService','platformGridAPI','platformModalService','cloudCommonLanguageService','platformContextService','$http','globals','materialcatalogSyncFromYtwoService',
			function ($scope, $translate, platformTranslateService,platformGridAPI,platformModalService,cloudCommonLanguageService,platformContextService,$http,globals,materialcatalogSyncFromYtwoService) {

				$scope.data={
					companyCodes:'',
					language:''
				};
				var dataLanguageId=platformContextService.getDataLanguageId();
				$scope.inputLabel=$translate.instant('basics.materialcatalog.companycodes');
				init();
				function init() {
					var originalCodes=materialcatalogSyncFromYtwoService.getBasicSettings();
					if(angular.isDefined(originalCodes) && originalCodes){
						$scope.data.companyCodes=originalCodes.companyCodes;
						$scope.data.language=originalCodes.language;
					}
					else{
						// get company
						var companyId = platformContextService.getContext().clientId;
						$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId).then(function (response) {
							var result = response.data;
							if (!result || result.length === 0) {
								return;
							}
							$scope.data.companyCodes=result.Code;
						});
						cloudCommonLanguageService.getLanguageItems().then(function (data) {
							var selectedItem = _.find(data,{Id:dataLanguageId});
							$scope.data.language=selectedItem.Culture;
						});
					}
				}
				function saveBasicSettings() {
					materialcatalogSyncFromYtwoService.setBasicSettings($scope.data);
				}
				materialcatalogSyncFromYtwoService.onBasicSettingsFinishedEvent.register(saveBasicSettings);

				$scope.$on('$destroy', function () {
					materialcatalogSyncFromYtwoService.onBasicSettingsFinishedEvent.unregister(saveBasicSettings);
				});
			}
		]);
})();