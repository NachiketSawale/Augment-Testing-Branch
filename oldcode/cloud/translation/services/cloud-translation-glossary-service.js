(function (angular) {
	'use strict';

	angular.module('cloud.translation').service('cloudTranslationGlossaryService', CloudTranslationGlossaryService);

	CloudTranslationGlossaryService.$inject = ['$http', '$translate', '_', 'platformDialogService', 'globals', 'platformWizardDialogService', '$timeout', 'platformRuntimeDataService'];

	function CloudTranslationGlossaryService($http, $translate, _, platformDialogService, globals, platformWizardDialogService, $timeout, platformRuntimeDataService) {

		this.showNormalizationDialog = function () {
			const exportDialogConfig = {
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-normalization-dialog.html',
				tree: false,
				idProperty: 'ID',
				headerText$tr$: 'cloud.translation.normalizedlg.dialogTitle',
				isReadOnly: true,
				showOkButton: false,
				showCancelButton: false,
				resizeable: true,
				minWidth: '500px',
				minHeight: '300px',
				width: '500px',
				height: '300px',
				value: {}
			};
			return platformDialogService.showDialog(exportDialogConfig);
		};

		this.normalizeResources = function () {
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalize');
		};

		this.getStat = function () {
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/getstat');
		};

		this.convertAsGlossary = function (item) {
			if (!item.IsGlossary && item.ResourceFk === null) {
				return createGlossary(item.Id);
			}
		};

		this.getReferencingResources = function (resource) {
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/children', {ResourceId: resource.Id}).then(function (response) {
				if (response.statusText === 'OK') {
					return response.data.children;
				} else {
					return null;
				}
			});
		};

		this.removeGlossary = function (resourceId) {
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/remove', {ResourceId: resourceId});
		};

		function createGlossary(resourceId) {
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/create', {ResourceId: resourceId});
		}

		this.findExistingGlossary = function (resourceId) {
			return $http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/find', {ResourceId: resourceId}).then(function (response) {
				return response.data;
			});
		};

		this.showNormalizationStepsDialog = function (){
			let excelFilePath = '';
			var modelConfigObj = {
				newGlossaryConfig : {
					items: [],
					selectedId: 1,
					selectionListConfig: {
						selectedIdProperty: 'selectedId',
						idProperty: 'Id',
						columns: [
							{id:'ResourceTerm', name: 'New Glossary', name$tr$:'cloud.translation.normalizeDialog.newGlossaryStep.columns.glossaryTerm', field: 'ResourceTerm', width: 300, sortable: true},
							{id:'Count', name: 'Duplicate Count', name$tr$:'cloud.translation.normalizeDialog.newGlossaryStep.columns.duplicateCount', field: 'Count', width: 100, sortable: true}
						],
						multiSelect: false,
					}
				},
				assignmentConfig : {
					items: [],
					selectedId: 1,
					selectionListConfig: {
						selectedIdProperty: 'selectedId',
						idProperty: 'Id',
						tree:true,
						parentProp: 'ParentId',
						childProp: 'ChildItems',
						columns: [
							{id:'Exclude', name: 'Exclude', name$tr$:'cloud.translation.normalizeDialog.assignmentStep.columns.exclude', field: 'Exclude', formatter: 'boolean', editor: 'boolean', width: 50, sortable: true},
							{id:'Id', name: 'Id', name$tr$:'cloud.translation.normalizeDialog.assignmentStep.columns.id', field: 'Id', width: 100, sortable: true},
							{id:'ResourceTerm', name: 'Resource Term', name$tr$:'cloud.translation.normalizeDialog.assignmentStep.columns.resourceTerm', field: 'ResourceTerm', width: 300, sortable: true},
							{id:'Path', name: 'Path', name$tr$:'cloud.translation.normalizeDialog.assignmentStep.columns.path', field: 'Path', width: 300, sortable: true},
							{id:'AssignedTo', name: 'Assigned To', name$tr$:'cloud.translation.normalizeDialog.assignmentStep.columns.assignedTo', field: 'AssignedTo', width: 200, sortable: true}
						],
						multiSelect: false,
					}
				},
				normalizationConfig:{
					items: [],
					selectedId: 1,
					selectionListConfig: {
						selectedIdProperty: 'selectedId',
						idProperty: 'Id',
						tree:true,
						parentProp: 'ParentId',
						childProp: 'ChildItems',
						columns: [
							{id:'Title', name: 'Title', name$tr$:'cloud.translation.normalizeDialog.resultStep.columns.title', field: 'Title', width: 100, sortable: true},
							{id:'Message', name: 'Message', name$tr$:'cloud.translation.normalizeDialog.resultStep.columns.message', field: 'Message', width: 300, sortable: true}
						],
						multiSelect: false,
					}
				},
				filePath : ''
			};

			let introStep = {
				id: 'step1',
				title: 'Introduction',
				title$tr$: 'cloud.translation.normalizeDialog.introStep.stepTitle',
				message: 'Resource Normalization is a process where the resources, which are not referencing any glossaries, are checked and assigned glossary on match. Multiple entries are also checked and new glossaries are created.',
				message$tr$: 'cloud.translation.normalizeDialog.introStep.stepDescription'
			};

			let newGlossaryApiCallStep = {
				id: 'step2-1',
				title: 'Check Glossary Create',
				title$tr$: 'cloud.translation.normalizeDialog.checkNewGlossaryStep.stepTitle',
				loadingMessage : 'Checking creation of new glossaries',
				loadingMessage$tr$: 'cloud.translation.normalizeDialog.checkNewGlossaryStep.loadingMessage',
				disallowBack: true,
				disallowNext: true,
				prepareStep: function (info){
					$http.get(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalizecreate').then(function (response) {
						newGlossaryApiCallStep.loadingMessage = null;
						info.model.newGlossaryConfig.items = response.data.OrphanResources;
						let index = 0;
						info.model.newGlossaryConfig.items.forEach(item => {
							item.Id = index++;
						});
						info.step.disallowNext = false;
						info.commands.goToNext();

					});
				}
			};

			let newGlossaryStep = platformWizardDialogService.createListStep({
				stepId: 'step2',
				title: 'New Glossaries',
				title$tr$: 'cloud.translation.normalizeDialog.newGlossaryStep.stepTitle',
				topDescription: 'During the normalization process, the following glossaries will be created.',
				topDescription$tr$: 'cloud.translation.normalizeDialog.newGlossaryStep.stepDescription',
				model: 'newGlossaryConfig',
				requireSelection: false
			});
			newGlossaryStep.disallowBack = true;

			let resourceAssignmentApiCallStep = {
				id: 'step3-1',
				title: 'Check Resource Assignment',
				title$tr$: 'cloud.translation.normalizeDialog.checkAssignmentStep.stepTitle',
				loadingMessage : 'Checking Resources which can be assigned a Glossary',
				loadingMessage$tr$: 'cloud.translation.normalizeDialog.checkAssignmentStep.loadingMessage',
				disallowBack: true,
				disallowNext: true,
				prepareStep: function (info){
					$http.get(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalizeassignment').then(function (response) {
						let changedResources = response.data.ChangedResources;

						let treeData = {};
						let glossaryIndex = 0;
						changedResources.forEach(res => {

							if(!treeData.hasOwnProperty(res.ResourceTerm.toLowerCase())){
								treeData[res.ResourceTerm.toLowerCase()] = {
									Id: (res.TlsResourceFk === 0) ? 'G-' + (glossaryIndex++) : res.TlsResourceFk.toString(),
									ResourceTerm: res.ResourceTerm,
									AssignedTo: '',
									Path: '',
									Exclude: null,
									ChildItems: [],
									ParentId: null
								};

								platformRuntimeDataService.readonly(treeData[res.ResourceTerm.toLowerCase()], [{
									field: 'Exclude',
									readonly: true
								}]);
							}

							let childItem = {
								Id: res.Id.toString(),
								ResourceTerm: res.ResourceTerm,
								AssignedTo: treeData[res.ResourceTerm.toLowerCase()].Id,
								Path: res.Path,
								Exclude: false,
								ParentId: treeData[res.ResourceTerm.toLowerCase()].Id
							};

							treeData[res.ResourceTerm.toLowerCase()].ChildItems.push(childItem);

						});

						resourceAssignmentStep.loadingMessage = null;
						info.model.assignmentConfig.items = Object.values(treeData);

						info.step.disallowNext = false;
						info.commands.goToNext();
					});
				}
			};

			let resourceAssignmentStep = platformWizardDialogService.createListStep({
				stepId: 'step3',
				title: 'Resource Assignment',
				title$tr$: 'cloud.translation.normalizeDialog.assignmentStep.stepTitle',
				topDescription: 'Here you can see all the resources which will be assigned to a glossary. Next step creates the necessary glossaries and assign resources to glossary.' +
					'You can exclude particular resources from the normalization process as well. Please cancel the wizard if you want to do other modifications.',
				topDescription$tr$: 'cloud.translation.normalizeDialog.assignmentStep.stepDescription',
				model: 'assignmentConfig',
				requireSelection: false
			});
			resourceAssignmentStep.disallowBack = true;

			let normalizationApiCallStep = {
				id: 'step4-1',
				title: 'Normalization',
				title$tr$: 'cloud.translation.normalizeDialog.normalizationStep.stepTitle',
				loadingMessage : 'Normalization in progress',
				loadingMessage$tr$: 'cloud.translation.normalizeDialog.normalizationStep.loadingMessage',
				disallowBack: true,
				disallowNext: true,
				prepareStep: function (info){
					let excludeIds = [];
					info.model.assignmentConfig.items.forEach(parentItem => {
						parentItem.ChildItems.forEach(item=>{
							if(item.Exclude){
								excludeIds.push(item.Id);
							}
						});

					});
					$http.post(globals.webApiBaseUrl + 'cloud/Translation/resource/glossary/normalizenew', {'excludeIds': excludeIds}).then(function (response) {
						excelFilePath = response.data.FileUrl;
						let index = 0;
						let treeData = {};
						response.data.Message.forEach(data => {

							if(!treeData.hasOwnProperty(data.Title)){
								treeData[data.Title] = {
									Id: index++,
									Title: data.Title,
									Message: '',
									ChildItems: []
								};
							}

							treeData[data.Title].ChildItems.push({
								Id: index++,
								Title: data.Title,
								Message: data.Message,
								ParentId: treeData[data.Title].Id
							});
						});
						normalizationStep.loadingMessage = null;
						info.model.normalizationConfig.items = Object.values(treeData);
						info.step.disallowNext = false;
						info.commands.goToNext();

					});
				}
			};

			let normalizationStep = platformWizardDialogService.createListStep({
				stepId: 'step4',
				title: 'Normalization Result',
				title$tr$: 'cloud.translation.normalizeDialog.resultStep.stepTitle',
				topDescription: 'Normalization finished. You can download the normalization report By clicking the Download Report button.',
				topDescription$tr$: 'cloud.translation.normalizeDialog.resultStep.stepDescription',
				model: 'normalizationConfig',
				requireSelection: false
			});
			normalizationStep.topButtons = [
				{
					text: 'Download Report',
					text$tr$: 'cloud.translation.normalizeDialog.resultStep.downloadReportBtn',
					fn: function (step, info){
						let elem = document.createElement('a');
						elem.href = excelFilePath;
						elem.addEventListener('click', function (evt){
							$timeout(() => {
								document.body.removeChild(elem);
							});

						});
						$timeout(() => {
							document.body.appendChild(elem);
							elem.click();
						});

					}
				}
			];
			normalizationStep.disallowBack = true;

			let steps = [
				introStep,
				newGlossaryApiCallStep,
				newGlossaryStep,
				resourceAssignmentApiCallStep,
				resourceAssignmentStep,
				normalizationApiCallStep,
				normalizationStep
			];
			platformWizardDialogService.translateWizardSteps(steps);

			let dialogConfig = {
				title: 'Resource Normalization',
				steps : steps
			};

			return platformWizardDialogService.showDialog(dialogConfig, modelConfigObj);
		};

	}

})(angular);
