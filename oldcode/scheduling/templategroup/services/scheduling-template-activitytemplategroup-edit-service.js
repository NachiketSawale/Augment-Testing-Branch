/**
 * Created by leo on 17.11.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var templateGroupModule = angular.module('scheduling.templategroup');

	/**
	 * @ngdoc service
	 * @name schedulingTemplateMainService
	 * @function
	 *
	 * @description
	 * schedulingTemplateMainService is the data service for all template related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	templateGroupModule.factory('schedulingTemplateGrpEditService', ['$http', 'platformDataServiceFactory', 'schedulingLookupService',
		'schedulingTemplateGrpMainService', 'platformDataServiceFieldReadonlyProcessorFactory', 'platformContextService', 'basicsCompanyNumberGenerationInfoService',
		function ($http, platformDataServiceFactory, schedulingLookupService, schedulingTemplateGrpMainService, platformDataServiceFieldReadonlyProcessorFactory, platformContextService, basicsCompanyNumberGenerationInfoService) {

			// The instance of the main service - to be filled with functionality below
			var rubricCategory = null;
			$http.get(globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/getrubriccategory').then(function (response) {
				if (response && response.data) {
					rubricCategory = response.data;
				}
			});
			var templateServiceInfo = {
				hierarchicalRootItem: {
					module: templateGroupModule,
					serviceName: 'schedulingTemplateGrpEditService',
					entityNameTranslationID: 'scheduling.template.translationDescActivitiesGroupEdit',
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/',
						usePostForRead: true,
						endRead: 'filtered',
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/',
						endCreate: 'createtemplategroup'
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/'},
					httpDelete: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/',
						endDelete: 'multideletegroup'
					},
					dataProcessor: [platformDataServiceFieldReadonlyProcessorFactory.createProcessor([
						{
							field: 'Code', evaluate: function (item) {
								if (item.Version === 0) {
									if (rubricCategory && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('schedulingTemplateGroupNumberInfoService').hasToGenerateForRubricCategory(rubricCategory)) {
										item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('schedulingTemplateGroupNumberInfoService').provideNumberDefaultText(rubricCategory, item.Code);
										return true;
									} else {
										return false;
									}
								} else {
									return false;
								}
							}
						}])
					],
					presenter: {
						tree: {
							parentProp: 'ActivityTemplateGroupFk', childProp: 'ActivityTemplateGroups',
							initCreationData: function initCreationData(creationData, data) {
								creationData.mainItemId = creationData.parentId;
								creationData.lastCode = '';
								creationData.newHierarchy = false;
								if (data.selectedItem) {
									creationData.lastCode = data.selectedItem.Code;
									creationData.newHierarchy = data.selectedItem.Code === creationData.parent.Code;
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'ActivityTemplateGroups',
							moduleName: 'cloud.desktop.moduleDisplayNameActivityTemplateGroup',
							handleUpdateDone: function (updateData, response, data) {
								schedulingTemplateGrpMainService.setLoadedNew();
								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					translation: {
						uid: 'schedulingTemplateGrpEditService',
						title: 'scheduling.template.translationDescActivitiesGroupEdit',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ActivityTemplateGroupDto',
							moduleSubModule: 'Scheduling.Template'
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'scheduling.templategroup',
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(templateServiceInfo);
			var service = serviceContainer.service;

			// service.setFilter('startId=0');
			function refreshActivityGroupTemplate() {
				schedulingTemplateGrpMainService.setLoadedNew();
			}

			serviceContainer.service.createDeepCopy = function createDeepCopy() {
				var command = {
					Action: 1,
					TemplateGroup: serviceContainer.service.getSelected()
				};

				$http.post(globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/execute', command)
					.then(function (response) {
						var copy = response.data.ActivityTemplateGroup;
						var creationData = {parent: null};
						if (copy.ActivityTemplateGroupFk) {
							creationData.parent = serviceContainer.data.getItemById(copy.ActivityTemplateGroupFk, serviceContainer.data);
						}
						serviceContainer.data.onCreateSucceeded(response.data.ActivityTemplateGroup, serviceContainer.data, creationData);
					},
					function (/* error */) {
					});
			};

			service.registerListLoaded(refreshActivityGroupTemplate);

			return service;

		}]);
})();
