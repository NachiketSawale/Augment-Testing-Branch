import {Injectable} from '@angular/core';
import {LookupSimpleEntity, UiCommonLookupItemsDataService} from '@libs/ui/common';
import {PlatformTranslateService} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsGeneralsValueTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(0, translateService.instant('cloud.common.entityAmount').text),
			new LookupSimpleEntity(1, translateService.instant('cloud.common.entityPercent').text),
		];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}
}