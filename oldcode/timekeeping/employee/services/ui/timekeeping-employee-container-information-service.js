/**
 * Created by leo on 26.04.2018.
 */
(function (angular) {
	'use strict';
	let mainModule = angular.module('timekeeping.employee');
	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('timekeepingEmployeeContainerInformationService', TimekeepingEmployeeContainerInformationService);

	TimekeepingEmployeeContainerInformationService.$inject = ['_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsCommonComplexFormatter', 'timekeepingCommonLayoutHelperService', 'timekeepingEmployeeConstantValues', 'basicsLookupdataLookupFilterService'];

	function TimekeepingEmployeeContainerInformationService(_, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter, timekeepingCommonLayoutHelperService, timekeepingEmployeeConstantValues, basicsLookupdataLookupFilterService) {
		let self = this;
		let guids = timekeepingEmployeeConstantValues.uuid.container;


		(function registerFilter() {
			let filters = [
				{
					key: 'timekeeping-employee-paymentgroup-filter',
					fn: function (item, employee) {
						var result = false;
						if (employee.TimesheetContextFk) {
							result = item.TimesheetContextFk === employee.TimesheetContextFk;
						}
						return result;
					}
				},	{
					key: 'timekeeping-crewleader-filter',
					serverSide: false,
					fn: function (item, entity) {
						return item.Id !== entity.EmployeeFk;
					}
				},	{
					key: 'timekeeping-planned-absence-filter',
					serverSide: false,
					fn: function (item, entity) {
						return item.IsAbsence;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);
		})();

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.employeeList: // timekeepingEmployeeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimekeepingEmployeeServiceInfos(), self.getTimekeepingEmployeeLayout);
					config.listConfig.bulkEditorSettings = {
						serverSideBulkProcessing: true,
						skipEntitiesToProcess: false
					};
					break;
				case guids.employeeDetails: // timekeepingEmployeeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimekeepingEmployeeServiceInfos(), self.getTimekeepingEmployeeLayout);
					break;
				case guids.crewAssignmentList: // timekeepingCrewAssignmentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCrewAssignmentServiceInfos(), self.getCrewAssignmentLayout);
					break;
				case guids.crewAssignmentDetails: // timekeepingCrewAssignmentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCrewAssignmentServiceInfos(), self.getCrewAssignmentLayout);
					break;
				case guids.crewMemberList: // timekeepingCrewAssignmentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getCrewMemberServiceInfos(), self.getCrewMemberLayout);
					config.listConfig.idProperty = 'IdGen';
					break;
				case guids.crewMemberDetails: // timekeepingCrewAssignmentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getCrewMemberServiceInfos(), self.getCrewMemberLayout);
					break;
				case guids.plannedAbsenceList: // timekeepingPlannedAbsenceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getPlannedAbsenceServiceInfos(), self.getPlannedAbsenceLayout);
					break;
				case guids.plannedAbsenceDetails: // timekeepingPlannedAbsenceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPlannedAbsenceServiceInfos(), self.getPlannedAbsenceLayout);
					break;
				case guids.employeePictureList: // timekeepingEmployeePictureController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeePictureServiceInfos(), self.getEmployeePictureLayout);
					break;
				case guids.skillList: // timekeepingPlannedAbsenceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSkillServiceInfos(), self.getSkillLayout);
					break;
				case guids.skillDetails: // timekeepingPlannedAbsenceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSkillServiceInfos(), self.getSkillLayout);
					break;
				case guids.employeeDefaultList: // timekeepingEmployeeDefaultListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeDefaultServiceInfos(), self.getEmployeeDefaultLayout);
					break;
				case guids.employeeDefaultDetails: // timekeepingEmployeeDefaultDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEmployeeDefaultServiceInfos(), self.getEmployeeDefaultLayout);
					break;
				case guids.skillDocumentList: // timekeepingEmployeeSkillDocumentListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSkillDocumentServiceInfos(), self.getSkillDocumentLayout);
					break;
				case guids.skillDocumentDetails: // timekeepingEmployeeSkillDocumentDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSkillDocumentServiceInfos(), self.getSkillDocumentLayout);
					break;
				case guids.employeeWorkingTimeAccountList: // timekeepingEmployeeWorkingTimeAccountListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getWorkingTimeAccountVServiceInfos(), self.getWorkingTimeAccountVLayout);
					break;
				case guids.employeeWorkingTimeAccountDetails: // timekeepingEmployeeWorkingTimeAccountDetailController
					config = platformLayoutHelperService.getStandardGridConfig(self.getWorkingTimeAccountVServiceInfos(), self.getWorkingTimeAccountVLayout);
					break;
				case guids.employeeWorkingTimeModelList: // timekeepingEmployeeWorkingTimeModelListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeWorkingTimeModelServiceInfos(), self.getEmployeeWorkingTimeModelLayout);
					break;
				case guids.employeeWorkingTimeModeDetails: // timekeepingEmployeeWorkingTimeDetailDetailController
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeWorkingTimeModelServiceInfos(), self.getEmployeeWorkingTimeModelLayout);
					break;
				case guids.employeeDocList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeDocumentServiceInfo(), self.getEmployeeDocumentLayout);
					break;
				case guids.employeeDocDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEmployeeDocumentServiceInfo(), self.getEmployeeDocumentLayout);
					break;
				case guids.employeeCertList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeCertificationServiceInfo(), self.getCertificationLayout);
					break;
				case guids.employeeCertDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEmployeeCertificationServiceInfo(), self.getCertificationLayout);
					break;
				case guids.employeeVacationAccountList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeVacationAccountServiceInfos(), self.getEmployeeVacationAccountLayout);
					break;
				case guids.employeeVacationAccountDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEmployeeVacationAccountServiceInfos(), self.getEmployeeVacationAccountLayout);
					break;
				case guids.employeeLicenseCheckList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getEmployeeLicenseCheckServiceInfos(), self.getEmployeeLicenseCheckLayout);
					break;
				case guids.employeeLicenseCheckDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getEmployeeLicenseCheckServiceInfos(), self.getEmployeeLicenseCheckLayout);
					break;

			}
			return config;
		};

		this.getEmployeeVacationAccountServiceInfos = function getEmployeeVacationAccountServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeVacationAccountLayoutService',
				dataServiceName: 'timekeepingEmployeeVacationAccountDataService',
				validationServiceName: 'timekeepingEmployeeVacationAccountValidationService'
			};
		};

		this.getEmployeeCertificationServiceInfo = function getEmployeeCertificationServiceInfo() {
			return {
				standardConfigurationService: 'timekeepingEmployeeCertificationLayoutService',
				dataServiceName: 'timekeepingEmployeeCertificationDataService',
				validationServiceName: 'timekeepingEmployeeCertificationValidationService'
			};
		};

		this.getEmployeeDocumentServiceInfo = function getEmployeeDocumentServiceInfo() {
			return {
				standardConfigurationService: 'timekeepingEmployeeDocumentLayoutService',
				dataServiceName: 'timekeepingEmployeeDocumentDataService',
				validationServiceName: 'timekeepingEmployeeDocumentValidationService'
			};
		};



		this.getTimekeepingEmployeeServiceInfos = function getTimekeepingEmployeeServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeLayoutService',
				dataServiceName: 'timekeepingEmployeeDataService',
				validationServiceName: 'timekeepingEmployeeValidationService'
			};
		};



		this.getCertificationLayout = function getCertificationLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.certification',
				['empcertificatefk', 'validfrom', 'validto','empcertificatetypefk','empvalidfrom','empvalidto','comment']);

			res.overloads = platformLayoutHelperService.getOverloads(['empcertificatefk','empcertificatetypefk','empvalidfrom','empvalidto'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getEmployeeVacationAccountLayout = function getEmployeeVacationAccountLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.vacationAccount',
				['bookingdate', 'timesymbolfk', 'duration','comment','isyearlystartscheduleentry','isyearlyexpirescheduleentry']);

			res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk'], self);
			res.addAdditionalColumns = true;
			return res;
		};

		this.getEmployeeDocumentLayout = function getEmployeeDocumentLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.document',
				['documenttypefk', 'description', 'employeedocumenttypefk', 'date', 'barcode', 'ishiddeninpublicapi', 'url','originfilename']);

			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'employeedocumenttypefk','originfilename'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getTimekeepingEmployeeLayout = function getTimekeepingEmployeeLayout() {
			let res = platformLayoutHelperService.getThreeGroupsBaseLayout('1.0.0', 'timekeeping.employee',
				['externalid', 'code', 'companyoperatingfk', 'descriptioninfo', 'firstname', 'familyname', 'initials', 'addressfk', 'countryfk',

					'telephonenumbertelfk', 'telephonenumbermobfk', 'email', 'birthdate', 'userfk', 'workingtimemodelfk', 'workingtimeaccountbalance', 'ispayroll', 'vacationbalance', 'yearlyvacation', 'trafficlightfk', 'generaterecording','isclocking','absenttill','placeofworkfk','islive'],
				{
					gid: 'configuration',
					attributes: ['startdate', 'terminaldate', 'iscrewleader', 'iswhitecollar', 'ishiredlabor', 'istimekeeper', 'remark',
						'shiftfk', 'employeegroupfk', 'timekeepinggroupfk', 'professionalcategoryfk', 'paymentgroupfk', 'clerkfk', 'calendarfk',
						'groupfk', 'costgroupfk', 'employeeareafk', 'employeesubareafk', 'employeestatusfk', 'crewleaderfk',
					   'remainingvacationpreviousyear', 'vacationfromminvacationpaypreyear', 'grantedvacationpreviousyear',
					   'grantedvacationcurrentyear', 'lastbillingmonthyear', 'grantedvacationincurrentperiod',
					   'availablevacation', 'requestedvacationcurrentyear', 'vacationtakencurrentyear']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					isUserDefNumber: true,
					isUserDefDate: true,
					attCount: 5
				});
			res.overloads = platformLayoutHelperService.getOverloads(['externalid', 'companyoperatingfk', 'addressfk', 'countryfk', 'telephonenumbertelfk',
				'telephonenumbermobfk', 'shiftfk', 'employeegroupfk', 'professionalcategoryfk', 'paymentgroupfk', 'clerkfk', 'calendarfk',
				'timekeepinggroupfk', 'groupfk', 'userfk', 'costgroupfk', 'workingtimemodelfk', 'employeeareafk', 'employeesubareafk', 'employeestatusfk',
				'trafficlightfk', 'crewleaderfk', 'remainingvacationpreviousyear', 'vacationfromminvacationpaypreyear',
				'placeofworkfk', 'grantedvacationpreviousyear', 'vacationtakencurrentyear',
				'grantedvacationcurrentyear', 'lastbillingmonthyear', 'grantedvacationincurrentperiod',
				'availablevacation', 'requestedvacationcurrentyear'], self);
			return res;
		};

		this.getCrewAssignmentServiceInfos = function getCrewAssignmentServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingCrewAssignmentLayoutService',
				dataServiceName: 'timekeepingCrewAssignmentDataService',
				validationServiceName: 'timekeepingCrewAssignmentValidationService'
			};
		};

		this.getCrewAssignmentLayout = function getCrewAssignmentLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'timekeeping.employee.crewAssignment',

				['fromdatetime', 'todatetime', 'employeecrewfk', 'comment'], {
					gid: 'userDefTextGroup',
					isUserDefText: true,
					isUserDefNumber: true,
					isUserDefDate: true,
					attCount: 5
				});
			res.overloads = platformLayoutHelperService.getOverloads(['employeecrewfk'], self);
			return res;
		};

		this.getCrewMemberServiceInfos = function getCrewMemberServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeCrewMemberLayoutService',
				dataServiceName: 'timekeepingEmployeeCrewMemberDataService',
				validationServiceName: 'timekeepingEmployeeCrewMemberValidationService'
			};
		};

		this.getCrewMemberLayout = function getCrewMemberLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory('1.0.0', 'timekeeping.employee.crewmember',
				['code', 'firstname', 'familyname', 'initials'],
				[{
					gid: 'assignment',
					attributes: ['fromdatetime', 'todatetime', 'comment']
				},
				{
					gid: 'company',
					attributes: ['companyfk', 'companyoperatingfk', 'shiftfk', 'timekeepinggroupfk', 'paymentgroupfk']
				}]);
			res.overloads = platformLayoutHelperService.getOverloads(['companyfk', 'companyoperatingfk', 'employeecrewfk', 'shiftfk', 'timekeepinggroupfk', 'paymentgroupfk'], self);
			return res;
		};

		this.getEmployeePictureServiceInfos = function getEmployeePictureServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeePictureLayoutService',
				dataServiceName: 'timekeepingEmployeePictureDataService',
				validationServiceName: 'timekeepingEmployeePictureValidationService'
			};
		};

		this.getEmployeePictureLayout = function getEmployeePictureLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.pictureList',
				['comment', 'picturedate', 'isdefault']
			);
		};

		this.getPlannedAbsenceServiceInfos = function getPlannedAbsenceServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingPlannedAbsenceLayoutService',
				dataServiceName: 'timekeepingPlannedAbsenceDataService',
				validationServiceName: 'timekeepingPlannedAbsenceValidationService'
			};
		};

		this.getPlannedAbsenceLayout = function getPlannedAbsenceLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.plannedAbsence',
				['plannedabsencestatusfk', 'fromdatetime', 'todatetime', 'absenceday', 'timesymbolfk', 'controllingunitfk', 'comment','fromtime','totime']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk', 'controllingunitfk', 'plannedabsencestatusfk'], self);
			res.overloads.timesymbolfk =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'timekeepingTimeSymbol2GroupLookupDataService',
				filterKey: 'timekeeping-planned-absence-filter',
				filter: function (entity) {
					return entity;
				}
			});

			return res;
		};

		this.getSkillServiceInfos = function getSkillServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeSkillLayoutService',
				dataServiceName: 'timekeepingEmployeeSkillDataService',
				validationServiceName: 'timekeepingEmployeeSkillValidationService'
			};
		};

		this.getSkillLayout = function getSkillLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.skill',
				['skillfk', 'validto', 'commenttext', 'refreshdate', 'duration', 'leaddays', 'employeeskillstatusfk']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['skillfk', 'employeeskillstatusfk'], self);
			return res;
		};

		this.getEmployeeDefaultServiceInfos = function getEmployeeDefaultServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeDefaultLayoutService',
				dataServiceName: 'timekeepingEmployeeDefaultDataService',
				validationServiceName: 'timekeepingEmployeeDefaultValidationService'
			};
		};

		this.getEmployeeDefaultLayout = function getEmployeeDefaultLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.employeedefault',
				['from', 'controllingunitfk', 'comment']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['controllingunitfk'], self);
			return res;
		};

		this.getSkillDocumentServiceInfos = function getSkillDocumentServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeSkillDocumentLayoutService',
				dataServiceName: 'timekeepingEmployeeSkillDocumentDataService',
				validationServiceName: 'timekeepingEmployeeSkillDocumentValidationService'
			};
		};

		this.getSkillDocumentLayout = function getSkillDocumentLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'timekeeping.employee.skilldocument',
				['description', 'employeeskilldoctypefk', 'documenttypefk', 'date', 'barcode', 'originfilename']);
			res.overloads = platformLayoutHelperService.getOverloads(['documenttypefk', 'employeeskilldoctypefk', 'originfilename'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getWorkingTimeAccountVServiceInfos = function getWorkingTimeAccountVServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeWorkingTimeAccountLayoutService',
				dataServiceName: 'timekeepingEmployeeWorkingTimeAccountVDataService',
				validationServiceName: ''
			};
		};

		this.getWorkingTimeAccountVLayout = function getWorkingTimeAccountVLayout() {
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory('1.0.0', 'timekeeping.employee.workingtimeaccount',

				['duedate', 'duration', 'fromdatetime', 'todatetime', 'timesymbolfk', 'timesymbolgroupfk', 'projectactionfk', 'reportstatusfk', 'controllingunitfk', 'sheetfk', 'workingtimemodelfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk', 'timesymbolgroupfk', 'reportstatusfk', 'controllingunitfk', 'sheetfk', 'workingtimemodelfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.getEmployeeWorkingTimeModelServiceInfos = function getEmployeeWorkingTimeModelServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeWorkingTimeModelLayoutService',
				dataServiceName: 'timekeepingEmployeeWorkingTimeModelDataService',
				validationServiceName: 'timekeepingEmployeeWorkingTimeModelValidationService'
			};
		};


		this.getEmployeeWorkingTimeModelLayout = function getEmployeeWorkingTimeModelLayout() {
			var res =  platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'timekeeping.employee.employeewtm',

				['employeeworkingtimemodelfk', 'validfrom', 'validto', 'hasoptedpayout', 'timesymbolfk', 'commenttext','employeefallbackwtm','isfallbackwtmactive'],
				platformLayoutHelperService.getUserDefinedTextGroup(3, 'userDefTextGroup', 'userdefinedtext', '0'));
			res.overloads = platformLayoutHelperService.getOverloads(['employeeworkingtimemodelfk', 'timesymbolfk','employeefallbackwtm','isfallbackwtmactive'], self);
			return res;
		};

		this.getEmployeeLicenseCheckServiceInfos = function getEmployeeLicenseCheckServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingEmployeeLicenseCheckLayoutService',
				dataServiceName: 'timekeepingEmployeeLicenseCheckDataService',
				validationServiceName: 'timekeepingEmployeeLicenseCheckValidationService'
			};
		};

		this.getEmployeeLicenseCheckLayout = function getEmployeeLicenseCheckLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.employee.licensecheck',
				['employeedocumentfk', 'approverfk', 'datechecked', 'ishiddeninpublicapi']
			);
			res.overloads = platformLayoutHelperService.getOverloads(['employeedocumentfk', 'approverfk'], self)
			res.overloads.ishiddeninpublicapi = {readonly: true};
			return res;
		};

		this.getOverload = function getOverload(overload) {
			var ovl = null;

			switch (overload) {
				case 'externalid':
					ovl = {readonly: true};
					break;
				case 'remainingvacationpreviousyear':
					ovl = {readonly: true};
					break;
				case 'vacationfromminvacationpaypreyear':
					ovl = {readonly: true};
					break;
				case 'vacationtakencurrentyear':
					ovl = {readonly: true};
					break;
				case 'grantedvacationpreviousyear':
					ovl = {readonly: true};
					break;
				case 'grantedvacationcurrentyear':
					ovl = {readonly: true};
					break;
				case 'lastbillingmonthyear':
					ovl = {readonly: true};
					break;
				case 'grantedvacationincurrentperiod':
					ovl = {readonly: true};
					break;
				case 'availablevacation':
					ovl = {readonly: true};
					break;
				case 'requestedvacationcurrentyear':
					ovl = {readonly: true};
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'companyoperatingfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'trafficlightfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timesymboltrafficlight', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
					});
					break;
				case 'employeefallbackwtm':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingWorkTimeModelFbLookupDataService',
						readonly: true
					});
					break;
				case 'addressfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-common-address-dialog',
							model: 'Address',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'AddressFk',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							field: 'Address',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								'lookupOptions': {
									foreignKey: 'AddressFk',
									titleField: 'cloud.common.entityAddress',
									showClearButton: true
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							}
						}
					};
					break;
				case 'clerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'countryfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCountryLookupDataService'
					});
					break;
				case 'telephonenumbertelfk':
					ovl = {
						'detail': {
							type: 'directive',
							directive: 'basics-common-telephone-dialog',
							model: 'TelephoneNumber',
							options: {
								titleField: 'cloud.common.telephoneNumber',
								foreignKey: 'TelephoneNumberFk',
								showClearButton: true
							}
						}, 'grid': {
							editor: 'lookup',
							field: 'TelephoneNumber',
							'editorOptions': {
								lookupDirective: 'basics-common-telephone-dialog',
								'lookupOptions': {
									foreignKey: 'TelephoneNumberFk',
									titleField: 'cloud.common.telephoneNumber',
									showClearButton: true
								}
							},
							formatter: 'description',
							formatterOptions: {
								displayMember: 'Telephone'
							}
						}
					};
					break;
				case 'telephonenumbermobfk':
					ovl = {
						'detail': {
							type: 'directive',
							directive: 'basics-common-telephone-dialog',
							model: 'TelephoneMobil',
							'options': {
								titleField: 'cloud.common.mobile',
								foreignKey: 'TelephoneMobilFk',
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							field: 'TelephoneMobil',
							'editorOptions': {
								lookupDirective: 'basics-common-telephone-dialog',
								'lookupOptions': {
									foreignKey: 'TelephoneMobilFk',
									titleField: 'cloud.common.mobile',
									showClearButton: true
								}
							},
							formatter: 'description',
							formatterOptions: {
								displayMember: 'Telephone'
							}
						}
					};
					break;
				case 'controllingunitfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								lookupOptions: {
									filterKey: 'prc-con-controlling-by-prj-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ControllingUnit', 'displayMember': 'Code'
							},
							width: 80
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'prc-con-controlling-by-prj-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'shiftfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingShiftByEmployeeOrTkGroupLookupDataService',
						filter: function (entity) {
							if (entity) {
								return entity;
							}
						}
					});
					break;

				case 'skillfk':
					ovl = timekeepingCommonLayoutHelperService.provideResourceSkillOverload();
					break;
				case 'employeegroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeegroup');
					break;
				case 'professionalcategoryfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingprofessionalcategory');
					break;
				case 'paymentgroupfk':
					// ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingpaymentgroup');
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeePaymentGroupLookupDataService'
					});
					break;
				case 'employeecrewfk':
				case 'crewleaderfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeCrewLeaderLookupDataService',
						filterKey: 'timekeeping-crewleader-filter',
					});
					break;
				case 'timesymbolfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingTimeSymbolLookupDataService'
					});
					break;
				case 'timekeepinggroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsTimekeepingGroupLookupDataService',
						filter: function (item) {
							if (item && item.CompanyFk) {
								return item.CompanyFk;
							}
						}
					});
					break;
				case 'calendarfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupCalendarDataService',
						enableCache: true
					});
					break;
				case 'empcertificatefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingEmployeeCertificateLookupDataService',
						navigator: {
							moduleName: 'timekeeping.certificate'
						}
					});
					break;
				case 'groupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepinggroup');
					break;
				case 'documenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype');
					break;

				case 'employeedocumenttypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeedocumenttype');
					break;
				case 'employeeskilldoctypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeeskilldocumenttype', null, {
						field: 'TimesheetContextFk'
					});
					break;
				case 'originfilename':
					ovl = {readonly: true};
					break;
				case 'userfk':
					ovl = platformLayoutHelperService.provideUserLookupDialogOverload();
					break;
				case 'costgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingcostgroup');
					break;
				case 'workingtimemodelfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingWorkTimeModelLookupDataService',
						readonly: true,
					});
					break;
				case 'employeeworkingtimemodelfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'timekeepingWorkTimeModelLookupDataService'
					});
					break;
				case 'employeeareafk':
					// Lookup Service
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeearea');
					break;
				case 'employeesubareafk':
					// Lookup Service
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeesubarea');
					break;
				case 'plannedabsencestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plannedabsencestatus', null, {showIcon: true});
					break;
				case 'employeestatusfk':

					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingemployeestatus', null, {showIcon: true});
					break;
				case 'empcertificatetypefk':

					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeecertificatetype');
					ovl.readonly=true;
					break;
				case 'employeeskillstatusfk':

					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingemployeeskillstatus', null, {showIcon: true});
					break;

				case 'empvalidfrom':
				case 'empvalidto':
					ovl = {readonly: true};
					break;
				case 'isfallbackwtmactive':
					ovl = {readonly: true};
					break;

				case 'placeofworkfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'basics-common-address-dialog',
							model: 'PlaceOfWorkAddress',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'PlaceOfWorkFk',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							field: 'PlaceOfWorkAddress',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								'lookupOptions': {
									foreignKey: 'PlaceOfWorkFk',
									titleField: 'cloud.common.entityAddress',
									showClearButton: true
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							}
						}
					};
					break;
				case 'employeedocumentfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						additionalColumns: false,
						dataServiceName: 'timekeepingEmployeeDocumentLookupDataService',
						filter: function (entity) {
							return entity.EmployeeFk;
						},
					}, {
						required: true,
					});
					break;
				case 'approverfk':
					ovl = platformLayoutHelperService.provideUserLookupDialogOverload();
					break;
			}
			return ovl;
		};

	}
})(angular);
