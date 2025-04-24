/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, ProviderToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, PlatformSchemaService, ServiceRole, ValidationServiceFactory } from '@libs/platform/data-access';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { IBoqHeader2ClerkEntity } from '@libs/boq/main';
import { ProjectBoqDataService } from './boq-project-boq.service';
import { IProjectBoqCompositeEntity } from '../model/models';
import { IProjectBoqComplete } from '../model/boq-project-complete.interface';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Boq Project Clerk data service
 */
@Injectable({providedIn: 'root'})
export class BoqProjectClerkDataService extends DataServiceFlatLeaf<IBoqHeader2ClerkEntity,IProjectBoqCompositeEntity,IProjectBoqComplete> { //TODO-BOQ-Save and Delete functionality not working because of pending todos related to BoqCompositeToSave in boq-project-boq.service.ts. Need to test once pending todos are completed.
	public constructor(projectBoqDataService : ProjectBoqDataService) {
		const options: IDataServiceOptions<IBoqHeader2ClerkEntity> = {
			apiUrl: 'boq/project/clerk',
			roleInfo: <IDataServiceChildRoleOptions<IBoqHeader2ClerkEntity,IProjectBoqCompositeEntity,IProjectBoqComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BoqHeader2Clerks',
				parent: projectBoqDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: false,
				prepareParam: () => {
					const selected =  projectBoqDataService.getSelectedEntity();
					const boqHeaderFK = selected && selected.BoqHeader ? selected.BoqHeader.Id : -1;
					return { boqHeaderId: boqHeaderFK };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: () => {
					const selected =  projectBoqDataService.getSelectedEntity();
					const boqHeaderFK = selected && selected.BoqHeader ? selected.BoqHeader.Id : -1;
					return {
						Id: boqHeaderFK,
					};
				}
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IProjectBoqCompositeEntity, entity: IBoqHeader2ClerkEntity): boolean {
		return entity.BoqHeaderFk === parentKey.Id;
	}
}

/**
 * Boq Project Clerk validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BoqProjectClerkValidationService extends BaseValidationService<IBoqHeader2ClerkEntity> {
	private boqProjectClerkDataService = inject(BoqProjectClerkDataService);
	private validators: IValidationFunctions<IBoqHeader2ClerkEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IBoqHeader2ClerkEntity>> = PlatformSchemaService<IBoqHeader2ClerkEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Boq.Main', typeName: 'BoqHeader2ClerkDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IBoqHeader2ClerkEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IBoqHeader2ClerkEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBoqHeader2ClerkEntity> {
		return this.boqProjectClerkDataService;
	}
}

/**
 * Boq Project Clerk config service
 */
@Injectable({providedIn: 'root'})
export class BoqProjectClerkConfigService {
	public getBoqProjectClerkLayoutConfiguration(): ContainerLayoutConfiguration<IBoqHeader2ClerkEntity> {
		return {
			groups: [ {gid: 'Basic Data', attributes: ['ClerkRoleFk', 'ClerkFk', 'CommentText'] }], //TODO-FWK-Clerk Description column does not appear on grid
			overloads: {
				ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(false),
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false),
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: 'entityComment',
					ClerkFk: 'entityClerk',
				}),
				...prefixAllTranslationKeys('basics.company.', {
					ClerkRoleFk: 'entityRole',
				})
			},
		};
	}
}