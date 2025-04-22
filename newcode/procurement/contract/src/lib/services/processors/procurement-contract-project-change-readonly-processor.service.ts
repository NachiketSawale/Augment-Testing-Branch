/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedNumberGenerationService, EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { ProcurementContractProjectChangeDataService } from '../procurement-contract-project-change-data.service';
import { IChangeEntity } from '../../model/entities/change-entity.interface';

export class ProcurementContractProjectChangeReadonlyProcessor extends EntityReadonlyProcessorBase<IChangeEntity> {
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);

	public constructor(protected dataService: ProcurementContractProjectChangeDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IChangeEntity> {
		return {
			Code: (e) => this.readonlyCode(e.item),
			RubricCategoryFk: (e) => e.item.Version! >= 1,
		};
	}

	protected override readonlyEntity(entity: IChangeEntity): boolean {
		return false;
	}

	private readonlyCode(entity: IChangeEntity): boolean {
		const rubricIndex = this.dataService.getRubricIndex();
		return entity.Version === 0 && this.genNumberSvc.hasNumberGenerateConfig(entity.RubricCategoryFk, rubricIndex);
	}
}
