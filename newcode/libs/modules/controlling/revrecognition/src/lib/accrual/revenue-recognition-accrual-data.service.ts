/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { PrrHeaderComplete } from '../model/complete-class/prr-header-complete.class';
import { ControllingRevenueRecognitionDataService } from '../revenue-recognition/revenue-recognition-data.service';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';
import { MainDataDto } from '@libs/basics/shared';


/**
 * Controlling Revenue Recognition Accrual data service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionAccrualDataService extends DataServiceFlatLeaf<ICompanyTransactionEntity, IPrrHeaderEntity, PrrHeaderComplete> {

	public constructor(protected parentService: ControllingRevenueRecognitionDataService) {
		const options: IDataServiceOptions<ICompanyTransactionEntity> = {
			apiUrl: 'controlling/RevenueRecognition/accrual',
			readInfo: {
				endPoint: 'list',
			},
			roleInfo: <IDataServiceRoleOptions<ICompanyTransactionEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CompanyTransaction',
				parent: parentService
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			}
		};
		super(options);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the header data');
		}
	}


	protected override onLoadSucceeded(loaded: object): ICompanyTransactionEntity[] {
		const dto = new MainDataDto<ICompanyTransactionEntity>(loaded);
		dto.Main.forEach(item => {
			this.setEntityReadOnly(item, true);
		});
		return dto.Main;
	}
}
