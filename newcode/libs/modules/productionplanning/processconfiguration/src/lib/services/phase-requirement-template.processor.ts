/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { PhaseRequirementTemplateEntity } from '../model/phase-requirement-template-entity.class';
import { PpsPhaseRequirementTemplateDateService } from './phase-requirement-template-data.service';
import {PPS_UPSTREAM_GOODS_TYPES} from '@libs/productionplanning/item';

/**
 * Phase Requirement Template entity readonly processor
 */
export class PpsPhaseRequirementTemplateReadonlyProcessor<T extends PhaseRequirementTemplateEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: PpsPhaseRequirementTemplateDateService) {
	}

	/**
	 * Process item
	 * @param item
	 */
	public process(item: T) {
		const readOnly = item.UpstreamGoodsTypeFk !== PPS_UPSTREAM_GOODS_TYPES.Material;
		const readonlyFields: IReadOnlyField<PhaseRequirementTemplateEntity>[] = [
			{ field: 'Quantity', readOnly: readOnly },
		];

		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
