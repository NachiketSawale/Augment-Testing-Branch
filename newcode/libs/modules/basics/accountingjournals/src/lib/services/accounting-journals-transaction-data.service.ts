/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IDataServiceChildRoleOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IAccountingJournalsTransactionEntity } from '../model/entities/accounting-journals-transaction-entity.interface';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { AccountingJournalsMainService } from '../services/accounting-journals-main.service';
import { IAccountingJournalsEntity } from '../model/entities/accounting-journals-entity.interface';
import { IAccountingJournalsComplete } from '../model/entities/accounting-journals-complete.interface';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { AccountingJournalsTransactionValidationService } from './accounting-journals-transaction-validation.service';

/**
 * Accounting Journals Transaction data service
 */
@Injectable({
	providedIn: 'root',
})
export class AccountingJournalsTransactionDataService extends DataServiceFlatLeaf<IAccountingJournalsTransactionEntity, IAccountingJournalsEntity, IAccountingJournalsComplete> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);
	public constructor(private accountingJournalsService: AccountingJournalsMainService) {
		const options: IDataServiceOptions<IAccountingJournalsTransactionEntity> = {
			apiUrl: 'basics/company/transaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IAccountingJournalsTransactionEntity, IAccountingJournalsEntity, IAccountingJournalsComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Transaction',
				parent: accountingJournalsService,
			},
			createInfo: {
				prepareParam: (ident) => {
					const parent = this.accountingJournalsService.getSelectedEntity()!;
					return {
						transheaderId: parent.Id,
					};
				},
			},
		};

		super(options);
		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IAccountingJournalsTransactionEntity> {
		const fr = get(loaded, 'FilterResult')!;

		return {
			FilterResult: fr,
			dtos: get(loaded, 'Main')! as IAccountingJournalsTransactionEntity[],
		};
	}

	public override registerModificationsToParentUpdate(parentUpdate: IAccountingJournalsComplete, modified: IAccountingJournalsTransactionEntity[], deleted: IAccountingJournalsTransactionEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.TransactionToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.TransactionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IAccountingJournalsComplete): IAccountingJournalsTransactionEntity[] {
		return complete && complete.TransactionToSave ? complete.TransactionToSave : [];
	}

	public override isParentFn(parent: IAccountingJournalsEntity, entity: IAccountingJournalsTransactionEntity): boolean {
		return entity.CompanyTransheaderFk === parent.Id;
	}

	public override canCreate() {
		return super.canCreate() && !this.accountingJournalsService.canEditTrans();
	}

	public override canDelete() {
		return  super.canDelete() && !this.accountingJournalsService.canEditTrans();
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}

		return {
			mainItemId: -1,
		};
	}

	protected override onLoadSucceeded(loaded: object): IAccountingJournalsTransactionEntity[] {
		if(loaded) {
			const list = loaded as IAccountingJournalsTransactionEntity[];

			if (this.accountingJournalsService.canEditTrans()) {
				list.forEach(item=>{
					this.setEntityReadOnly(item,true);
				});
			}
			return list;
		}
		return [];
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(AccountingJournalsTransactionValidationService, {
			moduleSubModule: 'Basics.Company',
			typeName: 'CompanyTransactionDto',
		});
	}
}
