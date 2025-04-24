import { CompleteIdentification } from '@libs/platform/common';
import {
	IBusinessYearNPeriodEntity, ICompany2BasClerkEntity, ICompany2ClerkEntity,
	ICompany2CostCodeEntity,
	ICompany2PrjGroupEntity,
	ICompany2TextModuleEntity, ICompanyControllingGroupEntity,
	ICompanyCreditorEntity, ICompanyDebtorEntity, ICompanyDeferaltypeEntity, ICompanyEntity, ICompanyICCuEntity, ICompanyICPartnerAccEntity, ICompanyICPartnerEntity, ICompanyNumberEntity, ICompanyRoleBas2FrmEntity,
	ICompanyUrlEntity, IRubricCategory2CompanyEntity, IStockEvaluationRule4CompEntity, ITimekeepingGroupEntity, ITrsConfigEntity } from '@libs/basics/interfaces';

export class BasicsCompanyComplete implements CompleteIdentification<ICompanyEntity>{
	public Id:number = 0;
	public MainItemId: number=0;
	public Companies: ICompanyEntity[] | null = [];
	public ClerkToSave:ICompany2ClerkEntity[]|null =[];
	public ClerkToDelete:ICompany2ClerkEntity[]|null =[];
	public BasClerkToSave:ICompany2BasClerkEntity[]|null =[];
	public BasClerkToDelete:ICompany2BasClerkEntity[]|null =[];
	public CategoryToDelete?: IRubricCategory2CompanyEntity[] | null =[];
	public CategoryToSave?: IRubricCategory2CompanyEntity[] | null = [];
	public Company?: ICompanyEntity | null;
	public CompanyControllingGroupToDelete?: ICompanyControllingGroupEntity[] | null=[];
	public CompanyControllingGroupToSave?: ICompanyControllingGroupEntity[] | null=[];
	public CompanyICPartnerAccToDelete?: ICompanyICPartnerAccEntity[] | null =[];
	public CompanyICPartnerAccToSave?: ICompanyICPartnerAccEntity[] | null=[];
	public CompanyICPartnerToDelete?: ICompanyICPartnerEntity[] | null=[];
	public CompanyICPartnerToSave?: ICompanyICPartnerEntity[] | null;
	public CompanyNumberToDelete?: ICompanyNumberEntity[] | null=[];
	public CompanyNumberToSave?: ICompanyNumberEntity[] | null=[];
	public CreateRoleToDelete?: ICompanyRoleBas2FrmEntity[] | null=[];
	public CreateRoleToSave?: ICompanyRoleBas2FrmEntity[] | null=[];
	public CreditorsToDelete?: ICompanyCreditorEntity[] | null=[];
	public CreditorsToSave?: ICompanyCreditorEntity[] | null=[];
	public DebtorsToDelete?: ICompanyDebtorEntity[] | null=[];
	public DebtorsToSave?: ICompanyDebtorEntity[] | null=[];
	public DeferaltypeToDelete?: ICompanyDeferaltypeEntity[] | null=[];
	public DeferaltypeToSave?: ICompanyDeferaltypeEntity[] | null=[];
	public EntitiesCount?: number | null;
	public ICControllingUnitsToDelete?: ICompanyICCuEntity[] | null=[];
	public ICControllingUnitsToSave?: ICompanyICCuEntity[] | null=[];
	public StockEvaluationRule4CompToDelete?: IStockEvaluationRule4CompEntity[] | null=[];
	public StockEvaluationRule4CompToSave?: IStockEvaluationRule4CompEntity[] | null=[];
	public SurchargeToDelete?: ICompany2CostCodeEntity[] | null=[];
	public SurchargeToSave?: ICompany2CostCodeEntity[] | null=[];
	public TextModuleToDelete?: ICompany2TextModuleEntity[] | null=[];
	public TextModuleToSave?: ICompany2TextModuleEntity[] | null=[];
	public TimekeepingGroupsToDelete?: ITimekeepingGroupEntity[] | null=[];
	public TimekeepingGroupsToSave?: ITimekeepingGroupEntity[] | null=[];
	public TrsConfigToDelete?: ITrsConfigEntity[] | null=[];
	public TrsConfigToSave?: ITrsConfigEntity[] | null=[];
	public UrlToDelete?: ICompanyUrlEntity[] | null=[];
	public UrlToSave?: ICompanyUrlEntity[] | null=[];
	public UtilisableGroupToDelete?: ICompany2PrjGroupEntity[] | null=[];
	public UtilisableGroupToSave?: ICompany2PrjGroupEntity[] | null=[];
	public YearToDelete?: IBusinessYearNPeriodEntity[];
	public YearToSave?: IBusinessYearNPeriodEntity[];

}
