/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	'use strict';

	const timekeepingModule = 'timekeeping.employee';
	const basicsClerkModule = 'basics.clerk';
	const cloudCommonModule = 'cloud.common';
	const customizeModule = 'basics.customize';
	const resourceSkillModule = 'resource.skill';
	const tkCommonModule = 'timekeeping.common';
	const ppsCommon = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeTranslationService
	 * @description provides translation for timekeeping employee module
	 */
	angular.module(timekeepingModule).factory('timekeepingEmployeeTranslationService', ['_','platformTranslationUtilitiesService',

		function (_,platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [timekeepingModule, basicsClerkModule, cloudCommonModule, customizeModule, resourceSkillModule, tkCommonModule, ppsCommon]};

			data.words = {
				configuration: {location: customizeModule, identifier: 'configurationfk'},
				Code: {location: timekeepingModule, identifier: 'entityEmployeeNumber'},
				CompanyOperatingFk: {location: timekeepingModule, identifier: 'entityOperatingCompany'},
				FirstName: {location: timekeepingModule, identifier: 'entityFirstName'},
				FamilyName: {location: timekeepingModule, identifier: 'entityFamilyName'},
				Initials: {location: timekeepingModule, identifier: 'entityInitials'},
				AddressFk: {location: cloudCommonModule, identifier: 'entityAddress'},
				TelephoneNumberTelFk: {location: cloudCommonModule, identifier: 'telephoneNumber'},
				TelephoneNumberMobFk: {location: cloudCommonModule, identifier: 'mobile'},
				CountryFk: {location: cloudCommonModule, identifier: 'entityCountry'},
				Email: {location: cloudCommonModule, identifier: 'email'},
				BirthDate: {location: timekeepingModule, identifier: 'entityBirthDate'},
				StartDate: {location: cloudCommonModule, identifier: 'entityStartDate'},
				TerminalDate: {location: timekeepingModule, identifier: 'entityTerminalDate'},
				IsCrewLeader: {location: timekeepingModule, identifier: 'entityIsCrewLeader'},
				IsWhiteCollar: {location: timekeepingModule, identifier: 'entityIsWhiteCollar'},
				IsHiredLabor: {location: timekeepingModule, identifier: 'entityIsHiredLabor'},
				IsTimekeeper: {location: timekeepingModule, identifier: 'entityIsTimekeeper'},
				EmployeeGroupFk: {location: timekeepingModule, identifier: 'entityEmployeeGroup'},
				TimekeepingGroupFk: {location: timekeepingModule, identifier: 'entityTimekeepingGroup'},
				ShiftFk: {location: timekeepingModule, identifier: 'entityShift'},
				ProfessionalCategoryFk: {location: timekeepingModule, identifier: 'entityProfessionalCategoryFk', initial: 'Professional Category'},
				PaymentGroupFk: {location: timekeepingModule, identifier: 'entityPaymentGroupFk'},
				FromDateTime: {location: timekeepingModule, identifier: 'entityFromDateTime'},
				ToDateTime: {location: timekeepingModule, identifier: 'entityToDateTime'},
				EmployeeCrewFk: {location: timekeepingModule, identifier: 'entityCrewLeader'},
				PictureDate: {location: timekeepingModule, identifier: 'entityPictureDate'},
				TimeSymbolFk: {location: timekeepingModule, identifier: 'entityTimeSymbol'},
				ClerkFk: {location: basicsClerkModule, identifier: 'entityClerk'},
				SkillFk: {location: resourceSkillModule, identifier: 'resourceSkillEntity'},
				ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo'},
				CommentText: { location: cloudCommonModule, identifier: 'entityComment' },
				LeadDays: { location: timekeepingModule, identifier: 'entityLeaddays' },
				From: {location: tkCommonModule, identifier: 'from'},
				ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit'},
				CostGroupFk: {location: timekeepingModule, identifier: 'entityCostGroup'},
				WorkingTimeModelFk: {location: timekeepingModule, identifier: 'entityWorkingTimeModel'},
				CalendarFk: {location: cloudCommonModule, identifier: 'entityCalCalendarFk'},
				GroupFk: {location: timekeepingModule, identifier: 'group'},
				assignment: {location: timekeepingModule, identifier: 'employeeAssignment'},
				company: {location: cloudCommonModule, identifier: 'entityCompany'},
				CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany'},
				EmployeeSkillDocTypeFk: {location: timekeepingModule, identifier: 'entityEmployeeSkillDocTypeFk'},
				DocumentTypeFk: {location: cloudCommonModule, identifier: 'entityType'},
				Date: {location: cloudCommonModule, identifier: 'entityDate'},
				Barcode: {location: timekeepingModule, identifier: 'entityBarcode'},
				OriginFileName: {location: timekeepingModule, identifier: 'entityOriginFileName'},
				RefreshDate: {location: timekeepingModule, identifier: 'entityRefreshDate'},
				IsLive: {location: cloudCommonModule, identifier: 'entityIsLive'},
				UserFk: {location: basicsClerkModule, identifier: 'entityUserFk'},
				TimeSymbolGroupFk: {location: timekeepingModule, identifier: 'entityTimeSymbolGroup'},
				DueDate: {location: timekeepingModule, identifier: 'entityDueDate'},
				Duration: {location: timekeepingModule, identifier: 'entityDuration'},
				SheetFk: {location: timekeepingModule, identifier: 'entitySheet'},
				ReportstatusFk: {location: timekeepingModule, identifier: 'entityReportStatus'},
				ControllingunitFk:{location: timekeepingModule, identifier: 'entityControllingunit'},
				ProjectActionFk: { location: timekeepingModule, identifier: 'entityProjectAction' },
				Absenceday: { location: timekeepingModule, identifier: 'entityAbsenceday' },
				WorkingTimeAccountBalance:{location: timekeepingModule, identifier: 'entityWorkingTimeAccountBalance'},
				EmployeeAreaFk:{location: timekeepingModule, identifier: 'employeeArea'},
				EmployeeSubAreaFk:{location: timekeepingModule, identifier: 'employeeSubArea'},
				EmployeeStatusFk: { location: timekeepingModule, identifier: 'employeeStatusFk' },
				EmployeeSkillStatusFk: { location: timekeepingModule, identifier: 'employeeSkillStatusFk' },
				IsPayroll:{location: timekeepingModule, identifier: 'EntityIsPayroll'},
				HasOptedPayout:{location: timekeepingModule, identifier: 'EntityHasOptedPayout'},
				ValidFrom:{location: timekeepingModule, identifier: 'EntityValidFrom'},
				EmployeeWorkingTimeModelFk:{location: timekeepingModule, identifier: 'EntityEmployeeWorkingtimeModelFk'},
				PlannedAbsenceStatusFk:{location: timekeepingModule, identifier: 'PlannedAbsenceStatusFk'},
				TimesymbolFk:{location: timekeepingModule, identifier: 'entityTimesymbolFk'},
				VacationBalance: {location: timekeepingModule, identifier: 'entityVacationBalance'},
				YearlyVacation: {location: timekeepingModule, identifier: 'entityYearlyVacation'},
				TrafficLightFk: {location: timekeepingModule, identifier: 'entityTrafficLight'},
				baseGroup:{location: 'cloud.common', identifier:'entityProperties', initial: 'Basic Data'},
				userDefTextGroup: {location: 'cloud.common', identifier: 'UserdefTexts', initial: 'Userdefined Texts'},
				GenerateRecording:{location: timekeepingModule, identifier: 'entityGenerateRecording'},
				CrewLeaderFk: {location: timekeepingModule, identifier: 'entityCurrentCrewLeader'},

				EmployeeFk: {location: timekeepingModule, identifier: 'entityEmployee'},
				EmployeeDocumentTypeFk: {location: timekeepingModule, identifier: 'entityEmployeeDocumentTypeFk'},
				FileArchiveDocFk: {location: timekeepingModule, identifier: 'entityFileArchiveDocFk'},
				Url: {location: timekeepingModule, identifier: 'entityUrl'},
				IsHiddenInPublicApi: {location: timekeepingModule, identifier: 'entityIsHiddenInPublicPpi'},
				EmpCertificateFk: {location: timekeepingModule, identifier: 'entityCertificateFk'},
				EmpCertificateTypeFk: {location: timekeepingModule, identifier: 'entityCertificateTypeFk'},
				EmpValidFrom: {location: timekeepingModule, identifier: 'empValidFrom'},
				EmpValidTo: {location: timekeepingModule, identifier: 'empValidTo'},
				EmployeeFallbackWTM :{location: timekeepingModule, identifier: 'employeefallbackwtm'},
				IsFallbackWtmActive :{location: timekeepingModule, identifier: 'IsfallbackActive'},
				BookingDate :{location: timekeepingModule, identifier: 'BookingDate'},
				Comment :{location: timekeepingModule, identifier: 'Comment'},
				IsYearlyStartScheduleEntry :{location: timekeepingModule, identifier: 'entityIsYearlyStartScheduleEntry'},
				IsYearlyExpireScheduleEntry :{location: timekeepingModule, identifier: 'entityIsYearlyEndScheduleEntry'},
				IsClocking:{location: timekeepingModule, identifier: 'entityIsClocking'},
				FromTime :{location: timekeepingModule, identifier: 'entityFromTime'},
				ToTime :{location: timekeepingModule, identifier: 'entityToTime'},
				AbsentTill:{location: timekeepingModule, identifier: 'entityAbsentTill'},
				PlaceOfWorkFk:{location: timekeepingModule, identifier: 'entityPlaceOfWorkFk'},
				ExternalId: {location: timekeepingModule, identifier: 'entityExternalId'},
				RemainingVacationPreviousYear: {location: timekeepingModule, identifier: 'entityRemainingVacationPreviousYear'},
				VacationFromMinVacationPayPreYear: {location: timekeepingModule, identifier: 'entityVacationFromMinVacationPayPreYear'},
				GrantedVacationPreviousYear: {location: timekeepingModule, identifier: 'entityGrantedVacationPreviousYear'},
				GrantedVacationCurrentYear: {location: timekeepingModule, identifier: 'entityGrantedVacationCurrentYear'},
				VacationTakenCurrentYear:{location: timekeepingModule, identifier: 'entityVacationTakenCurrentYear'},
				LastBillingMonthYear: {location: timekeepingModule, identifier: 'entityLastBillingMonthYear'},
				GrantedVacationInCurrentPeriod: {location: timekeepingModule, identifier: 'entityGrantedVacationInCurrentPeriod'},
				AvailableVacation: {location: timekeepingModule, identifier: 'entityAvailableVacation'},
				RequestedVacationCurrentYear:{location: timekeepingModule, identifier: 'entityRequestedVacationCurrentYear'},
				EmployeeDocumentFk: {location: timekeepingModule, identifier: 'employeesDocument'},
				DateChecked: {location: timekeepingModule, identifier: 'entityDateChecked'},
				ApproverFk: {location: timekeepingModule, identifier: 'entityApprover'},
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
