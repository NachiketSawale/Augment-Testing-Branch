/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
	UiCommonLookupItemsDataService
} from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';


interface IReplaceNeutralMaterialTypeEntity {
	/**
	 * name value
	 */
	name: string;
	/**
	 * Description
	 */
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonReplaceNeutralMaterialTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IReplaceNeutralMaterialTypeEntity, TEntity> {

	public constructor(private translateService: PlatformTranslateService) {
		const items = [
			{name: 'Neutral', description: translateService.instant('procurement.common.wizard.replaceNeutralMaterial.neutralTypeTranslate').text},
			{name: 'Code', description: translateService.instant('procurement.common.wizard.replaceNeutralMaterial.codeTypeTranslate').text},
			{name: 'Structure', description: translateService.instant('procurement.common.wizard.replaceNeutralMaterial.structureTypeTranslate').text}
		];
		super(items, {
			uuid: '114dc0f2f60240eca746426f6B5c3e74',
			idProperty: 'name',
			valueMember: 'name',
			displayMember: 'description'
		});
	}
}
