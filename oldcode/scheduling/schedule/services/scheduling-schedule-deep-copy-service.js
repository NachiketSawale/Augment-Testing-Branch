((angular) => {
	/* global globals */
	'use strict';
	let schedulingScheduleModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingScheduleDeepCopyService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingScheduleModule.service('schedulingScheduleDeepCopyService', SchedulingScheduleDeepCopyService);

	SchedulingScheduleDeepCopyService.$inject = ['$injector', '$http', '$rootScope', '$translate', '_', 'platformWizardDialogService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'PlatformMessenger'];

	function SchedulingScheduleDeepCopyService(
		$injector, $http, $rootScope, $translate, _, platformWizardDialogService, platformLayoutHelperService, basicsLookupdataConfigGenerator, PlatformMessenger
	) {
		let self = this;

		self.onOkOrCancelDialog = new PlatformMessenger();

		self.copySchedule = function copySchedule(command) {
			var copiedCommand = _.cloneDeep(command);
			copiedCommand.Schedule.generatedText =  $translate.instant('cloud.common.isGenerated');
			copiedCommand.Schedule.DescriptionInfo.Description = copiedCommand.Schedule.DescriptionInfo.Description + ' (Copy)';

			var wizardConfig = {
				id: 'scheduling-copy-entity-step',
				title: $translate.instant('scheduling.schedule.deepCopyWizard.dialog'),
				steps: [
					{
						id: 'projectTemplate',
						title$tr$: 'scheduling.schedule.deepCopyWizard.step1',
						form: {
							fid: 'project.main.createProjectModal',
							version: '0.2.4',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['rubricCategoryFk', 'projectNo', 'projectName', 'projectName2', 'catalogConfigTypeFk', 'projectGroupFk', 'responsibleCompanyFk', 'clerkFk', 'projectDescription', 'assetmasterFk'],
								},
								{
									gid: 'optionGroup',
									attributes: ['rubricCategoryFk', 'projectNo', 'projectName', 'projectName2', 'catalogConfigTypeFk', 'projectGroupFk', 'responsibleCompanyFk', 'clerkFk', 'projectDescription', 'assetmasterFk'],
								},
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'ProjectNo',
									readonly: true,
									label$tr$: 'scheduling.schedule.deepCopyWizard.code',
									model: 'Schedule.generatedText',
									type: 'code',
									sortOrder: 1,
									validator: function (entity, value, model) {
										return $injector.get('projectMainProjectValidationService').validateProjectNo(entity, value, model);
									},
									asyncValidator: function (entity, value, model) {
										return $injector.get('projectMainProjectValidationService').asyncValidateProjectNo(entity, value, model);
									},
								},
								{
									gid: 'baseGroup',
									rid: 'ProjectName',
									label$tr$: 'scheduling.schedule.deepCopyWizard.description',
									model: 'Schedule.DescriptionInfo.Description',
									type: 'description',
									field: 'Schedule.DescriptionInfo',
									formatter: 'translation',
									sortOrder: 2,
								},
								{
									gid: 'optionGroup',
									rid: 'ProjectDescription',
									label$tr$: 'scheduling.schedule.deepCopyWizard.copyKeydates',
									type: 'boolean',
									model: 'copyKeydates',
									sortOrder: 3,
								},
								{
									gid: 'optionGroup',
									rid: 'assetmasterFk',
									label$tr$: 'scheduling.schedule.deepCopyWizard.copySubschedules',
									type: 'boolean',
									model: 'copySubSchedules',
									sortOrder: 4,
								},
							],
						},
						canFinish: true,
						topDescription: $translate.instant('scheduling.schedule.deepCopyWizard.createDeepCopy'),
					},
				],
				width: '40%',
				height: '80%',
				watches: [
					{
						expression: 'schedule.Code',
						fn: function (info) {
							var prjTemplate = _.find(info.wizard.steps, { id: 'projectTemplate' });
							var modelTemplate = _.find(prjTemplate.form.rows, { model: 'Project.Id' });
							modelTemplate.visible = info.newValue;
							info.scope.$broadcast('form-config-updated');
						},
					},
					{
						expression: 'schedule.Description',
						fn: function (info) {
							var newPrj = _.find(info.wizard.steps, { id: 'newPrj' });
							if (info.newValue) {
								newPrj.disallowNext = false;
							} else {
								newPrj.disallowNext = true;
							}
							info.scope.$broadcast('form-config-updated');
						},
					},
				],
			};

			platformWizardDialogService.translateWizardConfig(wizardConfig);
			platformWizardDialogService.showDialog(wizardConfig, copiedCommand).then(function (result) {
				if (result.success) {
					copiedCommand.Project = result.data.Project;
					copiedCommand.ScheduleDescription = result.data.Schedule.DescriptionInfo.Description;
					copiedCommand.CopyKeydates = result.data.copyKeydates;
					copiedCommand.CopySubSchedules = result.data.copySubSchedules;
					self.sendCopyRequest(copiedCommand);
				}
				self.onOkOrCancelDialog.fire();
			});
		};

		self.sendCopyRequest = function sendCopyRequest(command) {
			$rootScope.$emit('deepCopyInProgress', true);
			command.CopyIdentifier = getPaths(command.Schedule);
			command.CopyIdentifierFilteredByIdString = JSON.stringify(getPathsByFilter(command.Schedule));
			command.IdsToHandle = [command.Schedule.Id];

			$http.post(globals.webApiBaseUrl + 'scheduling/schedule/execute2', command).then(
				function (response) {
					command.copySuccessCallback(response.data, command.CopyIdentifier);
					$rootScope.$emit('deepCopyInProgress', false);
				},
				function (error) {
					$rootScope.$emit('deepCopyInProgress', false);
				}
			);
		};

		function getPaths(copyObject, combiKey, paths) {
			var pathList = paths ? paths : [];
			_.forOwn(copyObject, function (value, key) {
				var combinedKey = combiKey ? combiKey : '';
				if (_.isArray(value)) {
					pathList.push(writeKey(combinedKey, key));
				} else if (_.isObject(value)) {
					combinedKey = writeKey(combinedKey, key);
					getPaths(value, combinedKey, pathList);
				} else if (value === true) {
					pathList.push(writeKey(combinedKey, key));
				}
			});
			return pathList;
		}

		function getPathsByFilter(copyObject, combiKey, paths) {
			var pathList = paths ? paths : [];
			_.forOwn(copyObject, function (value, key) {
				var combinedKey = combiKey ? combiKey : '';
				if (_.isArray(value)) {
					var filteredKey = writeKey(combinedKey, key);

					pathList.push({ Key: filteredKey, Value: value });
				} else if (_.isObject(value)) {
					combinedKey = writeKey(combinedKey, key);
					getPathsByFilter(value, combinedKey, pathList);
				}
			});
			return pathList;
		}

		function writeKey(path, key) {
			return path ? path + '.' + key : key;
		}
	}
})(angular);
