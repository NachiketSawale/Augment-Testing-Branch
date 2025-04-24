/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { MainDataDto } from '@libs/basics/shared';
import { IProcurementCommonEventsEntity } from '../model/entities/procurement-common-events-entity.interface';
import { ProcurementCommonEventsReadonlyProcessor } from './processors/procurement-common-events-readonly-processor.service';

export abstract class ProcurementCommonEventsDataService<T extends IProcurementCommonEventsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	public readonly readonlyProcessor: ProcurementCommonEventsReadonlyProcessor<T, PT, PU>;

	protected constructor(protected parentService: IReadonlyParentService<PT, PU>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/package/event',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcPackageEvent',
				parent: parentService,
			},
		};
		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: this.getPackageFk(parent),
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.Main;
	}

	protected createReadonlyProcessor() {
		return new ProcurementCommonEventsReadonlyProcessor(this, this.isReadonly());
	}

	protected abstract getPackageFk(parent: PT): number;

	protected abstract isReadonly(): boolean;
}
