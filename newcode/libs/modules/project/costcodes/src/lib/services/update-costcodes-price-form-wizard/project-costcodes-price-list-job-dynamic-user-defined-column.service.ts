/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ProjectCostcodesPriceListJobDynamicUserDefinedColumnService {

    //     let fieldSuffix = 'New';
    //     let columnOptions = {
    //         columns : {
    //             idPreFix : 'Job',
    //             nameSuffix : '(' + $translate.instant('basics.common.userDefinedColumn.projectSuffix') + ')',
    //             overloads : {
    //                 readonly : true,
    //                 editor : null
    //             }
    //         },
    //         additionalColumns : true,
    //         additionalColumnOption : {
    //             idPreFix : fieldSuffix,
    //             fieldSuffix : fieldSuffix,
    //             nameSuffix : ' - ' + $translate.instant('project.costcodes.new'),
    //         }
    //     };
    //     let serviceOptions = {
    //         getRequestData : function(item){
    //             return {
    //                 Pk1 : item.ProjectFk
    //             };
    //         },
    //         getFilterFn : function(tableId){
    //             return function(e, dto){
    //                 return e.TableId === tableId && e.Pk1 === dto.ProjectFk && e.Pk2 === dto.Id && e.Pk3 === dto.LgmJobFk;
    //             };
    //         },
    //         getModifiedItem : function(tableId, item){
    //             return {
    //                 TableId : tableId,
    //                 Pk1 : item.ProjectFk,
    //                 Pk2 : item.Id,
    //                 Pk3 : item.LgmJobFk
    //             };
    //         }
    //     };
    //     let service = basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesPriceListJobDynConfigService, userDefinedColumnTableIds.ProjectCostCodeJobRate, 'projectCostCodesPriceListForJobDataService', columnOptions, serviceOptions);
    //     let baseAttachDataToColumn = service.attachDataToColumn;
    //     service.attachDataToColumn = function(items){
    //         let deferred = $q.defer();
    //         let filterFn = serviceOptions.getFilterFn(userDefinedColumnTableIds.ProjectCostCodeJobRate);
    //         baseAttachDataToColumn(items).then(function(attachedItems){
    //             service.getValueList().then(function(existedValues){
    //                 let extendColumns = _.filter(service.getDynamicColumns(), function(column){ return column.isExtend; });
    //                 attachedItems.forEach(function(item){
    //                     let existedUserDefinedVal = _.find(existedValues, function(e){
    //                         return filterFn(e, item);
    //                     });
    //                     _.forEach(extendColumns, function(extendColumn){
    //                         let field = extendColumn.field;
    //                         let valueField = _.isString(fieldSuffix) ? field.replace(fieldSuffix, '') : field;
    //                         if(existedUserDefinedVal) {
    //                             item[field] = existedUserDefinedVal && existedUserDefinedVal[valueField] ? existedUserDefinedVal[valueField] : 0;
    //                         }
    //                         else {
    //                             item[field] = 0;
    //                         }
    //                     });
    //                 });
    //                 deferred.resolve(attachedItems);
    //             });
    //         });
    //         return deferred.promise;
    //     };

          public setExtendValueBack () {     // TODO
            // let extendColumns = _.filter(service.getDynamicColumns(), function(column){ return column.isExtend; });
            // _.forEach(extendColumns, function(extendColumn) {
            //     let extendField = extendColumn.field;
            //     let valueField = extendField.replace(fieldSuffix, '');
            //     item[extendField] = item[valueField];
            // });
        }

    //     service.getExtendFieldSuffix = function (){
    //         return fieldSuffix;
    //     };
 
          public saveDynamicValues() { // TODO
    //         let extendColumns = _.filter(service.getDynamicColumns(), function(column){ return column.isExtend; });
    //         _.forEach(items, function(item) {
    //             _.forEach(extendColumns, function(extendColumn) {
    //                 let extendField = extendColumn.field;
    //                 let valueField = extendField.replace(fieldSuffix, '');
    //                 if (item[valueField] !== item[extendField]) {
    //                     service.fieldChange(item, valueField, item[extendField]);
    //                 }
    //             });
    //         });
    //         service.update();
    //     };
    //     return service;
     }

}
