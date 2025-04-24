(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityCriteriaService
	 * @function
	 *
	 * @description
	 * schedulingTemplateActivityCriteriaService is the data service for all templates criteria related functionality.
	 */
	var moduleName = 'scheduling.template';
	var templateModule = angular.module(moduleName);
	templateModule.factory('schedulingTemplateActivityCriteriaService',
		['platformDataServiceFactory', 'PlatformMessenger', 'platformDataServiceProcessDatesBySchemeExtension',
			'basicsCostGroupAssignmentService', 'basicsLookupdataLookupFilterService',
			'schedulingTemplateCriteriaProcessor', 'schedulingTemplateActivityTemplateService',

			function (platformDataServiceFactory, PlatformMessenger, platformDataServiceProcessDatesBySchemeExtension, basicsCostGroupAssignmentService, basicsLookupdataLookupFilterService, schedulingTemplateCriteriaProcessor, schedulingTemplateActivityTemplateService) {

				var service;
				var factoryOptions = {
					flatNodeItem: {
						module: templateModule,
						serviceName: 'schedulingTemplateActivityCriteriaService',
						httpCreate: {route: globals.webApiBaseUrl + 'scheduling/template/activitycriteria/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'scheduling/template/activitycriteria/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								var selected = schedulingTemplateActivityTemplateService.getSelected();
								readData.PKey1 = selected.Id;
							}
						},
						actions: {delete: true, create: 'flat'},
						dataProcessor: [schedulingTemplateCriteriaProcessor, platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ActivityCriteriaDto',
							moduleSubModule: 'Scheduling.Template'
						})],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selected = schedulingTemplateActivityTemplateService.getSelected();
									creationData.PKey1 = selected.Id;
								},
								incorporateDataRead: function (result, data) {
									data.isDataLoaded = true;

									basicsCostGroupAssignmentService.process(result, service, {
										mainDataName: 'dtos',
										attachDataName: 'ActivityCriteria2CostGroups',
										dataLookupType: 'ActivityCriteria2CostGroups',
										identityGetter: function identityGetter(entity) {
											return {
												Id: entity.MainItemId
											};
										}
									});

									return serviceContainer.data.handleReadSucceeded(result.dtos, data);
								}
							}
						},
						entityRole: {
							node: {itemName: 'ActivityCriteria', parentService: schedulingTemplateActivityTemplateService}
						},
						translation: {
							uid: 'schedulingTemplateActivityCriteriaService',
							title: 'scheduling.template.translationDescActivityCriteria',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'ActivityCriteriaDto',
								moduleSubModule: 'Scheduling.Template'
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
				service = serviceContainer.service;
				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				var lookupFilters = [
					{
						key: 'costgroupfk-for-template-activity-criteria-filter',
						serverSide: true,
						fn: function (item) {
							return 'LineItemContextFk=' + (item ? item.LineItemContextFk : '-1');
						}
					},
					{
						key: 'activity-template-criteria-wic-item-filter',
						serverSide: true,
						fn: function (item) {
							var filterId = -1;
							if (item && item.HeaderWicFk) {
								filterId = item.HeaderWicFk;
							}

							return 'BoqHeaderFk=' + (filterId);
						}
					}];

				basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

				return serviceContainer.service;
			}]);
})(angular);
