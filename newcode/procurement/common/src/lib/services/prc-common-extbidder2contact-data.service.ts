/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification
} from '@libs/platform/common';
import {
	DataServiceFlatLeaf, DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { MainDataDto } from '@libs/basics/shared';
import { IPrcCommonExtBidder2contactEntity } from '../model/entities/prc-common-extbidder2contact-entity.interface';
import { PrcCommonExtBidderComplete } from '../model/complete-class/prc-common-extbidder-complete.class';

export abstract class PrcCommonExtBidder2contactDataService<T extends IPrcCommonExtBidder2contactEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {

	protected constructor(protected parentService: DataServiceFlatNode<PT, object,object,PrcCommonExtBidderComplete>) {

		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/package/extbidder2contact',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcPackage2ExtBpContact',
				parent: parentService
			},
			createInfo: {
				endPoint: 'create',
			}
		};
		super(options);
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			PKey1: this.getExtBidderFk(parent)
		};
	}

	protected override onCreateSucceeded(created: object): T {
		return created as unknown as T;
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			MainItemId: this.getExtBidderFk(parent)
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.dto as T[];
	}

	public override canCreate(): boolean {
		const parent = this.getSelectedParent()!;
		if(parent){
			return this.bpFkHasValue(parent);
		}
		return false;
	}

	protected abstract getExtBidderFk(parent: PT): number;

	protected abstract bpFkHasValue(parent: PT): boolean;
}