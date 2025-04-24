/**
 * Created by alm on 25/09/2019.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).controller('basicsCommonUserFormController', [
		'_',
		'globals',
		'$',
		'$http',
		'$scope',
		'$rootScope',
		'$injector',
		'$timeout',
		'basicsUserformCommonService',
		'userFormOpenMethod',
		function (
			_,
			globals,
			$,
			$http,
			$scope,
			$rootScope,
			$injector,
			$timeout,
			basicsUserformCommonService,
			userFormOpenMethod) {

			const uuid = $scope.getContentValue('uuid');
			const parentServiceName = $scope.getContentValue('parentService');
			const parentService = $injector.get(parentServiceName);
			const configServiceName = $scope.getContentValue('configService');
			const configService = _.extend({
				isEditable: function () {
					return true;
				},
				onControllerCreating: function () {

				},
				onControllerDestroyed: function () {

				}
			}, configServiceName ? $injector.get(configServiceName) : null);
			const userFormHelperServiceName = $scope.getContentValue('userFormHelperServiceName');
			const userFormHelper = userFormHelperServiceName ? $injector.get(userFormHelperServiceName) : basicsUserformCommonService.createNewInstance();

			let timeoutPromise = null;

			$scope.hasForm = false;
			$scope.uuid = 'customform_' + uuid;
			$scope.containeruuid = 'container_' + uuid;
			$scope.userFormLoading = false;
			userformLoadByInstance();

			const toolbarItems = [{
				id: 't1',
				sort: 0,
				caption: 'basics.common.fullScreen',
				type: 'item',
				iconClass: 'tlb-icons ico-maximized',
				fn: function () {
					const userformContent = document.getElementById($scope.containeruuid);
					if (userformContent.RequestFullScreen) {
						userformContent.RequestFullScreen();
					} else if (userformContent.webkitRequestFullScreen) {
						userformContent.webkitRequestFullScreen();
					} else if (userformContent.mozRequestFullScreen) {
						userformContent.mozRequestFullScreen();
					} else if (userformContent.msRequestFullScreen) {
						userformContent.msRequestFullScreen();
					}
				}
			}];

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems
			});

			parentService.registerSelectionChanged(userformLoadByInstance);

			function userformLoadByInstance() {
				const instanceEntity = parentService.getSelected();
				if (null === instanceEntity) {
					$scope.hasForm = false;
					$scope.userFormLoading = false;
					return false;
				}
				if (null === instanceEntity.FormDataFk && null === instanceEntity.FormId) {
					$scope.hasForm = false;
					$scope.userFormLoading = false;
					$('#customform_' + uuid).attr('src', '');
					return false;
				}

				if (null !== instanceEntity.FormId || null !== instanceEntity.FormDataFk) {

					$timeout.cancel(timeoutPromise);
					timeoutPromise = $timeout(function timeoutCallback() {
						$scope.hasForm = true;
						$scope.userFormLoading = true;
						const options = {
							formId: instanceEntity.FormId,
							formDataId: instanceEntity.FormDataFk,
							editable: configService.isEditable(),
							contextId: instanceEntity.Id,
							openMethod: userFormOpenMethod.Container,
							iframe: $('#customform_' + uuid).get(0)
						};
						options.iframe.contextId = instanceEntity.Id;
						if (null !== options.formDataId) {
							$http.get(globals.webApiBaseUrl + 'basics/userform/data/getFromDataById?id=' + options.formDataId).then(function formQueryCallback(result) {
								options.formId = result.data.FormFk;
								userFormHelper.showData(options);
							});
						} else {
							userFormHelper.showData(options);
						}

						$timeout.cancel(timeoutPromise);
					}, 100);

				}
			}

			let tempUserFormOption = null;

			function onUpdateRequested() {
				const selectItem = parentService.getSelected();
				if (null === selectItem) {
					return false;
				}
				const state = userFormHelper.getFormSaveState();
				if (state.origin !== 'USER_FROM') {
					const frm = $('#customform_' + uuid).get(0);
					if (frm && frm.contentWindow && (selectItem.FormId || selectItem.FormDataFk) && frm.contextId === selectItem.Id) {
						const oldFormData = frm.contentWindow.initFormData;
						const newFormData = getFormData();
						if (oldFormData && newFormData) {
							const arrDif = !_.isEqual(oldFormData, newFormData);
							const option = userFormHelper.getOption();
							if (arrDif && option.contextId === selectItem.Id) {
								if (!_.isNil(selectItem.FormDataFk)) {
									if (_.isNil(option.formDataId)) {
										option.formDataId = selectItem.FormDataFk;
									}
									userFormHelper.saveFormData(newFormData);
								} else {
									const formOption = angular.copy(option);
									formOption.UserFormData = newFormData;
									tempUserFormOption = formOption;
								}
							}
						}
					}
				}
			}

			parentService.registerUpdateDataExtensionEvent(onUpdateRequested);

			function getFormData() {
				const formData = [];
				const $customFormWithUuid = $('#customform_' + uuid);
				const frm = $customFormWithUuid.get(0);
				if (frm && frm.contentWindow) {
					const fromDoc = $customFormWithUuid[0].contentWindow.document;
					const formDom = fromDoc.forms[0];
					if (formDom) {
						for (let i = 0; i < fromDoc.forms[0].elements.length; i++) {
							let val = null;
							switch (fromDoc.forms[0].elements[i].type) {
								case 'checkbox':
									val = !!fromDoc.forms[0].elements[i].checked;
									break;
								case 'radio':
									if (fromDoc.forms[0].elements[i].checked) {
										val = fromDoc.forms[0].elements[i].value;
									}
									break;
								case 'select':
									val = fromDoc.forms[0].elements[i].options[fromDoc.forms[0].elements[i].selectedIndex].value;
									break;
								case 'button' :
									break;
								default:
									val = fromDoc.forms[0].elements[i].value;
							}
							if (val !== null) {
								const newFormData = {name: fromDoc.forms[0].elements[i].name, value: val};
								const paramcode = 'paramcode';
								if (fromDoc.forms[0].elements[i].attributes[paramcode]) {
									fromDoc.paramCode = document.forms[0].elements[i].attributes[paramcode].value;
								}
								const columnname = 'columnname';
								if (fromDoc.forms[0].elements[i].attributes[columnname]) {
									newFormData.columnName = document.forms[0].elements[i].attributes[columnname].value;
								}
								formData.push(newFormData);
							}
						}
					}
				}
				return formData;
			}

			function onFormDataSaved(formDateId, args) {
				const frm = $('#customform_' + uuid).get(0);
				const formOption = userFormHelper.getOption();
				if (frm && frm.contentWindow && formOption && frm.contextId === formOption.contextId) {
					const frmWin = frm.contentWindow;
					frmWin.initFormData = args.formData;
				}
			}

			function onFormTemplateStatus(status) {
				if ('FormLoadFinish' === status) {
					$scope.userFormLoading = false;
					const currentItem = parentService.getSelected();
					const frm = $('#customform_' + uuid).get(0);
					if (frm && frm.contentWindow && currentItem && frm.contextId === currentItem.Id) {
						const frmWin = frm.contentWindow;
						frmWin.initFormData = getFormData();
					}
				} else if ('Saving' === status) {
					$scope.userFormLoading = true;
				} else if ('NoFormFound' === status) {
					$scope.userFormLoading = false;
					$scope.hasForm = false;
				} else {
					$scope.userFormLoading = false;
				}
			}

			userFormHelper.formDataSaved.register(onFormDataSaved);

			userFormHelper.formTemplateStatus.register(onFormTemplateStatus);

			const unRegisterUpdateDoneFn = $rootScope.$on('updateDone', function onUpdateDone() {
				const state = userFormHelper.getFormSaveState();
				const currentItem = parentService.getSelected();
				if (state.origin !== 'USER_FROM') {
					if (tempUserFormOption) {
						const formOption = angular.copy(tempUserFormOption);
						userFormHelper.saveFormData(tempUserFormOption.UserFormData, tempUserFormOption).then(function (response) {
							if (response) {
								const formDataId = response.FormDataId;
								const needUpdateItemId = formOption.contextId;
								const list = parentService.getList();
								const needUpdateItem = (needUpdateItemId === currentItem.Id) ? currentItem : _.find(list, function (item) {
									return item.Id === needUpdateItemId;
								});
								if (needUpdateItem && _.isNil(needUpdateItem.FormDataFk)) {
									if (_.isNil(formOption.formDataId) && formOption.contextId === needUpdateItemId) {
										formOption.formDataId = formDataId;
									}
									needUpdateItem.FormDataFk = formDataId;
									parentService.fireItemModified(needUpdateItem);
									parentService.markItemAsModified(needUpdateItem);
									parentService.update();
								}
							}
						});
						tempUserFormOption = null;
					}
				} else if (state.origin === 'USER_FROM' && state.originType === 'CONTAINER') {
					const userformOption = userFormHelper.getOption();
					const frm = $('#customform_' + uuid).get(0);
					if (currentItem.Id === userformOption.contextId && frm && frm.contextId === currentItem.Id) {
						$scope.userFormLoading = false;
					}
				} else {
					if (state.originType === 'POPUP_WIN') {
						userformLoadByInstance();
					}
				}
				userFormHelper.setFormSaveState(null);
			});

			configService.onControllerCreating($scope);

			$scope.$on('$destroy', function onDestroy() {
				unRegisterUpdateDoneFn();
				parentService.unregisterUpdateDataExtensionEvent(onUpdateRequested);
				userFormHelper.formDataSaved.unregister(onFormDataSaved);
				parentService.unregisterSelectionChanged(userformLoadByInstance);
				configService.onControllerDestroyed($scope);
				userFormHelper.formTemplateStatus.unregister(onFormTemplateStatus);

			});

		}]);

})(angular);
