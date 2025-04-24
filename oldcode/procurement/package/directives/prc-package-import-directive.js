/**
 * Created by chk on 7/20/2016.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.package';

	angular.module(moduleName).directive('packageImportFileLookup',
		[
			'procurementPackageImportWizardService',
			function (procurementPackageImportWizardService) {
				return {
					restrict: 'EA',
					templateUrl: globals.appBaseUrl + moduleName + '/partials/procurement-package-import-file-dialog.html',
					link: function (scope, element) {
						scope.chooseFile = function () {
							angular.element('<input type="file">').attr('accept','.D93')
								.bind('change',function(evt){
									var file = evt.target.files[0];
									if(file){
										var reader = new FileReader();
										reader.onload = function(){
											procurementPackageImportWizardService.packageImportFile(file).then(
												function(res){
													if(_.isObject(res)){
														angular.extend(res,{FileName:file.name});
													}
													procurementPackageImportWizardService.analysisFileComplete.fire(res);
													element.find('#fileName').val(file.name);
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