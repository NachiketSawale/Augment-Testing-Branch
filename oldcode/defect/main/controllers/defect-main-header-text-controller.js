// / <reference path="../_references.js" />
/* global , globals */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name defectMainHeaderTextController
	 * @require $scope, $translate, $filter, platformGridControllerBase, messengerService, procurementCommonHeaderTextDataService, procurementCommonHeaderTextDataService, moduleMessenger, procurementCommonHeaderTextColumns, lookupDataService, slickGridEditors, procurementCommonHeaderTextValidationService
	 * @description controller for header text
	 */
	var moduleName = 'defect.main';
	angular.module(moduleName).controller('defectMainHeaderTextController',
		['$scope', '$sce', 'procurementContextService', 'defectMainHeaderDataService', '$timeout', '$http',

			function ($scope, $sce, moduleContext, defectMainHeaderDataService, $timeout, $http) {
				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.ContentString = null;
				$scope.PlainText = null;
				$scope.textareaEditable = false;
				$scope.rt$readonly= true;

				$scope.headerTextBlur = function () {

				};

				$scope.$watch('ContentString', function (newVal) {
					if (newVal) {
						$timeout(function () {
							var headerEntity = defectMainHeaderDataService.getSelected();
							headerEntity.BlobContent = newVal;
							defectMainHeaderDataService.markCurrentItemAsModified();
						}, 500);
					}
				});

				$scope.$watch('PlainText', function (newVal) {
					if (newVal) {
						var item = defectMainHeaderDataService.getSelected();
						item.Detail = newVal;
						defectMainHeaderDataService.markCurrentItemAsModified();
					}
				});

				var selectedChanged = function selectedChanged(e, item) {
					if (!item) {
						$scope.ContentString = null;
						$scope.PlainText = null;
						return;
					}

					$scope.PlainText = item.Detail;

					var readonlyStatus = defectMainHeaderDataService.getModuleState(item);
					$scope.textareaEditable= !readonlyStatus;
					$scope.rt$readonly= readonlyStatus;

					var basBlobsDetailFk = item.BasBlobsDetailFk;
					if (!item.BlobContent) {
						if (basBlobsDetailFk) {
							$http.get(globals.webApiBaseUrl + 'defect/main/header/getblob?blobId=' + basBlobsDetailFk).then(function (result) {
								$scope.ContentString = result.data;
								item.BlobContent = result.data;
							});
						} else {
							$scope.ContentString = null;
						}
					} else {
						$scope.ContentString = item.BlobContent;
					}


					// refresh after header text selection changed.
					$timeout(function () {
						$scope.$apply();
					}, 0);
				};
				selectedChanged(null, defectMainHeaderDataService.getSelected());

				$scope.dirty = function dirty() {
					defectMainHeaderDataService.markCurrentItemAsModified();
				};

				$scope.textEditorOptions = {
					options: {
						subtype: 'remark'
					},
					validationMethod: function (/* model, value */) {
					},
					actAsCellEditor: false
				};

				defectMainHeaderDataService.registerSelectionChanged(selectedChanged);

				$scope.$on('$destroy', function () {
					defectMainHeaderDataService.unregisterSelectionChanged(selectedChanged);
				});
			}
		]);
})(angular);