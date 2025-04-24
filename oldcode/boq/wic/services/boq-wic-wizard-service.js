(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqWicWizardService
	 * @description provides wizard configuarion
	 */
	angular.module('boq.wic').factory('boqWicWizardService', ['platformDialogService', 'boqWicGroupService', 'boqWicOenImportService',
		function (platformDialogService, boqWicGroupService, boqWicOenImportService) {
			function importCrbNpk() {
				var selectedWicGroup = boqWicGroupService.getSelected();

				if (!angular.isDefined(selectedWicGroup) || selectedWicGroup === null) {
					platformDialogService.showMsgBox('boq.main.npkImportWicMissing', 'cloud.common.informationDialogHeader', 'info');
				}
				else {
					var modalOptions =
						{
							headerText: 'Copyright',
							bodyTemplateUrl: globals.appBaseUrl + 'boq.wic/templates/boq-wic-crb-npk-copyright.html',
							showOkButton: true,
							width: '560px',
							height: '560px'
						};
					platformDialogService.showDialog(modalOptions).then(function () {
						modalOptions =
							{
								headerText$tr$: 'boq.main.npkImport',
								bodyTemplateUrl: globals.appBaseUrl + 'boq.wic/templates/boq-wic-crb-npk-import.html',
								showOkButton: true,
								showCancelButton: true,
								resizeable: true,
								height: '500px',
								lazyInit: true,
								selectedWicGroupId: selectedWicGroup.Id // new
							};
						platformDialogService.showDialog(modalOptions);
					});
				}
			}

			function importOenOnlb() {
				var currentWicGroup = boqWicGroupService.getSelected();

				if (!currentWicGroup) {
					platformDialogService.showMsgBox('boq.main.npkImportWicMissing', 'cloud.common.informationDialogHeader', 'info');
				}
				else {
					boqWicOenImportService.importOenOnlb(currentWicGroup.Id);
				}
			}

			return {
				importCrbNpk:  importCrbNpk,
				importOenOnlb: importOenOnlb
			};
		}
	]);
})();
