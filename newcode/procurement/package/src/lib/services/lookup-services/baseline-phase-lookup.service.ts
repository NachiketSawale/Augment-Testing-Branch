import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupItemsDataService} from '@libs/ui/common';
import {PlatformTranslateService} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageBaselinePhaseLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(0, translateService.instant('procurement.package.baselinePhaseValues.inquiry').text),
			new LookupSimpleEntity(1, translateService.instant('procurement.package.baselinePhaseValues.award').text),
			new LookupSimpleEntity(2, translateService.instant('procurement.package.baselinePhaseValues.contract').text)
		];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}
}