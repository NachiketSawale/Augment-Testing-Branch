/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcMilestoneEntity } from '../model/entities/prc-milestone-entity.interface';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { MainDataDto } from '@libs/basics/shared';

export abstract class ProcurementCommonMileStoneDataService<T extends IPrcMilestoneEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	protected constructor(protected parentService: IReadonlyParentService<PT, PU>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/prcmilestone',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcMilestone',
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: this.getMainItemId(parent),
			ProjectId: this.getProjectId(parent),
			moduleName: this.getModuleName(),
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.Main;
	}

	protected override provideCreatePayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: this.getMainItemId(parent),
		};
	}

	protected override onCreateSucceeded(created: T): T {
		return created;
	}

	protected abstract getMainItemId(parent: PT): number;

	protected abstract getProjectId(parent: PT): number;

	protected abstract getModuleName(): string;
}
