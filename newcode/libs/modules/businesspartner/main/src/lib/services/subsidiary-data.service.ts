/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
	DataServiceFlatNode, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	ServiceRole, ValidationResult
} from '@libs/platform/data-access';
import { ISubsidiaryEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import {BusinessPartnerEntityComplete} from '../model/entities/businesspartner-entity-complete.class';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
import * as _ from 'lodash';
import {TelephoneEntity} from '@libs/basics/shared';
import {PropertyType} from '@libs/platform/common';
import { SUBSIDIARY_COMPLEX_FIELD_MAP } from '../model/constants/subsidiary-complex-field-map.model';
import { SubsidiaryEntityComplete } from '../model/entities/subsidiary-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainSubsidiaryDataService extends DataServiceFlatNode<ISubsidiaryEntity, SubsidiaryEntityComplete,
	IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<ISubsidiaryEntity> = {
			apiUrl: 'businesspartner/main/subsidiary',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions> {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ISubsidiaryEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Node,
				itemName: 'Subsidiary',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);

		businesspartnerMainHeaderDataService.bpCreated$.subscribe((newBp) => {
			this.create();
		});
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: object): ISubsidiaryEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				PKey1: parentSelection.Id
			};
		}
		throw new Error('Please select a business partner first');
	}

	protected override onCreateSucceeded(created: object): ISubsidiaryEntity {
		const subsidiary = created as unknown as ISubsidiaryEntity;
		const parentSelection = this.getSelectedParent();
		if (parentSelection?.Version === 0 && !parentSelection.SubsidiaryDescriptor && subsidiary.IsMainAddress) {
			parentSelection.SubsidiaryDescriptor = subsidiary;
		}
		return subsidiary;
	}

	public updateSubsidiaryByHeaderItem(model: string, value: TelephoneEntity | PropertyType | undefined,
		validationResult: ValidationResult) {
		if (!validationResult.valid || !validationResult.apply) {
			return;
		}
		const currentItem = this.getMainItem();
		if (currentItem && SUBSIDIARY_COMPLEX_FIELD_MAP[model]) {
			_.set(currentItem, SUBSIDIARY_COMPLEX_FIELD_MAP[model].dto, _.cloneDeep(value));

			if (SUBSIDIARY_COMPLEX_FIELD_MAP[model].pattern) {
				_.set(currentItem, SUBSIDIARY_COMPLEX_FIELD_MAP[model].pattern || '', value ? _.get(value, 'Pattern') : null);
			}

			this.select(currentItem);

			this.removeInvalid(currentItem, {
				field: SUBSIDIARY_COMPLEX_FIELD_MAP[model].dto,
				result: validationResult
			});

			// the simple type solo process
			const parentItem = this.getSelectedParent();
			if (model === 'Email' && parentItem?.SubsidiaryDescriptor) {
				_.set(parentItem.SubsidiaryDescriptor, model, value);
			}
		}
	}


	public getMainItem() {
		const items = this.getList();
		return items.find(item => item.IsMainAddress);
	}

	public override createUpdateEntity(modified: ISubsidiaryEntity | null): SubsidiaryEntityComplete {
		const complete = new SubsidiaryEntityComplete();
		if (modified) {
			complete.MainItemId = modified.Id;
			complete.Subsidiary = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: SubsidiaryEntityComplete): ISubsidiaryEntity[] {
		if (complete?.Subsidiary) {
			return [complete.Subsidiary];
		}

		return [];
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: ISubsidiaryEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}