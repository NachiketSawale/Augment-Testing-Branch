/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcCommonReadonlyService } from '../model/interfaces';
import { IPrcCallOffAgreementEntity } from '../model/entities/prc-call-off-agreement-entity.interface';
import { ProcurementCommonCallOffAgreementReadonlyProcessor } from './processors/procurement-common-call-off-agreement-readonly-processor.service';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';

/**
 * The basic data service for CallOffAgreement for contract and quote modules
 */
export abstract class ProcurementCommonCallOffAgreementDataService<T extends IPrcCallOffAgreementEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<T, PT, PU> {
	public readOnlyProcessor?: ProcurementCommonCallOffAgreementReadonlyProcessor<T, PT, PU>;

	protected constructor(public parentService: IReadonlyParentService<PT, PU> & IPrcCommonReadonlyService<PT>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/prccalloffagreement',
			readInfo: {
				endPoint: 'list',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'CallOffAgreement',
				parent: parentService
			}
		};

		super(options);
		this.readOnlyProcessor = new ProcurementCommonCallOffAgreementReadonlyProcessor<T, PT, PU>(this);
		this.processor.addProcessor([this.readOnlyProcessor]);
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		return loaded as unknown as T[];
	}

	public override canDelete(): boolean {
		if (!super.canDelete()) {
			return false;
		}

		return !this.parentService.isEntityReadonly();
	}


	public override canCreate(): boolean {
		if (!super.canCreate()) {
			return false;
		}
		return !this.parentService.isEntityReadonly();
	}

}
