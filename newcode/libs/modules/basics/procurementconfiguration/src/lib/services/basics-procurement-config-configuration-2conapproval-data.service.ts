/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsProcurementConfigConfigurationDataService } from './basics-procurement-config-configuration-data.service';
import { BasicsProcurementConfigurationHeaderDataService } from './basics-procurement-configuration-header-data.service';
import { IPrcConfig2ConApprovalEntity } from '../model/entities/prc-config-2-con-approval-entity.interface';
import { PrcConfigurationComplete } from '../model/complete-class/prc-configuration-complete.class';
import { IPrcConfigurationEntity } from '../model/entities/prc-configuration-entity.interface';

/**
 * ProcurementConfiguration Configuration 2ConApproval entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigConfiguration2ConApprovalDataService extends DataServiceFlatLeaf<IPrcConfig2ConApprovalEntity, IPrcConfigurationEntity, PrcConfigurationComplete> {
	public constructor(headerService: BasicsProcurementConfigurationHeaderDataService, parentService: BasicsProcurementConfigConfigurationDataService) {
		const options: IDataServiceOptions<IPrcConfig2ConApprovalEntity> = {
			apiUrl: 'basics/procurementconfiguration/configuration2conapproval',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: (ident) => {
					return { PKey1: ident.pKey1 };
				},
			},
			createInfo: {
				prepareParam: () => {
					const selection = parentService.getSelection()[0];
					return {
						PKey1: selection.Id,
					};
				},
			},
			roleInfo: <IDataServiceRoleOptions<IPrcConfig2ConApprovalEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcConfig2ConApproval',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IPrcConfigurationEntity, entity: IPrcConfig2ConApprovalEntity): boolean {
		return entity.PrcConfigurationFk === parentKey.Id;
	}
}
