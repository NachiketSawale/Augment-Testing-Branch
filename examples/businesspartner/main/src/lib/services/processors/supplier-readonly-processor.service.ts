/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { AsyncReadonlyFunctions, BasicsSharedBpSupplierStatusLookupService, BasicsSharedNumberGenerationService, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { SupplierDataService } from '../suppiler-data.service';
import { firstValueFrom } from 'rxjs';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { SupplierInitService } from '../init-service/businesspartner-data-provider.service';
import { isNumber } from 'lodash';
import { ISupplierEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class SupplierReadonlyProcessorService extends EntityAsyncReadonlyProcessorBase<ISupplierEntity> {
	private readonly numberGenerationSettingsService = inject(BasicsSharedNumberGenerationService);
	private readonly supplierStatusLookupService = inject(BasicsSharedBpSupplierStatusLookupService);
	private readonly businesspartnerMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly supplierInitService = inject(SupplierInitService);

	public constructor(protected dataService: SupplierDataService) {
		super(dataService);
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<ISupplierEntity> {
		return {
			Code: async (info) => {
				// version >0 readonly is true
				if (info.item.Version && info.item.Version > 0) {
					return true;
				}
				if (info.item.Version === 0) {
					const resulGeneralIsNoReadonly = await this.generalIsNoReadonly(info.item);
					let resultByRubricCategoryFk = false;
					if (info.item.RubricCategoryFk) {
						resultByRubricCategoryFk = this.numberGenerationSettingsService.hasNumberGenerateConfig(info.item.RubricCategoryFk);
					}
					const resulIsNoReadonly = resulGeneralIsNoReadonly && !resultByRubricCategoryFk;
					return !resulIsNoReadonly;
				}
				return true;
			},
			SupplierStatusFk: {
				shared: [
					'SupplierLedgerGroupFk',
					'Description',
					'CustomerNo',
					'PaymentTermPaFk',
					'PaymentTermFiFk',
					'BillingSchemaFk',
					'VatGroupFk',
					'SubsidiaryFk',
					'Description2',
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'UserDefined4',
					'UserDefined5',
					'BusinessPostingGroupFk',
					'BankFk',
					'BasPaymentMethodFk',
					'BusinessPostGrpWhtFk',
					'BlockingReasonFk',
					'SupplierLedgerGroupIcFk',
					'RubricCategoryFk',
					'SupplierStatusFk',
				],
				readonly: async (info) => {
					const resulIsNoReadonly = await this.generalIsNoReadonly(info.item);
					return !resulIsNoReadonly;
				},
			},
		};
	}

	/**
	 * judge by bp status and supplier status,only use in version>0
	 * @param currentItem
	 * @returns {Promise<boolean>} return can edit status result is true,can not edit status result is false
	 */
	public async isCanEditStatus(currentItem: ISupplierEntity): Promise<boolean> {
		const dataBp = this.businesspartnerMainHeaderDataService.getSelectedEntity();
		if (dataBp && currentItem.SupplierStatusFk && currentItem.Version && currentItem.Version > 0) {
			const dataSupplierStatus = await firstValueFrom(this.supplierStatusLookupService.getItemByKey({ id: currentItem.SupplierStatusFk }));
			const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(dataBp, 'statusWithEidtRight');
			const isBpStatusToSupplierHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(dataBp, 'statusWithEidtRightToSupplier');
			const resultBpCanEditStatus = isBpStatusHasRight || isBpStatusToSupplierHasRight;
			const resultSupplierNoCanEditStatus = dataSupplierStatus?.IsDeactivated;
			if (!resultBpCanEditStatus || resultSupplierNoCanEditStatus) {
				return false;
			}
		}
		return true;
	}

	/**
	 * judge IsNoReadonly result
	 * @param currentItem
	 * @returns {Promise<boolean>} return no readonly result is true，readonly result is false
	 */
	private async generalIsNoReadonly(currentItem: ISupplierEntity): Promise<boolean> {
		let isNoReadonly = false;

		// region judge by SubledgerContextFk
		let isSameSubledgerContextFk = false;
		if (currentItem.SubledgerContextFk === this.supplierInitService.currentSubledgerContextFk) {
			isSameSubledgerContextFk = true;
		}
		// endregion
		if (currentItem.Version === 0) {
			isNoReadonly = isSameSubledgerContextFk;
		}
		if (isNumber(currentItem.Version) && currentItem.Version > 0) {
			const isCanEditStatus = await this.isCanEditStatus(currentItem);
			isNoReadonly = isCanEditStatus && isSameSubledgerContextFk;
		}
		return isNoReadonly;
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<ISupplierEntity> {
		return {
			SubledgerContextFk: () => {
				return true;
			},
		};
	}
}
