/**
 * @description: Business partner photo controller base.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('basicsCommonPhotoControllerBase',
		['$q', '$timeout', '$injector', 'basicsCommonUtilities', 'platformObjectHelper', '_', function ($q, $timeout, $injector, basicsCommonUtilities, platformObjectHelper, _) {
			return function ($scope, itemService, options) {

				const ParentStatusIsReadonly = function () {
					// if parent satus is readonly, then the form data should not be editable
					const parentService = itemService.parentService();
					if (parentService) {
						const parentSelectItem = parentService.getSelected();
						if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined)
							return parentSelectItem.IsReadonlyStatus;
						else if (parentService.getItemStatus !== undefined) {
							const status = parentService.getItemStatus();
							return status.IsReadonly;
						} else {
							const name = parentService.getModule().name;
							if (name === 'businesspartner.main') {
								const businesspartnerStatusRightService = $injector.get('businesspartnerStatusRightService');
								return businesspartnerStatusRightService.isBpStatusReadOnly();
							}
						}
					}
					return false;
				};
				$scope.options = angular.extend($scope.options || {}, {imageField: 'Blob.Content'}, options || {});

				$scope.controlOptions = {
					model: 'CommentText',
					actAsCellEditor: false,
					validationMethod: function (model, value) {
						if (angular.isString(value) && value.length > 255) {
							return false;
						}
						itemService.markItemAsModified(itemService.getSelected());
						return true;
					}
				};

				$scope.getImage = function (item) {
					return item ? basicsCommonUtilities.toImage(platformObjectHelper.getValue(item, $scope.options.imageField)) : '';
				};

				$scope.$currentItem = function () {
					itemService.setSelected(_.find(itemService.getList(), {isActive: true}) || {});
				};
				$scope.valueChanged = function () {
					itemService.markItemAsModified(itemService.getSelected());
				};

				$scope.setReadonly = function () {
					return ParentStatusIsReadonly();
				};

				$scope.createItemOrigin = createItem;
				$scope.deleteItemOrigin = deleteItem;

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
							fn: function() {
								$scope.options.createItem ? $scope.options.createItem($scope) : createItem();
							},
							disabled: function () {
								if ($scope.options.isSingle) {
									return !(itemService.canCreate() && itemService.getList().length < 1 && !ParentStatusIsReadonly());
								} else {
									return !(itemService.canCreate() && !ParentStatusIsReadonly());
								}
							}
						},
						{
							id: 't3',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: function() {
								$scope.options.deleteItem ? $scope.options.deleteItem($scope) : deleteItem();
							},
							disabled: function () {
								return !(itemService.getList().length && !ParentStatusIsReadonly());
							}
						},
						{
							id: 't2',
							caption: 'cloud.common.toolbarChangePicture',
							type: 'item',
							iconClass: 'tlb-icons ico-pic-change',
							fn: changeItem,
							disabled: function () {
								return !(itemService.getList().length && !ParentStatusIsReadonly());
							}
						}
					]
				};
				if ($scope.options.hideChangeItem) {
					_.remove($scope.tools.items, {id:'t2'});
				}

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
					openImageFileDialog().then(function (data) {
						itemService.getSelected().isActive = false;
						itemService.createItem().then(function () {
							itemService.getSelected().isActive = true;
							platformObjectHelper.setValue(itemService.getSelected(), $scope.options.imageField, basicsCommonUtilities.toBlob(data));
						});
					});
				}

				function deleteItem() {
					itemService.deleteItem(itemService.getSelected());
				}

				function changeItem() {
					openImageFileDialog().then(function (data) {
						platformObjectHelper.setValue(itemService.getSelected(), $scope.options.imageField, basicsCommonUtilities.toBlob(data));
						itemService.markItemAsModified(itemService.getSelected());
					});
				}

				function openImageFileDialog() {
					const deferred = $q.defer();
					const fileElement = angular.element('<input type="file" accept="image/*" />');
					fileElement.bind('change', addImage);
					fileElement.click();
					return deferred.promise;

					function addImage(e) {
						var selectedFile = e.target.files[0];
						if (e.target.files.length > 0 && /image/.test(selectedFile.type)) {
							const reader = new FileReader();
							reader.onload = function () {
								deferred.resolve(reader.result);
							};
							reader.readAsDataURL(selectedFile);

							$scope.fileName = selectedFile.name;
							$scope.fileType = selectedFile.type;
						}
						fileElement.unbind('change', addImage);
					}
				}

			};
		}]);

})(angular);