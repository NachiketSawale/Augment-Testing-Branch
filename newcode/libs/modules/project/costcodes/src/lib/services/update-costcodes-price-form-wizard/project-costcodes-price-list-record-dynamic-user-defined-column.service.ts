/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectCostcodesPriceListRecordDynamicUserDefinedColumnService {

//  let columnOptions = {                      // TODO: basicsCommonUserDefinedColumnServiceFactory not ready
//   columns : {
//     idPreFix : 'Record',
//     overloads : {
//       readonly : true,
//       editor : null
//     }
//   }
// };
// let serviceOptions = {
//   getRequestData : function(item){
//     return {
//       Pk1 : item.CostCodeFk
//     };
//   },
   public getFilterFn(){
//     return function(e, dto){
//       return e.TableId === tableId && e.Pk1 === dto.CostCodeFk && e.Pk2 === dto.Id;
//     };
 }

// return basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesPriceListRecordDynConfigService, userDefinedColumnTableIds.BasicsCostCodePriceList, 'projectCostCodesPriceListRecordDataService', columnOptions, serviceOptions);
// }
}
