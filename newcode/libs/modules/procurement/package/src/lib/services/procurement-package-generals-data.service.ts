/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcGeneralsEntity, PrcCreateContext, ProcurementCommonGeneralsDataService } from '@libs/procurement/common';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';

@Injectable({
	providedIn: 'root'
})

/**
 * Package Generals data service
 */
export class ProcurementPackageGeneralsDataService extends ProcurementCommonGeneralsDataService<IPrcGeneralsEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

	public constructor(protected packageDataService: Package2HeaderDataService) {
		super(packageDataService, {});
	}

	public override getHeaderContext() {
		return this.packageDataService.getHeaderContext();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideCreatePayload(): PrcCreateContext {
		const headerContext = this.getHeaderContext();
		return {
			MainItemId: headerContext.prcHeaderFk,
			PrcConfigFk: headerContext.prcConfigFk,
			StructureFk: headerContext.structureFk,
			ProjectFk: headerContext.projectFk
		};
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPrcGeneralsEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
