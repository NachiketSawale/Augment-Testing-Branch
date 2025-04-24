import { IBasicsSharedGenerationSettingEntity } from './model/basics-shared-generation-setting-entity.interface';
import { PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { unionBy } from 'lodash';

/**
 * Generate number data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedNumberGenerationService {
	private readonly configService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);
	private numberConfigs: IBasicsSharedGenerationSettingEntity[] = [];

	private getSetting(rubricCateId?: number, rubricIndex?: number) {
		return this.numberConfigs.find((c) => c.RubricCatID === rubricCateId && (!rubricIndex || c.NumberIndex === rubricIndex));
	}

	/**
	 * check need to generate code
	 * @param rubricCateId
	 * @param rubricIndex
	 */
	public hasNumberGenerateConfig(rubricCateId?: number, rubricIndex?: number): boolean {
		const settingDto = this.getSetting(rubricCateId, rubricIndex);
		return settingDto?.HasToCreate ?? false;
	}

	public provideNumberDefaultText(rubricCateId: number, rubricIndex?: number): string {
		return this.hasNumberGenerateConfig(rubricCateId, rubricIndex) ? this.translationService.instant({ key: 'cloud.common.isGenerated' }).text : '';
	}

	/**
	 * load the number generate configure with the given url
	 * @param url url to load the number generate configure.
	 */
	public async getNumberGenerateConfig(url: string) {
		const res = await firstValueFrom(this.http.get<IBasicsSharedGenerationSettingEntity[]>(this.configService.webApiBaseUrl + url));
		this.numberConfigs = unionBy(this.numberConfigs, res, i => i.RubricCatID);
	}
}
