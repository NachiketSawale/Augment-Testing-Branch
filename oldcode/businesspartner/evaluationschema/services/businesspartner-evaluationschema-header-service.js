(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.evaluationschema';
	let businesspartnerEvaluationschemaModule = angular.module(moduleName);
	angular.module(moduleName).factory('businesspartnerEvaluationschemaHeaderService',
		['platformDataServiceFactory', 'globals', 'platformModuleNavigationService', 'cloudDesktopSidebarService', 'platformModuleNavigationService', '$http',
			'basicsLookupdataLookupFilterService', 'platformCreateUuid', 'platformDeleteSelectionDialogService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (platformDataServiceFactory, globals, naviService, cloudDesktopSidebarService, platformModuleNavigationService, $http,
			          basicsLookupdataLookupFilterService, platformCreateUuid, platformDeleteSelectionDialogService) {

				let sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					useCurrentClient: false,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					withExecutionHints: true,
					enhancedSearchVersion: '2.0',
					includeDateSearch: true
				};

				let serviceOptions = {
					flatRootItem: {
						module: businesspartnerEvaluationschemaModule,
						serviceName: 'businesspartnerEvaluationschemaHeaderService',
						entityRole: {
							root: {
								itemName: 'EvaluationSchemas',
								moduleName: 'cloud.desktop.moduleDisplayNameEvaluationSchema',
								codeField: 'DescriptionInfo.Description',
								descField: 'noCode',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								handleUpdateDone: function (updateData, response, data) {
									let groupToSave = updateData.GroupToSave;
									if (service.oldFormFieldId) {
										formFieldIds = formFieldIds.filter(item => item !== service.oldFormFieldId);
										service.oldFormFieldId = null;
									}

									if (groupToSave) {
										_.forEach(groupToSave, function (group) {
											let subgroupToSave = group.SubgroupToSave;
											if (subgroupToSave) {
												_.forEach(subgroupToSave, function (item) {
													let subgroup = item.Subgroup;
													if (subgroup?.FormFieldFk && formFieldIds.indexOf(subgroup.FormFieldFk) < 0) {
														formFieldIds.push(subgroup.FormFieldFk);
													}

													let subgroupItemToSave = item.ItemToSave;
													if (subgroupItemToSave) {
														_.forEach(subgroupItemToSave, function (subgroupItem) {
															if (subgroupItem.FormFieldFk && formFieldIds.indexOf(subgroupItem.FormFieldFk) < 0) {
																formFieldIds.push(subgroupItem.FormFieldFk);
															}
														})
													}
												})
											}
										})
									}

									data.handleOnUpdateSucceeded(updateData, response, data, true);
								}
							}
						},
						entitySelection: {supportsMultiSelection: true},
						httpRead: {
							route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/',
							usePostForRead: true,
							endRead: 'getlist'
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/',
							usePostForRead: true,
							endCreate: 'createnew'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/',
							usePostForRead: true,
							endUpdate: 'updatenew'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/',
							usePostForRead: true,
							endDelete: 'deletenew'
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						modification: {multi: true},
						sidebarSearch: {options: sidebarSearchOptions},
						actions: {create: 'flat', delete: 'flat'},
						translation: {
							uid: 'businesspartnerEvaluationschemaHeaderService',
							title: 'businesspartner.evaluationschema.headerGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'EvaluationSchemaDto',
								moduleSubModule: 'BusinessPartner.EvaluationSchema'
							}
						}
					}
				};
				let container = platformDataServiceFactory.createNewComplete(serviceOptions);
				let service = container.service;

				service.name = moduleName;
				let formFieldIds = [];
				service.oldFormFieldId = null;

				function incorporateDataRead(readItems, data) {
					container.data.handleReadSucceeded(readItems, data);

					if (readItems.dtos && readItems.dtos.length !== 0) {
						service.goToFirst(data);
					}
				}

				function registerNavi() {
					registerNavigation(container.data.httpReadRoute, {
						moduleName: moduleName,
						getNavData: function getNavData(item) {
							if (angular.isDefined(item.EvaluationSchemaFk)) {
								return item.EvaluationSchemaFk !== null ? item.EvaluationSchemaFk : -1;
							}
						}
					});
				}

				function registerNavigation(httpReadRoute, navigation) {
					platformModuleNavigationService.registerNavigationEndpoint({
						moduleName: navigation.moduleName,
						navFunc: function (item) {
							let data = navigation.getNavData ? navigation.getNavData(item) : item;
							if (angular.isNumber(data)) {
								cloudDesktopSidebarService.filterSearchFromPKeys([data]);
							} else if (angular.isString(data)) {
								cloudDesktopSidebarService.filterSearchFromPattern(data);
							} else {
								$http.post(httpReadRoute + (navigation.endRead || 'navigation'), data).then(function (response) {
									cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
								});
							}
						}
					});
				}

				service.registerNavi = registerNavi;
				let filters = [
					{
						key: 'bp-evaluationschema-header-rubriccategory-by-rubric-filter',
						fn: function (context) {
							return context.RubricFk === 33; // 33 is for Evaluation
						}
					},
					{
						key: 'basformfieldfk-for-evaluation-schema-filter',
						fn: function (context) {
							let schema = service.getSelected();
							return context.FormFk === schema.FormFk && formFieldIds.indexOf(context.Id) < 0; //
						}
					}
				];

				let deleteDialogId = platformCreateUuid();
				service.deleteEntities = function deleteEntities(entities) {
					platformDeleteSelectionDialogService.showDialog({
						dontShowAgain: true,
						id: deleteDialogId
					}).then(result => {
						if (result.ok || result.delete) {
							container.data.deleteEntities(entities, container.data);
						}
					});
				}

				basicsLookupdataLookupFilterService.registerFilter(filters);

				service.registerSelectionChanged(onSelectionChanged);

				function onSelectionChanged(e, entity) {
					formFieldIds.length = 0;
					service.oldFormFieldId = null;
					if (entity?.FormFk) {
						$http.get(globals.webApiBaseUrl + 'businesspartner/evaluationschema/getformfields?' + 'mainItemId=' + entity.Id)
							.then(function (response) {
								if (response.data) {
									formFieldIds = response.data;
								}
							});
					}
				}

				return service;
			}
		]);

})(angular);

