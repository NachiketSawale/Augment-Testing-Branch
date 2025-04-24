/**
 * Created by wui on 5/8/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).controller('businesspartnerCertificateMainController', ['$scope', 'platformMainControllerService',
		'businesspartnerCertificateTranslationService', 'businesspartnerCertificateCertificateDataService',
		'documentsProjectDocumentDataService','documentsProjectDocumentFileUploadDataService','$rootScope',
		function ($scope, mainControllerService, certificateTranslateService, certificateDataService,
			documentsProjectDocumentDataService,fileUploadDataService, $rootScope) {
			var opt = {search: true, reports: true, wizards: true, auditTrail: 'e4fd87bbc89f47f893a3dad9b97bd8fe'};
			var result = mainControllerService.registerCompletely($scope, certificateDataService, {}, certificateTranslateService, moduleName, opt);

			// add export capability
			var exportOptions = {
				ModuleName: moduleName,
				MainContainer: {
					Id: '1',
					Label: 'businesspartner.certificate.certificateListTitle'
				},
				SubContainers: []
			};

			mainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

			documentsProjectDocumentDataService.register({
				moduleName: moduleName,
				parentService: certificateDataService,
				columnConfig: [
					{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
					{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false},
					{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false}
				]
			});
			const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(eventInfo, reportValue) {
				reportValue.processed = true;
				fileUploadDataService.storeReportAsProjectDocument(reportValue);
			});

			$scope.$on('$destroy', function () {
				unregisterReportPrepare();
				mainControllerService.unregisterCompletely(certificateDataService, result, certificateTranslateService, opt);
			});
		}
	]);

})(angular);
