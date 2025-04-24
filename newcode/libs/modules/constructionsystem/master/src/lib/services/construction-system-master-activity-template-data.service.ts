/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { PlatformLazyInjectorService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { ILookupFieldOverload, ILookupReadonlyDataService } from '@libs/ui/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntityProcessor, ServiceRole } from '@libs/platform/data-access';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ConstructionSystemMasterActivityTemplateValidationService } from './validations/construction-system-master-activity-template-validation.service';
import { CosMasterComplete, ICosActivityTemplateEntity, ITemplateActivityTemplateEntity } from '../model/models';

interface IActivityTemplateResponse {
	activityTemplates: ITemplateActivityTemplateEntity[];
	dtos: ICosActivityTemplateEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterActivityTemplateDataService extends DataServiceFlatLeaf<ICosActivityTemplateEntity, ICosHeaderEntity, CosMasterComplete> {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private activityTemplateLookup?: ILookupReadonlyDataService<object, ICosActivityTemplateEntity>;

	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosActivityTemplateEntity> = {
			apiUrl: 'constructionsystem/master/activitytemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosActivityTemplateEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosActivityTemplate',
				parent: parentService,
			},
		};

		super(options);

		this.processor.addProcessor([this.provideNewEntityValidationProcessor(), this.provideDataProcessor()]);
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosActivityTemplateEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}

	protected override provideLoadPayload() {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to load the activity template data');
		}
	}

	protected override onLoadSucceeded(loaded: IActivityTemplateResponse): ICosActivityTemplateEntity[] {
		if (Array.isArray(loaded.activityTemplates)) {
			this.getActivityTemplateLookup().then(async (activityTemplateLookup) => {
				activityTemplateLookup.cache.setItems(loaded.activityTemplates);
			});
		}
		return loaded?.dtos ?? [];
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(
			ConstructionSystemMasterActivityTemplateValidationService,
			{ moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosActivityTemplateDto' },
			{ excludeFields: ['ActivityTemplateFk'] },
		);
	}

	private provideDataProcessor(): IEntityProcessor<ICosActivityTemplateEntity> {
		return {
			process: (item: ICosActivityTemplateEntity) => {
				if (item.ActivityTemplateFk === 0) {
					item.ActivityTemplateFk = null;
				}
			},
			revertProcess() {},
		};
	}

	public async getActivityTemplateLookup(): Promise<ILookupReadonlyDataService<object, ICosActivityTemplateEntity>> {
		if (this.activityTemplateLookup) {
			return this.activityTemplateLookup;
		}
		const activityTemplateLookupProvider = await this.lazyInjector.inject(ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN);
		const activityTemplateLookupDefinition = activityTemplateLookupProvider.generateActivityTemplateLookup();
		const lookupOptions = (activityTemplateLookupDefinition as ILookupFieldOverload<ICosActivityTemplateEntity>).lookupOptions;
		this.activityTemplateLookup = ServiceLocator.injector.get(lookupOptions.getTypedOptions().dataServiceToken);
		return this.activityTemplateLookup as ILookupReadonlyDataService<object, ICosActivityTemplateEntity>;
	}
}
