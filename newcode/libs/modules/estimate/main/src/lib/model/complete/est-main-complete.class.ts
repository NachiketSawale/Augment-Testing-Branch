// /*
//  * $Id$
//  * Copyright(c) RIB Software GmbH
//  */

// import { IEstAllowanceAreaEntity } from './entities/est-allowance-area-entity.interface';
// import { EstAllowanceAreaComplete } from './est-allowance-area-complete.class';
// import { IEstAllMarkup2costcodeEntity } from './entities/est-all-markup-2costcode-entity.interface';
// import { IEstAllArea2GcAreaValueEntity } from './entities/est-all-area-2gc-area-value-entity.interface';
// import { IEstLineItemEntity } from './entities/est-line-item-entity.interface';
// import { IEstLineItem2MdlObjectEntity } from './entities/est-line-item-2mdl-object-entity.interface';
// import { EstLineItemParametersComplete } from './est-line-item-parameters-complete.class';
// import { IEstLineItemQuantityEntity } from './entities/est-line-item-quantity-entity.interface';
// import { IEstLineItemSelStatementEntity } from './entities/est-line-item-sel-statement-entity.interface';
// import { IEstResourceEntity } from './entities/est-resource-entity.interface';
// import { EstResourceComplete } from './est-resource-complete.class';
// import { IEstRuleExecutionResultEntity } from './entities/est-rule-execution-result-entity.interface';
// import { IEstAllowanceEntity } from './entities/est-allowance-entity.interface';
// import { IEstPriceAdjustmentItemDataEntity } from './entities/est-price-adjustment-item-data-entity.interface';
// import { IEstRiskRegisterEntity } from './entities/est-risk-register-entity.interface';
// import { EstRiskRegisterComplete } from './est-risk-register-complete.class';

// import { CompleteIdentification } from '@libs/platform/common';

// export class EstMainComplete implements CompleteIdentification</* TODO add respective entity type */>{

//  /*
//   * AllowanceAreaToDelete
//   */
//   public AllowanceAreaToDelete!: IEstAllowanceAreaEntity[] | null;

//  /*
//   * AllowanceAreaToSave
//   */
//   public AllowanceAreaToSave!: EstAllowanceAreaComplete[] | null;

//  /*
//   * AllowanceMarkUp2CostCodeToDelete
//   */
//   public AllowanceMarkUp2CostCodeToDelete!: IEstAllMarkup2costcodeEntity[] | null;

//  /*
//   * AllowanceMarkUp2CostCodeToSave
//   */
//   // public AllowanceMarkUp2CostCodeToSave!: IEstAllowanceMarkUp2CostCodeUpdateData[] | null;

//  /*
//   * Area2GcAreaValueToSave
//   */
//   public Area2GcAreaValueToSave!: IEstAllArea2GcAreaValueEntity[] | null;

//  /*
//   * AssemblyIds
//   */
//   public AssemblyIds!: number[] | null;

//  /*
//   * CalcObjectQty
//   */
//   public CalcObjectQty!: boolean | null;

//  /*
//   * CellChanges
//   */
//  // public CellChanges!: IEstLineItemCellChangeItem[] | null;

//  /*
//   * CombinedLineItems
//   */
//   public CombinedLineItems!: IEstLineItemEntity[] | null;

//  /*
//   * CombinedLineItemsToSave
//   */
//   public CombinedLineItemsToSave!: IEstLineItemEntity[] | null;

//  /*
//   * CombinedViewList
//   */
//   public CombinedViewList!: string[] | null;

//  /*
//   * ConsiderParamLevelFromSystemOption
//   */
//   public ConsiderParamLevelFromSystemOption!: boolean | null;

//  /*
//   * CopiedLineItems
//   */
//   public CopiedLineItems!: IEstLineItemEntity[] | null;

//  /*
//   * CopyAsRef
//   */
//   public CopyAsRef!: boolean | null;

//  /*
//   * CopyResourcesToLineItemIds
//   */
//   public CopyResourcesToLineItemIds!: number[] | null;

//  /*
//   * CostGroupToDelete
//   */
//   //public CostGroupToDelete!: IMainItem2CostGroupEntity[] | null;

//  /*
//   * CostGroupToSave
//   */
//  // public CostGroupToSave!: IMainItem2CostGroupEntity[] | null;

//  /*
//   * CurrentParameterEntities
//   */
//   //public CurrentParameterEntities!: IIEstimateRuleCommonParamEntity[] | null;

//  /*
//   * DataServName
//   */
//   public DataServName!: string | null;

//  /*
//   * DetailFormula
//   */
//   public DetailFormula!: string | null;

//  /*
//   * DetailFormulaField
//   */
//   public DetailFormulaField!: string | null;

//  /*
//   * DetailFormulaResult
//   */
//   public DetailFormulaResult!: number | null;

//  /*
//   * DetailFormulaWithBraces
//   */
//   public DetailFormulaWithBraces!: boolean | null;

//  /*
//   * DetailsFormulaParamSaveTo
//   */
//   public DetailsFormulaParamSaveTo!: string | null;

//  /*
//   * DoUpdate
//   */
//   public DoUpdate!: boolean | null;

//  /*
//   * EntitiesCount
//   */
//   public EntitiesCount!: number | null;

//  /*
//   * EstActivityParamToDelete
//   */
//  // public EstActivityParamToDelete!: IEstActivityParamEntity[] | null;

//  /*
//   * EstActivityParamToSave
//   */
//   //public EstActivityParamToSave!: IEstActivityParamEntity[] | null;

//  /*
//   * EstActivityRuleToDelete
//   */
//   //public EstActivityRuleToDelete!: IEstActivity2EstRuleEntity[] | null;

//  /*
//   * EstActivityRuleToSave
//   */
//  // public EstActivityRuleToSave!: IEstActivity2EstRuleEntity[] | null;

//  /*
//   * EstAssembliesCtrlGrpToDelete
//   */
//   //public EstAssembliesCtrlGrpToDelete!: IEstLineitem2CtrlGrpEntity[] | null;

//  /*
//   * EstAssembliesCtrlGrpToSave
//   */
//   //public EstAssembliesCtrlGrpToSave!: EstLineitem2CtrlGrpComplete[] | null;

//  /*
//   * EstAssemblyCat
//   */
//   //public EstAssemblyCat!: IEstAssemblyCatEntity | null;

//  /*
//   * EstAssemblyCatId
//   */
//   public EstAssemblyCatId!: number | null;

//  /*
//   * EstAssemblyCatParamToDelete
//   */
//  // public EstAssemblyCatParamToDelete!: IEstAssemblyParamEntity[] | null;

//  /*
//   * EstAssemblyCatParamToSave
//   */
//  //public EstAssemblyCatParamToSave!: IEstAssemblyParamEntity[] | null;

//  /*
//   * EstAssemblyCatRuleToDelete
//   */
//  // public EstAssemblyCatRuleToDelete!: IEstAssembly2EstRuleEntity[] | null;

//  /*
//   * EstAssemblyCatRuleToSave
//   */
//  // public EstAssemblyCatRuleToSave!: IEstAssembly2EstRuleEntity[] | null;

//  /*
//   * EstAssemblyWicItemToDelete
//   */
//   //public EstAssemblyWicItemToDelete!: IEstAssembly2WicItemCompositeEntity[] | null;

//  /*
//   * EstAssemblyWicItemToSave
//   */
//  // public EstAssemblyWicItemToSave!: EstAssembly2WicItemComplete[] | null;

//  /*
//   * EstBoqParamToDelete
//   */
// //  public EstBoqParamToDelete!: IEstBoqParamEntity[] | null;

//  /*
//   * EstBoqParamToSave
//   */
//   //public EstBoqParamToSave!: IEstBoqParamEntity[] | null;

//  /*
//   * EstBoqRuleToDelete
//   */
//   // public EstBoqRuleToDelete!: IEstBoq2EstRuleEntity[] | null;

//  /*
//   * EstBoqRuleToSave
//   */
//   // public EstBoqRuleToSave!: IEstBoq2EstRuleEntity[] | null;

//  /*
//   * EstCostGrpParamToDelete
//   */
//   // public EstCostGrpParamToDelete!: IEstCostGrpParamEntity[] | null;

//  /*
//   * EstCostGrpParamToSave
//   */
//   // public EstCostGrpParamToSave!: IEstCostGrpParamEntity[] | null;

//  /*
//   * EstCostGrpRuleToDelete
//   */
//   // public EstCostGrpRuleToDelete!: IEstCostGrpRuleEntity[] | null;

//  /*
//   * EstCostGrpRuleToSave
//   */
//   // public EstCostGrpRuleToSave!: IEstCostGrpRuleEntity[] | null;

//  /*
//   * EstCtuParamToDelete
//   */
//   // public EstCtuParamToDelete!: IEstCtuParamEntity[] | null;

//  /*
//   * EstCtuParamToSave
//   */
//   // public EstCtuParamToSave!: IEstCtuParamEntity[] | null;

//  /*
//   * EstCtuRuleToDelete
//   */
//   // public EstCtuRuleToDelete!: IEstCtu2EstRuleEntity[] | null;

//  /*
//   * EstCtuRuleToSave
//   */
//   // public EstCtuRuleToSave!: IEstCtu2EstRuleEntity[] | null;

//  /*
//   * EstHeaderId
//   */
//   public EstHeaderId!: number | null;

//  /*
//   * EstHeaderParamToDelete
//   */
//   // public EstHeaderParamToDelete!: IEstHeaderParamEntity[] | null;

//  /*
//   * EstHeaderParamToSave
//   */
//   // public EstHeaderParamToSave!: IEstHeaderParamEntity[] | null;

//  /*
//   * EstHeaderParameterEntities
//   */
//   // public EstHeaderParameterEntities!: IIEstimateRuleCommonParamEntity[] | null;

//  /*
//   * EstHeaderRuleToDelete
//   */
//   // public EstHeaderRuleToDelete!: IEstHeader2EstRuleEntity[] | null;

//  /*
//   * EstHeaderRuleToSave
//   */
//   // public EstHeaderRuleToSave!: IEstHeader2EstRuleEntity[] | null;

//  /*
//   * EstLeadingStuctEntities
//   */
//   // public EstLeadingStuctEntities!: IEstLeadingStructureContext[] | null;

//  /*
//   * EstLeadingStuctureContext
//   */
//   // public EstLeadingStuctureContext!: IEstLeadingStructureContext | null;

//  /*
//   * EstLineItem2CostGroups
//   */
//   // public EstLineItem2CostGroups!: IMainItem2CostGroupEntity[] | null;

//  /*
//   * EstLineItem2MdlObjectToDelete
//   */
//   public EstLineItem2MdlObjectToDelete!: IEstLineItem2MdlObjectEntity[] | null;

//  /*
//   * EstLineItem2MdlObjectToSave
//   */
//   public EstLineItem2MdlObjectToSave!: IEstLineItem2MdlObjectEntity[] | null;

//  /*
//   * EstLineItemParametersToSave
//   */
//   public EstLineItemParametersToSave!: EstLineItemParametersComplete[] | null;

//  /*
//   * EstLineItemQuantityToDelete
//   */
//   public EstLineItemQuantityToDelete!: IEstLineItemQuantityEntity[] | null;

//  /*
//   * EstLineItemQuantityToSave
//   */
//   public EstLineItemQuantityToSave!: IEstLineItemQuantityEntity[] | null;

//  /*
//   * EstLineItemSelStatements
//   */
//   public EstLineItemSelStatements!: IEstLineItemSelStatementEntity[] | null;

//  /*
//   * EstLineItemStatusList
//   */
//   public EstLineItemStatusList!: {[key: string]: boolean} | null;

//  /*
//   * EstLineItemToDelete
//   */
//   public EstLineItemToDelete!: IEstLineItemEntity[] | null;

//  /*
//   * EstLineItems
//   */
//   public EstLineItems!: IEstLineItemEntity[] | null;

//  /*
//   * EstLineItemsParamToDelete
//   */
//   // public EstLineItemsParamToDelete!: IEstLineItemParamEntity[] | null;

//  /*
//   * EstLineItemsParamToSave
//   */
//   // public EstLineItemsParamToSave!: IEstLineItemParamEntity[] | null;

//  /*
//   * EstLineItemsRuleToDelete
//   */
//   // public EstLineItemsRuleToDelete!: IEstLineItem2EstRuleEntity[] | null;

//  /*
//   * EstLineItemsRuleToSave
//   */
//   // public EstLineItemsRuleToSave!: IEstLineItem2EstRuleEntity[] | null;

//  /*
//   * EstLineItemsUpdatedByRule
//   */
//   public EstLineItemsUpdatedByRule!: IEstLineItemEntity[] | null;

//  /*
//   * EstParentResource
//   */
//   public EstParentResource!: IEstResourceEntity | null;

//  /*
//   * EstPrcStructureParamToDelete
//   */
//   // public EstPrcStructureParamToDelete!: IEstPrcStrucParamEntity[] | null;

//  /*
//   * EstPrcStructureParamToSave
//   */
//   // public EstPrcStructureParamToSave!: IEstPrcStrucParamEntity[] | null;

//  /*
//   * EstPrcStructureRuleToDelete
//   */
//   // public EstPrcStructureRuleToDelete!: IEstPrcStruc2EstRuleEntity[] | null;

//  /*
//   * EstPrcStructureRuleToSave
//   */
//   // public EstPrcStructureRuleToSave!: IEstPrcStruc2EstRuleEntity[] | null;

//  /*
//   * EstPrjLocationParamToDelete
//   */
//   // public EstPrjLocationParamToDelete!: IEstPrjLocParamEntity[] | null;

//  /*
//   * EstPrjLocationParamToSave
//   */
//   // public EstPrjLocationParamToSave!: IEstPrjLocParamEntity[] | null;

//  /*
//   * EstPrjLocationRuleToDelete
//   */
//   // public EstPrjLocationRuleToDelete!: IEstPrjLoc2EstRuleEntity[] | null;

//  /*
//   * EstPrjLocationRuleToSave
//   */
//   // public EstPrjLocationRuleToSave!: IEstPrjLoc2EstRuleEntity[] | null;

//  /*
//   * EstProjectParamToDelete
//   */
//   // public EstProjectParamToDelete!: IEstPrjParamEntity[] | null;

//  /*
//   * EstResourceToDelete
//   */
//   public EstResourceToDelete!: IEstResourceEntity[] | null;

//  /*
//   * EstResourceToSave
//   */
//   public EstResourceToSave!: EstResourceComplete[] | null;

//  /*
//   * EstResourcesAfterQNARuleExecuted
//   */
//   public EstResourcesAfterQNARuleExecuted!: IEstResourceEntity[] | null;

//  /*
//   * EstResourcesToCopy
//   */
//   public EstResourcesToCopy!: IEstResourceEntity[] | null;

//  /*
//   * EstRuleCompleteToSave
//   */
//   // public EstRuleCompleteToSave!: PrjEstRuleComplete[] | null;

//  /*
//   * EstRuleExecutionResults
//   */
//   public EstRuleExecutionResults!: IEstRuleExecutionResultEntity[] | null;

//  /*
//   * EstimateAllowanceToDelete
//   */
//   public EstimateAllowanceToDelete!: IEstAllowanceEntity[] | null;

//  /*
//   * EstimateAllowanceToSave
//   */
//   public EstimateAllowanceToSave!: IEstAllowanceEntity[] | null;

//  /*
//   * EstimateMainPrcItemAssignmentsToDelete
//   */
//   // public EstimateMainPrcItemAssignmentsToDelete!: IIIdentifyable[] | null;

//  /*
//   * EstimateMainPrcItemAssignmentsToSave
//   */
//   // public EstimateMainPrcItemAssignmentsToSave!: IIIdentifyable[] | null;

//  /*
//   * EstimatePriceAdjustmentToSave
//   */
//   public EstimatePriceAdjustmentToSave!: IEstPriceAdjustmentItemDataEntity[] | null;

//  /*
//   * ForceRuleParamterAssignmentOnSameLevel
//   */
//   public ForceRuleParamterAssignmentOnSameLevel!: boolean | null;

//  /*
//   * FormulaParameterEntities
//   */
//   // public FormulaParameterEntities!: IIEstimateRuleCommonParamEntity[] | null;

//  /*
//   * IgnoreParentParameter
//   */
//   public IgnoreParentParameter!: boolean | null;

//  /*
//   * IsCopyResourcesTo
//   */
//   public IsCopyResourcesTo!: boolean | null;

//  /*
//   * IsCopyToSameAssemblyCat
//   */
//   public IsCopyToSameAssemblyCat!: boolean | null;

//  /*
//   * IsFromDetailFormula
//   */
//   public IsFromDetailFormula!: boolean | null;

//  /*
//   * IsLookAtCopyOptions
//   */
//   public IsLookAtCopyOptions!: boolean | null;

//  /*
//   * IsMove
//   */
//   public IsMove!: boolean | null;

//  /*
//   * IsMoveOrCopyResource
//   */
//   public IsMoveOrCopyResource!: string | null;

//  /*
//   * IsMultiAssignParam
//   */
//   public IsMultiAssignParam!: boolean | null;

//  /*
//   * IsPrjectAssembly
//   */
//   public IsPrjectAssembly!: boolean | null;

//  /*
//   * IsQNARuleExecuteSuccess
//   */
//   public IsQNARuleExecuteSuccess!: boolean | null;

//  /*
//   * IsReload
//   */
//   public IsReload!: boolean | null;

//  /*
//   * IsSplitDeepCopy
//   */
//   public IsSplitDeepCopy!: boolean | null;

//  /*
//   * IsSubitemResource
//   */
//   public IsSubitemResource!: boolean | null;

//  /*
//   * IsUpdated
//   */
//   public IsUpdated!: boolean | null;

//  /*
//   * MainItemId
//   */
//   public MainItemId!: number | null;

//  /*
//   * MainItemName
//   */
//   public MainItemName!: string | null;

//  /*
//   * ParamsNotDeleted
//   */
//   public ParamsNotDeleted!: string[] | null;

//  /*
//   * ParamsOfSpecialStructureId
//   */
//   public ParamsOfSpecialStructureId!: number | null;

//  /*
//   * PrjCostCodesToDelete
//   */
//   // public PrjCostCodesToDelete!: IIIdentifyable[] | null;

//  /*
//   * PrjCostCodesToSave
//   */
//   // public PrjCostCodesToSave!: IIIdentifyable[] | null;

//  /*
//   * PrjEstRuleParamAssignedTo
//   */
//   // public PrjEstRuleParamAssignedTo!: IPrjEstRuleParamEntity[] | null;

//  /*
//   * PrjEstRuleToSave
//   */
//   // public PrjEstRuleToSave!: IPrjEstRuleEntity[] | null;

//  /*
//   * PrjMaterialsToSave
//   */
//   // public PrjMaterialsToSave!: IIIdentifyable[] | null;

//  /*
//   * PrjParameterEntities
//   */
//   // public PrjParameterEntities!: IIEstimateRuleCommonParamEntity[] | null;

//  /*
//   * ProjectId
//   */
//   public ProjectId!: number | null;

//  /*
//   * RiskRegistersToDelete
//   */
//   public RiskRegistersToDelete!: IEstRiskRegisterEntity[] | null;

//  /*
//   * RiskRegistersToSave
//   */
//   public RiskRegistersToSave!: EstRiskRegisterComplete[] | null;

//  /*
//   * RuleParamSaveTo
//   */
//   public RuleParamSaveTo!: string | null;

//  /*
//   * ShowedLineItemIds
//   */
//   public ShowedLineItemIds!: number[] | null;

//  /*
//   * SkipCalculationForRefLineItem
//   */
//   public SkipCalculationForRefLineItem!: boolean | null;

//  /*
//   * SortCodeInfoToSave
//   */
//   // public SortCodeInfoToSave!: IEstSortCodes[] | null;

//  /*
//   * SplitQuantityLineItems
//   */
//   public SplitQuantityLineItems!: IEstLineItemEntity[] | null;

//  /*
//   * ToLineItemId
//   */
//   public ToLineItemId!: number | null;

//  /*
//   * UserDefinedcolsOfLineItemModified
//   */
//   // public UserDefinedcolsOfLineItemModified!: IUserDefinedcolValEntity[] | null;

//  /*
//   * UserDefinedcolsOfLineItemToUpdate
//   */
//   // public UserDefinedcolsOfLineItemToUpdate!: UserDefinedColumnValueComplete | null;

//  /*
//   * UserDefinedcolsOfResourceModified
//   */
//   // public UserDefinedcolsOfResourceModified!: IUserDefinedcolValEntity[] | null;

//  /*
//   * UserDefinedcolsOfResourceToUpdate
//   */
//   // public UserDefinedcolsOfResourceToUpdate!: UserDefinedColumnValueComplete | null;

//  /*
//   * confDetail
//   */
//   // public confDetail!: IConfDetailData[] | null;

//  /*
//   * fromModule
//   */
//   public fromModule!: string | null;
// }
