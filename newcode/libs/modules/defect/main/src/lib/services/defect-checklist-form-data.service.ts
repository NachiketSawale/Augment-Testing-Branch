/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainHeaderDataService } from './defect-main-header-data.service';
import { DefectMainComplete } from '../model/defect-main-complete.class';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';

@Injectable({
	providedIn: 'root',
})
export class DefectChecklistFormDataService extends DataServiceFlatLeaf<IHsqCheckList2FormEntity, IDfmDefectEntity, DefectMainComplete> {
	public constructor(private parentService: DefectMainHeaderDataService) {
		const options: IDataServiceOptions<IHsqCheckList2FormEntity> = {
			apiUrl: 'hsqe/checklist/form',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: () => {
					const selected = this.parentService.getSelectedEntity();
					return { mainItemId: selected?.HsqChecklistFk ?? -1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IHsqCheckList2FormEntity, IDfmDefectEntity, DefectMainComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'FormData',
				parent: parentService,
			},
		};

		super(options);
	}
}
