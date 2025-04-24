import { LOGISTIC_ACTION_TARGET_ENTITY_INFO } from '../../model/logistic-action-target-entity-info.model';
import { Injectable } from '@angular/core';
import { ILogisticActionTargetEntity } from '@libs/logistic/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class LogisticActionTargetLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticActionTargetEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'logistic/action/action',
					endPointRead: 'filtered',
					usePostForRead: true
				}
			},
			{
				uuid: '4ae91f634f824658a97060bc758bb4af',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<ILogisticActionTargetEntity>>{
						columns: await LOGISTIC_ACTION_TARGET_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}