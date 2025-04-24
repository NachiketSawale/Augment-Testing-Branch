/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { IPrcSubreferenceEntity, ProcurementCommonSubcontractorDataService } from '@libs/procurement/common';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';

/**
 * subcontractor service in Package
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageSubcontractorDataService extends ProcurementCommonSubcontractorDataService<IPrcSubreferenceEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	public constructor() {
		const parentService = inject(Package2HeaderDataService);
		super(parentService);
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPrcSubreferenceEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}