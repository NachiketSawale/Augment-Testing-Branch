/**
 * Created by yew on 3/11/2020.
 */
(function () {
	/* global globals,_ */
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentsProjectFileDefaultPreviewProgramService',
		['$q','$http','$injector', 'platformRuntimeDataService',
			function ($q, $http, $injector, runtimeDataService) {
				var service = {};
				service.gridId = '74F12141BD4D43BE8B8175390C7F2129';
				service.data = null;
				service.isThisTab = true;

				service.defaultDocumentDefinitions = function defaultDocumentDefinitions(){
					var data = [];
					data.push(dataFormat('pdf', true, 'html',['pdf']));
					data.push(dataFormat('image', true, 'wde',['jpg', 'png', 'jpeg', 'bmp']));
					return data;
				};

				service.getDocumentDefinitions = getDocumentDefinitions;
				function getDocumentDefinitions() {
					var deffered = $q.defer();
					if (!service.gettingData) {
						service.gettingData = true;
						$http.get(globals.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions')
							.then(function (result) {
								service.gettingData = false;
								var defaultPrograms = _.filter(result.data, {FilterName: 'Default Preview Program'});
								if (defaultPrograms && defaultPrograms[0]) {
									var def = JSON.parse(defaultPrograms[0].FilterDef);
									if (def.data) {
										service.data = def.data;
										service.isThisTab = def.isThisTab !== false;
									} else if (def.indexOf('systemDefault') > 0) {
										service.data = def;
									} else {
										service.data = service.defaultDocumentDefinitions();
									}
								} else {
									service.data = service.defaultDocumentDefinitions();
								}
								deffered.resolve(service.data);
							});
					} else {
						deffered.resolve([]);
					}
					return deffered.promise;
				}
				service.setData = function setData(data, isThisTab) {
					service.data = data;
					service.isThisTab = isThisTab;
					var documentPreviewItem = {
						FilterName: 'Default Preview Program',
						AccessLevel: 'User'
					};
					if (data) {
						documentPreviewItem.FilterDef = JSON.stringify({
							data: data,
							isThisTab: isThisTab
						});
					}
					$http.post(globals.webApiBaseUrl + 'basics/common/document/savedocumentdefinition', documentPreviewItem);
				};

				service.getByFileType = function getByFileType(fileTypes) {
					if (!fileTypes) { return null; }
					let fileTypeStr = fileTypes.toString();
					if (service.data === null) {
						service.data = service.defaultDocumentDefinitions();
						getDocumentDefinitions();
					}
					return _.find(service.data, function (t) {
						var typeItem = _.find(t.typeList, function (e) {
							return fileTypeStr.indexOf(e) > -1;
						});
						return typeItem !== null && !angular.isUndefined(typeItem);
					});
				};
				service.documentDefinitionByFileType = function documentDefinitionByFileType(extensionName) {
					if (service.data === null) {
						getDocumentDefinitions();
						return null;
					}
					var fileTypeStr = extensionName.toString();
					return _.find(service.data, function (t) {
						var typeItem = _.find(t.typeList, function (e) {
							return fileTypeStr.indexOf(e) > -1;
						});
						return typeItem !== null && !angular.isUndefined(typeItem);
					});
				};

				function dataFormat(fileType, isSystemDefault, viewType, typeList){
					return {
						'Id': fileType,
						'fileType': fileType,
						'twoDViewer': isSystemDefault === false,
						'systemDefault': isSystemDefault,
						'viewType': viewType,
						'typeList': typeList
					};
				}

				service.setPreviewTab = function setPreviewTab(data, isTab) {
					if (isTab) {
						angular.forEach(data, function (item) {
							item.twoDViewer = true;
							item.systemDefault = false;
							setItemReadonly(item, true);
						});
					} else {
						angular.forEach(data, function (item) {
							setItemReadonly(item, false);
						});
					}
				};
				function setItemReadonly(entity, isReadonly){
					var fields = ['twoDViewer', 'systemDefault'];
					var readonlyArr = [];
					angular.forEach(fields, function (field) {
						readonlyArr.push({field: field, readonly: isReadonly});
					});
					runtimeDataService.readonly(entity, readonlyArr);
				}
				return service;

			}]);
})();