/*
 * Copyright(c) RIB Software GmbH
 */
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {CompleteIdentification} from '@libs/platform/common';
import {ProviderToken} from '@angular/core';

import {
    EntityInfo,
    IEntityContainerBehavior,
    IGridContainerLink, ISplitGridConfiguration, SplitGridConfigurationToken,
    } from '@libs/ui/business-base';
import {EstimateShareCostGroupDataService} from './estimate-share-cost-group-data.service';
import {EstimateShareCostGroupLayoutService} from './estimate-share-cost-group-layout.service';
import {EstimateShareCostGroupCatalogDataService} from './estimate-share-cost-group-catalog-data.service';
import {IGridTreeConfiguration} from '@libs/ui/common';
import { EstimateShareCostGroupComponent } from './estimate-share-cost-group.component';

export class EstimateShareCostGroupEntityInfoFactoryService {

     public static create<T extends ICostGroupEntity,PT extends BasicsCostGroupCatalogEntity, PU extends CompleteIdentification<PT>,U extends object>(config: {
         permissionUuid: string,
         formUuid: string;

         dataServiceToken:ProviderToken<EstimateShareCostGroupDataService<T,PT,PU>>,

         parentDataService:ProviderToken<EstimateShareCostGroupCatalogDataService<PT,PU,U>>,

         behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,

         layoutServiceToken?: ProviderToken<EstimateShareCostGroupLayoutService>,
     }){
         return EntityInfo.create<T>({
             grid: {
                 title: {
                     text: 'estimate.main.costGroupContainer',
                     key: 'estimate.main.costGroupContainer'
                 },
                 behavior:(ctx) => ctx.injector.get(config.behavior),
                 containerType: EstimateShareCostGroupComponent,
                 providers: (ctx) => [
                     {
                         provide: SplitGridConfigurationToken,
                         useValue: <ISplitGridConfiguration<T, PT>>{
                             parent: {
                                 uuid: '4f3dd493c4e145a49b54506af6da02ef',
                                 columns: [],
                                 dataServiceToken: config.parentDataService,

                             }
                         }
                     }
                 ],
                 treeConfiguration: ctx => {
                     return {
                         parent: function (entity: ICostGroupEntity) {
                             const service = ctx.injector.get(config.dataServiceToken);
                             return service.parentOf(entity as T);
                         },
                         children: function (entity: ICostGroupEntity) {
                             const service = ctx.injector.get(config.dataServiceToken);
                             return service.childrenOf(entity as T);
                         }
                     } as IGridTreeConfiguration<T>;
                 }
             },
             dataService: ctx => ctx.injector.get(config.dataServiceToken),
             dtoSchemeId: {moduleSubModule: 'Basics.CostGroups', typeName: 'CostGroupDto'},
             permissionUuid: '4f3dd493c4e145a49b54506af6da02ef',
             layoutConfiguration: context => {
                 return context.injector.get(EstimateShareCostGroupLayoutService).generateLayout();
             },
         });
     }
 }