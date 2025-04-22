import { Injectable } from '@angular/core';
import { AsyncReadonlyFunctions, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerReadonlyProcessorService extends EntityAsyncReadonlyProcessorBase<IBusinessPartnerEntity> {

	public constructor(protected dataService: BusinesspartnerMainHeaderDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IBusinessPartnerEntity> {
		return {
			BusinessPartnerName2: {
				shared: [
					//'SubsidiaryDescriptor.AddressDto', // todo chi: complex field is not supported.
					'BusinessPartnerName3',
					'BusinessPartnerName4'
				],
				readonly: (info) => {
					let isReadonly = false;
					const entity = info.item;
					const canEdit = this.dataService.isStatusEditName(entity);
					isReadonly = isReadonly && !canEdit;
					const isStatusWithEditRight = this.dataService.isStatusWithEditRight(entity);
					if (entity.Version && !isStatusWithEditRight) {
						isReadonly = true;
					}
					return isReadonly;
				}
			},
			Email: {
				shared: [
					'TitleFk',
					'BusinessPartnerStatusFk',
					'BusinessPartnerName1',
					'MatchCode',
					'CrefoNo',
					'BedirektNo',
					'DunsNo',
					'VatNo',
					'TaxNo',
					'HasFrameworkAgreement',
					// 'SubsidiaryDescriptor.TelephoneNumber1Dto',   // todo chi: complex field is not supported.
					// 'SubsidiaryDescriptor.TelephoneNumber2Dto',
					// 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto',
					// 'SubsidiaryDescriptor.TelephoneNumberMobileDto'
				],
				readonly: (info) => {
					let isReadonly = false;
					const entity = info.item;
					const isStatusWithEditRight = this.dataService.isStatusWithEditRight(entity);
					if (entity.Version && !isStatusWithEditRight) {
						isReadonly = true;
					}
					return isReadonly;
				}
			}
		};
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IBusinessPartnerEntity> {
		return {
			Code: async (info) => {
				let isReadonly = false;
				const entity = info.item;

				let isCodeGenerated = false;
				if (entity.RubricCategoryFk) {
					isCodeGenerated = await this.dataService.canCodeGenerated(entity.RubricCategoryFk, entity.CompanyFk);
				}

				const canEdit = this.dataService.isStatusEditName(entity);
				isReadonly = isReadonly && !canEdit;

				const isStatusWithEditRight = this.dataService.isStatusWithEditRight(entity);

				if (entity.Version) {
					if (!entity.RubricCategoryFk || !isStatusWithEditRight) {
						isReadonly = true;
					}
				} else {
					if (isCodeGenerated) {
						isReadonly = true;
					}
				}
				return isReadonly;
			},
		};
	}

	protected override readonlyEntity(item: IBusinessPartnerEntity) {
		const isStatusReadonly = this.dataService.isStatusReadonly();
		if (!item) {
			return true;
		}
		if (item.Version) {
			return isStatusReadonly && item.Version > 0;
		}
		return false;
	}
}