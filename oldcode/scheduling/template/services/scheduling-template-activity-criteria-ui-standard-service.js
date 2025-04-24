(function () {
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityCriteriaUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of activity criteria entities
	 */
	angular.module(moduleName).factory('schedulingTemplateActivityCriteriaUIStandardService',
		['_','platformUIStandardConfigService', 'basicsLookupdataConfigGenerator', 'schedulingTemplateTranslationService', 'platformSchemaService', '$injector',
			function (_, platformUIStandardConfigService, basicsLookupdataConfigGenerator, schedulingTemplateTranslationService, platformSchemaService, $injector) {

				function createMainDetailLayout() {
					return {
						fid: 'scheduling.activitiy.activitycriteriadetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['descriptioninfo', 'structurefk', 'categorywicfk', 'catalogwicfk', 'itemwicfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							structurefk: {
								navigator: {
									moduleName: 'basics.procurementstructure'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-procurementstructure-structure-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcstructure',
										displayMember: 'Code'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-procurementstructure-structure-dialog',
										descriptionField: 'StructureDescription',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											initValueField: 'StructureCode',
											showClearButton: true
										}
									}
								}
							},
							categorywicfk: basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								moduleQualifier: 'estimateAssembliesWicGroupLookupDataService',
								dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
								enableCache: true,
								valMember: 'Id',
								dispMember: 'Code'
							}),
							catalogwicfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'boqHeaderLookupDataService',
								dispMember: 'BoqNumber',
								valMember: 'Id',
								filter: function (item) {
									var boqMainBoqTypes = $injector.get('boqMainBoqTypes');
									var filterEntity = {
										boqType: boqMainBoqTypes.wicGroup,
										projectId: 0,
										selectedProject: '',
										boqGroupId: -1
									};
									if (item && item.CategoryWicFk) {
										filterEntity.boqType = boqMainBoqTypes.wicGroup;
										filterEntity.boqGroupId = item.CategoryWicFk;
									}
									return filterEntity;
								},
								enableCache: true,
								columns: [
									{
										id: 'boqnumber',
										field: 'BoqNumber',
										name: 'BoqNumber',
										formatter: 'code',
										name$tr$: 'boq.main.boqNumber'
									},
									{
										id: 'description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								]
							}),
							itemwicfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-assembly-boqitem-lookup',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'activity-template-criteria-wic-item-filter',
											additionalColumns: true,
											displayMember: 'Reference'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BoqItem',
										displayMember: 'Reference'
									}
								}
							}
						}
					};
				}

				var activityCriteriaDetailLayout = createMainDetailLayout();

				function removeBulkSupportForFields() {
					var fieldsToRemove = ['catalogwicfk', 'categorywicfk', 'itemwicfk'];
					_.each(fieldsToRemove, function (field) {
						if (activityCriteriaDetailLayout.overloads && activityCriteriaDetailLayout.overloads[field] &&
							activityCriteriaDetailLayout.overloads[field].grid) {
							activityCriteriaDetailLayout.overloads[field].grid.bulkSupport = false;
						}
					});
				}

				removeBulkSupportForFields();

				var BaseService = platformUIStandardConfigService;

				var activityCriteriaAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityCriteriaDto',
					moduleSubModule: 'Scheduling.Template'
				});
				activityCriteriaAttributeDomains = activityCriteriaAttributeDomains.properties;

				return new BaseService(activityCriteriaDetailLayout, activityCriteriaAttributeDomains, schedulingTemplateTranslationService);
			}
		]);
})();
