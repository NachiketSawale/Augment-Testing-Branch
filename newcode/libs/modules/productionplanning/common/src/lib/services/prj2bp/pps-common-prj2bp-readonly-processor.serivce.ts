import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { PpsCommonPrj2bpDataService } from './pps-common-prj2bp-data.service';

export class PpsCommonPrj2bpProcessor<
	PT extends IEntityIdentification,
	PU extends CompleteIdentification<PT>>
	extends EntityReadonlyProcessorBase<IProjectMainPrj2BusinessPartnerEntity> {

	public constructor(protected dataService: PpsCommonPrj2bpDataService<PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IProjectMainPrj2BusinessPartnerEntity> {
		return {
			SubsidiaryFk: info => info.item.SubsidiaryFk !== undefined,
		};
	}
}