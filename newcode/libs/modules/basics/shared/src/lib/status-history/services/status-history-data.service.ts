/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatRoot, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IStatusHistoryEntity } from '../model/entities/status-history-entity.interface';
import { CompleteIdentification, IEntityIdentification} from '@libs/platform/common';

/**
 * Represents the data service to handle Basics Shared Satus History Data Service
 * @typeParam T - entity type handled by itself data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity for update of parent entities.
 */

export abstract class BasicsSharedSatusHistoryDataService<T extends IStatusHistoryEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	protected abstract getModuleName(): string;
	public constructor(public parentService: DataServiceFlatRoot<PT, PU>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'basics/common/status',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listhistory',
				usePost: false,
				prepareParam: () => {
					const selection = parentService.getSelectedEntity();
					return {
						statusName: this.getModuleName(),
						objectId: selection!.Id,
					};
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'StatusHistory',
				parent:parentService,
			},	
			entityActions: {createSupported: true, deleteSupported: true},		
		};

		super(options);
	}
}
