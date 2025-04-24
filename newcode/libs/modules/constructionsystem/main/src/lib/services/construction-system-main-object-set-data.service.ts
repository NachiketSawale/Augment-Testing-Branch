import { DataServiceFlatRoot, EntityDateProcessorFactory, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityProcessor, ServiceRole } from '@libs/platform/data-access';
import { ICosMainObjectSetEntity } from '../model/entities/cos-main-object-set-entity.interface';
import { inject, Injectable } from '@angular/core';
import { ISearchPayload } from '@libs/platform/common';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { IObjectSetComplete } from '../model/entities/object-set-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObjectSetDataService extends DataServiceFlatRoot<ICosMainObjectSetEntity, IObjectSetComplete> {
	private readonly cosMainInstanceDataService = inject(ConstructionSystemMainInstanceDataService);

	public constructor() {
		const options: IDataServiceOptions<ICosMainObjectSetEntity> = {
			apiUrl: 'model/main/objectset',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<ICosMainObjectSetEntity>>{
				role: ServiceRole.Root,
				itemName: 'ObjectSet',
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
		this.processor.addProcessor(this.provideDateProcessor());
	}

	public override provideLoadByFilterPayload(payload: ISearchPayload): object {
		return {
			mainItemId: this.cosMainInstanceDataService.getCurrentSelectedProjectId(),
		};
	}

	private provideDateProcessor(): IEntityProcessor<ICosMainObjectSetEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<ICosMainObjectSetEntity>({
			moduleSubModule: 'Model.Main',
			typeName: 'ObjectSetDto',
		});
	}
}