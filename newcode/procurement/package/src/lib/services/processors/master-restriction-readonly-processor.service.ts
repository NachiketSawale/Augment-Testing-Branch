/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo} from '@libs/basics/shared';
import {IPrcPacMasterRestrictionEntity} from '../../model/entities/prc-pac-master-restriction-entity.interface';
import {Injectable} from '@angular/core';
import {ProcurementPackageMasterRestrictionDataService} from '../master-restriction-data.service';
import {MasterRestrictionType} from '@libs/procurement/common';
import {get} from 'lodash';

interface IFieldReadonlyStatus {
	MdcMaterialCatalogFk: boolean;
	PrjProjectFk: boolean;
	PrjBoqFk: boolean;
	PrcPackageBoqFk: boolean;
	PackageBoqHeaderFk: boolean;
	BoqWicCatFk: boolean;
	BoqItemFk: boolean;
	ConHeaderFk: boolean;
	ConBoqHeaderFk: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageMasterRestrictionReadonlyProcessorService extends EntityReadonlyProcessorBase<IPrcPacMasterRestrictionEntity> {

	public constructor(protected dataService: ProcurementPackageMasterRestrictionDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IPrcPacMasterRestrictionEntity> {
		return {
			MdcMaterialCatalogFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			PrjProjectFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			PrjBoqFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			PrcPackageBoqFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			PackageBoqHeaderFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			BoqWicCatFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			BoqItemFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			ConHeaderFk: (info) => {
				return this.getReadonlyByCopyType(info);
			},
			ConBoqHeaderFk: (info) => {
				return this.getReadonlyByCopyType(info);
			}
		};
	}

	protected override readonlyEntity() {
		return this.dataService.isHeaderContextReadonly();
	}

	private getReadonlyByCopyType(info: ReadonlyInfo<IPrcPacMasterRestrictionEntity>): boolean {
		const fieldReadonlyStatus: IFieldReadonlyStatus = {
			MdcMaterialCatalogFk: true,
			PrjProjectFk: true,
			PrjBoqFk: true,
			PrcPackageBoqFk: true,
			PackageBoqHeaderFk: true,
			BoqWicCatFk: true,
			BoqItemFk: true,
			ConHeaderFk: true,
			ConBoqHeaderFk: true,
		};
		const copyType = info.item?.CopyType;
		switch (copyType) {
			case MasterRestrictionType.wicBoq:
				fieldReadonlyStatus.MdcMaterialCatalogFk = true;
				fieldReadonlyStatus.PrjProjectFk = true;
				fieldReadonlyStatus.PrjBoqFk = true;
				fieldReadonlyStatus.PrcPackageBoqFk = true;
				fieldReadonlyStatus.PackageBoqHeaderFk = true;
				fieldReadonlyStatus.BoqWicCatFk = false;
				fieldReadonlyStatus.BoqItemFk = false;
				fieldReadonlyStatus.ConHeaderFk = true;
				fieldReadonlyStatus.ConBoqHeaderFk = true;
				break;
			case MasterRestrictionType.prjBoq:
				fieldReadonlyStatus.MdcMaterialCatalogFk = true;
				fieldReadonlyStatus.PrjProjectFk = false;
				fieldReadonlyStatus.PrjBoqFk = false;
				fieldReadonlyStatus.PrcPackageBoqFk = true;
				fieldReadonlyStatus.PackageBoqHeaderFk = true;
				fieldReadonlyStatus.BoqWicCatFk = true;
				fieldReadonlyStatus.BoqItemFk = true;
				fieldReadonlyStatus.ConHeaderFk = true;
				fieldReadonlyStatus.ConBoqHeaderFk = true;
				break;
			case MasterRestrictionType.packageBoq:
				fieldReadonlyStatus.MdcMaterialCatalogFk = true;
				fieldReadonlyStatus.PrjProjectFk = true;
				fieldReadonlyStatus.PrjBoqFk = true;
				fieldReadonlyStatus.PrcPackageBoqFk = false;
				fieldReadonlyStatus.PackageBoqHeaderFk = false;
				fieldReadonlyStatus.BoqWicCatFk = true;
				fieldReadonlyStatus.BoqItemFk = true;
				fieldReadonlyStatus.ConHeaderFk = true;
				fieldReadonlyStatus.ConBoqHeaderFk = true;
				break;
			case MasterRestrictionType.material:
				fieldReadonlyStatus.MdcMaterialCatalogFk = false;
				fieldReadonlyStatus.PrjProjectFk = true;
				fieldReadonlyStatus.PrjBoqFk = true;
				fieldReadonlyStatus.PrcPackageBoqFk = true;
				fieldReadonlyStatus.PackageBoqHeaderFk = true;
				fieldReadonlyStatus.BoqWicCatFk = true;
				fieldReadonlyStatus.BoqItemFk = true;
				fieldReadonlyStatus.ConHeaderFk = true;
				fieldReadonlyStatus.ConBoqHeaderFk = true;
				break;
			case MasterRestrictionType.contractBoq:
				fieldReadonlyStatus.MdcMaterialCatalogFk = true;
				fieldReadonlyStatus.PrjProjectFk = true;
				fieldReadonlyStatus.PrjBoqFk = true;
				fieldReadonlyStatus.PrcPackageBoqFk = true;
				fieldReadonlyStatus.PackageBoqHeaderFk = true;
				fieldReadonlyStatus.BoqWicCatFk = true;
				fieldReadonlyStatus.BoqItemFk = true;
				fieldReadonlyStatus.ConHeaderFk = false;
				fieldReadonlyStatus.ConBoqHeaderFk = !info.item?.ConHeaderFk;
				break;
			default:
				break;
		}

		return get(fieldReadonlyStatus, info.field) as boolean;
	}
}