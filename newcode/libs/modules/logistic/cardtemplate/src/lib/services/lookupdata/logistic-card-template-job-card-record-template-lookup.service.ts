import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_RECORD_TEMPLATE_ENTITY_INFO } from '../../model/logistic-card-template-job-card-record-template-entity-info.model';
import { Injectable } from '@angular/core';
import { ILogisticCardTemplateJobCardRecordTemplateEntity } from '@libs/logistic/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardRecordTemplateLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticCardTemplateJobCardRecordTemplateEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'logistic/cardtemplate/recordtemplate',
					endPointRead: 'listbyparent'
				}
			},
			{
				uuid: '3765a5c2ba70487c81e162ddbfb9fd7d',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<ILogisticCardTemplateJobCardRecordTemplateEntity>>{
						columns: await LOGISTIC_CARD_TEMPLATE_JOB_CARD_RECORD_TEMPLATE_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}