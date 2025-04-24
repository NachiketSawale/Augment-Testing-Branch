/**
 * Created by baf on 26.10.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStatusTransitionService
	 * @function
	 *
	 * @description
	 * The basicsCustomizeStatusTransitionService shows the transition dialog for a state entity type
	 */

	angular.module(moduleName).service('basicsCustomizeStatusTransitionService', BasicsCustomizeStatusTransitionService);

	BasicsCustomizeStatusTransitionService.$inject = ['$http', '$injector', '$translate', 'platformModalFormConfigService', 'platformTranslateService', '$rootScope', 'platformDataServiceSelectionExtension', 'platformObjectHelper', 'platformGridAPI'];

	function BasicsCustomizeStatusTransitionService($http, $injector, $translate, platformModalFormConfigService, platformTranslateService, $rootScope, platformDataServiceSelectionExtension, objectHelper, platformGridAPI) {
		var self = this;
		var data = {
			hasRoleValidationChangedCallback: null,
			rubricId: null
		};

		var getModifications = function getModifications(entity, serviceConfig) {
			var mods = {
				Id: entity.Id
			};

			serviceConfig.ruleDataService.getModifications(mods);
			serviceConfig.roleDataService.getModifications(mods);
			serviceConfig.workflowStepDataService.getModifications(mods);

			return mods;
		};

		function isConfigValid(entity, serviceConfig) {
			return  serviceConfig.ruleDataService.verifyModifications() &&
				serviceConfig.roleDataService.verifyModifications() &&
				serviceConfig.workflowStepDataService.verifyModifications();
		}

		self.modified = 0;

		this.registerHasRoleValidationChangedCallback = function registerHasRoleValidationChangedCallback(callBackFn) {
			data.hasRoleValidationChangedCallback = callBackFn;
		};

		this.unregisterHasRoleValidationChangedCallback = function unregisterHasRoleValidationChangedCallback() {
			data.hasRoleValidationChangedCallback = null;
		};

		this.fireHasRoleValidationChanged = function fireHasRoleValidationChanged() {
			if (data.hasRoleValidationChangedCallback) {
				data.hasRoleValidationChangedCallback();
			}
		};

		this.getCurrentRubricCategory = function getCurrentRubricCategory() {
			return data.rubricId;
		};

		this.showDialog = function showDialog(entity) {
			var entityTypeService = $injector.get('basicsCustomizeTypeDataService');

			entityTypeService.setSelected(entity).then(function () {
				var transitionInitService = $injector.get('basicsCustomizeStatusTransitionInitialisationService');
				transitionInitService.initializeStatusTransitionDataServices(entity).then(function (serviceConfig) {

					function setRule() {
						if (self.modified > 0) {
							serviceConfig.ruleDataService.addEntityToModified(null, entity.rule);
						}
						self.modified = 0;
						killWatches();
						entity.rule = serviceConfig.ruleDataService.getSelected();
						if (platformDataServiceSelectionExtension.isSelection(entity.rule)) {
							self.watchComment = $rootScope.$watch(function () {
								return entity.rule ? entity.rule.CommentText : null;
							}, function (newItem, oldItem) {
								if (objectHelper.isSet(newItem) && newItem !== oldItem) {
									self.modified++;
								}
							}, false);
							self.watchRole = $rootScope.$watch(function () {
								return entity.rule ? entity.rule.Hasrolevalidation : null;
							}, function (newItem, oldItem) {
								self.fireHasRoleValidationChanged();
								if (objectHelper.isSet(newItem) && newItem !== oldItem) {
									self.modified++;
								}
							}, false);
							self.watchAccessRight = $rootScope.$watch(function () {
							    return entity.rule ? entity.rule.AccessrightDescriptorFk : null;
							}, function (newItem, oldItem) {
								if (objectHelper.isSet(newItem) && newItem !== oldItem) {
									self.modified++;
								}
							}, false);
						}
					}

					serviceConfig.ruleDataService.registerSelectionChanged(setRule);

					entity.rubricId = serviceConfig.rubricId;
					data.rubricId = serviceConfig.rubricId;
					entity.rubricCategoryId = null;

					var formConfig = self.prepareConfig(serviceConfig);

					function killWatches() {
						if (self.watchComment) {
							self.watchComment();
						}
						if (self.watchRole) {
							self.watchRole();
						}
						if (self.watchAccessRight) {
							self.watchAccessRight();
						}
					}

					platformModalFormConfigService.showDialog({
						title: $translate.instant('basics.customize.statusTransition'),
						dataItem: entity,
						dialogOptions: {
							width: '50%',
							disableOkButton: function disableOkButton() {
								return !isConfigValid(entity, serviceConfig);
							}
						},
						formConfiguration: formConfig,
						resizeable: true,
						dataServices: serviceConfig,
						handleOK: function handleOK(result) {
							platformGridAPI.grids.commitAllEdits();
							setRule();
							killWatches();
							self.modified = 0;
							serviceConfig.ruleDataService.unregisterSelectionChanged(setRule);
							var resData = getModifications(result.data, serviceConfig);
							$http.post(globals.webApiBaseUrl + 'basics/customize/special/updatestatusdata', resData);
							data.rubricId = null;
						},
						handleCancel: function handleCancel() {
							serviceConfig.ruleDataService.unregisterSelectionChanged(setRule);
							killWatches();
							self.modified = 0;
							data.rubricId = null;
						}
					});
				});
			});
		};

		this.prepareConfig = function prepareConfig(serviceConfig) {
			var formConfig = {
				fid: 'basics.customize.dialogform',
				version: '1.0.0',
				showGrouping: true,
				change: 'change',
				groups: [
					{
						gid: 'status_transition',
						header: 'Combinations',
						header$tr$: 'basics.customize.combinations',
						isOpen: true,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'status_rule',
						header: 'Rules',
						header$tr$: 'basics.customize.rules',
						isOpen: true,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'status_role',
						header: 'Roles',
						header$tr$: 'basics.customize.roles',
						isOpen: true,
						visible: serviceConfig.roleIsVisible,
						sortOrder: 3
					},
					{
						gid: 'status_workflow',
						header: 'Workflow',
						header$tr$: 'basics.customize.workflow',
						isOpen: true,
						visible: true,
						sortOrder: 4
					}
				],
				rows: [
					{
						gid: 'status_transition',
						rid: 'detail',
						type: 'directive',
						directive: 'basics-customize-status-matrix',
						readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1
					},
					{
						gid: 'status_rule',
						rid: 'comment',
						label$tr$: 'cloud.common.entityComment',
						type: 'directive',
						directive: 'basics-customize-comment-editor',
						model: 'rule.CommentText',
						sortOrder: 1
					},
					{
						gid: 'status_rule',
						rid: 'rightmask',
						label$tr$: 'basics.customize.accessrightdescriptor',
						type: 'directive',
						directive: 'basics-customize-access-right-editor',
						model: 'rule.DescriptorDesc',
						readonly: true,
						sortOrder: 2
					},
					{
						gid: 'status_rule',
						rid: 'role',
						label: 'Has Role Validation',
						label$tr$: 'basics.customize.hasrolevalidation',
						type: 'directive',
						directive: 'basics-customize-role-validation-editor',
						model: 'rule.Hasrolevalidation',
						sortOrder: 3
					},
					{
						gid: 'status_role',
						rid: 'status_roles',
						type: 'directive',
						directive: 'basics-customize-status-role-grid-directive',
						visible: serviceConfig.roleIsVisible,
						readonly: false, maxlength: 5000, rows: 20, sortOrder: 1
					},
					{
						gid: 'status_workflow',
						rid: 'workflow_steps',
						type: 'directive',
						directive: 'basics-customize-status-workflow-grid-directive',
						readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 1
					}
				]
			};
			platformTranslateService.translateFormConfig(formConfig);

			return formConfig;
		};
	}
})(angular);