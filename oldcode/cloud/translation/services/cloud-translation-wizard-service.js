(function (angular) {
	'use strict';

	angular.module('cloud.translation').service('cloudTranslationWizardService', CloudTranslationWizardService);

	CloudTranslationWizardService.$inject = ['$http', '$translate', '_', 'platformDialogService', 'platformGridAPI', 'cloudTranslationImportExportService', 'globals', 'cloudDesktopModuleService', 'platformListSelectionDialogService'];

	function CloudTranslationWizardService($http, $translate, _, platformDialogService, platformGridAPI, cloudTranslationImportExportService, globals, cloudDesktopModuleService, listSelectionDialogService) {
		let service = {};

		service.setSessionUuid = setSessionUuid;
		service.clearSessionUuid = clearSessionUuid;
		service.exportToExcel = exportToExcel;
		service.importFromExcel = importFromExcel;
		service.showImportReportDialog = showImportReportDialog;
		service.showPreviewImportDialog = showPreviewImportDialog;
		service.showLanguageSelectionDialog = showLanguageSelectionDialog;
		service.showExportModuleDialog = showExportModuleDialog;

		let sessionUuid = {
			isSet: false,
			uuid: ''
		};

		function setSessionUuid(uuid){
			sessionUuid = {
				isSet: true,
				uuid: uuid
			};
		}

		function clearSessionUuid(){
			sessionUuid = {
				isSet: false,
				uuid: ''
			};
		}

		function exportToExcel() {
			cloudTranslationImportExportService.loadResourceCategories().then(function (){
				showExportDialog();
			});
		}

		function importFromExcel() {
			showImportFileChooseDialog();
		}

		function showExportDialog() {

			const exportDialogConfig = {
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-export-dialog.html',
				tree: false,
				idProperty: 'ID',
				headerText$tr$: 'cloud.translation.exportdlg.dialogTitle',
				isReadOnly: true,
				showOkButton: false,
				showCancelButton: true,
				resizeable: true,
				minWidth: '700px',
				minHeight: '700px',
				width: '700px',
				height: '700px',
				value: {
					buttonActive: false,
					defaultLanguage: $translate.instant('cloud.translation.exportdlg.defaultLanguage'),
					selectedLanguages: $translate.instant('cloud.translation.exportdlg.selectedLanguages'),
					downloadFile: $translate.instant('cloud.translation.exportdlg.downloadFile'),
					checkboxTitle: $translate.instant('cloud.translation.exportdlg.checkboxTitle'),
					successText: $translate.instant('cloud.translation.exportdlg.successText'),
					failedText: $translate.instant('cloud.translation.exportdlg.failedText'),
					checkboxItems: [],

					checkboxOptions: {
						flatDesign: false
					},
					untranslated: true,
					untranslatedTitle: $translate.instant('cloud.translation.exportdlg.untranslatedText'),
					exportChanged: false,
					newOrChangedTitle: $translate.instant('cloud.translation.exportdlg.newOrChangedTitle'),
					resourceRemarkAdded : true,
					addResourceRemarkTitle: $translate.instant('cloud.translation.exportdlg.addResourceRemark'),
					translationRemarkAdded : false,
					addPathTitle: $translate.instant('cloud.translation.exportdlg.addPath'),
					pathAdded : false,
					addParameterInfoTitle: $translate.instant('cloud.translation.exportdlg.addParameterInfo'),
					parameterInfoAdded : false,
					addTranslationRemarkTitle: $translate.instant('cloud.translation.exportdlg.addTranslationRemark'),
					exportByCategoryTitle: $translate.instant('cloud.translation.exportdlg.exportByCategory'),
					checkBoxCategories: [],
					categoryAdded: false,
					addCategoryTitle: $translate.instant('cloud.translation.exportdlg.addCategory')

				},
				buttons: [
					{
						id: 'export',
						caption: $translate.instant('cloud.translation.exportdlg.buttons.export'),
						disabled: function disabled(info) {
							return !info.value.buttonActive;
						}
					}
				]
			};
			return platformDialogService.showDialog(exportDialogConfig);
		}

		function showImportReportDialog(selectedCultures, resetIsChanged, uuid) {
			const previewDialogConfig = {
				headerText$tr$: 'cloud.translation.previewdlg.dialogTitleImport',
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-import-preview-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButtom: false,
				resizeable: true,
				width: '700px',
				height: '700px',
				minWidth: '700px',
				minHeight: '700px',
				value: {
					selectedCultures: selectedCultures,
					isPreview: false,
					checkboxItems: [],
					checkboxTitle: '',
					checkboxOptions: {
						flatDesign: false
					},
					infoList: [],
					fileInfoTitle: '',
					loading: true,
					languageselection: false,
					spinnermsg: $translate.instant('cloud.translation.previewdlg.importLoadingMsg'),
					resetChangedTitle: $translate.instant('cloud.translation.previewdlg.resetChangedTitle'),
					resetChanged: resetIsChanged,
					uuidImport : uuid
				},
				buttons: [],
				customButtons:[]
			};

			platformDialogService.showDialog(previewDialogConfig).then(function (/* response */) {
			}, function languageSelectionClosed() {
				cloudTranslationImportExportService.clearTempTable(uuid);
			});
		}

		function showPreviewImportDialog(selectedCultures, resetIsChanged, uuid) {
			const previewDialogConfig = {
				headerText$tr$: 'cloud.translation.previewdlg.dialogTitleImport',
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-import-preview-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButtom: false,
				resizeable: true,
				width: '700px',
				height: '700px',
				minWidth: '700px',
				minHeight: '700px',
				value: {
					selectedCultures: selectedCultures,
					isPreview: true,
					checkboxItems: [],
					checkboxTitle: '',
					checkboxOptions: {
						flatDesign: false
					},
					infoList: [],
					fileInfoTitle: '',
					loading: true,
					languageselection: false,
					spinnermsg: $translate.instant('cloud.translation.previewdlg.validationLoadingMsg'),
					resetChangedTitle: $translate.instant('cloud.translation.previewdlg.resetChangedTitle'),
					resetChanged: resetIsChanged,
					uuidImport : uuid
				},
				buttons: []
			};

			platformDialogService.showDialog(previewDialogConfig).then(function (/* response */) {
			}, function languageSelectionClosed() {
				cloudTranslationImportExportService.clearTempTable(uuid);
			});
		}

		function showLanguageSelectionDialog(selectedFile) {
			const languageSelectionDialogConfig = {
				headerText$tr$: 'cloud.translate.languageSelectionDlg.dialogTitle',
				headerText: 'Import Translation',
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-language-selection-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButton: false,
				resizeable: true,
				width: '700px',
				height: '700px',
				minWidth: '700px',
				minHeight: '700px',
				value: {
					selectedFile: selectedFile,
					checkboxItems: [],
					checkboxTitle: '',
					checkboxOptions: {
						flatDesign: false
					},
					infoList: [],
					fileInfoTitle: '',
					loading: true,
					languageselection: false,
					spinnermsg: $translate.instant('cloud.translation.languageSelectionDlg.spinnermsg'),
					defaultLanguage: $translate.instant('cloud.translation.languageSelectionDlg.defaultLanguage'),
					resetChangedTitle: $translate.instant('cloud.translation.previewdlg.resetChangedTitle'),
					resetChanged: false,
					uuidImport: ''
				},
				buttons: []
			};

			platformDialogService.showDialog(languageSelectionDialogConfig).then(function () {
			}, function languageSelectionClosed() {
				cloudTranslationImportExportService.clearTempTable(sessionUuid.uuid);
			});
		}

		function showImportFileChooseDialog() {
			const fileChooseDialogConfig = {
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-import-file-upload-dialog.html',
				tree: false,
				idProperty: 'ID',
				headerText$tr$: 'cloud.translation.languageSelectionDlg.dialogTitle',
				isReadOnly: true,
				showOkButton: false,
				showCancelButton: true,
				resizeable: true,
				minWidth: '700px',
				minHeight: '700px',
				width: '700px',
				height: '700px',
				value: {
					checkboxItems: [],
					checkboxTitle: '',
					checkboxOptions: {
						flatDesign: false
					},
					infoList: [],
					fileInfoTitle: '',
					introText: $translate.instant('cloud.translation.fileImportdllg.step1Info'),
					spinnermsg: $translate.instant('cloud.translation.fileImportdllg.spinnermsg')
				},
				buttons: [
					{
						id: 'upload',
						caption: $translate.instant('cloud.translation.fileImportdllg.buttons.upload')
					}
				]
			};
			platformDialogService.showDialog(fileChooseDialogConfig);
		}

		function showExportModuleDialog(){
			const nameMember = 'displayName';
			const idMember = 'id';
			let selectedModules = [];

			cloudDesktopModuleService.getModules(true, false).then(function (modules){
				let config = {
					dialogTitle$tr$: 'cloud.translation.exportModuleDlg.dialogTitle',
					availableTitle$tr$: 'cloud.translation.exportModuleDlg.availableModules',
					selectedTitle$tr$: 'cloud.translation.exportModuleDlg.selectedModules',
					showIndicator: false,
					idProperty: idMember,
					displayNameProperty: nameMember,
					allItems: _.sortBy(modules, ['id']),
					value: selectedModules,
					acceptSelection: function (selected){
						return selected.length > 0;
					}
				};

				listSelectionDialogService.showDialog(config).then(function (ok){

					if(ok.success){
						const exportModuleDialogConfig = {
							headerText$tr$: 'cloud.translate.exportModuleDlg.dialogTitle',
							headerText: 'Export Module Test',
							bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-export-module-dialog.html',
							showCancelButton: false,
							showNoButton: false,
							showOkButton: true,
							resizeable: true,
							width: '700px',
							height: '700px',
							minWidth: '700px',
							minHeight: '700px',
							value: {
								selectedModules: ok.value
							}
						};

						platformDialogService.showDialog(exportModuleDialogConfig);
					}

				});
			});
		}

		return service;
	}
})(angular);
