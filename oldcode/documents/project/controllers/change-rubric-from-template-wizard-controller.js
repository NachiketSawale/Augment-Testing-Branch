(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'documents.project';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('changeRubricFromTemplateWizardController',
		['$scope', '$http', '$translate',  'documentProjectHeaderValidationService', 'platformRuntimeDataService', 'platformModalService',  '_',
			'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupDescriptorService',
			function ($scope, $http, $translate, validationService, platformRuntimeDataService, platformModalService,  _, basicsLookupdataConfigGenerator,basicsLookupdataLookupDescriptorService) {

				$scope.options = $scope.$parent.modalOptions;
				var documentDataService = $scope.options.getDataService();
				var selectedDoc = documentDataService.getSelected();

				var oldRubricCategoryFk = selectedDoc.RubricCategoryFk;
				var oldDocCategoryFk = selectedDoc.PrjDocumentCategoryFk;
				var oldPrjDocumentTypeFk = selectedDoc.PrjDocumentTypeFk;

				// init current item.
				$scope.currentItem = {
					SelectedDocumentId: selectedDoc.Id || null,
					RubricCategoryFk: selectedDoc.RubricCategoryFk || null,
					PrjDocumentCategoryFk: selectedDoc.PrjDocumentCategoryFk || null,
					PrjDocumentTypeFk : selectedDoc.PrjDocumentTypeFk || null
				};
				$scope.options.headerText = $translate.instant('documents.project.changeRubricCategory');

				var formConfig = {
					'fid': 'documents.project.change.rubric',
					'version': '1.0.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'basicData',
							'header$tr$': 'documents.project.changeRubricCategory',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							gid: 'basicData',
							rid: 'rubricCat',
							model: 'RubricCategoryFk',
							sortOrder: 1,
							label: 'Rubric Category',
							label$tr$: 'documents.project.entityRubricCategory',
							type: 'directive',
							field:'RubricCategoryFk',
							directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								filterKey: 'documents-project-rubric-category-by-rubric-filter'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RubricCategoryByRubricAndCompany',
								displayMember: 'Description'
							},
							validator: validateRubricCategoryFk,
						},
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('documents.project.documentCategory', '',
							{
								gid: 'basicData',
								rid: 'rubricCat',
								label: 'Document Category',
								label$tr$: 'documents.project.entityPrjDocumentCategory',
								type: 'lookup',
								model: 'PrjDocumentCategoryFk',
								validator: validateDocumentCategoryFk,
								sortOrder: 2
							}, false, {
								field: 'PrjDocumentCategoryFk',
								filterKey: 'basics-document-category-type-filter',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}),
						{
							gid: 'basicData',
							rid: 'PrjDocumentTypeId',
							model: 'PrjDocumentTypeFk',
							sortOrder: 3,
							label: 'Project Document Type',
							label$tr$: 'documents.project.entityPrjDocumentType',
							type: 'directive',
							field:'PrjDocumentTypeFk',
							directive: 'project-document-type-lookup-service',
							options: {
								lookupDirective: 'project-document-type-lookup-service',
								descriptionMember: 'DescriptionInfo.Translated',
								filterKey: 'prj-document-project-type-filter'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectDocumentTypeLookup',
								displayMember: 'DescriptionInfo.Translated'
							},
							validator: validateDocumentTypeFk,
						}
					]
				};
				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.$on('$destroy', function () {

				});

				function validateRubricCategoryFk(item, value, model){
					var docStatuses = basicsLookupdataLookupDescriptorService.getData('documentstatus');
					var result1 = true;
					if (item.RubricCategoryFk !== value && value !== null) {
						var defaultStatus = _.find(docStatuses, function (o) {
							return o.RubricCategoryFk === value && o.IsDefault;
						});
						if (_.isNil(defaultStatus)) {
							platformModalService.showMsgBox('documents.project.rubricCategoryMissingDefautStatus', 'documents.project.FileUpload.validation.NoDefaultStatus', 'warning');
							result1 = false;
						}
					}
					validationService.validateRubricCategoryFkFromWizard(item, value, model).then(function (result2) {
						var validResult2 = true;
						if (result2.valid === undefined) {
							validResult2 = result2;
						} else {
							validResult2 = result2.valid;
						}
						$scope.isDisabled = isDisabledFn() || !result1 || !validResult2 || (item.RubricCategoryFk === oldRubricCategoryFk && item.PrjDocumentCategoryFk === oldDocCategoryFk) || item.PrjDocumentCategoryFk === null
							|| item.PrjDocumentTypeFk === null;
						clearValidation($scope);
					});
				}


				function validateDocumentCategoryFk(item, value){
					validationService.validateDocumentCategoryFkFromWizard(item, value).then(function (result2) {
						var validResult2 = true;
						if (result2.valid === undefined) {
							validResult2 = result2;
						} else {
							validResult2 = result2.valid;
						}
						$scope.isDisabled = isDisabledFn() || !validResult2 || (item.RubricCategoryFk === oldRubricCategoryFk && value === oldDocCategoryFk) || value === null || item.PrjDocumentTypeFk === null;
						clearValidation($scope);
					});
				}

				function validateDocumentTypeFk(item,value){
					$scope.isDisabled = isDisabledFn() || (item.RubricCategoryFk === oldRubricCategoryFk && item.PrjDocumentCategoryFk === oldDocCategoryFk && value === oldPrjDocumentTypeFk) || value === null;
					clearValidation($scope);
				}

				function isDisabledFn() {
					return documentCategoryFk === -1 || documentCategoryFk === null || documentCategoryFk === undefined ||
						prjDocumentTypeFk === -1 || prjDocumentTypeFk === null || prjDocumentTypeFk === undefined;

				}
				function updateValidation() {
					var result = validationService.asyncValidateRubricCategoryFk($scope.currentItem, $scope.currentItem.RubricCategoryFk, 'RubricCategoryFk');
					platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'RubricCategoryFk');

					return result === true;
				}
				function clearValidation($scope) {
					if(!$scope.isDisabled){
						validationService.cancelValidate($scope.currentItem);
					}
				}
				//updateValidation();
				var documentCategoryFk = $scope.currentItem.PrjDocumentCategoryFk;
				var rubricCategoryFk = $scope.currentItem.RubricCategoryFk;
				var prjDocumentTypeFk = $scope.currentItem.PrjDocumentTypeFk;
				$scope.isDisabled = isDisabledFn() || (rubricCategoryFk === oldRubricCategoryFk && documentCategoryFk === oldDocCategoryFk && prjDocumentTypeFk === oldPrjDocumentTypeFk);

				angular.extend($scope.options, {
					body: {
						okBtnText: 'okBtnText'
					},
					onOK: function () {

						var param = {
							DocumentId : $scope.currentItem.SelectedDocumentId,
							RubricCategoryFk : $scope.currentItem.RubricCategoryFk,
							DocumentCategoryFk : $scope.currentItem.PrjDocumentCategoryFk,
							PrjDocumentTypeFk : $scope.currentItem.PrjDocumentTypeFk
						};
						var config = {
							route: globals.webApiBaseUrl + 'documents/projectdocument/final/changeRubricCategory'
						};
						$http({method: 'post', url: config.route, data: param}).then(function (response) {
							if(response.data)
							{
								var refreshFn = documentDataService.refreshSelectedEntities ? documentDataService.refreshSelectedEntities : documentDataService.refresh;
								refreshFn();
							}else{
								platformModalService.showMsgBox(response,  'Info', 'ico-info');
							}

						});
						$scope.modalOptions.cancel();

					},
					onCancel: function () {
						$scope.modalOptions.cancel();
						$scope.currentItem.PrjDocumentCategoryFk = oldRubricCategoryFk;
						$scope.currentItem.RubricCategoryFk = oldDocCategoryFk;
						$scope.currentItem.PrjDocumentTypeFk = oldPrjDocumentTypeFk;
						validationService.cancelValidate($scope.currentItem);
					}
				});
			}]);
})(angular);
