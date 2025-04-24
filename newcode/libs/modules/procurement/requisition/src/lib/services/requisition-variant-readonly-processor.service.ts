import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {IReqVariantEntity} from '../model/entities/req-variant-entity.interface';
import {ProcurementRequisitionRequisitionVariantDataService} from './requisition-variant-data.service';

export class RequisitionVariantReadonlyProcessorService extends EntityReadonlyProcessorBase<IReqVariantEntity> {
	public constructor(protected dataService: ProcurementRequisitionRequisitionVariantDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IReqVariantEntity> {
		return {};
	}

	protected override readonlyEntity() {
		return this.dataService.parentService.getHeaderContext().readonly;
	}
}