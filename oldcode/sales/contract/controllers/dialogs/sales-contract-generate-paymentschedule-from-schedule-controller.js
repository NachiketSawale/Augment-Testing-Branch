(function () {
	'use strict';
	/* global globals,moment,_ */
	let moduleName = 'sales.contract';
	angular.module(moduleName).controller('generatePaymentScheduleFromScheduleController', [
		'$scope',
		'$http',
		'$translate',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'platformGridAPI',
		'platformModalService',
		'platformRuntimeDataService',
		function (
			$scope,
			$http,
			$translate,
			platformTranslateService,
			basicsLookupdataConfigGenerator,
			platformGridAPI,
			platformModalService,
			platformRuntimeDataService
		) {
			var header = $scope.modalOptions.header;
			var service = $scope.modalOptions.service;
			var activities = [];
			const generateOptions = {
				fromActivityOnly: 1,
				fromSummaryOnly: 2,
				fromSummaryNActivity: 3
			};
			$scope.currentGenerateOption = null;
			$scope.steps = [
				{number: 1, identifier: 'projectAndScheduleform', skip: false},
				{number: 2, identifier: 'activityGrid', skip: false}
			];
			$scope.selectStep = angular.copy($scope.steps[0]);
			$scope.formOptions = {
				configure: getConfiguration()
			};
			$scope.activityGridId = '80c746ac23144cda8aae0dad9253635f';
			$scope.activityGrid = {
				state: $scope.activityGridId
			};
			$scope.selectActivityId = null;
			$scope.isLoading = false;
			$scope.entity = {
				ProjectFk: header.ProjectFk,
				ScheduleFk: null,
				ActivityIdsObj: null,
				AfterOrBefore: 1,
				DayType: 'PlannedStart',
				DaysOffset: 0
			};
			$scope.afterBeforeOptions = {
				model: 'AfterOrBefore',
				items: [
					{ Id: 1, Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.after')},
					{ Id: -1, Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.before')}
				],
				valueMember: 'Id',
				displayMember: 'Description',
				popupOptions: {
					height: 68
				}
			};
			$scope.dayTypeOptions = {
				model: 'DayType',
				items: [
					{ Code: 'PlannedStart', Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.plannedStart')},
					{ Code: 'PlannedFinish', Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.plannedFinish')},
					{ Code: 'ActualStart', Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.actualStart')},
					{ Code: 'ActualFinish', Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.actualFinish')},
					{ Code: 'CurrentStart', Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.currentStart')},
					{ Code: 'CurrentFinish', Description: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.currentFinish')}
				],
				valueMember: 'Code',
				displayMember: 'Description',
				popupOptions: {
					height: 120
				}
			};
			$scope.modalOptions = {
				nextStepText: $translate.instant('basics.common.button.nextStep'),
				cancelText: $translate.instant('basics.common.button.cancel'),
				backText: $translate.instant('basics.common.button.back'),
				okText: $translate.instant('basics.common.button.ok'),
				notes: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.notes'),
				note1: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.takeEstLineItemRevenueAaAmount'),
				note2: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.optionNoteFromActivityOnly'),
				note3: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.optionNoteFromSummaryOnly'),
				note4: $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.optionNoteFromSummaryActivity'),
				cancel: function() {
					$scope.$close(false);
				},
				next: function () {
					setStep(2);
				},
				back: function () {
					setStep(1);
				},
				ok: function () {
					var dateEmptyItems = [];
					var dateNotEmptyItems = [];
					if ($scope.currentGenerateOption === generateOptions.fromSummaryOnly) {
						_.forEach($scope.entity.SummaryIdsObj, function (a) {
							if (!a[$scope.entity.DayType]) {
								dateEmptyItems.push(a);
							}
							else{
								dateNotEmptyItems.push(a);
							}
						});
					}
					else {
						_.forEach($scope.entity.ActivityIdsObj, function (a) {
							if (!a[$scope.entity.DayType]) {
								dateEmptyItems.push(a);
							}
							else{
								dateNotEmptyItems.push(a);
							}
						});
					}
					if (dateEmptyItems && dateEmptyItems.length) {
						var codes = _.map(dateEmptyItems, function (i) { return i.Code; });
						var codeStr = codes.join('", "');
						codeStr = '"' + codeStr + '"';
						var datatype = _.find($scope.dayTypeOptions.items, {Code: $scope.entity.DayType});
						var mes = $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.dateTypeIsEmpty', {codestr: codeStr, datetype: datatype.Description});
						if (dateNotEmptyItems.length) {
							mes += ' ' + $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.doYouWantToContinue');
							return platformModalService.showYesNoDialog(mes, 'sales.contract.generatePaymentScheduleFromSchedule.title', 'yes').then(function (result) {
								if (result.yes) {
									sendGenerateHttp(dateNotEmptyItems);
								}
							});
						}
						else {
							return platformModalService.showMsgBox(mes, 'sales.contract.generatePaymentScheduleFromSchedule.title', 'info');
						}
					}
					else {
						if ($scope.currentGenerateOption === generateOptions.fromSummaryOnly) {
							sendGenerateHttp($scope.entity.SummaryIdsObj);
						}
						else {
							sendGenerateHttp($scope.entity.ActivityIdsObj);
						}
					}
				}
			};
			setStep(1);
			$scope.isBackDisabled = function () {
				return $scope.selectStep.number === 1 || $scope.isLoading;
			};
			$scope.isNextDisabled = function () {
				return ($scope.selectStep.number === 2 || !$scope.entity.ProjectFk || !$scope.entity.ScheduleFk || $scope.isLoading);
			};
			$scope.isOkDisabled = function () {
				var ids = [];
				if ($scope.currentGenerateOption === generateOptions.fromSummaryOnly) {
					ids = _.keys($scope.entity.SummaryIdsObj);
				}
				else {
					ids = _.keys($scope.entity.ActivityIdsObj);
				}
				return !ids.length || $scope.isLoading;
			};
			$scope.isCancelDisabled = function () {
				return $scope.isLoading;
			};
			$scope.selectGenerateOption = function (option, notRefresh) {
				if (option !== $scope.currentGenerateOption) {
					$scope.currentGenerateOption = option;
					if (option === generateOptions.fromActivityOnly) {
						editableSummaryAndActivity(activities);
					}
					else if (option === generateOptions.fromSummaryOnly) {
						editableAllSummary(activities);
					}
					else if (option === generateOptions.fromSummaryNActivity) {
						editableSummaryAndActivity(activities);
					}
					$scope.entity.ActivityIdsObj = null;
					$scope.entity.SummaryIdsObj = null;
					if (!notRefresh) {
						platformGridAPI.grids.refresh($scope.activityGridId);
					}
				}
			};

			function getConfiguration() {
				let formOptions = {
					fid: 'sales.contract.generatePaymentScheduleFromSchedule.dialog',
					version: '0.0.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'projectfk', 'scheduleFk'
							]
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'projectfk',
							model: 'ProjectFk',
							sortOrder: 1,
							label: 'Project',
							label$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.project',
							type: 'directive',
							validator: validateProjectFk,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false
								}
							}
						},
						basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
							dataServiceName: 'packageSchedulingLookupService',
							showClearButton: false,
							isComposite: true,
							desMember: 'DescriptionInfo.Translated',
							dispMember: 'Code',
							filter: function (item) {
								var prj = -1;
								if (item) {
									prj = item.ProjectFk || -1;
								}
								return prj;
							}
						},{
							sortOrder: 1,
							label: 'Schedule',
							label$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.schedule',
							gid: 'baseGroup',
							rid: 'scheduleFk',
							model: 'ScheduleFk',
							sortable : false
						})
					]
				};

				platformTranslateService.translateFormConfig(formOptions);

				return formOptions;
			}

			var childProp = 'Activities';
			function getActiveityGridConfig() {
				var gridColumns = [
					{id: 'Id', field: 'IsChecked', name: 'Selected', width: 60, formatter: 'boolean', name$tr$: 'cloud.common.entityChecked', editor: 'boolean', validator: validateIsChecked, pinned: true, editorOptions: { multiSelect: false }},
					{ id: 'Code', field: 'Code', name: 'Code', width: 100, formatter:'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'Description', field: 'Description', name: 'Description', width: 120, formatter:'description',  name$tr$: 'cloud.common.entityDescription' },
					{ id: 'PlannedDuration', field: 'PlannedDuration', name: 'Planned Duration', width: 120, formatter:'number',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.plannedDuration' },
					{ id: 'PlannedStart', field: 'PlannedStart', name: 'Planned Start', width: 120, formatter:'dateutc',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.plannedStart' },
					{ id: 'PlannedFinish', field: 'PlannedFinish', name: 'Planned Finish', width: 120, formatter:'dateutc',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.plannedFinish' },
					{ id: 'ActualStart', field: 'ActualStart', name: 'Actual Start', width: 120, formatter:'dateutc',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.actualStart' },
					{ id: 'ActualFinish', field: 'ActualFinish', name: 'Actual Finish', width: 120, formatter:'dateutc',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.actualFinish' },
					{ id: 'CurrentStart', field: 'CurrentStart', name: 'Current Start', width: 120, formatter:'dateutc',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.currentStart' },
					{ id: 'CurrentFinish', field: 'CurrentFinish', name: 'Current Finish', width: 120, formatter:'dateutc',  name$tr$: 'sales.contract.generatePaymentScheduleFromSchedule.currentFinish' }
				];
				return {
					columns: angular.copy(gridColumns),
					data: [],
					id: $scope.activityGridId,
					gridId: $scope.activityGridId,
					lazyInit: true,
					options: {
						parentProp: 'ParentActivityFk',
						childProp: childProp,
						initialState: 'expanded',
						inlineFilters: false,
						skipPermissionCheck: true,
						iconClass: 'control-icons',
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						multiSelect: false,
						enableConfigSave: true,
						tree: true
					}
				};
			}

			function sendGenerateHttp(activities) {
				var activityParams = [];
				_.forEach(activities, function (a) {
					var addDays = $scope.entity.AfterOrBefore * $scope.entity.DaysOffset;
					var calDate = moment(a[$scope.entity.DayType]).add(addDays, 'd').utc().format();
					activityParams.push({
						Date: calDate,
						ActivityId: a.Id,
						SummaryActivityIds: $scope.currentGenerateOption === generateOptions.fromSummaryOnly ? a.SummaryActivityIds : []
					});
				});
				var param = {
					OrdHeaderFk: header.Id,
					ActivityParams: activityParams,
					ScheduleFk: $scope.entity.ScheduleFk,
					OrdHeaderProjectFk: header.ProjectFk,
					SelectedProjectFk: $scope.entity.ProjectFk,
					CurrentFk: header.CurrencyFk,
					GenerateOption: $scope.currentGenerateOption
				};
				$scope.isLoading = true;

				return $http.post(globals.webApiBaseUrl + 'sales/contract/paymentschedule/generatepaymentschedulefromschedule', param)
					.then(function () {
						$scope.isLoading = false;
						service.load();
						$scope.$close(false);
					});
			}

			function setStep(step) {
				$scope.entity.ActivityIdsObj = null;
				$scope.entity.SummaryIdsObj = null;
				$scope.modalTitle = $translate.instant('sales.contract.generatePaymentScheduleFromSchedule.title') + ' - ' + step + '/2';
				if (step === 2) {
					$scope.selectStep = angular.copy($scope.steps[step-1]);
					if (platformGridAPI.grids.exist($scope.activityGridId)) {
						platformGridAPI.grids.unregister($scope.activityGridId);
					}
					if (!platformGridAPI.grids.exist($scope.activityGridId)) {
						var gridConfig = getActiveityGridConfig();
						platformGridAPI.grids.config(gridConfig);
						platformTranslateService.translateGridConfig(gridConfig.columns);
					}
					$scope.isLoading = true;
					$http.get(globals.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=schedulingactivity&filtervalue=(ScheduleFk=' + $scope.entity.ScheduleFk + ')').then(function (res) {
						activities = res.data;
						$scope.currentGenerateOption = null;
						$scope.selectGenerateOption(generateOptions.fromActivityOnly, true);
						$scope.isLoading = false;
						platformGridAPI.items.data($scope.activityGridId, activities);

					});
				}
				else {
					$scope.selectStep = angular.copy($scope.steps[step-1]);
					if (platformGridAPI.grids.exist($scope.activityGridId)) {
						platformGridAPI.grids.unregister($scope.activityGridId);
					}
				}
			}

			function editableAllSummary(activities) {
				_.forEach(activities, function (item) {
					if (item.IsChecked) {
						item.IsChecked = false;
					}
					if (item[childProp] && item[childProp].length) {
						platformRuntimeDataService.readonly(item, false);
						editableAllSummary(item[childProp]);
					}
					else {
						platformRuntimeDataService.readonly(item, true);
					}
				});
			}

			function editableSummaryAndActivity(activities) {
				_.forEach(activities, function (item) {
					if (item.IsChecked) {
						item.IsChecked = false;
					}
					platformRuntimeDataService.readonly(item, false);
					if (item[childProp] && item[childProp].length) {
						editableSummaryAndActivity(item[childProp]);
					}
				});
			}

			function validateProjectFk(entity, value) {
				if (value) {
					entity.ScheduleFk = null;
				}
			}

			function getActivityIds(activities) {
				var result = [];
				_.forEach(activities, function (a) {
					result.push(a.Id);
					if (a[childProp] && a[childProp].length) {
						var childrenIds = getActivityIds(a[childProp]);
						result = result.concat(childrenIds);
					}
				});
				return result;
			}

			function checkAndReadonlyActivities(items, check, readonly) {
				_.forEach(items, function (item) {
					item.IsChecked = check;
					if (item[childProp] && item[childProp].length) {
						platformRuntimeDataService.readonly(item, readonly);
						checkAndReadonlyActivities(item[childProp], check, readonly);
					}
				});
			}

			function checkChildren(items, check, model) {
				_.forEach(items, function (item) {
					item[model] = check;
					if (item[childProp] && item[childProp].length) {
						checkChildren(item[childProp], check, model);
					}
					else {
						if (check) {
							$scope.entity.ActivityIdsObj[item.Id] = item;
						}
						else {
							delete $scope.entity.ActivityIdsObj[item.Id];
						}
					}
				});
			}

			function validateIsChecked(entity, value, model) {
				if ($scope.currentGenerateOption === generateOptions.fromActivityOnly) {
					if (value) {
						if ($scope.entity.ActivityIdsObj === null) {
							$scope.entity.ActivityIdsObj = {};
						}
						if (entity[childProp] && entity[childProp].length) {
							checkChildren(entity[childProp], value, model);
						}
						else {
							$scope.entity.ActivityIdsObj[entity.Id] = entity;
						}
					}
					else {
						if (entity[childProp] && entity[childProp].length) {
							checkChildren(entity[childProp], value, model);
						}
						else {
							delete $scope.entity.ActivityIdsObj[entity.Id];
						}
					}
					if (entity[childProp] && entity[childProp].length) {
						platformGridAPI.grids.refresh($scope.activityGridId);
					}
				}
				else if ($scope.currentGenerateOption === generateOptions.fromSummaryNActivity) {
					if (value) {
						if ($scope.entity.ActivityIdsObj === null) {
							$scope.entity.ActivityIdsObj = {};
						}
						$scope.entity.ActivityIdsObj[entity.Id] = entity;
					}
					else {
						delete $scope.entity.ActivityIdsObj[entity.Id];
					}
				}
				else if ($scope.currentGenerateOption === generateOptions.fromSummaryOnly) {
					if (value) {
						if (entity[childProp] && entity[childProp].length) {
							if ($scope.entity.SummaryIdsObj === null) {
								$scope.entity.SummaryIdsObj = {};
							}
							$scope.entity.SummaryIdsObj[entity.Id] = entity;
							var activityIds = getActivityIds(entity[childProp]);
							_.forEach(activityIds, function (a) {
								if ($scope.entity.SummaryIdsObj[a]) {
									delete $scope.entity.SummaryIdsObj[a];
								}
							});
							$scope.entity.SummaryIdsObj[entity.Id].SummaryActivityIds = activityIds;
							$scope.entity.SummaryIdsObj[entity.Id].SummaryActivityIds.unshift(entity.Id);
							if (entity[childProp] && entity[childProp].length) {
								checkAndReadonlyActivities(entity[childProp], value, true);
								platformGridAPI.grids.refresh($scope.activityGridId);
							}
						}
					}
					else {
						if (entity[childProp] && entity[childProp].length) {
							delete $scope.entity.SummaryIdsObj[entity.Id];
							checkAndReadonlyActivities(entity[childProp], value, false);
							platformGridAPI.grids.refresh($scope.activityGridId);
						}
					}
				}
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.activityGridId)) {
					platformGridAPI.grids.unregister($scope.activityGridId);
				}
			});
		}
	]);
})();