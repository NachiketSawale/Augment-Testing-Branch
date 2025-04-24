/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IEntityContext, ServiceLocator } from '@libs/platform/common';
import { BASICS_CLERK_LOOKUP_LAYOUT_GENERATOR, IBasicsClerkEntity, ILookupLayoutGenerator } from '@libs/basics/interfaces';
import {BasicsSharedTeamsButtonService} from '../teams/services/basics-shared-teams-button.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedClerkLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBasicsClerkEntity, TEntity> {
	public constructor() {
		super('clerk', {
			uuid: '43683f5e7d484ff1bf274762205f0e1b',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: async ctx => {
				const layoutGenerator = await ctx.lazyInjector.inject<ILookupLayoutGenerator<IBasicsClerkEntity>>(BASICS_CLERK_LOOKUP_LAYOUT_GENERATOR);
				const gridColumns = await layoutGenerator.generateLookupColumns();
				return {
					uuid: '6df7ca744ab64644b2f791b1ee3dc831',
					columns: gridColumns
				};
			},
			serverSideFilter: {
				key: 'basics-clerk-by-company-filter',
				execute(entity: IEntityContext<object>): string | object {
					const tempEntity = entity as unknown as { CompanyFk: number | null | undefined };
					return {CompanyFk: tempEntity.CompanyFk};
				}
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Clerk',
					key: 'cloud.common.dialogTitleClerk'
				}
			},
			showDialog: true
		});
		this.addTeamsButton();
	}

	/**
	 * add teams button。
	 * @private
	 */
	private addTeamsButton() {
		const teamsButtonService = ServiceLocator.injector.get(BasicsSharedTeamsButtonService<IBasicsClerkEntity, TEntity>, null, {optional: true});
		if(teamsButtonService) {
			teamsButtonService.addTeamsButtonToLookup(this.config);
		}
	}
}