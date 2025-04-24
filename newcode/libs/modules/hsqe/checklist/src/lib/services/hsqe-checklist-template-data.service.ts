/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import _ from 'lodash';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ISearchPayload, ISearchResult, ServiceLocator } from '@libs/platform/common';
import { IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { CheckListTemplateComplete, ICheckListTemplateRequestEntity, IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { CheckListGroupTemplateDataService } from './hsqe-checklist-group-template-data.service';
import { ISplitGridContainerSearchService } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root',
})
export class CheckListTemplateDataService extends DataServiceFlatRoot<IHsqChkListTemplateEntity, CheckListTemplateComplete> implements ISplitGridContainerSearchService {
	private readonly groupService = ServiceLocator.injector.get(CheckListGroupTemplateDataService);
	public searchText: string = '';

	public async search(): Promise<void>  {
		this.refreshAll().then();
	}

	public constructor() {
		const options: IDataServiceOptions<IHsqChkListTemplateEntity> = {
			apiUrl: 'hsqe/checklisttemplate/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyfilter',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IHsqChkListTemplateEntity>>{
				role: ServiceRole.Root,
				itemName: 'ChkListTemplates',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};

		super(options);
		this.groupService.selectionChanged$.subscribe(() => {
			this.refreshAll().then();
		});
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IHsqChkListTemplateEntity> {
		const dto = new MainDataDto<IHsqChkListTemplateEntity>(loaded);
		const fr = dto.getValueAs<IFilterResponse>('FilterResult')!;

		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dto.Main,
		};
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.extendSearchFilter(payload as ICheckListTemplateRequestEntity);
		return payload;
	}

	private extendSearchFilter(filterRequest: ICheckListTemplateRequestEntity) {
		const group = this.groupService.getSelectedEntity();
		if (group) {
			const groupItemIds: number[] = [group.Id];
			filterRequest.furtherFilters = _.map(groupItemIds, function (groupId) {
				return {
					Token: 'CheckListGROUP',
					Value: groupId,
				};
			});

			if (this.searchText !== '') {
				filterRequest.pattern = this.searchText;
			}
		}
	}

	public override createUpdateEntity(modified: IHsqChkListTemplateEntity | null): CheckListTemplateComplete {
		return new CheckListTemplateComplete(modified);
	}
}
