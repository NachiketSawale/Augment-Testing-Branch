/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISourceDescEntity } from '@libs/estimate/interfaces';
import { inject } from '@angular/core';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';

/**
 * Service for totals config project cost group lookup.
 */
export class TotalsConfigPrjCostGroupLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ISourceDescEntity, TEntity> {

	private readonly contextService: EstimateMainContextService = inject(EstimateMainContextService);

	/**
	 * Constructor
	 */
	public constructor(private isForCustomize : boolean = false) {
		super(
			{
				httpRead: { route: 'estimate/main/lookup/', endPointRead: 'getprojectcostgroups', usePostForRead: true },
				filterParam: true,
				prepareListFilter: (context) => {
					return {ProjectFk: this.isForCustomize ? 0: this.contextService.getSelectedProjectId()};
				}
			},
			{
				uuid: 'ae4027f9ae854dfa8c90d86d8a076a56',
				valueMember: 'StructureName',
				displayMember: 'StructureName',
			},
		);
	}
}