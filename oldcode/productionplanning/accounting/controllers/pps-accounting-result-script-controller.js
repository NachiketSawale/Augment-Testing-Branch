(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('ppsAccountingResultScriptController', scriptController);

	scriptController.$inject = ['$scope', '$translate', 'productionplanningAccountingResultDataService', 'ppsAccountingResultScriptDataService'];

	function scriptController(scope, $translate, ppsAccountingResultDataService, ppsAccountingResultScriptDataService) {
		scope.formula = {
			script: '',
			scriptFkField: 'BasClobFormulaFk',
		};

		const validateButton = createBtn(
			'productionplanning.formulaconfiguration.script.toolbar.validate',
			'ico-circle-check',
			() => ppsAccountingResultScriptDataService.validateScript(scope.formula.script, true),
			() => !ppsAccountingResultDataService.hasClob());

		const addButton = createBtn(
			'productionplanning.accounting.result.formula.addBtnTooltip',
			'ico-add',
			() => {
				ppsAccountingResultDataService.addClob().then(() =>
					ppsAccountingResultScriptDataService.setCodeMirrorOptions(scope));
			},
			() => ppsAccountingResultDataService.getSelected() === null || ppsAccountingResultDataService.hasClob());

		const delButton = createBtn(
			'productionplanning.accounting.result.formula.delBtnTooltip',
			'ico-delete2',
			() => {
				ppsAccountingResultDataService.deleteClob();
				scope.formula.script = '';
				ppsAccountingResultScriptDataService.setCodeMirrorOptions(scope);
			},
			() => ppsAccountingResultDataService.getSelected() === null || !ppsAccountingResultDataService.hasClob());

		scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [validateButton, addButton, delButton]
		});

		function createBtn(caption, icon, fn, disabledFn) {
			return {
				caption: $translate.instant(caption),
				type: 'item',
				iconClass: 'tlb-icons ' + icon,
				fn: fn,
				disabled: disabledFn,
			};
		}
	}
})(angular);
