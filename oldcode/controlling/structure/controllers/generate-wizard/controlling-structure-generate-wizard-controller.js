/**
 * Created by janas on 11.12.2015.
 */

(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructureGenerateWizardController
	 * @function
	 *
	 * @description
	 * Controller for generate controlling units wizard.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	controllingStructureModule.controller('controllingStructureGenerateWizardController',
		['globals', '_', '$scope', '$translate', '$modalInstance', 'platformModalService', 'controllingStructureWizardGeneratePreviewService', 'controllingStructureGeneratorMetadataService', 'controllingStructureMainService', 'platformGridAPI', '$timeout',
			function Controller(globals, _, $scope, t, $modalInstance, platformModalService, generatePreviewService, genMetadataService, controllingStructureMainService, platformGridAPI, $timeout) {

				// options
				var optGenerateOnServer = true;

				$scope.modalOptions = {
					headerText: t.instant('controlling.structure.generateControllingUnits'),

					tabSettings: t.instant('controlling.structure.generateWizardTabSettings'),
					tabCustom: t.instant('controlling.structure.generateWizardTabCustom'),
					tabPreview: t.instant('controlling.structure.generateWizardTabPreview'),

					actionButtonText: t.instant('controlling.structure.generateWizardOkButton'),
					ok: function () {
						// update generated controlling units / make sure list is not empty
						generatePreviewService.load();

						var list = generatePreviewService.getList(),
							template = generatePreviewService.getTemplate();

						if (!template) {
							platformModalService.showErrorBox('controlling.structure.noCodeTemplateSelected', 'controlling.structure.generateControllingUnits');
							return;
						}

						if (_.size(list) === 0) {
							platformModalService.showMsgBox('controlling.structure.noUnitsToGenerate', 'controlling.structure.generateControllingUnits', 'info');
							return;
						}

						controllingStructureMainService.setAndSavePrjCodetemplate(template.Id);
						if (optGenerateOnServer) {
							controllingStructureMainService.bulkCreateOnServer(list || []);
						} else {
							controllingStructureMainService.bulkCreate(list || []);
						}

						$modalInstance.close({ok: true});
					},
					disableOk: function () {
						return !generatePreviewService.canGenerate();
					},
					closeButtonText: t.instant('cloud.common.cancel'),
					cancel: function () {
						$modalInstance.close({cancel: true});
					}
				};

				function setupTabs() {
					$scope.tabs = [
						{
							id: 'tabSettings',
							title: $scope.modalOptions.tabSettings,
							content: globals.appBaseUrl + 'controlling.structure/templates/generate-dialog-tab-settings.html',
							active: true
						},
						{
							id: 'tabCustom',
							title: $scope.modalOptions.tabCustom,
							content: globals.appBaseUrl + 'controlling.structure/templates/generate-dialog-tab-custom.html',
							gridId: '1097289d50f8443a9bcf64f1422886cf'
						},
						{
							id: 'tabPreview',
							title: $scope.modalOptions.tabPreview,
							content: globals.appBaseUrl + 'controlling.structure/templates/generate-dialog-tab-preview.html',
							gridId: '0e8aeced00b2409cbd88df61e5bed247'
						}
					];
				}

				$scope.onTabSelect = function (tab) {
					if (tab.id === 'tabPreview') {

						genMetadataService.init();
						generatePreviewService.load();
					}

					if (tab.gridId) {
						$timeout(function () {
							platformGridAPI.grids.resize(tab.gridId);
						}, 25, false);
					}
				};

				setupTabs();

				generatePreviewService.setMetadataService(genMetadataService);
				genMetadataService.init();

			}]);

})();
