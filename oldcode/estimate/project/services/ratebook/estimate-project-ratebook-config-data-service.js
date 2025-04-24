/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.project';
	let projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateProjectRateBookConfigDataService
	 * @function
	 *
	 * @description
	 * estimateProjectRateBookConfigDataService is the data service for all ratebook related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('estimateProjectRateBookConfigDataService',
		['_', '$http', 'platformGridAPI', '$q', '$injector', 'PlatformMessenger', 'platformSchemaService', 'platformRuntimeDataService', 'cloudCommonGridService', 'platformModalService',
			'basicsLookupdataTreeHelper', 'platformDataServiceFactory', 'cloudDesktopPinningContextService',

			function (_, $http, platformGridAPI, $q, $injector, PlatformMessenger, platformSchemaService, platformRuntimeDataService, cloudCommonGridService, platformModalService,
				basicsLookupdataTreeHelper, platformDataServiceFactory, cloudDesktopPinningContextService) {

				let service = {}, ratebookData = [], contentId = null, contentTypeId = null, isInProject = true, ifClosedInCustomize = false,
					contentDes = '', theProjectId = null, clearDataFlag = true;

				service.OnContenTypeChanged = new PlatformMessenger();
				service.OnMasterDataFilterChanged = new PlatformMessenger();
				service.onFilterDataIniting = new PlatformMessenger();
				service.onFilterDataInited = new PlatformMessenger();

				// filterType(Assembly category = 1, CoS Group =2, WIC group =3, material catalogy =4, estimate rule = 5)
				service.getData = function (filterType) {
					if(filterType){
						return _.filter(ratebookData, function (item) {
							return (item.FilterType === filterType);
						});
					}
					return ratebookData;
				};

				service.getFilterIds = function (filterType) {
					let filterData = service.getData(filterType);
					if(filterData && filterData.length > 0) {
						return _.map(filterData, function (item) {
							return item.FilterId;
						});
					}
					return [];
				};

				service.getFilterData = function (data, filterType) {
					let filterIds = service.getFilterIds(filterType);
					// if filterType == 1
					let context = {
						treeOptions:{
							parentProp : 'EstAssemblyCatFk',
							childProp : 'AssemblyCatChildren'
						},
						IdProperty: 'Id'
					};

					if(filterType === 3){
						context.treeOptions.parentProp = 'WicGroupFk';
						context.treeOptions.childProp = 'WicGroups';
					}

					let flatList = [];
					cloudCommonGridService.flatten(data, flatList, context.treeOptions.childProp);
					let result = [];
					if(filterIds && filterIds.length > 0) {
						_.each(flatList, function (item) {
							if(_.includes(filterIds, item.Id)){
								result.push(item);
							}
						});
					}
					else{
						return data;
					}

					return basicsLookupdataTreeHelper.buildTree(result, context);
				};

				service.getContentByTypeId = function (_typeId) {
					return $http.get(globals.webApiBaseUrl + 'project/main/ratebook/getcontentbytypeid?contentTypeId=' + _typeId);
				};

				let url = globals.webApiBaseUrl + 'project/main/ratebook/list';
				/**
			 * @ngdoc function
			 * @name initData
			 * @function
			 * @methodOf estimateProjectRateBookConfigDataService
			 * @description will init the master data filter data when module loaded
			 */
				service.initData = function (projectId) {
					let defer = $q.defer();
					let existProjectContainer = platformGridAPI.grids.exist('713b7d2a532b43948197621ba89ad67a');

					if(!projectId && existProjectContainer){
					// should exist the project container
						let projectMainService = $injector.get('projectMainService');
						let project = projectMainService.getSelected();
						if (project) {
							projectId = project.Id;
						}
					}
					if(!projectId){
						let item = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (item) {
							projectId = item.id;
						}
					}
					if(!projectId){
						projectId = $injector.get('estimateMainService').getSelectedProjectId();
					}
					if(projectId) {
						theProjectId = projectId;
						let postData = {
							PKey1: projectId
						};
						service.onFilterDataIniting.fire();
						$http.post(url, postData).then(function (result) {
							ratebookData = result.data;
							service.onFilterDataInited.fire(ratebookData);
							defer.resolve(ratebookData);
						});
						return defer.promise;
					}
					else {
						return $q.when([]);
					}
				};

				service.initDataByContentType = function (contentTypeId) {
					let postData = {
						PKey2: contentTypeId
					};
					return $http.post(url, postData).then(function (result) {
						ratebookData = result.data;
						service.onFilterDataInited.fire(ratebookData);
					});
				};

				service.saveConfigData = function (contentId, contentTypeId, _postData, contentDes) {
					let postData = {
						ContentId: contentId,
						ContentTypeId: contentTypeId,
						PostData: _postData,
						ContentDescription: contentDes
					};
					return $http.post(globals.webApiBaseUrl + 'project/main/ratebook/savedata', postData).then(function (response) {
						return response.data;
					});
				};

				service.showDialogFromCustormize = function (_contentTypeId, _contentId) {
					contentId = _contentId;
					contentTypeId = _contentTypeId;
					isInProject = false;
					ifClosedInCustomize = false;

					let dialogOptions = {
						templateUrl: globals.appBaseUrl + 'estimate.project/templates/estimate-project-ratebook-config-dialog-templates.html',
						controller: 'estimateProjectRateBookDialogController',
						width: '900px',
						height: '600px',
						resizeable: true
					};
					platformSchemaService.getSchemas([{typeName: 'RateBookDto', moduleSubModule: 'Project.Main'}]).then(function () {
						let estimateProjectRateBookDataService = $injector.get('estimateProjectRateBookDataService');
						if(estimateProjectRateBookDataService) {
							estimateProjectRateBookDataService.load().then(function () {
								service.getContentByTypeId(contentTypeId).then(function (content) {
									if(content.data && content.data.DescriptionInfo) {
										service.setCustomizeContentDes(content.data.DescriptionInfo.Description);
									}

									platformModalService.showDialog(dialogOptions).then(function (result) {
										if (result && result.isOK) {
											// save config ratebook
											let postData = estimateProjectRateBookDataService.getList();
											let contentId = service.getCustomizeContentId();
											let contentTypeId = service.getCustomizeContentTypeId();
											service.saveConfigData(contentId, contentTypeId, postData, contentDes).then(function (response) {
												let  boqService = $injector.get('boqMainDocPropertiesService');
												if(boqService) {
													boqService.boqPropertiesSaved.fire(null, response);
												}
											});
										}
										service.clearData();
									}
									);
								});
							});
						}
					});
				};

				service.getCustomizeContentId = function () {
					return contentId;
				};

				service.getCustomizeContentTypeId = function () {
					return contentTypeId;
				};

				service.setCustomizeContentDes = function (_description) {
					contentDes = _description;
				};

				service.getCustomizeContentDes = function () {
					return contentDes;
				};

				service.isInProject = function () {
					return isInProject;
				};

				service.setProjectId = function (_projectId) {
					theProjectId = _projectId;
				};

				service.getProjectId = function () {
					return theProjectId;
				};

				service.setContentTypeId = function (_contentTypeId) {
					contentTypeId = _contentTypeId;
				};

				service.ifClosedInCustomize = function () {
					return ifClosedInCustomize;
				};

				service.SetIfClosedInCustomize = function (_ifClosedInCustomize) {
					ifClosedInCustomize = _ifClosedInCustomize;
				};

				service.setClearDataFlag = function (_flag) {
					clearDataFlag = _flag;
				};

				service.clearData = function () {
					if(clearDataFlag) {
						ratebookData = [];
						contentTypeId = null;
						contentId = null;
						isInProject = true;
						theProjectId = null;
					}
					else{
						clearDataFlag = true;
					}
				};

				service.reSetData = function () {
					isInProject = true;
				};

				// using this fn to force reload data -> assembly category tree and wic boq tree in estimate
				service.updateProjectId = function () {
				// reset projectId in boq tree in estimate
					$injector.get('estimateMainBoqService').resetProjectId();
				};

				/**
			 * @ngdoc function
			 * @name setRateBookData
			 * @function
			 * @methodOf service
			 * @description will init data external
			 */
				service.setRateBookData = function (data) {
					ratebookData = data;
				};

				return service;

			}]);
})(angular);
