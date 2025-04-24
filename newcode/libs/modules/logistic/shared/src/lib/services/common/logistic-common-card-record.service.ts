import { PlatformConfigurationService } from '@libs/platform/common';
import { ILogisticCardTemplateJobCardRecordTemplateEntity, ILogisticCommonCardRecordEntity } from '@libs/logistic/interfaces';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isNil, isNull } from 'lodash';
import { firstValueFrom } from 'rxjs';

export enum JobCardRecordTyps {
	Plant = 1 ,
	Material = 2,
	SundryService = 3
}
@Injectable({
	providedIn: 'root'
})
export class LogisticCommonCardRecordService {
	private readonly http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);

	public async getArticleInformation(artId: number, artType: number) {
		return firstValueFrom(this.http.post<ILogisticCardTemplateJobCardRecordTemplateEntity>(
			this.config.webApiBaseUrl + 'logistic/cardtemplate/recordtemplate/articleinformation',
			{
				Id: artId,
				PKey3: artType
			})
		);
	}
	public async setArticleInformation<T extends ILogisticCommonCardRecordEntity>(
		takeOverFields:(record : T, article: ILogisticCardTemplateJobCardRecordTemplateEntity) => void,
		item: T,
		value: number|null = null): Promise<T> {
		return !isNull(this.getArticleFk(item)) ?
			this.getArticleInformation(value ?? this.getArticleFk(item), item.JobCardRecordTypeFk).then(
				result => {
					takeOverFields(item, result);
					return item;
				}
			):
			new Promise<T>(() => item);
	}
	public getArticleFk<T extends ILogisticCommonCardRecordEntity>(item: T): number {
		switch (item.JobCardRecordTypeFk) {
			case JobCardRecordTyps.Plant:
				if(isNil(item.PlantFk)){
					throw new Error('PlantFk is missing! This shouldn\'t happen!');
				} else {
					return item.PlantFk;
				}
			case JobCardRecordTyps.Material:
				if(isNil(item.MaterialFk)){
					throw new Error('MaterialFk is missing! This shouldn\'t happen!');
				} else {
					return item.MaterialFk;
				}
			case JobCardRecordTyps.SundryService:
				if(isNil(item.SundryServiceFk)){
					throw new Error('SundryServiceFk is missing! This shouldn\'t happen!');
				} else {
					return item.SundryServiceFk;
				}
			default:
				throw new Error('JobCardRecordType '+ item.JobCardRecordTypeFk.toString() + 'is not implemented!');
		}
	}
}