import { inject, Injectable } from '@angular/core';
import { ProcurementCommonTotalDataService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IPrcCommonTotalEntity, IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPrcPackageTotalEntity } from '../model/entities/procurement-package-total-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageTotalDataService extends ProcurementCommonTotalDataService<IPrcPackageTotalEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	protected internalModuleName = ProcurementInternalModule.Package;

	private getSameTotalsFromPackagesCache = new Map<string, IPrcPackageTotalEntity[]>();

	public constructor() {
		const packageDataService = inject(ProcurementPackageHeaderDataService);

		super(packageDataService, {
			apiUrl: 'procurement/package/total',
			isPackage: true,
		});

		packageDataService.RootDataCreated$.subscribe((dataTotals) => {
			if (dataTotals && dataTotals.PrcTotalsDto) {
				this.createdTotals = dataTotals.PrcTotalsDto;
			}
		});
	}

	public getExchangeRate(): number {
		const dataParent = this.parentService.getSelectedEntity();
		if (dataParent) {
			return dataParent.ExchangeRate;
		}
		return 0;
	}

	public override isParentFn(parentKey: IPrcPackageEntity, entity: IPrcCommonTotalEntity): boolean {
		return entity.HeaderFk === parentKey.Id;
	}

	public async getSameTotalsFromPackages(ids: number[]) {
		const idStr = ids.join(',');
		if (this.getSameTotalsFromPackagesCache.has(idStr)) {
			return this.getSameTotalsFromPackagesCache.get(idStr);
		}
		const res = await this.http.post<IPrcPackageTotalEntity[]>('procurement/package/total/getsametotalsfrompackages', ids);
		this.getSameTotalsFromPackagesCache.set(idStr, res);
		return res;
	}
}
