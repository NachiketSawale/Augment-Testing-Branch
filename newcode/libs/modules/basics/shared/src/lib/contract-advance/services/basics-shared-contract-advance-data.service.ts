/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';

export abstract class BasicsSharedContractAdvanceDataService<T extends object, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	protected constructor(
		protected parentService: IEntitySelection<PT>,
		protected config: {
			apiUrl: string;
			itemName: string;
			endReadFn: string;
			usePostForRead: boolean;
		},
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: config.apiUrl,
			readInfo: {
				endPoint: config.endReadFn,
				usePost: config.usePostForRead,
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: config.itemName,
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: this.getMainItemId(parent),
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		return loaded as T[];
	}

	protected override provideCreatePayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			PKey1: this.getMainItemId(parent),
		};
	}

	protected override onCreateSucceeded(created: T): T {
		return created;
	}

	protected abstract getMainItemId(parent: PT): number;
}
