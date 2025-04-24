import { of } from 'rxjs';
import { BasicsSharedImportExcelProfileService } from '../services/basics-shared-import-excel-profile.service';
import { BasicsSharedImportProfileLookup } from '../models/types/basics-shared-import-profile-lookup.type';
import { BasicsSharedStringInputLookupService } from '../../lookup-helper/basics-shared-string-input-lookup.service';

export class BasicsSharedImportExcelProfileLookupService<TCustom extends object> extends BasicsSharedStringInputLookupService<BasicsSharedImportProfileLookup> {
	public constructor(private readonly importProfileService: BasicsSharedImportExcelProfileService<TCustom>) {
		super({
			uuid: 'f1661fdf78688a65b8fcf5c3b695e0ed',
			valueMember: 'ProfileName',
			displayMember: 'ProfileName',
		});
	}

	public override getList() {
		return of(this.importProfileService.getListForLookup());
	}
}
