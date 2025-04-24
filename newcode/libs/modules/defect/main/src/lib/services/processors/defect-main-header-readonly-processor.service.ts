/*
 * Copyright(c) RIB Software GmbH
 */
import { DefectMainHeaderDataService } from '../defect-main-header-data.service';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { BasicsSharedDefectStatusLookupService, BasicsSharedNumberGenerationService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { inject } from '@angular/core';

/**
 * Defect entity readonly processor
 */
export class DefectMainHeaderReadonlyProcessorService extends EntityReadonlyProcessorBase<IDfmDefectEntity> {
	private readonly defectStatusLookupSvc = inject(BasicsSharedDefectStatusLookupService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);

	/**
	 *The constructor
	 */
	public constructor(protected dataService: DefectMainHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IDfmDefectEntity> {
		return {
			ObjectSetKey: {
				shared: ['DfmDefectFk', 'PrjLocationFk', 'PsdScheduleFk', 'MdcControllingunitFk'],
				readonly: this.readonlyObjectSetKey,
			},
			Isexternal: {
				shared: ['BasClerkRespFk', 'DateRequired'],
				readonly: this.readonlyIsExternal,
			},
			PsdActivityFk: (info) => {
				return !info.item.PsdScheduleFk;
			},
			ConHeaderFk: (info) => {
				return !!info.item.OrdHeaderFk;
			},
			OrdHeaderFk: (info) => {
				return !!info.item.ConHeaderFk;
			},
			BpdBusinesspartnerFk: (info) => {
				return !(info.item.Isexternal && !!info.item.IsEditableByStatus);
			},
			BpdSubsidiaryFk: (info) => {
				return !(info.item.Isexternal && !!info.item.BpdBusinesspartnerFk && !!info.item.IsEditableByStatus);
			},
			BpdContactFk: (info) => {
				return !(info.item.Isexternal && !!info.item.IsEditableByStatus);
			},
			Code: (info) => {
				const hasToGenerateCode = this.hasToGenerateCode(info.item);
				return info.item.Version === 0 && hasToGenerateCode;
			},
		};
	}

	protected readonlyObjectSetKey(info: ReadonlyInfo<IDfmDefectEntity>) {
		return !info.item.PrjProjectFk;
	}

	protected readonlyIsExternal(info: ReadonlyInfo<IDfmDefectEntity>) {
		return !info.item.IsEditableByStatus;
	}

	protected override readonlyEntity(item: IDfmDefectEntity): boolean {
		return this.getItemStatus(item);
	}

	private getItemStatus(item: IDfmDefectEntity): boolean {
		let isReadOnly: boolean = true;
		if (item) {
			const dfmStatus = this.defectStatusLookupSvc.cache.getItem({ id: item.DfmStatusFk });
			if (dfmStatus) {
				isReadOnly = dfmStatus.IsReadOnly;
			}
		}

		return isReadOnly;
	}

	private hasToGenerateCode(item: IDfmDefectEntity) {
		return this.genNumberSvc.hasNumberGenerateConfig(item.RubricCategoryFk);
	}
}
