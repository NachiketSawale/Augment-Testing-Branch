(function (angular) {
	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).factory('basicsAccountingJournalsWizardService', [
		'basicsCommonChangeStatusService', 'basicsAccountingJournalsMainService',
		function (changeStatusService, headerDataService) {
			var service = {};

			function changeStatus() {
				return changeStatusService.provideStatusChangeInstance(
					{
						mainService: headerDataService,
						statusField: 'CompanyTransheaderStatusFk',
						title: 'basics.accountingJournals.wizard.changeStatus.title',
						statusName: 'companytransheaderstatus',
						statusDisplayField: 'DescriptionInfo.Translated',
						updateUrl: 'basics/company/transheader/changestatus',
						doStatusChangePostProcessing: function (selectedItem,statusItem) {
							if (selectedItem && statusItem) {
								selectedItem.CompanyTransheaderStatusFk = statusItem.Id;
								headerDataService.gridRefresh();
							}else{
								headerDataService.refresh();
							}
						}
					}
				);
			}

			service.changeStatus = changeStatus().fn;

			return service;
		}]);
})(angular);