/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LogisticCardTemplateJobCardRecordTemplateDataGeneratedService } from './generated/logistic-card-template-job-card-record-template-data-generated.service';
import { inject, Injectable } from '@angular/core';
import { LogisticCardTemplateRecordReadonlyProcessorService } from '../logistic-card-template-record-readonly-processor.service';
import { ILogisticCardTemplateJobCardRecordTemplateEntity, ILogisticCommonCardRecordEntity } from '@libs/logistic/interfaces';
import { PlatformConfigurationService, PlatformLazyInjectorService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { LogisticCommonCardRecordService } from '@libs/logistic/shared';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardTemplateJobCardRecordTemplateDataService extends LogisticCardTemplateJobCardRecordTemplateDataGeneratedService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly http = inject(HttpClient);
	private readonly logisticCommonCardRecordService = inject(LogisticCommonCardRecordService);
	private config = inject(PlatformConfigurationService);
	public constructor()    {
		super();
		this.processor.addProcessor(new LogisticCardTemplateRecordReadonlyProcessorService(this));
	}
	public takeOverCodeAndDescription<T extends ILogisticCommonCardRecordEntity>(record : T, article: ILogisticCardTemplateJobCardRecordTemplateEntity) {
		if(!isNil(article)) {
			if(isNil(record.DescriptionInfo) || isNil(record.DescriptionInfo.Translated) || record.DescriptionInfo.Translated.length) {
				record.DescriptionInfo = article.DescriptionInfo;
				if(!isNil(article.DescriptionInfo) && !isNil(record.DescriptionInfo)){
					record.DescriptionInfo.Description = article.DescriptionInfo.Translated;
					record.DescriptionInfo.Translated = article.DescriptionInfo.Translated;
				}
			}
			if(!isNil(record.DescriptionInfo) && !isNil(record.DescriptionInfo.Translated) && !isNil(article.DescriptionInfo)){
				record.CardRecordDescription = article.DescriptionInfo.Translated;
			}
			record.UomFk = article.UomFk;
			//TODO: data.markItemAsModified(record, data);
		}
	}
	public async setArticleInformation(item: ILogisticCardTemplateJobCardRecordTemplateEntity): Promise<ILogisticCardTemplateJobCardRecordTemplateEntity>{
		return this.logisticCommonCardRecordService.setArticleInformation(this.takeOverCodeAndDescription, item);
	}
}