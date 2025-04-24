/**
 * Created by jim on 6/12/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemQuantityQueryEditorControllerService', ['platformDataServiceFactory',
		'$q', '$http', 'PlatformMessenger', 'basicsQuantityQueryEditorService', 'cloudCommonLanguageService',
		function (platformDataServiceFactory,
			$q, $http, PlatformMessenger, basicsQuantityQueryEditorService, cloudCommonLanguageService) {

			var serviceContainer = {
				createService: function () {
					var service = {};
					service.scope = null;

					service.setScope = function (scp) {
						service.scope = scp;
					};

					service.initialCaption = function (languageItem,typeFlag) {
						if (languageItem.Id === basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId) {
							service.onLanguageSelectionChanged.fire(languageItem.Id,typeFlag);
							return languageItem.Description + '(√)';
						} else {
							return languageItem.Description;
						}
					};

					service.setSelectedCaption = function (languageId) {
						var languageObjects = service.scope.languageObjectsArray;
						for (var i = 0; i < languageObjects.length; i++) {
							languageObjects[i].caption = languageObjects[i].captionConstant;
							if (languageObjects[i].id === languageId) {
								languageObjects[i].caption = languageObjects[i].captionConstant + '(√)';
							}
						}
					};

					service.languageItems=null;

					function getLanguageObjectArray(typeFlag){
						var langArray = [];
						if (service.languageItems) {
							angular.forEach(service.languageItems, function (item) {
								let description = item.Description
									?item.Description
									:(item.DescriptionInfo.Translated || item.DescriptionInfo.Description);
								let langObj = {
									id: item.Id,
									captionConstant: description,
									caption: service.initialCaption(item,typeFlag),
									type: 'item',
									fn: function () {
										var languageObjects = service.scope.languageObjectsArray;
										for (var i = 0; i < languageObjects.length; i++) {
											languageObjects[i].caption = languageObjects[i].captionConstant;
										}
										this.caption = description + '(√)';
										if (typeFlag==='cosParameter'){
											if (basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId !== item.Id) {
												basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId = item.Id;
												service.onLanguageSelectionChanged.fire(item.Id,typeFlag);
											}
										}else if(typeFlag==='cosParameter2Template'){
											if (basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId !== item.Id) {
												basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId = item.Id;
												service.onLanguageSelectionChanged.fire(item.Id,typeFlag);
											}
										}
									}
								};
								langArray.push(langObj);
							});
						}
						return langArray;
					}

					service.getLanguages = function (typeFlag) {
						var deffered = $q.defer();
						var langArray=[];
						if(service.languageItems===null){
							cloudCommonLanguageService.getLanguageItems().then(function (response) {
								if(!basicsQuantityQueryEditorService.languageCodeMapLanguageIdOject){
									basicsQuantityQueryEditorService.languageCodeMapLanguageIdOject={};
									if(!!response&&angular.isArray(response)){
										for(var i=0; i<response.length; i++){
											basicsQuantityQueryEditorService.languageCodeMapLanguageIdOject[response[i].Id]=response[i].Culture;
										}
									}
								}
								service.languageItems=response;
								langArray=getLanguageObjectArray(typeFlag);
								deffered.resolve(langArray);
							});
						}else{
							langArray=getLanguageObjectArray(typeFlag);
							deffered.resolve(langArray);
						}

						return deffered.promise;
					};

					service.onLanguageSelectionChanged = new PlatformMessenger();

					service.languageSelectionChangedHasRegistered = false;

					service.registerLanguageSelectionChanged = function (languageSelectionChangedCallBack) {
						if (languageSelectionChangedCallBack !== null && languageSelectionChangedCallBack !== undefined && service.languageSelectionChangedHasRegistered === false) {
							service.onLanguageSelectionChanged.register(languageSelectionChangedCallBack);
							service.languageSelectionChangedHasRegistered = true;
						}
					};

					service.unRegisterLanguageSelectionChanged = function (languageSelectionChangedCallBack) {
						service.onLanguageSelectionChanged.unregister(languageSelectionChangedCallBack);
						service.languageSelectionChangedHasRegistered = false;
					};
					return service;
				}
			};

			return serviceContainer;
		}
	]);

})(angular);
