/**
 * Created by lcn on 2017-11-28.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonGenerateDeliverySchedulePackageController', [
		'$scope', '$translate', 'params', '$http', 'platformGridAPI', 'moment', 'platformModalService', 'platformTranslateService',
		function ($scope, $translate, params, $http, platformGridAPI, moment, platformModalService, platformTranslateService) {

			var mulationPrcItemGridId = '850284D1E74B450EBB5E8D5307B420AA';

			var warningsGridId = 'E2BA3F2439AD41FABC651C73A7D4168D';

			var sourceItems = [
				{
					Id: 1,
					Description: $translate.instant('procurement.common.wizard.generateDeliverySchedule.estlinkedwithSCHD')
				},
				{
					Id: 2,
					Description: $translate.instant('procurement.common.wizard.generateDeliverySchedule.estnotlinkedwithSCHD')
				},
				{Id: 3, Description: $translate.instant('procurement.common.wizard.generateDeliverySchedule.package')}];

			var repeatoption = [
				{id: 1, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.weekly')},
				{id: 2, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.monthly')},
				{id: 3, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.quarterly')},
				{id: 4, value: $translate.instant('procurement.common.wizard.generateDeliverySchedule.userSpecified')}
			];

			var mulationPrcItemGridColumns = [
				{
					id: 'Selected',
					field: 'Selected',
					name: 'All',
					editor: 'boolean',
					headerChkbox: true,
					formatter: function (row, cell, value) {
						var html = '';
						var quantity = $scope.itemsData[row].Quantity;
						if (quantity === 0) {
							html = '<input type="checkbox" unchecked disabled/>';
						}
						else {
							if (value === true) {
								html = '<input type="checkbox" checked />';
							}
							else {
								html = '<input type="checkbox" unchecked/>';
							}
						}
						return '<div class="text-center" >' + html + '</div>';
					},
					width: 50,
					sortable: true,
					name$tr$: 'procurement.common.wizard.generateDeliverySchedule.all'
				},
				{
					id: 'Source',
					field: 'SourceStatus',
					name: 'Source',
					formatter: function (row, cell, value) {
						return sourceItems[value - 1] ? sourceItems[value - 1].Description : '';
					},
					width: 150,
					sortable: true,
					name$tr$: 'procurement.common.wizard.generateDeliverySchedule.source'
				},
				{
					id: 'MaterialCode',
					field: 'MdcMaterialFk',
					name: 'Material Code',
					width: 100,
					sortable: true,
					name$tr$: 'basics.common.entityMaterialCode',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialRecord',
						displayMember: 'Code'
					}
				},
				{
					id: 'MaterialDescription',
					field: 'Description1',
					width: 120,
					name: 'Material Description',
					formatter: 'description',
					name$tr$: 'basics.common.entityMaterialDescription',
					sortable: true,
					readonly: true
				},
				{
					id: 'Quantity',
					field: 'Quantity',
					name: 'Quantity',
					formatter: 'quantity',
					width: 100,
					sortable: true,
					name$tr$: 'procurement.stotktotal.Quantity'
				},
				{
					id: 'BasUomFk',
					field: 'BasUomFk',
					name: 'Uom',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					sortable: true,
					name$tr$: 'cloud.common.entityUoM'
				},
				{
					id: 'dateRequired',
					field: 'DateRequired',
					name: 'Required',
					name$tr$: 'cloud.common.entityRequiredBy',
					formatter: 'date',
					width: 100,
					sortable: true,
					searchable: false
				},{
					id: 'SafetyLeadTime',
					field: 'SafetyLeadTime',
					name: 'Safety Lead Time',
					name$tr$: 'procurement.common.safetyLeadTime',
					formatter: 'decimal',
					width: 100,
					sortable: true,
					searchable: false,
					readonly: true
				}];

			$scope.gridData = {
				state: mulationPrcItemGridId,
				moduleState: {}
			};

			var warningsGridColumns = [
				{
					id: 'MaterialCode',
					field: 'MdcMaterialFk',
					name: 'Material Code',
					width: 100,
					name$tr$: 'basics.common.entityMaterialCode',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialRecord',
						displayMember: 'Code'
					}
				},
				{
					id: 'MaterialDescription',
					field: 'Description1',
					width: 120,
					name: 'Material Description',
					formatter: 'description',
					name$tr$: 'basics.common.entityMaterialDescription',
					readonly: true
				},
				{
					id: 'PackageQuantity',
					field: 'PackageQuantity',
					name: 'Package Quantity',
					formatter: 'quantity',
					width: 120,
					name$tr$: 'procurement.common.wizard.generateDeliverySchedule.packageQuantity'
				},
				{
					id: 'EstimateQuantity',
					field: 'EstimateQuantity',
					name: 'Estimate Quantity',
					formatter: 'quantity',
					width: 120,
					name$tr$: 'procurement.common.wizard.generateDeliverySchedule.estimateQuantity'
				},
				{
					id: 'Difference',
					field: 'Difference',
					name: 'Difference',
					formatter: 'quantity',
					width: 110,
					name$tr$: 'procurement.common.wizard.generateDeliverySchedule.difference'
				},
				{
					id: 'BasUomFk',
					field: 'BasUomFk',
					name: 'Uom',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					width: 110,
					name$tr$: 'cloud.common.entityUoM'
				}];

			$scope.warningsData = {
				state: warningsGridId,
				moduleState: {}
			};

			$scope.steps = [
				{
					number: 0,
					buttons: [
						{
							label: 'cloud.common.nextStep',
							action: NextStep
						},
						{
							label: 'cloud.common.cancel',
							action: close
						}
					]
				},
				{
					number: 1,
					buttons: [
						{
							label: 'cloud.common.previousStep',
							action: previousStep
						},
						{
							label: 'cloud.common.nextStep',
							action: NextStep,
							disable: function () {
								return !canToNext();
							}
						},
						{
							label: 'cloud.common.cancel',
							action: close
						}
					]
				},
				{
					number: 2,
					buttons: [
						{
							label: 'cloud.common.previousStep',
							action: previousStep
						},
						{
							label: 'cloud.common.ok',
							action: goToOk,
							disable: function () {
								return !canToOk();
							}
						},
						{
							label: 'cloud.common.cancel',
							action: close
						}
					]
				},
				{
					number: 3,
					buttons: [
						{
							label: 'cloud.common.previousStep',
							action: previousStep
						},
						{
							label: 'basics.common.continue',
							action: goToContinue
						},
						{
							label: 'cloud.common.cancel',
							action: close
						}
					]
				},
				{
					number: 4,
					buttons: [
						{
							label: 'basics.common.ok',
							action: close
						}
					]
				}];

			$scope.currentStep = angular.copy($scope.steps[0]);

			$scope.itemsData = null;

			$scope.allIsSource_1 = false;// jshint ignore:line

			$scope.maxSafetyLeadTime = 0;

			$scope.modalOptions = {
				linkedEstLineItem: false,
				linkedActivity: false,
				descriptionPrefix: null,
				repeat: '1',
				startDate: null,
				occurence: null,
				endDate: null,
				timeRequired: null,
				initStartDate: params.selectedLead.PlannedStart || new moment.utc(),
				initEndDate: params.selectedLead.PlannedEnd || null,
				selectItems: null,
				repeatOption: repeatoption,
				hasActivity: !(params.selectedLead.ActivityFk === null),// jshint ignore:line
				roundUpQuantity: false,
				fromScope: 1,
				useTempSafetyLeadTime: null,
				headerText: $translate.instant('procurement.common.wizard.generateDeliverySchedule.wizard') + ' - ' + $translate.instant('procurement.common.wizard.generateDeliverySchedule.page') + ($scope.currentStep.number + 1) + ' / 3',
				cancel: close
			};

			$scope.modalOptionsIsDisable = {
				linkedEstLineItem: true,
				linkedActivity: (params.selectedLead.ActivityFk === null),
				startDate: false,
				occurence: true,
				endDate: false,
				timeRequired: false,
				useTempSafetyLeadTime: false,
				useTempSafetyLeadTimeCheckbox: true
			};

			$scope.modalOptionsError = {
				rt$hasError: hasError,
				rt$errorText: null
			};

			$scope.linkedActivitCheck = function () {
				if ($scope.allIsSource_1) {// jshint ignore:line
					$scope.modalOptionsIsDisable.linkedEstLineItem = $scope.modalOptions.linkedActivity;
				}
				if ($scope.modalOptions.linkedActivity) {
					var maxSafetyLeadTime = _.maxBy($scope.modalOptions.selectItems, 'SafetyLeadTime').SafetyLeadTime;
					maxSafetyLeadTime = Math.ceil(maxSafetyLeadTime);
					$scope.modalOptionsIsDisable.useTempSafetyLeadTimeCheckbox = !$scope.modalOptions.linkedActivity;
					$scope.modalOptions.useTempSafetyLeadTime = maxSafetyLeadTime;
				}
				else {
					$scope.modalOptionsIsDisable.useTempSafetyLeadTimeCheckbox = !$scope.modalOptions.linkedActivity;
					$scope.modalOptions.useTempSafetyLeadTime = null;
				}
			};

			$scope.linkedEstLineItemCheck = function () {
				if ($scope.modalOptions.hasActivity) {
					$scope.modalOptionsIsDisable.linkedActivity = $scope.modalOptions.linkedEstLineItem;
					$scope.modalOptions.linkedActivity = false;
				}
				if ($scope.modalOptions.linkedEstLineItem) {
					var maxSafetyLeadTime = _.maxBy($scope.modalOptions.selectItems, 'SafetyLeadTime').SafetyLeadTime;
					maxSafetyLeadTime = Math.ceil(maxSafetyLeadTime);
					$scope.modalOptionsIsDisable.useTempSafetyLeadTimeCheckbox = !$scope.modalOptions.linkedEstLineItem;
					$scope.modalOptions.useTempSafetyLeadTime = maxSafetyLeadTime;
				}
				else {
					$scope.modalOptionsIsDisable.useTempSafetyLeadTimeCheckbox = !$scope.modalOptions.linkedEstLineItem;
					$scope.modalOptions.useTempSafetyLeadTime = null;
				}
			};

			$scope.repeatOptionChanged = function () {
				if ($scope.modalOptions.repeat === '4') {
					$scope.modalOptionsIsDisable.occurence = false;
					$scope.modalOptions.occurence = 1;
				} else {
					$scope.modalOptionsIsDisable.occurence = true;
					if ($scope.modalOptions.linkedEstLineItem) {
						$scope.modalOptions.occurence = null;
					}
					calculatetion();
				}
			};

			$scope.safetyLeadTimeCheckboxChanged = function () {
				var maxSafetyLeadTime = _.maxBy($scope.modalOptions.selectItems, 'SafetyLeadTime').SafetyLeadTime;
				maxSafetyLeadTime = Math.ceil(maxSafetyLeadTime);
				if (!$scope.modalOptionsIsDisable.useTempSafetyLeadTime) {
					$scope.modalOptions.useTempSafetyLeadTime = maxSafetyLeadTime;
					safetyLeadTimeOptionChanged();
				}
			};

			$scope.safetyLeadTimeOptionChanged = safetyLeadTimeOptionChanged;
			function safetyLeadTimeOptionChanged() {
				if ($scope.modalOptions.linkedEstLineItem) {
					// If option #1 is true
					// noinspection JSUnresolvedVariable
					var minStartDate = _.minBy($scope.modalOptions.selectItems, 'MinStartDate').MinStartDate;
					// noinspection JSUnresolvedVariable
					var maxFinishDate = _.maxBy($scope.modalOptions.selectItems, 'MaxFinishDate').MaxFinishDate;
					$scope.modalOptions.startDate = moment.utc(minStartDate).subtract($scope.modalOptions.useTempSafetyLeadTime, 'd');
					$scope.modalOptions.endDate = moment.utc(maxFinishDate).subtract($scope.modalOptions.useTempSafetyLeadTime, 'd');
					$scope.modalOptionsIsDisable.startDate = $scope.modalOptionsIsDisable.endDate = true;
					calculatetion();
				}
				else if ($scope.modalOptions.linkedActivity) {
					// If option #2 is true
					// params.selectedLead.ActivityFk
					$http.get(globals.webApiBaseUrl + 'scheduling/main/activity/get?activityId=' + params.selectedLead.ActivityFk).then(function (response) {
						if (response.data) {
							$scope.modalOptions.startDate = moment.utc(response.data.CurrentStart).subtract($scope.modalOptions.useTempSafetyLeadTime, 'd');
							$scope.modalOptions.endDate = moment.utc(response.data.CurrentFinish).subtract($scope.modalOptions.useTempSafetyLeadTime, 'd');
							$scope.modalOptionsIsDisable.startDate = $scope.modalOptionsIsDisable.endDate = true;
							calculatetion();
						}
					});
				}
			}

			$scope.startDateChanged = function () {
				calculatetion();
			};

			$scope.endDateChanged = function () {
				calculatetion();
			};

			$scope.getTitleText = function () {
				if ($scope.currentStep.number < 3) {
					return $translate.instant('procurement.common.wizard.generateDeliverySchedule.wizard') + ' - ' + $translate.instant('procurement.common.wizard.generateDeliverySchedule.page') + ($scope.currentStep.number + 1) + ' / 3';
				}
				else if (isCurrentStep(3)) {
					return $translate.instant('procurement.common.wizard.generateDeliverySchedule.warnings');
				}
				else {
					return $translate.instant('procurement.common.wizard.generateDeliverySchedule.succeed');
				}
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister(mulationPrcItemGridId);
				platformGridAPI.events.unregister(mulationPrcItemGridId, 'onHeaderCheckboxChanged', checkAll);
				platformGridAPI.events.unregister(mulationPrcItemGridId, 'onCellChange', onCellChange);
			});


			function initMulationPrcItemGrid() {
				var mulationPrcItemGridConfig = {
					columns: angular.copy(mulationPrcItemGridColumns),
					data: [],
					id: mulationPrcItemGridId,
					lazyInit: true,
					enableConfigSave: true,
					options: {
						indicator: true,
						idProperty: 'Id'
					}
				};
				platformGridAPI.grids.config(mulationPrcItemGridConfig);
				platformTranslateService.translateGridConfig(mulationPrcItemGridConfig.columns);
				platformGridAPI.events.register(mulationPrcItemGridId, 'onHeaderCheckboxChanged', checkAll);
				platformGridAPI.events.register(mulationPrcItemGridId, 'onCellChange', onCellChange);

			}

			function initContainItem() {
				var requestData = {
					PackageId: params.selectedLead.Id,
					PrcItemEntities: params.selectedPrcItems,
					IsFromPackage: true,
					IsFromAllSubPackage: $scope.modalOptions.fromScope === '2'
				};
				var _selectedPrcItems = _.cloneDeep(params.selectedPrcItems);
				if(!_.isNil(_selectedPrcItems)){
					_selectedPrcItems.forEach(function (item) {
						if(item.BlobSpecificationToSave !== null){
							item.BlobSpecificationToSave = null;
						}
					});
					requestData.PrcItemEntities = _selectedPrcItems;
				}
				$scope.isLoading = true;
				if (requestData.PrcItemEntities.length > 0 || (requestData.PrcItemEntities.length === 0 && requestData.IsFromAllSubPackage)) {
					$http.post(globals.webApiBaseUrl + 'procurement/common/deliveryschedule/getsourcelist', requestData)
						.then(function (response) {
							var itemsData = response.data;
							var isEnable = !isEnableOption1(itemsData);
							$scope.modalOptionsIsDisable.linkedEstLineItem = isEnable;
							$scope.allIsSource_1 = !isEnable;// jshint ignore:line
							$scope.itemsData = itemsData;
							$scope.modalOptions.selectItems = itemsData;
							platformGridAPI.items.data(mulationPrcItemGridId, filterPrcItem(itemsData, true));
							$scope.isLoading = false;
						});
				}
				else {
					platformGridAPI.items.data(mulationPrcItemGridId, $scope.itemsData);
					$scope.modalOptionsIsDisable.linkedEstLineItem = true;
					$scope.modalOptionsIsDisable.linkedActivity = true;
					$scope.isLoading = false;
				}
			}

			/**
             * @return {boolean}
             */
			function isEnableOption1(itemsData) {
				var items = _.filter(itemsData, function (item) {
					/** @namespace item.SourceStatus */
					// noinspection JSValidateTypes
					return item.SourceStatus === 3 || item.SourceStatus === 2;
				});
				if (itemsData.length === 0) {
					return false;
				}
				return items.length === 0;
			}

			function checkAll() {
				var gridData = platformGridAPI.items.data(mulationPrcItemGridId);
				platformGridAPI.items.data(mulationPrcItemGridId, gridData);
				$scope.$apply(function () {
					onCellChange();
				});
			}

			function onCellChange() {
				var gridData = platformGridAPI.items.data(mulationPrcItemGridId);
				if (_.isNil(gridData)) {
					gridData = filterPrcItem($scope.itemsData, true);
				}

				var items = _.filter(gridData, function (item) {
					return item.Selected === true;
				});
				$scope.modalOptions.selectItems = items;
				var isEnable = !isEnableOption1(items);
				if (isEnable) {
					$scope.modalOptions.linkedEstLineItem = false;
					if ($scope.modalOptions.hasActivity) {
						$scope.modalOptionsIsDisable.linkedActivity = false;
					}
				}
				$scope.modalOptionsIsDisable.linkedEstLineItem = isEnable;
				$scope.allIsSource_1 = !isEnable;// jshint ignore:line
			}

			function filterPrcItem(selectedPrcItems, IsSelected) {
				_.forEach(selectedPrcItems, function (item) {
					if (item.Quantity > 0) {
						item.Selected = IsSelected;
					}
				});
				return selectedPrcItems;
			}

			function filter(items) {
				return _.filter(items, function (item) {
					return item.Quantity !== 0;
				});
			}

			function GetIds(items) {
				return _.map(_.filter(items, function (item) {return item.Quantity !== 0;}), 'Id');
			}

			function close() {
				$scope.$close({isOk: isCurrentStep(4)});
			}

			function isCurrentStep(value) {
				return $scope.currentStep.number === value;
			}

			function setCurrentStep(value) {
				$scope.currentStep = angular.copy($scope.steps[value]);
				$scope.modalOptions.headerText = $scope.getTitleText();
			}

			function previousStep() {
				if (isCurrentStep(2)) {
					initMulationPrcItemGrid();
					platformGridAPI.items.data(mulationPrcItemGridId, $scope.itemsData);
					$scope.modalOptions.startDate = null;
					$scope.modalOptions.endDate = null;
					$scope.modalOptions.descriptionPrefix = null;
					$scope.modalOptions.repeat = '1';
					$scope.modalOptions.occurence = null;
					$scope.modalOptionsIsDisable.occurence = true;
					$scope.modalOptions.timeRequired = null;
					if ($scope.modalOptions.linkedEstLineItem || $scope.modalOptions.linkedActivity) {
						var maxSafetyLeadTime = _.maxBy($scope.modalOptions.selectItems, 'SafetyLeadTime').SafetyLeadTime;
						$scope.modalOptionsIsDisable.useTempSafetyLeadTime = false;
						$scope.modalOptions.useTempSafetyLeadTime = Math.ceil(maxSafetyLeadTime);
					}
				}
				setCurrentStep($scope.currentStep.number - 1);
			}

			function NextStep() {
				if (isCurrentStep(0)) {
					$scope.modalOptions.linkedEstLineItem = false;
					$scope.modalOptions.linkedActivity = false;
					initMulationPrcItemGrid();
					initContainItem();
				}
				else {
					calculatetionLogic();
				}
				setCurrentStep($scope.currentStep.number + 1);
			}

			function calculatetionLogic() {
				var selectItems = $scope.modalOptions.selectItems;
				var maxSafetyLeadTime = _.maxBy(selectItems, 'SafetyLeadTime').SafetyLeadTime;
				maxSafetyLeadTime = Math.ceil(maxSafetyLeadTime);
				$scope.maxSafetyLeadTime = maxSafetyLeadTime;
				if ($scope.modalOptions.linkedEstLineItem) {
					// If option #1 is true
					// noinspection JSUnresolvedVariable
					var minStartDate = _.minBy(selectItems, 'MinStartDate').MinStartDate;
					// noinspection JSUnresolvedVariable
					var maxFinishDate = _.maxBy(selectItems, 'MaxFinishDate').MaxFinishDate;
					$scope.modalOptions.startDate = moment.utc(minStartDate).subtract(maxSafetyLeadTime, 'd');
					$scope.modalOptions.endDate = moment.utc(maxFinishDate).subtract(maxSafetyLeadTime, 'd');
					$scope.modalOptionsIsDisable.startDate = $scope.modalOptionsIsDisable.endDate = true;
					calculatetion();
				}
				else if ($scope.modalOptions.linkedActivity) {
					// If option #2 is true
					// params.selectedLead.ActivityFk
					$http.get(globals.webApiBaseUrl + 'scheduling/main/activity/get?activityId=' + params.selectedLead.ActivityFk).then(function (response) {
						if (response.data) {
							$scope.modalOptions.startDate = moment.utc(response.data.CurrentStart).subtract(maxSafetyLeadTime, 'd');
							$scope.modalOptions.endDate = moment.utc(response.data.CurrentFinish).subtract(maxSafetyLeadTime, 'd');
							$scope.modalOptionsIsDisable.startDate = $scope.modalOptionsIsDisable.endDate = true;
							calculatetion();
						}
					});
				}
				else {// If activity option is false
					$scope.modalOptions.startDate = params.selectedLead.PlannedStart || new moment.utc();
					$scope.modalOptions.endDate = params.selectedLead.PlannedEnd;
					$scope.modalOptionsIsDisable.startDate = $scope.modalOptionsIsDisable.endDate = false;
					calculatetion();
				}
			}

			function hasError() {
				if ($scope.modalOptions.timeRequired === undefined) {
					$scope.modalOptionsError.rt$errorText = $translate.instant('procurement.common.wizard.generateDeliverySchedule.invalidDateFormat');
					return true;
				}
				if ($scope.modalOptions.startDate && $scope.modalOptions.endDate) {
					// //If activity option is false
					var startDate = toformat($scope.modalOptions.startDate);
					var endDate = toformat($scope.modalOptions.endDate);
					var duration = _.round(moment.duration(endDate.diff(startDate)).asDays(), 0) + 1;
					if (duration > 0) {
						if (duration < $scope.modalOptions.occurence) {
							$scope.modalOptionsError.rt$errorText = $translate.instant('procurement.common.wizard.generateDeliverySchedule.deliveryModifyOccurenceByError');
							return true;
						}
						return false;
					}
					else {
						$scope.modalOptionsError.rt$errorText = $translate.instant('procurement.common.wizard.generateDeliverySchedule.deliveryModifyTimeByError');
						return true;
					}
				}
				return false;
			}

			function calculatetion() {
				if ($scope.modalOptions.startDate && $scope.modalOptions.endDate && $scope.modalOptions.repeat !== '4') {
					var repeat = $scope.modalOptions.repeat;
					var occurence = 1;
					if (repeat === '1') {// weekly
						occurence = $scope.modalOptions.endDate.diff($scope.modalOptions.startDate, 'week') + 1;
					}
					else if (repeat === '2') {// monthly
						occurence = $scope.modalOptions.endDate.diff($scope.modalOptions.startDate, 'month') + 1;
					}
					else {// quarterly
						occurence = $scope.modalOptions.endDate.diff($scope.modalOptions.startDate, 'quarter') + 1;
					}
					$scope.modalOptions.occurence = occurence;
				}
				else {
					if ($scope.modalOptions.startDate === null || $scope.modalOptions.endDate === null) {
						$scope.modalOptions.occurence = null;
					}
				}
			}

			function toformat(Date) {
				return moment.utc(moment.utc(Date).format('YYYY-MM-DDT00:00:00'));
			}

			function getTimeRequired() {
				var timeRequired = $scope.modalOptions.timeRequired;
				if (timeRequired === null || timeRequired === 'Invalid date') {
					return null;
				}
				else {
					return toLocalDate(timeRequired);
				}
			}

			function toLocalDate(date) {
				date = !angular.isDate(date) ? new Date(date) : date;
				var utcString = date.toUTCString();
				return new Date(utcString).getHours() + ':' + new Date(utcString).getMinutes() + ':00';
			}

			function canToNext() {
				return !_.isNil($scope.modalOptions.selectItems) && filter($scope.modalOptions.selectItems).length > 0;
			}

			function canToOk() {
				if ($scope.modalOptions.linkedEstLineItem) {
					return !_.isNil($scope.modalOptions.selectItems) && $scope.modalOptions.selectItems.length > 0 && ($scope.modalOptions.repeat !== '4' || ($scope.modalOptions.repeat === '4' && $scope.modalOptions.occurence !== '' && !_.isNil($scope.modalOptions.occurence))) && hasError() === false;
				} else {
					return !_.isNil($scope.modalOptions.selectItems)&& $scope.modalOptions.selectItems.length > 0 && !_.isNil($scope.modalOptions.startDate) && !_.isNil($scope.modalOptions.endDate) && $scope.modalOptions.occurence !== '' && !_.isNil($scope.modalOptions.occurence) && hasError() === false;
				}
			}

			function goToOk() {
				save(false);
			}

			function goToContinue() {
				save(true);
			}

			function save(isContinue) {
				var requestData = {
					LinkedActivity: $scope.modalOptions.linkedActivity,
					LinkedEstLineItem: $scope.modalOptions.linkedEstLineItem,
					DescriptionPrefix: $scope.modalOptions.descriptionPrefix,
					Repeat: $scope.modalOptions.repeat,
					StartDate: $scope.modalOptions.startDate,
					Occurence: $scope.modalOptions.occurence,
					EndDate: $scope.modalOptions.endDate,
					TimeRequired: getTimeRequired(),
					SelectIds: GetIds($scope.modalOptions.selectItems),
					IsContinue: isContinue,
					RoundUpQuantity: $scope.modalOptions.roundUpQuantity
				};
				$scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'procurement/common/deliveryschedule/save', requestData).then(function (response) {
					if (response.data.length === 0) {
						setCurrentStep(4);
						$scope.isLoading = false;
					}
					else {
						setCurrentStep(3);
						getwarningItemGrid(response.data);
						$scope.isLoading = false;
					}
				});
			}

			function getwarningItemGrid(warningsData) {
				var warningsGridConfig = {
					columns: angular.copy(warningsGridColumns),
					data: [],
					id: warningsGridId,
					lazyInit: true,
					enableConfigSave: true,
					options: {
						indicator: true,
						idProperty: 'Id'
					}
				};
				platformGridAPI.grids.config(warningsGridConfig);
				platformTranslateService.translateGridConfig(warningsGridConfig.columns);
				platformGridAPI.items.data(warningsGridId, warningsData);
			}
		}

	]);

})(angular);