import { LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_DOCUMENT_ENTITY_INFO } from '../../model/logistic-card-template-job-card-template-document-entity-info.model';
import { Injectable } from '@angular/core';
import { ILogisticCardTemplateJobCardTemplateDocumentEntity } from '@libs/logistic/interfaces';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardTemplateDocumentLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILogisticCardTemplateJobCardTemplateDocumentEntity,TEntity> {
	public constructor(){
		super(
			{
				httpRead: {
					route: 'logistic/cardtemplate/jobcardtemplatedocument',
					endPointRead: 'listbyparent'
				}
			},
			{
				uuid: 'e3c12ce36e404bb594d7999f36202179',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: async (ctx) => {
					return <IGridConfiguration<ILogisticCardTemplateJobCardTemplateDocumentEntity>>{
						columns: await LOGISTIC_CARD_TEMPLATE_JOB_CARD_TEMPLATE_DOCUMENT_ENTITY_INFO.generateLookupColumns(ctx.injector)
					};
				}
			}
		);
	}
}