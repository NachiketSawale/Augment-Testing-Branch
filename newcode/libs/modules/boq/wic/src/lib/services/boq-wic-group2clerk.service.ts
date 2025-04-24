/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { WicGroupDataService } from './boq-wic-group.service';
import { IWicGroup2ClerkEntity } from '../model/entities/wic-group-2clerk-entity.interface';
import { IWicGroupEntity } from '../model/entities/wic-group-entity.interface';
import { WicGroupComplete } from '../model/wic-group-complete.class';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedClerkRoleLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedDataValidationService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';

@Injectable({providedIn: 'root'})
export class WicGroup2ClerkDataService extends DataServiceFlatLeaf<IWicGroup2ClerkEntity,IWicGroupEntity,WicGroupComplete> {
	public constructor(wicGroupDataService : WicGroupDataService) {
		const options: IDataServiceOptions<IWicGroup2ClerkEntity> = {
			apiUrl: 'boq/wic/wicgroup2clerk',
			roleInfo: <IDataServiceChildRoleOptions<IWicGroup2ClerkEntity,IWicGroupEntity,WicGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Clerks',
				parent: wicGroupDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByWicGroup',
				usePost: false,
				prepareParam: ident => {
					return { wicGroupId: ident.pKey1 };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: ident => {
					return {
						Id: ident.pKey1,
					};
				}
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IWicGroupEntity, entity: IWicGroup2ClerkEntity): boolean {
		return entity.WicCatGroupFk === parentKey.Id;
	}
}

/**
 * Boq Wic Group Clerk validation service
 */
@Injectable({
	providedIn: 'root'
})
export class WicGroup2ClerkValidationService extends BaseValidationService<IWicGroup2ClerkEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private wicGroup2ClerkDataService = inject(WicGroup2ClerkDataService);

	protected generateValidationFunctions(): IValidationFunctions<IWicGroup2ClerkEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			ClerkFk: this.validateIsMandatory,
			ClerkRoleFk: this.validateClerkRoleFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWicGroup2ClerkEntity> {
		return this.wicGroup2ClerkDataService;
	}

	private validateValidFrom(info: ValidationInfo<IWicGroup2ClerkEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo as string, 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<IWicGroup2ClerkEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.ValidFrom as string, <string>info.value, 'ValidFrom');
	}

	private async validateClerkRoleFk(info: ValidationInfo<IWicGroup2ClerkEntity>): Promise<ValidationResult> {
		let isSuccess = true;
		const result= new ValidationResult();
		if(!info.value) {
			isSuccess = false;
			result.apply = false;
			result.valid = false;
			result.error = 'Clerk role must be set';
		}
		const basClerkRoleLookupService = ServiceLocator.injector.get(BasicsSharedClerkRoleLookupService);
		const role = await firstValueFrom(basClerkRoleLookupService.getItemByKey({ id: info.value as number}));
		if(role && role.IsUnique){
			const clerkForWicGroup = this.wicGroup2ClerkDataService.getList();
			const sameRoleClerks = clerkForWicGroup.filter(item => {
				return item.ClerkRoleFk === info.value as number;
			});
			if(sameRoleClerks && sameRoleClerks.length) {
				if(info.entity.ValidFrom && info.entity.ValidTo){
					const overlapping = clerkForWicGroup.filter(item => {
						return WicGroup2ClerkValidationService.doIntersect(info.entity, item);
					});

					if (overlapping && overlapping.length) {
						isSuccess = false;
					}
				} else {
					isSuccess = false;
				}
			}

			if(!isSuccess){
				result.apply = true;
				result.valid = false;
				result.error = 'basics.common.clerkRoleMustBeUnique';
			}
		}

		return result;
	}

	private static doIntersect(l:IWicGroup2ClerkEntity, r:IWicGroup2ClerkEntity) {
		if (!l.ValidFrom || !l.ValidTo || !r.ValidFrom || !r.ValidTo) {
			return false;
		}
		return l.ValidFrom <= r.ValidFrom && l.ValidTo > r.ValidFrom || l.ValidFrom < r.ValidTo && l.ValidTo >= r.ValidTo || l.ValidFrom > r.ValidFrom && l.ValidTo < r.ValidTo;
	}

}

@Injectable({providedIn: 'root'})
export class WicGroup2ClerkConfigService {
	public getWicGroup2ClerkLayoutConfiguration(): ContainerLayoutConfiguration<IWicGroup2ClerkEntity> {
		return {
			//TODO-FWK-Clerk Description column does not appear on grid. Issue from framework end.
			groups:
				[
					{
						gid: 'Basic Data', attributes: ['ClerkRoleFk', 'ClerkFk', 'ValidFrom', 'ValidTo', 'Comment']
					}
				],
			overloads: {
				ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(false),
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false)
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					ValidFrom: 'entityValidFrom',
					ValidTo: 'entityValidTo',
					Comment: 'entityComment',
					ClerkFk: 'entityClerk',
				}),
				...prefixAllTranslationKeys('basics.company.', {
					ClerkRoleFk: 'entityRole',
				})
			},
		};
	}
}
