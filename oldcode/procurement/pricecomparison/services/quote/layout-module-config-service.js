/**
 Created by wed on 12/10/2020.
 */

(function procurementPriceComparisonLayoutModuleConfigServiceDefinition(angular) {

	'use strict';

	angular.module('procurement.pricecomparison').factory('procurementPriceComparisonLayoutModuleConfigService', [
		'globals',
		'_',
		'mainViewService',
		'platformPermissionService',
		'platformDialogService',
		function procurementPriceComparisonLayoutModuleConfigService(
			globals,
			_,
			mainViewService,
			platformPermissionService,
			platformDialogService) {

			function useModuleConfig(scope, gridId, formOptions, tools) {

				formOptions.configure.enableModuleConfig = true;
				formOptions.configure.skipConfiguration = true;

				var toolbarItems = [];
				var systemTmplBtn = null;
				var roleTmplBtn = null;
				var hasSystemTmpl = mainViewService.hasModuleConfig(gridId, 's');
				var hasRoleTmpl = mainViewService.hasModuleConfig(gridId, 'r');

				var hasTemplateEditPermission = platformPermissionService.hasExecute('7ee17da2cd004de6a53c63af7cb4d3d9');
				var hasLayoutEditPermission = platformPermissionService.hasExecute('91c3b3b31b5d4ead9c4f7236cb4f2bc0');

				var applyFormConfig = function applyFormConfig(usersetting, configuration) {
					if (usersetting) {

						if (usersetting.markReadOnlyFields) {
							configuration.markReadOnlyFields = usersetting.markReadOnlyFields;
						}

						_.each(configuration.rows, function configRowIterator(row) {
							row.visible = false;
						});

						_.each(usersetting.rows, function settingRowIterator(userRowSetting) {
							var row = _.find(configuration.rows, {rid: userRowSetting.rid});

							if (row && _.find(configuration.groups, {gid: userRowSetting.gid})) {
								row.gid = userRowSetting.gid;
								row.userlabel = userRowSetting.userlabel;
								row.visible = userRowSetting.visible;
								row.readonly = !!row.readonly;
								row.enterStop = userRowSetting.enterStop;
								row.tabStop = userRowSetting.tabStop;
								row.sortOrder = userRowSetting.sortOrder;
								row.uom = userRowSetting.uom;
								row.fraction = userRowSetting.fraction;
							}
						});

						_.each(configuration.groups, function configGroupIterator(group) {
							group.visible = false;
						});

						_.each(usersetting.groups, function settingGroupIterator(groupsetting) {
							var group = _.find(configuration.groups, {gid: groupsetting.gid});

							if (group) {
								group.gid = groupsetting.gid;
								group.userheader = groupsetting.userheader;
								group.isOpen = groupsetting.isOpen;
								group.visible = groupsetting.visible;
								group.sortOrder = groupsetting.sortOrder;
							}
						});
					}
				};

				var applyUserSetting = function () {
					var config = mainViewService.getModuleConfig(gridId);
					if (config && config.Propertyconfig) {
						var userSetting = angular.isString(config.Propertyconfig) ? JSON.parse(config.Propertyconfig) : config.Propertyconfig;
						if (userSetting) {
							applyFormConfig(userSetting, formOptions.configure);
						}
					}
				};

				var getFormContentScope = function (startScope) {

					var cache = {};

					cache[startScope.$id] = true;

					var isFormContentScope = function (scope) {
						// eslint-disable-next-line no-prototype-builtins
						return scope.hasOwnProperty('groups') && scope.hasOwnProperty('unregister');
					};

					var findTargetScope = function (scope) {
						var targetScope = null;
						if (isFormContentScope(scope)) {
							targetScope = scope;
						} else {
							cache[scope.$id] = true;
							targetScope = findFormContentScope(scope);
						}
						return targetScope;
					};

					var findFormContentScope = function (start) {

						var targetScope = null;

						if (start.$$childHead && !cache[start.$$childHead.$id]) {
							targetScope = findTargetScope(start.$$childHead);
						}

						if (!targetScope && start.$$childTail && !cache[start.$$childTail.$id]) {
							targetScope = findTargetScope(start.$$childTail);
						}

						if (!targetScope && start.$$prevSibling && !cache[start.$$prevSibling.$id]) {
							targetScope = findTargetScope(start.$$prevSibling);
						}

						if (!targetScope && start.$$nextSibling && !cache[start.$$nextSibling.$id]) {
							targetScope = findTargetScope(start.$$nextSibling);
						}

						return targetScope;

					};

					return findFormContentScope(startScope);
				};

				var createItem = function (id, type, sort, hideItem, isSet, options) {
					return _.extend({
						id: id,
						sort: sort,
						type: type,
						hideItem: hideItem,
						isSet: isSet
					}, options);
				};

				var createActionItem = function (id, type, sort, hideItem, caption, iconClass, fn, disabledFn) {
					return createItem(id, type, sort, hideItem, false, {
						caption: caption,
						iconClass: iconClass,
						fn: fn,
						disabled: function () {
							return angular.isFunction(disabledFn) ? disabledFn() : false;
						}
					});
				};

				var updateToolbar = function (id, props) {
					var toolbar = _.find(tools.items, {id: id});
					if (toolbar) {
						_.extend(toolbar, props);
						tools.update();
					}
				};

				var updateState = function (type, hasTemplate) {
					var updateToolbarId = '', iconClass = '';
					if (type === 's') {
						updateToolbarId = 'user-sys-template-dd';
						hasSystemTmpl = hasTemplate;
						if (systemTmplBtn) {
							iconClass = 'tlb-icons ' + (hasSystemTmpl ? 'ico-config-system-true' : 'ico-config-system');
						}
					} else {
						updateToolbarId = 'role-template-dd';
						hasRoleTmpl = hasTemplate;
						if (roleTmplBtn) {
							iconClass = 'tlb-icons ' + (hasRoleTmpl ? 'ico-config-roles-true' : 'ico-config-roles');
						}
					}
					if (updateToolbarId && iconClass) {
						updateToolbar(updateToolbarId, {iconClass: iconClass});
					}
				};

				var refreshView = function () {

					var formContentScope = getFormContentScope(scope);
					if (formContentScope) {
						formContentScope.$broadcast('form-config-updated');
					}

				};

				var saveModuleConfigAs = function (type) {
					mainViewService.saveModuleConfigAs(gridId, type);
					updateState(type, true);
				};

				var applyModuleConfig = function (type) {
					mainViewService.applyModuleConfig(gridId, type);
					applyUserSetting();
					refreshView();
				};

				var deleteModuleConfig = function (type) {
					mainViewService.deleteModuleConfig(gridId, type);
					updateState(type, false);
				};

				if (hasTemplateEditPermission) {

					systemTmplBtn = createItem('user-sys-template-dd', 'dropdown-btn', 20, false, true, {
						iconClass: 'tlb-icons ' + (hasSystemTmpl ? 'ico-config-system-true' : 'ico-config-system'),
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: [
								createActionItem('save-as-sys-tmpl', 'item', 1, false, 'cloud.common.saveAsSystemTemplate', 'tlb-icons ico-save2system', function saveSysTemplateFn() {
									saveModuleConfigAs('s');
								}, function disabledSaveAsSysTemplateFn() {
									return !mainViewService.hasModuleConfig(gridId, 'u');
								}),
								createActionItem('load-sys-tmpl', 'item', 2, false, 'cloud.common.loadSystemTemplate', 'tlb-icons ico-config-system-load', function loadSysTemplateFn() {
									applyModuleConfig('s');
								}, function disabledLoadSysTemplateFn() {
									return !hasSystemTmpl;
								}),
								createActionItem('delete-sys-tmpl', 'item', 3, false, 'cloud.common.deleteSystemTemplate', 'tlb-icons ico-config-system-delete', function deleteSysTemplateFn() {
									deleteModuleConfig('s');
								}, function disabledDeleteSysTemplateFn() {
									return !hasSystemTmpl;
								})
							]
						}
					});

					roleTmplBtn = createItem('role-template-dd', 'dropdown-btn', 22, false, true, {
						iconClass: 'tlb-icons ' + (hasRoleTmpl ? 'ico-config-roles-true' : 'ico-config-roles'),
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: [
								createActionItem('save-as-role-tmpl', 'item', 1, false, 'cloud.common.saveAsRoleTemplate', 'tlb-icons ico-save2role', function saveRoleTemplateFn() {
									saveModuleConfigAs('r');
								}, function disabledSaveAsRoleTemplateFn() {
									return !mainViewService.hasModuleConfig(gridId, 'u');
								}),
								createActionItem('load-role-tmpl', 'item', 2, false, 'cloud.common.loadRoleTemplate', 'tlb-icons ico-config-role-load', function loadRoleTemplateFn() {
									applyModuleConfig('r');
								}, function disabledLoadRoleTemplateFn() {
									return !hasRoleTmpl;
								}),
								createActionItem('delete-role-tmpl', 'item', 3, false, 'cloud.common.deleteRoleTemplate', 'tlb-icons ico-config-role-delete', function deleteRoleTemplateFn() {
									deleteModuleConfig('r');
								}, function disabledDeleteRoleTemplateFn() {
									return !hasRoleTmpl;
								})
							]
						}
					});

				} else {
					if (hasSystemTmpl) {
						systemTmplBtn = createActionItem('reload-user-sys-template', 'item', 20, false, 'cloud.common.reloadUserSystemTemplate', 'tlb-icons ico-config-system-load', function reloadSysTemplateFn() {
							applyModuleConfig('s');
						});
					}
					if (hasRoleTmpl) {
						roleTmplBtn = createActionItem('reload-role-template', 'item', 22, false, 'cloud.common.reloadRoleTemplate', 'tlb-icons ico-config-role-load', function reloadRoleTemplateFn() {
							applyModuleConfig('r');
						});
					}
				}

				// Template button
				if ((systemTmplBtn || roleTmplBtn)) {
					toolbarItems.push(createItem('d1', 'divider', 18, false, true));
				}

				if (systemTmplBtn) {
					toolbarItems.push(systemTmplBtn);
				}
				if (roleTmplBtn) {
					toolbarItems.push(roleTmplBtn);
				}

				// Grid Layout button
				if (hasLayoutEditPermission) {
					toolbarItems.push(createItem('d3', 'divider', 110, false, true));
					toolbarItems.push(createActionItem('setting', 'item', 112, false, 'platform.formContainer.settings', 'tlb-icons ico-settings', function layoutFn() {
						platformDialogService.showDialog({
							headerText$tr$: 'cloud.desktop.formConfigDialogTitle',
							bodyTemplateUrl: globals.appBaseUrl + 'app/components/form/form-config-dialog.html',
							backdrop: false,
							scope: scope,
							windowClass: 'form-modal-dialog',
							resizeable: true,
							height: '600px',
							width: '800px',
							buttons: [{
								id: 'ok',
								caption$tr$: 'cloud.desktop.formConfigRestoreBnt'
							}, {
								id: 'cancel',
								caption$tr$: 'cloud.desktop.formConfigCancelBnt'
							}],
							customButtons: [{
								id: 'restore',
								caption$tr$: 'cloud.desktop.formConfigRestoreBnt'
							}]
						}).then(function resultCallback(result) {
							if (result.isOK) {
								applyFormConfig(result.setting, formOptions.configure);
								mainViewService.setModuleConfig(gridId, result.setting, null, null, {
									isFormConfig: true
								});
								refreshView();
							}
						});
					}));
				}

				if (toolbarItems.length > 0) {
					toolbarItems = _.orderBy(toolbarItems, 'sort');
				}

				_.each(toolbarItems, function toolbarIterator(item) {
					tools.items.push(item);
				});

				applyUserSetting();
			}

			return {
				useModuleConfig: useModuleConfig
			};

		}]);

})(angular);