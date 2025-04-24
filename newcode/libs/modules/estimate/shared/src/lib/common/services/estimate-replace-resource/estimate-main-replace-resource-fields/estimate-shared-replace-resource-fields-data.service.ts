/*
 * Copyright(c) RIB Software GmbH
 */

import {EstimateMainReplaceFunctionType, IEstModifyFieldsEntity} from '@libs/estimate/interfaces';
import {inject, Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';
import {EstimateMainReplaceResourceCommonService} from '../estimate-main-replace-resource-common.service';

@Injectable({
    providedIn: 'root'
})
export class EstimateSharedReplaceResourceFieldsDataService {
    private dataList: IEstModifyFieldsEntity[] = [] as IEstModifyFieldsEntity[];

    private configService = inject(PlatformConfigurationService);
    private http = inject(HttpClient);

    public constructor(private estimateMainReplaceResourceCommonService: EstimateMainReplaceResourceCommonService) {}

    public initGridData(): IEstModifyFieldsEntity[] {
        return this.getList();
    }

    public getList() {
        return this.dataList;
    }

    public async setList(projectIds: number[] | null){
        this.dataList = [];

        const response = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'estimate/main/modify/getcolumnfields')) as unknown as IEstModifyFieldsEntity[];
        if(response){
            const selectedFunction = this.estimateMainReplaceResourceCommonService.getSelectedFunction();
            if(selectedFunction && selectedFunction.Id === EstimateMainReplaceFunctionType.ReplaceAssembly){
                this.dataList = response.filter((item) => {
                    return item.Id !== 23;
                });
            }
        }
    }
}