(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.wic');

	/**
	 * @ngdoc boqWicOenImportService
	 * @name
	 * @function
	 * @description
	 */
	angularModule.factory('boqWicOenImportService', ['$http', '$translate', 'platformLongTextDialogService', 'boqWicCatBoqService', 
		function($http, $translate, platformLongTextDialogService, boqWicCatBoqService) {
			var service = {};

			service.importOenOnlb = function (wicGroupId) {
				var succeededImports = [];
				var warnigedImports = [];
				var failedImports = [];
				var fileElement = angular.element('<input type="file"/>');
				fileElement.attr('accept', '.onlb');
				fileElement.attr('multiple', '');
				fileElement.click();
				fileElement.change(function () {
					importOnlb(this.files, 0);
				});

				function importOnlb(files, index) {
					var fileReader;
					fileReader = new FileReader();
					fileReader.readAsDataURL(files[index]);
					fileReader.onload = function(e) {
						const request = {
							WicGroupId:  wicGroupId,
							FileName:    files[index].name,
							FileContent: {Content: e.target.result.split(',')[1]}
						};
						$http.post(globals.webApiBaseUrl + 'boq/wic/boq/importoenonlb', request).then(function(response) {
							if (response.data) {
								if (response.data.ErrorDescription) {
									failedImports.push(response.data.FileName + '\n' + response.data.ErrorDescription);
								}
								else {
									boqWicCatBoqService.addWicCatBoq(response.data.WicBoqComposite);
									if (_.some(response.data.Warnings)) {
										warnigedImports.push(response.data.FileName + '\n' + response.data.Warnings.join('\n'));
									}
									else {
										succeededImports.push(response.data.FileName);
									}
								}
							}

							if (++index < files.length) {
								importOnlb(files, index);
							}
							else {
								platformLongTextDialogService.showDialog({
									headerText$tr$: 'boq.main.oen.onlbImport',
									codeMode: true,
									hidePager: true,
									dataSource: new function () {
										var infoText = '';
										_.forEach(failedImports, function(failedImport) {
											infoText += $translate.instant('boq.main.importFailed') + '\n' + failedImport + '\n\n';
										});
										_.forEach(warnigedImports, function(waringedImport) {
											infoText += $translate.instant('boq.main.importSucceeded') + '\n' + waringedImport + '\n\n';
										});
										if (_.some(succeededImports)) {
											infoText += $translate.instant('boq.main.importSucceeded') + '\n' + succeededImports.join('\n') + '\n\n';
										}
										platformLongTextDialogService.LongTextDataSource.call(this);
										this.current = infoText;
									}
								});
							}
						});
					};
				}
			};

			return service;
		}
	]);
})();
