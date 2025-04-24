/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ICosParameter2TemplateEntity } from '../model/entities/cos-parameter-2-template-entity.interface';
import { ConstructionSystemMasterParameterFormatterProcessorService } from './processors/construction-system-master-parameter-formatter-processor.service';
import { Subject } from 'rxjs';
import {
	IIdentificationData,
	PlatformHttpService,
	ServiceLocator
} from '@libs/platform/common';
import { ConstructionSystemMasterParameterTypeLookupService } from './lookup/construction-system-master-parameter-type-lookup.service';
import { ConstructionSystemMasterParameterLookupService } from '@libs/constructionsystem/common';
import { ConstructionSystemMasterDefaultTypeLookupService } from './lookup/construction-system-master-default-type-lookup.service';
import { ICosDefaultTypeEntityEntity } from '../model/entities/cos-default-type-entity.interface';
import { ConstructionSystemMasterTemplateDataService } from './construction-system-master-template-data.service';
import { CosMasterTemplateComplete } from '../model/entities/cos-master-template-complete.class';
import { ConstructionSystemMasterParameter2TemplateReadonlyProcessorService } from './processors/construction-system-master-parameter2-template-readonly-processor.service';
import {
	ConstructionSystemSharedGlobalParameterValueLookupService,
	ICosGlobalParamValueEntity,
	ICosParameterLookupEntity,
	ICosTemplateEntity
} from '@libs/constructionsystem/shared';
import { forEach } from 'lodash';

interface IParamater2TemplateLoadedResponse {
	Main: ICosParameter2TemplateEntity[];
	CosParameter: ICosParameterLookupEntity[];
	CosMasterDefaultType: ICosDefaultTypeEntityEntity[] | null;
	CosMasterParameterType: ICosDefaultTypeEntityEntity[] | null;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameter2TemplateGridDataService extends DataServiceFlatLeaf<ICosParameter2TemplateEntity, ICosTemplateEntity, CosMasterTemplateComplete> {
	public defaultTypeChanged = new Subject<null>();
	private readonly http = inject(PlatformHttpService);

	public constructor(private parentService: ConstructionSystemMasterTemplateDataService) {
		const options: IDataServiceOptions<ICosParameter2TemplateEntity> = {
			apiUrl: 'constructionsystem/master/parameter2template',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosParameter2TemplateEntity, ICosTemplateEntity, CosMasterTemplateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosParameter2Template',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		const readonlyProcessor = new ConstructionSystemMasterParameter2TemplateReadonlyProcessorService(this);
		this.processor.addProcessor([new ConstructionSystemMasterParameterFormatterProcessorService(), readonlyProcessor]);
		this.parentService.completeEntityCreated.subscribe((templateComplete) => {
			this.createList(templateComplete);
		});
	}
	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected template to load the parameter template data');
		}
	}
	protected override onLoadSucceeded(loaded: IParamater2TemplateLoadedResponse) {
		this.setLookupData(loaded);
		return loaded.Main;
	}

	public override isParentFn(parentKey: ICosTemplateEntity, entity: ICosParameter2TemplateEntity): boolean {
		return parentKey.Id === entity.CosTemplateFk;
	}

	private setLookupData(loaded: IParamater2TemplateLoadedResponse) {
		// parameter type
		if (loaded.CosMasterParameterType && loaded.CosMasterParameterType.length > 0) {
			const parameterTypeLookupService = ServiceLocator.injector.get(ConstructionSystemMasterParameterTypeLookupService);
			parameterTypeLookupService.cache.setList(loaded.CosMasterParameterType);
		}
		//cos parameter lookup
		if (loaded.CosParameter && loaded.CosParameter.length > 0) {
			const parameterLookupService = ServiceLocator.injector.get(ConstructionSystemMasterParameterLookupService);
			parameterLookupService.cache.setList(loaded.CosParameter);
		}
		/// default type lookup
		if (loaded.CosMasterDefaultType && loaded.CosMasterDefaultType.length > 0) {
			const parameterLookupService = ServiceLocator.injector.get(ConstructionSystemMasterDefaultTypeLookupService);
			parameterLookupService.cache.setList(loaded.CosMasterDefaultType);
		}
		//default value
		if(loaded.Main && loaded.Main.length > 0) {
			const cosParameters = loaded.Main.filter(v=>v.IsLookup).map(value=>value.CosParameterFk);
			const parameterValueService = ServiceLocator.injector.get(ConstructionSystemSharedGlobalParameterValueLookupService);
			forEach(cosParameters, (p) => {
				this.http.get<ICosGlobalParamValueEntity[]>(`basics/lookupdata/master/getsearchlist?lookup=cosmasterparameter2templateparametervaluelookup&filtervalue=(CosParameterFk=${p})`).then(resps => {
					if(resps.length > 0) {
						parameterValueService.cache.setItems(resps);
						parameterValueService.cache.setList(resps);
					}
				});
			});
		}
	}

	/**
	 * do not load data if parent entity is new creation
	 * @param identificationData
	 */
	public override loadSubEntities(identificationData: IIdentificationData): Promise<void> {
		const parentEntity = this.getSelectedParent();
		if (parentEntity && parentEntity.Version === 0) {
			return Promise.resolve();
		}
		return super.loadSubEntities(identificationData);
	}
	/**
	 * create list once parent item is created
	 */
	public createList(templateComplete: CosMasterTemplateComplete) {
		const items = templateComplete.CosParameter2TemplateToSave ?? [];
		if (items.length === 0) {
			return;
		}
		this.append(items);
		this.select(items[0]);
		this.setModified(items);
	}

	/**
	 * refresh service
	 */
	public refreshAll() {
		return super.loadSubEntities({ id: 0, pKey1: 0 });
	}
}
