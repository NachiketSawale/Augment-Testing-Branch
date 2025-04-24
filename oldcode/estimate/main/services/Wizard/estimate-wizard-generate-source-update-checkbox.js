/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateWizardGenerateSourceUpdateOldCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateWizardGenerateSourceUpdateOldCheckbox',['estimateMainGenerateEstimateFromLeadingStructureDialogService',
		function (estimateMainGenerateEstimateFromLeadingStructureDialogService) {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/estimate-wizard-generate-source-update-old.html',
				link: function link(scope) {
					// TODO:check the UpdateExistedItem to disable the Okbutton yes/no.
					scope.onCheckUpdateExistedItem = function () {
						this.entity.UpdateExistedItem = !this.entity.UpdateExistedItem;
						if ((!this.entity.CreateNew && !this.entity.UpdateExistedItem) || !this.entity.StructureId) {
							estimateMainGenerateEstimateFromLeadingStructureDialogService.setOkdisabale(true);
						}
						else {
							estimateMainGenerateEstimateFromLeadingStructureDialogService.setOkdisabale(false);
						}

						estimateMainGenerateEstimateFromLeadingStructureDialogService.processUpdateExistedItem(this.entity);
					};
				}
			};

		}]);
})();
