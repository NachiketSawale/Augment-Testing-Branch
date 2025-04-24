import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_ACTIVITY_TEMPLATE_ENTITY_INFO } from '../../model/logistic-card-template-job-card-activity-template-entity-info.model';
import { Injectable } from '@angular/core';
import { ILogisticCardTemplateJobCardActivityTemplateEntity } from '@libs/logistic/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardActivityTemplateLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticCardTemplateJobCardActivityTemplateEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'logistic/cardtemplate/activitytemplate',
					endPointRead: 'listbyparent'
				}
			},
			{
				uuid: '9100fa3acb7e470180d39916e30f4d97',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<ILogisticCardTemplateJobCardActivityTemplateEntity>>{
						columns: await LOGISTIC_CARD_TEMPLATE_JOB_CARD_ACTIVITY_TEMPLATE_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}