/**
 * Created by xai on 4/18/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('materialcatalogSyncFromYtwoService',
		['$http','$q','$timeout','$translate','globals',
			'platformDataServiceFactory','platformDataServiceProcessDatesBySchemeExtension','PlatformMessenger','cloudCommonLanguageService',
			function ($http,$q,$timeout,$translate,globals, platformDataServiceFactory,platformDataServiceProcessDatesBySchemeExtension, PlatformMessenger,cloudCommonLanguageService) {
				var service = {};

				service.onBasicSettingsFinishedEvent = new PlatformMessenger();
				service.onCatalogUpdateFinishedEvent = new PlatformMessenger();
				service.onCatalogValidateFinishedEvent = new PlatformMessenger();

				service.onBasicSettingsFinished = function (){
					service.onBasicSettingsFinishedEvent.fire();
				};
				service.onCatalogUpdateFinished = function () {
					service.onCatalogUpdateFinishedEvent.fire();
				};
				service.onCatalogValidateFinished = function (value) {
					service.onCatalogValidateFinishedEvent.fire(value);
				};
				service.allSettings = {};

				service.getBasicSettings = function () {
					return service.allSettings.basicSettings;
				};

				service.getUpdateSettings = function () {
					return  service.allSettings.updateSettings;
				};
				service.setBasicSettings = function (value) {
					service.allSettings.basicSettings = value;
				};

				service.setUpdateSettings = function (value) {
					service.allSettings.updateSettings = value;
				};
				service.setValidateFlag = function (value) {
					service.allSettings.validateFlag = value;
				};
				service.getValidateFlag = function () {
					return service.allSettings.validateFlag;
				};
				var validateCodesFormat=function (result) {
					var start=result.indexOf(',');
					if(_.isEmpty(result) || start === -1){
						return true;
					}
					if(result !== ''&& angular.isDefined(result) && start !== -1){
						var pattern=/^([A-Za-z0-9]+,)*[A-Za-z0-9]+$/;
						var validationFormat=pattern.test(result);
						if (validationFormat) {
							return true;
						}
					}
					return false;
				};
				service.doBasicSettingReady = function()
				{
					var result=service.allSettings.basicSettings;
					var deferred = $q.defer();
					if(!validateCodesFormat(result.companyCodes))
					{
						deferred.resolve({
							result:false,
							description:$translate.instant('basics.materialcatalog.codeFormat')
						});
					}
					else
					{
						cloudCommonLanguageService.getLanguageItems().then(function (data) {
							var selectedItem = _.find(data,{Culture:result.language});
							var resultCodes=
                            {
                            	companyCodes:result.companyCodes,
                            	selectLanguage:selectedItem.Id
                            };
							$http({
								method: 'POST',
								url: globals.webApiBaseUrl + 'basics/materialcatalog/catalog/searchinternetcatalog',
								data: {CatalogCodes:resultCodes.companyCodes,SelectLanguageId:resultCodes.selectLanguage}
							}).then(function (resultData) {
								// var errorMessage='';
								var result=resultData.data;
								var tempdata=[];
								var dataList={
									data:data,
									selectList:''
								};
								if(result && _.isArray(result) && result.length>0){
									_.forEach(result, function (item) {
										tempdata.push({
											ytwocode: item.YTWOCatalogCodes,
											code: item.CatalogCodes,
											description: item.CatalogCodeDesp,
											updatestatus: item.UpdateStatus,
											bpname: item.BpName,
											itwocode:item.ITWOCatalogCode,
											companycode:item.CompanyCode
										});
									});
									dataList.data=tempdata;
								}
								service.setUpdateSettings(dataList);
								deferred.resolve({
									result:true,
									description:''
								});
							}).catch(function () {
								deferred.resolve({
									result:false,
									description:''
								});
							});
						});
					}
					return deferred.promise;
				};

				service.doUpdateSettingReady = function(isNext)
				{
					var deferred = $q.defer();

					var selections = service.allSettings.updateSettings.selectList;
					if(isNext)
					{
						if(selections.length === 0){
							deferred.resolve({
								result:false,
								description:$translate.instant('basics.materialcatalog.noitemcodeselect')
							});
						}
						else{
							$http.get(globals.webApiBaseUrl + 'basics/materialcatalog/catalog/getsynccodeunique').then(function (result) {
								service.onCatalogValidateFinished(result.data);
								if(!service.getValidateFlag()){
									var originalCodes=service.getBasicSettings();
									cloudCommonLanguageService.getLanguageItems().then(function (data) {
										var selectedItem = _.find(data,{Culture:originalCodes.language});
										var selectLanguageId=selectedItem.Id;
										$http({
											method: 'POST',
											url: globals.webApiBaseUrl + 'basics/materialcatalog/catalog/syncCatalog',
											data: {OriginalCatalogCodes:originalCodes.companyCodes,CatalogCodes:selections,SelectLanguageId:selectLanguageId}
										}).then(function(response){
											if(response.data && angular.isArray(response.data) && response.data.length !== 0){
												deferred.resolve({
													result:true,
													description:response.data
												});
											}
											else{
												deferred.resolve({
													result:true,
													description:$translate.instant('basics.materialcatalog.resultMsg')
												});
											}
										}).catch(function () {
											deferred.resolve({
												result:false,
												description:''
											});
										});
									});
								}
								else {
									deferred.resolve({
										result:false,
										description:''
									});
								}
							});
						}
					}
					else {
						deferred.resolve({
							result:true,
							description:''
						});
					}
					return deferred.promise;
				};
				return service;
			}
		]);
})(angular);