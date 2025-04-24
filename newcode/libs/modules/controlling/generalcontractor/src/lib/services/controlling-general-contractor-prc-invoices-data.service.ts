import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';

import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';
import {
    ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {Injectable, InjectionToken} from '@angular/core';
import {IGccPrcInvoicesEntity} from '../model/entities/gcc-prc-invoices-entity.interface';
import {ControllingGeneralDocumentProjectDataService} from './controlling-general-document-project-data.service';
import {isNull} from 'lodash';

export const CONTROLLING_GENERAL_CONTRACTOR_PRC_INVOICES_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorPrcInvoicesDataService>('controllingGeneralContractorPrcInvoicesDataService');


@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorPrcInvoicesDataService extends DataServiceFlatLeaf<IGccPrcInvoicesEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete >{

    private controllingGeneraDocumentProjectDataService: ControllingGeneralDocumentProjectDataService | null = null;
    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;
    private isInvoiceSelectChange = false;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IGccPrcInvoicesEntity>  = {
            apiUrl: 'Controlling/GeneralContractor/GCPrcInvoicesController',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getPrcInvoiceList',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IGccPrcInvoicesEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'GeneralPrcInvoices',
                parent: ControllingGeneralContractorCostHeaderDataService
            }
        };

        super(options);
        this.parentService = ControllingGeneralContractorCostHeaderDataService;
        this.selectionChanged$.subscribe(() => {
            if(!isNull(this.controllingGeneraDocumentProjectDataService)){
                this.isInvoiceSelectChange = true;
                this.controllingGeneraDocumentProjectDataService.refreshByParentChange();
            }
        });
    }


    protected override provideLoadPayload(): object{
        const parent = this.getSelectedParent();
        return {
            ProjectId: parent?.PrjProjectFk, // to do:Add temporary value by LQ,
            filter:'',
            DueDate:null,
            MdcControllingUnitFks: this.parentService.getMdcIds()
        };
    }

    protected override onLoadSucceeded(loaded:IGccPrcInvoicesEntity[]):IGccPrcInvoicesEntity[] {
        return loaded! as IGccPrcInvoicesEntity[];
    }

    public setDocumentProjectDataService(dataService: ControllingGeneralDocumentProjectDataService){
        this.controllingGeneraDocumentProjectDataService = dataService;
    }

    public reSetIsInvoiceSelectChange(){
        this.isInvoiceSelectChange = false;
    }

    public getIsInvoiceSelectChange(){
        return this.isInvoiceSelectChange;
    }
}