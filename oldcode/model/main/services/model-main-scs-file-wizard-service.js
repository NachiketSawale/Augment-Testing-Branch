/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	/*global JSZip */
	'use strict';

	//noinspection JSAnnotator
	/**
	 * @ngdoc service
	 * @name model.main.modelMainScsWizardService
	 * @function
	 *
	 * @description Provides wizards for bulk-modifying model objects.
	 */
	angular.module('model.main').factory('modelMainScsWizardService', ['_', '$rootScope', '$log', '$http',
		'$translate', 'modelViewerModelSelectionService', '$injector', 'platformModalService',
		function (_, $rootScope, $log, $http, $translate,
		          modelViewerModelSelectionService, $injector, platformModalService) {
			var service = {};
			service.createScsFile = function createScsFile() {
				var model = modelViewerModelSelectionService.getSelectedModel();
				if (model && model.modelId) {

					var fileUpload = angular.element('<input type="file" />');
					if (fileUpload) {
						fileUpload.bind('change', function () {
							var file = fileUpload[0].files[0];

							if (file !== undefined) {
								$rootScope.$broadcast('asyncInProgress', true);
								var reader = new FileReader();
								reader.onload = function (e) {
									var contents = e.target.result;
									performance.mark('zipping-start');
									var zip = new JSZip();
									var newFile = file.name.replace('cpixml', 'zip');
									zip.file(file.name, contents);
									zip.generateAsync({type: 'blob', compression: 'DEFLATE'}).then(function (zipped) {
										performance.measure('zipping', 'zipping-start');
										var measure = _.last(performance.getEntriesByName('zipping'));
										$log.info('zipping: ' + measure.duration);

										$http({
											method: 'POST',
											url: globals.webApiBaseUrl + 'model/main/scs/createscsfile',
											headers: {'Content-Type': undefined},
											transformRequest: function (data) {
												var fd = new FormData();
												fd.append('fileName', angular.toJson(data.fileName));
												if (data.blob) {
													fd.append('blob', data.blob, data.name);
												}
												return fd;
											},
											data: {
												fileName: file.name,
												blob: zipped,
												name: newFile
											}
										}).then(
											function (success) {
												$rootScope.$broadcast('asyncInProgress', false);
												$log.log(success);
												// in success.data is the FileArchiveDocId
											},
											function (failure) {
												$rootScope.$broadcast('asyncInProgress', false);
												$log.log(failure);
											}
										);
									});
								};
								reader.readAsText(file);
							}
						}).bind('destroy', function () {
							fileUpload.unbind('change');
						});
						fileUpload.click();
					}
				} else {
					var modalOptions = {
						headerText: $translate.instant('model.main.createScsFileTitle'),
						bodyText: service.prepareMessageText('cloud.common.noCurrentSelection'),
						iconClass: 'ico-info'
					};

					platformModalService.showDialog(modalOptions);

				}
			};

			return service;
		}]);
})(angular);
