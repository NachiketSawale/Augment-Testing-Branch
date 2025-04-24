(function (angular) {
	'use strict';

	const moduleName = 'basics.userform';

	angular.module(moduleName).controller('basicsUserFormContainerController', [
		'globals',
		'$',
		'$scope',
		'$injector',
		'$http',
		'platformModuleStateService',
		'basicsUserformCommonService',
		'userFormOpenMethod',
		function (
			globals,
			$,
			$scope,
			$injector,
			$http,
			platformModuleStateService,
			basicsUserformCommonService,
			userFormOpenMethod) {
			var uuid = $scope.getContentValue('uuid');
			var rubricId = Number($scope.getContentValue('rubricId'));
			var formId = Number($scope.getContentValue('formId'));
			var moduleName = $scope.getContentValue('moduleInternalName');
			var rootService = platformModuleStateService.state(moduleName).rootService;
			var userFormPopupHelper = basicsUserformCommonService.createNewInstance();

			rootService.registerSelectedEntitiesChanged(onSelectedRootEntitiesChanged);

			function onSelectedRootEntitiesChanged(e, selectedEntities) {
				if (selectedEntities && selectedEntities.length > 0) {
					var contextId = selectedEntities[0].Id;
					loadUserForm(contextId);
				}
			}

			function initUserForm() {
				var rootEntity = rootService.getSelected();

				if (rootEntity) {
					loadUserForm(rootEntity.Id);
				}
			}

			function loadUserForm(contextId) {
				$scope.isLoading = true;

				prepareFormData(contextId).then(function (data) {
					var formOptions = {
						formId: data.FormFk,
						formDataId: data.Id,
						editable: true,
						setReadonly: false,
						modal: false,
						contextId: contextId,
						iframe: getContentIframe(),
						openMethod: userFormOpenMethod.Container
					};

					$scope.isLoading = false;
					userFormPopupHelper.showData(formOptions);
				});
			}

			function prepareFormData(contextId) {
				return $http.get(globals.webApiBaseUrl + 'basics/userform/prepareformdata?formId=' + formId + '&rubricId=' + rubricId + '&contextId=' + contextId).then(function (res) {
					return res.data;
				});
			}

			function getContentIframe() {
				return document.querySelector('#' + $scope.uuid);
			}

			$scope.uuid = 'user-form-' + uuid;
			$scope.isLoading = false;
			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'save',
						sort: 100,
						caption: 'cloud.common.toolbarSave',
						iconClass: 'tlb-icons ico-save',
						type: 'item',
						fn: function () {
							var iframe = getContentIframe();
							var doc = iframe.contentWindow.document;
							var saveBtn = doc.querySelector('button[name=\'SaveButton\']');

							if (saveBtn) {
								$(saveBtn).click();
							} else {
								var form = doc.querySelector('form');
								if (form) {
									var formData = userFormPopupHelper.collectFormData($(form));
									userFormPopupHelper.saveFormData(formData);
								} else {
									throw new Error('Saving form data failed');
								}
							}
						}
					}
				]
			});

			$scope.$on('$destroy', function () {
				rootService.unregisterSelectedEntitiesChanged(onSelectedRootEntitiesChanged);
			});

			initUserForm();
		}
	]);

})(angular);