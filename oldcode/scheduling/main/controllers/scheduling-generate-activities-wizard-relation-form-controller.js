/* global $ */
(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingGenerateActivitiesWizardRelationFormController',
		['$scope', '$translate', '_', 'platformModalFormConfigService', 'platformTranslateService', 'platformRuntimeDataService', 'platformModalGridConfigService', 'schedulingMainLocationWizardDialogRelationFormService',
			'basicsLookupdataConfigGenerator', 'schedulingMainGenerateActivitiesSelectionService', 'platformCreateUuid',
			function ($scope, $translate, _, platformModalFormConfigService, platformTranslateService, platformRuntimeDataService, platformModalGridConfigService, schedulingMainLocationWizardDialogRelationFormService,
				basicsLookupdataConfigGenerator, schedulingMainGenerateActivitiesSelectionService, platformCreateUuid) {

				let criteria = schedulingMainGenerateActivitiesSelectionService.getSelectedCriteria();

				function validateCreated(entity, value) {
					let fields = null;

					if (value === true) {

						fields = [
							{
								field: 'RelationKindFk',
								readonly: false
							}
						];

						platformRuntimeDataService.readonly(entity, fields);

					} else {
						fields = [
							{
								field: 'RelationKindFk',
								readonly: true
							}
						];

						entity.RelationKindFk = null;
						platformRuntimeDataService.readonly(entity, fields);
					}
				}

				function provideRelationKindDropDown() {
					let overload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind', 'Description');
					let baseDef = {
						gid: 'baseGroup',
						rid: 'RelationKindFk',
						model: 'RelationKindFk',
						label$tr$: 'scheduling.main.entityRelationKind',
						type: 'lookup',
						readonly: criteria.readonly,
						sortOrder: 2
					};

					baseDef = $.extend(baseDef, overload.detail);

					return baseDef;
				}

				function formConfiguration() {
					return {
						fid: 'scheduling.main.generateActivities',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['Create', 'RelationKindFk']
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'Create',
								model: 'Create',
								label$tr$: 'scheduling.main.entityCreateRelations',
								type: 'boolean',
								sortOrder: 1,
								readonly: criteria.readonly,
								validator: validateCreated
							},
							provideRelationKindDropDown()
						]
					};
				}

				let dataItems = platformModalGridConfigService.relations();
				if (criteria.relationKindFk){
					dataItems.RelationKindFk = criteria.relationKindFk;
				}
				if (criteria.createRelations){
					dataItems.Create = criteria.createRelations;
				}

				// Option
				let config = {
					title: $translate.instant('scheduling.main.generateActivitiesWizard'),
					dataItem: dataItems,
					formConfiguration: formConfiguration(),
					handleOK: function handleOK(result) {
						result.data.relation = config.dataItem;
					}
				};

				platformTranslateService.translateFormConfig(config.formConfiguration);
				$scope.formContainerOptions = {formOptions: {configure: config.formConfiguration}};
				$scope.dataItem = dataItems;

				platformModalFormConfigService.setConfig(config);
			}
		]);

})(angular);
