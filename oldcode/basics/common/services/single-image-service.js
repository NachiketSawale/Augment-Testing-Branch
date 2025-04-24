/**
 * Created by chi on 8/13/2015. Implemented by wuj.
 */
(function (angular) {
	'use strict';

	angular.module('basics.common').factory('basicsCommonSingleImageService',
		['$translate', '$http', 'platformGridAPI', 'platformModalService', 'basicsCommonUtilities', 'PlatformMessenger', 'globals', '_',
			function ($translate, $http, platformGridAPI, platformModalService, basicsCommonUtilities, PlatformMessenger, globals, _) {

				function ImageService() {
					const self = this;
					self.CreateService = function CreateService(serviceOptions) {
						let service = {},
							parentService = serviceOptions.parentService,
							blobField = serviceOptions.blobField || 'Blob',
							blobFkField = serviceOptions.blobFkField || 'BasBlobsFk',
							mainItem,
							isMap = serviceOptions.isMap; // the selected item isn't qto formula

						service.onBlobChanged = new PlatformMessenger();

						if (parentService) {
							mainItem = isMap ? parentService.getQtoFormula() : parentService.getSelected();
						}

						const getBlobById = function (id) {
							return $http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + id);
						};

						service.loadImage = function () {
							if (_.isEmpty(mainItem)) {
								return;
							}
							if (!mainItem[blobField] && mainItem[blobFkField] > 0) {
								getBlobById(mainItem[blobFkField]).then(function success(response) {
									mainItem[blobField] = response.data;
									if (!isMap) {
										service.onBlobChanged.fire('load', response.data);
									} else {
										service.onBlobChanged.fire('loadImageAndText', mainItem);
									}
								});
							} else {
								if (!isMap) {
									service.onBlobChanged.fire('load', mainItem[blobField]);
								} else {
									service.onBlobChanged.fire('loadImageAndText', mainItem);
								}
							}
						};

						service.deleteImage = function () {
							if (!mainItem || !mainItem.Id) {
								return;
							}

							const modalOptions = {
								headerText: $translate.instant('basics.common.questionDeleteImageHeaderText'),
								bodyText: $translate.instant('basics.common.questionDeleteImageBodyText'),
								showCancelButton: true,
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-question'
							};

							// show message box to confirm.
							platformModalService.showDialog(modalOptions).then(function (result) {
								if (!result || result.no) {
									return;
								}

								mainItem[blobFkField] = null;
								service.onBlobChanged.fire('delete');
								parentService.markCurrentItemAsModified();
							});
						};

						const generateFileElement = function () {
							return angular.element('<input type="file" accept="image/*" />');
						};

						const createBlob = function () {
							return $http.post(globals.webApiBaseUrl + 'cloud/common/blob/create');
						};

						const showImageDialog = function () {
							const fileElement = generateFileElement();
							fileElement.bind('change', changeImage);
							fileElement.click();

							function changeImage(e) {
								let reader = null;
								if (e.target.files.length > 0 && /image/.test(e.target.files[0].type)) {
									reader = new FileReader();
									if (mainItem[blobFkField]) {
										reader.onload = function () {
											mainItem[blobField].Content = basicsCommonUtilities.toBlob(reader.result);
											service.onBlobChanged.fire('modify', mainItem[blobField]);
											parentService.markCurrentItemAsModified();
										};
									} else {
										reader.onload = function () {
											createBlob().then(function (response) {
												const newItem = response.data;
												newItem.Content = basicsCommonUtilities.toBlob(reader.result);
												mainItem[blobField] = newItem;
												mainItem[blobFkField] = newItem.Id;
												service.onBlobChanged.fire('add', newItem);
												parentService.markCurrentItemAsModified();
											});
										};
									}
									reader.readAsDataURL(e.target.files[0]);
								}
								fileElement.unbind('change', changeImage);
							}
						};

						service.changeImage = function () {
							if (!mainItem || !mainItem.Id) {
								return;
							}

							showImageDialog();
						};

						const onMainItemChanged = function () {
							mainItem = isMap ? parentService.getQtoFormula() : parentService.getSelected();
							if (!mainItem || !mainItem.Id) {
								service.onBlobChanged.fire('delete', mainItem);
								return;
							}
							service.loadImage();
						};

						parentService.registerSelectionChanged(onMainItemChanged);

						// change the formula in qto detail
						if (isMap) {
							platformGridAPI.events.register(parentService.getGridId(), 'onCellChange', onCellChange);
						}

						function onCellChange(e, arg) {
							const currentItem = arg.item;
							const colId = arg.grid.getColumns()[arg.cell].id;
							if (colId === 'qtoformulafk') {
								onMainItemChanged();
							}
						}

						service.registerBlobChanged = function registerBlobChanged(callBackFn) {
							service.onBlobChanged.register(callBackFn);
						};

						service.unRegisterBlobChanged = function unRegisterBlobChanged(callBackFn) {
							service.onBlobChanged.unregister(callBackFn);
						};
						return service;
					};
				}

				return new ImageService();

			}]);

})(angular);
