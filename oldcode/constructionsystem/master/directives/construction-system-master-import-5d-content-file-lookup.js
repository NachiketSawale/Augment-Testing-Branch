/* global globals,_ */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterImportContentFileLookup',
		[
			'constructionSystemMasterImport5DContentService',
			function (constructionSystemMasterImport5DContentService) {
				return {
					restrict: 'EA',
					templateUrl: globals.appBaseUrl + moduleName + '/partials/import-5d-content-file-dialog.html',
					link: function (scope, element) {
						scope.chooseFile = function () {
							angular.element('<input type="file">').attr('accept', '.xml')
								.bind('change', function (evt) {
									var file = evt.target.files[0];
									if (file) {
										var reader = new FileReader();
										reader.onload = function () {
											constructionSystemMasterImport5DContentService.ImportFile(file).then(
												function (res) {
													constructionSystemMasterImport5DContentService.analysisFileComplete.fire(res,file.name);
													if (!_.isString(res)) {
														element.find('#fileName').val(file.name);
													} else {
														element.find('#fileName').val('');
													}
												}
											);
										};
										reader.readAsText(file);
									}
								}).click();
						};

					}
				};
			}]);

})(angular);