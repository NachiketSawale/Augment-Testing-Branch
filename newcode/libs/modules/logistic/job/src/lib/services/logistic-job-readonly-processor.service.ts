import { Injectable } from '@angular/core';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { IJobEntity } from '@libs/logistic/interfaces';
import { LogisticJobDataService } from './logistic-job-data.service';

@Injectable({
	providedIn: 'root'
})

export class LogisticJobReadonlyProcessorService<T extends IJobEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: LogisticJobDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T){
		this.handleReadOnly(item);
	}

	protected handleReadOnly(info: T) {
		const readOnlyStatus = false;
		if (!readOnlyStatus) {
			this.dataService.setEntityReadOnly(info,true);
		} else {
			const readOnlyFields: IReadOnlyField<T>[] = [
				{ field: 'CompanyFk', readOnly: true },
				{ field: 'RubricCategoryFk', readOnly: true },
				{ field: 'DivisionFk', readOnly: true },
				{ field: 'ProjectFk', readOnly: info.Version !== undefined && info.Version > 0 },
				{ field: 'EtmPlantComponentFk', readOnly: info.PlantFk === 0 },
				{ field: 'BillingJobFk', readOnly: !info.IsJointVenture },
				{ field: 'HasLoadingCost', readOnly: !info.IsLoadingCostForBillingType }
			];
			if(info.Version !== undefined && info.Version >= 1){
				readOnlyFields.push({field: 'JobTypeFk', readOnly: true});
			}
			//TODO: basicsCompanyNumberGenerationInfoService
			/*if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticJobNumberInfoService').hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
				item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticJobNumberInfoService').provideNumberDefaultText(item.RubricCategoryFk, item.Code);
				fields.push({field: 'Code', readonly: true});
			}*/

			//TODO: platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('Logistic.Job', 'Job', fields);

			this.dataService.setEntityReadOnlyFields(info,readOnlyFields);
		}
		return readOnlyStatus;
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}