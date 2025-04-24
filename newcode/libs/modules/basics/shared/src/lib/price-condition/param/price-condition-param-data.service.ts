/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPriceConditionHeaderParamEntity } from '@libs/basics/interfaces';

export abstract class BasicsSharedPriceConditionParamDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<IPriceConditionHeaderParamEntity, PT, PU> {
	public constructor(
		protected parentService: IEntitySelection<PT>,
		protected type: number,
	) {
		const options: IDataServiceOptions<IPriceConditionHeaderParamEntity> = {
			apiUrl: 'basics/pricecondition/headerpparam',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getlist',
				usePost: false,
				prepareParam: (ident) => {
					return { contextFk: ident.pKey1, type: this.type };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPriceConditionHeaderParamEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'HeaderPparam',
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.parentService.getSelectedEntity();
		if (parentEntity) {
			return {
				contextFk: parentEntity.Id,
				type: this.type,
			};
		} else {
			throw new Error('please select a parent first');
		}
	}

	protected override onCreateSucceeded(loaded: object): IPriceConditionHeaderParamEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IPriceConditionHeaderParamEntity;
		if (entity && parent) {
			entity.ContextFk = parent.Id;
			entity.Type = this.type;
		}
		return entity;
	}

	public override isParentFn(parentKey: PT, entity: IPriceConditionHeaderParamEntity): boolean {
		return entity.ContextFk === parentKey.Id;
	}

	///todo:save header param ---- rootService.registerUpdateDataExtensionEvent(onUpdateRequested)
}
