/**
 * Created by anl on 1/22/2018.
 */


(function (angular) {
    'use strict';

    var ppsReportModule = 'productionplanning.report';

    var ppsActivityModule = 'productionplanning.activity';
    var cloudCommonModule = 'cloud.common';
    var ppsCommonModule = 'productionplanning.common';
    var resourceMasterModule = 'resource.master';
    var basicsCostCodeModule = 'basics.costcodes';
    var basicsCountryModule = 'basics.country';
    var basicsUserformModule = 'basics.userform';
    var ppsDrawingModule = 'productionplanning.drawing';
    var logisticJobModule = 'logistic.job';
    var ppsMountingModule = 'productionplanning.mounting';
	var modelViewerModule = 'model.viewer';

    angular.module(ppsReportModule).factory('productionplanningReportTranslationService', PpsReportTranslationService);

    PpsReportTranslationService.$inject = ['platformTranslationUtilitiesService'];

    function PpsReportTranslationService(platformTranslationUtilitiesService) {
        var service = {};

        var data = {
            toTranslate: {},
            translate: null,
            updateCallback: null,
            allUsedModules: [ppsReportModule, ppsActivityModule, ppsCommonModule, cloudCommonModule,
                resourceMasterModule, basicsCostCodeModule, basicsCountryModule, ppsDrawingModule, logisticJobModule,
                ppsMountingModule, modelViewerModule, basicsUserformModule]
        };

        data.words = {

            Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
            DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},

            ActivityFk: {location: ppsActivityModule, identifier: 'entityActivity', initial: '*Mounting Activity'},
            ClerkFk: {location: cloudCommonModule, identifier: 'entityClerk', initial: '*Clerk'},
            RepStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
            StartTime: {location: ppsReportModule, identifier: 'report.StartTime', initial: '*Start Time'},
            EndTime: {location: ppsReportModule, identifier: 'report.EndTime', initial: '*End Time'},
            ProductFk: {location: ppsReportModule, identifier: 'report2product.productFk', initial: '*Product'},
            ProjectFk:{location: cloudCommonModule, identifier: 'entityProjectNo', initial: '*Project No.'},
            Remarks: {location: cloudCommonModule, identifier: 'entityRemark', initial: '*Remarks'},

            additionalInformation: {
                location: ppsReportModule,
                identifier: 'timesheet.AddInfo',
                initial: '*Additional Information'
            },
            ResourceFk: {location: resourceMasterModule, identifier: 'entityResource', initial: '*Resource'},
            CountryFk: {location: basicsCountryModule, identifier: 'entityCountryFk', initial: '*Country'},
            Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
            Date: {location: cloudCommonModule, identifier: 'entityDate', initial: '*Date'},
            HadBreak: {location: ppsReportModule, identifier: 'timesheet.HadBreak', initial: '*Had Break'},
            BreakTime:{location: ppsReportModule, identifier: 'timesheet.BreakTime', initial: '*Break Time'},
            Vacation: {location: ppsReportModule, identifier: 'timesheet.Vacation', initial: '*Vacation'},
            Sick: {location: ppsReportModule, identifier: 'timesheet.Sick', initial: '*Sick'},
            TimeOff: {location: ppsReportModule, identifier: 'timesheet.TimeOff', initial: '*TimeOff'},
            OverNight: {location: ppsReportModule, identifier: 'timesheet.OverNight', initial: '*OverNight'},
            Driver: {location: ppsReportModule, identifier: 'timesheet.Driver', initial: '*Driver'},
            Leader: {location: ppsReportModule, identifier: 'timesheet.Leader', initial: '*Leader'},
            Doctor: {location: ppsReportModule, identifier: 'timesheet.Doctor', initial: '*Doctor'},
            CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: '*Comment Text'},

            CostCodeFk: {location: basicsCostCodeModule, identifier: 'costCodes', initial: '*Cost Codes'},
            UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*Uom'},

            MntRequisitionId: {location: ppsMountingModule, identifier: 'entityRequisition', initial: '*Mounting Requisition'},
            ProjectId : {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'}
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

        return service;
    }
})(angular);