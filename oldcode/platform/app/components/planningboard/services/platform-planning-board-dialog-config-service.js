/**
 * created by saa.mik 27.03.2020
 */
(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardDialogConfigService', PlatformPlanningBoardDialogConfigService);

	PlatformPlanningBoardDialogConfigService.$inject = ['_', '$translate', '$timeout', 'platformPlanningBoardTagGridConfigService', 'platformPlanningBoardLabelConfigService'];

	function PlatformPlanningBoardDialogConfigService(_, $translate, $timeout, platformPlanningBoardTagGridConfigService, platformPlanningBoardLabelConfigService) {
		var service = this;

		service = {
			getDialogConfig: getDialogConfig,
			setDialogConfig: setDialogConfig
		};

		service.dialogConfigs = new Map();

		let labelInputs = {
			main: {},
			info1: {},
			info2: {},
			info3: {}
		};

		function setDialogConfig(uuid, assignmentMappingService, demandMappingService) {
			if (!service.dialogConfigs.get(uuid)) {
				let labelLookupServiceName = '';
				if (assignmentMappingService && _.isFunction(assignmentMappingService.getLabelLookupServiceName)) {
					labelLookupServiceName = assignmentMappingService.getLabelLookupServiceName();
					platformPlanningBoardLabelConfigService.setDirectiveLabelDropDowns(labelInputs, labelLookupServiceName);
				} else {
					platformPlanningBoardLabelConfigService.setTextLabelDropDowns(labelInputs);
				}
				if (assignmentMappingService) {
					let dialogConfig = getConfig(assignmentMappingService);
					addGridFilterConfig(dialogConfig, assignmentMappingService, demandMappingService);

					service.dialogConfigs.set(uuid, dialogConfig);
				}
			} else if (assignmentMappingService && _.isFunction(assignmentMappingService.getExtraDropdownProperties)) {
				let dialogConfig = getConfig(assignmentMappingService);
				addGridFilterConfig(dialogConfig, assignmentMappingService, demandMappingService);
				service.dialogConfigs.set(uuid, dialogConfig);
			}
		}

		/**
		 * @description Adds extra filter options to planning board settings configuration
		 *
		 * @param dialogConfig
		 * @param assignmentMappingService
		 * @param demandMappingService
		 */
		function addGridFilterConfig(dialogConfig, assignmentMappingService, demandMappingService) {
			// currently, there's only one filtering function - in demand mapping service -> don't add filter group when no filtering function available
			if (demandMappingService && _.isFunction(demandMappingService.filterDemands)) {
				let gridSettingsItem = dialogConfig.items.find(item => _.isEqual(item.id, 'planningBoard.chart.gridSettings'));
				gridSettingsItem.form.groups.push({
					gid: '2',
					header: '*Filter',
					header$tr$: 'platform.planningboard.filter',
					isOpen: true,
					visible: true,
					sortOrder: 2
				});

				let sortOrder = 1;

				gridSettingsItem.form.rows.push(
					{
						gid: '2',
						rid: 'filterDemands',
						label: '*Filter Demands',
						label$tr$: 'platform.planningboard.filterDemands',
						type: 'boolean',
						model: 'filterDemands',
						visible: true,
						sortOrder: sortOrder++
					}
				);

			}
		}

		function getDialogConfig(uuid) {
			return service.dialogConfigs.get(uuid);
		}

		/* private functions */
		function getConfig(assignmentMappingService) {
			let Properties = (_.isFunction(assignmentMappingService.getSumAggrgationProperties)) ? assignmentMappingService.getSumAggrgationProperties() : [];
			let line1 = [];
			let line2 = [];
			let line3 = [];


			if (Properties && Properties.length !== 0) {
				line1 = Properties.get('line1');
				line2 = Properties.get('line2');
				line3 = Properties.get('line3');
			}

			let showLine1Property = (line1.length) ? true : false;
			let showLine2Property = (line2.length) ? true : false;
			let showLine3Property = (line3.length) ? true : false;

			let sumAggregationOptions = [
				{ value: 'empty', id: 'empty', caption: ' ' },
				{ value: 'amount', id: 'amount', caption: $translate.instant('platform.planningboard.amount') }
			];

			let sumBackgroundColorOptions = [
				{ value: 'default', id: 'defaultcolor', caption: $translate.instant('platform.planningboard.backgroundColorConfig.default') },
				{ value: 'status', id: 'statuscolor', caption: $translate.instant('platform.planningboard.backgroundColorConfig.status') },
				{ value: 'project', id: 'projectcolor', caption: $translate.instant('platform.planningboard.backgroundColorConfig.project') }
			];
			if (_.isFunction(assignmentMappingService.ppsHeaderColor)) {
				let ppsHeaderOptions = { value: 'ppsHeader', id: 'ppsHeadercolor', caption: $translate.instant('platform.planningboard.backgroundColorConfig.ppsHeader') };
				sumBackgroundColorOptions.push(ppsHeaderOptions);
			}
			if (_.isFunction(assignmentMappingService.useCapacities) && assignmentMappingService.useCapacities()) {
				let quantityOptions = [
					{ value: 'targetValue', id: 'targetValue', caption: $translate.instant('platform.planningboard.targetValue') },
					{ value: 'actualValue', id: 'actualValue', caption: $translate.instant('platform.planningboard.actualValue') },
					{ value: 'residualValue', id: 'residualValue', caption: $translate.instant('platform.planningboard.residualValue') }
				];
				sumAggregationOptions = [...sumAggregationOptions, ...quantityOptions];
			}

			if (_.isFunction(assignmentMappingService.getCustomAggregationDropdownOptions)) {
				sumAggregationOptions = [...sumAggregationOptions, ...assignmentMappingService.getCustomAggregationDropdownOptions()];
			}

			return {
				dialogTitle: 'platform.planningboard.configDialog',
				itemDisplayMember: 'description',
				resizeable: true,
				width: 800,
				height: 500,
				items: [
					{
						id: 'planningBoard.chart.presentation.settings',
						version: '1.0.0',
						description: $translate.instant('platform.planningboard.chartPresentation'),
						form: {
							fid: 'platform.planningBoard.configDetail',
							version: '1.0.0',
							showGrouping: true,
							change: 'change',
							groups: [
								{
									gid: '4',
									header: 'General',
									header$tr$: 'platform.planningboard.general',
									isOpen: true,
									visible: true,
									sortOrder: 1
								},
								{
									gid: '7',
									header: '*Collection',
									header$tr$: 'platform.planningboard.collection',
									isOpen: true,
									visible: true,
									sortOrder: 10
								},
								{
									gid: '1',
									header: 'Assignment',
									header$tr$: 'platform.planningboard.assignment',
									isOpen: true,
									visible: true,
									sortOrder: 20
								},
								{
									gid: '8',
									header: '*Aggregation',
									header$tr$: 'platform.planningboard.aggregation',
									isOpen: true,
									visible: true,
									sortOrder: 25
								},
								{
									gid: '9',
									header: '*Sum Aggregation',
									header$tr$: 'platform.planningboard.sumAggregation',
									isOpen: true,
									visible: true,
									sortOrder: 26
								},
								{
									gid: '5',
									header: 'Tagging',
									header$tr$: 'platform.planningboard.tagging',
									isOpen: true,
									visible: true,
									sortOrder: 30
								},
								{
									gid: '2',
									header: 'Text',
									header$tr$: 'platform.planningboard.text',
									isOpen: false,
									visible: true,
									sortOrder: 40
								},
								{
									gid: '3',
									header: 'Misc',
									header$tr$: 'platform.planningboard.misc',
									isOpen: false,
									visible: true,
									sortOrder: 50
								},
								{
									gid: '6',
									header: '*Zoom',
									header$tr$: 'platform.planningboard.zoom',
									isOpen: false,
									visible: true,
									sortOrder: 60
								},
								{
									gid: '10',
									header: '*Aggregation Traffic Lights',
									header$tr$: 'platform.planningboard.aggregationTrafficLightsConfig',
									isOpen: true,
									visible: true,
									sortOrder: 27
								}
							],
							rows: [
								{
									gid: '1',
									rid: 'ShowHeaderColor',
									label$tr$: 'platform.planningboard.showHeaderColor',
									type: 'boolean',
									model: 'showHeaderColor',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '1',
									rid: 'ShowSameAssignments',
									label$tr$: 'platform.planningboard.showSameAssignments',
									type: 'boolean',
									model: 'showSameAssignments',
									visible: true,
									sortOrder: 2
								},
								{
									gid: '1',
									rid: 'ShowStatusIcon',
									label$tr$: 'platform.planningboard.showStatusIcon',
									type: 'boolean',
									model: 'showStatusIcon',
									visible: true,
									sortOrder: 3
								},
								{
									gid: '1',
									rid: 'showInTransportIcon',
									label$tr$: 'platform.planningboard.showInTransportIcon',
									type: 'boolean',
									model: 'showInTransportIcon',
									visible: true,
									sortOrder: 4
								},
								{
									gid: '1',
									rid: 'BackgroundColorConfig',
									label: '*Backgroundcolor',
									label$tr$: 'platform.planningboard.setBackgroundColorConfig',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: sumBackgroundColorOptions
									},
									model: 'backgroundColorConfig',
									visible: true,
									sortOrder: 4,
									readonly: false,
								},
								{
									gid: '1',
									rid: 'ShowTypeIcon',
									label$tr$: 'platform.planningboard.showTypeIcon',
									type: 'boolean',
									model: 'showTypeIcon',
									visible: true,
									sortOrder: 5
								},
								{
									gid: '1',
									rid: 'IgnoreIsFullyCovered',
									label$tr$: 'platform.planningboard.ignoreIsFullyCovered', // platform.planningboard.ignoreIsFullyCovered
									type: 'boolean',
									model: 'ignoreIsFullyCovered',
									visible: true,
									sortOrder: 6
								},
								{
									gid: '1',
									rid: 'IgnoreIsNotFullyCovered',
									label$tr$: 'platform.planningboard.ignoreIsNotFullyCovered', // platform.planningboard.ignoreIsNotFullyCovered
									type: 'boolean',
									model: 'ignoreIsNotFullyCovered',
									visible: true,
									sortOrder: 7
								},
								{
									gid: '1',
									rid: 'useDemandTimesForReservation',
									label$tr$: 'platform.planningboard.useDemandTimesForReservation',
									label: '*Use Demand Times For Reservation',
									type: 'boolean',
									model: 'useDemandTimesForReservation',
									visible: true,
									sortOrder: 8
								},
								{
									gid: '1',
									rid: 'useFixedAssignmentHeight',
									label$tr$: 'platform.planningboard.useFixedAssignmentHeight',
									label: '*Minimal Height',
									type: 'boolean',
									model: 'useFixedAssignmentHeight',
									visible: true,
									sortOrder: 9
								},
								{
									gid: '4',
									rid: 'ShowHeaderBackground',
									label$tr$: 'platform.planningboard.showHeaderBackground',
									type: 'boolean',
									model: 'showHeaderBackground',
									visible: true,
									sortOrder: 10
								},
								{
									gid: '4',
									rid: 'ValidateAssignments',
									label$tr$: 'platform.planningboard.validateAssignments',
									type: 'boolean',
									model: 'validateAssignments',
									visible: true,
									sortOrder: 15
								},
								{
									gid: '4',
									rid: 'rowHeight',
									label$tr$: 'platform.planningboard.rowHeight',
									type: 'integer',
									model: 'rowHeight',
									visible: true,
									sortOrder: 20,
									validator: function validateRowHeight(entity, modelValue, field) {
										// let ngModel apply its value and check it after
										$timeout(function validateRowHeight() {
											if (modelValue > 0 && modelValue < window.innerHeight) {
												entity[field] = modelValue;
											} else {
												// apply default value
												entity[field] = 55;
											}
										}, 0);
										return true;
									}
								},
								{
									gid: '4',
									rid: 'showDemandPreview',
									label: '*Show Demand Preview',
									label$tr$: 'platform.planningboard.demandpreview',
									type: 'boolean',
									model: 'showDemandPreview',
									visible: true,
									sortOrder: 16
								},
								{
									gid: '4',
									rid: 'useFlexibleRowHeight',
									label: '*Flexible Row height',
									label$tr$: 'platform.planningboard.flexibleRowHeight',
									type: 'boolean',
									model: 'useFlexibleRowHeight',
									visible: true,
									sortOrder: 17
								},
								{
									gid: '4',
									rid: 'reloadOnChangeFullyCovered',
									label: 'Reload on Change to fully covered',
									label$tr$: 'platform.planningboard.reloadOnChangeFullyCovered',
									type: 'boolean',
									model: 'reloadOnChangeFullyCovered',
									visible: true,
									sortOrder: 18
								},
								{
									gid: '7',
									rid: 'background',
									label$tr$: 'platform.planningboard.background',
									label: '*Background',
									type: 'color',
									model: 'collectionConfig.background',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '7',
									rid: 'font',
									label$tr$: 'platform.planningboard.font',
									label: '*Font',
									type: 'color',
									model: 'collectionConfig.font',
									visible: true,
									sortOrder: 2
								},
								{
									gid: '7',
									rid: 'border',
									label$tr$: 'platform.planningboard.border',
									label: '*Border',
									type: 'color',
									model: 'collectionConfig.border',
									visible: true,
									sortOrder: 3
								},
								{
									gid: '2',
									rid: 'ShowMainText',
									label: '*Show Main Text',
									label$tr$: 'platform.planningboard.showMainLabelText',
									type: 'boolean',
									model: 'showMainText',
									visible: true,
									sortOrder: 1
								},
								labelInputs.main,
								{
									gid: '2',
									rid: 'ShowInfo1Text',
									label$tr$: 'platform.planningboard.showInfo1Text',
									type: 'boolean',
									model: 'showInfo1Text',
									visible: true,
									sortOrder: 3
								},
								labelInputs.info1,
								{
									gid: '2',
									rid: 'ShowInfo2Text',
									label$tr$: 'platform.planningboard.showInfo2Text',
									type: 'boolean',
									model: 'showInfo2Text',
									visible: true,
									sortOrder: 5
								},
								labelInputs.info2,
								{
									gid: '2',
									rid: 'ShowInfo3Text',
									label$tr$: 'platform.planningboard.showInfo3Text',
									type: 'boolean',
									model: 'showInfo3Text',
									visible: true,
									sortOrder: 7
								},
								labelInputs.info3,
								{
									gid: '3',
									rid: 'snapToDays',
									label$tr$: 'platform.planningboard.snapToDays',
									type: 'boolean',
									model: 'snapToDays',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '3',
									rid: 'showExtendedDemands',
									label$tr$: 'platform.planningboard.showExtendedDemands',
									type: 'boolean',
									model: 'showExtendedDemands',
									visible: true,
									sortOrder: 2
								},
								{
									gid: '4',
									rid: 'useTaggingSystem',
									label$tr$: 'platform.planningboard.useTaggingSystem',
									type: 'boolean',
									model: 'useTaggingSystem',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '5',
									rid: 'tagConfig',
									label$tr$: 'platform.planningboard.tagConfig',
									type: 'directive',
									directive: 'platform-grid-form-control',
									options: {
										height: '150px',
										gridConfig: platformPlanningBoardTagGridConfigService.createTagGrid()
									},
									model: 'tagConfig',
									visible: true,
									sortOrder: 2
								},
								{
									gid: '6',
									rid: 'selectedZoomLevel',
									label$tr$: 'platform.planningboard.setDefaultZoomLevel',
									label: '*Set Default Zoom Level',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: [
											{ value: 1, type: 'month', id: 'saveLastZoom', caption: $translate.instant('platform.planningboard.saveLastZoom') },
											{ value: 1, type: 'week', id: 'oneweek', caption: $translate.instant('platform.planningboard.zoomOneWeek') },
											{ value: 2, type: 'week', id: 'twoweeks', caption: $translate.instant('platform.planningboard.zoomTwoWeek') },
											{ value: 1, type: 'month', id: 'onemonth', caption: $translate.instant('platform.planningboard.zoomOneMonth') }
										]
									},
									model: 'selectedZoomLevel',
									visible: true,
									sortOrder: 2,
									readonly: false,
									change: function (entity) {
										if (entity.selectedZoomLevel.id === 'saveLastZoom') {
											entity.saveLastZoom = true;
										} else {
											entity.saveLastZoom = false;
										}
									}
								},
								{
									gid: '8',
									rid: 'showAggregations',
									label$tr$: 'platform.planningboard.showAggregations',
									type: 'boolean',
									model: 'showAggregations',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '8',
									rid: 'useMinAggregation',
									label: '*Use Minimal Aggregation',
									label$tr$: 'platform.planningboard.useMinAggregation',
									type: 'boolean',
									model: 'useMinAggregation',
									visible: true,
									sortOrder: 3
								},
								{
									gid: '8',
									rid: 'minAggregationLevel',
									label: '*Set Min Aggregation Level',
									label$tr$: 'platform.planningboard.setMinAggregationLevel',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: [
											{ value: 1, type: 'hour', id: 'onehour', caption: $translate.instant('platform.planningboard.minAggregationLevel.hour') },
											{ value: 1, type: 'day', id: 'oneday', caption: $translate.instant('platform.planningboard.minAggregationLevel.day') },
											{ value: 1, type: 'week', id: 'oneweek', caption: $translate.instant('platform.planningboard.minAggregationLevel.week') },
											{ value: 1, type: 'month', id: 'onemonth', caption: $translate.instant('platform.planningboard.minAggregationLevel.month') }
										]
									},
									model: 'minAggregationLevel',
									visible: true,
									sortOrder: 4,
									readonly: false
								},
								{
									gid: '9',
									rid: 'showSumAggregations',
									label$tr$: 'platform.planningboard.showSumAggregations',
									type: 'boolean',
									model: 'showSumAggregations',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '9',
									rid: 'sumAggregationLine1',
									label: '*Sum Aggregation Line 1 Properties',
									label$tr$: 'platform.planningboard.sumAggregationsPropertiesLine1',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: line1

									},
									model: 'sumAggregationPropertyLine1',
									sortOrder: 2,
									visible: showLine1Property
								},
								{
									gid: '9',
									rid: 'sumAggregationLine1',
									label: '*Sum Aggregation Line 1',
									label$tr$: 'platform.planningboard.sumAggregationLine1',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: sumAggregationOptions
									},
									model: 'sumAggregationLine1',
									visible: true,
									sortOrder: 3,
									readonly: false
								},
								{
									gid: '9',
									rid: 'sumAggregationLine2',
									label: '*Sum Aggregation Line 2 Properties',
									label$tr$: 'platform.planningboard.sumAggregationsPropertiesLine2',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: line2
									},
									sortOrder: 4,
									visible: showLine2Property,
									model: 'sumAggregationPropertyLine2',
								},
								{
									gid: '9',
									rid: 'sumAggregationLine2',
									label: '*Sum Aggregation Line 2',
									label$tr$: 'platform.planningboard.sumAggregationLine2',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: sumAggregationOptions
									},
									model: 'sumAggregationLine2',
									visible: true,
									sortOrder: 5,
									readonly: false
								},
								{
									gid: '9',
									rid: 'sumAggregationLine3',
									label: '*Sum Aggregation Line 3 Properties',
									label$tr$: 'platform.planningboard.sumAggregationsPropertiesLine3',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: line3

									},
									sortOrder: 6,
									visible: showLine3Property,
									model: 'sumAggregationPropertyLine3',
								},
								{
									gid: '9',
									rid: 'sumAggregationLine3',
									label: '*Sum Aggregation Line 3',
									label$tr$: 'platform.planningboard.sumAggregationLine3',
									type: 'select',
									options: {
										displayMember: 'caption',
										valueMember: 'id',
										items: sumAggregationOptions
									},
									model: 'sumAggregationLine3',
									visible: true,
									sortOrder: 7,
									readonly: false
								},
								// underload
								{
									gid: '10',
									rid: 'underloadvalue',
									label$tr$: 'platform.planningboard.underloadvalue',
									label: '*Underload Value',
									type: 'integer',
									model: 'aggregationTrafficLightsValuesConfig.underload',
									visible: true,
									sortOrder: 1
								},
								{
									gid: '10',
									rid: 'underload',
									label$tr$: 'platform.planningboard.underload',
									label: '*Underload',
									type: 'color',
									model: 'aggregationTrafficLightsConfig.underload',
									visible: true,
									sortOrder: 2
								},
								// goodload
								{
									gid: '10',
									rid: 'goodloadvalue',
									label$tr$: 'platform.planningboard.goodloadvalue',
									label: '*Good Load Value',
									type: 'integer',
									model: 'aggregationTrafficLightsValuesConfig.goodload',
									visible: true,
									sortOrder: 3
								},
								{
									gid: '10',
									rid: 'goodload',
									label$tr$: 'platform.planningboard.goodload',
									label: '*Good Load',
									type: 'color',
									model: 'aggregationTrafficLightsConfig.goodload',
									visible: true,
									sortOrder: 4
								},
								// maxload
								{
									gid: '10',
									rid: 'maxloadvalue',
									label$tr$: 'platform.planningboard.maxloadvalue',
									label: '*Maxload Value',
									type: 'integer',
									model: 'aggregationTrafficLightsValuesConfig.maxload',
									visible: true,
									sortOrder: 5
								},
								{
									gid: '10',
									rid: 'maxload',
									label$tr$: 'platform.planningboard.maxload',
									label: '*Max Load',
									type: 'color',
									model: 'aggregationTrafficLightsConfig.maxload',
									visible: true,
									sortOrder: 6
								},
								// overload
								{
									gid: '10',
									rid: 'overloadvalue',
									label$tr$: 'platform.planningboard.overloadvalue',
									label: '*Overload Value',
									type: 'integer',
									model: 'aggregationTrafficLightsValuesConfig.overload',
									visible: true,
									sortOrder: 7
								},
								{
									gid: '10',
									rid: 'overload',
									label$tr$: 'platform.planningboard.overload',
									label: '*Overload',
									type: 'color',
									model: 'aggregationTrafficLightsConfig.overload',
									visible: true,
									sortOrder: 8
								}
							]
						}
					},
					{
						id: 'planningBoard.chart.gridSettings',
						version: '1.0.0',
						description: $translate.instant('platform.planningboard.gridSettings'),
						form: {
							fid: 'platform.planningBoard.gridSettings',
							version: '1.0.0',
							showGrouping: true,
							groups: [
								{
									gid: '1',
									header$tr$: 'platform.planningboard.validation',
									isOpen: true,
									visible: true,
									sortOrder: 1
								}
							],
							rows: [
								{
									gid: '1',
									rid: 'ValidateDemandAgainstSuppliers',
									label$tr$: 'platform.planningboard.validateSelectedDemand',
									type: 'boolean',
									model: 'validateDemandAgainstSuppliers',
									visible: true,
									sortOrder: 1
								}
							]
						}
					}
				]
			};
		}

		return service;
	}
})(angular);
