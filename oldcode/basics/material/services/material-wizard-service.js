(function(angular) {
	'use strict';

	var moduleName = 'basics.material';

	/* jshint -W072 */
	angular.module(moduleName).factory('basicsMaterialWizardService', ['platformTranslateService',
		'platformSidebarWizardConfigService',
		'$translate',
		'$injector',
		'cloudDesktopSidebarService',
		'platformSidebarWizardCommonTasksService',
		'platformModalService',
		'$rootScope',
		'$http',
		'basicsMaterialRecordService',
		'$log',
		'documentsProjectDocumentModuleContext',
		'platformTranslateService',
		'basicsMaterialMaterialCatalogService',
		'basicsMaterialMaterialGroupsService',
		'basicsCommonAIService',
		'globals',
		'basicsCommonChangeStatusService',
		function(platformTranslateService,
			platformSidebarWizardConfigService,
			$translate,
			$injector,
			cloudDesktopSidebarService,
			platformSidebarWizardCommonTasksService,
			platformModalService,
			$rootScope,
			$http,
			basicsMaterialRecordService,
			$log,
			documentsProjectDocumentModuleContext,
			translateService,
			basicsMaterialMaterialCatalogService,
			basicsMaterialMaterialGroupsService,
			basicsCommonAIService,
			globals,
			basicsCommonChangeStatusService
		) {

			var service = {};

			var wizardID = 'basicsMaterialSidebarWizards';

			service.importMaterialRecords = function importMaterialRecords() {
				var selectedCatalog = basicsMaterialMaterialCatalogService.getSelected();
				if (!selectedCatalog || angular.isUndefined(selectedCatalog.Id)) {
					platformModalService.showErrorBox('basics.material.import.noCatalogError', 'basics.material.import.importd9xTitle'); // TODO chi: translation
					return;
				}

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'basics.material/templates/import-material-records.html',
					backdrop: false,
					moduleName: moduleName,
					materialCatalogId: selectedCatalog.Id,
					materialCatalogCode: selectedCatalog.Code
				}).then(function(isImported) {
					if (isImported) {
						basicsMaterialMaterialGroupsService.loadByMainItemId();
					}
				});
			};

			service.import3DModel = function() {
				var material = basicsMaterialRecordService.getSelected();

				if (!material) {
					platformModalService.showMsgBox('basics.material.warning.import3dModelWarningMsg', 'basics.material.warning.warningTitle');
					return;
				}

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'basics.material/templates/wizards/import-3d-model.html',
					controller: 'basicsMaterialImport3dModelController',
					backdrop: false
				}).then(function(response) {
					if (!response.isOK) {
						return;
					}

					if (!response.file) {
						return;
					}

					var file = response.file;
					var reader = new FileReader();

					$rootScope.$broadcast('asyncInProgress', true);

					reader.onload = function(e) {
						var contents = e.target.result;
						console.time('zipping');
						/* jshint -W117 */
						var zip = new JSZip();
						var newFile = file.name.replace('cpixml', 'zip');
						zip.file(file.name, contents);
						zip.generateAsync({
							type: 'blob',
							compression: 'DEFLATE'
						}).then(function(zipped) {
							console.timeEnd('zipping');
							$http({
								method: 'POST',
								url: globals.webApiBaseUrl + 'model/main/scs/createscsfile',
								headers: {
									'Content-Type': undefined
								},
								transformRequest: function(data) {
									var fd = new FormData();
									fd.append('fileName', angular.toJson(data.fileName));
									if (data.blob) {
										fd.append('blob', data.blob, data.name);
									}
									return fd;
								},
								data: {
									fileName: file.name,
									blob: zipped,
									name: newFile
								}
							}).then(
								function(success) {
									$log.log(success);
									// in success.data is the FileArchiveDocId
									material.ObsoleteUuid = material.Uuid;
									material.Uuid = success.data;
									basicsMaterialRecordService.markItemAsModified(material);
									basicsMaterialRecordService.update().finally(function() {
										$rootScope.$broadcast('asyncInProgress', false);
										$rootScope.$emit('selectedScsFileChanged', {
											uuid: material.Uuid,
											description: material.DescriptionInfo1 ? (material.DescriptionInfo1.Translated || '') : ''
										});
									});
								},
								function(failure) {
									$rootScope.$broadcast('asyncInProgress', false);
									$log.log(failure);
								}
							);
						});
					};

					reader.readAsText(file);
				});
			};

			service.getMaterialCatalogPriceVersions = function(materialCatalogSelectedItemId) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/materialcatalog/priceversion/list?mainItemId=' + materialCatalogSelectedItemId
				});
			};
			service.materialCatalogPriceVersions = [];


			service.forecastTemp = function() {
				translateService.registerModule(moduleName);
				var wzConfig = {
					title: 'Material Forecast',
					steps: [{
						id: 'basicSeting',
						title$tr$: 'one',
						disallowBack: false,
						disallowNext: false,
						canFinish: false
					},{
						id: 'criteriaSelection',
						title$tr$: 'two',
						topDescription$tr$: 'estimate.main.createMaterialPackageWizard.criteriaSelection',
						disallowBack: true,
						disallowNext: false,
						canFinish: false
					}],
					onChangeStep: function (info) {
						switch (info.step.id) {
							case 'assembleObjectsStep':
						}
					}
				};


				var obj = {
					selector: {},
					__selectorSettings: {}
				};

				var dlgConfig = {
					templateUrl: globals.appBaseUrl + 'Basics.Material/partials/forecast-container.html',
					resizeable: true,
					width:1000,
					height:800,
					value: {
						wizard: wzConfig,
						entity:obj,
						wizardName: 'wzdlg'
					}
				};
				var projectMainService = documentsProjectDocumentModuleContext.getConfig().parentService;
				var selectedProject = projectMainService.getSelected();
				if(selectedProject){
					platformModalService.showDialog(dlgConfig).then(function() {});
				}else{
					var modalOptions = {
						bodyText: $translate.instant('cloud.common.noCurrentSelection'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				}
			};
			service.delete3DModel = function() {
				var material = basicsMaterialRecordService.getSelected();

				if (!material) {
					platformModalService.showMsgBox('basics.material.warning.import3dModelWarningMsg', 'basics.material.warning.warningTitle');
					return;
				}

				if (!material.Uuid) {
					platformModalService.showMsgBox('basics.material.warning.delete3dModelWarningMsg', 'basics.material.warning.warningTitle');
					return;
				}

				$rootScope.$broadcast('asyncInProgress', true);
				material.ObsoleteUuid = material.Uuid;
				material.Uuid = null;
				basicsMaterialRecordService.markItemAsModified(material);
				basicsMaterialRecordService.update().finally(function() {
					$rootScope.$broadcast('asyncInProgress', false);
					$rootScope.$emit('selectedScsFileChanged', null);
				});
			};
			service.NeutralMaterialAiMapping= function NeutralMaterialAiMapping() {
				var params = {
					gridId:'2f5d48cf7c53422ea7a5da318c2c05e4',
					materialData:null
				};
				// getSelectedEntities works for multi-selection
				var materialcatalogs = basicsMaterialMaterialCatalogService.getSelectedEntities();
				var materialcatalog = basicsMaterialMaterialCatalogService.getSelected();
				// In case there is no high light rows in material catalog container
				if (!materialcatalog) {
					platformModalService.showMsgBox('basics.material.warning.SelectedMaterialCatalogWarningMsg',
						'basics.material.warning.warningTitle');
					return;
				}

				basicsCommonAIService.checkPermission('d71fbe22d0c74ae89f29b39b148fdc1b', true).then(function (canProceed) {
					if (!canProceed) {
						return;
					}

					var catalogIds = [];
					for(var i = 0; i < materialcatalogs.length; i++){
						catalogIds.push(materialcatalogs[i].Id);
					}
					// post the id groups to back end and get the result array.
					$http.post(globals.webApiBaseUrl +'basics/material/mtwoai/neutralmapping', catalogIds).then(function (response) {
						// in case the high light material catalog(s) does not contain any material record
						if(response.data.Main.length === 0){
							platformModalService.showMsgBox('basics.material.warning.NoMaterialsWarningMsg',
								'basics.material.warning.warningTitle');
							return;
						}
						if(response.data.MaterialRecord.length === 0){
							platformModalService.showMsgBox('basics.material.warning.noNeutralMaterialWarningMsg',
								'basics.material.warning.warningTitle');
							return;
						}
						params.materialData=response.data;

						var modalOptions = {
							templateUrl: globals.appBaseUrl + 'basics.material/templates/wizards/neutral-material-ai-mapping.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							headerTextKey: 'basics.characteristic.bulkEditorPopup',
							lazyInit: true,
							resizeable: true,
							width: '70%',
							height: '70%',
							params: params
						};
						// In case user forget to save the modified data,update the modified terms in material Record page
						// before showing the result dialog.
						basicsMaterialRecordService.updateAndExecute(function () {
							platformModalService.showDialog(modalOptions);
						});

					});
				});
			};

			var wizards = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				cssClass: 'sidebarWizard',
				items: [{
					id: 1,
					text: 'Import Material Wizard',
					text$tr$: 'basics.material.wizard.importMaterialWizard',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [{
						id: 1,
						text: 'Import Material Records',
						text$tr$: 'basics.material.wizard.importMaterialRecord',
						type: 'item',
						showItem: true,
						fn: service.importMaterialRecords
					}]
				}]
			};

			service.active = function activate() {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
			};

			service.deactive = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};

			// loads or updates translated strings
			var loadTranslations = function() {
				platformTranslateService.translateObject(wizards, ['text']);

			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('basics.material')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
			}

			service.updateMaterialPrices = function updateMaterialPrices() {
				$injector.get ('estimateMainService').setSelectedPrjEstHeader (null);
				var updateMaterialService = $injector.get('basicsMaterialUpdateMaterialPricesWizardService');
				updateMaterialService.initialModalOption();
			};

			function disableRecord() {
				return platformSidebarWizardCommonTasksService.provideDisableInstance(basicsMaterialRecordService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
					'basics.material.record.disableDone', 'basics.material.record.alreadyDisabled', 'code', 12);
			}

			function enableRecord() {
				return platformSidebarWizardCommonTasksService.provideEnableInstance(basicsMaterialRecordService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
					'basics.material.record.enableDone', 'basics.material.record.alreadyEnabled', 'code', 13);
			}

			function changeMaterialStatus()
			{
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						// projectField: 'ProjectFk',
						statusName: 'material',
						mainService: basicsMaterialRecordService,
						guid: 'A8C2353FCA6B48A88C9B25901B0A7528',
						statusField: 'MaterialStatusFk',
						// codeField: 'BusinessPartnerName1',
						// descField: 'BusinessPartnerName2',
						title: 'basics.material.changeStatus',
						updateUrl: 'basics/material/changestatus',
						id: 14,
						handleSuccess: function (result) {
							if (result.changed) {
								var oldEntity = basicsMaterialRecordService.getSelected();
								if (oldEntity) {
									result.entity.MaterialCatalogFk=oldEntity.MaterialCatalogFk;
									angular.extend(oldEntity, result.entity);
									basicsMaterialRecordService.isSetReadonly([oldEntity]);
									basicsMaterialRecordService.gridRefresh();
								}
							}
						}
					}
				);
			}

			service.createMaterialFromTemplate= function createMaterialFromTemplate() {
				var modalOptions = {
					headerTextKey: 'basics.material.wizard.createMaterialByTemplate',
					templateUrl: globals.appBaseUrl + 'basics.material/templates/wizards/create-material-from-template.html',
					closeButtonText: $translate.instant('basics.common.button.cancel'),
					createButtonText: $translate.instant('basics.material.record.create'),
					backdrop: false,
					windowClass: 'form-modal-dialog',
					resizeable: true,
					width: '70%',
					height: '80%'
				};
				platformModalService.showDialog(modalOptions);
			};

			service.recalculateMaterialFromVariant=function recalculateMaterialFromVariant(){
				basicsMaterialRecordService.update().then(function(){
					var selectedMaterial=basicsMaterialRecordService.getSelected();
					if(selectedMaterial){
						var Id=selectedMaterial.Id;
						$http.get(globals.webApiBaseUrl +'basics/material/recalculateByVariant?Id='+Id).then(function (response) {
							var resData=response.data;
							if(resData){
								selectedMaterial.ListPrice=resData.ListPrice;
								basicsMaterialRecordService.recalculateCost(selectedMaterial,resData.ListPrice,'ListPrice');
							}
						});
					}
				});
			};

			service.disableRecord = disableRecord().fn;

			service.enableRecord = enableRecord().fn;

			service.syncFullText = function () {
				platformModalService.showYesNoDialog('basics.material.syncFullText.question', 'basics.material.syncFullText.title').then(function (result) {
					if (result.yes) {
						$http.get(globals.webApiBaseUrl + 'basics/material/wizard/syncfulltext').then(function (response) {
							if (response.data.Success) {
								platformModalService.showMsgBox(response.data.Message);
							} else {
								platformModalService.showErrorBox(response.data.Message);
							}
						});
					}
				});
			};

			service.changeMaterialStatus = changeMaterialStatus().fn;

			return service;
		}
	]);
})(angular);