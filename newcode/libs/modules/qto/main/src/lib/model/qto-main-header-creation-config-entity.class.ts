export class QtoMainHeaderCreationConfigEntity{
	public HasCodeGenerated : boolean = false;
	public DefaultQtoPurposeType ?: { Id : number };
	public QtoTypeFk : number = 0;
	public BasRubricCategoryFk : number = 0;
	public BasGoniometerTypeFk ?: number;
	public ProjectFk: number = 0;
	public ClerkFk: number = 0;
}