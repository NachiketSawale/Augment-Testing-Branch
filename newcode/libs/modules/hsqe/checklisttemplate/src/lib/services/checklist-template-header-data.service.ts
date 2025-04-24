/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import _ from 'lodash';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ISearchPayload, ISearchResult } from '@libs/platform/common';
import { IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { ICheckListTemplateRequestEntity, IHsqCheckListGroupEntity, IHsqChkListTemplateEntity, CheckListTemplateComplete } from '@libs/hsqe/interfaces';
import { CheckListGroupDataService } from './checklist-group-data.service';

@Injectable({
	providedIn: 'root',
})
export class CheckListTemplateHeaderDataService extends DataServiceFlatRoot<IHsqChkListTemplateEntity, CheckListTemplateComplete> {
	private readonly groupService = inject(CheckListGroupDataService);

	public constructor() {
		const options: IDataServiceOptions<IHsqChkListTemplateEntity> = {
			apiUrl: 'hsqe/checklisttemplate/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyfilter',
				usePost: true,
			},
			createInfo: {
				endPoint: 'createdto',
				usePost: true,
			},
			deleteInfo: {
				endPoint: 'deletedto',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IHsqChkListTemplateEntity>>{
				role: ServiceRole.Root,
				itemName: 'ChkListTemplates',
			},
		};

		super(options);
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

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IHsqChkListTemplateEntity | null): CheckListTemplateComplete {
		return new CheckListTemplateComplete(modified);
	}

	public override getModificationsFromUpdate(complete: CheckListTemplateComplete): IHsqChkListTemplateEntity[] {
		if (complete) {
			if (complete.CheckListTemplates) {
				return complete.CheckListTemplates;
			}
			if (complete.CheckListTemplate) {
				return [complete.CheckListTemplate];
			}
		}

		return [];
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		const selGroup = this.groupService.getSelectedEntity();
		if (!selGroup) {
			this.groupService.refreshAll().then(); // load group container list
		}
		this.extendSearchFilter(payload as ICheckListTemplateRequestEntity);
		return payload;
	}

	protected override provideCreatePayload(): object {
		const group = this.groupService.getSelectedEntity();
		if (group) {
			return {
				HsqCheckListGroupFk: group.Id,
			};
		}
		throw new Error('Please select a checklist group first');
	}

	private extendSearchFilter(filterRequest: ICheckListTemplateRequestEntity) {
		const groupItemIds = this.groupService.getFilteredGroupIds();
		filterRequest.furtherFilters = _.map(groupItemIds, function (groupId) {
			return {
				Token: 'CheckListGROUP',
				Value: groupId,
			};
		});
	}

	/**
	 * React on the check state of group changed
	 * @param changedGroup
	 */
	public onGroupCheckChanged(changedGroup: IHsqCheckListGroupEntity) {
		this.refreshAllLoaded().then();
	}
}
