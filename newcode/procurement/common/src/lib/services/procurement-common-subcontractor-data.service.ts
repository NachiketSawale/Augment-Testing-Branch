/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification, IIdentificationData
} from '@libs/platform/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IPrcSubreferenceEntity} from '../model/entities';
import { IPrcHeaderDataService } from '../model/interfaces';
import { MainDataDto } from '@libs/basics/shared';
import { ProcurementCommonSubcontractorReadonlyProcessor} from './processors/procurement-common-subcontractor-readonly-processor.service';

export abstract class ProcurementCommonSubcontractorDataService<T extends IPrcSubreferenceEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>extends DataServiceFlatLeaf<T, PT, PU> {
	public readonly readonlyProcessor: ProcurementCommonSubcontractorReadonlyProcessor<T, PT, PU>;
	protected constructor(protected parentService: IPrcHeaderDataService<PT, PU>) {

		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/prcsubreference',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const headerContext = this.parentService.getHeaderContext();
					return {
						MainItemId: headerContext.prcHeaderFk
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcSubreference',
				parent: parentService
			}
		};
		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
	}

	public get prcHeaderContext() {
		return this.parentService.getHeaderContext();
	}

	protected override provideLoadPayload(): object {
		const headerContext = this.parentService.getHeaderContext();
		return {
			MainItemId: headerContext.prcHeaderFk,
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.Main;
	}
	protected createReadonlyProcessor() {
		return new ProcurementCommonSubcontractorReadonlyProcessor(this);
	}

}
