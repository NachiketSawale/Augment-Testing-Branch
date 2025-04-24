import {RubricCateGenCodeSettingDto} from '@libs/procurement/common';
import {PlatformConfigurationService} from '@libs/platform/common';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';


/**
 * Generate number data service
 */
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerCommonNumberGenerationService{
	private configService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);
	private numberConfigs: RubricCateGenCodeSettingDto[] = [];
	/**
	 * load settings
	 * @param subModuleName
	 */
	public loadSetting(subModuleName: string) {
		return this.http.get<RubricCateGenCodeSettingDto[]>(this.configService.webApiBaseUrl + 'businesspartner/main/' + subModuleName + '/numberlist');
	}
	/**
	 * check need to generate code
	 * @param rubricCateId
	 */
	public hasToGenerateForRubricCategory(rubricCateId?: number | null): boolean{
		const settingDto = this.numberConfigs.find(c => c.RubricCatID === rubricCateId);
		return settingDto !== undefined && settingDto.CanCreate && settingDto.HasToCreate;
	}

	public provideNumberDefaultText(rubricCateId: number):string{
		const settingDto = this.numberConfigs.find(c => c.RubricCatID === rubricCateId);
		return settingDto !== undefined && settingDto.HasToCreate? 'IsGenerated' : '';
	}

	public async assertLoaded(subModuleName: string){
		this.loadSetting(subModuleName).subscribe((response) => {
			this.numberConfigs = response;
		});
	}
	public getNumberConfigs() {
		return this.numberConfigs;
	}
	// region  new
	public hasToGenerateForRubricCategoryNew(subModuleRubricCateGenCodeSetting:RubricCateGenCodeSettingDto[],rubricCateId: number): boolean{
		const settingDto = subModuleRubricCateGenCodeSetting.find(c => c.RubricCatID === rubricCateId);
		if (settingDto !== undefined && settingDto.CanCreate && settingDto.HasToCreate) {
			return true;
		}
		return false;
	}
	public async  loadRubricCateGenCodeSetting(subModuleName: string) :Promise<RubricCateGenCodeSettingDto[]>{
		const data= await lastValueFrom(this.http.get<RubricCateGenCodeSettingDto[]>(this.configService.webApiBaseUrl + 'businesspartner/main/' + subModuleName + '/numberlist'));
		return data;
	}
	public async hasToGenerateForRubricCategoryComplete(subModuleName: string,rubricCateId: number): Promise<boolean>{
		const data= await lastValueFrom(this.http.get<RubricCateGenCodeSettingDto[]>(this.configService.webApiBaseUrl + 'businesspartner/main/' + subModuleName + '/numberlist'));
		if (data){
			const settingDto = data.find(c => c.RubricCatID ===rubricCateId);
			if (settingDto !== undefined && settingDto.CanCreate && settingDto.HasToCreate) {
				return true;
			}
		}
		return false;
	}
	// endregion

}