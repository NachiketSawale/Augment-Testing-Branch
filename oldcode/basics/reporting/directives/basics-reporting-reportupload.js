
((angular) => {
	'use strict';

	const moduleName = 'basics.reporting';

	angular.module(moduleName).directive('basicsReportingReportUpload', basicsReportingReportUpload);

	basicsReportingReportUpload.$inject = ['platformModalService', 'basicsReportingMainReportService'];

	function basicsReportingReportUpload(platformModalService, basicsReportingMainReportService) {
		return {
			restrict: 'A',
			scope: true,
			templateUrl: window.location.pathname + '/basics.reporting/templates/reporting-report-upload.html',
			link: function link(scope, element, attrs) {
				let parent = scope.$parent;

				while (!parent.hasOwnProperty('setReport')) {
					parent = parent.$parent;
				}

				parent.addReportClick = function () {
					const inputElem = element[0].childNodes;

					inputElem[0].click();
				};

				scope.fileInputChanged = function () {
					const inputElem = element[0].childNodes[0];

					if (inputElem.files[0]) {
						basicsReportingMainReportService.setSelectedReport(inputElem.files[0]);
						platformModalService.showDialog(scope.modalOptions);
						angular.element(inputElem).val('');
					}
				};
			}
		};
	}
})(angular);
