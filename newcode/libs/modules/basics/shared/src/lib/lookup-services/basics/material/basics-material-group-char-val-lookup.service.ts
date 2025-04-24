/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Material Group Char Value Lookup Service
 */
import { inject, Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IMaterialGroupCharvalEntity } from '../../../material/model/interfaces/material-group-charval-entity.interface';
import { IEntityContext } from '@libs/platform/common';
import { IMaterialCharacteristicEntity } from '../../../material/model/interfaces/material-characteristic-entity.interface';
import { BasicsSharedMaterialSimpleLookupService } from './basics-material-simple-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharValLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IMaterialGroupCharvalEntity, TEntity> {
	private readonly materialLookupService = inject(BasicsSharedMaterialSimpleLookupService);

	public constructor() {
		super(
			{
				httpRead: { route: 'basics/materialcatalog/groupcharval/', endPointRead: 'search', usePostForRead: true },
				filterParam: true,
			},
			{
				uuid: '3595383ee7a34bab8165eccbef2dac56',
				valueMember: 'Id',
				displayMember: 'CharacteristicInfo.Translated',
			},
		);
	}

	protected override prepareListFilter(context?: IEntityContext<TEntity>) {
		if (context) {
			const characteristicEntity = context.entity as unknown as IMaterialCharacteristicEntity;
			const material = this.materialLookupService.cache.getItem({ id: characteristicEntity.MaterialFk });
			if (material) {
				return {
					MaterialGroupFk: material.MdcMaterialGroupFk,
					Property: characteristicEntity.PropertyDescription,
				};
			}
		}
		return undefined;
	}
}
