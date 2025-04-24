/*
 * $Id: timekeeping-recording-container-information-service.js 634011 2021-04-26 10:31:11Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let timekeepingRecordingModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingRecordingModule.service('timekeepingRecordingContainerInformationService', TimekeepingRecordingContainerInformationService);

	TimekeepingRecordingContainerInformationService.$inject = [
		'_',
		'$injector',
		'platformLayoutHelperService',
		'basicsLookupdataConfigGenerator',
		'basicsCommonComplexFormatter',
		'timekeepingCommonLayoutHelperService',
		'timekeepingRecordingConstantValues',
		'basicsLookupdataLookupFilterService',
		'timekeepingTimeallocationItemDataService'
	];

	function TimekeepingRecordingContainerInformationService(
		_,
		$injector,
		platformLayoutHelperService,
		basicsLookupdataConfigGenerator,
		basicsCommonComplexFormatter,
		timekeepingCommonLayoutHelperService,
		timekeepingRecordingConstantValues,
		basicsLookupdataLookupFilterService,
		timekeepingTimeallocationItemDataService
	) {
		let self = this;
		let guids = timekeepingRecordingConstantValues.uuid.container;
		let dynamicConfigurations = {};
		let filters = [
			{
				key: 'timekeeping-recording-rubric-category-lookup-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function (entity) {
					return { Rubric: 94 };// 94 is rubric for Timekeeping Recording.
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case guids.recordingList: // timekeepingRecordingListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getRecordingServiceInfos(), self.getRecordingLayout);
					break;
				case guids.recordingDetails: // timekeepingRecordingDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getRecordingServiceInfos(), self.getRecordingLayout);
					break;
				case guids.reportList: // timekeepingRecordingReportListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getReportServiceInfos(), self.getReportLayout);
					break;
				case guids.reportDetails: // timekeepingRecordingReportDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getReportServiceInfos(), self.getReportLayout);
					break;
				case guids.resultList: // timekeepingRecordingReportListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getResultServiceInfos(), self.getResultLayout);
					break;
				case guids.resultDetails: // timekeepingRecordingReportDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getResultServiceInfos(), self.getResultLayout);
					break;
				case guids.sheetList: // timekeepingRecordingSheetListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSheetServiceInfos(), self.getSheetLayout);
					break;
				case guids.sheetDetails: // timekeepingRecordingSheetDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSheetServiceInfos(), self.getSheetLayout);
					break;
				case guids.breakList: // timekeepingRecordingReportListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getBreakServiceInfos(), self.getBreakLayout);
					break;
				case guids.breakDetails: // timekeepingRecordingReportDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBreakServiceInfos(), self.getBreakLayout);
					break;

				case guids.verificationList: // timekeepingRecordingReportListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeReportVerificationServiceInfos(), self.getEmployeeReportVerificationLayout);
					break;
				case guids.verificationDetails: // timekeepingRecordingReportDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEmployeeReportVerificationServiceInfos(), self.getEmployeeReportVerificationLayout);
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}
			return config;
		};

		this.getRecordingServiceInfos = function getRecordingServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingRecordingLayoutService',
				dataServiceName: 'timekeepingRecordingDataService',
				validationServiceName: 'timekeepingRecordingValidationService',
			};
		};

		this.getRecordingLayout = function getRecordingLayout() {
			let res = platformLayoutHelperService.getFourGroupsBaseLayout(
				'1.0.0',
				'timekeeping.recording',
				['code', 'shiftfk', 'timekeepingperiodfk', 'employeefk', 'plantfk', 'recordingstatusfk', 'rubriccategoryfk', 'description', 'commenttext', 'payrollyear'],
				platformLayoutHelperService.getUserDefinedTextGroup(5, 'userdefinedtext', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userdefinednumber', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(5, 'userdefineddate', 'userdefineddate', '0')
			);
			res.overloads = platformLayoutHelperService.getOverloads(['timekeepingperiodfk', 'employeefk', 'plantfk', 'recordingstatusfk', 'rubriccategoryfk', 'shiftfk', 'payrollyear'], self);
			return res;
		};

		this.getReportServiceInfos = function getReportServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingRecordingReportLayoutService',
				dataServiceName: 'timekeepingRecordingReportDataService',
				validationServiceName: 'timekeepingRecordingReportValidationService',
			};
		};

		this.getReportLayout = function getReportLayout() {
			let res = platformLayoutHelperService.getFourGroupsBaseLayout(
				'1.0.0',
				'timekeeping.recording.report',
				[
					'duedate',
					'reportstatusfk',
					'timesymbolfk',
					'projectfk',
					'jobfk',
					'weekday',
					'fromtimeparttime',
					'fromtimepartdate',
					'totimeparttime',
					'totimepartdate',
					'duration',
					'breakfrom',
					'breakto',
					'controllingunitfk',
					'projectactionfk',
					'commenttext',
					'ismodified',
					'breakduration',
					'longitude',
					'latitude'
				],
				platformLayoutHelperService.getUserDefinedTextGroup(10, 'userdefinedtext', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(10, 'userdefinednumber', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(10, 'userdefineddate', 'userdefineddate', '0')
			);
			res.overloads = platformLayoutHelperService.getOverloads(['reportstatusfk', 'timesymbolfk', 'projectfk', 'jobfk', 'controllingunitfk', 'projectactionfk', 'breakfrom', 'breakto', 'duration'], self);
			attachDecimalPlacesBasedOnRoundingConfig(res);

			return res;
		};

		this.getResultServiceInfos = function getResultServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingRecordingResultLayoutService',
				dataServiceName: 'timekeepingRecordingResultDataService',
				validationServiceName: 'timekeepingRecordingResultValidationService',
			};
		};

		this.getResultLayout = function getResultLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.recording.result', ['duedate','fromtime', 'totime', 'resultstatusfk', 'hours', 'timesymbolfk', 'projectfk', 'projectactionfk', 'plantfk', 'sheetfk', 'rate', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['resultstatusfk', 'timesymbolfk', 'projectfk', 'projectactionfk', 'plantfk', 'sheetfk'], self);
			return res;
		};


		this.getBreakServiceInfos = function getBreakServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingRecordingBreakLayoutService',
				dataServiceName: 'timekeepingRecordingBreakDataService',
				validationServiceName: 'timekeepingRecordingBreakValidationService',
			};
		};

		this.getBreakLayout = function getBreakLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.recording.break', ['fromtimebreaktime','fromtimebreakdate', 'totimebreaktime','totimebreakdate','duration','longitude','latitude']);
			res.overloads = platformLayoutHelperService.getOverloads([], self);
			return res;
		};

		this.getSheetServiceInfos = function getSheetServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingRecordingSheetLayoutService',
				dataServiceName: 'timekeepingRecordingSheetDataService',
				validationServiceName: 'timekeepingRecordingSheetValidationService',
			};
		};

		this.getSheetLayout = function getSheetLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.recording.sheet', ['employeefk', 'sheetstatusfk', 'sheetsymbolfk', 'commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['employeefk', 'sheetstatusfk', 'sheetsymbolfk'], self);
			return res;
		};

		this.getEmployeeReportVerificationServiceInfos = function getEmployeeReportVerificationServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingReportVerificationLayoutService',
				dataServiceName: 'timekeepingReportVerificationDataService',
				validationServiceName: 'timekeepingRecordingReportVerificationValidationService',
			};
		};
		this.getEmployeeReportVerificationLayout = function getEmployeeReportVerificationLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.recording.verification', ['timerecorded','reportverificationtypefk','longitude','latitude','insertedatoriginal','insertedbyoriginal','commenttext']);
			res.overloads = platformLayoutHelperService.getOverloads(['reportverificationtypefk','insertedbyoriginal'], self);
			return res;
		};
		this.getOverload = function getOverload(overload) {
			let ovl = null;

			switch (overload) {
				case 'fromtimeparttime':
					ovl = {editorOptions: {allownull: true}};
					break;
				case 'fromtimepartdate':
					ovl = {editorOptions: {allownull: true}};
					break;
				case 'totimeparttime':
					ovl = {editorOptions: {allownull: true}};
					break;
				case 'totimepartdate':
					ovl = {editorOptions: {allownull: true}};
					break;
				case 'breakfrom':
					ovl = {editorOptions: {allownull: true}};
					break;
				case 'breakto':
					ovl = {editorOptions: {allownull: true}};
					break;

				case 'controllingunitfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								lookupOptions: {
									filterKey: 'prc-con-controlling-by-prj-filter',
									showClearButton: true,
								},
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ControllingUnit',
								displayMember: 'Code',
							},
							width: 80,
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'prc-con-controlling-by-prj-filter',
									showClearButton: true,
								},
							},
						},
					};
					break;
				case 'employeefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeLookupDataService'
					});
					break;
				case 'weekday':
					ovl = {readonly: true};
					break;
				case 'projectfk':
					// ovl = platformLayoutHelperService.provideProjectLookupOverload();
					ovl = {
						navigator: {
							moduleName: 'project.main',
							targetIdProperty: 'ProjectFk'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true,
									addGridColumns: [
										{
											id: 'ProjectName',
											field: 'ProjectName',
											name: 'ProjectName',
											formatter: 'description',
											name$tr$: 'cloud.common.entityName'
										}
									],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo',
								version: 3
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								version: 3,
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'recordingstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingrecordingstatus', null, {showIcon: true});
					break;
				case 'reportverificationtypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingreportverificationtype', null, {showIcon: true});
					break;
				case 'insertedbyoriginal':
					ovl = self.getUserLookup();
					break;
				case 'reportstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingreportstatus', null, {showIcon: true});
					break;
				case 'resultstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingresultstatus', null, {showIcon: true});
					break;
				case 'payrollyear':
					ovl = {readonly: true};
					break;
				case 'sheetfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingSheetLookupByRecordingDataService',
						filter: function (entity) {
							return entity.RecordingFk;
						},
					});
					break;
				case 'sheetsymbolfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingsheetsymbol', null, {showIcon: true});
					break;
				case 'sheetstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingsheetstatus', null, {showIcon: true});
					break;
				case 'shiftfk':
					/*
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingShiftModelLookupDataService',
					});
*/
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingShiftByEmployeeOrTkGroupLookupDataService',
						filter: function (entity) {
							if (entity) {
								return entity;
							}
						}
					});
					break;
				case 'timekeepingperiodfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingPeriodLookupDataService',
					});
					break;
				case 'timesymbolfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingTimeSymbol2GroupLookupDataService',
						filter: function (entity) {
							return entity;
						},
					});
					break;
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'timekeeping-recording-rubric-category-lookup-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'timekeeping-recording-rubric-category-lookup-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'jobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'});
					break;
				case 'plantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					break;
				case 'projectactionfk':
					ovl = {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectAction',
								displayMember: 'Code',
								version: 3,
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'project-main-action-lookup',
								lookupOptions: {
									additionalColumns: true,
									defaultFilter: { projectFk: 'ProjectFk', employeeFk: 'EmployeeFk', companyFk: 'CompanyFk' },
									filterOptions: {
										serverSide: true,
										serverKey: 'projectActionFilter',
										fn: function(item){
											let serv = $injector.get('projectMainActionLookupDataService');
											let params = serv.getFilterParams(item);
											if (_.isEmpty(params)) {
												return {'projectFk': item.ProjectFk};
											} else {
												return params;
											}
										}
									},
									showClearButton: true,
									addGridColumns: [
										{
											id: 'description',
											field: 'Description',
											name: 'Description',
											name$tr$: 'cloud.common.entityDescription',
											formatter: 'description',
											readonly: true,
										}
									]
								}
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-main-action-lookup',
								displayMember: 'Code',
								descriptionMember: 'Description',
								showClearButton: true,
								lookupOptions: {
									defaultFilter: { projectFk: 'ProjectFk', companyFk: 'CompanyFk' },
									showClearButton: true,
									filterOptions: {
										serverSide: true,
										serverKey: 'projectActionFilter',
										fn: function(item){
											let serv = $injector.get('projectMainActionLookupDataService');
											let params = serv.getFilterParams(item);
											if (_.isEmpty(params)) {
												return {'projectFk': item.ProjectFk};
											} else {
												return params;
											}
										}
									}
								}
							}
						}
					};
					break;
				case 'isgenerated':
					ovl = { readonly: true };
					break;
				case 'duration':
					ovl = {
						'grid': {
							'formatter': function (row, cell, value, columnDef, entity, plainText) {
								columnDef.domain = 'quantity';
								return durationFormatter(row, cell, value, columnDef, entity, plainText);
							}
						}
					};
					break;

			}
			return ovl;
		};
		this.getUserLookup = function getUserLookup() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'usermanagement-user-user-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'usermanagement-user-user-dialog',
						lookupOptions: {
							showClearButton: true,
							displayMember: 'Name'
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'User',
						displayMember: 'Name'
					}
				}
			};
		};
		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};
		function durationFormatter(row, cell, value, columnDef, entity, plainText) {
			let accounting = $injector.get('accounting');
			let culture = $injector.get('platformContextService').culture();
			let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
			let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
			let platformObjectHelper = $injector.get('platformObjectHelper');
			let precision = _.get(columnDef, 'formatterOptions.decimalPlaces', _.get(columnDef, 'editorOptions.decimalPlaces', 3));

			if(_.isFunction(precision)) {
				precision = precision(columnDef, columnDef.field, entity);
			}

			if(_.isNil(precision)) {
				precision = 3;
			}

			if (!_.isNumber(value)) {
				value = platformObjectHelper.getValue(entity, columnDef.field);
			}
			value = accounting.formatNumber(value, precision, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

			if (platformRuntimeDataService.isHideContent(entity, columnDef.field)) {
				return ' ';
			}

			if (plainText) {
				return value;
			}

			let outValue = '<div class="flex-box flex-align-center">';
			outValue += '<span class="flex-element text-right">' + value + '</span>' + '</div>';
			return outValue;
		}
		function attachDecimalPlacesBasedOnRoundingConfig(formConfig) {
			let timekeepingRoundingService = $injector.get('timekeepingCommonRoundingService');
			let timekeepingRoundingDataService = $injector.get('timekeepingRecordingRoundingDataService');
			let getDecimalPlacesOption = function getDecimalPlacesOption(){
				return {
					decimalPlaces: function (columnDef, field, entity) {
						return timekeepingRoundingService.getUiRoundingDigits(columnDef,field, timekeepingRoundingDataService, entity);
					}
				};
			};

			// Atach decimalPlaces function to options object
			let getRoundingDigitsConfig = function getRoundingDigitsConfig(readonly, /* grouping, */ gridFormatter) {
				let config = {
					'readonly': readonly,
					'detail': {
						'options': getDecimalPlacesOption()
					},
					'grid': {
						editorOptions: getDecimalPlacesOption(),
						formatterOptions: getDecimalPlacesOption()
					}
				};

				if(_.isFunction(gridFormatter)) {
					config.grid.formatter = gridFormatter;
				}

				return config;
			};

			// Get information for columns that are to be rounded and have decimal places coming from the rounding conig.
			let roundedColumnDetail = timekeepingRoundingDataService.getRoundingConfigDetails();
			if (roundedColumnDetail) {
				let columnToBeRounded = roundedColumnDetail.Field.toLowerCase();

				let gridFormatter = null;
				let readonly = false;

				let overload = formConfig.overloads[columnToBeRounded];

				if(_.isObject(overload)) {
					if(!_.isObject(overload.detail)) {
						overload.detail = {options: {}}; // attach this property
					}
					else if(_.isObject(overload.detail.options)) {
						overload.detail.options = {};  // attach this property
					}

					angular.extend(overload.detail.options, getDecimalPlacesOption());

					if(!_.isObject(overload.grid)) {
						overload.grid = {editorOptions: {}, formatterOptions: {}}; // attach this property
					}
					else {
						if(!_.isObject(overload.grid.editorOptions)) {
							overload.grid.editorOptions = {}; // attach this property
						}

						if(!_.isObject(overload.grid.formatterOptions)) {
							overload.grid.formatterOptions = {}; // attach this property
						}
					}

					angular.extend(overload.grid.editorOptions, getDecimalPlacesOption());
					angular.extend(overload.grid.formatterOptions, getDecimalPlacesOption());

				}
				else {
					formConfig.overloads[columnToBeRounded] = getRoundingDigitsConfig(readonly, gridFormatter);
				}
			}
		}
	}
})(angular);
