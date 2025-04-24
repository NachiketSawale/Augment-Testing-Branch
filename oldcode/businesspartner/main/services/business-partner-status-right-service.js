(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businesspartnerStatusRightService',
		['businesspartnerMainHeaderDataService', 'platformRuntimeDataService',
			/* jshint -W072 */
			function (businesspartnerMainHeaderDataService, platformRuntimeDataService) {
				let service = {};

				service.isBpStatusReadOnly = function (bpItem) {
					return isBpStatusReadOnly(bpItem || businesspartnerMainHeaderDataService.getSelected());
				};

				service.overwriteButtonsHandler = function (type, dataService, buttons) {
					if (type === 'photo') {
						overwritePhotoButtonsHandler(dataService, buttons);
					} else if (type === 'common') {
						overwriteCommonButtonsHandler(dataService, buttons);
					}
				};

				service.IsListDataWithEditRight = function (serviceOptions) {
					let item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {
						let isReadOnly = isBpStatusReadOnly(item);
						if (isReadOnly === true) {
							service.setListDataReadonly(serviceOptions.readData, true);
						}

						disableButtons(serviceOptions, isReadOnly);
					}
				};

				service.IsTreeDataWithEditRight = function (serviceOptions) {
					let item = businesspartnerMainHeaderDataService.getSelected();
					if (item) {
						let isReadOnly = isBpStatusReadOnly(item);
						if (isReadOnly === true) {
							service.setTreeDataReadonly(serviceOptions.readData, true);
						}

						disableButtons(serviceOptions, isReadOnly);
					}
				};

				function disableButtons(serviceOptions, flag) {
					if (serviceOptions?.buttons) {
						for (let i in serviceOptions.buttons) {
							if (serviceOptions.buttons[i] === 'create') {
								disableCreate(serviceOptions, flag);
							} else if (serviceOptions.buttons[i] === 'delete') {
								disableDelete(serviceOptions, flag);
							} else if (serviceOptions.buttons[i] === 'upload') {
								disableUploadFiles(serviceOptions, flag);
							} else if (serviceOptions.buttons[i] === 'multipleupload') {
								disableMultipleUploadFiles(serviceOptions, flag);
							} else if (serviceOptions.buttons[i] === 'download') {
								disableDownloadFiles(serviceOptions, flag);
							} else if (serviceOptions.buttons[i] === 'cancelUpload') {
								disableCancelUploadFiles(serviceOptions, flag);
							}
						}
					}
				}

				function disableCreate(serviceOptions, flag) {
					serviceOptions.dataService.canCreate = function () {
						if (serviceOptions.isRepeatGetBpStatus === true) {
							flag = isBpStatusReadOnly(null);
						}

						let isCan = !flag;
						if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canCreate) {
							isCan = serviceOptions.actions.canCreate();
						}
						return isCan;
					};
				}

				function disableDelete(serviceOptions, flag) {
					serviceOptions.dataService.canDelete = function () {
						if (serviceOptions.isRepeatGetBpStatus === true) {
							flag = isBpStatusReadOnly(null);
						}

						let isCan = false;
						let selectedItem = serviceOptions.dataService.getSelected();
						if (selectedItem !== null) {
							isCan = !flag;
							if (isCan === true && !!serviceOptions.actions && !!serviceOptions.actions.canDelete) {
								isCan = serviceOptions.actions.canDelete();
							}
							if (isCan === true && !!serviceOptions.actions && !!serviceOptions.actions.canDeleteCallBackFunc) {
								isCan = serviceOptions.actions.canDeleteCallBackFunc(selectedItem);
							}
						}

						return isCan;
					};
				}

				function disableUploadFiles(serviceOptions, flag) {
					serviceOptions.dataService.canUploadFiles = function () {
						if (serviceOptions.isRepeatGetBpStatus === true) {
							flag = isBpStatusReadOnly(null);
						}

						let isCan = !flag;
						if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canUploadFiles) {
							isCan = serviceOptions.actions.canUploadFiles();
						}
						return isCan;
					};
				}

				function disableMultipleUploadFiles(serviceOptions, flag) {
					serviceOptions.dataService.canMultipleUploadFiles = function () {
						if (serviceOptions.isRepeatGetBpStatus === true) {
							flag = isBpStatusReadOnly(null);
						}

						let isCan = !flag;
						if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canMultipleUploadFiles) {
							isCan = serviceOptions.actions.canMultipleUploadFiles();
						}
						return isCan;
					};
				}

				function disableDownloadFiles(serviceOptions, flag) {
					serviceOptions.dataService.canDownloadFiles = function () {
						if (serviceOptions.isRepeatGetBpStatus === true) {
							flag = isBpStatusReadOnly(null);
						}

						let isCan = !flag;
						if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canDownloadFiles) {
							isCan = serviceOptions.actions.canDownloadFiles();
						}
						return isCan;
					};
				}

				function disableCancelUploadFiles(serviceOptions, flag) {
					serviceOptions.dataService.canCancelUploadFiles = function () {
						if (serviceOptions.isRepeatGetBpStatus === true) {
							flag = isBpStatusReadOnly(null);
						}

						let isCan = !flag;
						if (isCan && !!serviceOptions.actions && !!serviceOptions.actions.canCancelUploadFiles) {
							isCan = serviceOptions.actions.canCancelUploadFiles();
						}
						return isCan;
					};
				}

				service.setListDataReadonly = function (items, status) {
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, status);
					});
				};

				service.setTreeDataReadonly = function (items, status) {
					_.forEach(items, function (item) {
						if (item.HasChildren === true) {
							service.setTreeDataReadonly(item.ChildItems, status);
						}
						platformRuntimeDataService.readonly(item, status);
					});
				};

				function isBpStatusReadOnly(bpItem) {
					let ret = false;
					if (bpItem === undefined || bpItem === null) {
						bpItem = businesspartnerMainHeaderDataService.getSelected();
					}

					if (bpItem) {
						const bpstatusFk = bpItem.BusinessPartnerStatusFk || bpItem.BpdStatusFk;
						let isEditName = businesspartnerMainHeaderDataService.isEditName(bpItem.BusinessPartnerStatusFk || bpItem.BpdStatusFk);
						if ((!isEditName) || !businesspartnerMainHeaderDataService.isBpStatusHasRight(bpItem, '', 'statusWithEidtRight', bpstatusFk)) {
							ret = true;
						}
					}
					return ret;
				}

				function overwritePhotoButtonsHandler(dataService, buttons) {
					_.forEach(buttons, function (item) {
						if (item.id === 't3') {
							item.disabled = function () {
								return !dataService.getList().length || !dataService.canDelete();
							};
						}

						if (item.id === 't2') {
							item.disabled = function () {
								return !dataService.getList().length || !dataService.canDelete();
							};
						}
					});
				}

				function overwriteCommonButtonsHandler(dataService, buttons) {
					_.forEach(buttons, function (item) {
						if (item.id === 'create') {
							item.disabled = function () {
								return !dataService.canCreate();
							};
						}

						if (item.id === 'delete') {
							item.disabled = function () {
								return !dataService.canDelete();
							};
						}
					});
				}

				return service;
			}]
	);
})(angular);