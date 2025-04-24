/**
 * Created by ysl on 12/13/2017.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCompanyImportContentSettingsController',
		['$scope', '_', 'platformUserInfoService', 'globals',
			'basicsCompanyImportContentService',
			'basicsCompanyImportContentSettingsService', 'platformContextService', 'cloudCommonLanguageService',
			function ($scope, _, platformUserInfoService, globals,
				basicsCompanyImportContentService,
				basicsCompanyImportContentSettingsService, platformContextService, cloudCommonLanguageService) {


				$scope.data = {
					contentServerURL: '',
					userName: '',
					password: '',
					internalImport: false,
					accessToken:'', // for internal import, we should use the access token.
					language: 'en'
				};

				$scope.$watch('data.internalImport',function (newValue) {
					if(newValue === true){
						$scope.data.contentServerURL = globals.clientUrl;
						var userInfo = platformUserInfoService.getCurrentUserInfo();
						$scope.data.userName = userInfo.UserName;
						$scope.data.password = '';
					}
				});


				function saveContentSettings() {
					basicsCompanyImportContentService.setBasicSettings($scope.data);
				}

				basicsCompanyImportContentSettingsService.getSettings().then(function (response) {
					var result = response.data;
					if (!_.isEmpty(result)) {
						$scope.data.contentServerURL = result.ContentServerURL;
						$scope.data.userName = result.UserName;
						// $scope.data.password = result.Password;
						$scope.data.language = result.Language;
					}

					var dataLanguageId = platformContextService.getContext().dataLanguageId;
					cloudCommonLanguageService.getLanguageItems().then(function (items) {
						var dataLanguage = _.find(items, {Id: dataLanguageId});
						if (dataLanguage) {
							$scope.data.language = dataLanguage.Culture;
						}
					});

				});

				basicsCompanyImportContentService.onBasicSettingsFinishedEvent.register(saveContentSettings);

				$scope.$on('$destroy', function () {
					basicsCompanyImportContentService.onBasicSettingsFinishedEvent.unregister(saveContentSettings);
				});

			}
		]);
})();
