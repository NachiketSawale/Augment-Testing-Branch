import { LookupSimpleEntity } from '@libs/ui/common';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ProfileContext } from '../../model/enums/profile-context.enums';

export class BasicsSharedImportExcelFormatService {
	private validExcelProfileContexts = ['General'];
	private readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);

	private readonly allExcelProfileContexts: (LookupSimpleEntity & { code: string })[] = [
		{ id: ProfileContext.FreeExcel, code: 'General', desc: this.translateService.instant('basics.export.excelProfileContextFree').text },
		{ id: ProfileContext.BoqBidder, code: 'BoqBidder', desc: this.translateService.instant('basics.export.excelProfileContextBidder').text },
		{ id: ProfileContext.BoqPlanner, code: 'BoqPlanner', desc: this.translateService.instant('basics.export.excelProfileContextPlanner').text },
		{ id: ProfileContext.MatBidder, code: 'MatBidder', desc: this.translateService.instant('basics.export.excelProfileContextMaterial').text },
		{ id: ProfileContext.BoqPes, code: 'BoqPes', desc: this.translateService.instant('basics.export.excelProfileContextPes').text },
	];

	public addValidExcelProfileContexts(validExcelProfileContextsParam?: string[]) {
		if (validExcelProfileContextsParam) {
			this.validExcelProfileContexts = this.validExcelProfileContexts.concat(validExcelProfileContextsParam);
		}
	}

	public getList() {
		return this.allExcelProfileContexts.filter((epc) => {
			return this.validExcelProfileContexts.includes(epc.code);
		});
	}

	public isFixedRibFormat(id: ProfileContext) {
		return id !== ProfileContext.FreeExcel;
	}
}
