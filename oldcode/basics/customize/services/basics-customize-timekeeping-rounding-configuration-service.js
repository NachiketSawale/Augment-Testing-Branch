(function () {
	'use strict';
	const moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeTimekeepingRoundingConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides functionality to edit basic settings of timekeeping rounding
	 */
	angular.module(moduleName).service('basicsCustomizeTimekeepingRoundingConfigurationService', BasicsCustomizeTimekeepingRoundingConfigurationService);

	BasicsCustomizeTimekeepingRoundingConfigurationService.$inject = ['$injector'];

	function BasicsCustomizeTimekeepingRoundingConfigurationService($injector) {
		this.showRoundingConfigurationDialog = function showRoundingConfigurationDialog(selectedItem) {
			let tksRoundingConfigTypeFk = null;
			let tksRoundingConfigFk = null;
			let timesheetContext = null;
			if(selectedItem && selectedItem.TimesheetContextFk) {
				tksRoundingConfigTypeFk = selectedItem.Id;
				tksRoundingConfigFk = selectedItem.RoundingConfigFk;
				timesheetContext = selectedItem.TimesheetContextFk;
			}
			$injector.get('timekeepingRoundingConfigDialogService').showConfigDialog(tksRoundingConfigTypeFk, tksRoundingConfigFk, timesheetContext, selectedItem);
		};
	}
})();
