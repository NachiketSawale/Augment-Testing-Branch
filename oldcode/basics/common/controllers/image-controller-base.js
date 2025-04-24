/**
 * Created by pel on 8/14/2018.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('basicsCommonImageControllerBase',
		['$http', '$q', '$timeout', '$injector', 'basicsCommonUtilities', 'platformObjectHelper', 'basicsCommonFileUploadServiceLocator', 'globals', '_', function ($http, $q, $timeout, $injector, basicsCommonUtilities, platformObjectHelper, basicsCommonFileUploadServiceLocator, globals, _) {
			return function ($scope, itemService, options) {
				$scope.options = angular.extend($scope.options || {}, {imageField: 'Blob.Content'}, options || {});
				basicsCommonFileUploadServiceLocator.getService();
				$scope.controlOptions = {
					model: 'CommentText',
					actAsCellEditor: false,
					validationMethod: function () {
						itemService.markItemAsModified(itemService.getSelected());
						return true;
					}
				};

				$scope.getImage = function (item) {
					return item ? basicsCommonUtilities.toImage(platformObjectHelper.getValue(item, $scope.options.imageField)) : '';
				};

				$scope.setReadonly = function () {
					return ParentStatusIsReadonly();
				};

				$scope.$currentItem = function () {
					itemService.setSelected(_.find(itemService.getList(), {isActive: true}) || {});
				};
				$scope.valueChanged = function () {
					itemService.markItemAsModified(itemService.getSelected());
				};

				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't4',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: createItem,
							disabled: function () {
								if ($scope.options.isSingle) {
									return !(itemService.canCreate() && itemService.getList().length < 1) || ParentStatusIsReadonly();
								} else {
									return !itemService.canCreate() || ParentStatusIsReadonly();
								}
							}
						},
						{
							id: 't3',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: deleteItem,
							disabled: function () {
								return !itemService.getList().length || ParentStatusIsReadonly();
							}
						},
						{
							id: 't2',
							caption: 'cloud.common.toolbarChangePicture',
							type: 'item',
							iconClass: 'tlb-icons ico-pic-change',
							fn: changeItem,
							disabled: function () {
								return !itemService.getList().length || ParentStatusIsReadonly();
							}
						}
					]
				};

				const currentItemWatch = $scope.$watch('$currentItem()', function () {
				});
				itemService.registerListLoaded(listLoaded);
				itemService.registerSelectionChanged(selectionChanged);
				$scope.setTools($scope.tools);
				listLoaded();
				selectionChanged();
				$scope.$on('$destroy', function () {
					itemService.unregisterListLoaded(listLoaded);
					itemService.unregisterSelectionChanged(selectionChanged);
					currentItemWatch();
				});

				function selectionChanged() {
					$scope.currentItem = itemService.getSelected();
					angular.forEach(itemService.getList(), function (item) {
						item.isActive = $scope.currentItem === item;
					});
					$scope.tools.update();
					$timeout(function () {
						$scope.$apply();
					});
				}

				function listLoaded() {
					$scope.blobData = itemService.getList();
				}

				function createItem() {
					const accessFileTypes = '.bmp, .gif, .jpg, .jpeg, .png';
					itemService.uploadFiles(accessFileTypes, null).then(function (data) {
						if (/image/.test(data.fileType)) {
							itemService.getSelected().isActive = false;
							$http.get(globals.webApiBaseUrl + 'basics/common/document/getfilecontent?docId=' + data.FileArchiveDocId)
								.then(function (response) {
									if (response.data) {
										const blob = response.data;
										itemService.createItem().then(function () {
											const selectedItem = itemService.getSelected();
											selectedItem.isActive = true;
											selectedItem.FileArchiveDocFk = data.FileArchiveDocId;
											platformObjectHelper.setValue(selectedItem, $scope.options.imageField, blob);
										});
									}
								});
						}

					});
				}

				function deleteItem() {
					itemService.deleteItem(itemService.getSelected());
				}

				function changeItem() {
					const accessFileTypes = '.bmp, .gif, .jpg, .jpeg, .png';
					itemService.uploadFiles(accessFileTypes, null).then(function (data) {
						if (/image/.test(data.fileType)) {
							$http.get(globals.webApiBaseUrl + 'basics/common/document/getfilecontent?docId=' + data.FileArchiveDocId)
								.then(function (response) {
									if (response.data) {
										const blob = response.data;
										const selectedItem = itemService.getSelected();
										selectedItem.FileArchiveDocFk = data.FileArchiveDocId;
										platformObjectHelper.setValue(selectedItem, $scope.options.imageField, blob);
										itemService.markItemAsModified(selectedItem);
									}
								});
						}

					});

				}

				const ParentStatusIsReadonly = function () {
					// if parent status is readonly, then the form data should not be editable
					const parentService = itemService.parentService();
					if (parentService) {
						const parentSelectItem = parentService.getSelected();
						if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
							return true;
						}
					}
					return false;
				};

			};
		}]);

})(angular);
