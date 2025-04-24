import { IDescriptionInfo } from '@libs/platform/common';

export class QtoTypeEntity{
	public Id : number = 0;
	public BasGoniometerTypeFk : number = 0;
	public BasRubricCategoryFk : number = 0;
	public DescriptionInfo ?: IDescriptionInfo;
}