(function (angular) {
    /* global _ */
    'use strict';
    angular.module('qto.main').factory('qtoHeaderCreateDialogReadOnlyProcessor',
        ['basicsCommonReadOnlyProcessor','basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', function (commonReadOnlyProcessor, basicsLookupdataLookupDescriptorService, runtimeDataService) {
            var service = commonReadOnlyProcessor.createReadOnlyProcessor({
                uiStandardService: 'qtoMainHeaderUIStandardService',
                readOnlyFields:['QtoTypeFk', 'QtoTargetType', 'BasRubricCategoryFk', 'Code', 'descriptioninfo','IsWQ', 'IsAQ','IsBQ','IsIQ','ClerkFk','BoqHeaderFk','PrcBoqFk', 'PackageFk', 'Package2HeaderFK','OrdHeaderFk','ConHeaderFk']
            });

            service.handlerItemReadOnlyStatus = function (item) {
                service.setFieldsReadOnly(item);
                if(item && item.ProjectFk){
                    service.updateReadOnly(item, ['ProjectFk'], true);
                }
            };

            service.updateReadOnly = function (item, modelArray, value) {
                _.forEach(modelArray, function (model) {
                    runtimeDataService.readonly(item, [
                        {field: model, readonly: value}
                    ]);
                });
            };


            service.getCellEditable = function getCellEditable(item, model) {
                switch (model) {
                    case 'PrcBoqFk':
                        return !!item.PackageFk;
                    case 'PackageFk':
                        return !!item.ProjectFk;
                    case 'Package2HeaderFK':
                        return false;
                    case'ConHeaderFk':
                        return !!item.ProjectFk;
                    case 'OrdHeaderFk':
                        return !!item.ProjectFk;
                    case 'Code':
                        return !item.Code;
                    case 'BasRubricCategoryFk':
                        return false;
                    case 'QtoTypeFk':
                        return  false;
                    default:
                        return true;
                }
            };
            return service;
        }]);
})(angular);