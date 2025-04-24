import { inject, Injectable } from '@angular/core';
import { IEstimateParameter, IEstimateParameterUpdateData } from '../model/estimate-parameter.interface';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IBoqItemEntity } from '@libs/boq/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EstimateParameterUpdateService {

  public paramToSave: IEstimateParameter[] = [];
  public paramToDelete : IEstimateParameter[] = [];
  public prjParamToSave : IEstimateParameter[] = [];
  // TODO
  //  private estimateMainService = inject(EstimateMainService);
    private estimateMainContextService = inject(EstimateMainContextService);
 // private costGrpCatalogServ = inject('costGroupCatalogService');
 // private platformModuleStateService = inject('platformModuleStateService');
 // private estimateParameterComplexLookupValidationService = inject('estimateParameterComplexLookupValidationService);

  /**
   *
   * @param item IEstimateParameter
   * @param selectedItem IEstimateParameter
   * @param serviceName String
   * @param itemName String
   * @returns item
   */
  public getLeadingStructureContext(item:IEstimateParameter, selectedItem:IEstimateParameter, serviceName:string, itemName:string) : IEstimateParameter {
    let destItem:IEstimateParameter = {
      IsRoot: '',
      EstHeaderFk: 0,
      Id: 0,
      LineItemType: 0,
      EstAssemblyCatFk: 0,
      PrjProjectFk: 0,
      ProjectFk: 0,
      EstLineItemFk: 0,
      Code:''
    };

    if(serviceName ==='boqMainService' || serviceName ==='estimateMainBoqService' ) {
      destItem.IsRoot = selectedItem.IsRoot;
      destItem.EstHeaderFk = selectedItem.EstHeaderFk;
      destItem.Id = selectedItem.Id;
      destItem.LineItemType = selectedItem.LineItemType;
      destItem.EstAssemblyCatFk = selectedItem.EstAssemblyCatFk;
      destItem.PrjProjectFk = selectedItem.PrjProjectFk;
      destItem.PrjEstRuleFk = selectedItem.PrjEstRuleFk;
      destItem.CostGroupCatalogFk = selectedItem.CostGroupCatalogFk;
      destItem.BoqHeaderFk = selectedItem.BoqHeaderFk;
    }else{
      destItem = selectedItem;
    }

    const itemId:number|undefined = destItem.IsRoot ? destItem.EstHeaderFk : destItem.Id;
    // TODO
    // if (typeof itemId === "string") {
    //   itemId = parseInt(itemId.replace('schedule', ''), 10);
    // }

    item.EstLeadingStructureId = itemId;
    item.LineItemType = null;
    if(destItem.IsRoot){
      item.EstHeaderFk = itemId;
    }else{
      // share the code with construction system
      switch (serviceName){
        case'estimateMainRootService':
          item.EstHeaderFk= itemId;
          break;
        case'estimateMainService':
          item.LineItemType = destItem.LineItemType;
          if(item.LineItemType === 0 && !itemName){
            item = destItem;
          }
          item.EstLineItemFk = itemId;
          item.EstHeaderFk = destItem.EstHeaderFk || this.estimateMainContextService.getSelectedEstHeaderId();
          item.EstAssemblyCatFk =  destItem.EstAssemblyCatFk;
          break;
        case'estimateAssembliesService':
          item.EstLineItemFk = itemId;
          item.EstHeaderFk = destItem.EstHeaderFk;
          item.EstAssemblyCatFk = destItem.EstAssemblyCatFk;
          break;
        case'constructionSystemMainBoqService':
        case'estimateMainBoqService':
          item.BoqItemFk = itemId;
          item.BoqHeaderFk = destItem.BoqHeaderFk;
          break;
        case'boqMainService':
          item.BoqItemFk = destItem.Id;
          item.BoqHeaderFk = destItem.BoqHeaderFk;
          break;
        case'estimateMainActivityService':
          item.PsdActivityFk = itemId;
          break;
        case'estimateMainAssembliesCategoryService':
          item.EstAssemblyCatFk = itemId;
          break;
        case 'projectAssemblyStructureService':
          item.EstAssemblyCatFk = itemId;
          item.IsPrjAssembly = true;
          item.ProjectFk = destItem.PrjProjectFk;
          break;
        case 'projectAssemblyMainService':
          item.EstLineItemFk = itemId;
          item.IsPrjAssembly = true;
          item.EstHeaderFk = destItem.EstHeaderFk;
          item.ProjectFk = destItem.PrjProjectFk;
          item.EstAssemblyCatFk = destItem.EstAssemblyCatFk;
          break;
        case 'projectPlantAssemblyMainService':
          item.EstLineItemFk = itemId;
          item.IsPrjPlantAssembly = true;
          item.EstHeaderFk = destItem.EstHeaderFk;
          item.ProjectFk = destItem.PrjProjectFk;
          item.EstAssemblyCatFk = destItem.EstAssemblyCatFk;
          break;
        case'constructionSystemMainLocationService':
        case'estimateMainLocationService':
          item.PrjLocationFk = itemId;
          break;
        case'constructionSystemMainControllingService':
        case'estimateMainControllingService':
          item.MdcControllingUnitFk = itemId;
          break;
        case'estimateMainProcurementStructureService':
          item.PrcStructureFk = itemId;
          break;
        case 'costGroupStructureDataServiceFactory':
          item.BasCostGroupFk = item.CostGroupFk = itemId;
          item.CostGroupCatFk = destItem.CostGroupCatalogFk;
          item.PrjEstRuleFk = destItem.PrjEstRuleFk;

          // TODO costGroupCatalogService
          // var costGroupCatalogService = costGroupCatalogServ;
          // if(costGroupCatalogService && costGroupCatalogService.getSelected()){
          //   let costGroupSelected = costGroupCatalogService.getSelected();
          //   item.CostGrpType = costGroupSelected.ProjectFk ?'PrjCostGrp':'EstCostGrp';
          // }

          break;
      }
    }

    return item;
  }

  /**
   *
   * @param item IEstimateParameter
   * @param selectedItem IEstimateParameter
   * @param serviceName String
   * @param itemName String
   * @returns item
   */
  public getLeadingStructureContextNew(item:IEstimateParameter, destItem:IEstimateParameter, serviceName:string, itemName:string) : IEstimateParameter {
    const itemId:number|undefined = destItem.IsRoot ? destItem.EstHeaderFk : destItem.Id;

    // TODO
    // if (typeof itemId === 'string') {
    //   itemId = itemId.replace('schedule', '');
    // }

    item.EstLeadingStructureId = itemId;
    item.LineItemType = null;
    if(item.AssignedStructureId){
      switch (item.AssignedStructureId){
        case 1010:
          item.EstHeaderFk= destItem.EstHeaderFk;
          break;
        case 1001:
          item.EstLineItemFk = itemId;
          item.EstHeaderFk = destItem.EstHeaderFk;
          item.EstAssemblyCatFk =  destItem.EstAssemblyCatFk;
          item.LineItemType = destItem.LineItemType;
          break;
        case 1000:
          item.EstLineItemFk = itemId;
          break;
        case 1:
          item.BoqItemFk = itemId;
          item.BoqHeaderFk = destItem.BoqHeaderFk;
          break;
        case 2:
          item.PsdActivityFk = itemId;
          break;
        case 3:
          item.PrjLocationFk = itemId;
          break;
        case 4:
          item.MdcControllingUnitFk = itemId;
          break;
        case 5:
          item.PrcStructureFk = itemId;
          break;
        case 6:
          item.LicCostGrp1Fk = itemId;
          break;
        case 7:
          item.LicCostGrp2Fk = itemId;
          break;
        case 8:
          item.LicCostGrp3Fk = itemId;
          break;
        case 9:
          item.LicCostGrp4Fk = itemId;
          break;
        case 10:
          item.LicCostGrp5Fk = itemId;
          break;
        case 11:
          item.PrjCostGrp1Fk = itemId;
          break;
        case 12:
          item.PrjCostGrp2Fk = itemId;
          break;
        case 13:
          item.PrjCostGrp3Fk = itemId;
          break;
        case 14:
          item.PrjCostGrp4Fk = itemId;
          break;
        case 15:
          item.PrjCostGrp5Fk = itemId;
          break;
        case 16:
          item.EstAssemblyCatFk = itemId;
          break;
      }
    } else {
      item = this.getLeadingStructureContext(item, destItem, serviceName, itemName);
    }

    return item;
  }

  /**
   *
   * @param item IEstimateParameter
   * @param destItem IEstimateParameter
   * @param serviceName String
   * @param itemName String
   * @param action String
   */
  public setParamItem(item:IEstimateParameter, destItem:IEstimateParameter, serviceName:string, itemName:string, action:string) : void {
    item.Action = action;
    item.ItemName = destItem.IsRoot ? 'EstHeader' : itemName;
    item.EstParameterGroupFk = item.ParametergroupFk ? item.ParametergroupFk:item.EstParameterGroupFk;
    item.ParameterValue = typeof item.ParameterValue === 'number' && !isNaN(item.ParameterValue) ? item.ParameterValue : 0;
    item = this.getLeadingStructureContextNew(item, destItem, serviceName, itemName);
    this.paramToSave.push(item);
    if(!destItem.ParamAssignment){
      destItem.ParamAssignment = [];
    }
  }

  /**
   *
   * @param params IEstimateParameter
   * @param destItem IEstimateParameter
   * @param serviceName String
   * @param itemName String
   */
  public setParamToSave(params:IEstimateParameter[], destItem:IEstimateParameter, serviceName:string, itemName:string) : void {

    if(Array.isArray(params)){
      params.forEach((param) => {
        if(param){
          if(destItem && Array.isArray(destItem.Param) && destItem.Param.indexOf(param.Code) !== -1){
            return;
          }
          this.prjParamToSave.push(param);
          this.setParamItem(param, destItem, serviceName, itemName, 'ToSave');
        }
      });

      const errorCount = params.filter(item => () => {
        return item.__rt$data && item.__rt$data.errors;
      }).length;
      if(errorCount < params.length) {
        this.increaseModifiedEntityCount();
      }
    }
  }

  /**
   *
   * @param updateData IEstimateParameter
   * @param estHeaderId Number
   * @returns Updated data
   */
  public updateParamToSave(updateData:IEstimateParameterUpdateData, estHeaderId:number) : IEstimateParameterUpdateData {
    //TODO estimateParameterComplexLookupValidationService
    //let complexLookupService = estimateParameterComplexLookupValidationService;

    this.paramToSave.forEach(item=>{
      // if found the item has error validation, not add it to updateData
      // let errors = complexLookupService.getValidationIssues();
      // let hasValidationError = errors.find(issue => {
      //   return issue.entity.Id === item.Id;
      // });

      // fix defect 88659, not save the param with default '...' code or wrong code validation
      // if((item.__rt$data && item.__rt$data.errors)? item.__rt$data.errors.Code || item.__rt$data.errors.ValueDetail : false ){
      //   hasValidationError = true;
      // }
      // if(item.Code === '...'){
      //   hasValidationError = true;
      // }

      // if(item && !hasValidationError){
      //   if(!_.isArray(updateData[item.ItemName + 'Param'+ item.Action])){
      //     updateData[item.ItemName + 'Param'+ item.Action] = [];
      //   }
      //   item.EstHeaderFk = estHeaderId > 0 ? estHeaderId : item.EstHeaderFk;
      //   item.Id = item.MainId >= 0 ? item.MainId : item.Id;

      //   item.DefaultValue =  item.DefaultValue ===true ?1:item.DefaultValue;
      //   item.ParameterValue = item.ParameterValue ===true ?1:item.ParameterValue;

      //   let data = updateData[item.ItemName + 'Param'+ item.Action];
      //   if(!data.length || data.indexOf(item) === -1){
      //     updateData[item.ItemName + 'Param'+ item.Action].push(item);
      //   }
      //   updateData.EntitiesCount += 1;
      // }

      // handle the old parameter whose code is '...'
      if(item.Action === 'ToDelete'){
        const parameter = updateData[item.ItemName + 'Param'+ item.Action];

        if(!Array.isArray(parameter)){
          updateData[item.ItemName + 'Param'+ item.Action] = [];
        }
        item.EstHeaderFk = estHeaderId > 0 ? estHeaderId : item.EstHeaderFk;
        item.Id = typeof item.MainId === 'number' && item.MainId >= 0 ? item.MainId : item.Id;

        item.DefaultValue =  item.DefaultValue ? 1 : item.DefaultValue;
        item.ParameterValue = item.ParameterValue ? 1: item.ParameterValue;

        const data2 = parameter;
        if(Array.isArray(data2) && (!data2.length || data2.indexOf(item) === -1)){
          updateData[item.ItemName + 'Param'+ item.Action].push(item);
        }
       // updateData.EntitiesCount = (updateData.EntitiesCount ?? 0) + 1;
      }
    });

    return updateData;
  }

  /**
   *
   * @returns Returns a parameter that needs to be saved
   */
  public getParamToSave() : IEstimateParameter[] {
    return this.paramToSave.filter(param => param.Action === 'ToSave');
  }

  /**
   *
   * @returns Returns a parameter that needs to be deleted
   */
  public getParamToDelete() : IEstimateParameter[] {
    return this.paramToDelete;
  }

  /**
   *
   * @param params IEstimateParameter
   * @param destItem IEstimateParameter
   * @param serviceName String
   * @param itemName String
   */
  public setParamToDelete(params:IEstimateParameter[]|null, destItem:IEstimateParameter, serviceName:string, itemName:string) : void {
    if(Array.isArray(params)){
      params.forEach((param)=>{
        if(param){
          if(param.Version !== undefined && param.Version > 0){
            this.setParamItem(param, destItem, serviceName, itemName, 'ToDelete');
            this.paramToDelete.push(param);
          } else{
            // clear the destItem's param value
            // fix defect, delete the undeleted item with the same code
            destItem.Param = destItem.Param || [];
            const sameParams: string | null | undefined = destItem.Param.find(pa => pa === param.Code);
            if (sameParams !== null) {
              if (Array.isArray(sameParams)) {
                  if (sameParams.length > 0) {
                      sameParams.pop();
                      destItem.Param = destItem.Param.filter(pa => pa !== param.Code);
                      destItem.Param = destItem.Param.concat(sameParams);
                  }
              } else {
                  destItem.Param = destItem.Param.filter(pa => pa !== param.Code);
              }
          }

            this.prjParamToSave = this.prjParamToSave.filter(item => item.Id !== param.Id);
            this.paramToSave = this.paramToSave.filter(item => item.Id !== param.Id);
          }
        }
      });
    }
  }

  /**
   *
   * @param param IEstimateParameter
   * @param destItem IEstimateParameter
   * @param serviceName String
   * @param itemName String
   * @param list IEstimateParameter[]
   * @returns
   */
  public markParamAsModified(param:IEstimateParameter, destItem:IEstimateParameter, serviceName:string, itemName:string, list:IEstimateParameter[]) : void {
    if(param){
      const item = list.find(param => param.MainId);
      if(item){
        // support multiple type or many parameters to modify
        let paramExistedInToSave = this.paramToSave.find(LSItemParameter => {
          const result = param.MainId === LSItemParameter.MainId &&
              LSItemParameter.ItemName === (destItem.IsRoot ? 'EstHeader' : itemName) &&
              LSItemParameter.Action === 'ToSave';
          return result;
        });

        if(item.__rt$data?.errors !== undefined && (!item.__rt$data?.errors || !item.__rt$data?.errors.Code)){
          if(paramExistedInToSave){
            paramExistedInToSave = param;
          } else{
            // fix defect 88659, The unnamed parameter still could be saved in Estimate
            this.setParamToSave([item], destItem, serviceName, itemName);
          }
          this.increaseModifiedEntityCount();
        } else {
          // validate error and remove it from prjParamToSave and paramToSave
          if(paramExistedInToSave){
            this.paramToSave = this.paramToSave.filter(item=>{
              return item.Id !== param.Id &&
                  item.ItemName !== destItem.IsRoot ? 'EstHeader' : itemName &&
                  item.Action !== 'ToSave';
            });

            const findInPrjParamToSave = this.prjParamToSave.find(param => param.Id);
            if(findInPrjParamToSave){
              this.prjParamToSave = this.prjParamToSave.filter(item => item.Id !== param.Id);
            }

            if(destItem && Array.isArray(destItem.Param) && destItem.Param.indexOf(param.Code) !== -1){
              return;
            }
          }
        }
      }
    }
  }

  private increaseModifiedEntityCount(){
    // TODO platformModuleStateService and estimateMainService
    // let state = platformModuleStateService.state(estimateMainService.getModule());
    // state.modifications = state.modifications || {};
    // state.modifications.EntitiesCount = state.modifications.EntitiesCount || 0;
    // if(state.modifications.EntitiesCount <= 0){
    //   state.modifications.EntitiesCount = 1;
    // }
  }

  /**
   *
   * @param MainItemId Number
   * @param boqItemList IEstimateParameter[]
   * @param boqParamList IEstimateParameter[]
   * @param returnParamToDelete IEstimateParameter
   */
  public handleOnParamAssignUpdateSucceeded(MainItemId:number, boqItemList:IBoqItemEntity[],boqParamList:IEstimateParameter[],returnParamToDelete:IEstimateParameter) : void {
    const boqItem = boqItemList.find(param => param.Id == MainItemId);
    if(boqParamList && Array.isArray(boqParamList) && boqParamList.length>0 ){
      if(boqItem ){
        // TODO ParamAssignment is not defined in IBoqItemEntity
        // boqItem.ParamAssignment = [];
        // boqParamList.forEach(param=>{
        //   if(param.BoqItemFk === boqItem.Id && param.BoqHeaderFk === boqItem.BoqHeaderFk){
        //     boqItem.ParamAssignment.push(param);
        //   }
        // });
      }
    }

    // if(returnParamToDelete && Array.isArray(returnParamToDelete)){
    //   returnParamToDelete.forEach(param => {
    //     boqItem.ParamAssignment = boqItem.ParamAssignment.filter(pa=>pa.Id !== param.Id);
    //   });
    // }
  }

  /**
   *
   * @param param IEstimateParameter
   */
  public removeValidatedErrorItem(param:IEstimateParameter) : void {
    if(this.paramToSave.find(param =>param.Id)){
      this.paramToSave = this.paramToSave.filter(item => item.Id !== param.Id);
    }
  }

  /**
   * Clear all the arrays
   */
  public clear() : void {
    this.paramToSave = [];
    this.prjParamToSave = [];
    this.paramToDelete = [];
  }

}
