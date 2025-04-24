(function (angular) {
	/* global globals */
	'use strict';

	const projectModule = 'project.main';

	/**
	 * @ngdoc service
	 * @model projectMainCopyEntityService
	 */
	const projectTempateLookupServiceName = 'projectTemplateLookupDataService';
	angular.module(projectModule).service('projectMainCopyEntityService', ProjectMainCopyEntityService);

	function ProjectMainCopyEntityService($http, platformWizardDialogService, _, basicsLookupdataConfigGenerator, projectTemplateLookupDataService,
		$translate, $rootScope, PlatformMessenger, platformRuntimeDataService,projectMainNumberGenerationSettingsService) {

		const self = this;

		self.CheckDependancies = new PlatformMessenger();

		self.onOkOrCancelDialog = new PlatformMessenger();

		self.copyProject = function copyProject(command) {

			// set extra ProjectNoName for template to not bind with ProjectNo
			command.Project.ProjectNoName = command.Project.ProjectNo;

			let copiedCommand = _.cloneDeep(command);
			self.originProject2Copy = copiedCommand.Project;
			let projectForm = copiedCommand.projectEntityFormConfig;
			if(command.AlternativeNo == null){
				projectForm.rows.forEach(item => {
					if (item.rid === "ProjectName" || item.rid === "ProjectName2") {
						item.readonly = false;
					}
				});
			}
			let projectTemplateForm = getFormConfigStub();
			const steps = [
				{
					id: 'projectTemplate',
					title$tr$: 'project.main.ProjectTemplate',
					form: projectTemplateForm,
					canFinish: true,
					topDescription: $translate.instant('project.main.createDeepCopyFromTemplate')
				},
				{
					id: 'newPrj',
					title$tr$: 'project.main.taskBarNewPrj',
					form: projectForm,
					canFinish: true,
				},

				createStep('project.main.data', [
					{
						model: 'copyObject.scheduling.schedule.schedule',
						tr: 'scheduling.schedule.listTitle',
						directive: 'scheduling-schedule-selection-list'	},
					{
						model: 'copyObject.estimate.project.estimate',
						tr: 'project.main.estimate',
						directive: 'estimate-project-estimate-header-list'
					},
				],copiedCommand),

				createStep('project.main.data', [
					{
						model: 'copyObject.boq.project',
						tr: 'project.main.boq'
					},
					{
						model: 'copyObject.boq.prjqtoaqwq',
						tr: 'project.main.copyQtoAqWqWithPrjBoq',
						isVisible: false
					},
					{
						model: 'copyObject.boq.prjqtoiqbq',
						tr: 'project.main.copyQtoIqBqWithPrjBoq',
						isVisible: false
					},
					{
						model: 'copyObject.estimate.main.lineitem.selection',
						tr: 'estimate.main.lineItemSelStatement.containerTitle'
					},
					{
						model: 'copyObject.constructionsystem.project.instanceHeader',
						tr: 'constructionsystem.project.instanceHeaderGridContainerTitle'
					},
					{
						model: 'copyObject.controlling.structure.controllingunit',
						tr: 'controlling.structure.containerTitleControllingUnitsTable',
						isChecked: false
					},
					{
						model: 'copyObject.project.main.costgroupcatalog',
						tr: 'project.main.entityCostGroupCatalogs',
						isChecked: true
					},
					{
						model: 'copyObject.procurement.package',
						tr: 'basics.characteristic.section.ProcurementPackage',
						isUnvisible:_.isNil(command.SetNewAlternativeActive)
					},
					{
						model: 'copyObject.boq.prcqtoaqwq',
						tr: 'project.main.copyQtoAqWqWithPrcBoq',
						isUnvisible: _.isNil(command.SetNewAlternativeActive),
						isVisible: false
					}
				],copiedCommand),

				createStep('project.main.projectInvolved', [
					{
						model: 'copyObject.project.main.projectbusinesspartner',
						tr: 'project.main.entityBusinessPartner',
						isChecked: true
					},
					{
						model: 'copyObject.basics.characteristic.data',
						tr: 'basics.characteristic.title.characteristics',
						isChecked: true
					},

					{
						model: 'copyObject.project.location.location',
						tr: 'project.location.listContainerTitle',
						isChecked: true
					},
					{
						model: 'copyObject.document.project',
						tr: 'documents.project.title.headerTitle'
					},
					{
						model: 'copyObject.project.main.projectcurrencyrate',
						tr: 'basics.currency.ExchangeRates',
						isChecked: true
					},
					{
						model: 'copyObject.project.main.projectsale',
						tr: 'project.main.listSaleTitle'
					},
					{
						model: 'copyObject.project.main.projecttenderresult',
						tr: 'project.main.entityTenderResultList'
					},
					{
						model: 'copyObject.project.main.projectclerk',
						tr: 'basics.clerk.listClerkAuthTitle'
					},
					{
						model: 'copyObject.project.main.projectgenerals',
						tr: 'project.main.entityGeneralList',
						isChecked: true
					},
					{
						model: 'copyObject.project.main.projectkeyfigure',
						tr: 'project.main.entityKeyFigureList',
						isChecked: true
					}
				],copiedCommand),

				createStep('project.structures.sortCodes', [
					{
						model: 'copyObject.project.structures.sortcode01',
						tr: 'project.structures.sortCode01',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode02',
						tr: 'project.structures.sortCode02',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode03',
						tr: 'project.structures.sortCode03',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode04',
						tr: 'project.structures.sortCode04',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode05',
						tr: 'project.structures.sortCode05',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode06',
						tr: 'project.structures.sortCode06',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode07',
						tr: 'project.structures.sortCode07',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode08',
						tr: 'project.structures.sortCode08',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode09',
						tr: 'project.structures.sortCode09',
						isChecked: true
					},
					{
						model: 'copyObject.project.structures.sortcode10',
						tr: 'project.structures.sortCode10',
						isChecked: true
					}
				],copiedCommand),
			];

			if (!_.isNil(command.StepAlternative)) {
				steps.unshift(command.StepAlternative);
			}

			createDefaults(steps, copiedCommand);
			// break the reference so the original entity is not modified
			let lookupRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
				dataServiceName: projectTempateLookupServiceName,
				enableCache: true,
				showClearButton: true,
			}, {
				gid: 'group',
				sortOrder: 2,
				rid: 'projectTemplate',
				model: 'Project.Id',
				label$tr$: 'project.main.ProjectTemplate',
				validator: function (entity, value) {
					if (value) {
						copiedCommand.Project = projectTemplateLookupDataService.getItemById(value, {lookupType: projectTempateLookupServiceName});
					} else {
						copiedCommand.Project = self.originProject2Copy;
					}
					createDefaults(steps, copiedCommand);
				}
			});
			const projectNameRow = {
				gid: 'group',
				rid: 'ProjectName',
				label$tr$: 'project.main.Project2Copy',
				model: 'Project.ProjectNoName',
				type: 'code',
				sortOrder: 1,
				readonly: true,
			};

			const checkTemplate = {
				gid: 'group',
				rid: 'ProjectName',
				label$tr$: 'project.main.projectTemplateToCopyFlag',
				model: 'Project.CheckTemplate',
				type: 'boolean',
				sortOrder: 2,
				isChecked: true
			};

			projectTemplateForm.rows.push(projectNameRow);
			projectTemplateForm.rows.push(checkTemplate);
			projectTemplateForm.rows.push(lookupRow);

			_.each(projectForm.rows, function (row) {
				row.model = 'Project.' + row.model;
			});

			let prjNo = _.find(projectForm.rows, function (row) {
				return row.rid.toLowerCase() === 'projectno';
			});
			let newPrj = _.find(steps, {id: 'newPrj'});

			copiedCommand.handleProjectNoIsReadOnly = function handleProjectNoIsReadOnly(cmd, readOnly) {
				prjNo.readonly = readOnly;
				if(!readOnly){
					newPrj.disallowNext = true;
				}
			};

			// set validation for rubric cat and handle next button
			let result =  validateSelectedRubricCat(copiedCommand.Project, copiedCommand.Project.RubricCategoryFk);
			copiedCommand.handleProjectNoIsReadOnly(copiedCommand, result);

			// set visible to default false
			let lookupTemplate = _.find(projectTemplateForm.rows, {model: 'Project.Id'});
			lookupTemplate.visible = false;

			let wizardConfig = {
				id: 'prj-copy-entity-step',
				title: $translate.instant('project.main.ProjectCopyDialog'),
				steps: steps,
				width: '40%',
				height: '80%',
				watches: [{
					expression: 'Project.CheckTemplate',
					fn: function (info) {
						let prjTemplate = _.find(info.wizard.steps, {id: 'projectTemplate'});
						let modelTemplate =_.find(prjTemplate.form.rows, {model: 'Project.Id'});
						modelTemplate.visible = info.newValue;
						info.scope.$broadcast('form-config-updated');
					}
				},
				{
					expression: 'Project.ProjectNo',
					fn: function (info) {
						let newPrj = _.find(info.wizard.steps, {id: 'newPrj'});
						newPrj.disallowNext = !info.newValue;
						info.scope.$broadcast('form-config-updated');
					}
				}]
			};

			platformWizardDialogService.translateWizardConfig(wizardConfig);
			platformWizardDialogService.showDialog(wizardConfig, copiedCommand).then(function (result) {
				if (result.success) {
					if(!_.isNil(result.data.SetNewAlternativeActive)){
						result.data.Action = (result.data.SetNewAlternativeActive) ? 1 : 2;
						result.data.Project.AlternativeNo = result.data.AlternativeNo;
						result.data.Project.AlternativeDescription = result.data.AlternativeDescription;
						result.data.Project.AlternativeRemark = result.data.AlternativeComment;
					}
					copiedCommand.Project = result.data.Project;
					self.sendCopyRequest(copiedCommand);
				}
				self.onOkOrCancelDialog.fire();
			});
		};

		function validateSelectedRubricCat(entity, value) {
			let readonly = false;
			if(projectMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(value)){
				entity.ProjectNo = projectMainNumberGenerationSettingsService.provideNumberDefaultText(value, entity.ProjectNo);
				readonly = true;
			}else{
				readonly = true;
			}
			return readonly;
		}

		function createDefaults(steps, copiedCommand) {
			_.each(steps, function (step) {
				_.each(step.form.rows, function (row) {
					if (row.isChecked) {
						_.set(copiedCommand, row.model, true);
					}
				});
			});
		}

		function getPaths(copyObject, combiKey, paths) {
			let pathList = paths ? paths : [];
			_.forOwn(copyObject, function (value, key) {
				let combinedKey = combiKey ? combiKey : '';
				if (_.isArray(value)) {
					pathList.push(writeKey(combinedKey, key));
				}else if (_.isObject(value)) {
					combinedKey = writeKey(combinedKey, key);
					getPaths(value, combinedKey, pathList);
				} else if (value === true) {
					pathList.push(writeKey(combinedKey, key));
				}
			});
			return pathList;
		}

		function getPathsByFilter(copyObject, combiKey, paths) {
			let pathList = paths ? paths : [];
			_.forOwn(copyObject, function (value, key) {
				let combinedKey = combiKey ? combiKey : '';
				if (_.isArray(value)) {
					let filteredKey = writeKey(combinedKey, key);

					pathList.push({Key:filteredKey, Value:value});
				}else if (_.isObject(value)) {
					combinedKey = writeKey(combinedKey, key);
					getPathsByFilter(value, combinedKey, pathList);
				}
			});
			return pathList;
		}

		function writeKey(path, key) {
			return path ? (path + '.' + key) : key;
		}

		self.sendCopyRequest = function sendCopyRequest(command) {
			$rootScope.$emit('deepCopyInProgress', true);
			command.CopyIdentifier = getPaths(command.Project.copyObject);
			command.CopyIdentifierFilteredByIdString = JSON.stringify(getPathsByFilter(command.Project.copyObject));

			delete
			delete command.projectEntityFormConfig;
			delete command.__rt$data;

			$http.post(globals.webApiBaseUrl + 'project/main/execute', command)
				.then(function (response) {
					command.copySuccessCallback(response.data, command.CopyIdentifier);
					$rootScope.$emit('deepCopyInProgress', false);
				},
				function (/* error */) {
					$rootScope.$emit('deepCopyInProgress', false);
				});
		};

		function createStep(stepTitleTranslationId, fieldList,copiedCommand) {
			let stub = getFormConfigStub();
			let step = {title$tr$: stepTitleTranslationId, form: stub, canFinish: true};

			_.each(fieldList, function createStep(fieldObject) {
				if(!fieldObject.isUnvisible) {
					if (_.isString(fieldObject.directive)) {
						stub.rows.push(createDirectiveRow(fieldObject, fieldList, copiedCommand, stub));
					} else {
						stub.rows.push(createBooleanRow(fieldObject, fieldList, copiedCommand, stub));
					}
				}
			});
			return step;
		}

		function createBooleanRow(fieldObject, fieldList,copiedCommand,stub) {
			return {
				gid: 'group',
				rid: fieldObject.model,
				label$tr$: fieldObject.tr,
				model: 'Project.' + fieldObject.model,
				type: 'boolean',
				sortOrder: 0,
				isChecked: fieldObject.isChecked,
				visible: _.isUndefined(fieldObject.isVisible) ? true : fieldObject.isVisible, // defualt as true

				change: function valueChanged(entity, model){
					if (model === 'Project.copyObject.constructionsystem.project.instanceHeader') {
						let isCosChecked = entity.Project.copyObject.constructionsystem.project.instanceHeader;
						if(isCosChecked){
							let estimateRow = _.find(stub.rows, function (row) {
								return row.rid === 'copyObject.estimate.project.estimate';
							});
							// The COS header denpendence on estimate, So need to copy Estimate
							if (estimateRow !== null && estimateRow !== undefined) {
								_.set(copiedCommand, estimateRow.model, true);
							}
							self.CheckDependancies.fire(model, isCosChecked);
						}
					}

					if(model === 'Project.copyObject.project.main.projecttenderresult') {
						let projectMain = entity.Project.copyObject.project.main;
						let isTenderChecked = projectMain.projecttenderresult;
						let salesRow = _.find(stub.rows, function (row) {
							return row.rid === 'copyObject.project.main.projectsale';
						});
						if(isTenderChecked) {
							_.set(copiedCommand, salesRow.model, true);
						}
						platformRuntimeDataService.readonly(entity, [{field: 'Project.copyObject.project.main.projectsale', readonly: isTenderChecked}]);
					}

					// check project boq, activate the copy qto with project boq
					if(model === 'Project.copyObject.boq.project') {
						let isPrjBoqChecked = entity.Project.copyObject.boq.project;

						let prjBoqQtoAqWqRow = _.find(stub.rows, function (row) {
							return row.rid === 'copyObject.boq.prjqtoaqwq';
						});

						if (prjBoqQtoAqWqRow !== null && prjBoqQtoAqWqRow !== undefined) {
							prjBoqQtoAqWqRow.visible = isPrjBoqChecked;
						}

						if (!copiedCommand.SetNewAlternativeActive) {
							let prjBoqQtoIqBqRow = _.find(stub.rows, function (row) {
								return row.rid === 'copyObject.boq.prjqtoiqbq';
							});

							if (prjBoqQtoIqBqRow !== null && prjBoqQtoIqBqRow !== undefined) {
								prjBoqQtoIqBqRow.visible = isPrjBoqChecked;
							}
						}
						$rootScope.$broadcast('form-config-updated');

						// no check project boq, reset prjBoqQto
						if (!isPrjBoqChecked){
							entity.Project.copyObject.boq.prjqto = false;
						}
					}

					// check prc package, activate the copy qto with package boq
					if(model === 'Project.copyObject.procurement.package') {
						let isPrcPackageChecked = entity.Project.copyObject.procurement.package;

						let prcBoqQtoAqWqRow = _.find(stub.rows, function (row) {
							return row.rid === 'copyObject.boq.prcqtoaqwq';
						});

						if (prcBoqQtoAqWqRow !== null && prcBoqQtoAqWqRow !== undefined) {
							prcBoqQtoAqWqRow.visible = isPrcPackageChecked;
						}
						$rootScope.$broadcast('form-config-updated');

						// no check package boq, reset prcBoqQto
						if (!isPrcPackageChecked){
							entity.Project.copyObject.boq.prcqto = false;
						}
					}
				}
			};
		}

		function createDirectiveRow(fieldObject, fieldList,copiedCommand,stub) {
			function valueChanged(entity, model, value, itemIdsTocopy, cosInstanceModel){
				if (model === 'Project.copyObject.estimate.project.estimate' ){
					itemIdsTocopy = itemIdsTocopy && itemIdsTocopy.length ? itemIdsTocopy : [];

					// _.set(copiedCommand, model, [1002269]);
					_.set(copiedCommand, model, itemIdsTocopy);// todo set ids to copy
					let isEstimateChecked = itemIdsTocopy && itemIdsTocopy.length;

					// if extimate not copy, then the Cos header can not be copy
					if(!isEstimateChecked && !cosInstanceModel){
						let instanceHeaderRow = _.find(stub.rows, function (row) {
							return row.rid === 'copyObject.constructionsystem.project.instanceHeader';
						});
						// The COS header denpendence on estimae, So need to copy Estimate
						if (instanceHeaderRow !== null && instanceHeaderRow !== undefined) {
							_.set(copiedCommand, instanceHeaderRow.model, false);
						}
					}
				}
				if (model === 'Project.copyObject.scheduling.schedule.schedule' ){
					itemIdsTocopy = itemIdsTocopy && itemIdsTocopy.length ? itemIdsTocopy : [];

					// _.set(copiedCommand, model, [1002269]);
					_.set(copiedCommand, model, itemIdsTocopy);
 				}

			}
			return {
				gid: 'group',
				rid: fieldObject.model,
				label$tr$: fieldObject.tr,
				model: 'Project.' + fieldObject.model,
				type: 'directive',
				sortOrder: 0,
				directive: fieldObject.directive,
				onPropertyChanged : valueChanged,
				change: valueChanged
			};
		}

		function getFormConfigStub() {
			return {
				fid: '',
				version: '0.0.1',
				showGrouping: false,
				groups: [
					{
						gid: 'group',
						attributes: []
					}
				],
				rows: []
			};
		}
	}

	ProjectMainCopyEntityService.$inject = ['$http', 'platformWizardDialogService', '_', 'basicsLookupdataConfigGenerator', projectTempateLookupServiceName, '$translate', '$rootScope', 'PlatformMessenger','platformRuntimeDataService','projectMainNumberGenerationSettingsService'];

})(angular);
