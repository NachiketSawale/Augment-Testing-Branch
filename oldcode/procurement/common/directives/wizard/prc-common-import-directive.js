/**
 * Created by lcn on 1/15/2019.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('commonImportFileLookup',
		[
			'procurementCommonImportMaterialService',
			function (procurementCommonImportMaterialService) {
				return {
					restrict: 'EA',
					templateUrl: globals.appBaseUrl + moduleName + '/partials/prc-common-import-file-dialog.html',
					link: function (scope, element) {
						scope.chooseFile = function () {
							angular.element('<input type="file">').attr('accept', '.D94')
								.bind('change', function (evt) {
									var file = evt.target.files[0];
									if (file) {
										var reader = new FileReader();
										reader.onload = function () {
											procurementCommonImportMaterialService.ImportFile(file).then(
												function (res) {
													procurementCommonImportMaterialService.analysisFileComplete.fire(res,file.name);
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