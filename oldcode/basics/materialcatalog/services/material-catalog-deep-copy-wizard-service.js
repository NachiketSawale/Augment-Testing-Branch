(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsMaterialcatalogUpdateDiscountWizardService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module( 'basics.materialcatalog' ).factory( 'basicsMaterialcatalogDeepCopyWizardService', ['$http', '$q', 'platformModalService', 'basicsMaterialCatalogService','$translate',
		function ($http, $q, platformModalService, basicsMaterialCatalogService, $translate) {
			var service = {};

			var self = this;

			service.canExecute = function () {
				return basicsMaterialCatalogService.hasSelection();
			};

			service.execute = function () {
				if (!service.canExecute()) {
					var deepCopyTitle = $translate.instant('basics.materialcatalog.Wizard.DeepCopyTitle');
					var warningMessage = $translate.instant('basics.materialcatalog.Wizard.DeepCopyWarningMessage');
					platformModalService.showMsgBox(warningMessage, deepCopyTitle, 'warning');
					return;
				}

				platformModalService.showYesNoDialog('basics.materialcatalog.Wizard.DeepCopyConfirmMessage','basics.materialcatalog.Wizard.DeepCopyTitle', 'no')
					.then(function(result){
						if(result.yes){
							self.handleOk(result);
						}
					});
			};

			self.handleOk = function(){
				basicsMaterialCatalogService.createDeepCopy();
			};

			return service;
		}
	]);
})(angular);
