/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

/**
 * @ngdoc directive
 * @name platform.directive:platformFormContainer
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Form container
 * Form, container header, status bar and also the default buttons are ready.
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-form-container
 data-title="demo form"
 data-form-container-options="demoFormContainerOptions"
 data-entity="demoObject"></div>
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformFormContainer', platformFormContainer);

	platformFormContainer.$inject = ['globals', 'reportingPrintService', 'platformTranslateService', '_', 'cloudDesktopDataLayoutSettingsService', 'mainViewService'];

	function platformFormContainer(globals, reportingPrintService, platformTranslateService, _, dataLayoutSettingsService, mainViewService) {
		return {
			restrict: 'A',
			scope: {
				title: '@',
				formContainerOptions: '=',
				// parameter entity here make binding easier.
				entity: '='
			},
			templateUrl: globals.appBaseUrl + 'app/components/form/form-container.html',
			link: function ($scope) {
				var scope = $scope;
				var containerOptions = scope.formContainerOptions;
				var containerScope = scope.$parent;

				var settingsDropdownItems = [
					{
						id: 'setting',
						caption$tr$: 'platform.formContainer.settings',
						permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0#e',
						type: 'item',
						fn: onSetting,
						sort: 112
					}
				];

				// Default buttons for container
				var defaultButtons = [
					{
						id: 'refresh',
						caption$tr$: 'platform.formContainer.refresh',
						type: 'item',
						iconClass: 'tlb-icons ico-refresh',
						fn: containerOptions.onRefresh
					},
					{
						id: 'search',
						caption$tr$: 'platform.formContainer.search',
						type: 'item',
						iconClass: 'tlb-icons ico-search',
						fn: containerOptions.onSearch
					},
					{
						id: 'save',
						caption$tr$: 'platform.formContainer.save',
						type: 'item',
						iconClass: 'tlb-icons ico-save',
						fn: containerOptions.onSave
					},
					{
						id: 'discard',
						caption$tr$: 'platform.formContainer.discard',
						type: 'item',
						iconClass: 'tlb-icons ico-discard',
						fn: containerOptions.onDiscard
					},
					containerOptions.createBtnConfig,
					containerOptions.createChildBtnConfig,
					containerOptions.deleteBtnConfig,
					{
						id: 'first',
						caption$tr$: 'platform.formContainer.first',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-first',
						fn: containerOptions.onFirstItem
					},
					{
						id: 'previous',
						caption$tr$: 'platform.formContainer.previous',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-previous',
						fn: containerOptions.onPrevItem
					},
					{
						id: 'next',
						caption$tr$: 'platform.formContainer.next',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-next',
						fn: containerOptions.onNextItem
					},
					{
						id: 'last',
						caption$tr$: 'platform.formContainer.last',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-last',
						fn: containerOptions.onLastItem
					},
					{
						id: 'collapseall',
						caption$tr$: 'platform.formContainer.collapseAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse-all',
						fn: onCollapseAll
					},
					{
						id: 'expandall',
						caption$tr$: 'platform.formContainer.expandAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand-all',
						fn: onExpandAll
					},
					{
						id: 'print',
						caption$tr$: 'platform.formContainer.print',
						type: 'item',
						iconClass: 'tlb-icons ico-print-preview',
						fn: function () {
							while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
								containerScope = containerScope.$parent;
							}
							var uuid = containerScope.getContainerUUID();
							onExpandAll();
							setTimeout(function () {
								reportingPrintService.printForm(uuid);
							}, 50);
						}
					},
					// {
					// 	id: 'setting',
					// 	caption$tr$: 'platform.formContainer.settings',
					// 	permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0#e',
					// 	type: 'item',
					// 	iconClass: 'tlb-icons ico-settings',
					// 	fn: onSetting
					// },
					{
						id: 'settingsDropdown',
						caption: 'platform.formContainer.settings',
						type: 'dropdown-btn',
						icoClass: 'tlb-icons ico-settings',
						cssClass: 'tlb-icons ico-settings',
						list: {
							showImages: false,
							cssClass: 'dropdown-menu-right',
							items: settingsDropdownItems
						}
					}
				];

				dataLayoutSettingsService.getSettings().then(function (result) {
					var configuration = scope.formContainerOptions.formOptions.configure;
					var button = {
						id: 'markReadOnly',
						sort: 200,
						caption$tr$: 'cloud.common.markReadonlyFields',
						type: 'check',
						value: true,
						fn: function () {
							if (configuration) {
								configuration.markReadOnlyFields = this.value;
								setShowReadonly(configuration.uuid, configuration.markReadOnlyFields);

								mainViewService.setViewConfig(configuration.uuid, configuration, null, true, true);
							}
						}
					};

					// Retrieve markReadOnly button saved value
					button.value = configuration.markReadOnlyFields;

					if (result.formDisplayReadOnly !== 0) {
						// settingsDropdownItems.push(button);
						// doToolbarRefresh();
						//
						// setShowReadonly(configuration.uuid, configuration.markReadOnlyFields);
					}
				});

				function setShowReadonly(id, showReadOnly) {
					if (showReadOnly) {
						$('.cid_' + id + ' .platform-form-container').addClass('show-readonly');
					} else {
						$('.cid_' + id + ' .platform-form-container').removeClass('show-readonly');
					}
				}

				function doToolbarRefresh() {
					if (containerScope.tools && _.isFunction(containerScope.tools.refresh)) {
						containerScope.tools.refresh();
					} else {
						updateTools();
					}
				}

				scope.path = globals.appBaseUrl;

				scope.click = function (event) {
					let input = event.currentTarget.getElementsByTagName('input');
					for (let i = 0; i < input.length; i++) {
						input[i].classList.remove('active');
					}

					input = event.currentTarget.getElementsByClassName('input-group-content');
					for (let i = 0; i < input.length; i++) {
						input[i].classList.remove('active');
					}

					if(event.target) {
						event.target.classList.add('active');
					}
				};

				// expand all the panels
				function onExpandAll() {
					containerOptions.formOptions.expandAll();
				}

				// collapse all the panels
				function onCollapseAll() {
					containerOptions.formOptions.collapseAll();
				}

				// on press setting to show the configuration dialog
				function onSetting() {
					containerOptions.formOptions.showConfigDialog();
				}

				// Check the button will be shown or not
				function isButtonShown(bnt) {
					if (!bnt || !containerOptions) {
						return false;
					}

					if (bnt.id === 'settingsDropdown') {
						return true;
					}

					if (bnt.id === 'setting' && !!containerOptions.formOptions.isBtnSettingHide) {
						return false;
					}

					if (bnt.id === 'setting' || bnt.id === 'print') {
						return true;
					}

					// Do not show the expand and collapse button if we not show the grouping
					if (bnt.id === 'expandall' || bnt.id === 'collapseall') {
						return (containerOptions.formOptions.configure.showGrouping === true);
					}

					if (bnt.id === 'first') {
						return (!!containerOptions.onFirstItem);
					}

					if (bnt.id === 'previous') {
						return (!!containerOptions.onPrevItem);
					}

					if (bnt.id === 'next') {
						return (!!containerOptions.onNextItem);
					}

					if (bnt.id === 'last') {
						return (!!containerOptions.onLastItem);
					}

					if (bnt.id === 'create') {
						return (!!containerOptions.createBtnConfig && !!containerOptions.createBtnConfig.fn);
					}

					if (bnt.id === 'createChild') {
						return (!!containerOptions.createChildBtnConfig && !!containerOptions.createChildBtnConfig.fn);
					}

					if (bnt.id === 'delete') {
						return (!!containerOptions.deleteBtnConfig && !!containerOptions.deleteBtnConfig.fn);
					}

					// If no disable button defined enable all.
					if (!containerOptions.showButtons) {
						return false;
					}

					var result = containerOptions.showButtons.filter(function (button) {
						return button === bnt.id;
					});

					return result.length >= 1;
				}

				var toolButtons = _.filter(defaultButtons, isButtonShown);

				while (containerScope && !containerScope.hasOwnProperty('setTools')) {
					containerScope = containerScope.$parent;
				}

				// Merge the custom buttons and the default buttons
				if (containerOptions.customButtons) {
					toolButtons = _.union(toolButtons, containerOptions.customButtons);
				}

				function updateTools() {
					containerScope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						// items: (gridConfig.toolbarItemsDisabled) ? [] : toolbarItems
						items: toolButtons
					});
				}

				if (containerScope && !containerOptions.formOptions.configure.skipTools) {
					platformTranslateService.translateObject(toolButtons, 'caption');
					updateTools();
				}

				var unregister = [scope.$on('$destroy', function () {
					_.over(unregister)();
					unregister = scope = null;
				})];
			}
		};
	}
})(angular);
