/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { DefectMainComplete } from '../model/defect-main-complete.class';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { IDfmPhotoEntity } from '../model/entities/dfm-photo-entity.interface';
import { DefectMainHeaderDataService } from './defect-main-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class DefectMainPhotoDataService extends DataServiceFlatLeaf<IDfmPhotoEntity, IDfmDefectEntity, DefectMainComplete> {
	public constructor(parentService: DefectMainHeaderDataService) {
		const options: IDataServiceOptions<IDfmPhotoEntity> = {
			apiUrl: 'defect/main/photo',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IDfmPhotoEntity, IDfmDefectEntity, DefectMainComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DfmPhoto',
				parent: parentService,
			},
		};
		super(options);
	}

	public override isParentFn(parentKey: IDfmDefectEntity, entity: IDfmPhotoEntity): boolean {
		return entity.DfmDefectFk === parentKey.Id;
	}
}
