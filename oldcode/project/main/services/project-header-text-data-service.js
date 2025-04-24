/**
 * Created by shen on 10/21/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.main';
	let projectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectHeaderTextDataService
	 * @description provides validation methods for project header text entities
	 */
	projectModule.factory('projectHeaderTextDataService',
		['PlatformMessenger', 'globals', '$http', 'platformModalService', 'projectMainService', 'platformDataServiceFactory', 'basicsCommonTextFormatConstant', '_', 'projectTextModuleTypeLookupDataService', '$q', 'basicsLookupdataLookupFilterService', 'basicsTextModulesMainService',
			function (PlatformMessenger, globals, $http, platformModalService, projectMainService, platformDataServiceFactory, basicsCommonTextFormatConstant, _, projectTextModuleTypeLookupDataService, $q, basicsLookupdataLookupFilterService, basicsTextModulesMainService) {


			  let initialised = false;
			  basicsTextModulesMainService.load().then(() => initialised = true);


				basicsLookupdataLookupFilterService.registerFilter([
					{
						key: 'project-main-bas-text-type-filter',
						fn: function (textModuleType) {
							const filteredTextModuleTypes = projectTextModuleTypeLookupDataService.getTextModuleTypeIdsWithIsGlobal();

							if (filteredTextModuleTypes.includes(textModuleType.Id)) {
								return true;
							}

							if (initialised === true) {
								let textModulesWithRubric3 = _.filter(basicsTextModulesMainService.getList(), function (item) {
									return item.RubricFk === 3 && item.TextModuleTypeFk === textModuleType.Id;
								});

								// True if this text module type has any "children" with rubric === 3
								return textModulesWithRubric3.length > 0;
							}
						}
					}

				]);

				let projectHeaderTextServiceOption = {
					flatLeafItem: {
						module: projectModule,
						serviceName: 'projectHeaderTextDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'project/main/headertext/',
							initReadData: function initReadData(readData) {
								let project = projectMainService.getSelected();
								let projectId = project.Id;
								let sourceModule = 'project.main';
								readData.filter = '?projectId=' + projectId + '&sourceModule=' + sourceModule;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									if (readData) {
										readData.Main = readData.Main || readData;
										return data.handleReadSucceeded(readData.Main, data);
									}
								},
								initCreationData: function initCreationData(creationData) {
									let project = projectMainService.getSelected();
									creationData.projectId = project.Id;
									creationData.sourceModule = 'project.main';
								}
							}
						},
						dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}],
						entityRole: {
							leaf: {itemName: 'ProjectHeaderblob', parentService: projectMainService}
						}
					}
				};


				function onSelectionChanged() {
					getTextModuleList();
				}


				function getTextModuleList(entity) {
					let project = service.getSelected();
					entity = entity || service.getSelected();
					if (!project || !entity) {
						return $q.when(null);
					}
					let textModuleTypeFk = entity.BasTextModuleTypeFk || -1;


					return $http.get(globals.webApiBaseUrl + 'basics/textmodules/prjHeaderTextModuleList?textModuleTypeFk='+ textModuleTypeFk)
						.then(function (response) {
							if (!response) {
								return;
							}
							let textModuleList = response.data;
							service.prjHeaderTextTypeChange.fire(null, {entity: entity, textModuleList: textModuleList});
							return textModuleList;
						});
				}



				// Data Processor Functions

				function processItem(entity) {
					entity.keepOriginalContentString = true;
					entity.keepOriginalPlainText = true;
					entity.originalContent = entity.Content;
					entity.originalContentString = entity.ContentString;
					entity.originalPlainText = entity.PlainText;

					if (entity.TextFormatFk === basicsCommonTextFormatConstant.specification) {
						entity.PlainText = null;
					} else if (entity.TextFormatFk === basicsCommonTextFormatConstant.html) {
						entity.Content = null;
						entity.ContentString = null;
					} else if (entity.TextFormatFk === basicsCommonTextFormatConstant.hyperlink) {
						entity.Content = null;
						entity.ContentString = null;
						entity.PlainText = null;
					}
				}

				function revertProcessItem(entity) {
					if (entity.keepOriginalContentString) {
						entity.ContentString = entity.originalContentString;
						entity.Content = entity.originalContent;
					}

					if (entity.keepOriginalPlainText) {
						entity.PlainText = entity.originalPlainText;
					}

					entity.keepOriginalContentString = true;
					entity.keepOriginalPlainText = true;
					entity.originalContent = entity.Content;
					entity.originalContentString = entity.ContentString;
					entity.originalPlainText = entity.PlainText;
				}

				let serviceContainer = platformDataServiceFactory.createNewComplete(projectHeaderTextServiceOption);
				let service = serviceContainer.service;
				service.prjHeaderTextTypeChange = new PlatformMessenger();
				service.registerSelectionChanged(onSelectionChanged);
				service.getTextModuleList = getTextModuleList;
				service.toggleCreateButton = function(enable) {
					serviceContainer.service.canCreate = function () {
						return enable;
					};
				};

				function updateByTextType(entity, needUpdateText) {
					entity = entity || service.getSelected();
					getTextModuleList(entity).then(function (list) {
						if (!entity || !needUpdateText) {
							return;
						}
						if (!angular.isArray(list)) {
							entity.Content = null;
							entity.ContentString = null;
							entity.PlainText = null;
							return;
						}
						let textModules =  list;
						if (!angular.isArray(textModules) || textModules.length === 0) {
							entity.Content = null;
							entity.ContentString = null;
							entity.PlainText = null;
							return;
						}

						let text = {};
						_.forEach(textModules, function (item) {
							if (((entity.TextFormatFk === basicsCommonTextFormatConstant.specification ||
										entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) &&
									Object.prototype.hasOwnProperty.call(text,'specification')) &&
								((entity.TextFormatFk === basicsCommonTextFormatConstant.html ||
										entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) &&
									Object.prototype.hasOwnProperty.call(text,'html'))) {
								return;
							}

							if (!item.IsDefault) {
								return;
							}

							let textModuleTextFormat = null;
							if (item.TextFormatFk) {
								textModuleTextFormat = item.TextFormatFk;
							} else {
								if (item.BasBlobsFk) {
									textModuleTextFormat = basicsCommonTextFormatConstant.specification;
								} else if (!item.BasBlobsFk && item.BasClobsFk) {
									textModuleTextFormat = basicsCommonTextFormatConstant.html;
								}
							}


							if (textModuleTextFormat === basicsCommonTextFormatConstant.specification && !Object.prototype.hasOwnProperty.call(text,'specification')) {
								text.specification = item;
							} else if (textModuleTextFormat === basicsCommonTextFormatConstant.html && !Object.prototype.hasOwnProperty.call(text,'html')) {
								text.html = item;
							}
						});

						let promises = [];
						promises.push(text.specification ? service.setTextMoudleValue(text.specification.Id) : $q.when(null));
						promises.push(text.html ? service.setTextMoudleValue(text.html.Id) : $q.when(null));

						let updateFormat = 0;
						if (promises.length > 0) {
							$q.all(promises)
								.then(function (results) {
									if (!angular.isArray(results)) {
										return;
									}
									let text4Spec = results[0] ? results[0].ContentString : null;
									let text4Html = results[1] ? results[1].PlainText : null;

									if (text4Spec) {
										updateFormat = 1;
										if (text4Spec !== entity.ContentString) {
											entity.ContentString = text4Spec;
										}
									}

									if (text4Html) {
										updateFormat += 2;
										if (text4Html !== entity.PlainText) {
											entity.PlainText = text4Html;
										}
									}

									if (updateFormat === 1) {
										if (angular.isString(entity.PlainText)) {
											entity.PlainText = null;
										}
									} else if (updateFormat === 2) {
										if (angular.isString(entity.ContentString)) {
											entity.Content = null;
											entity.ContentString = null;
										}
									} else if (updateFormat === 0) {
										entity.Content = null;
										entity.ContentString = null;
										entity.PlainText = null;
									}
								});
						}
					});
				}

				service.setTextMoudleValue = function setTextMoudleValue(id) {
					let defer = $q.defer();
					let entity = service.getSelected();
					if (entity) {
						$http.get(globals.webApiBaseUrl + 'project/common/headertext/prjHeaderTextEntity' + '?projectId=' + entity.ProjectFk + '&textMoudleFk=' + id).then(function (response) {

							if (response) {
								defer.resolve({
									entity: entity,
									ContentString: response.data.ContentString,
									PlainText: response.data.PlainText
								});
								return;
							}

							defer.resolve(null);
						});
					} else {
						defer.resolve(null);
					}

					return defer.promise;
				};

				service.updateByTextType = updateByTextType;

				return service;

			}]);
})(angular);
