/* global $ */
/**
 * Created by henkel on 03.03.2016.
 */
(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingLocationWizardDialogRelationFormController',
		['$scope', '$translate', '_', 'platformModalFormConfigService', 'platformTranslateService', 'platformRuntimeDataService', 'platformModalGridConfigService', 'schedulingMainLocationWizardDialogRelationFormService', 'basicsLookupdataConfigGenerator', 'platformCreateUuid',
			function ($scope, $translate, _, platformModalFormConfigService, platformTranslateService, platformRuntimeDataService, platformModalGridConfigService, schedulingMainLocationWizardDialogRelationFormService, basicsLookupdataConfigGenerator, platformCreateUuid) {
				function validateCreated(entity, value) {
					var fields = null;

					if (value === true) {

						fields = [
							{
								field: 'RelationKindFk',
								readonly: false
							},
							{
								field: 'FixLagTime',
								readonly: false
							},
							{
								field: 'FixLagPercent',
								readonly: false
							},
							{
								field: 'VarLagTime',
								readonly: false
							},
							{
								field: 'VarLagPercent',
								readonly: false
							}
						];

						entity.RelationKindFk = schedulingMainLocationWizardDialogRelationFormService.getRelationsCache()._relationKindFk;
						entity.FixLagTime = schedulingMainLocationWizardDialogRelationFormService.getRelationsCache()._fixLagTime;
						entity.FixLagPercent = schedulingMainLocationWizardDialogRelationFormService.getRelationsCache()._fixLagPercent;
						entity.VarLagTime = schedulingMainLocationWizardDialogRelationFormService.getRelationsCache()._varLagTime;
						entity.VarLagPercent = schedulingMainLocationWizardDialogRelationFormService.getRelationsCache()._varLagPercent;
						platformRuntimeDataService.readonly(entity, fields);

					} else {
						fields = [
							{
								field: 'RelationKindFk',
								readonly: true
							},
							{
								field: 'FixLagTime',
								readonly: true
							},
							{
								field: 'FixLagPercent',
								readonly: true
							},
							{
								field: 'VarLagTime',
								readonly: true
							},
							{
								field: 'VarLagPercent',
								readonly: true
							}
						];

						schedulingMainLocationWizardDialogRelationFormService.setRelationsCache(entity);
						entity.RelationKindFk = null;
						entity.FixLagTime = null;
						entity.FixLagPercent = null;
						entity.VarLagTime = null;
						entity.VarLagPercent = null;
						platformRuntimeDataService.readonly(entity, fields);
					}
				}

				function provideRelationKindDropDown() {
					var overload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind', 'Description');
					var baseDef = {
						gid: 'baseGroup',
						rid: 'RelationKindFk',
						model: 'RelationKindFk',
						label$tr$: 'scheduling.main.entityRelationKind',
						type: 'integer',
						sortOrder: 2
					};

					baseDef = $.extend(baseDef, overload.detail);

					return baseDef;
				}

				function formConfiguration() {
					return {
						fid: 'scheduling.main.DescriptionInfoModal',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['Create', 'RelationKindFk', 'FixLagTime', 'FixLagPercent', 'VarLagTime', 'VarLagPercent']
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
								validator: validateCreated
							},
							provideRelationKindDropDown(),
							{
								gid: 'baseGroup',
								rid: 'FixLagTime',
								model: 'FixLagTime',
								label$tr$: 'scheduling.main.entityRelationFixLagTime',
								type: 'quantity',
								sortOrder: 3
							},
							{
								gid: 'baseGroup',
								rid: 'FixLagPercent',
								model: 'FixLagPercent',
								label$tr$: 'scheduling.main.entityRelationFixLagPercent',
								type: 'percent',
								sortOrder: 4
							},
							{
								gid: 'baseGroup',
								rid: 'VarLagTime',
								model: 'VarLagTime',
								label$tr$: 'scheduling.main.entityRelationVarLagTime',
								type: 'quantity',
								sortOrder: 5
							},
							{
								gid: 'baseGroup',
								rid: 'VarLagPercent',
								model: 'VarLagPercent',
								label$tr$: 'scheduling.main.entityRelationVarLagPercent',
								type: 'percent',
								sortOrder: 6
							}
						]
					};
				}

				var dataItems = platformModalGridConfigService.relations();

				// Option
				var config = {
					title: $translate.instant('FormWizard'),
					dataItem: dataItems,
					formConfiguration: formConfiguration(),
					handleOK: function handleOK(result) {
						result.data.relation = config.dataItem;
					}
				};
				/*
				$scope.dialog = {
					id: platformCreateUuid(), // generate unique id for this dialog
					modalOptions: config,
					dontShowAgain: {
						label: platformTranslateService.instant('cloud.desktop.dialogDeactivate', undefined, true)
					},
					getButtonById: function getButtonById(id) {
						let button = _.find($scope.dialog.buttons, function (btn) {
							return btn.id === id;
						});
						return button;
					},
					buttons: [{
						id: 'ok'
					}, {id: 'cancel'}],
					customButtons: [],
					/!**
					 * @ngdoc function
					 * @name isDisabled
					 * @methodOf platform.platformDialogService.controller
					 * @description checks whether the button is disabled.
					 * @param {( string )} button The name of the button
					 * @returns { bool } A value that indicates whether the button is disabled
					 *!/
					isDisabled: function isDisabled(button) {
						if (angular.isUndefined(button)) {
							return undefined;
						}

						return angular.isFunction(button.disabled) ? button.disabled() : button.disabled;
					},
				};
*/

				platformTranslateService.translateFormConfig(config.formConfiguration);
				$scope.formContainerOptions = {formOptions: {configure: config.formConfiguration}};
				$scope.dataItem = dataItems;
				platformModalFormConfigService.setConfig(config);
			}
		]);

})(angular);
