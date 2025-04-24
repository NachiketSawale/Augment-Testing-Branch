/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISourceDescEntity } from '@libs/estimate/interfaces';
import { inject } from '@angular/core';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';

/**
 * Service for totals config enterprise cost group lookup.
 */
export class TotalsConfigEstCostGroupLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ISourceDescEntity, TEntity> {

	private readonly contextService: EstimateMainContextService = inject(EstimateMainContextService);

	/**
	 * Constructor
	 */
	public constructor(private isForCustomize: boolean = false) {
		super(
			{
				httpRead: { route: 'estimate/main/lookup/', endPointRead: 'getenterprisecostgroups', usePostForRead: true },
				filterParam: true,
				prepareListFilter: (context) => {
					return {ProjectFk: this.isForCustomize ? 0: this.contextService.getSelectedProjectId()};
				}
			},
			{
				uuid: '6c67287e6d9548219e820ac5f7bcf7a8',
				valueMember: 'Id',
				displayMember: 'StructureName',
			},
		);
	}
}