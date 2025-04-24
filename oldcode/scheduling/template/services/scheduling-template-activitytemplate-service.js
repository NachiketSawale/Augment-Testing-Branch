/**
 * Created by leo on 18.11.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var templateModule = angular.module('scheduling.template');

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTemplateService
	 * @function
	 *
	 * @description
	 *  is the data service for all ActivityTemplate related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	templateModule.factory('schedulingTemplateActivityTemplateService', ['_', '$http', 'platformDataServiceFactory', 'schedulingTemplateGrpMainService', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService',

		function (_, $http, platformDataServiceFactory, schedulingTemplateGrpMainService, basicsLookupdataLookupDescriptorService, cloudDesktopSidebarService) {

			// The instance of the main service - to be filled with functionality below
			var tmpServiceInfo = {
				flatRootItem: {
					module: templateModule,
					serviceName: 'schedulingTemplateActivityTemplateService',
					entityNameTranslationID: 'scheduling.template.translationDescActivities',
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplate/',
						usePostForRead: true,
						endRead: 'filtered',
						extendSearchFilter: function (filterRequest) {
							if (schedulingTemplateGrpMainService.getSelected() && _.isNil(filterRequest.Pattern)) {
								filterRequest.FurtherFilters = [{
									Token: 'TMPLGROUP',
									Value: schedulingTemplateGrpMainService.getSelected().Id
								}];
							}
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplate/',
						endCreate: 'createtemplate'
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'scheduling/template/activitytemplate/'},
					httpDelete: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplate/',
						endDelete: 'multidelete'
					},

					/*
											initReadData: function (readdata, data) {
												if (schedulingTemplateGrpMainService.getSelected()) {
													readdata.mainItemId = schedulingTemplateGrpMainService.getSelected().Id;
												}
												readdata.filterRequest = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter);
												if (angular.isDefined(readdata.filterRequest) && readdata.mainItemId) {
													readdata.filterRequest.FurtherFilters = {
														Token: 'TMPLGROUP',
														Value: schedulingTemplateGrpMainService.getSelected().Id
													};
													if (readdata.filterRequest.Pattern) {
														schedulingTemplateGrpMainService.deselect();
														//schedulingTemplateGrpMainService.gridRefresh();
													}
												}
												return readdata;
											},
					*/
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData, data) {
								var selectedItem = schedulingTemplateGrpMainService.getSelected();
								creationData.mainItemId = 0;
								creationData.lastCode = '';
								creationData.newHierarchy = true;
								if (selectedItem && selectedItem.Id) {
									creationData.mainItemId = selectedItem.Id;
									creationData.lastCode = selectedItem.Code;
								} else if (data.selectedItem && data.selectedItem.ActivityTemplateGroupFk) {
									creationData.mainItemId = data.selectedItem.ActivityTemplateGroupFk;
									creationData.lastCode = data.selectedItem.Code;
									creationData.newHierarchy = false;
								}
								if (data.itemList.length > 0) {
									if (data.itemList[data.itemList.length - 1].Code.indexOf(creationData.lastCode + '.') > -1) {
										creationData.lastCode = data.itemList[data.itemList.length - 1].Code;
										creationData.newHierarchy = false;
									} else if (creationData.lastCode === '' || angular.isUndefined(creationData.lastCode)) {
										creationData.mainItemId = data.itemList[data.itemList.length - 1].ActivityTemplateGroupFk;
										// creationData.lastCode = data.itemList[data.itemList.length - 1].Code;
										basicsLookupdataLookupDescriptorService.loadItemByKey('activitytemplategroupfk', creationData.mainItemId).then(function (item) {
											creationData.lastCode = item.Code;
										});
									}
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'ActivityTemplates',
							moduleName: 'cloud.desktop.moduleDisplayNameActivityTemplate',
							mainItemName: 'ActivityTemplate'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'scheduling.template',
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					},
					translation: {
						uid: 'schedulingTemplateActivityTemplateService',
						title: 'scheduling.template.translationDescActivities',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ActivityTemplateDto',
							moduleSubModule: 'Scheduling.Template'
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(tmpServiceInfo);

			function setActivityTemplateFk() {
				basicsLookupdataLookupDescriptorService.updateData('activitytemplatefk', serviceContainer.service.getList());
			}

			serviceContainer.service.registerListLoaded(setActivityTemplateFk);

			function updateGroupList() {
				schedulingTemplateGrpMainService.load();
			}

			serviceContainer.service.registerRefreshRequested(updateGroupList);

			function groupSelectionChanged() {
				var tmplGroup = schedulingTemplateGrpMainService.getSelected();
				if (serviceContainer.service.isModelChanged()) {
					serviceContainer.service.update();
				}

				if (tmplGroup && tmplGroup.Id) {
					// serviceContainer.service.setFilter('mainItemId=' + tmplGroup.Id);
					cloudDesktopSidebarService.filterResetPattern();
					serviceContainer.service.load();
				}
			}

			schedulingTemplateGrpMainService.registerSelectionChanged(groupSelectionChanged);

			serviceContainer.service.createDeepCopy = function createDeepCopy() {
				var command = {
					Action: 1,
					Template: serviceContainer.service.getSelected()
				};

				$http.post(globals.webApiBaseUrl + 'scheduling/template/activitytemplate/execute', command)
					.then(function (response) {
						serviceContainer.data.handleOnCreateSucceeded(response.data.ActivityTemplate, serviceContainer.data);
					},
					function (/* error */) {
					});
			};

			return serviceContainer.service;
		}
	]);
})
();
