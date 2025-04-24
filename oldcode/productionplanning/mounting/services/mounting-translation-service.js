/**
 * Created by anl on 7/20/2017.
 */

(function (angular) {
    'use strict';

    var ppsMountingModule = 'productionplanning.mounting';
    var cloudCommonModule = 'cloud.common';
    var ppsCommonModule = 'productionplanning.common';
    var basicsClerkModule = 'basics.clerk';
    var trsBundleModule = 'transportplanning.bundle';
    var trsRequisitionModule = 'transportplanning.requisition';
    var resReservationModule = 'resource.reservation';
    var basicsCostCodeModule = 'basics.costcodes';
    var basicsCountryModule = 'basics.country';
    var basicsUserformModule = 'basics.userform';
    var resourceMasterModule = 'resource.master';
    var ppsActivityModule = 'productionplanning.activity';
    var ppsReportModule = 'productionplanning.report';
    var projectCostCodesModule = 'project.costcodes';
    var customizeModule = 'basics.customize';
    var projectMainModule = 'project.main';
    var bizPartnerModule = 'businesspartner.main';
    var documentsProjectModule = 'documents.project';
	var modelViewerModule = 'model.viewer';
	var modelSimulationModule = 'model.simulation';

    angular.module(ppsMountingModule).factory('productionplanningMountingTranslationService', MountingTranslationService);

    MountingTranslationService.$inject = ['platformTranslationUtilitiesService'];

    function MountingTranslationService(platformTranslationUtilitiesService) {
        var service = {};

        var data = {
            toTranslate: {},
            translate: null,
            updateCallback: null,
            allUsedModules: [ppsMountingModule, ppsCommonModule, cloudCommonModule, basicsClerkModule,
                trsBundleModule, resReservationModule, trsRequisitionModule, basicsCostCodeModule, basicsCountryModule,
                resourceMasterModule, ppsActivityModule, ppsReportModule, projectCostCodesModule, customizeModule,
                projectMainModule, bizPartnerModule, documentsProjectModule, modelViewerModule, modelSimulationModule,
                basicsUserformModule]
        };

        data.words = {
            UpdateComment: {location: ppsMountingModule, identifier: 'updateComments', initial: '*Comments for updating'},
	        UpdateReason: {location: ppsCommonModule, identifier: 'updateReason', initial: '*UpdateReason'},
            UpdateRemark: {location: ppsMountingModule, identifier: 'updateRemarks', initial: '*Remarks for updating'},
            baseGroup: {location: ppsMountingModule, identifier: 'baseGroup', initial: 'Basic Data'},

            Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
            Descriptioninfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},

            ReqFk: {location: ppsMountingModule, identifier: 'entityRequisition', initial: 'Mounting Requisition'},
            ReqStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
            ClerkFk: {location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
            PpsHeaderFk: {location: ppsCommonModule, identifier: 'event.headerFk', initial: '*PPS Header'},
            StartDate: {location: ppsMountingModule, identifier: 'requisition.startDate', initial: 'Start Date'},
            EndDate: {location: ppsMountingModule, identifier: 'requisition.endDate', initial: 'End Date'},
            LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job'},
            Remarks: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
            IsLive: {location: customizeModule, identifier: 'islive', initial: '*Is Live'},

            StgStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
            LocationFk: {location: ppsCommonModule, identifier: 'prjLocationFk', initial: 'Location'},
            EstWorkingHours: {
                location: ppsActivityModule,
                identifier: 'activity.Estworkinghours',
                initial: 'Planned Working Hours'
            },
            ActWorkingHours: {
                location: ppsActivityModule,
                identifier: 'activity.Actworkinghours',
                initial: 'Actual Working Hours'
            },

            planInformation: {
                location: ppsCommonModule,
                identifier: 'event.planInformation',
                initial: 'Planning Information'
            },
            ActStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
            EventTypeFk: {location: ppsCommonModule, identifier: 'event.eventTypeFk', initial: 'Event Type'},
            PlannedStart: {location: ppsCommonModule, identifier: 'event.plannedStart', initial: 'Planned StartDate'},
            PlannedFinish: {
                location: ppsCommonModule,
                identifier: 'event.plannedFinish',
                initial: 'Planned FinishDate'
            },
            EarliestStart: {
                location: ppsCommonModule,
                identifier: 'event.earliestStart',
                initial: 'Earliest StartDate'
            },
            LatestStart: {location: ppsCommonModule, identifier: 'event.latestStart', initial: 'Latest StartDate'},
            EarliestFinish: {
                location: ppsCommonModule,
                identifier: 'event.earliestFinish',
                initial: 'Earliest FinishDate'
            },
            LatestFinish: {location: ppsCommonModule, identifier: 'event.latestFinish', initial: 'Latest FinishDate'},

            RepStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
            StartTime: {location: ppsReportModule, identifier: 'report.StartTime', initial: 'Start Time'},
            EndTime: {location: ppsReportModule, identifier: 'report.EndTime', initial: 'End Time'},
            ProductFk: {location: ppsReportModule, identifier: 'report2product.productFk', initial: 'Product'},
            ProjectFk: {location: ppsMountingModule, identifier: 'requisition.projectFk', initial: 'ProjectNo'},

            additionalInformation: {
                location: ppsReportModule,
                identifier: 'timesheet.AddInfo',
                initial: 'Additional Information'
            },
            ResourceFk: {location: resReservationModule, identifier: 'entityResource', initial: 'Resource'},
            CountryFk: {location: basicsCountryModule, identifier: 'entityCountryFk', initial: 'Country'},
            Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
            Date: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
            HadBreak: {location: ppsReportModule, identifier: 'timesheet.HadBreak', initial: 'Had Break'},
            BreakTime: {location: ppsReportModule, identifier: 'timesheet.BreakTime', initial: '*Break Time'},
            Vacation: {location: ppsReportModule, identifier: 'timesheet.Vacation', initial: 'Vacation'},
            Sick: {location: ppsReportModule, identifier: 'timesheet.Sick', initial: 'Sick'},
            TimeOff: {location: ppsReportModule, identifier: 'timesheet.TimeOff', initial: 'TimeOff'},
            OverNight: {location: ppsReportModule, identifier: 'timesheet.OverNight', initial: 'OverNight'},
            Driver: {location: ppsReportModule, identifier: 'timesheet.Driver', initial: 'Driver'},
            Leader: {location: ppsReportModule, identifier: 'timesheet.Leader', initial: 'Leader'},
            Doctor: {location: ppsReportModule, identifier: 'timesheet.Doctor', initial: '*Doctor'},
            CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment Text'},

            CostCodeFk: {location: basicsCostCodeModule, identifier: 'costCodes', initial: 'Cost Codes'},
            UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*Uom'},
            BizPartnerFk: {location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: '*Business Partner'},
            SubsidiaryFk: {location: projectMainModule, identifier: 'entitySubsidiary', initial: '*Subsidiary'},
            RoleFk: {location: projectMainModule, identifier: 'entityRole', initial: '*Role'},
            ContactFk: {location: projectMainModule, identifier: 'entityContact', initial: '*Contact'},
            ContactRoleTypeFk: {location: customizeModule, identifier: 'projectcontractroletype', initial: '*Contact Role Type'},
            TelephoneNumberFk: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: '*Telephone Number'},
            TelephoneNumber2Fk: {location: bizPartnerModule, identifier: 'telephoneNumber2', initial: '*Other Tel.'},
            TelephoneNumberMobileFk: {location: cloudCommonModule, identifier: 'mobile', initial: '*Telephone Mobil'},
            Email: {location: cloudCommonModule, identifier: 'email', initial: '*Email'},
            FirstName: {location: basicsClerkModule, identifier: 'entityFirstName', initial: '*First Name'},
            Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting'}
        };

        //Get some predefined packages of words used in project
        platformTranslationUtilitiesService.addHistoryTranslation(data.words);
        platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
        platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');


        //Convert word list into a format used by platform translation service
        data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

        //Prepare interface of service and load translations
        platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
        platformTranslationUtilitiesService.loadModuleTranslation(data);
        platformTranslationUtilitiesService.registerModules(data);

        service.data = data;
        return service;
    }
})(angular);

