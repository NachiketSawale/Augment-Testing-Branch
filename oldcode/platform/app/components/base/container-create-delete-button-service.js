/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformContainerCreateDeleteButtonService
	 * @function
	 * @requires platform:platformDataServiceSelectionExtension
	 * @description
	 * platformDataServiceActionExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformContainerCreateDeleteButtonService', PlatformContainerCreateDeleteButtonService);

	PlatformContainerCreateDeleteButtonService.$inject = ['platformGridAPI', 'platformContextMenuTypes'];

	function PlatformContainerCreateDeleteButtonService(platformGridAPI, platformContextMenuTypes) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceActionExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.provideButtons = function provideButtons(config, dataService) {
			if (dataService.createItem) {
				config.createBtnConfig = {
					id: 'create',
					sort: 0,
					caption: 'cloud.common.taskBarNewRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new',
					disabled: true,
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 2
				};
			}

			if (config.isTree && dataService.createChildItem) {
				config.createChildBtnConfig = {
					id: 'createChild',
					sort: 40,
					caption: 'cloud.common.toolbarInsertSub',
					type: 'item',
					iconClass: 'tlb-icons ico-sub-fld-new',
					disabled: true,
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 2
				};
			}

			if (dataService.createShallowCopy) {
				config.createShallowCopyBtnConfig = {
					id: 'createShallowCopy',
					sort: 3,
					caption: 'cloud.common.taskBarShallowCopyRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-copy-paste',
					disabled: true,
					fn: function () {
						self.handleCreateShallowCopy(dataService);
					}
				};
			}

			if (dataService.createDeepCopy) {
				config.createDeepCopyBtnConfig = {
					id: 'createDeepCopy',
					sort: 4,
					caption: 'cloud.common.taskBarDeepCopyRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-copy-paste-deep',
					disabled: true,
					fn: function () {
						self.handleCreateDeepCopy(dataService);
					},
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 2
				};
			}

			if (dataService.deleteItem) {
				config.deleteBtnConfig = {
					id: 'delete',
					sort: 10,
					caption: 'cloud.common.taskBarDeleteRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-delete',
					disabled: true,
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 3
				};

				config.deleteBtnConfig.fn = function deleteItem() {
					self.deleteSelectedItem(dataService);
				};
				if (dataService.canDelete && dataService.canDelete()) {
					config.deleteBtnConfig.disabled = false;
				}
			}

			if (dataService.createItem) {
				config.createBtnConfig.fn = function () {
					self.handleCreateItem(dataService);
				};
				if (dataService.canCreate && dataService.canCreate()) {
					config.createBtnConfig.disabled = false;
				}
			}

			if (config.isTree && dataService.createChildItem) {
				config.createChildBtnConfig.fn = function () {
					self.handleCreateChildItem(dataService);
				};
				if (dataService.canCreateChild && dataService.canCreateChild()) {
					config.createChildBtnConfig.disabled = false;
				}
			}
		};

		this.toggleButtonUsingContainerState = function toggleButtonUsingContainerState(config, dataService, buttonStates) {
			var updateTools = false;

			if (dataService.canCreate && config.createBtnConfig && self.toggleButtonIfNecessary(config.createBtnConfig, dataService.canCreate(), buttonStates.disableCreate)) {
				updateTools = true;
			}

			if (dataService.canDelete && config.deleteBtnConfig && self.toggleButtonIfNecessary(config.deleteBtnConfig, dataService.canDelete(), buttonStates.disableDelete)) {
				updateTools = true;
			}

			var canCopy = self.canCopy(dataService);
			if (config.createShallowCopyBtnConfig && self.toggleButtonOnStateChange(config.createShallowCopyBtnConfig, canCopy)) {
				updateTools = true;
			}

			if (config.createDeepCopyBtnConfig && self.toggleButtonOnStateChange(config.createDeepCopyBtnConfig, canCopy)) {
				updateTools = true;
			}

			if (config.isTree && dataService.createChildItem && dataService.canCreateChild) {
				if (config.createChildBtnConfig && self.toggleButtonIfNecessary(config.createChildBtnConfig, dataService.canCreateChild(), buttonStates.disableCreate)) {
					updateTools = true;
				}
			}

			return updateTools;
		};

		this.toggleButtons = function toggleButtons(config, dataService) {
			var updateTools = false;

			if (dataService.canCreate && config.createBtnConfig && self.toggleButtonOnStateChange(config.createBtnConfig, dataService.canCreate())) {
				updateTools = true;
			}

			if (dataService.canDelete && config.deleteBtnConfig && self.toggleButtonOnStateChange(config.deleteBtnConfig, dataService.canDelete())) {
				updateTools = true;
			}

			var canCopy = self.canCopy(dataService);
			if (canCopy && config.createShallowCopyBtnConfig && self.toggleButtonOnStateChange(config.createShallowCopyBtnConfig, canCopy)) {
				updateTools = true;
			}

			if (canCopy && config.createDeepCopyBtnConfig && self.toggleButtonOnStateChange(config.createDeepCopyBtnConfig, canCopy)) {
				updateTools = true;
			}

			if (config.isTree && dataService.createChildItem && dataService.canCreateChild) {
				if (config.createChildBtnConfig && self.toggleButtonOnStateChange(config.createChildBtnConfig, dataService.canCreateChild())) {
					updateTools = true;
				}
			}
			return updateTools;
		};

		this.toggleButtonIfNecessary = function toggleButtonIfNecessary(button, serviceFlag, controlFlag) {
			return !controlFlag && self.toggleButtonOnStateChange(button, serviceFlag);
		};

		this.toggleButtonOnStateChange = function toggleButtonOnStateChange(button, serviceFlag) {
			var toggled = false;

			if (button.disabled === serviceFlag) {
				button.disabled = !button.disabled;
				toggled = true;
			}

			return toggled;
		};

		this.deleteSelectedItem = function deleteSelectedItem(dataService) {
			if (dataService.hasSelection()) {
				dataService.deleteSelection();
			}
		};

		this.canCopy = function canCopy(dataService) {
			if (dataService.canCreateCopy && dataService.hasSelection) {
				return dataService.hasSelection() && dataService.canCreateCopy();
			} else if (dataService.hasSelection) {
				return dataService.hasSelection();
			} else {
				return false;
			}
		};

		this.handleCreateItem = function handleCreateItem(dataService) {
			platformGridAPI.grids.commitAllEdits();
			dataService.createItem();
		};

		this.handleCreateChildItem = function handleCreateChildItem(dataService) {
			platformGridAPI.grids.commitAllEdits();
			dataService.createChildItem();
		};

		this.handleCreateShallowCopy = function handleCreateShallowCopy(dataService) {
			platformGridAPI.grids.commitAllEdits();
			dataService.createShallowCopy();
		};

		this.handleCreateDeepCopy = function handleCreateDeepCopy(dataService) {
			platformGridAPI.grids.commitAllEdits();
			dataService.createDeepCopy();
		};
	}
})();