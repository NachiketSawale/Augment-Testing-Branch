(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('ppsFormulaScriptController', scriptController);

	scriptController.$inject = ['$scope', '$translate', 'ppsFormulaScriptDataService'];

	function scriptController(scope, $translate, ppsFormulaScriptDataService) {
		scope.formula = {
			script: ''
		};

		let validateButton = {
			caption: $translate.instant('productionplanning.formulaconfiguration.script.toolbar.validate'),
			type: 'item',
			iconClass: 'tlb-icons ico-circle-check',
			fn: function() {
				ppsFormulaScriptDataService.validateScript(scope.formula.script, true);
			},
			disabled: function () {
				return !ppsFormulaScriptDataService.hasLinkedVersion();
			}
		};

		scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [validateButton]
		});
	}
})(angular);
