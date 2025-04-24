(function (angular) {
    'use strict';

    /*
     ** productionplanning.configuration module is created.
     */
    var moduleName = 'productionplanning.configuration';

    var moduleSubModule = 'ProductionPlanning.Configuration';
    angular.module(moduleName, []);
    globals.modules.push(moduleName);

    angular.module(moduleName).config(['mainViewServiceProvider',
        function (platformLayoutService) {
            var options = {
                'moduleName': moduleName,
                'resolve': {
                    'loadDomains': ['platformSchemaService', function (platformSchemaService) {
                        return platformSchemaService.getSchemas([
                            {typeName: 'EventTypeDto', moduleSubModule: moduleSubModule},
                            {typeName: 'EventType2ResTypeDto', moduleSubModule: moduleSubModule},
                            {typeName: 'EngType2PpsEventTypeDto', moduleSubModule: moduleSubModule},
                            {typeName: 'EngTypeDto', moduleSubModule: moduleSubModule},
                            {typeName: 'EventTypeSlotDto', moduleSubModule: moduleSubModule},
                            {typeName: 'ClerkRoleSlotDto', moduleSubModule: moduleSubModule},
                            {typeName: 'PpsPlannedQuantitySlotDto', moduleSubModule: moduleSubModule},
                            {typeName: 'PpsPhaseDateSlotDto', moduleSubModule: moduleSubModule},
                            {typeName: 'PpsLogConfigDto', moduleSubModule: moduleSubModule},
                            {typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'}, // is indirectly referenced by PU lookup in Log Config container
                            {typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
                            {typeName: 'PpsExternalconfigDto', moduleSubModule: moduleSubModule},
                            {typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
	                        {typeName: 'PpsUpstreamItemTemplateDto', moduleSubModule: moduleSubModule},
	                        {typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
	                        {typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
	                        {typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
	                        { typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item' },
                            { typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing' },
                            {typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
                            {typeName: 'PpsStatusTriggerRuleDto', moduleSubModule: 'ProductionPlanning.Configuration'},
                        ]);
                    }],
                    'loadLookups': ['basicsLookupdataLookupDescriptorService', function (lookupDescriptorService) {
                        return lookupDescriptorService.loadData('PpsDDTable');
                    }],
                    'preTranslate': ['ppsConfigurationLogConfigTypeService', function (logConfigTypeService) {
                        return logConfigTypeService.translateConfigTypes();
                    }],
                    'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
                        return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'productionplanning.formulaconfiguration']);
                    }]
                }

            };

            platformLayoutService.registerModule(options);
        }
    ]);

})(angular);