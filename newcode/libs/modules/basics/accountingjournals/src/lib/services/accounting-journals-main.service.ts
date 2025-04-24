/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IAccountingJournalsEntity } from '../model/entities/accounting-journals-entity.interface';
import { IAccountingJournalsComplete } from '../model/entities/accounting-journals-complete.interface';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IFilterResult, ISearchResult } from '@libs/platform/common';
import { MainDataDto } from '@libs/basics/shared';

/**
 * Accounting Journals data service
 */
@Injectable({
	providedIn: 'root',
})
export class AccountingJournalsMainService extends DataServiceFlatRoot<IAccountingJournalsEntity, IAccountingJournalsComplete> {
	public constructor() {
		const options: IDataServiceOptions<IAccountingJournalsEntity> = {
			apiUrl: 'basics/accountingJournals',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IAccountingJournalsEntity>>{
				role: ServiceRole.Root,
				itemName: 'AccountingJournals',
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IAccountingJournalsEntity | null): IAccountingJournalsComplete {
		const complete = new IAccountingJournalsComplete();
		if(modified !== null){
			complete.AccountingJournals = modified;
		}
		return complete;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IAccountingJournalsEntity> {
		const dto = new MainDataDto<IAccountingJournalsEntity>(loaded);
		return {
			FilterResult: dto.getValueAs<IFilterResult>('FilterResult')!,
			dtos: dto.Main,
		};
	}

	public override getModificationsFromUpdate(complete: IAccountingJournalsComplete): IAccountingJournalsEntity[] {
		if (complete) {
			if (complete.AccountingJournals) {
				return [complete.AccountingJournals];
			}
		}

		return [];
	}

	public override takeOverUpdatedChildEntities(updated: IAccountingJournalsComplete): void {
		super.takeOverUpdatedChildEntities(updated);
	}

	protected override onCreateSucceeded(created: object): IAccountingJournalsEntity {
		return created as IAccountingJournalsEntity;
	}

	public canEditTrans():boolean{
		const header = this.getSelectedEntity()!;
		if(header) {
			return header.IsSuccess!;
		}
		return false;
	}
}
