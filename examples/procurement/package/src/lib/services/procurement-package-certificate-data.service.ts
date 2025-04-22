/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementCommonCertificateDataService } from '@libs/procurement/common';
import { Package2HeaderDataService } from './package-2header-data.service';
import { IPackage2HeaderEntity, IPrcPackageEntity, IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';

@Injectable({
    providedIn: 'root'
})

/**
 * Package Certificate data service
 */
export class ProcurementPackageCertificateDataService extends ProcurementCommonCertificateDataService<IPrcCertificateEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
    public constructor(protected readonly packageHeaderService:ProcurementPackageHeaderDataService,
		protected readonly parentDataService: Package2HeaderDataService
	) {
        super(parentDataService, {});
    }

    protected override provideLoadPayload(): object {
		const selectedEntity = this.parentDataService.getSelectedEntity();
		if (selectedEntity) {
			const dataPackage: IPrcPackageEntity | null = this.packageHeaderService.getSelectedEntity();
			if (dataPackage) {
				return {
					MainItemId: selectedEntity.PrcHeaderFk,
					projectId: dataPackage.ProjectFk,
					moduleName: ProcurementInternalModule.Package,
				};
			} else {
				throw new Error('There should be a selected package data');
			}
		} else {
			throw new Error('There should be a selected subpackage data');
		}
	}

	public override isParentFn(parentKey: IPackage2HeaderEntity, entity: IPrcCertificateEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}