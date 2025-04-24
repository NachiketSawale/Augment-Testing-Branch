/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IProjectEntity} from '@libs/project/interfaces';
import {isNull, isUndefined} from 'lodash';
import {firstValueFrom} from 'rxjs';
import {ContextService, PlatformConfigurationService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ControllingStructureProjectDataService{
    private isReadOnly = true;
    private dataList: IProjectEntity[] = [] as IProjectEntity[];
    private selectedEntity: IProjectEntity | null = null;
    private allProject: IProjectEntity[] = [] as IProjectEntity[];
    private configService = inject(PlatformConfigurationService);
    private readonly platformContextService = inject(ContextService);
    private http = inject(HttpClient);

    public initGridData(): IProjectEntity[] {
        return this.getList();
    }

    public getList(){
        return this.dataList;
    }

    public setSelected(selected: IProjectEntity| null){
        this.selectedEntity = selected;
    }

    public getSelected(){
        return this.selectedEntity;
    }

    public async setList(projectIds: number[] | null){
        this.dataList = [];
        if(!projectIds || !projectIds.length){
            this.setSelected(null);
            return;
        }

        if(this.allProject.length){
            this.peocessDataList(projectIds);
            this.setSelected(null);
        } else {
            const response = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'controlling/structure/schedulerTask/getProjectByCompany',{
                params: {
                    companyFk: isUndefined(this.platformContextService.clientId) ? -1 :  this.platformContextService.clientId
                }
            })) as unknown as IProjectEntity[];
            if(response){
                this.allProject = response;
                this.peocessDataList(projectIds);
                this.setSelected(null);
            }
        }

        // $injector.get('controllingStructureCostGroupAssignmentDataService').setDefaultCostGroupCatalogs(null);
    }

    private peocessDataList(projectIds: number[] | null){
        if(isNull(projectIds)){
            return;
        }

        projectIds.forEach(item => {
            const data = this.getProject(item);
            if(data){
                this.dataList.push(data);
            }
        });
    }

    private getProject(projectId: number) {
        return this.allProject.find((project) =>{
            return project.Id === projectId;
        });
    }

    public showCreateDialog = function showCreateDialog() {
        // TODO: addDialog -jack
        // $injector.get('controllingStructureProjectAddService').showDialog();
    };

    public createItem(items: IProjectEntity[]) {
        this.addItems(items);
        this.setSelected(items ? items[0] : null);
        return items;
    }

    private addItems(items: IProjectEntity[] | null){
        if(!items){
            return;
        }

        items.forEach(item =>{
            const matchItem = this.dataList.find((data) => {
                return data.Id === item.Id;
            });
            if (!matchItem) {
                this.dataList.push(item);
            }
        });
    }

    public getIsReadOnly() {
        return this.isReadOnly;
    }

    public setIsReadOnly(flag: boolean) {
        this.isReadOnly = flag;
    }

    public refreshData(){
        this.setList([]);
        this.setSelected(null);
    }

    // TODO: walt controllingStructureCostGroupAssignmentDataService
    // let baseDeselect = service.deselect;
    // service.deselect = function deselect() {
    //     baseDeselect();
    //
    //     controllingStructureCostGroupAssignmentDataService.setDefaultCostGroupCatalogs(null);
    // };
}