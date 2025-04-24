/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IEngDrwRevisionEntity } from '../model/entities/eng-drw-revision-entity.interface';
import { IEngTmplRevisionEntity } from '../model/entities/eng-tmpl-revision-entity.interface';
import { DrawingRevisionDataService } from './drawing-revision-data.service';
import { CompleteIdentification } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class DrawingRevisionTemplateRevisionDataService extends DataServiceFlatLeaf<IEngTmplRevisionEntity, IEngDrwRevisionEntity, CompleteIdentification<IEngDrwRevisionEntity>> {
	public constructor(private _drawingRevisionService: DrawingRevisionDataService) {
		const options: IDataServiceOptions<IEngTmplRevisionEntity> = {
			apiUrl: 'productionplanning/drawing/tmplrevision',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getbydrwrevision',
				prepareParam: (ident) => {
					return { drwRevisionId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IEngTmplRevisionEntity, IEngDrwRevisionEntity, CompleteIdentification<IEngDrwRevisionEntity>>>{
				role: ServiceRole.Leaf,
				itemName: 'RevisionTemplateRevision',
				parent: _drawingRevisionService,
			},
		};
		super(options);
	}
}
