/*
 * Copyright(c) RIB Software GmbH
 */

import { HsqeChecklistDataService } from '../../services/hsqe-checklist-data.service';
import { BasicsSharedHsqeChecklistTypeLookupService, BasicsSharedNumberGenerationService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';

export class HsqeChecklistDataReadonlyProcessor extends EntityReadonlyProcessorBase<IHsqCheckListEntity> {
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly checklistTypeLookupSvc = inject(BasicsSharedHsqeChecklistTypeLookupService);

	public constructor(protected dataService: HsqeChecklistDataService) {
		super(dataService);
	}

	protected override readonlyEntity(item: IHsqCheckListEntity): boolean {
		return this.dataService.isItemReadOnly(item);
	}

	private isPortalUser() {
		return true;
		// let isPortalUser = false;
		// let codeHelperService = $injector.get('procurementCommonCodeHelperService'); /// todo
		// codeHelperService.IsPortalUser().then(function (val) {
		// 	isPortalUser = val;
		// });
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IHsqCheckListEntity> {
		return {
			BpdBusinesspartnerFk: {
				shared: ['BpdSubsidiaryFk', 'BpdContactFk'],
				readonly: this.fieldIsReadOnly,
			},
			Code: {
				shared: [],
				readonly: this.isCodeReadOnly,
			},
		};
	}

	private isCodeReadOnly(info: ReadonlyInfo<IHsqCheckListEntity>) {
		let hasToGeneratedCode = false;
		const item = info.item;
		const checkListTypeId = item.HsqChkListTypeFk;
		const checklistTypeEntity = this.checklistTypeLookupSvc.cache.getItem({ id: checkListTypeId });
		if (checklistTypeEntity) {
			hasToGeneratedCode = this.genNumberSvc.hasNumberGenerateConfig(checklistTypeEntity.RubricCategoryFk);
		}
		return item.Version === 0 && hasToGeneratedCode;
	}

	protected fieldIsReadOnly(info: ReadonlyInfo<IHsqCheckListEntity>): boolean {
		const item = info.item;
		return this.isPortalUser() || !!item.PesHeaderFk || !!item.ConHeaderFk;
	}
}
