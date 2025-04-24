/**
 * Created by sprotte on 15/09/21
 */
(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationContainerInformationService
	 * @description provides information on container used in timekeeping timeallocation module
	 */
	angular.module(moduleName).service('timekeepingTimeallocationContainerInformationService', TimekeepingTimeallocationContainerInformationService);

	TimekeepingTimeallocationContainerInformationService.$inject = ['_', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'timekeepingTimeallocationConstantValues', '$injector', 'platformTranslateService', 'logisticCommonLayoutOverloadService'];

	function TimekeepingTimeallocationContainerInformationService( _, basicsLookupdataConfigGenerator, platformLayoutHelperService, timekeepingTimeallocationConstantValues, $injector, platformTranslateService, logisticCommonLayoutOverloadService) {
		let dynamicConfigurations = {};
		let self = this;

		let lookupInfo = {};
		lookupInfo[timekeepingTimeallocationConstantValues.types.plant.id] = {
			column: 'EtmPlantFk',
			lookup: {
				directive: 'resource-equipment-plant-lookup-dialog-new',
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					showClearButton: true,
					displayMember: 'Code',
					version: 3,
					lookupType: 'equipmentPlant'
				}
			}
		};

		let recordTypeItems = [];
		_.each(timekeepingTimeallocationConstantValues.types, function (type) {
			type.descriptionTranslated = platformTranslateService.instant(type.description, null, true);
			recordTypeItems.push(type);
		});

		let configObj = basicsLookupdataConfigGenerator.getDataServiceDefaultSpec({
			dataServiceName: 'timekeepingEmployeeLookupDataService'
		});

		lookupInfo[timekeepingTimeallocationConstantValues.types.employee.id] = {
			column: 'EmployeeFk',
			lookup: {
				directive: 'basics-lookup-data-by-custom-data-service',
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					lookupType: configObj.moduleQualifier,
					dataServiceName: configObj.dataServiceName,
					valueMember: configObj.valMember,
					displayMember: configObj.dispMember,
					lookupModuleQualifier: configObj.moduleQualifier,
					enableCache: false,
					disableDataCaching: true,
					showClearButton: true,
					columns: configObj.columns,
					isClientSearch: true,
					isTextEditable: configObj.isTextEditable || false,
					uuid: configObj.uuid
				}
			},
		};

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = null;
			const uids = timekeepingTimeallocationConstantValues.uuid.container;
			let layServ = null;
			switch (guid) {
				case uids.timeAllocationHeaderList: // timekeepingtimeallocationListController
					config = self.getTimekeepingTimeallocationHeaderServiceInfos();
					config.layout = self.getTimekeepingTimeallocationHeaderLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case uids.timeAllocationHeaderDetails: // timekeepingtimeallocationDetailController
					config = self.getTimekeepingTimeallocationHeaderServiceInfos();
					config.layout = self.getTimekeepingTimeallocationHeaderLayout();
					config.ContainerType = 'Detail';
					break;
				case uids.timeAllocationItemList:
					layServ = $injector.get('timekeepingTimeallocationItemLayoutService');
					config = self.getTimekeepingTimeallocationItemServiceInfos();
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						cellChangeCallBack: function (arg) {
							let colService = $injector.get('timekeepingTimeallocationActionColumnService');
							if (colService) {
								let column = arg.grid.getColumns()[arg.cell];
								let field = arg.grid.getColumns()[arg.cell].field;
								colService.fieldChange(arg.item, field, column);
							}
						},
						columns: []
					};
					break;
				case uids.timeAllocationItemDetails:
					layServ = $injector.get('timekeepingTimeallocationItemLayoutService');
					config = self.getTimekeepingTimeallocationItemServiceInfos();
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Detail';
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;
			}
			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getTimekeepingTimeallocationHeaderServiceInfos = function getTimekeepingTimeallocationHeaderServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingTimeallocationHeaderLayoutService',
				dataServiceName: 'timekeepingTimeallocationHeaderDataService',// timekeepingTimeallocationDataService
				validationServiceName: 'timekeepingTimeallocationHeaderValidationService'
			};
		};

		this.getTimekeepingTimeallocationHeaderLayout = function getTimekeepingTimeallocationHeaderLayout() {
			let res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'timekeeping.timeallocation.timeallocationHeaderEntity',
				['projectfk', 'jobfk', 'recordingfk', 'allocationdate','timeallocationstatusfk','companyfk', 'allocationenddate', 'dispatchheaderfk', 'comment'],
				platformLayoutHelperService.getUserDefinedTextGroup(10, 'userdefinedtext', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(10, 'userdefinednumber', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(10, 'userdefineddate', 'userdefineddate', '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['projectfk', 'jobfk', 'recordingfk','timeallocationstatusfk','companyfk', 'todistribute', 'dispatchheaderfk'], self);
			return res;
		};

		this.getTimekeepingTimeallocationItemServiceInfos = function getTimekeepingTimeallocationItemServiceInfos() {
			return {
				// standardConfigurationService: 'timekeepingTimeallocationItemLayoutService',
				standardConfigurationService: 'timekeepingTimeallocationDynamicConfigurationService',
				dataServiceName: 'timekeepingTimeallocationItemDataService',// timekeepingTimeallocationDataService
				validationServiceName: 'timekeepingTimeallocationItemValidationService'
			};
		};

		this.getTimekeepingTimeallocationItemLayout = function getTimekeepingTimeallocationItemLayout() {
			let res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0','timekeeping.timeallocation.timeallocationItemEntity',
				['recordtype', 'recordfk', 'recorddescription', 'recordingfk', 'rate', 'totalproductivehours', 'distributedhourstotal', 'distributedhourscurrentheader',
					'distributedhoursotherheaders', 'todistribute','comment', 'isgenerated'],
				platformLayoutHelperService.getUserDefinedTextGroup(10, 'userdefinedtext', 'userdefinedtext', '0'),
				platformLayoutHelperService.getUserDefinedNumberGroup(10, 'userdefinednumber', 'userdefinednumber', '0'),
				platformLayoutHelperService.getUserDefinedDateGroup(10, 'userdefineddate', 'userdefineddate', '0'));
			res.overloads = platformLayoutHelperService.getOverloads(['recordfk', 'recordtype', 'recordingfk', 'recorddescription', 'distributedhourstotal', 'distributedhourscurrentheader',
				'distributedhoursotherheaders', 'todistribute'], self);
			return res;
		};

		this.getOverload = function getOverloads(overload) {
			let ovl = null;
			switch (overload) {
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload(null, 'projectfk');
					break;
					// recording needs new lookup service
				case 'recordingfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingRecordingLookupByRecordingDataService',
						filter: function (item) {
							if (item && item.PeriodFk) {
								return item.PeriodFk;
							}
						},
						cacheEnable: true
					});
					break;
				case 'jobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload({projectFk: 'ProjectFk'});
					break;

				case 'dispatchheaderfk':
					ovl = logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderFk', true);
					ovl.readonly = true;
					break;
				case 'employeefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeLookupDataService'
					});
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					ovl.readonly = true;
					break;
				case 'etmplantfk':
					ovl = platformLayoutHelperService.providePlantLookupOverload();
					break;
				case 'resultfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingResultLookupDataService',
						filter: function (item) {
							if (item && item.RecordingFk) {
								return item.RecordingFk;
							}
						},
						cacheEnable: true
					});
					break;
				case 'recordfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'dynamic-grid-and-form-lookup',
							options: {
								isTextEditable: false,
								dependantField: 'RecordType',
								lookupInfo: lookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: true
							}
						},
						grid: {
							editor: 'directive',
							editorOptions: {
								directive: 'dynamic-grid-and-form-lookup',
								dependantField: 'RecordType',
								lookupInfo: lookupInfo,
								isTextEditable: false,
								dynamicLookupMode: true,
								grid: true
							},
							formatter: 'dynamic',
							domain: function (item, column, flag) {
								let info = lookupInfo[item.RecordType];
								if (info) {
									let prop = info.lookup.options;
									column.formatterOptions = {
										lookupType: prop.lookupType,
										displayMember: prop.displayMember,
										dataServiceName: prop.dataServiceName
									};
									if (prop.version) {
										column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
									}
								} else {
									column.formatterOptions = null;
								}

								return flag ? 'directive' : 'lookup';
							}
						}
					};
					break;
				case 'recordtype':
					ovl = {
						detail: {
							type: 'select',
							options: {
								items: recordTypeItems,
								valueMember: 'id',
								displayMember: 'descriptionTranslated'
							}
						},
						grid: {
							editor: 'select',
							editorOptions: {
								items: recordTypeItems,
								valueMember: 'id',
								displayMember: 'descriptionTranslated'
							},
							bulkSupport: false
						}
					};
					break;
				case 'recorddescription':
					ovl = {
						readonly: true
					};
					break;
				case 'distributedhourstotal':
				case 'distributedhours':
					ovl = {
						readonly: true,
						grid: {
							formatter: function (row, cell, value, columnDef, dataContext) {
								value = value || dataContext.field || 0;
								if (dataContext && dataContext.ToDistribute !== 0) {
									return '<span style="color: red;">' + value.toFixed(3)  + '</span>';
								} else {
									return '<span style="color: green;">' + value.toFixed(3)  + '</span>';
								}
							},
						}
					};
					break;
				case 'distributedhourscurrentheader':
					ovl = {
						readonly: true
					};
					break;
				case 'distributedhoursotherheaders':
					ovl = {
						readonly: true
					};
					break;
				case 'todistribute':
					ovl = {
						readonly: true,
						grid: {
							formatter: function (row, cell, value, columnDef, dataContext) {
								value = value || dataContext.field || 0;
								if (dataContext && dataContext.ToDistribute !== 0) {
									return '<span style="color: red;">' + value.toFixed(3)  + '</span>';
								} else {
									return '<span style="color: green;">' + value.toFixed(3)  + '</span>';
								}
							},
						}
					};
					break;
				case 'timeallocationstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timeallocationstatus', null, {showIcon: true});
					break;
			}
			return ovl;
		};
	}

})(angular);
