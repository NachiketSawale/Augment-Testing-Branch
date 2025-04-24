/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {CompleteIdentification, ISearchResult} from '@libs/platform/common';
import {
    DataServiceFlatRoot,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions, IEntitySelection, ServiceRole
} from '@libs/platform/data-access';

import {CostGroupComplete} from './estimate-share-cost-group-complete.class';
import * as _ from 'lodash';
import {BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
@Injectable({
    providedIn: 'root',
})

export abstract class EstimateShareCostGroupCatalogDataService<T extends BasicsCostGroupCatalogEntity,PU extends CompleteIdentification<T>,U extends object> extends DataServiceFlatRoot<T, PU>{

    public readonly selectService : IEntitySelection<U>;
    public constructor(protected parentService: IEntitySelection<U>) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'basics/costgroupcat',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listbyconfig',
                usePost: true,
            },
            roleInfo: <IDataServiceRoleOptions<T>>{
                role: ServiceRole.Root,
                itemName: 'costgroupcats',
            }
        };

        super(options);
        this.selectService = parentService;
        this.selectService.selectionChanged$.subscribe(()=> {
           this.refreshAll();
        });
    }

    protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<T> {
        const dto = loaded as CostGroupComplete;


        const entitys: T[] =[];
        const costGroupCataLog= new BasicsCostGroupCatalogEntity();

        if(dto && dto.LicCostGroupCats && dto.PrjCostGroupCats){
            costGroupCataLog.PrjCostGroupCats = dto.PrjCostGroupCats;
            costGroupCataLog.LicCostGroupCats = dto.LicCostGroupCats;
            //entitys = [...dto.LicCostGroupCats ,...[new BasicsCostGroupCatalogEntity()],...dto.PrjCostGroupCats] as T[];
            entitys.push(costGroupCataLog as T);
        }
        //TODO: need to refactor, some function may not need anymore
        const fr = _.get(loaded, 'FilterResult')!;
        return {
            FilterResult: fr,
            dtos: entitys
        };
    }
}