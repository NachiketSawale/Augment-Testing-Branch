/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcMilestoneEntity, ProcurementCommonMileStoneDataService } from '@libs/procurement/common';
import { ProcurementModule } from '@libs/procurement/shared';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';

/**
 * MileStone service in Package
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageMileStoneDataService extends ProcurementCommonMileStoneDataService<IPrcMilestoneEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	public constructor(protected override readonly parentService: Package2HeaderDataService) {
		super(parentService);
	}

	protected getMainItemId(parent: IPackage2HeaderEntity) {
		return parent.PrcHeaderFk;
	}

	protected getProjectId() {
		const headerContext = this.getHeaderContext();
		return headerContext.projectFk;
	}

	protected getModuleName(): string {
		return ProcurementModule.Package.toLowerCase();
	}

	public getHeaderContext() {
		return this.parentService.getHeaderContext();
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPrcMilestoneEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
