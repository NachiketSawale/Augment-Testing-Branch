/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.administration';

	angular.module(moduleName).service('modelAdministrationDataFilterTreeNodeTemplateActionProcessor',
		ModelAdministrationDataFilterTreeNodeTemplateActionProcessor);

	ModelAdministrationDataFilterTreeNodeTemplateActionProcessor.$inject = [
		'_',
		'platformDialogService',
		'$translate',
		'modelAdministrationUIConfigurationService', 'modelAdministrationDataFilterTreeTemplateSettingsService'
	];

	function ModelAdministrationDataFilterTreeNodeTemplateActionProcessor(
		_,
		platformDialogService,
		$translate,
		modelAdministrationUIConfigurationService, modelAdministrationDataFilterTreeTemplateSettingsService
	) {
		var service = this;

		// Function to provide icon specification for Action column
		this.provideActionSpecification = function provideActionSpecification(action, actionList) {
			if (action === 'Settings') {
				actionList.push({
					toolTip: $translate.instant('model.administration.filterTreeTemplate.settingsTooltip'),
					icon: 'tlb-icons ico-settings',
					callbackFn: function openSettings(item) {
						modelAdministrationDataFilterTreeTemplateSettingsService.openSettingsDialog(item);
					},
					readonly: false
				});
			}
		};

		// Process each item to add action and icon to the Action column
		this.processItem = function processItem(item) {
			if (item.Action) {
				item.Action.actionList = [];
				service.provideActionSpecification('Settings', item.Action.actionList);
			}
		};

		// Revert the item processing by clearing actions from the Action column
		this.revertProcessItem = function revertProcessItem(item) {
			if (item.Action) {
				item.Action.length = 0;
				delete item.Action;
			}
		};
	}
})(angular);
