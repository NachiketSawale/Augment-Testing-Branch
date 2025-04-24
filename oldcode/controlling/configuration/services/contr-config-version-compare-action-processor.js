/*
 * Copyright(c) RIB Software GmbH
 */

(function () {
	'use strict';
	let module = angular.module('controlling.configuration');

	module.service('contrConfigVersionCompareActionProcessor', ContrConfigVersionCompareActionProcessor);

	ContrConfigVersionCompareActionProcessor.$inject = ['_', '$translate', '$injector'];

	function ContrConfigVersionCompareActionProcessor(_, $translate, $injector) {

		this.processItem = function processItem(item) {
			item.Action = 'open detail config';
			item.actionList = [];
			item.actionList.push({
				toolTip: $translate.instant('controlling.configuration.versionCompareTitle'),
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: $injector.get('controllingConfigVersionCompareDataService').openDialog
			});
		};
	}

})();
