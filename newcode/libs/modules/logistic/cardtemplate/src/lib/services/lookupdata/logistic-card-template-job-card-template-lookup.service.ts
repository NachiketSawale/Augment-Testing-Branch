import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_ENTITY_INFO } from '../../model/logistic-card-template-job-card-template-entity-info.model';
import { Injectable } from '@angular/core';
import { ILogisticCardTemplateJobCardTemplateEntity } from '@libs/logistic/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardTemplateLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticCardTemplateJobCardTemplateEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'logistic/cardtemplate/cardtemplate',
					endPointRead: 'searchlist'
				}
			},
			{
				uuid: 'd0e3272497cd4d73b559809241394964',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<ILogisticCardTemplateJobCardTemplateEntity>>{
						columns: await LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}