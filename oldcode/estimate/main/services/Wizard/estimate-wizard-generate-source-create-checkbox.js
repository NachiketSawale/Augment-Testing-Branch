/**
 * Created by zos on 3/8/2016.
 */

(function () {


	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateWizardGenerateSourceCreateNewCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateWizardGenerateSourceCreateNewCheckbox', ['platformDataValidationService','estimateMainSidebarWizardService',
		function (platformDataValidationService,estimateMainSidebarWizardService) {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/estimate-wizard-generate-source-create-new.html',
				link: function link(scope) {
					// TODO:check the CreateNew to disable the Okbutton yes/no.
					scope.onCheckCreateNew = function () {
						this.entity.CreateNew = !this.entity.CreateNew;
						if ((!this.entity.CreateNew && !this.entity.UpdateExistedItem) || !this.entity.StructureId) {
							estimateMainSidebarWizardService.setOkdisabale(true);
						}
						else {
							estimateMainSidebarWizardService.setOkdisabale(false);
						}

						estimateMainSidebarWizardService.processCreateExistedItem(this.entity);
					};
				}
			};
		}]);
})();
