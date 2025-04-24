/**
 * Created by lcn on 3/5/2019.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonImportFileLookup',
		[
			'basicsCommonImportDataService', 'globals', '_',
			function (basicsCommonImportDataService, globals, _) {
				return {
					restrict: 'EA',
					templateUrl: globals.appBaseUrl + moduleName + '/partials/basics-common-import-file-dialog.html',
					link: function (scope, element) {
						scope.chooseFile = function () {
							angular.element('<input type="file">').attr('accept', '.XML')
								.bind('change', function (evt) {
									const file = evt.target.files[0];
									if (file) {
										const reader = new FileReader();
										reader.onload = function () {
											basicsCommonImportDataService.ImportFile(file).then(
												function (res) {
													basicsCommonImportDataService.analysisFileComplete.fire(res, file.name);
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