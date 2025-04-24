/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsEfbsheetsDataService } from './basics-efbsheets-data.service';
import { BasicsEfbsheetsAverageWageDataService } from './basics-efbsheets-average-wage-data.service';
import { Injectable, Injector, inject } from '@angular/core';
import { BasicsEfbSheetsWageGroupLookupService } from '../basics-efbsheets-lookup/basics-efb-sheets-wage-group-lookup.service';
import { BasicsEfbSheetsSurchargeLookupService } from '../basics-efbsheets-lookup/basics-efb-sheets-surcharge-lookup-data.service';
import { BasicsEfbsheetsCrewMixAfDataService } from './basics-efbsheets-crew-mix-af-data.service';
import { BasicsEfbSheetsAdditionalCostLookupService } from '../basics-efbsheets-lookup/basics-efb-sheets-additional-cost-lookup-data.service';
import { BasicsEfbsheetsCrewMixAfsnDataService } from './basics-efbsheets-crew-mix-afsn-data.service';
import { BasicsEfbsheetsCrewMixCostCodeDataService } from './basics-efbsheets-crew-mix-cost-code-data.service';
import { BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN, childType, IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsCommonService, IBasicsEfbsheetsEntity, ICostCodeEntity, IEstCrewMixAfEntity, IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';
import { LazyInjectable, PlatformLazyInjectorService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IBasicsEfbsheetsCommonService>({
	token: BASICS_EFBSHEETS_COMMON_SERVICE_TOKEN,
	useAngularInjection: true,
})
export class BasicsEfbsheetsCommonService implements IBasicsEfbsheetsCommonService {
	private basicsEfbsheetsAverageWageDataService = inject(BasicsEfbsheetsAverageWageDataService);
	private basicsEfbSheetsWageGroupLookupService = inject(BasicsEfbSheetsWageGroupLookupService);
	private basicsEfbsheetsDataService = inject(BasicsEfbsheetsDataService);
	private basicsEfbSheetsSurchargeLookupService = inject(BasicsEfbSheetsSurchargeLookupService);
	private basicsEfbsheetsCrewMixAfDataService = inject(BasicsEfbsheetsCrewMixAfDataService);
	private basicsEfbSheetsAdditionalCostLookupService = inject(BasicsEfbSheetsAdditionalCostLookupService);
	private basicsEfbsheetsCrewMixAfsnService = inject(BasicsEfbsheetsCrewMixAfsnDataService);
	private basicsEfbsheetsCrewMixCostCodeDataService = inject(BasicsEfbsheetsCrewMixCostCodeDataService);
	private readonly injector = inject(Injector);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public calculateCrewmixesAndChilds(crewMixItem: IBasicsEfbsheetsEntity, childtype: childType): void {
		if (!crewMixItem) {
			return;
		}

		switch (childtype) {
			case childType.AverageWage:
				this.calculateBasedOnAverageWage(crewMixItem);
				break;
			case childType.CrewmixAF:
				this.calculateBasedOnCrewMixAF(crewMixItem);
				break;
			case childType.CrewmixAFSN:
				this.calculateBasedOnCrewMixAFSN(crewMixItem);
				break;
			case childType.CostCode:
				this.calculateBasedOnCrewmixCostCode(crewMixItem);
				break;
		}
	}

	private calculateBasedOnAverageWage(crewMixItem: IBasicsEfbsheetsEntity): void {
		const basicsEfbsheetsAverageWageDataService = this.injector.get(BasicsEfbsheetsAverageWageDataService);
		let allAverageWages: IBasicsEfbsheetsAverageWageEntity[] = [];
		let wageGroupItems: IBasicsEfbsheetsAverageWageEntity[];
		const response = this.basicsEfbSheetsWageGroupLookupService.getList();
		response.subscribe((values: IBasicsEfbsheetsAverageWageEntity[]) => {
			wageGroupItems = values;
		});

		if (crewMixItem.ProjectFk) {
			//allAverageWages =    ToDo : basicsEfbsheetsProjectAverageWageService is implemented    // Circular dependancy IprojectEntity need to shift common
		} else {
			allAverageWages = basicsEfbsheetsAverageWageDataService.getList();
		}

		allAverageWages.forEach((averageWageItem) => {
			wageGroupItems.filter((x) => x.Id === averageWageItem.MdcWageGroupFk);
			if (wageGroupItems && (averageWageItem.Count ?? 0) > 0) {
				if (!averageWageItem.Supervisory) {
					crewMixItem.CrewSize = (crewMixItem.CrewSize ?? 0) + (averageWageItem.Count ?? 0);
				}
				crewMixItem.CrewAverage = (crewMixItem.CrewAverage ?? 0) + (wageGroupItems[0]?.MarkupRate ?? 1) * (averageWageItem.Count ?? 1); // += acept current value
			}
		});

		if ((crewMixItem.CrewSize ?? 1) > 0) {
			crewMixItem.CrewAverage = (crewMixItem.CrewAverage ?? 1) / (crewMixItem.CrewSize ?? 1);
		}

		crewMixItem.WageIncrease1 = crewMixItem.WageIncrease1 ? crewMixItem.WageIncrease1 : 0;
		crewMixItem.WageIncrease2 = crewMixItem.WageIncrease2 ? crewMixItem.WageIncrease2 : 0;

		crewMixItem.WageIncrease1 = ((crewMixItem.CrewAverage ?? 1) / 100) * crewMixItem.WageIncrease1;
		crewMixItem.WageIncrease2 = ((crewMixItem.CrewAverage ?? 1) / 100) * crewMixItem.WageIncrease2;

		crewMixItem.ExtraPay = crewMixItem.ExtraPay ? crewMixItem.ExtraPay : 0;
		crewMixItem.AverageStandardWage = (crewMixItem.CrewAverage ?? 0) + crewMixItem.WageIncrease1 + crewMixItem.WageIncrease2 + crewMixItem.ExtraPay;
	}

	private calculateBasedOnCrewMixAF(crewMixItem: IBasicsEfbsheetsEntity): void {
		let allCrewmixAfs: IEstCrewMixAfEntity[] = [];
		let totalRateHour: number = 0,
			masterSurchargeItems: IBasicsEfbsheetsAverageWageEntity[];
		let surchargeItems: IBasicsEfbsheetsAverageWageEntity[];
		const response = this.basicsEfbSheetsSurchargeLookupService.getList();
		response.subscribe((values: IBasicsEfbsheetsAverageWageEntity[]) => {
			surchargeItems = [...values];
		});

		if (crewMixItem.ProjectFk) {
			// TODO allCrewmixAfs = basicsEfbsheetsProjectCrewMixAfService.getList();
		} else {
			allCrewmixAfs = this.basicsEfbsheetsCrewMixAfDataService.getList();
		}

		allCrewmixAfs.forEach((crewmixAfItem) => {
			if (crewmixAfItem && crewmixAfItem.MdcWageGroupFk) {
				masterSurchargeItems = surchargeItems.filter((x) => x.Id === crewmixAfItem.MdcWageGroupFk);
				if (masterSurchargeItems[0] && masterSurchargeItems[0].MarkupRate && crewmixAfItem.PercentHour) {
					crewmixAfItem.RateHour = ((crewMixItem.AverageStandardWage ?? 0) * masterSurchargeItems[0].MarkupRate * crewmixAfItem.PercentHour) / 10000;
					totalRateHour += crewmixAfItem.RateHour;
				}
			}
		});
		crewMixItem.TotalSurcharge = totalRateHour ? totalRateHour : 0;
		crewMixItem.CrewMixAf = (crewMixItem.AverageStandardWage ?? 0) + crewMixItem.TotalSurcharge;
	}

	private calculateBasedOnCrewMixAFSN(crewMixItem: IBasicsEfbsheetsEntity): void {
		let allCrewmixAfsns: IEstCrewMixAfsnEntity[] = [];
		let totalRateHour = 0,
			masterAdditionalCostItems: IBasicsEfbsheetsAverageWageEntity[];
		let additionalCostItems: IBasicsEfbsheetsAverageWageEntity[];
		const response = this.basicsEfbSheetsAdditionalCostLookupService.getList();
		response.subscribe((values: IBasicsEfbsheetsAverageWageEntity[]) => {
			additionalCostItems = [...values];
		});

		if (crewMixItem.ProjectFk) {
			// TODO allCrewmixAfsns = basicsEfbsheetsProjectCrewMixAfsnService.getList();    // Circular dependancy IprojectEntity need to shift common
		} else {
			allCrewmixAfsns = this.basicsEfbsheetsCrewMixAfsnService.getList();
		}

		allCrewmixAfsns.forEach((crewmixAfsnItem) => {
			if (crewmixAfsnItem && crewmixAfsnItem.MdcWageGroupFk) {
				masterAdditionalCostItems = additionalCostItems.filter((x) => x.Id === crewmixAfsnItem.MdcWageGroupFk);
				if (masterAdditionalCostItems[0] && masterAdditionalCostItems[0].MarkupRate && crewMixItem.CrewMixAf) {
					crewmixAfsnItem.RateHour = (crewMixItem.CrewMixAf * masterAdditionalCostItems[0].MarkupRate) / 100;
					totalRateHour += crewmixAfsnItem.RateHour;
				}
			}
		});
		crewMixItem.TotalExtraCost = totalRateHour ? totalRateHour : 0;
		crewMixItem.CrewMixAfsn = (crewMixItem.CrewMixAf ?? 0) + crewMixItem.TotalExtraCost;
	}

	private calculateBasedOnCrewmixCostCode(crewMixItem: IBasicsEfbsheetsEntity): void {
		if (crewMixItem.ProjectFk) {
			// this.injector.get(ProjectEfbsheetsCrewMixCostCodeDataService).setModified(crewMixItem); // Circular dependancy IprojectEntity need to shift common
		} else {
			this.basicsEfbsheetsDataService.setModified(crewMixItem);
		}
	}

	public setSelectedLookupItem<T extends { MdcCostCodeFk?: number, Rate?: number }>(lookupItem:ICostCodeEntity, isProject: boolean, entities: T[]): void {
		let selectedEntity: T | null = null;

		if (lookupItem) {
			if (isProject) {
				if (entities.length > 0) {
					selectedEntity = entities[0];
					selectedEntity.MdcCostCodeFk = lookupItem.OriginalId ?? lookupItem.Id;
					selectedEntity.Rate = lookupItem.Rate ?? undefined;
				}
			} else {
				selectedEntity = entities[0];
				const selectedCrewMix2CostCodeItem = this.basicsEfbsheetsCrewMixCostCodeDataService.getSelectedEntity();
				if (selectedCrewMix2CostCodeItem) {
					selectedEntity.MdcCostCodeFk = lookupItem.Id;
					selectedCrewMix2CostCodeItem.Rate = lookupItem.Rate;
				}
				
			}
		}
	}
}
