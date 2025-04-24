(function (angular) {
	'use strict';

	function basicsWorkflowUserFormActionDirective(basicsWorkflowClientActionUtilService, $http, $timeout, basicsUserformCommonService) {

		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: 'basics.workflow/templates/user-form-action.html',
			compile: function compile() {
				return function postLink(scope, iElement, attrs, ngModelCtrl) {

					ngModelCtrl.$render = async function () {
						await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);

						//values from input parameters.
						var formId = basicsWorkflowClientActionUtilService.getFromInputParam('FormId', ngModelCtrl);
						var contextId = basicsWorkflowClientActionUtilService.getFromInputParam('ContextId', ngModelCtrl);
						var description = basicsWorkflowClientActionUtilService.getFromInputParam('Description', ngModelCtrl);
						var formDataId = basicsWorkflowClientActionUtilService.getFromInputParam('FormDataId', ngModelCtrl);

						//initialization the form template
						var templateUrl = globals.webApiBaseUrl + 'basics/userform/getformlink?formId=' + formId + '&formDataId=' + formDataId + '&contextId=' + contextId + '&editable=true';
						var jFrame = $('#wfUserForm');

						function createCompleteFormData() {
							var completeFormData = {};
							completeFormData.formId = formId;
							completeFormData.formDataId = formDataId;
							completeFormData.contextId = contextId;
							completeFormData.setReadonly = false;
							completeFormData.description = description || null;
							return completeFormData;
						}

						init(templateUrl, jFrame, createCompleteFormData());
					};

					function init(templateUrl, jFrame, completeFormData) {
						$http(
							{
								method: 'GET',
								url: templateUrl
							}).then(function (response) {

							//basicsUserformCommonService.syncUserFormData.register(function (formData) {});

							jFrame.attr('src', response.data);

							jFrame.on('load', function () {
								var height = $('#UserFormDiagModalBody')[0].attributes[2].value;
								height = height.replace('max-height:', '');
								height = height.replace(';', '');
								$(jFrame[0]).height(height);
								jFrame[0].contentWindow.saveCallbackFunction = winSaveCallback;
							});

							function winSaveCallback(formData) {
								saveFormData(formData).then(function (data) {
									scope.Context.FormDataId = data.FormDataId;
								});
							}

							function saveFormData(formDataDictionary) {
								basicsUserformCommonService.setOption(completeFormData);
								return basicsUserformCommonService.saveFormData(formDataDictionary).then(function (data) {
										return data;
									}
								);
							}
						});
					}
				};
			}
		};
	}

	basicsWorkflowUserFormActionDirective.$inject = ['basicsWorkflowClientActionUtilService', '$http', '$timeout', 'basicsUserformCommonService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowUserFormActionDirective', basicsWorkflowUserFormActionDirective);

})(angular);
