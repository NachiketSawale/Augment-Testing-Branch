/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot, IEntitySelection } from '@libs/platform/data-access';
/**
 * Procurement Common Change Payment Schedule Status Wizard Service.
 * @typeParam T - entity type handled by item data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity for update of parent entities
 */
export abstract class ProcurementCommonChangePaymentScheduleStatusWizardService<T extends IEntityIdentification, PT extends IEntityIdentification, PU extends object> extends BasicsSharedChangeStatusService<T, PT, PU> {

    public constructor(protected mainService:DataServiceFlatRoot<PT, PU> | DataServiceHierarchicalRoot<PT, PU>, protected override dataService:IEntitySelection<T>){
        super();
    }

    protected readonly statusConfiguration: IStatusChangeOptions<PT, PU> = {
        title: 'procurement.common.wizard.changePrcPaymentScheduleStatus',
        isSimpleStatus: false,
        statusName: 'procurementpaymentschedule',
        checkAccessRight: true,
        statusField: 'PrcPsStatusFk',
	     rootDataService: this.mainService
    };

    public onStartChangeStatusWizard() {
		this.startChangeStatusWizard();
	}

	public override afterStatusChanged() {
		// TODO: setSelected , setFieldsReadOnly , gridRefresh To be implemented.
	}
}