/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatLeaf, DataServiceFlatRoot, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole, ValidationInfo } from '@libs/platform/data-access';
import { IActivityEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { get } from 'lodash';
import { CompleteIdentification, PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { ActivityValidationService } from './activity-validation.service';

export abstract class ActivityDataBaseService<T extends object, PT extends object> extends DataServiceFlatLeaf<IActivityEntity, PT, CompleteIdentification<T>> {
	private readonly platformConfigurationService = ServiceLocator.injector.get(PlatformConfigurationService);

	public readonly activityValidationService: ActivityValidationService<IActivityEntity, PT>;

	public constructor(headerDataService: DataServiceFlatRoot<PT, CompleteIdentification<T>>) {
		const options: IDataServiceOptions<IActivityEntity> = {
			apiUrl: 'businesspartner/main/Activity',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IActivityEntity, IBusinessPartnerEntity, CompleteIdentification<T>>>{
				role: ServiceRole.Leaf,
				itemName: 'Activity',
				parent: headerDataService,
			},
		};
		super(options);
		this.activityValidationService = new ActivityValidationService<IActivityEntity, PT>(this);
		//todo Waiting for verification
		this.processor.addProcessor({
			revertProcess() {},
			process: (item: IActivityEntity) => {
				this.processItem(item);
			},
		});
	}

	private processItem(item: IActivityEntity): void {
		if (item) {
			const companyId = this.platformConfigurationService.clientId;
			if (item.CompanyFk !== companyId) {
				this.setEntityReadOnly(item, true);
			} else {
				this.updateReadOnly(item);
			}
			const validationInfo: ValidationInfo<IActivityEntity> = new ValidationInfo<IActivityEntity>(item, item.ActivityTypeFk, 'ActivityTypeFk');
			const resultValidation = this.activityValidationService.ValidateActivityTypeFk(validationInfo);
			if (!resultValidation.valid) {
				this.addInvalid(item, { result: resultValidation, field: 'ActivityTypeFk' });
			} else {
				this.removeInvalid(item, { result: resultValidation, field: 'ActivityTypeFk' });
			}
		}
	}

	private updateReadOnly(item: IActivityEntity): void {
		let isReadOnly = false;
		if (item.FileArchiveDocFk) {
			isReadOnly = true;
		}
		this.setEntityReadOnlyFields(item, [
			{
				field: 'DocumentTypeFk',
				readOnly: isReadOnly,
			},
		]);
	}

	//region basic override

	protected override onLoadSucceeded(loaded: object): IActivityEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	// endregion
	//
	// public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IActivityEntity): boolean {
	// 	return entity.BusinessPartnerFk === parentKey.Id;
	// }
}
