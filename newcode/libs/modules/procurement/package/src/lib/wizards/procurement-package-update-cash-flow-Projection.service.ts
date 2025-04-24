import { inject, Injectable } from '@angular/core';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { StandardDialogButtonId } from '@libs/ui/common';
import { BasicsSharedProcurementConfigurationLookupService, BasicsSharedProcurementStructureLookupService, BasicsSharedSCurveLookupService, BasicsSharedUpdateCashFlowProjectionService, BasicsSharePrcConfigTotalKindsEnum } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { isString } from 'lodash';
import { PrcSharedTotalTypeLookupService } from '@libs/procurement/shared';
import { PackageTotalLookupService } from '../services/lookup-services/package-total-lookup.service';
import { ProcurementPackageTotalDataService } from '../services/package-total-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageUpdateCashFlowProjectionService extends ProcurementCommonWizardBaseService<IPrcPackageEntity, PrcPackageCompleteEntity, object> {
	private readonly curveLookupService = inject(BasicsSharedSCurveLookupService);
	private readonly prcStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly prcConfigLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly prcTotalTypeLookupService = inject(PrcSharedTotalTypeLookupService);
	private readonly updateCashFlowProjectionService = inject(BasicsSharedUpdateCashFlowProjectionService);
	private readonly packageTotalLookupService = inject(PackageTotalLookupService);
	private readonly packageTotalDataService = inject(ProcurementPackageTotalDataService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
		});
	}

	protected override async showWizardDialog() {
		const header = this.config.rootDataService.getSelectedEntity();
		if (!header) {
			console.log('please select an header item');
			return;
		}

		const cashProjectionFk = header.CashProjectionFk;
		const structureFk = header.StructureFk;
		const scurveFk = await this.getScurveFkByStructureFk(structureFk); // Scurve
		let scurveTotalTypeCode: string | null = null;
		if (scurveFk) {
			const scurveItem = await firstValueFrom(this.curveLookupService.getItemByKey({ id: scurveFk }));
			if (scurveItem) {
				scurveTotalTypeCode = scurveItem.Totaltype;
			}
		}

		const startDate = header.ActualStart || header.PlannedStart || null;
		const endDate = header.ActualEnd || header.PlannedEnd || null;
		if (!scurveTotalTypeCode) {
			scurveTotalTypeCode = await this.getTotalTypeCodeByConfiguration(header.ConfigurationFk);
		}
		const totalCost = this.getTotalCost(scurveTotalTypeCode);

		const modalOptions = {
			defaultValue: {
				CashProjectionFk: cashProjectionFk,
				ScurveFk: scurveFk,
				TotalCost: totalCost,
				StartWork: startDate,
				EndWork: endDate,
			},
			totalsLookupService: this.packageTotalLookupService,
		};

		const result = await this.updateCashFlowProjectionService.showDialog(modalOptions);

		if (result && header.CashProjectionFk) {
			header.CashProjectionFk = result.CashProjectionFk;
			this.config.rootDataService.setModified(header);
			this.config.rootDataService.update(header).then();
		}

		return { closingButtonId: StandardDialogButtonId.Ok };
	}

	protected override async doExecuteWizard(opt?: object, bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok) {
		return true;
	}

	private async getScurveFkByStructureFk(structureFk?: number): Promise<number | null> {
		if (!structureFk) {
			return null;
		}
		const structure = await firstValueFrom(this.prcStructureLookupService.getItemByKey({ id: structureFk }));
		if (structure) {
			return structure.ScurveFk;
		}
		return null;
	}

	private getTotalCost(scurveTotalTypeCode: string | null) {
		if (!scurveTotalTypeCode || !isString(scurveTotalTypeCode)) {
			return 0;
		}

		const totalList = this.packageTotalDataService.getList();
		const totalItem = totalList.filter((totalItem) => {
			// TODO: getTotalType should work after packageTotalDataService is completed.
			const type = this.packageTotalDataService.getTotalType(totalItem);
			return type && type.Code === scurveTotalTypeCode;
		});
		if (totalItem && totalItem[0]) {
			return totalItem[0].ValueNetOc || 0;
		}
		return 0;
	}

	private async getTotalTypeCodeByConfiguration(configurationFk?: number) {
		if (!configurationFk) {
			return null;
		}

		let totalTypeCode: string | null = null;
		const config = await firstValueFrom(this.prcConfigLookupService.getItemByKey({ id: configurationFk }));
		if (config) {
			const configHeaderFk = config.PrcConfigHeaderFk,
				netTotal = BasicsSharePrcConfigTotalKindsEnum.NetTotal;
			const totalType = (await firstValueFrom(this.prcTotalTypeLookupService.getList())).find((item) => item.PrcTotalKindFk === netTotal && item.PrcConfigHeaderFk === configHeaderFk);

			if (totalType) {
				totalTypeCode = totalType.Code;
			}
		}

		return totalTypeCode;
	}
}
