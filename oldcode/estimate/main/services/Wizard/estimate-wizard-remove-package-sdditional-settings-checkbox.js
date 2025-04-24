/**
 * $Id: estimate-wizard-remove-package-sdditional-settings-checkbox.js 139608 2023-08-17 05:04:43Z$
 * Copyright (c) RIB Software SE
 */
(function (){

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateWizardRemovePackageSdditionalSettingsCheckbox
	 * @description
	 */
	angular.module(moduleName).directive('estimateWizardRemovePackageSdditionalSettingsCheckbox',[
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.main/templates/wizard/remove-package/estimate-main-remove-package-additional-settings.html',
				link: function link(scope) {

					scope.onCheckGeneratePrc = function () {

						this.entity.IsGeneratePrc = !this.entity.IsGeneratePrc;
					};
					scope.onCheckDisablePrc = function () {

						this.entity.IsDisablePrc = !this.entity.IsDisablePrc;
					};
				}
			};

		}]);

})();