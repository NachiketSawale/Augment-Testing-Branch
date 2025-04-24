(function () {
	'use strict';
	var moduleName = 'basics.config';
	angular.module(moduleName).constant('basicsConfigGenericWizardContainerType', {
		list: 'grid',
		detail: 'form',
		chart: 'chart'
	});
})();
