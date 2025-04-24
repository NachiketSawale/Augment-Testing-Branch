/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILookupClientSideFilter, ILookupImageSelector, ILookupServerSideFilter, TypedConcreteFieldOverload } from '@libs/ui/common';


import * as entities from '@libs/basics/interfaces';
import * as lookups from '../lookup-services/customize/index';


export class BasicsSharedCustomizeLookupOverloadProvider {


	// Overload functions for identifier basics.customize.authenticationtype, i.e. the database table BAS_AUTHTYPE
	public static provideAuthenticationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAuthenticationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAuthenticationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAuthenticationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAuthenticationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAuthenticationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.threedvisualizationtype, i.e. the database table BAS_3DVISUALIZATIONTYPE
	public static provideThreeDVisualizationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeThreeDVisualizationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedThreeDVisualizationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideThreeDVisualizationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeThreeDVisualizationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedThreeDVisualizationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.abcclassification, i.e. the database table BAS_ABC_CLASSIFICATION
	public static provideAbcClassificationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAbcClassificationEntity>( {
				dataServiceToken: lookups.BasicsSharedAbcClassificationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAbcClassificationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAbcClassificationEntity>({
				dataServiceToken: lookups.BasicsSharedAbcClassificationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentaccounttype, i.e. the database table BAS_ACCASSIGN_ACC_TYPE
	public static provideAccountAssignmentAccountTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentAccountTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentAccountTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentAccountTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentAccountTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentAccountTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentaccount, i.e. the database table BAS_ACCASSIGN_ACCOUNT
	public static provideAccountAssignmentAccountLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentAccountEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentAccountLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentAccountReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentAccountEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentAccountLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentbusiness, i.e. the database table BAS_ACCASSIGN_BUSINESS
	public static provideAccountAssignmentBusinessLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentBusinessEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentBusinessLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentBusinessReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentBusinessEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentBusinessLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentcontracttype, i.e. the database table BAS_ACCASSIGN_CON_TYPE
	public static provideAccountAssignmentContractTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentContractTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentContractTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentContractTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentContractTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentContractTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentcontrol, i.e. the database table BAS_ACCASSIGN_CONTROL
	public static provideAccountAssignmentControlLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentControlEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentControlLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentControlReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentControlEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentControlLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentitemtype, i.e. the database table BAS_ACCASSIGN_ITEMTYPE
	public static provideAccountAssignmentItemTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentItemTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentItemTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentItemTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentItemTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentItemTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentfactory, i.e. the database table BAS_ACCASSIGN_FACTORY
	public static provideAccountAssignmentFactoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentFactoryEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentFactoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentFactoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentFactoryEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentFactoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentmatgroup, i.e. the database table BAS_ACCASSIGN_MAT_GROUP
	public static provideAccountAssignmentMatGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentMatGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentMatGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentMatGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentMatGroupEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentMatGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentprocurementgroup, i.e. the database table BAS_ACCASSIGN_PRC_GROUP
	public static provideAccountAssignmentProcurementGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentProcurementGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentProcurementGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentProcurementGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentProcurementGroupEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentProcurementGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountassignmentprocurementorgan, i.e. the database table BAS_ACCASSIGN_PRC_ORGAN
	public static provideAccountAssignmentProcurementOrganLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentProcurementOrganEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountAssignmentProcurementOrganLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountAssignmentProcurementOrganReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountAssignmentProcurementOrganEntity>({
				dataServiceToken: lookups.BasicsSharedAccountAssignmentProcurementOrganLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accounting, i.e. the database table BAS_ACCOUNT
	public static provideAccountingLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountingEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountingLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountingReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountingEntity>({
				dataServiceToken: lookups.BasicsSharedAccountingLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accounting2mdccontrcost, i.e. the database table BAS_ACCOUNT2MDC_CONTR_COST
	public static provideAccountingToMdcContrCostLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountingToMdcContrCostEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountingToMdcContrCostLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountingToMdcContrCostReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountingToMdcContrCostEntity>({
				dataServiceToken: lookups.BasicsSharedAccountingToMdcContrCostLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accountingtype, i.e. the database table BAS_ACCOUNTTYPE
	public static provideAccountingTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountingTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountingTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountingTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountingTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAccountingTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.addressformat, i.e. the database table BAS_ADDRESS_FORMAT
	public static provideAddressFormatLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAddressFormatEntity>( {
				dataServiceToken: lookups.BasicsSharedAddressFormatLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAddressFormatReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAddressFormatEntity>({
				dataServiceToken: lookups.BasicsSharedAddressFormatLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.addresstype, i.e. the database table BAS_ADDRESS_TYPE
	public static provideAddressTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAddressTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAddressTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAddressTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAddressTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAddressTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.calculationtype, i.e. the database table BAS_CALCULATIONTYPE
	public static provideCalculationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCalculationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCalculationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCalculationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCalculationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCalculationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.characteristictype, i.e. the database table BAS_CHARACTERISTIC_TYPE
	public static provideCharacteristicTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCharacteristicTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCharacteristicTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCharacteristicTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCharacteristicTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCharacteristicTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.chartpresentation, i.e. the database table BAS_CHARTPRESENTATION
	public static provideChartPresentationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChartPresentationEntity>( {
				dataServiceToken: lookups.BasicsSharedChartPresentationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideChartPresentationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChartPresentationEntity>({
				dataServiceToken: lookups.BasicsSharedChartPresentationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.chartprint, i.e. the database table BAS_CHARTPRINT
	public static provideChartPrintLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChartPrintEntity>( {
				dataServiceToken: lookups.BasicsSharedChartPrintLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideChartPrintReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChartPrintEntity>({
				dataServiceToken: lookups.BasicsSharedChartPrintLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.clerkrole, i.e. the database table BAS_CLERK_ROLE
	public static provideClerkRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedClerkRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideClerkRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkRoleEntity>({
				dataServiceToken: lookups.BasicsSharedClerkRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.clerkrole2entityprop, i.e. the database table BAS_CLERKROLE2ENTITYPROP
	public static provideClerkRole2EntityPropLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkRole2EntityPropEntity>( {
				dataServiceToken: lookups.BasicsSharedClerkRole2EntityPropLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideClerkRole2EntityPropReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkRole2EntityPropEntity>({
				dataServiceToken: lookups.BasicsSharedClerkRole2EntityPropLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.clerkdocumenttype, i.e. the database table BAS_CLERKDOCUMENTTYPE
	public static provideClerkDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedClerkDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideClerkDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedClerkDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.clerkroledefaultvaluetype, i.e. the database table BAS_CLERKROLEDEFVALTYPE
	public static provideClerkRoleDefaultValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkRoleDefaultValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedClerkRoleDefaultValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideClerkRoleDefaultValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeClerkRoleDefaultValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedClerkRoleDefaultValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.co2source, i.e. the database table BAS_CO2_SOURCE
	public static provideCo2SourceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCo2SourceEntity>( {
				dataServiceToken: lookups.BasicsSharedCo2SourceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCo2SourceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCo2SourceEntity>({
				dataServiceToken: lookups.BasicsSharedCo2SourceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.codeformat, i.e. the database table BAS_CODEFORMAT
	public static provideCodeFormatLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCodeFormatEntity>( {
				dataServiceToken: lookups.BasicsSharedCodeFormatLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCodeFormatReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCodeFormatEntity>({
				dataServiceToken: lookups.BasicsSharedCodeFormatLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.codeformattype, i.e. the database table BAS_CODEFORMATTYPE
	public static provideCodeFormatTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCodeFormatTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCodeFormatTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCodeFormatTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCodeFormatTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCodeFormatTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.codegensequencetype, i.e. the database table BAS_CODEGENSEQUENCE_TYPE
	public static provideCodeGenSequenceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCodeGenSequenceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCodeGenSequenceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCodeGenSequenceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCodeGenSequenceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCodeGenSequenceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.communicationchannel, i.e. the database table BAS_COMMUNICATIONCHANNEL
	public static provideCommunicationChannelLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCommunicationChannelEntity>( {
				dataServiceToken: lookups.BasicsSharedCommunicationChannelLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCommunicationChannelReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCommunicationChannelEntity>({
				dataServiceToken: lookups.BasicsSharedCommunicationChannelLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.companytransheaderstatus, i.e. the database table BAS_COMPANYTRANSHDRSTAT
	public static provideCompanyTransheaderStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCompanyTransheaderStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusEntity>({
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.companytransheaderstatusrole, i.e. the database table BAS_COMPANYTRNHDSTATROLE
	public static provideCompanyTransheaderStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCompanyTransheaderStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.companytransheaderstatusrule, i.e. the database table BAS_COMPANYTRNHDSTATRULE
	public static provideCompanyTransheaderStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCompanyTransheaderStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.companytransheaderstatusworkflow, i.e. the database table BAS_COMPANYTRNHDSTATWF
	public static provideCompanyTransheaderStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCompanyTransheaderStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTransheaderStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedCompanyTransheaderStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.companytype, i.e. the database table BAS_COMPANY_TYPE
	public static provideCompanyTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCompanyTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCompanyTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCompanyTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.companyurltype, i.e. the database table BAS_COMPANY_URLTYPE
	public static provideCompanyUrlTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyUrlTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCompanyUrlTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCompanyUrlTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCompanyUrlTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCompanyUrlTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.conditiontype, i.e. the database table BAS_CONDITION_TYPE
	public static provideConditionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConditionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedConditionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConditionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConditionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedConditionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.configurationtype, i.e. the database table BAS_CONFIGURATION_TYPE
	public static provideConfigurationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConfigurationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedConfigurationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConfigurationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConfigurationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedConfigurationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.controllingcat, i.e. the database table BAS_CONTROLLINGCAT
	public static provideControllingCatLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingCatEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingCatLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingCatReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingCatEntity>({
				dataServiceToken: lookups.BasicsSharedControllingCatLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.controllingcolumntype, i.e. the database table BAS_CONTR_COLUMNTYPE
	public static provideControllingColumnTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingColumnTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingColumnTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingColumnTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingColumnTypeEntity>({
				dataServiceToken: lookups.BasicsSharedControllingColumnTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.costcodeportion, i.e. the database table BAS_COSTCODE_PORTIONS
	public static provideCostCodePortionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostCodePortionEntity>( {
				dataServiceToken: lookups.BasicsSharedCostCodePortionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCostCodePortionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostCodePortionEntity>({
				dataServiceToken: lookups.BasicsSharedCostCodePortionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.costcodetype, i.e. the database table BAS_COSTCODE_TYPE
	public static provideCostCodeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostCodeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCostCodeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCostCodeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostCodeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCostCodeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.costgroupportion, i.e. the database table BAS_COSTGROUP_PORTIONS
	public static provideCostGroupPortionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostGroupPortionEntity>( {
				dataServiceToken: lookups.BasicsSharedCostGroupPortionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCostGroupPortionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostGroupPortionEntity>({
				dataServiceToken: lookups.BasicsSharedCostGroupPortionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.currencyratetype, i.e. the database table BAS_CURRENCY_RATE_TYPE
	public static provideCurrencyRateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCurrencyRateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCurrencyRateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCurrencyRateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCurrencyRateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCurrencyRateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dataformat, i.e. the database table BAS_DATAFORMAT
	public static provideDataFormatLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDataFormatEntity>( {
				dataServiceToken: lookups.BasicsSharedDataFormatLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDataFormatReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDataFormatEntity>({
				dataServiceToken: lookups.BasicsSharedDataFormatLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dangerclass, i.e. the database table BAS_DANGERCLASS
	public static provideDangerClassLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDangerClassEntity>( {
				dataServiceToken: lookups.BasicsSharedDangerClassLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDangerClassReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDangerClassEntity>({
				dataServiceToken: lookups.BasicsSharedDangerClassLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dashboardgroup, i.e. the database table BAS_DASHBOARDGROUP
	public static provideDashboardGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDashboardGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedDashboardGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDashboardGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDashboardGroupEntity>({
				dataServiceToken: lookups.BasicsSharedDashboardGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dashboardtype, i.e. the database table BAS_DASHBOARDTYPE
	public static provideDashboardTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDashboardTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDashboardTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDashboardTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDashboardTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDashboardTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectcontext, i.e. the database table BAS_DEFECT_CONTEXT
	public static provideDefectContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectContextEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectContextEntity>({
				dataServiceToken: lookups.BasicsSharedDefectContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectpriority, i.e. the database table BAS_DEFECT_PRIORITY
	public static provideDefectPriorityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectPriorityEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectPriorityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectPriorityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectPriorityEntity>({
				dataServiceToken: lookups.BasicsSharedDefectPriorityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectseverity, i.e. the database table BAS_DEFECT_SEVERITY
	public static provideDefectSeverityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectSeverityEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectSeverityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectSeverityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectSeverityEntity>({
				dataServiceToken: lookups.BasicsSharedDefectSeverityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defecttype, i.e. the database table BAS_DEFECT_TYPE
	public static provideDefectTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDefectTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.desktoppage, i.e. the database table BAS_DESKTOPPAGE
	public static provideDesktopPageLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDesktopPageEntity>( {
				dataServiceToken: lookups.BasicsSharedDesktopPageLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDesktopPageReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDesktopPageEntity>({
				dataServiceToken: lookups.BasicsSharedDesktopPageLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.desktopgroup, i.e. the database table BAS_DESKTOPGROUP
	public static provideDesktopGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDesktopGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedDesktopGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDesktopGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDesktopGroupEntity>({
				dataServiceToken: lookups.BasicsSharedDesktopGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.displaydomain, i.e. the database table BAS_DISPLAYDOMAIN
	public static provideDisplayDomainLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDisplayDomainEntity>( {
				dataServiceToken: lookups.BasicsSharedDisplayDomainLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDisplayDomainReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDisplayDomainEntity>({
				dataServiceToken: lookups.BasicsSharedDisplayDomainLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.documenttype, i.e. the database table BAS_DOCUMENT_TYPE
	public static provideDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.efbtype, i.e. the database table BAS_EFB_TYPE
	public static provideEfbTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEfbTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEfbTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEfbTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEfbTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEfbTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.emailserver, i.e. the database table BAS_EMAILSERVER
	public static provideEMailServerLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEMailServerEntity>( {
				dataServiceToken: lookups.BasicsSharedEMailServerLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEMailServerReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEMailServerEntity>({
				dataServiceToken: lookups.BasicsSharedEMailServerLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentcontext, i.e. the database table BAS_ETM_CONTEXT
	public static provideEquipmentContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentContextEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentContextEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.excelprofile, i.e. the database table BAS_EXCEL_PROFILE
	public static provideExcelProfileLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExcelProfileEntity>( {
				dataServiceToken: lookups.BasicsSharedExcelProfileLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExcelProfileReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExcelProfileEntity>({
				dataServiceToken: lookups.BasicsSharedExcelProfileLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.externalrole, i.e. the database table BAS_EXTERNAL_ROLE
	public static provideExternalRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedExternalRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExternalRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalRoleEntity>({
				dataServiceToken: lookups.BasicsSharedExternalRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.externalconfiguration, i.e. the database table BAS_EXTERNALCONFIG
	public static provideExternalConfigurationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalConfigurationEntity>( {
				dataServiceToken: lookups.BasicsSharedExternalConfigurationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExternalConfigurationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalConfigurationEntity>({
				dataServiceToken: lookups.BasicsSharedExternalConfigurationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.externalsource, i.e. the database table BAS_EXTERNALSOURCE
	public static provideExternalSourceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalSourceEntity>( {
				dataServiceToken: lookups.BasicsSharedExternalSourceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExternalSourceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalSourceEntity>({
				dataServiceToken: lookups.BasicsSharedExternalSourceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.externalsource2user, i.e. the database table BAS_EXTERNALSOURCE2USER
	public static provideExternalSource2UserLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalSource2UserEntity>( {
				dataServiceToken: lookups.BasicsSharedExternalSource2UserLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExternalSource2UserReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalSource2UserEntity>({
				dataServiceToken: lookups.BasicsSharedExternalSource2UserLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.externalsourcetype, i.e. the database table BAS_EXTERNALSOURCETYPE
	public static provideExternalSourceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalSourceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedExternalSourceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExternalSourceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalSourceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedExternalSourceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.externaldesktoptiles, i.e. the database table BAS_EXTERNALDESKTOPTILES
	public static provideExternalDesktopTilesLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalDesktopTilesEntity>( {
				dataServiceToken: lookups.BasicsSharedExternalDesktopTilesLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideExternalDesktopTilesReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeExternalDesktopTilesEntity>({
				dataServiceToken: lookups.BasicsSharedExternalDesktopTilesLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.formdatastatus, i.e. the database table BAS_FORMDATA_STATUS
	public static provideFormDataStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedFormDataStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFormDataStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusEntity>({
				dataServiceToken: lookups.BasicsSharedFormDataStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.formdatastatusrole, i.e. the database table BAS_FORMDATA_STATUSROLE
	public static provideFormDataStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedFormDataStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFormDataStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedFormDataStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.formdatastatusrule, i.e. the database table BAS_FORMDATA_STATUSRULE
	public static provideFormDataStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedFormDataStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFormDataStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedFormDataStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.formdatastatusworkflow, i.e. the database table BAS_FORMDATA_STATUSWF
	public static provideFormDataStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedFormDataStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFormDataStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormDataStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedFormDataStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.genericwizardsteptype, i.e. the database table BAS_GENWIZARD_STEPTYPE
	public static provideGenericWizardStepTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGenericWizardStepTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedGenericWizardStepTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideGenericWizardStepTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGenericWizardStepTypeEntity>({
				dataServiceToken: lookups.BasicsSharedGenericWizardStepTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.genericwizardscripttype, i.e. the database table BAS_GENWIZARD_SCRIPTTYPE
	public static provideGenericWizardScriptTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGenericWizardScriptTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedGenericWizardScriptTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideGenericWizardScriptTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGenericWizardScriptTypeEntity>({
				dataServiceToken: lookups.BasicsSharedGenericWizardScriptTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.goniometertype, i.e. the database table BAS_GONIOMETER_TYPE
	public static provideGoniometerTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGoniometerTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedGoniometerTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideGoniometerTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGoniometerTypeEntity>({
				dataServiceToken: lookups.BasicsSharedGoniometerTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.inheritcode, i.e. the database table BAS_INHERIT_CODE
	public static provideInheritCodeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInheritCodeEntity>( {
				dataServiceToken: lookups.BasicsSharedInheritCodeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInheritCodeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInheritCodeEntity>({
				dataServiceToken: lookups.BasicsSharedInheritCodeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqitemstatus, i.e. the database table BAS_ITEM_STATUS
	public static provideBoqItemStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqItemStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqItemStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqItemStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqItemStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBoqItemStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.itemtype, i.e. the database table BAS_ITEM_TYPE
	public static provideItemTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItemTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedItemTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideItemTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItemTypeEntity>({
				dataServiceToken: lookups.BasicsSharedItemTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.itemtype2, i.e. the database table BAS_ITEM_TYPE2
	public static provideItemType2LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItemType2Entity>( {
				dataServiceToken: lookups.BasicsSharedItemType2LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideItemType2ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItemType2Entity>({
				dataServiceToken: lookups.BasicsSharedItemType2LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.itemtype85, i.e. the database table BAS_ITEM_TYPE85
	public static provideItemType85LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItemType85Entity>( {
				dataServiceToken: lookups.BasicsSharedItemType85LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideItemType85ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItemType85Entity>({
				dataServiceToken: lookups.BasicsSharedItemType85LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.itwobaselineserver, i.e. the database table BAS_ITWOBASELINE_SERVER
	public static provideItwoBaselineServerLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItwoBaselineServerEntity>( {
				dataServiceToken: lookups.BasicsSharedItwoBaselineServerLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideItwoBaselineServerReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeItwoBaselineServerEntity>({
				dataServiceToken: lookups.BasicsSharedItwoBaselineServerLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.keyfigure, i.e. the database table BAS_KEYFIGURE
	public static provideKeyFigureLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeKeyFigureEntity>( {
				dataServiceToken: lookups.BasicsSharedKeyFigureLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideKeyFigureReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeKeyFigureEntity>({
				dataServiceToken: lookups.BasicsSharedKeyFigureLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.language, i.e. the database table BAS_LANGUAGE
	public static provideLanguageLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLanguageEntity>( {
				dataServiceToken: lookups.BasicsSharedLanguageLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLanguageReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLanguageEntity>({
				dataServiceToken: lookups.BasicsSharedLanguageLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.loadingcost, i.e. the database table BAS_LOADINGCOST
	public static provideLoadingCostLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLoadingCostEntity>( {
				dataServiceToken: lookups.BasicsSharedLoadingCostLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLoadingCostReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLoadingCostEntity>({
				dataServiceToken: lookups.BasicsSharedLoadingCostLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.matrixdatasource, i.e. the database table BAS_MATRIXDATASOURCE
	public static provideMatrixDataSourceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMatrixDataSourceEntity>( {
				dataServiceToken: lookups.BasicsSharedMatrixDataSourceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMatrixDataSourceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMatrixDataSourceEntity>({
				dataServiceToken: lookups.BasicsSharedMatrixDataSourceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.message, i.e. the database table BAS_MESSAGE
	public static provideMessageLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMessageEntity>( {
				dataServiceToken: lookups.BasicsSharedMessageLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMessageReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMessageEntity>({
				dataServiceToken: lookups.BasicsSharedMessageLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.messageseverity, i.e. the database table BAS_MESSAGESEVERITY
	public static provideMessageSeverityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMessageSeverityEntity>( {
				dataServiceToken: lookups.BasicsSharedMessageSeverityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMessageSeverityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMessageSeverityEntity>({
				dataServiceToken: lookups.BasicsSharedMessageSeverityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modulecontext, i.e. the database table BAS_MODULE_CONTEXT
	public static provideModuleContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModuleContextEntity>( {
				dataServiceToken: lookups.BasicsSharedModuleContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModuleContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModuleContextEntity>({
				dataServiceToken: lookups.BasicsSharedModuleContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.numbersequence, i.e. the database table BAS_NUMBER_SEQUENCE
	public static provideNumberSequenceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeNumberSequenceEntity>( {
				dataServiceToken: lookups.BasicsSharedNumberSequenceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideNumberSequenceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeNumberSequenceEntity>({
				dataServiceToken: lookups.BasicsSharedNumberSequenceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.operator, i.e. the database table BAS_OPERATOR
	public static provideOperatorLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOperatorEntity>( {
				dataServiceToken: lookups.BasicsSharedOperatorLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOperatorReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOperatorEntity>({
				dataServiceToken: lookups.BasicsSharedOperatorLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.packagingtypes, i.e. the database table BAS_PACKAGETYPE
	public static providePackagingTypesLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackagingTypesEntity>( {
				dataServiceToken: lookups.BasicsSharedPackagingTypesLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePackagingTypesReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackagingTypesEntity>({
				dataServiceToken: lookups.BasicsSharedPackagingTypesLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.papersize, i.e. the database table BAS_PAPERSIZE
	public static providePaperSizeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePaperSizeEntity>( {
				dataServiceToken: lookups.BasicsSharedPaperSizeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePaperSizeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePaperSizeEntity>({
				dataServiceToken: lookups.BasicsSharedPaperSizeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.paymentmethod, i.e. the database table BAS_PAYMENTMETHOD
	public static providePaymentMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePaymentMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedPaymentMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePaymentMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePaymentMethodEntity>({
				dataServiceToken: lookups.BasicsSharedPaymentMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.periodstate, i.e. the database table BAS_PERIOD_STATUS
	public static providePeriodStateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStateEntity>( {
				dataServiceToken: lookups.BasicsSharedPeriodStateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePeriodStateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStateEntity>({
				dataServiceToken: lookups.BasicsSharedPeriodStateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.periodstatusrole, i.e. the database table BAS_PERIOD_STATUSROLE
	public static providePeriodStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPeriodStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePeriodStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPeriodStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.periodstatusrule, i.e. the database table BAS_PERIOD_STATUSRULE
	public static providePeriodStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPeriodStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePeriodStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPeriodStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.periodstatusworkflow, i.e. the database table BAS_PERIOD_STATUSWORKFLOW
	public static providePeriodStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPeriodStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePeriodStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePeriodStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPeriodStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.priority, i.e. the database table BAS_PRIORITY
	public static providePriorityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePriorityEntity>( {
				dataServiceToken: lookups.BasicsSharedPriorityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePriorityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePriorityEntity>({
				dataServiceToken: lookups.BasicsSharedPriorityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtocommenttype, i.e. the database table BAS_QTO_COMMENTS_TYPE
	public static provideQtoCommentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoCommentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoCommentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoCommentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoCommentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQtoCommentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.quantitytype, i.e. the database table BAS_QUANTITY_TYPE
	public static provideQuantityTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuantityTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQuantityTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQuantityTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuantityTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQuantityTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.roundto, i.e. the database table BAS_ROUNDTO
	public static provideRoundToLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRoundToEntity>( {
				dataServiceToken: lookups.BasicsSharedRoundToLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRoundToReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRoundToEntity>({
				dataServiceToken: lookups.BasicsSharedRoundToLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.roundingmethod, i.e. the database table BAS_ROUNDINGMETHOD
	public static provideRoundingMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRoundingMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedRoundingMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRoundingMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRoundingMethodEntity>({
				dataServiceToken: lookups.BasicsSharedRoundingMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reference01, i.e. the database table BAS_REFERENCE1
	public static provideReference01LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference01Entity>( {
				dataServiceToken: lookups.BasicsSharedReference01LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReference01ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference01Entity>({
				dataServiceToken: lookups.BasicsSharedReference01LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reference02, i.e. the database table BAS_REFERENCE2
	public static provideReference02LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference02Entity>( {
				dataServiceToken: lookups.BasicsSharedReference02LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReference02ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference02Entity>({
				dataServiceToken: lookups.BasicsSharedReference02LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reference03, i.e. the database table BAS_REFERENCE3
	public static provideReference03LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference03Entity>( {
				dataServiceToken: lookups.BasicsSharedReference03LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReference03ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference03Entity>({
				dataServiceToken: lookups.BasicsSharedReference03LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reference04, i.e. the database table BAS_REFERENCE4
	public static provideReference04LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference04Entity>( {
				dataServiceToken: lookups.BasicsSharedReference04LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReference04ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference04Entity>({
				dataServiceToken: lookups.BasicsSharedReference04LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reference05, i.e. the database table BAS_REFERENCE5
	public static provideReference05LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference05Entity>( {
				dataServiceToken: lookups.BasicsSharedReference05LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReference05ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReference05Entity>({
				dataServiceToken: lookups.BasicsSharedReference05LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.regiontype, i.e. the database table BAS_REGIONTYPE
	public static provideRegionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRegionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRegionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRegionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRegionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRegionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.remindercycle, i.e. the database table BAS_REMINDERCYCLE
	public static provideReminderCycleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReminderCycleEntity>( {
				dataServiceToken: lookups.BasicsSharedReminderCycleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReminderCycleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReminderCycleEntity>({
				dataServiceToken: lookups.BasicsSharedReminderCycleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcetype, i.e. the database table BAS_RESOURCE_TYPE
	public static provideResourceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResourceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcecontext, i.e. the database table BAS_RESOURCE_CONTEXT
	public static provideResourceContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceContextEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceContextEntity>({
				dataServiceToken: lookups.BasicsSharedResourceContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rubric, i.e. the database table BAS_RUBRIC
	public static provideRubricLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRubricEntity>( {
				dataServiceToken: lookups.BasicsSharedRubricLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRubricReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRubricEntity>({
				dataServiceToken: lookups.BasicsSharedRubricLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rubriccategory, i.e. the database table BAS_RUBRIC_CATEGORY
	public static provideRubricCategoryLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<entities.IBasicsCustomizeRubricCategoryEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, entities.IBasicsCustomizeRubricCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedRubricCategoryLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter
			})
		};
	}

	public static provideRubricCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRubricCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedRubricCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rubricindex, i.e. the database table BAS_RUBRIC_INDEX
	public static provideRubricIndexLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRubricIndexEntity>( {
				dataServiceToken: lookups.BasicsSharedRubricIndexLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRubricIndexReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRubricIndexEntity>({
				dataServiceToken: lookups.BasicsSharedRubricIndexLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rythm, i.e. the database table BAS_RHYTHM
	public static provideRythmLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRythmEntity>( {
				dataServiceToken: lookups.BasicsSharedRythmLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRythmReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRythmEntity>({
				dataServiceToken: lookups.BasicsSharedRythmLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.salestaxmethod, i.e. the database table BAS_SALES_TAX_METHOD
	public static provideSalesTaxMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesTaxMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedSalesTaxMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSalesTaxMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesTaxMethodEntity>({
				dataServiceToken: lookups.BasicsSharedSalesTaxMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.salesdatekind, i.e. the database table BAS_SALESDATEKIND
	public static provideSalesDateKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesDateKindEntity>( {
				dataServiceToken: lookups.BasicsSharedSalesDateKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSalesDateKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesDateKindEntity>({
				dataServiceToken: lookups.BasicsSharedSalesDateKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.salesdatetype, i.e. the database table BAS_SALESDATETYPE
	public static provideSalesDateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesDateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedSalesDateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSalesDateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesDateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedSalesDateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulecontext, i.e. the database table BAS_SCHEDULING_CONTEXT
	public static provideScheduleContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleContextEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleContextEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.scopeofsupplytype, i.e. the database table BAS_SCOPEOFSUPPLYTYPE
	public static provideScopeOfSupplyTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScopeOfSupplyTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedScopeOfSupplyTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScopeOfSupplyTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScopeOfSupplyTypeEntity>({
				dataServiceToken: lookups.BasicsSharedScopeOfSupplyTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.scurve, i.e. the database table BAS_SCURVE
	public static provideSCurveLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSCurveEntity>( {
				dataServiceToken: lookups.BasicsSharedSCurveLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSCurveReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSCurveEntity>({
				dataServiceToken: lookups.BasicsSharedSCurveLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.scurvedetail, i.e. the database table BAS_SCURVEDETAIL
	public static provideSCurveDetailLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSCurveDetailEntity>( {
				dataServiceToken: lookups.BasicsSharedSCurveDetailLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSCurveDetailReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSCurveDetailEntity>({
				dataServiceToken: lookups.BasicsSharedSCurveDetailLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.sitetype, i.e. the database table BAS_SITETYPE
	public static provideSiteTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSiteTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedSiteTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSiteTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSiteTypeEntity>({
				dataServiceToken: lookups.BasicsSharedSiteTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.specificvaluetype, i.e. the database table BAS_SPECIFICVALUE_TYPE
	public static provideSpecificValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSpecificValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedSpecificValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSpecificValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSpecificValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedSpecificValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.stringcolumnconfig, i.e. the database table BAS_STRINGCOLUMNCONFIG
	public static provideStringColumnConfigLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStringColumnConfigEntity>( {
				dataServiceToken: lookups.BasicsSharedStringColumnConfigLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideStringColumnConfigReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStringColumnConfigEntity>({
				dataServiceToken: lookups.BasicsSharedStringColumnConfigLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.systemoption, i.e. the database table BAS_SYSTEMOPTION
	public static provideSystemOptionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSystemOptionEntity>( {
				dataServiceToken: lookups.BasicsSharedSystemOptionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSystemOptionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSystemOptionEntity>({
				dataServiceToken: lookups.BasicsSharedSystemOptionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.textarea, i.e. the database table BAS_TEXT_AREA
	public static provideTextAreaLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextAreaEntity>( {
				dataServiceToken: lookups.BasicsSharedTextAreaLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTextAreaReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextAreaEntity>({
				dataServiceToken: lookups.BasicsSharedTextAreaLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.textformat, i.e. the database table BAS_TEXT_FORMAT
	public static provideTextFormatLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextFormatEntity>( {
				dataServiceToken: lookups.BasicsSharedTextFormatLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTextFormatReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextFormatEntity>({
				dataServiceToken: lookups.BasicsSharedTextFormatLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.textmoduletype, i.e. the database table BAS_TEXT_MODULE_TYPE
	public static provideTextModuleTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextModuleTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTextModuleTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTextModuleTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextModuleTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTextModuleTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.textmodulecontext, i.e. the database table BAS_TEXT_MODULE_CONTEXT
	public static provideTextModuleContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextModuleContextEntity>( {
				dataServiceToken: lookups.BasicsSharedTextModuleContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTextModuleContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextModuleContextEntity>({
				dataServiceToken: lookups.BasicsSharedTextModuleContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.textmodulevariable, i.e. the database table BAS_TEXT_MODULE_VARIABLE
	public static provideTextModuleVariableLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextModuleVariableEntity>( {
				dataServiceToken: lookups.BasicsSharedTextModuleVariableLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTextModuleVariableReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextModuleVariableEntity>({
				dataServiceToken: lookups.BasicsSharedTextModuleVariableLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timesheetcontext, i.e. the database table BAS_TIMESHEET_CONTEXT
	public static provideTimeSheetContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSheetContextEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeSheetContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeSheetContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSheetContextEntity>({
				dataServiceToken: lookups.BasicsSharedTimeSheetContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.title, i.e. the database table BAS_TITLE
	public static provideTitleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTitleEntity>( {
				dataServiceToken: lookups.BasicsSharedTitleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTitleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTitleEntity>({
				dataServiceToken: lookups.BasicsSharedTitleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transactiontype, i.e. the database table BAS_TRANSACTIONTYPE
	public static provideTransactionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransactionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTransactionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransactionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransactionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTransactionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.uilanguage, i.e. the database table BAS_UILANGUAGE
	public static provideUserInterfaceLanguageLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUserInterfaceLanguageEntity>( {
				dataServiceToken: lookups.BasicsSharedUserInterfaceLanguageLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideUserInterfaceLanguageReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUserInterfaceLanguageEntity>({
				dataServiceToken: lookups.BasicsSharedUserInterfaceLanguageLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.uomtype, i.e. the database table BAS_UOMTYPE
	public static provideUoMTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUoMTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedUoMTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideUoMTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUoMTypeEntity>({
				dataServiceToken: lookups.BasicsSharedUoMTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.userdefinedcolumn, i.e. the database table BAS_USER_DEFINED_COL
	public static provideUserDefinedColumnLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUserDefinedColumnEntity>( {
				dataServiceToken: lookups.BasicsSharedUserDefinedColumnLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideUserDefinedColumnReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUserDefinedColumnEntity>({
				dataServiceToken: lookups.BasicsSharedUserDefinedColumnLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.userlabel, i.e. the database table BAS_USERLABEL
	public static provideUserLabelLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUserLabelEntity>( {
				dataServiceToken: lookups.BasicsSharedUserLabelLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideUserLabelReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeUserLabelEntity>({
				dataServiceToken: lookups.BasicsSharedUserLabelLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.valuetype, i.e. the database table BAS_VALUETYPE
	public static provideValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.vatcalculationtype, i.e. the database table BAS_VATCALCULATIONTYPE
	public static provideVatCalculationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVatCalculationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedVatCalculationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideVatCalculationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVatCalculationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedVatCalculationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.vatclause, i.e. the database table BAS_VATCLAUSE
	public static provideVatClauseLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVatClauseEntity>( {
				dataServiceToken: lookups.BasicsSharedVatClauseLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideVatClauseReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVatClauseEntity>({
				dataServiceToken: lookups.BasicsSharedVatClauseLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.wageratetype, i.e. the database table BAS_WAGE_RATE_TYPE
	public static provideWageRateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWageRateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedWageRateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWageRateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWageRateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedWageRateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.warrantysecurity, i.e. the database table BAS_WARRANTYSECURITY
	public static provideWarrantySecurityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWarrantySecurityEntity>( {
				dataServiceToken: lookups.BasicsSharedWarrantySecurityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWarrantySecurityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWarrantySecurityEntity>({
				dataServiceToken: lookups.BasicsSharedWarrantySecurityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.warrantyobligation, i.e. the database table BAS_WARRANTYOBLIGATION
	public static provideWarrantyObligationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWarrantyObligationEntity>( {
				dataServiceToken: lookups.BasicsSharedWarrantyObligationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWarrantyObligationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWarrantyObligationEntity>({
				dataServiceToken: lookups.BasicsSharedWarrantyObligationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.warrantystatus, i.e. the database table BAS_WARRANTY_STATUS
	public static provideWarrantyStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWarrantyStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedWarrantyStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWarrantyStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWarrantyStatusEntity>({
				dataServiceToken: lookups.BasicsSharedWarrantyStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bidstatus, i.e. the database table BID_STATUS
	public static provideBidStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBidStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBidStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBidStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bidstatusrole, i.e. the database table BID_STATUSROLE
	public static provideBidStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedBidStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBidStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedBidStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bidstatusrule, i.e. the database table BID_STATUSRULE
	public static provideBidStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBidStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBidStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedBidStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bidstatusworkflow, i.e. the database table BID_STATUSWORKFLOW
	public static provideBidStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBidStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBidStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBidStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bidtype, i.e. the database table BID_TYPE
	public static provideBidTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBidTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBidTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBidTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBidTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billaccrualmode, i.e. the database table BIL_ACCRUALMODE
	public static provideBillAccrualModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillAccrualModeEntity>( {
				dataServiceToken: lookups.BasicsSharedBillAccrualModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillAccrualModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillAccrualModeEntity>({
				dataServiceToken: lookups.BasicsSharedBillAccrualModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billitemnumberconfigurationheader, i.e. the database table BIL_ITEMNOCONFHEADER
	public static provideBillItemNumberConfigurationHeaderLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillItemNumberConfigurationHeaderEntity>( {
				dataServiceToken: lookups.BasicsSharedBillItemNumberConfigurationHeaderLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillItemNumberConfigurationHeaderReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillItemNumberConfigurationHeaderEntity>({
				dataServiceToken: lookups.BasicsSharedBillItemNumberConfigurationHeaderLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.catalogassigntype, i.e. the database table BOQ_CAT_ASSIGN_CONFTYPE
	public static provideCatalogAssignTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCatalogAssignTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCatalogAssignTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCatalogAssignTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCatalogAssignTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCatalogAssignTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqcatalog, i.e. the database table BOQ_CATALOG
	public static provideBoqCatalogLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqCatalogEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqCatalogLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqCatalogReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqCatalogEntity>({
				dataServiceToken: lookups.BasicsSharedBoqCatalogLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.divisiontype, i.e. the database table BOQ_DIVISIONTYPE
	public static provideDivisionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDivisionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDivisionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDivisionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDivisionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDivisionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqitemflag, i.e. the database table BOQ_ITEM_FLAG
	public static provideBoqItemFlagLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqItemFlagEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqItemFlagLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqItemFlagReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqItemFlagEntity>({
				dataServiceToken: lookups.BasicsSharedBoqItemFlagLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.linetype, i.e. the database table BOQ_LINE_TYPE
	public static provideLineTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLineTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLineTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLineTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLineTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLineTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqrevenuetype, i.e. the database table BOQ_REVENUE_TYPE
	public static provideBoqRevenueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqRevenueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqRevenueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqRevenueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqRevenueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBoqRevenueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqroundingconfigurationtype, i.e. the database table BOQ_ROUNDINGCONFIGTYPE
	public static provideBoqRoundingConfigurationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqRoundingConfigurationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqRoundingConfigurationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqRoundingConfigurationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqRoundingConfigurationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBoqRoundingConfigurationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqstandard, i.e. the database table BOQ_STANDARD
	public static provideBoqStandardLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStandardEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqStandardLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqStandardReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStandardEntity>({
				dataServiceToken: lookups.BasicsSharedBoqStandardLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqstatus, i.e. the database table BOQ_STATUS
	public static provideBoqStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBoqStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqstatusrole, i.e. the database table BOQ_STATUSROLE
	public static provideBoqStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedBoqStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqstatusrule, i.e. the database table BOQ_STATUSRULE
	public static provideBoqStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedBoqStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqstatusworkflow, i.e. the database table BOQ_STATUSWORKFLOW
	public static provideBoqStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBoqStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqtype, i.e. the database table BOQ_TYPE
	public static provideBoqTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBoqTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqunitratebreakdown, i.e. the database table BOQ_UR_BREAKDOWN
	public static provideBoqUnitRateBreakDownLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqUnitRateBreakDownEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqUnitRateBreakDownLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqUnitRateBreakDownReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqUnitRateBreakDownEntity>({
				dataServiceToken: lookups.BasicsSharedBoqUnitRateBreakDownLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.boqwarningconfig, i.e. the database table BOQ_WARNING_CONFIG
	public static provideBoqWarningConfigLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqWarningConfigEntity>( {
				dataServiceToken: lookups.BasicsSharedBoqWarningConfigLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBoqWarningConfigReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBoqWarningConfigEntity>({
				dataServiceToken: lookups.BasicsSharedBoqWarningConfigLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpdactivitytype, i.e. the database table BPD_ACTIVITY_TYPE
	public static provideBpActivityTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpActivityTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBpActivityTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpActivityTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpActivityTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBpActivityTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpagreementtype, i.e. the database table BPD_AGREEMENTTYPE
	public static provideBpAgreementTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpAgreementTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBpAgreementTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpAgreementTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpAgreementTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBpAgreementTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpbankstatus, i.e. the database table BPD_BANKSTATUS
	public static provideBpBankStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBpBankStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpBankStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBpBankStatusLookupService,
				showClearButton: false,
				displayMember: 'DescriptionInfo.Translated'
			})
		};
	}


	// Overload functions for identifier basics.customize.bpbankstatusrole, i.e. the database table BPD_BANKSTATUSRULE
	public static provideBpBankStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedBpBankStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpBankStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedBpBankStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpbankstatusrule, i.e. the database table BPD_BANKSTATUSROLE
	public static provideBpBankStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBpBankStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpBankStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedBpBankStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpbankstatusworkflow, i.e. the database table BPD_BANKSTATUSWORKFLOW
	public static provideBpBankStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBpBankStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpBankStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpBankStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBpBankStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.banktype, i.e. the database table BPD_BANK_TYPE
	public static provideBankTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBankTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBankTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBankTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBankTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBankTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.blockingreason, i.e. the database table BPD_BLOCKINGREASON
	public static provideBlockingReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBlockingReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedBlockingReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBlockingReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBlockingReasonEntity>({
				dataServiceToken: lookups.BasicsSharedBlockingReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.businessunit, i.e. the database table BPD_BUSINESS_UNIT
	public static provideBusinessUnitLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBusinessUnitEntity>( {
				dataServiceToken: lookups.BasicsSharedBusinessUnitLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBusinessUnitReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBusinessUnitEntity>({
				dataServiceToken: lookups.BasicsSharedBusinessUnitLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.postinggroup, i.e. the database table BPD_BUSINESSPOSTINGGROUP
	public static providePostingGroupLookupOverload< T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<entities.IBasicsCustomizePostingGroupEntity, T>) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePostingGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedPostingGroupLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
				displayMember: 'DescriptionInfo.Tanslated'
			})
		};
	}

	public static providePostingGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePostingGroupEntity>({
				dataServiceToken: lookups.BasicsSharedPostingGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.postinggroupwithholdingtax, i.e. the database table BPD_BUSINESSPOSTGRP_WHT
	public static providePostingGroupWithholdingTaxLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePostingGroupWithholdingTaxEntity>( {
				dataServiceToken: lookups.BasicsSharedPostingGroupWithholdingTaxLookupService,
				showClearButton: showClearBtn,
				displayMember: 'DescriptionInfo.Translated',
			})
		};
	}

	public static providePostingGroupWithholdingTaxReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePostingGroupWithholdingTaxEntity>({
				dataServiceToken: lookups.BasicsSharedPostingGroupWithholdingTaxLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.certificatestatus, i.e. the database table BPD_CERTIFICATESTATUS
	public static provideCertificateStatusLookupOverload< T extends object>(showClearBtn: boolean, imageSelector?: ILookupImageSelector<entities.IBasicsCustomizeCertificateStatusEntity, T>) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedCertificateStatusLookupService,
				showClearButton: showClearBtn,
				displayMember: 'DescriptionInfo.Translated',
				imageSelector
			})
		};
	}

	public static provideCertificateStatusReadonlyLookupOverload< T extends object>(imageSelector?: ILookupImageSelector<entities.IBasicsCustomizeCertificateStatusEntity, T>) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateStatusEntity>({
				dataServiceToken: lookups.BasicsSharedCertificateStatusLookupService,
				showClearButton: false,
				imageSelector,
				displayMember: 'DescriptionInfo.Translated'
			})
		};
	}


	// Overload functions for identifier basics.customize.certificatestatusrule, i.e. the database table BPD_CERTIFICATESTATRULE
	public static provideCertificateStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedCertificateStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCertificateStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedCertificateStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.certificatestatusworkflow, i.e. the database table BPD_CERTIFICATESTATWFLOW
	public static provideCertificateStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedCertificateStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCertificateStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedCertificateStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.certificatetype, i.e. the database table BPD_CERTIFICATE_TYPE
	public static provideCertificateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCertificateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCertificateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCertificateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCertificateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contactabc, i.e. the database table BPD_CONTACT_ABC
	public static provideContactAbcLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactAbcEntity>( {
				dataServiceToken: lookups.BasicsSharedContactAbcLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideContactAbcReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactAbcEntity>({
				dataServiceToken: lookups.BasicsSharedContactAbcLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contactorigin, i.e. the database table BPD_CONTACT_ORIGIN
	public static provideContactOriginLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactOriginEntity>( {
				dataServiceToken: lookups.BasicsSharedContactOriginLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideContactOriginReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactOriginEntity>({
				dataServiceToken: lookups.BasicsSharedContactOriginLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contactrole, i.e. the database table BPD_CONTACT_ROLE
	public static provideContactRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedContactRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideContactRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactRoleEntity>({
				dataServiceToken: lookups.BasicsSharedContactRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contacttimelineness, i.e. the database table BPD_CONTACT_TIMELINESS
	public static provideContactTimelinenessLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactTimelinenessEntity>( {
				dataServiceToken: lookups.BasicsSharedContactTimelinenessLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideContactTimelinenessReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeContactTimelinenessEntity>({
				dataServiceToken: lookups.BasicsSharedContactTimelinenessLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.creditstanding, i.e. the database table BPD_CREDITSTANDING
	public static provideCreditStandingLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCreditStandingEntity>( {
				dataServiceToken: lookups.BasicsSharedCreditStandingLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCreditStandingReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCreditStandingEntity>({
				dataServiceToken: lookups.BasicsSharedCreditStandingLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerabc, i.e. the database table BPD_CUSTOMER_ABC
	public static provideCustomerAbcLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerAbcEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerAbcLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerAbcReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerAbcEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerAbcLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerbranch, i.e. the database table BPD_CUSTOMER_BRANCH
	public static provideCustomerBranchLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerBranchEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerBranchLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerBranchReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerBranchEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerBranchLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerledgergroup, i.e. the database table BPD_CUSTOMER_LEDGER_GROUP
	public static provideCustomerLedgerGroupLookupOverload< T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<entities.IBasicsCustomizeCustomerLedgerGroupEntity, T> ) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerLedgerGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerLedgerGroupLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter
			})
		};
	}

	public static provideCustomerLedgerGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerLedgerGroupEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerLedgerGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customergroup, i.e. the database table BPD_CUSTOMER_GROUP
	public static provideCustomerGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerGroupEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customersector, i.e. the database table BPD_CUSTOMER_SECTOR
	public static provideCustomerSectorLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerSectorEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerSectorLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerSectorReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerSectorEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerSectorLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerstate, i.e. the database table BPD_CUSTOMER_STATUS
	public static provideCustomerStateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStateEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerStateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerStateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStateEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerStateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerstatus, i.e. the database table BPD_CUSTOMERSTATUS
	public static provideCustomerStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStatusEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerstatusrule, i.e. the database table BPD_CUSTOMERSTATUSRULE
	public static provideCustomerStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.customerstatusworkflow, i.e. the database table BPD_CUSTOMERSTAWORKFLOW
	public static provideCustomerStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dunninggroup, i.e. the database table BPD_DUNNINGGROUP
	public static provideDunningGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDunningGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedDunningGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDunningGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDunningGroupEntity>({
				dataServiceToken: lookups.BasicsSharedDunningGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.evaluationstatus, i.e. the database table BPD_EVALSTATUS
	public static provideEvaluationStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEvaluationStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEvaluationStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEvaluationStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.evaluationstatusrole, i.e. the database table BPD_EVALSTATUSROLE
	public static provideEvaluationStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedEvaluationStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEvaluationStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedEvaluationStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.evaluationstatusrule, i.e. the database table BPD_EVALSTATUSRULE
	public static provideEvaluationStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedEvaluationStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEvaluationStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedEvaluationStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.evaluationstatusworkflow, i.e. the database table BPD_EVALSTATUSWORKFLOW
	public static provideEvaluationStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedEvaluationStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEvaluationStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEvaluationStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedEvaluationStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.evaluationmotive, i.e. the database table BPD_EVALUATIONMOTIVE
	public static provideCustomerEvaluationMotiveLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerEvaluationMotiveEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerEvaluationMotiveLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerEvaluationMotiveReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerEvaluationMotiveEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerEvaluationMotiveLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.guarantortype, i.e. the database table BPD_GUARANTORTYPE
	public static provideCustomerGuarantorTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerGuarantorTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCustomerGuarantorTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCustomerGuarantorTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCustomerGuarantorTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCustomerGuarantorTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.legalform, i.e. the database table BPD_LEGALFORM
	public static provideLegalFormLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLegalFormEntity>( {
				dataServiceToken: lookups.BasicsSharedLegalFormLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLegalFormReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLegalFormEntity>({
				dataServiceToken: lookups.BasicsSharedLegalFormLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.realestatetype, i.e. the database table BPD_REALESTATE_TYPE
	public static provideRealestateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRealestateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRealestateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRealestateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRealestateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRealestateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.relationtype, i.e. the database table BPD_RELATIONTYPE
	public static provideRelationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRelationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRelationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRelationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRelationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRelationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bprole, i.e. the database table BPD_ROLE
	public static provideBpRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedBpRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpRoleEntity>({
				dataServiceToken: lookups.BasicsSharedBpRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpstatus, i.e. the database table BPD_STATUS
	public static provideBpStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBpStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBpStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpstatusrule, i.e. the database table BPD_STATUSRULE
	public static provideBpStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBpStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedBpStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpstatusworkflow, i.e. the database table BPD_STATUSWORKFLOW
	public static provideBpStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBpStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBpStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpstatus2, i.e. the database table BPD_STATUS2
	public static provideBpStatus2LookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatus2Entity>( {
				dataServiceToken: lookups.BasicsSharedBpStatus2LookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpStatus2ReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatus2Entity>({
				dataServiceToken: lookups.BasicsSharedBpStatus2LookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpstatus2rule, i.e. the database table BPD_STATUS2RULE
	public static provideBpStatus2RuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatus2RuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBpStatus2RuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpStatus2RuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatus2RuleEntity>({
				dataServiceToken: lookups.BasicsSharedBpStatus2RuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpstatus2workflow, i.e. the database table BPD_STATUS2WORKFLOW
	public static provideBpStatus2WorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatus2WorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBpStatus2WorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpStatus2WorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpStatus2WorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBpStatus2WorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.subledgercontext, i.e. the database table BPD_SUBLEDGER_CONTEXT
	public static provideSubledgerContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubledgerContextEntity>( {
				dataServiceToken: lookups.BasicsSharedSubledgerContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSubledgerContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubledgerContextEntity>({
				dataServiceToken: lookups.BasicsSharedSubledgerContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.subsidiarystatus, i.e. the database table BPD_SUBSIDIARYSTATUS
	public static provideSubsidiaryStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSubsidiaryStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusEntity>({
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.subsidiarystatusrole, i.e. the database table BPD_SUBSIDIARYSTATUSROLE
	public static provideSubsidiaryStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSubsidiaryStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.subsidiarystatusrule, i.e. the database table BPD_SUBSIDIARYSTATUSRULE
	public static provideSubsidiaryStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSubsidiaryStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.subsidiarystatusworkflow, i.e. the database table BPD_SUBSIDIARYSTATUSWORKFLOW
	public static provideSubsidiaryStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSubsidiaryStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSubsidiaryStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedSubsidiaryStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.supplierledgergroup, i.e. the database table BPD_SUPPLIER_LEDGER_GROUP
	public static provideSupplierLedgerGroupLookupOverload< T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<entities.IBasicsCustomizeSupplierLedgerGroupEntity, T>) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSupplierLedgerGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedSupplierLedgerGroupLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
				displayMember: 'DescriptionInfo.Translated',
			})
		};
	}

	public static provideSupplierLedgerGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSupplierLedgerGroupEntity>({
				dataServiceToken: lookups.BasicsSharedSupplierLedgerGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpsupplierstatus, i.e. the database table BPD_SUPPLIERSTATUS
	public static provideBpSupplierStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpSupplierStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBpSupplierStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpSupplierStatusReadonlyLookupOverload< T extends object>(imageSelector?: ILookupImageSelector<entities.IBasicsCustomizeBpSupplierStatusEntity, T> ) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpSupplierStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBpSupplierStatusLookupService,
				showClearButton: false,
				displayMember: 'DescriptionInfo.Translated',
				imageSelector : imageSelector
			})
		};
	}


	// Overload functions for identifier basics.customize.bpsupplierstatusrule, i.e. the database table BPD_SUPPLIERSTATUSRULE
	public static provideBpSupplierStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpSupplierStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBpSupplierStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpSupplierStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpSupplierStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedBpSupplierStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.bpsupplierstatusworkflow, i.e. the database table BPD_SUPPLIERSTAWORKFLOW
	public static provideBpSupplierStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpSupplierStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBpSupplierStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBpSupplierStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBpSupplierStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBpSupplierStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.vatgroup, i.e. the database table BPD_VATGROUP
	public static provideVATGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVATGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedVATGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideVATGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVATGroupEntity>({
				dataServiceToken: lookups.BasicsSharedVATGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billcategorydefault, i.e. the database table BIL_CATEGORY_DEFAULTS
	public static provideBillCategoryDefaultLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillCategoryDefaultEntity>( {
				dataServiceToken: lookups.BasicsSharedBillCategoryDefaultLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillCategoryDefaultReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillCategoryDefaultEntity>({
				dataServiceToken: lookups.BasicsSharedBillCategoryDefaultLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billindirectcostbalancingconfiguration, i.e. the database table BIL_INDIRECTCOSTBAL_CFG
	public static provideBillIndirectCostBalancingConfigurationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity>( {
				dataServiceToken: lookups.BasicsSharedBillIndirectCostBalancingConfigurationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillIndirectCostBalancingConfigurationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity>({
				dataServiceToken: lookups.BasicsSharedBillIndirectCostBalancingConfigurationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billinvoicetype, i.e. the database table BIL_INVOICE_TYPE
	public static provideBillInvoiceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillInvoiceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBillInvoiceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillInvoiceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillInvoiceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBillInvoiceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billstatus, i.e. the database table BIL_STATUS
	public static provideBillStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedBillStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusEntity>({
				dataServiceToken: lookups.BasicsSharedBillStatusLookupService,
				showClearButton: false,
				displayMember: 'DescriptionInfo.Translated',
			})
		};
	}


	// Overload functions for identifier basics.customize.billstatusrole, i.e. the database table BIL_STATUSROLE
	public static provideBillStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedBillStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedBillStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billstatusrule, i.e. the database table BIL_STATUSRULE
	public static provideBillStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedBillStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedBillStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billstatusworkflow, i.e. the database table BIL_STATUSWORKFLOW
	public static provideBillStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedBillStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedBillStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billtype, i.e. the database table BIL_TYPE
	public static provideBillTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBillTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBillTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.calendartype, i.e. the database table CAL_CALENDARTYPE
	public static provideCalendarTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCalendarTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCalendarTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCalendarTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCalendarTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCalendarTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.vouchertype, i.e. the database table BIL_VOUCHER_TYPE
	public static provideVoucherTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVoucherTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedVoucherTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideVoucherTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeVoucherTypeEntity>({
				dataServiceToken: lookups.BasicsSharedVoucherTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contype, i.e. the database table CON_TYPE
	public static provideConTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedConTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConTypeEntity>({
				dataServiceToken: lookups.BasicsSharedConTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.constatus2external, i.e. the database table CON_STATUS2EXTERNAL
	public static provideConStatus2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatus2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedConStatus2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConStatus2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatus2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedConStatus2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.constatus, i.e. the database table CON_STATUS
	public static provideConStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedConStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusEntity>({
				dataServiceToken: lookups.BasicsSharedConStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.constatusrole, i.e. the database table CON_STATUSROLE
	public static provideConStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedConStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedConStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.constatusrule, i.e. the database table CON_STATUSRULE
	public static provideConStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedConStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedConStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.constatusworkflow, i.e. the database table CON_STATUSWORKFLOW
	public static provideConStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedConStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedConStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosysdefaulttype, i.e. the database table COS_DEFAULTTYPE
	public static provideCoSysDefaultTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCoSysDefaultTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCoSysDefaultTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCoSysDefaultTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCoSysDefaultTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCoSysDefaultTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosinstheaderstatus, i.e. the database table COS_INSHEADSTATE
	public static provideCosInstHeaderStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCosInstHeaderStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusEntity>({
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosinstheaderstatusrole, i.e. the database table COS_INSHEADSTATEROLE
	public static provideCosInstHeaderStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCosInstHeaderStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosinstheaderstatusrule, i.e. the database table COS_INSHEADSTATERULE
	public static provideCosInstHeaderStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCosInstHeaderStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosinstheaderstatusworkflow, i.e. the database table COS_INSHEADSTATEWORKFLOW
	public static provideCosInstHeaderStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCosInstHeaderStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCosInstHeaderStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedCosInstHeaderStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosysparametertype, i.e. the database table COS_PARAMETERTYPE
	public static provideCoSysParameterTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCoSysParameterTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCoSysParameterTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCoSysParameterTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCoSysParameterTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCoSysParameterTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.cosystype, i.e. the database table COS_TYPE
	public static provideCoSysTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCoSysTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCoSysTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCoSysTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCoSysTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCoSysTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.crbpriceconditiontype, i.e. the database table CRB_PRICECONDITION_TYPE
	public static provideCrbPriceConditionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCrbPriceConditionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCrbPriceConditionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCrbPriceConditionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCrbPriceConditionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCrbPriceConditionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defect2projectchangetype, i.e. the database table DFM_DEFECT2CHANGETYPE
	public static provideDefect2ProjectChangeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefect2ProjectChangeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDefect2ProjectChangeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefect2ProjectChangeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefect2ProjectChangeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDefect2ProjectChangeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectdocumenttype, i.e. the database table DFM_DOCUMENTTYPE
	public static provideDefectDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDefectDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectgroup, i.e. the database table DFM_GROUP
	public static provideDefectGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectGroupEntity>({
				dataServiceToken: lookups.BasicsSharedDefectGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectraisedby, i.e. the database table DFM_RAISEDBY
	public static provideDefectRaisedByLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectRaisedByEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectRaisedByLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectRaisedByReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectRaisedByEntity>({
				dataServiceToken: lookups.BasicsSharedDefectRaisedByLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectstatus2external, i.e. the database table DFM_STATUS2EXTERNAL
	public static provideDefectStatus2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatus2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectStatus2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectStatus2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatus2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedDefectStatus2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectstatus, i.e. the database table DFM_STATUS
	public static provideDefectStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusEntity>({
				dataServiceToken: lookups.BasicsSharedDefectStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectstatusrole, i.e. the database table DFM_STATUSROLE
	public static provideDefectStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedDefectStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectstatusrule, i.e. the database table DFM_STATUSRULE
	public static provideDefectStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedDefectStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.defectstatusworkflow, i.e. the database table DFM_STATUSWORKFLOW
	public static provideDefectStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedDefectStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDefectStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDefectStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedDefectStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingtype, i.e. the database table ENG_DRAWING_TYPE
	public static provideEngineeringDrawingTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingstatusext, i.e. the database table ENG_DRW_STATUS2EXT
	public static provideEngineeringDrawingStatusExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingStatusExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusExternalEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingstatus, i.e. the database table ENG_DRAWING_STATUS
	public static provideEngineeringDrawingStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingstatusrole, i.e. the database table ENG_DRW_STATUSROLE
	public static provideEngineeringDrawingStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingstatusrule, i.e. the database table ENG_DRW_STATUSRULE
	public static provideEngineeringDrawingStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingstatusworkflow, i.e. the database table ENG_DRW_STATUSWORKFLOW
	public static provideEngineeringDrawingStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingcomponenttype, i.e. the database table ENG_DRW_COMP_TYPE
	public static provideEngineeringDrawingComponentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingComponentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingcomponentstatus, i.e. the database table ENG_DRW_COMP_STATUS
	public static provideEngineeringDrawingComponentStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingComponentStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingcomponentstatusrole, i.e. the database table ENG_COMP_STATUSROLE
	public static provideEngineeringDrawingComponentStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingComponentStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingcomponentstatusrule, i.e. the database table ENG_COMP_STATUSRULE
	public static provideEngineeringDrawingComponentStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingComponentStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringdrawingcomponentstatusworkflow, i.e. the database table ENG_COMP_STATUSWORKFLOW
	public static provideEngineeringDrawingComponentStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringDrawingComponentStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringDrawingComponentStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringDrawingComponentStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringaccountingruletype, i.e. the database table ENG_ACC_RULE_TYPE
	public static provideEngineeringAccountingRuleTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringAccountingRuleTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringAccountingRuleTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringAccountingRuleTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringAccountingRuleTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringAccountingRuleTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringaccountingruleimportformat, i.e. the database table ENG_ACC_IMPORT_FORMAT
	public static provideEngineeringAccountingRuleImportFormatLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringAccountingRuleImportFormatEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringAccountingRuleImportFormatLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringAccountingRuleImportFormatReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringAccountingRuleImportFormatEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringAccountingRuleImportFormatLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringaccountingrulematchfield, i.e. the database table ENG_ACC_MATCH_FIELD
	public static provideEngineeringAccountingRuleMatchFieldLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringAccountingRuleMatchFieldEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringAccountingRuleMatchFieldLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringAccountingRuleMatchFieldReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringAccountingRuleMatchFieldEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringAccountingRuleMatchFieldLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringtype, i.e. the database table ENG_TYPE
	public static provideEngineeringTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringstatus, i.e. the database table ENG_STATUS
	public static provideEngineeringStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringstatusrole, i.e. the database table ENG_STATUSROLE
	public static provideEngineeringStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringstatusrule, i.e. the database table ENG_STATUSRULE
	public static provideEngineeringStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringstatusworkflow, i.e. the database table ENG_STATUSWORKFLOW
	public static provideEngineeringStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringtaskstatusext, i.e. the database table ENG_TASK_STATUS2EXT
	public static provideEngineeringTaskStatusExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringTaskStatusExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusExternalEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringtaskstatus, i.e. the database table ENG_TASK_STATUS
	public static provideEngineeringTaskStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringTaskStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringtaskstatusrole, i.e. the database table ENG_TASK_STATUSROLE
	public static provideEngineeringTaskStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringTaskStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringtaskstatusrule, i.e. the database table ENG_TASK_STATUSRULE
	public static provideEngineeringTaskStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringTaskStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.engineeringtaskstatusworkflow, i.e. the database table ENG_TASK_STATUSWORKFLOW
	public static provideEngineeringTaskStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEngineeringTaskStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEngineeringTaskStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedEngineeringTaskStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estallowanceconfigtype, i.e. the database table EST_ALLOWANCECONFIG_TYPE
	public static provideEstAllowanceConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstAllowanceConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstAllowanceConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstAllowanceConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstAllowanceConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstAllowanceConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estassemblytype, i.e. the database table EST_ASSEMBLY_TYPE
	public static provideEstAssemblyTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstAssemblyTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstAssemblyTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstAssemblyTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstAssemblyTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstAssemblyTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estassemblytypelogic, i.e. the database table EST_ASSEMBLYTYPE_LOGIC
	public static provideEstAssemblyTypeLogicLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstAssemblyTypeLogicEntity>( {
				dataServiceToken: lookups.BasicsSharedEstAssemblyTypeLogicLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstAssemblyTypeLogicReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstAssemblyTypeLogicEntity>({
				dataServiceToken: lookups.BasicsSharedEstAssemblyTypeLogicLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.calculateorder, i.e. the database table EST_CALC_ORDER
	public static provideEstCalculateOrderLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstCalculateOrderEntity>( {
				dataServiceToken: lookups.BasicsSharedEstCalculateOrderLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstCalculateOrderReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstCalculateOrderEntity>({
				dataServiceToken: lookups.BasicsSharedEstCalculateOrderLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estcolumnconfigtype, i.e. the database table EST_COLUMNCONFIGTYPE
	public static provideEstColumnConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstColumnConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstColumnConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstColumnConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstColumnConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstColumnConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estconfigtype, i.e. the database table EST_CONFIGTYPE
	public static provideEstConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.costrisk, i.e. the database table EST_COSTRISK
	public static provideCostRiskLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostRiskEntity>( {
				dataServiceToken: lookups.BasicsSharedCostRiskLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCostRiskReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostRiskEntity>({
				dataServiceToken: lookups.BasicsSharedCostRiskLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estcosttype, i.e. the database table EST_COSTTYPE
	public static provideCostTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCostTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCostTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCostTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estevaluationsequence, i.e. the database table EST_EVALUATIONSEQUENCE
	public static provideEstEvaluationSequenceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstEvaluationSequenceEntity>( {
				dataServiceToken: lookups.BasicsSharedEstEvaluationSequenceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstEvaluationSequenceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstEvaluationSequenceEntity>({
				dataServiceToken: lookups.BasicsSharedEstEvaluationSequenceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estlineitemstatus, i.e. the database table EST_LINE_ITEM_STATUS
	public static provideEstLineItemStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstLineItemStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEstLineItemStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstLineItemStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstLineItemStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEstLineItemStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estparameter, i.e. the database table EST_PARAMETER
	public static provideEstParameterLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstParameterEntity>( {
				dataServiceToken: lookups.BasicsSharedEstParameterLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstParameterReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstParameterEntity>({
				dataServiceToken: lookups.BasicsSharedEstParameterLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estparametergroup, i.e. the database table EST_PARAMETERGROUP
	public static provideEstParameterGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstParameterGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedEstParameterGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstParameterGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstParameterGroupEntity>({
				dataServiceToken: lookups.BasicsSharedEstParameterGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estimationparametervalue, i.e. the database table EST_PARAMETER_VALUE
	public static provideEstimationParameterValueLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimationParameterValueEntity>( {
				dataServiceToken: lookups.BasicsSharedEstimationParameterValueLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstimationParameterValueReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimationParameterValueEntity>({
				dataServiceToken: lookups.BasicsSharedEstimationParameterValueLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estparametervaluetype, i.e. the database table EST_PARAMVALUETYPE
	public static provideEstParameterValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstParameterValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstParameterValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstParameterValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstParameterValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstParameterValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estquantityrel, i.e. the database table EST_QUANTITY_REL
	public static provideEstQuantityRelLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstQuantityRelEntity>( {
				dataServiceToken: lookups.BasicsSharedEstQuantityRelLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstQuantityRelReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstQuantityRelEntity>({
				dataServiceToken: lookups.BasicsSharedEstQuantityRelLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estresourceflag, i.e. the database table EST_RESOURCEFLAG
	public static provideResourceFlagLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceFlagEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceFlagLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceFlagReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceFlagEntity>({
				dataServiceToken: lookups.BasicsSharedResourceFlagLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estresourcetype, i.e. the database table EST_RESOURCE_TYPE
	public static provideEstResourceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstResourceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstResourceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstResourceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstResourceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstResourceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ruleexecutiontype, i.e. the database table EST_RULE_EXECUTION_TYPE
	public static provideRuleExecutionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRuleExecutionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRuleExecutionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRuleExecutionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRuleExecutionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRuleExecutionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estrootassignmenttype, i.e. the database table EST_ROOTASSIGNMENT_TYPE
	public static provideEstRootAssignmentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstRootAssignmentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstRootAssignmentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstRootAssignmentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstRootAssignmentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstRootAssignmentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estrootassignmentlevel, i.e. the database table EST_ROOTASSIGNMENT_LEVEL
	public static provideEstRootAssignmentLevelLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstRootAssignmentLevelEntity>( {
				dataServiceToken: lookups.BasicsSharedEstRootAssignmentLevelLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstRootAssignmentLevelReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstRootAssignmentLevelEntity>({
				dataServiceToken: lookups.BasicsSharedEstRootAssignmentLevelLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estimateroundingconfigurationtype, i.e. the database table EST_ROUNDINGCONFIGTYPE
	public static provideEstimateRoundingConfigurationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimateRoundingConfigurationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstimateRoundingConfigurationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstimateRoundingConfigurationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimateRoundingConfigurationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstimateRoundingConfigurationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eststatus, i.e. the database table EST_STATUS
	public static provideEstStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedEstStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusEntity>({
				dataServiceToken: lookups.BasicsSharedEstStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eststatusrole, i.e. the database table EST_STATUSROLE
	public static provideEstStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedEstStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedEstStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eststatusrule, i.e. the database table EST_STATUSRULE
	public static provideEstStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedEstStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedEstStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eststatusworkflow, i.e. the database table EST_STATUSWORKFLOW
	public static provideEstStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedEstStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedEstStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eststructure, i.e. the database table EST_STRUCTURE
	public static provideEstStructureLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStructureEntity>( {
				dataServiceToken: lookups.BasicsSharedEstStructureLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstStructureReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStructureEntity>({
				dataServiceToken: lookups.BasicsSharedEstStructureLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eststructuretype, i.e. the database table EST_STRUCTURETYPE
	public static provideEstStructureTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStructureTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstStructureTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstStructureTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstStructureTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstStructureTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.esttotalsconfigtype, i.e. the database table EST_TOTALSCONFIGTYPE
	public static provideEstTotalsConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstTotalsConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstTotalsConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstTotalsConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstTotalsConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstTotalsConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estimationtype, i.e. the database table EST_TYPE
	public static provideEstimationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstimationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstimationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstimationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.estuppconfigtype, i.e. the database table EST_UPP_CONFIGTYPE
	public static provideEstUppConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstUppConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEstUppConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstUppConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstUppConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEstUppConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentaccessorytype, i.e. the database table ETM_ACCESSORYTYPE
	public static provideEquipmentAccessoryTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentAccessoryTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentAccessoryTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentAccessoryTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentAccessoryTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentAccessoryTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcalculationtype, i.e. the database table ETM_CALCULATIONTYPE
	public static providePlantCalculationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCalculationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCalculationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCalculationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCalculationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCalculationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentcatalogcodecontent, i.e. the database table ETM_CATALOGCODECONTENT
	public static provideEquipmentCatalogCodeContentLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentCatalogCodeContentEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentCatalogCodeContentLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentCatalogCodeContentReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentCatalogCodeContentEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentCatalogCodeContentLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcatalogtype, i.e. the database table ETM_CATALOGTYPE
	public static providePlantCatalogTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCatalogTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCatalogTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCatalogTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCatalogTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCatalogTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcertificatedoctype, i.e. the database table ETM_CERTIFICATEDOCTYPE
	public static providePlantCertificateDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCertificateDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCertificateDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCertificateDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcertificatestatus, i.e. the database table ETM_CERTIFICATESTATUS
	public static providePlantCertificateStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCertificateStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcertificatestatusrole, i.e. the database table ETM_CERTIFICATESTATUSROLE
	public static providePlantCertificateStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCertificateStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcertificatestatusrule, i.e. the database table ETM_CERTIFICATESTATUSRULE
	public static providePlantCertificateStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCertificateStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcertificatestatusworkflow, i.e. the database table ETM_CERTIFICATESTATUSWRKFLW
	public static providePlantCertificateStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCertificateStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCertificateStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantcertificatetype, i.e. the database table ETM_CERTIFICATETYPE
	public static providePlantCertificateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantCertificateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantCertificateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantCertificateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantCertificateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentcharactervalueop, i.e. the database table ETM_CHARACTERVALUEOP
	public static provideEquipmentCharacterValueOperatorLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentCharacterValueOperatorEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentCharacterValueOperatorLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentCharacterValueOperatorReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentCharacterValueOperatorEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentCharacterValueOperatorLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentcharactervaluetype, i.e. the database table ETM_CHARACTERVALUETYPE
	public static provideEquipmentCharacterValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentCharacterValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentCharacterValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentCharacterValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentCharacterValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentCharacterValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentdivision, i.e. the database table ETM_DIVISION
	public static provideEquipmentDivisionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentDivisionEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentDivisionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentDivisionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentDivisionEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentDivisionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantestimatepricelist, i.e. the database table ETM_ESTPRICELIST
	public static providePlantEstimatePriceListLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantEstimatePriceListEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantEstimatePriceListLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantEstimatePriceListReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantEstimatePriceListEntity>({
				dataServiceToken: lookups.BasicsSharedPlantEstimatePriceListLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentfixedasset, i.e. the database table ETM_FIXEDASSET
	public static provideEquipmentFixedAssetLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentFixedAssetEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentFixedAssetLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentFixedAssetReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentFixedAssetEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentFixedAssetLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentinputsource, i.e. the database table ETM_INPUTSOURCE
	public static provideEquipmentInputSourceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentInputSourceEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentInputSourceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentInputSourceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentInputSourceEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentInputSourceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.maintenancestatus, i.e. the database table ETM_MAINTSTATUS
	public static provideMainStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMainStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMainStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMainStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.maintenancestatusrole, i.e. the database table ETM_MAINTSTATUSROLE
	public static provideMainStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMainStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMainStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMainStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.maintenancestatusrule, i.e. the database table ETM_MAINTSTATUSRULE
	public static provideMainStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMainStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMainStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMainStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.maintenancestatusworkflow, i.e. the database table ETM_MAINTSTATUSWF
	public static provideMainStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMainStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMainStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMainStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMainStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantnominaldimensionassignment, i.e. the database table ETM_NOM_DIM_ASSIGNMENT
	public static providePlantNominalDimensionAssignmentLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantNominalDimensionAssignmentEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantNominalDimensionAssignmentLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantNominalDimensionAssignmentReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantNominalDimensionAssignmentEntity>({
				dataServiceToken: lookups.BasicsSharedPlantNominalDimensionAssignmentLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantassemblytype, i.e. the database table ETM_PLANTASSEMBLYTYPE
	public static providePlantAssemblyTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantAssemblyTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantAssemblyTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantAssemblyTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantAssemblyTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantAssemblyTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentpartnertype, i.e. the database table ETM_PARTNERTYPE
	public static provideEquipmentPartnerTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPartnerTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentPartnerTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentPartnerTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPartnerTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentPartnerTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantdocumenttype, i.e. the database table ETM_PLANTDOCUMENTTYPE
	public static providePlantDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantkind, i.e. the database table ETM_PLANTKIND
	public static providePlantKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantKindEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantKindEntity>({
				dataServiceToken: lookups.BasicsSharedPlantKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantstatus, i.e. the database table ETM_PLANTSTATUS
	public static providePlantStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPlantStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantstatusrole, i.e. the database table ETM_PLANTSTATUSROLE
	public static providePlantStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantstatusrule, i.e. the database table ETM_PLANTSTATUSRULE
	public static providePlantStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.planttatusworkflow, i.e. the database table ETM_PLANTSTATUSWORKFLOW
	public static providePlantStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPlantStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.planttype, i.e. the database table ETM_PLANTTYPE
	public static providePlantTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentpricinggroup, i.e. the database table ETM_PRICINGGROUP
	public static provideEquipmentPricingGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPricingGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentPricingGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentPricingGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPricingGroupEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentPricingGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentpricelist, i.e. the database table ETM_PRICELIST
	public static provideEquipmentPriceListLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPriceListEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentPriceListLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentPriceListReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPriceListEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentPriceListLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.equipmentpricelisttype, i.e. the database table ETM_PRICELISTTYPE
	public static provideEquipmentPriceListTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPriceListTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEquipmentPriceListTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEquipmentPriceListTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEquipmentPriceListTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEquipmentPriceListTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantwarrantystatus, i.e. the database table ETM_WARRANTYSTATUS
	public static providePlantWarrantyStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantWarrantyStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantwarrantystatusrole, i.e. the database table ETM_WARRANTYSTATUSROLE
	public static providePlantWarrantyStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantWarrantyStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantwarrantystatusrule, i.e. the database table ETM_WARRANTYSTATUSRULE
	public static providePlantWarrantyStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantWarrantyStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantwarrantystatusworkflow, i.e. the database table ETM_WARRANTYSTATWRKFLW
	public static providePlantWarrantyStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantWarrantyStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPlantWarrantyStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantwarrantytype, i.e. the database table ETM_WARRANTYTYPE
	public static providePlantWarrantyTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantWarrantyTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantWarrantyTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantWarrantyTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPlantWarrantyTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.frmaccessrolecategory, i.e. the database table FRM_ACCESSROLECATEGORY
	public static provideFrmAccessRoleCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFrmAccessRoleCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedFrmAccessRoleCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFrmAccessRoleCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFrmAccessRoleCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedFrmAccessRoleCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.frmidentityprovider, i.e. the database table FRM_IDENTITYPROVIDER
	public static provideFrmIdentityProviderLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFrmIdentityProviderEntity>( {
				dataServiceToken: lookups.BasicsSharedFrmIdentityProviderLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFrmIdentityProviderReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFrmIdentityProviderEntity>({
				dataServiceToken: lookups.BasicsSharedFrmIdentityProviderLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.frmportalusergroup, i.e. the database table FRM_PORTALUSERGROUP
	public static provideFrmPortalUserGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFrmPortalUserGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedFrmPortalUserGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFrmPortalUserGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFrmPortalUserGroupEntity>({
				dataServiceToken: lookups.BasicsSharedFrmPortalUserGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.gcccostcodeassign, i.e. the database table GCC_COSTCODE_ASSIGN
	public static provideGCCCostCodeAssignLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGCCCostCodeAssignEntity>( {
				dataServiceToken: lookups.BasicsSharedGCCCostCodeAssignLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideGCCCostCodeAssignReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGCCCostCodeAssignEntity>({
				dataServiceToken: lookups.BasicsSharedGCCCostCodeAssignLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.hsqecontext, i.e. the database table HSQ_CONTEXT
	public static provideHsqeContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeContextEntity>( {
				dataServiceToken: lookups.BasicsSharedHsqeContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideHsqeContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeContextEntity>({
				dataServiceToken: lookups.BasicsSharedHsqeContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.hsqecheckliststatus, i.e. the database table HSQ_CHL_STATUS
	public static provideHsqeChecklistStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideHsqeChecklistStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusEntity>({
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.hsqecheckliststatusrole, i.e. the database table HSQ_CHL_STATUSROLE
	public static provideHsqeChecklistStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideHsqeChecklistStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.hsqecheckliststatusrule, i.e. the database table HSQ_CHL_STATUSRULE
	public static provideHsqeChecklistStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideHsqeChecklistStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.hsqecheckliststatusworkflow, i.e. the database table HSQ_CHL_STATUSWORKFLOW
	public static provideHsqeChecklistStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideHsqeChecklistStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedHsqeChecklistStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.hsqechecklisttype, i.e. the database table HSQ_CHECKLISTTYPE
	public static provideHsqeChecklistTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedHsqeChecklistTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideHsqeChecklistTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeHsqeChecklistTypeEntity>({
				dataServiceToken: lookups.BasicsSharedHsqeChecklistTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoiceaccrualmode, i.e. the database table INV_ACCRUALMODE
	public static provideInvoiceAccrualModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceAccrualModeEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceAccrualModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceAccrualModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceAccrualModeEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceAccrualModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicegroup, i.e. the database table INV_GROUP
	public static provideInvoiceGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceGroupEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicegroupaccount, i.e. the database table INV_GROUPACCOUNT
	public static provideInvoiceGroupAccountLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceGroupAccountEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceGroupAccountLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceGroupAccountReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceGroupAccountEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceGroupAccountLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicerejectionreasonacc, i.e. the database table INV_REJECTIONREASONACC
	public static provideInvoiceRejectionReasonAccLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceRejectionReasonAccEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceRejectionReasonAccLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceRejectionReasonAccReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceRejectionReasonAccEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceRejectionReasonAccLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invrejectionreason, i.e. the database table INV_REJECTIONREASON
	public static provideInvRejectionReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvRejectionReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedInvRejectionReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvRejectionReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvRejectionReasonEntity>({
				dataServiceToken: lookups.BasicsSharedInvRejectionReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicestatus2external, i.e. the database table INV_STATUS2EXTERNAL
	public static provideInvoiceStatus2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatus2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceStatus2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceStatus2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatus2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceStatus2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicestatus, i.e. the database table INV_STATUS
	public static provideInvoiceStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceStatusLookupService,
				showClearButton: showClearBtn
			}),
		};
	}

	public static provideInvoiceStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicestatusrole, i.e. the database table INV_STATUSROLE
	public static provideInvoiceStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicestatusrule, i.e. the database table INV_STATUSRULE
	public static provideInvoiceStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicestatusworkflow, i.e. the database table INV_STATUSWORKFLOW
	public static provideInvoiceStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.invoicetype, i.e. the database table INV_TYPE
	public static provideInvoiceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedInvoiceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInvoiceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInvoiceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedInvoiceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsclaimmethod, i.e. the database table LGM_CLAIM_METHOD
	public static provideLogisticsClaimMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsClaimMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsClaimMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimMethodEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsClaimMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsclaimreason, i.e. the database table LGM_CLAIM_REASON
	public static provideLogisticsClaimReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsClaimReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsClaimReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimReasonEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsClaimReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsclaimstatus, i.e. the database table LGM_CLAIM_STATUS
	public static provideLogisticsClaimStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsClaimStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsclaimstatusrole, i.e. the database table LGM_CLAIM_STATUSROLE
	public static provideLogisticsClaimStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsClaimStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsclaimstatusrule, i.e. the database table LGM_CLAIM_STATUSRULE
	public static provideLogisticsClaimStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsClaimStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsclaimstatusworkflow, i.e. the database table LGM_CLAIM_STATUSWRKFLW
	public static provideLogisticsClaimStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsClaimStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsClaimStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsClaimStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticscontext, i.e. the database table LGM_CONTEXT
	public static provideLogisticsContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsContextEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsContextEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchaction, i.e. the database table LGM_DISPATCH_ACTION
	public static provideDispatchActionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchActionEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchActionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchActionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchActionEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchActionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsdispatchergroup2group, i.e. the database table LGM_DISPATCH_GROUP2GRP
	public static provideLogisticsDispatcherGroup2GroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsDispatcherGroup2GroupEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsDispatcherGroup2GroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsDispatcherGroup2GroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsDispatcherGroup2GroupEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsDispatcherGroup2GroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsdispatcherheadertype, i.e. the database table LGM_DISPATCH_HEADER_TYPE
	public static provideLogisticsDispatcherHeaderTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsDispatcherHeaderTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsDispatcherHeaderTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsDispatcherHeaderTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsDispatcherHeaderTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsDispatcherHeaderTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchheaderdocumenttype, i.e. the database table LGM_DISPATCHDOCUMENTTYPE
	public static provideDispatchHeaderDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchHeaderDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchHeaderDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchHeaderDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchHeaderDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchHeaderDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticsdispatchergroup, i.e. the database table LGM_DISPATCHER_GROUP
	public static provideLogisticsDispatcherGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsDispatcherGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsDispatcherGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsDispatcherGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsDispatcherGroupEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsDispatcherGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchstatus, i.e. the database table LGM_DISPATCH_STATUS
	public static provideDispatchStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchstatusrole, i.e. the database table LGM_DISPATCH_STATUSROLE
	public static provideDispatchStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchstatusrule, i.e. the database table LGM_DISPATCH_STATUSRULE
	public static provideDispatchStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchstatusworkflow, i.e. the database table LGM_DISPATCH_STATUSWFLOW
	public static provideDispatchStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispheaderlinkreason, i.e. the database table LGM_DISPHEADER_LINKREASON
	public static provideDispatchHeaderLinkReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchHeaderLinkReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchHeaderLinkReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchHeaderLinkReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchHeaderLinkReasonEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchHeaderLinkReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispheaderlinktype, i.e. the database table LGM_DISPHEADER_LINKTYPE
	public static provideDispatchHeaderLinkTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchHeaderLinkTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchHeaderLinkTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchHeaderLinkTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchHeaderLinkTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchHeaderLinkTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchrecordstatus, i.e. the database table LGM_DSPATCHREC_STAT
	public static provideDispatchRecordStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchRecordStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchrecordstatusrole, i.e. the database table LGM_DSPATCHREC_STATROLE
	public static provideDispatchRecordStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchRecordStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchrecordstatusrule, i.e. the database table LGM_DSPATCHREC_STATRULE
	public static provideDispatchRecordStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchRecordStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.dispatchrecordstatusworkflow, i.e. the database table LGM_DSPATCHREC_STATWFLW
	public static provideDispatchRecordStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDispatchRecordStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDispatchRecordStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedDispatchRecordStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardarea, i.e. the database table LGM_JOBCARDAREA
	public static provideJobCardAreaLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardAreaEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardAreaLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardAreaReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardAreaEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardAreaLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardgroup, i.e. the database table LGM_JOBCARDGROUP
	public static provideJobCardGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardGroupEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardstatus, i.e. the database table LGM_JOBCARDSTATUS
	public static provideJobCardStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardstatusrole, i.e. the database table LGM_JOBCARDSTATUSROLE
	public static provideJobCardStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardstatusrule, i.e. the database table LGM_JOBCARDSTATUSRULE
	public static provideJobCardStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardstatusworkflow, i.e. the database table LGM_JOBCARDSTATUSWFLW
	public static provideJobCardStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardrecordtype, i.e. the database table LGM_JOBCARDRECORD_TYPE
	public static provideJobCardRecordTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardRecordTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardRecordTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardRecordTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardRecordTypeEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardRecordTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcarddocumenttype, i.e. the database table LGM_JOBCARDDOCTYPE
	public static provideJobCardDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobcardpriority, i.e. the database table LGM_JOBCARDPRIORITY
	public static provideJobCardPriorityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardPriorityEntity>( {
				dataServiceToken: lookups.BasicsSharedJobCardPriorityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobCardPriorityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobCardPriorityEntity>({
				dataServiceToken: lookups.BasicsSharedJobCardPriorityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobdocumenttype, i.e. the database table LGM_JOBDOCUMENTTYPE
	public static provideJobDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedJobDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedJobDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobgroup, i.e. the database table LGM_JOBGROUP
	public static provideJobGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedJobGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobGroupEntity>({
				dataServiceToken: lookups.BasicsSharedJobGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobstatus, i.e. the database table LGM_JOBSTATUS
	public static provideJobStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedJobStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusEntity>({
				dataServiceToken: lookups.BasicsSharedJobStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobstatusrole, i.e. the database table LGM_JOBSTATUSROLE
	public static provideJobStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedJobStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedJobStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobstatusrule, i.e. the database table LGM_JOBSTATUSRULE
	public static provideJobStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedJobStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedJobStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobstatusworkflow, i.e. the database table LGM_JOBSTATUSWORKFLOW
	public static provideJobStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedJobStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedJobStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticjobtasktype, i.e. the database table LGM_JOBTASKTYPE
	public static provideLogisticJobTaskTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticJobTaskTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticJobTaskTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticJobTaskTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticJobTaskTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticJobTaskTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.jobtype, i.e. the database table LGM_JOBTYPE
	public static provideJobTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedJobTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideJobTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeJobTypeEntity>({
				dataServiceToken: lookups.BasicsSharedJobTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.sundrynominaldimensionassignment, i.e. the database table LGM_NOM_DIM_ASSIGNMENT
	public static provideSundryNominalDimensionAssignmentLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSundryNominalDimensionAssignmentEntity>( {
				dataServiceToken: lookups.BasicsSharedSundryNominalDimensionAssignmentLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSundryNominalDimensionAssignmentReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSundryNominalDimensionAssignmentEntity>({
				dataServiceToken: lookups.BasicsSharedSundryNominalDimensionAssignmentLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantsupplyitemstatus, i.e. the database table LGM_PLANTSUPITEMSTAT
	public static providePlantSupplyItemStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantSupplyItemStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantsupplyitemstatusrole, i.e. the database table LGM_PLANTSUPITEMSTATROLE
	public static providePlantSupplyItemStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantSupplyItemStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantsupplyitemstatusrule, i.e. the database table LGM_PLANTSUPITEMSTATRULE
	public static providePlantSupplyItemStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantSupplyItemStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plantsupplyitemstatusworkflow, i.e. the database table LGM_PLANTSUPITEMSTATWFLW
	public static providePlantSupplyItemStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlantSupplyItemStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlantSupplyItemStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPlantSupplyItemStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticrecordtype, i.e. the database table LGM_RECORD_TYPE
	public static provideLogisticRecordTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticRecordTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticRecordTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticRecordTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticRecordTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticRecordTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettledbytype, i.e. the database table LGM_SETTLEDBYTYPE
	public static provideLogisticsSettledByTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettledByTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettledByTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettledByTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettledByTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettledByTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementledgercontexttype, i.e. the database table LGM_SETTLEMENT_LC_TYPE
	public static provideLogisticsSettlementLedgerContextTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementLedgerContextTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementLedgerContextTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementLedgerContextTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementLedgerContextTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementitemtype, i.e. the database table LGM_SETTLEMENTITEMTYPE
	public static provideLogisticsSettlementItemTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementItemTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementItemTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementItemTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementItemTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementItemTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementstatus, i.e. the database table LGM_SETTLEMENTSTATUS
	public static provideLogisticsSettlementStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementStatusEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementstatusrole, i.e. the database table LGM_SETTLEMENTSTATUSROLE
	public static provideLogisticsSettlementRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementRoleEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementstatusrule, i.e. the database table LGM_SETTLEMENTSTATUSRULE
	public static provideLogisticsSettlementRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementRuleEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementstatusworkflow, i.e. the database table LGM_SETTLEMENTSTATUSWF
	public static provideLogisticsSettlementWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.logisticssettlementtype, i.e. the database table LGM_SETTLEMENTTYPE
	public static provideLogisticsSettlementTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLogisticsSettlementTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLogisticsSettlementTypeEntity>({
				dataServiceToken: lookups.BasicsSharedLogisticsSettlementTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.allareagrouptype, i.e. the database table MDC_ALL_AREA_GROUP_TYPE
	public static provideAllAreaGroupTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAllAreaGroupTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAllAreaGroupTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAllAreaGroupTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAllAreaGroupTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAllAreaGroupTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.allowance, i.e. the database table MDC_ALLOWANCE
	public static provideEstimateAllowanceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimateAllowanceEntity>( {
				dataServiceToken: lookups.BasicsSharedEstimateAllowanceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEstimateAllowanceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEstimateAllowanceEntity>({
				dataServiceToken: lookups.BasicsSharedEstimateAllowanceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.allowancetype, i.e. the database table MDC_ALLOWANCE_TYPE
	public static provideAllowanceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAllowanceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAllowanceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAllowanceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAllowanceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAllowanceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.billinglinetype, i.e. the database table MDC_BILLING_LINE_TYPE
	public static provideBillingLineTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillingLineTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedBillingLineTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBillingLineTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBillingLineTypeEntity>({
				dataServiceToken: lookups.BasicsSharedBillingLineTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.brand, i.e. the database table MDC_BRAND
	public static provideBrandLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBrandEntity>( {
				dataServiceToken: lookups.BasicsSharedBrandLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBrandReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBrandEntity>({
				dataServiceToken: lookups.BasicsSharedBrandLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.masterdatacontext, i.e. the database table MDC_CONTEXT
	public static provideMasterDataContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMasterDataContextEntity>( {
				dataServiceToken: lookups.BasicsSharedMasterDataContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMasterDataContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMasterDataContextEntity>({
				dataServiceToken: lookups.BasicsSharedMasterDataContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.controllingunitassignment, i.e. the database table MDC_CONTRUNITASSIGNMENT
	public static provideControllingUnitAssignmentLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitAssignmentEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingUnitAssignmentLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingUnitAssignmentReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitAssignmentEntity>({
				dataServiceToken: lookups.BasicsSharedControllingUnitAssignmentLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mdccontrollinggroup, i.e. the database table MDC_CONTROLLINGGROUP
	public static provideMdcControllingGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMdcControllingGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedMdcControllingGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMdcControllingGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMdcControllingGroupEntity>({
				dataServiceToken: lookups.BasicsSharedMdcControllingGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mdccontrollinggroupdetail, i.e. the database table MDC_CONTROLLINGGRPDETAIL
	public static provideMdcControllingGroupDetailLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMdcControllingGroupDetailEntity>( {
				dataServiceToken: lookups.BasicsSharedMdcControllingGroupDetailLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMdcControllingGroupDetailReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMdcControllingGroupDetailEntity>({
				dataServiceToken: lookups.BasicsSharedMdcControllingGroupDetailLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contrunitstatus, i.e. the database table MDC_CONTRUNITSTATUS
	public static provideControllingUnitStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingUnitStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusEntity>({
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contrunitstatusrole, i.e. the database table MDC_CONTRUNITSTATUSROLE
	public static provideControllingUnitStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingUnitStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contrunitstatusrule, i.e. the database table MDC_CONTRUNITSTATUSRULE
	public static provideControllingUnitStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingUnitStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.contrunitstatusworkflow, i.e. the database table MDC_CONTRUNITSTSWORKFL
	public static provideControllingUnitStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideControllingUnitStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeControllingUnitStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedControllingUnitStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.costlinetype, i.e. the database table MDC_COSTLINETYPE
	public static provideCostLineTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostLineTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCostLineTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCostLineTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCostLineTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCostLineTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.creditorlinetype, i.e. the database table MDC_CREDLINETYPE
	public static provideCreditorLineTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCreditorLineTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedCreditorLineTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCreditorLineTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCreditorLineTypeEntity>({
				dataServiceToken: lookups.BasicsSharedCreditorLineTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.debitorlinetype, i.e. the database table MDC_DEBLINETYPE
	public static provideDebitorLineTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDebitorLineTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedDebitorLineTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideDebitorLineTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDebitorLineTypeEntity>({
				dataServiceToken: lookups.BasicsSharedDebitorLineTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ledgercontext, i.e. the database table MDC_LEDGER_CONTEXT
	public static provideLedgerContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLedgerContextEntity>( {
				dataServiceToken: lookups.BasicsSharedLedgerContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLedgerContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLedgerContextEntity>({
				dataServiceToken: lookups.BasicsSharedLedgerContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.lineitemcontext, i.e. the database table MDC_LINEITEMCONTEXT
	public static provideLineItemContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLineItemContextEntity>( {
				dataServiceToken: lookups.BasicsSharedLineItemContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLineItemContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLineItemContextEntity>({
				dataServiceToken: lookups.BasicsSharedLineItemContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.markupcalculationtype, i.e. the database table MDC_MARKUP_CALC_TYPE
	public static provideMarkupCalculationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMarkupCalculationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMarkupCalculationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMarkupCalculationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMarkupCalculationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMarkupCalculationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialroundingconfigtype, i.e. the database table MDC_MAT_ROUNDCONFTYPE
	public static provideMaterialRoundingConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialRoundingConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialRoundingConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialRoundingConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialRoundingConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialRoundingConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialcatalogtype, i.e. the database table MDC_MATERIAL_CATALOG_TYPE
	public static provideMaterialCatalogTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialCatalogTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialCatalogTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialCatalogTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialCatalogTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialCatalogTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialportiontype, i.e. the database table MDC_MATERIAL_PORTION_TYPE
	public static provideMaterialPortionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialPortionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialPortionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialPortionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialPortionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialPortionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialtemplatetype, i.e. the database table MDC_MATERIALTEMPTYPE
	public static provideMaterialTemplateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialTemplateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialTemplateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialTemplateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialTemplateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialTemplateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialabc, i.e. the database table MDC_MATERIALABC
	public static provideMaterialAbcLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialAbcEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialAbcLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialAbcReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialAbcEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialAbcLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialstatus, i.e. the database table MDC_MATERIAL_STATUS
	public static provideMaterialStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialstatusrole, i.e. the database table MDC_MATERIAL_STATUSROLE
	public static provideMaterialStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialstatusrule, i.e. the database table MDC_MATERIAL_STATUSRULE
	public static provideMaterialStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialstatusworkflow, i.e. the database table MDC_MATERIAL_STATUSWORKFLOW
	public static provideMaterialStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.materialtype, i.e. the database table MDC_MATERIALTYPE
	public static provideMaterialTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMaterialTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMaterialTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMaterialTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMaterialTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pricelist, i.e. the database table MDC_PRICE_LIST
	public static providePriceListLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePriceListEntity>( {
				dataServiceToken: lookups.BasicsSharedPriceListLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePriceListReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePriceListEntity>({
				dataServiceToken: lookups.BasicsSharedPriceListLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.salestaxgroup, i.e. the database table MDC_SALES_TAX_GROUP
	public static provideSalesTaxGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesTaxGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedSalesTaxGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSalesTaxGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesTaxGroupEntity>({
				dataServiceToken: lookups.BasicsSharedSalesTaxGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.wagegroup, i.e. the database table MDC_WAGE_GROUP
	public static provideWageGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWageGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedWageGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWageGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWageGroupEntity>({
				dataServiceToken: lookups.BasicsSharedWageGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.wictype, i.e. the database table MDC_WIC_TYPE
	public static provideWICTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWICTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedWICTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWICTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWICTypeEntity>({
				dataServiceToken: lookups.BasicsSharedWICTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationcategories, i.e. the database table MDL_ANNOCATEGORY
	public static provideModelAnnotationCategoriesLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationCategoriesEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationCategoriesLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationCategoriesReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationCategoriesEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationCategoriesLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationdocumenttype, i.e. the database table MDL_ANNODOCTYPE
	public static provideModelAnnotationDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationreferencetype, i.e. the database table MDL_ANNOREFTYPE
	public static provideModelAnnotationReferenceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationReferenceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationReferenceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationReferenceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationReferenceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationReferenceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationstatus, i.e. the database table MDL_ANNOSTATUS
	public static provideModelAnnotationStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationstatusrole, i.e. the database table MDL_ANNOSTATUSROLE
	public static provideModelAnnotationStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationstatusrule, i.e. the database table MDL_ANNOSTATUSRULE
	public static provideModelAnnotationStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelannotationstatusworkflow, i.e. the database table MDL_ANNOSTATUSWRKFLW
	public static provideModelAnnotationStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelAnnotationStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelAnnotationStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedModelAnnotationStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelbasevaluetype, i.e. the database table MDL_BASEVALUETYPE
	public static provideModelBaseValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelBaseValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelBaseValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelBaseValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelBaseValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelBaseValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelchangesetstatus, i.e. the database table MDL_CHANGESETSTATUS
	public static provideModelChangeSetStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelChangeSetStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedModelChangeSetStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelChangeSetStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelChangeSetStatusEntity>({
				dataServiceToken: lookups.BasicsSharedModelChangeSetStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mdlchangetype, i.e. the database table MDL_CHANGETYPE
	public static provideMdlChangeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMdlChangeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMdlChangeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMdlChangeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMdlChangeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMdlChangeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modeldimensiontype, i.e. the database table MDL_DIMENSIONTYPE
	public static provideModelDimensionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelDimensionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelDimensionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelDimensionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelDimensionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelDimensionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelfilterstate, i.e. the database table MDL_FILTERSTATE
	public static provideModelFilterStateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelFilterStateEntity>( {
				dataServiceToken: lookups.BasicsSharedModelFilterStateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelFilterStateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelFilterStateEntity>({
				dataServiceToken: lookups.BasicsSharedModelFilterStateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelimportpatterntype, i.e. the database table MDL_IMPORTPATTERNTYPE
	public static provideModelImportPatternTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelImportPatternTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelImportPatternTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelImportPatternTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelImportPatternTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelImportPatternTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modellevelofdevelopment, i.e. the database table MDL_LOD
	public static provideModelLevelOfDevelopmentLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelLevelOfDevelopmentEntity>( {
				dataServiceToken: lookups.BasicsSharedModelLevelOfDevelopmentLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelLevelOfDevelopmentReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelLevelOfDevelopmentEntity>({
				dataServiceToken: lookups.BasicsSharedModelLevelOfDevelopmentLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelmarkershape, i.e. the database table MDL_MARKERSHAPE
	public static provideModelMarkerShapeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelMarkerShapeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelMarkerShapeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelMarkerShapeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelMarkerShapeEntity>({
				dataServiceToken: lookups.BasicsSharedModelMarkerShapeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelmarkertype, i.e. the database table MDL_MARKERTYPE
	public static provideModelMarkerTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelMarkerTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelMarkerTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelMarkerTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelMarkerTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelMarkerTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjectsetstatus, i.e. the database table MDL_OBJECTSETSTATUS
	public static provideModelObjectSetStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectSetStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjectsetstatusrole, i.e. the database table MDL_OBJECTSETSTATUSROLE
	public static provideModelObjectSetStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectSetStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjectsetstatusrule, i.e. the database table MDL_OBJECTSETSTATUSRULE
	public static provideModelObjectSetStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectSetStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjectsetstatusworkflow, i.e. the database table MDL_OBJECTSETSTATUSWRKFLW
	public static provideModelObjectSetStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectSetStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectSetStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjectsettype, i.e. the database table MDL_OBJECTSETTYPE
	public static provideModelObjectSetTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectSetTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectSetTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectSetTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectSetTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjecttexture, i.e. the database table MDL_OBJECTTEXTURE
	public static provideModelObjectTextureLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectTextureEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectTextureLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectTextureReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectTextureEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectTextureLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelobjectvisibility, i.e. the database table MDL_OBJECTVISIBILITY
	public static provideModelObjectVisibilityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectVisibilityEntity>( {
				dataServiceToken: lookups.BasicsSharedModelObjectVisibilityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelObjectVisibilityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelObjectVisibilityEntity>({
				dataServiceToken: lookups.BasicsSharedModelObjectVisibilityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelstakeholderrole, i.e. the database table MDL_STAKEHOLDER_ROLE
	public static provideModelStakeholderRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStakeholderRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelStakeholderRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelStakeholderRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStakeholderRoleEntity>({
				dataServiceToken: lookups.BasicsSharedModelStakeholderRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelstatus, i.e. the database table MDL_STATUS
	public static provideModelStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedModelStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusEntity>({
				dataServiceToken: lookups.BasicsSharedModelStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelstatusrole, i.e. the database table MDL_STATUSROLE
	public static provideModelStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedModelStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelstatusrule, i.e. the database table MDL_STATUSRULE
	public static provideModelStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedModelStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedModelStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelstatusworkflow, i.e. the database table MDL_STATUSWORKFLOW
	public static provideModelStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedModelStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedModelStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modeltype, i.e. the database table MDL_TYPE
	public static provideModelTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modeluommapping, i.e. the database table MDL_UOMMAPPING
	public static provideModelUomMappingLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelUomMappingEntity>( {
				dataServiceToken: lookups.BasicsSharedModelUomMappingLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelUomMappingReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelUomMappingEntity>({
				dataServiceToken: lookups.BasicsSharedModelUomMappingLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelvaluetype, i.e. the database table MDL_VALUETYPE
	public static provideModelValueTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelValueTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelValueTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelValueTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelValueTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelValueTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.modelviewpointtype, i.e. the database table MDL_VIEWPOINT_TYPE
	public static provideModelViewPointTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelViewPointTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedModelViewPointTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideModelViewPointTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeModelViewPointTypeEntity>({
				dataServiceToken: lookups.BasicsSharedModelViewPointTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingactivitystatusext, i.e. the database table MNT_ACT_STATUS2EXT
	public static provideMountingActivityStatusExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingActivityStatusExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusExternalEntity>({
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingactivitystatus, i.e. the database table MNT_ACT_STATUS
	public static provideMountingActivityStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingActivityStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingactivitystatusrole, i.e. the database table MNT_ACT_STATUSROLE
	public static provideMountingActivityStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingActivityStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingactivitystatusrule, i.e. the database table MNT_ACT_STATUSRULE
	public static provideMountingActivityStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingActivityStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingactivitystatusworkflow, i.e. the database table MNT_ACT_STATUSWORKFLOW
	public static provideMountingActivityStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingActivityStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingActivityStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMountingActivityStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingreportstatus, i.e. the database table MNT_REP_STATUS
	public static provideMountingReportStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingReportStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingReportStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMountingReportStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingreportstatusrole, i.e. the database table MNT_REP_STATUSROLE
	public static provideMountingReportStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingReportStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingReportStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMountingReportStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingreportstatusrule, i.e. the database table MNT_REP_STATUSRULE
	public static provideMountingReportStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingReportStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingReportStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMountingReportStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingreportstatusworkflow, i.e. the database table MNT_REP_STATUSWORKFLOW
	public static provideMountingReportStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingReportStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingReportStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingReportStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMountingReportStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingrequisitionstatusext, i.e. the database table MNT_REQ_STATUS2EXT
	public static provideMountingRequisitionStatusExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingRequisitionStatusExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusExternalEntity>({
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingrequisitionstatus, i.e. the database table MNT_REQ_STATUS
	public static provideMountingRequisitionStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingRequisitionStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingrequisitionstatusrole, i.e. the database table MNT_REQ_STATUSROLE
	public static provideMountingRequisitionStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingRequisitionStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingrequisitionrule, i.e. the database table MNT_REQ_STATUSRULE
	public static provideMountingRequisitionRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingRequisitionRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingRequisitionRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMountingRequisitionRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.mountingrequisitionstatusworkflow, i.e. the database table MNT_REQ_STATUSWORKFLOW
	public static provideMountingRequisitionStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMountingRequisitionStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMountingRequisitionStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMountingRequisitionStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingtype, i.e. the database table MTG_TYPE
	public static provideMeetingTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingattendeestatus, i.e. the database table MTG_ATTENDEESTATUS
	public static provideMeetingAttendeeStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingAttendeeStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingattendeestatusrole, i.e. the database table MTG_ATTENDEESTATUSROLE
	public static provideMeetingAttendeeStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingAttendeeStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingattendeestatusrule, i.e. the database table MTG_ATTENDEESTATUSRULE
	public static provideMeetingAttendeeStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingAttendeeStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingattendeestatusworkflow, i.e. the database table MTG_ATTENDEESTATUSWF
	public static provideMeetingAttendeeStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingAttendeeStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingAttendeeStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingAttendeeStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingstatus, i.e. the database table MTG_STATUS
	public static provideMeetingStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingstatusrole, i.e. the database table MTG_STATUSROLE
	public static provideMeetingStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingstatusrule, i.e. the database table MTG_STATUSRULE
	public static provideMeetingStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.meetingstatusworkflow, i.e. the database table MTG_STATUSWORKFLOW
	public static provideMeetingStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedMeetingStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeetingStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeetingStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedMeetingStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitactivitytype, i.e. the database table OBJ_ACTIVITYTYPE
	public static provideObjectUnitActivityTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitActivityTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitActivityTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitActivityTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitActivityTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitActivityTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitareatype, i.e. the database table OBJ_AREATYPE
	public static provideObjectUnitAreaTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitAreaTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitAreaTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitAreaTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitAreaTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitAreaTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.installment, i.e. the database table OBJ_INSTALLMENT
	public static provideInstallmentLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInstallmentEntity>( {
				dataServiceToken: lookups.BasicsSharedInstallmentLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInstallmentReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInstallmentEntity>({
				dataServiceToken: lookups.BasicsSharedInstallmentLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.installmentagreement, i.e. the database table OBJ_INSTALLMENTAGREEMENT
	public static provideInstallmentAgreementLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInstallmentAgreementEntity>( {
				dataServiceToken: lookups.BasicsSharedInstallmentAgreementLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInstallmentAgreementReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInstallmentAgreementEntity>({
				dataServiceToken: lookups.BasicsSharedInstallmentAgreementLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectinstallmentagreementstatus, i.e. the database table OBJ_INSTAGREESTATE
	public static provideObjectInstallmentAgreementStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectInstallmentAgreementStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusEntity>({
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectinstallmentagreementstatusrole, i.e. the database table OBJ_INSTAGREESTATEROLE
	public static provideObjectInstallmentAgreementStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectInstallmentAgreementStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectinstallmentagreementstatusrule, i.e. the database table OBJ_INSTAGREESTATERULE
	public static provideObjectInstallmentAgreementStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectInstallmentAgreementStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitinstallmentagreementworkflow, i.e. the database table OBJ_INSTAGREESTATEWFLW
	public static provideObjectInstallmentAgreementStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectInstallmentAgreementStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInstallmentAgreementStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedObjectInstallmentAgreementStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectinterest, i.e. the database table OBJ_INTEREST
	public static provideObjectInterestLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInterestEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectInterestLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectInterestReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectInterestEntity>({
				dataServiceToken: lookups.BasicsSharedObjectInterestLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectleveltype, i.e. the database table OBJ_LEVELTYPE
	public static provideObjectLevelTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectLevelTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectLevelTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectLevelTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectLevelTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectLevelTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.metertype, i.e. the database table OBJ_METERTYPE
	public static provideMeterTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeterTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMeterTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMeterTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMeterTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMeterTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objecttype, i.e. the database table OBJ_OBJECTTYPE
	public static provideObjectTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectpricelist, i.e. the database table OBJ_PRICELIST
	public static provideObjectPriceListLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectPriceListEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectPriceListLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectPriceListReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectPriceListEntity>({
				dataServiceToken: lookups.BasicsSharedObjectPriceListLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pricelistdetail, i.e. the database table OBJ_PRICELISTDETAIL
	public static provideObjectPriceListDetailLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectPriceListDetailEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectPriceListDetailLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectPriceListDetailReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectPriceListDetailEntity>({
				dataServiceToken: lookups.BasicsSharedObjectPriceListDetailLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectpricetype, i.e. the database table OBJ_PRICETYPE
	public static provideObjectPriceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectPriceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectPriceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectPriceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectPriceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectPriceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectprospectstatus, i.e. the database table OBJ_PROSPECTSTATUS
	public static provideObjectProspectStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectProspectStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusEntity>({
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectprospectstatusrole, i.e. the database table OBJ_PROSPECTSTATUSROLE
	public static provideObjectProspectStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectProspectStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectprospectstatusrule, i.e. the database table OBJ_PROSPECTSTATUSRULE
	public static provideObjectProspectStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectProspectStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitprospectworkflow, i.e. the database table OBJ_PROSPECTSTATUSWRKFLW
	public static provideObjectProspectStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectProspectStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectProspectStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedObjectProspectStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitcategory, i.e. the database table OBJ_UNITCATEGORY
	public static provideObjectUnitCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitdocumenttype, i.e. the database table OBJ_UNITDOCUMENTTYPE
	public static provideObjectUnitDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitkind, i.e. the database table OBJ_UNITKIND
	public static provideObjectUnitKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitKindEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitKindEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitsubtype, i.e. the database table OBJ_UNITSUBTYPE
	public static provideObjectUnitSubTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitSubTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitSubTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitSubTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitSubTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitSubTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunittype, i.e. the database table OBJ_UNITTYPE
	public static provideObjectUnitTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitTypeEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunittypespec, i.e. the database table OBJ_UNITTYPESPEC
	public static provideObjectUnitTypeSpecLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitTypeSpecEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitTypeSpecLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitTypeSpecReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitTypeSpecEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitTypeSpecLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitstatus, i.e. the database table OBJ_UNITSTATUS
	public static provideObjectUnitStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitstatusrole, i.e. the database table OBJ_UNITSTATUSROLE
	public static provideObjectUnitStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitstatusrule, i.e. the database table OBJ_UNITSTATUSRULE
	public static provideObjectUnitStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.objectunitstatusworkflow, i.e. the database table OBJ_UNITSTATUSWRKFLW
	public static provideObjectUnitStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideObjectUnitStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeObjectUnitStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedObjectUnitStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ordercondition, i.e. the database table ORD_CONDITION
	public static provideOrderConditionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderConditionEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderConditionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderConditionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderConditionEntity>({
				dataServiceToken: lookups.BasicsSharedOrderConditionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderpaymentschedulesstatus, i.e. the database table ORD_PS_STATUS
	public static provideOrderPaymentSchedulesStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderPaymentSchedulesStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusEntity>({
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderpaymentschedulesstatusrole, i.e. the database table ORD_PS_STATUSROLE
	public static provideOrderPaymentSchedulesStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderPaymentSchedulesStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderpaymentschedulesstatusrule, i.e. the database table ORD_PS_STATUSRULE
	public static provideOrderPaymentSchedulesStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderPaymentSchedulesStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderpaymentschedulesstatusworkflow, i.e. the database table ORD_PS_STATUSWORKFLOW
	public static provideOrderPaymentSchedulesStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderPaymentSchedulesStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderPaymentSchedulesStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedOrderPaymentSchedulesStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderstatus, i.e. the database table ORD_STATUS
	public static provideOrderStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusEntity>({
				dataServiceToken: lookups.BasicsSharedOrderStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderstatusrole, i.e. the database table ORD_STATUSROLE
	public static provideOrderStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedOrderStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderstatusrule, i.e. the database table ORD_STATUSRULE
	public static provideOrderStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedOrderStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderstatusworkflow, i.e. the database table ORD_STATUSWORKFLOW
	public static provideOrderStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedOrderStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ordertype, i.e. the database table ORD_TYPE
	public static provideOrderTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderTypeEntity>({
				dataServiceToken: lookups.BasicsSharedOrderTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.orderwarrentytype, i.e. the database table ORD_WARRENTY_TYPE
	public static provideOrderWarrentyTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderWarrentyTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedOrderWarrentyTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideOrderWarrentyTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeOrderWarrentyTypeEntity>({
				dataServiceToken: lookups.BasicsSharedOrderWarrentyTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accrualmode, i.e. the database table PES_ACCRUALMODE
	public static providePesAccrualModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesAccrualModeEntity>( {
				dataServiceToken: lookups.BasicsSharedPesAccrualModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePesAccrualModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesAccrualModeEntity>({
				dataServiceToken: lookups.BasicsSharedPesAccrualModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pesstatus2external, i.e. the database table PES_STATUS2EXTERNAL
	public static providePesStatus2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatus2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedPesStatus2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePesStatus2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatus2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedPesStatus2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pesstatus, i.e. the database table PES_STATUS
	public static providePesStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPesStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePesStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPesStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pesstatusrole, i.e. the database table PES_STATUSROLE
	public static providePesStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPesStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePesStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPesStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pesstatusrule, i.e. the database table PES_STATUSRULE
	public static providePesStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPesStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePesStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPesStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.pesstatusworkflow, i.e. the database table PES_STATUSWORKFLOW
	public static providePesStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPesStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePesStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePesStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPesStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.quotationstatus, i.e. the database table QTN_STATUS
	public static provideQuotationStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedQuotationStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQuotationStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusEntity>({
				dataServiceToken: lookups.BasicsSharedQuotationStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.quotationstatusrole, i.e. the database table QTN_STATUSROLE
	public static provideQuotationStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedQuotationStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQuotationStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedQuotationStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.quotationstatusrule, i.e. the database table QTN_STATUSRULE
	public static provideQuotationStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedQuotationStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQuotationStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedQuotationStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.quotationstatusworkflow, i.e. the database table QTN_STATUSWORKFLOW
	public static provideQuotationStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedQuotationStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQuotationStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedQuotationStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.quotationtype, i.e. the database table QTN_TYPE
	public static provideQuotationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQuotationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQuotationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQuotationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQuotationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reqstatus, i.e. the database table REQ_STATUS
	public static provideReqStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedReqStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReqStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusEntity>({
				dataServiceToken: lookups.BasicsSharedReqStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reqstatusrole, i.e. the database table REQ_STATUSROLE
	public static provideReqStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedReqStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReqStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedReqStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reqstatusrule, i.e. the database table REQ_STATUSRULE
	public static provideReqStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedReqStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReqStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedReqStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reqstatusworkflow, i.e. the database table REQ_STATUSWORKFLOW
	public static provideReqStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedReqStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReqStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedReqStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reqtype, i.e. the database table REQ_TYPE
	public static provideReqTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedReqTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReqTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReqTypeEntity>({
				dataServiceToken: lookups.BasicsSharedReqTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqbusinesspartnerstatus, i.e. the database table RFQ_BUSINESSPARTNERSTATUS
	public static provideRfqBusinessPartnerStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqBusinessPartnerStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusEntity>({
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqbusinesspartnerstatusrole, i.e. the database table RFQ_BP_STATUSROLE
	public static provideRfqBusinessPartnerStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqBusinessPartnerStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqbusinesspartnerstatusrule, i.e. the database table RFQ_BP_STATUSRULE
	public static provideRfqBusinessPartnerStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqBusinessPartnerStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqbusinesspartnerstatusworkflow, i.e. the database table RFQ_BP_STATUSWORKFLOW
	public static provideRfqBusinessPartnerStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqBusinessPartnerStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqBusinessPartnerStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedRfqBusinessPartnerStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqrejectionreason, i.e. the database table RFQ_REJECTIONREASON
	public static provideRfqRejectionReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqRejectionReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqRejectionReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqRejectionReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqRejectionReasonEntity>({
				dataServiceToken: lookups.BasicsSharedRfqRejectionReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqstatus, i.e. the database table RFQ_STATUS
	public static provideRfqStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusEntity>({
				dataServiceToken: lookups.BasicsSharedRfqStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqstatusrole, i.e. the database table RFQ_STATUSROLE
	public static provideRfqStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedRfqStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqstatusrule, i.e. the database table RFQ_STATUSRULE
	public static provideRfqStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedRfqStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqstatusworkflow, i.e. the database table RFQ_STATUSWORKFLOW
	public static provideRfqStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedRfqStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfqtype, i.e. the database table RFQ_TYPE
	public static provideRfqTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRfqTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfqTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfqTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRfqTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsdefaultcategory, i.e. the database table PPS_DEFAULT_CATEGORY
	public static providePpsDefaultCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsDefaultCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsDefaultCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsDefaultCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsDefaultCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedPpsDefaultCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsdocumenttype, i.e. the database table PPS_DOCUMENT_TYPE
	public static providePpsDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsentity, i.e. the database table PPS_ENTITY
	public static providePpsEntityLookupOverload<T extends object>(showClearBtn: boolean, clientSideFilter?: ILookupClientSideFilter<entities.IBasicsCustomizePpsEntityEntity, T>): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, entities.IBasicsCustomizePpsEntityEntity>({
				dataServiceToken: lookups.BasicsSharedPpsEntityLookupService,
				showClearButton: showClearBtn,
				clientSideFilter: clientSideFilter,
			}),
		};
	}

	public static providePpsEntityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsEntityEntity>({
				dataServiceToken: lookups.BasicsSharedPpsEntityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsfilterhierarchy, i.e. the database table PPS_FILTER_HIERARCHY
	public static providePpsFilterHierarchyLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsFilterHierarchyEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsFilterHierarchyLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsFilterHierarchyReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsFilterHierarchyEntity>({
				dataServiceToken: lookups.BasicsSharedPpsFilterHierarchyLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsgenericeventstatus, i.e. the database table PPS_GENERIC_EVENT_STATUS
	public static providePpsGenericEventStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsGenericEventStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsgenericeventstatusrole, i.e. the database table PPS_GENERIC_EVENT_STATUSROLE
	public static providePpsGenericEventStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsGenericEventStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsgenericeventstatusrule, i.e. the database table PPS_GENERIC_EVENT_STATUSRULE
	public static providePpsGenericEventStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsGenericEventStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsgenericeventstatusworkflow, i.e. the database table PPS_GENERIC_EVENT_STATUSWORKFLOW
	public static providePpsGenericEventStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsGenericEventStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsGenericEventStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsGenericEventStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsheadergroup, i.e. the database table PPS_HEADER_GROUP
	public static providePpsHeaderGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsHeaderGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsHeaderGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderGroupEntity>({
				dataServiceToken: lookups.BasicsSharedPpsHeaderGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsheaderstatus, i.e. the database table PPS_HEADER_STATUS
	public static providePpsHeaderStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsHeaderStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsheaderstatusrole, i.e. the database table PPS_HEADER_STATUSROLE
	public static providePpsHeaderStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsHeaderStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsheaderstatusrule, i.e. the database table PPS_HEADER_STATUSRULE
	public static providePpsHeaderStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsHeaderStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsheaderstatusworkflow, i.e. the database table PPS_HEADER_STATUSWORKFLOW
	public static providePpsHeaderStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsHeaderStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsHeaderStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsheadertype, i.e. the database table PPS_HEADER_TYPE
	public static providePpsHeaderTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsHeaderTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsHeaderTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsHeaderTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsHeaderTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemfilteroptions, i.e. the database table PPS_ITEM_FILTER_OPTIONS
	public static providePpsItemFilterOptionsLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemFilterOptionsEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemFilterOptionsLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemFilterOptionsReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemFilterOptionsEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemFilterOptionsLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemstatusext, i.e. the database table PPS_ITEM_STATUS2EXT
	public static providePpsItemStatusExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemStatusExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemStatusExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusExternalEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemStatusExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemstatus, i.e. the database table PPS_ITEM_STATUS
	public static providePpsItemStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemstatusrole, i.e. the database table PPS_ITEM_STATUSROLE
	public static providePpsItemStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemstatusrule, i.e. the database table PPS_ITEM_STATUSRULE
	public static providePpsItemStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemstatusworkflow, i.e. the database table PPS_ITEM_STATUSWORKFLOW
	public static providePpsItemStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsitemtype, i.e. the database table PPS_ITEM_TYPE
	public static providePpsItemTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsItemTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsItemTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsItemTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsItemTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppslogreason, i.e. the database table PPS_LOGREASON
	public static providePpsLogReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsLogReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsLogReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsLogReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsLogReasonEntity>({
				dataServiceToken: lookups.BasicsSharedPpsLogReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppslogreasongroup, i.e. the database table PPS_LOGREASON_GROUP
	public static providePpsLogReasonGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsLogReasonGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsLogReasonGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsLogReasonGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsLogReasonGroupEntity>({
				dataServiceToken: lookups.BasicsSharedPpsLogReasonGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsmaterialsitegroup, i.e. the database table PPS_MAT_SITE_GRP
	public static providePpsMaterialSiteGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsMaterialSiteGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsMaterialSiteGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsMaterialSiteGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsMaterialSiteGroupEntity>({
				dataServiceToken: lookups.BasicsSharedPpsMaterialSiteGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsphasetype, i.e. the database table PPS_PHASE_TYPE
	public static providePpsPhaseTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsPhaseTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsPhaseTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsPhaseTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsphaserequirementstatus, i.e. the database table PPS_PHASE_REQ_STATUS
	public static providePpsPhaseRequirementStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsPhaseRequirementStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsphaserequirementstatusrole, i.e. the database table PPS_PHASE_REQ_STATUSROLE
	public static providePpsPhaseRequirementStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsPhaseRequirementStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsphaserequirementstatusrule, i.e. the database table PPS_PHASE_REQ_STATUSRULE
	public static providePpsPhaseRequirementStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsPhaseRequirementStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsphaserequirementstatusworkflow, i.e. the database table PPS_PHASE_REQ_STATUSWORKFLOW
	public static providePpsPhaseRequirementStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsPhaseRequirementStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPhaseRequirementStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsPhaseRequirementStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsplannedquantitytype, i.e. the database table PPS_PLANNED_QUANTITY_TYPE
	public static providePpsPlannedQuantityTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPlannedQuantityTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsPlannedQuantityTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsPlannedQuantityTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsPlannedQuantityTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsPlannedQuantityTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsprocesstype, i.e. the database table PPS_PROCESS_TYPE
	public static providePpsProcessTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProcessTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProcessTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProcessTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProcessTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProcessTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.PPSProductionMaterialGroup, i.e. the database table PPS_PROD_MAT_GROUP
	public static providePpsProductionMaterialGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionMaterialGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductionMaterialGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductionMaterialGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionMaterialGroupEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductionMaterialGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductplacetype, i.e. the database table PPS_PROD_PLACE_TYPE
	public static providePpsProductPlaceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductPlaceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductPlaceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductPlaceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductPlaceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductPlaceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductionsetstatusext, i.e. the database table PPS_PROD_SET_STATUS2EXT
	public static providePpsProductionSetStatusExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetStatusExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductionSetStatusExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductionSetStatusExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetStatusExternalEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductionSetStatusExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductionsetstatus, i.e. the database table PPS_PROD_SET_STATUS
	public static providePpsProductionSetStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductionSetStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductionSetStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductionSetStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductionsetrole, i.e. the database table PPS_PRODSET_STATUSROLE
	public static providePpsProductionSetRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductionSetRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductionSetRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductionSetRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductionsetrule, i.e. the database table PPS_PRODSET_STATUSRULE
	public static providePpsProductionSetRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductionSetRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductionSetRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductionSetRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductionsetworkflow, i.e. the database table PPS_PRODSET_STATUSWFLOW
	public static providePpsProductionSetWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductionSetWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductionSetWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductionSetWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductionSetWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductstatus, i.e. the database table PPS_PRODUCT_STATUS
	public static providePpsProductStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductstatusrole, i.e. the database table PPS_PRODUCT_STATUSROLE
	public static providePpsProductStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductstatusrule, i.e. the database table PPS_PRODUCT_STATUSRULE
	public static providePpsProductStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductstatusworkflow, i.e. the database table PPS_PRODUCT_STATUSWORKFLOW
	public static providePpsProductStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsproductstatus2external, i.e. the database table PPS_PRODSTATUS2EXTERNAL
	public static providePpsProductStatus2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatus2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsProductStatus2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsProductStatus2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsProductStatus2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedPpsProductStatus2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsreproductionreason, i.e. the database table PPS_REPROD_REASON
	public static providePpsReproductionReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsReproductionReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsReproductionReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsReproductionReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsReproductionReasonEntity>({
				dataServiceToken: lookups.BasicsSharedPpsReproductionReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsupstreamgoodstype, i.e. the database table PPS_UPSTREAM_GOODS_TYPE
	public static providePpsUpstreamGoodsTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamGoodsTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsUpstreamGoodsTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsUpstreamGoodsTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamGoodsTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsUpstreamGoodsTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsupstreamitemstatus, i.e. the database table PPS_UPSTREAM_ITEM_STATUS
	public static providePpsUpstreamItemStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsUpstreamItemStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsupstreamitemstatusrole, i.e. the database table PPS_UPSTREAM_ITEM_STATUSROLE
	public static providePpsUpstreamItemStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsUpstreamItemStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsupstreamitemstatusrule, i.e. the database table PPS_UPSTREAM_ITEM_STATUSRULE
	public static providePpsUpstreamItemStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsUpstreamItemStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsupstreamitemstatusworkflow, i.e. the database table PPS_UPSTREAM_ITEM_STATUSWORKFLOW
	public static providePpsUpstreamItemStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsUpstreamItemStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamItemStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPpsUpstreamItemStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.ppsupstreamtype, i.e. the database table PPS_UPSTREAM_TYPE
	public static providePpsUpstreamTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPpsUpstreamTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePpsUpstreamTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePpsUpstreamTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPpsUpstreamTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.accounttype, i.e. the database table PRC_ACCOUNTTYPE
	public static provideAccountTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedAccountTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAccountTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAccountTypeEntity>({
				dataServiceToken: lookups.BasicsSharedAccountTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcaccountlookup, i.e. the database table PRC_ACCOUNTLOOKUP
	public static providePrcAccountLookupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcAccountLookupEntity>( {
				dataServiceToken: lookups.BasicsSharedPrcAccountLookupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrcAccountLookupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcAccountLookupEntity>({
				dataServiceToken: lookups.BasicsSharedPrcAccountLookupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementadvancetype, i.e. the database table PRC_ADVANCETYPE
	public static provideProcurementAdvanceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementAdvanceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementAdvanceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementAdvanceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementAdvanceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementAdvanceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.awardmethod, i.e. the database table PRC_AWARDMETHOD
	public static provideAwardMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAwardMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedAwardMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAwardMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAwardMethodEntity>({
				dataServiceToken: lookups.BasicsSharedAwardMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.communiationchannel, i.e. the database table PRC_COMMUNICATIONCHANNEL
	public static provideCommuniationChannelLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCommuniationChannelEntity>( {
				dataServiceToken: lookups.BasicsSharedCommuniationChannelLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideCommuniationChannelReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeCommuniationChannelEntity>({
				dataServiceToken: lookups.BasicsSharedCommuniationChannelLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementconfigheadertype, i.e. the database table PRC_CONFIGHEADER_TYPE
	public static provideProcurementConfigurationHeaderTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementConfigurationHeaderTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementConfigurationHeaderTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementConfigurationHeaderTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementConfigurationHeaderTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementConfigurationHeaderTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementcontracttype, i.e. the database table PRC_CONTRACTTYPE
	public static provideProcurementContractTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementContractTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementContractTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementContractTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementContractTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementContractTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementcontractcopymode, i.e. the database table PRC_COPYMODE
	public static provideProcurementContractCopyModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementContractCopyModeEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementContractCopyModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementContractCopyModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementContractCopyModeEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementContractCopyModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementdocumentstatus, i.e. the database table PRC_DOCUMENTSTATUS
	public static provideProcurementDocumentStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementDocumentStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementdocumentstatusrole, i.e. the database table PRC_DOCUMENTSTATUSROLE
	public static provideProcurementDocumentStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementDocumentStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementdocumentstatusrule, i.e. the database table PRC_DOCUMENTSTATUSRULE
	public static provideProcurementDocumentStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementDocumentStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementdocumentstatusworkflow, i.e. the database table PRC_DOCUMENTSTAWORKFLOW
	public static provideProcurementDocumentStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementDocumentStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementDocumentStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementdocumenttype, i.e. the database table PRC_DOCUMENTTYPE
	public static provideProcurementDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prceventtype, i.e. the database table PRC_EVENTTYPE
	public static providePrcEventtypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcEventtypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPrcEventtypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrcEventtypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcEventtypeEntity>({
				dataServiceToken: lookups.BasicsSharedPrcEventtypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.generaltype, i.e. the database table PRC_GENERALSTYPE
	public static provideGeneralTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGeneralTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedGeneralTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideGeneralTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeGeneralTypeEntity>({
				dataServiceToken: lookups.BasicsSharedGeneralTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.incoterm, i.e. the database table PRC_INCOTERM
	public static provideIncoTermLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeIncoTermEntity>( {
				dataServiceToken: lookups.BasicsSharedIncoTermLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideIncoTermReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeIncoTermEntity>({
				dataServiceToken: lookups.BasicsSharedIncoTermLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcitemevaluation, i.e. the database table PRC_ITEMEVALUATION
	public static provideProcurementItemEvaluationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemEvaluationEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementItemEvaluationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementItemEvaluationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemEvaluationEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementItemEvaluationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcitemstatus2external, i.e. the database table PRC_ITEMSTATUS2EXTERNAL
	public static provideProcurementItemStatus2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatus2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementItemStatus2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementItemStatus2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatus2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementItemStatus2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcitemstatus, i.e. the database table PRC_ITEMSTATUS
	public static provideProcurementItemStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementItemStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcitemstatusrole, i.e. the database table PRC_ITEMSTATUSROLE
	public static provideProcurementItemStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementItemStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcitemstatusrule, i.e. the database table PRC_ITEMSTATUSRULE
	public static provideProcurementItemStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementItemStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcitemstatusworkflow, i.e. the database table PRC_ITEMSTATUSWORKFLOW
	public static provideProcurementItemStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementItemStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementItemStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementItemStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.milestonetype, i.e. the database table PRC_MILESTONETYPE
	public static provideMilestoneTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMilestoneTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedMilestoneTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideMilestoneTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeMilestoneTypeEntity>({
				dataServiceToken: lookups.BasicsSharedMilestoneTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcpackagetemplate, i.e. the database table PRC_PACKAGETEMPLATE
	public static providePrcPackageTemplateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcPackageTemplateEntity>( {
				dataServiceToken: lookups.BasicsSharedPrcPackageTemplateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrcPackageTemplateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcPackageTemplateEntity>({
				dataServiceToken: lookups.BasicsSharedPrcPackageTemplateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcpackagetemplateitem, i.e. the database table PRC_PACKAGETEMPLATEITEM
	public static providePrcPackageTemplateItemLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcPackageTemplateItemEntity>( {
				dataServiceToken: lookups.BasicsSharedPrcPackageTemplateItemLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrcPackageTemplateItemReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcPackageTemplateItemEntity>({
				dataServiceToken: lookups.BasicsSharedPrcPackageTemplateItemLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.packagetype, i.e. the database table PRC_PACKAGETYPE
	public static providePackageTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPackageTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePackageTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPackageTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.packagestatus, i.e. the database table PRC_PACKAGESTATUS
	public static providePackageStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPackageStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePackageStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPackageStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.packagestatusrole, i.e. the database table PRC_PACKAGESTATUSROLE
	public static providePackageStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPackageStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePackageStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPackageStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.packagestatusrule, i.e. the database table PRC_PACKAGESTATUSRULE
	public static providePackageStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPackageStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePackageStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPackageStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.packagestatusworkflow, i.e. the database table PRC_PACKAGESTATUSWORKFLOW
	public static providePackageStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPackageStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePackageStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePackageStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPackageStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.priceconditiontype, i.e. the database table PRC_PRICECONDITIONTYPE
	public static providePriceConditionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePriceConditionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPriceConditionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePriceConditionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePriceConditionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPriceConditionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementpaymentschedulestatus, i.e. the database table PRC_PS_STATUS
	public static provideProcurementPaymentScheduleStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementPaymentScheduleStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementpaymentschedulestatusrole, i.e. the database table PRC_PS_STATUSROLE
	public static provideProcurementPaymentScheduleStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementPaymentScheduleStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementpaymentschedulestatusrule, i.e. the database table PRC_PS_STATUSRULE
	public static provideProcurementPaymentScheduleStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementPaymentScheduleStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.procurementpaymentschedulestatusworkflow, i.e. the database table PRC_PS_STATUSWORKFLOW
	public static provideProcurementPaymentScheduleStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProcurementPaymentScheduleStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProcurementPaymentScheduleStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProcurementPaymentScheduleStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.radius, i.e. the database table PRC_RADIUS
	public static provideRadiusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRadiusEntity>( {
				dataServiceToken: lookups.BasicsSharedRadiusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRadiusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRadiusEntity>({
				dataServiceToken: lookups.BasicsSharedRadiusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.stocktransaction2rubriccategory, i.e. the database table PRC_STCKTRANTYPE2RUB_CAT
	public static provideStocktransaction2RubricCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStocktransaction2RubricCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedStocktransaction2RubricCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideStocktransaction2RubricCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStocktransaction2RubricCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedStocktransaction2RubricCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.strategy, i.e. the database table PRC_STRATEGY
	public static provideStrategyLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStrategyEntity>( {
				dataServiceToken: lookups.BasicsSharedStrategyLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideStrategyReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStrategyEntity>({
				dataServiceToken: lookups.BasicsSharedStrategyLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.structuretype, i.e. the database table PRC_STRUCTURETYPE
	public static provideStructureTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStructureTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedStructureTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideStructureTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeStructureTypeEntity>({
				dataServiceToken: lookups.BasicsSharedStructureTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcstocktransactiontype, i.e. the database table PRC_STOCKTRANSACTIONTYPE
	public static providePrcStockTransactionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcStockTransactionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPrcStockTransactionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrcStockTransactionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcStockTransactionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPrcStockTransactionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prcsystemeventtype, i.e. the database table PRC_SYSTEMEVENTTYPE
	public static providePrcSystemEventTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcSystemEventTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedPrcSystemEventTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrcSystemEventTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrcSystemEventTypeEntity>({
				dataServiceToken: lookups.BasicsSharedPrcSystemEventTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.texttype, i.e. the database table PRC_TEXTTYPE
	public static provideTextTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTextTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTextTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTextTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTextTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.totalkind, i.e. the database table PRC_TOTALKIND
	public static provideTotalKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTotalKindEntity>( {
				dataServiceToken: lookups.BasicsSharedTotalKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTotalKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTotalKindEntity>({
				dataServiceToken: lookups.BasicsSharedTotalKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectactiontype, i.e. the database table PRJ_ACTIONTYPE
	public static provideProjectActionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectActionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectActionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectActionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectActionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectActionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectcatalogconfigurationtype, i.e. the database table PRJ_CAT_CONFIGTYPE
	public static provideProjectCatalogConfigurationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectCatalogConfigurationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectCatalogConfigurationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectCatalogConfigurationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectCatalogConfigurationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectCatalogConfigurationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectcategory, i.e. the database table PRJ_CATEGORY
	public static provideProjectCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedProjectCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectchangecontributiontype, i.e. the database table PRJ_CHANCECONTRIBUTION_TYPE
	public static provideProjectChangeContributionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeContributionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectChangeContributionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectChangeContributionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeContributionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectChangeContributionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectchance, i.e. the database table PRJ_CHANCES
	public static provideProjectChanceLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChanceEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectChanceLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectChanceReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChanceEntity>({
				dataServiceToken: lookups.BasicsSharedProjectChanceLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectchangestatus, i.e. the database table PRJ_CHANGESTATUS
	public static provideProjectChangeStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectChangeStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectchangestatusrole, i.e. the database table PRJ_CHANGESTATUSROLE
	public static provideProjectChangeStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectChangeStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectchangestatusrule, i.e. the database table PRJ_CHANGESTATUSRULE
	public static provideProjectChangeStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectChangeStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectchangestatusworkflow, i.e. the database table PRJ_CHANGESTATUSWORKFLOW
	public static provideProjectChangeStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectChangeStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectChangeStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProjectChangeStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.changereason, i.e. the database table PRJ_CHANGEREASON
	public static provideChangeReasonLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChangeReasonEntity>( {
				dataServiceToken: lookups.BasicsSharedChangeReasonLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideChangeReasonReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChangeReasonEntity>({
				dataServiceToken: lookups.BasicsSharedChangeReasonLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.changetype, i.e. the database table PRJ_CHANGETYPE
	public static provideChangeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChangeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedChangeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideChangeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeChangeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedChangeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectclassification, i.e. the database table PRJ_CLASSIFICATION
	public static provideProjectClassificationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectClassificationEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectClassificationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectClassificationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectClassificationEntity>({
				dataServiceToken: lookups.BasicsSharedProjectClassificationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectcontenttype, i.e. the database table PRJ_CONTENT_TYPE
	public static provideProjectContentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectContentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectContentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectContentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectcontext, i.e. the database table PRJ_CONTEXT
	public static provideProjectContextLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContextEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectContextLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectContextReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContextEntity>({
				dataServiceToken: lookups.BasicsSharedProjectContextLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectcontracttype, i.e. the database table PRJ_CONTRACT_TYPE
	public static provideProjectContractTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContractTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectContractTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectContractTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContractTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectContractTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectcontractroletype, i.e. the database table PRJ_CONTACTROLETYPE
	public static provideProjectContractRoleTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContractRoleTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectContractRoleTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectContractRoleTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectContractRoleTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectContractRoleTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.prjcontrollingunittemplate, i.e. the database table PRJ_CONTRUNITTEMPLATE
	public static providePrjControllingUnitTemplateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrjControllingUnitTemplateEntity>( {
				dataServiceToken: lookups.BasicsSharedPrjControllingUnitTemplateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePrjControllingUnitTemplateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePrjControllingUnitTemplateEntity>({
				dataServiceToken: lookups.BasicsSharedPrjControllingUnitTemplateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdecision, i.e. the database table PRJ_DECISION
	public static provideProjectDecisionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDecisionEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDecisionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDecisionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDecisionEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDecisionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentcategory2type, i.e. the database table PRJ_DOCCATEGORY2DOCTYPE
	public static provideProjectDocumentCategory2TypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentCategory2TypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentCategory2TypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentCategory2TypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentCategory2TypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentCategory2TypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentcategory, i.e. the database table PRJ_DOCUMENTCATEGORY
	public static provideProjectDocumentCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentoperation, i.e. the database table PRJ_DOCUMENT_OPERATION
	public static provideProjectDocumentOperationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentOperationEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentOperationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentOperationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentOperationEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentOperationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentstatus, i.e. the database table PRJ_DOCUMENTSTATUS
	public static provideProjectDocumentStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentStatusReadonlyLookupOverload< T extends object>(imageSelector?: ILookupImageSelector<entities.IBasicsCustomizeProjectDocumentStatusEntity, T>) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusLookupService,
				showClearButton: false,
				imageSelector,
				displayMember: 'DescriptionInfo'
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentstatusrole, i.e. the database table PRJ_DOCUMENTSTATUSROLE
	public static provideProjectDocumentStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentstatusrule, i.e. the database table PRJ_DOCUMENTSTATUSRULE
	public static provideProjectDocumentStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumentstatusworkflow, i.e. the database table PRJ_DOCUMENTSTAWORKFLOW
	public static provideProjectDocumentStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectdocumenttype, i.e. the database table PRJ_DOCUMENTTYPE
	public static provideProjectDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFileTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedFileTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectgroupstatus, i.e. the database table PRJ_GROUPSTATUS
	public static provideProjectGroupStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectGroupStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectgroupstatusrole, i.e. the database table PRJ_GROUPSTATUSROLE
	public static provideProjectGroupStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectGroupStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectgroupstatusrule, i.e. the database table PRJ_GROUPSTATUSRULE
	public static provideProjectGroupStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectGroupStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectgroupstatusworkflow, i.e. the database table PRJ_GROUPSTATWRKFLW
	public static provideProjectGroupStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectGroupStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectGroupStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProjectGroupStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectkind, i.e. the database table PRJ_KIND
	public static provideProjectKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectKindEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectKindEntity>({
				dataServiceToken: lookups.BasicsSharedProjectKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectoutcome, i.e. the database table PRJ_OUTCOME
	public static provideProjectOutcomeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectOutcomeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectOutcomeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectOutcomeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectOutcomeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectOutcomeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectmode, i.e. the database table PRJ_PROJECTMODE
	public static provideProjectModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectModeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectModeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectquantitycontrol, i.e. the database table PRJ_QUANTITYCONTROL
	public static provideProjectQuantityControlLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectQuantityControlEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectQuantityControlLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectQuantityControlReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectQuantityControlEntity>({
				dataServiceToken: lookups.BasicsSharedProjectQuantityControlLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectregion, i.e. the database table PRJ_REGION
	public static provideProjectRegionLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectRegionEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectRegionLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectRegionReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectRegionEntity>({
				dataServiceToken: lookups.BasicsSharedProjectRegionLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rficontributiontype, i.e. the database table PRJ_RFICONTRIBUTION_TYPE
	public static provideRfIContributionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIContributionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRfIContributionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfIContributionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIContributionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRfIContributionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfi2projectchangetype, i.e. the database table PRJ_RFI2CHANGETYPE
	public static provideRequestForInfo2ProjectChangeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRequestForInfo2ProjectChangeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRequestForInfo2ProjectChangeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRequestForInfo2ProjectChangeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRequestForInfo2ProjectChangeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRequestForInfo2ProjectChangeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfi2defecttype, i.e. the database table PRJ_RFI2DEFECTTYPE
	public static provideRequestForInfo2DefectTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRequestForInfo2DefectTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRequestForInfo2DefectTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRequestForInfo2DefectTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRequestForInfo2DefectTypeEntity>({
				dataServiceToken: lookups.BasicsSharedRequestForInfo2DefectTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfigroup, i.e. the database table PRJ_RFIGROUP
	public static provideRfIGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedRfIGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfIGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIGroupEntity>({
				dataServiceToken: lookups.BasicsSharedRfIGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfistatus, i.e. the database table PRJ_RFISTATUS
	public static provideRfIStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedRfIStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfIStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusEntity>({
				dataServiceToken: lookups.BasicsSharedRfIStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfistatusrole, i.e. the database table PRJ_RFISTATUSROLE
	public static provideRfIStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedRfIStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfIStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedRfIStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfistatusrule, i.e. the database table PRJ_RFISTATUSRULE
	public static provideRfIStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedRfIStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfIStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedRfIStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfistatusworkflow, i.e. the database table PRJ_RFISTATUSWORKFLOW
	public static provideRfIStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedRfIStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfIStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfIStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedRfIStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.rfitype, i.e. the database table PRJ_RFITYPE
	public static provideRfITypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfITypeEntity>( {
				dataServiceToken: lookups.BasicsSharedRfITypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRfITypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRfITypeEntity>({
				dataServiceToken: lookups.BasicsSharedRfITypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstadium, i.e. the database table PRJ_STADIUM
	public static provideProjectStadiumLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStadiumEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStadiumLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStadiumReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStadiumEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStadiumLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstatus, i.e. the database table PRJ_STATUS
	public static provideProjectStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstatusrole, i.e. the database table PRJ_STATUSROLE
	public static provideProjectStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstatusrule, i.e. the database table PRJ_STATUSRULE
	public static provideProjectStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstatusworkflow, i.e. the database table PRJ_STATUSWORKFLOW
	public static provideProjectStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstock2materialstatus, i.e. the database table PRJ_STOCK2MAT_STATUS
	public static provideProjectStock2MaterialStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStock2MaterialStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstock2materialstatusrole, i.e. the database table PRJ_STOCK2MAT_STATUSROLE
	public static provideProjectStock2MaterialStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStock2MaterialStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstock2materialstatusrule, i.e. the database table PRJ_STOCK2MAT_STATUSRULE
	public static provideProjectStock2MaterialStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStock2MaterialStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstock2materialstatusworkflow, i.e. the database table PRJ_STOCK2MAT_STATUSWORKFLOW
	public static provideProjectStock2MaterialStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStock2MaterialStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStock2MaterialStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStock2MaterialStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstockaccountingtype, i.e. the database table PRJ_STOCKACCOUNTINGTYPE
	public static provideProjectStockAccountingTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStockAccountingTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStockAccountingTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStockAccountingTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStockAccountingTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStockAccountingTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstocktype, i.e. the database table PRJ_STOCK_TYPE
	public static provideProjectStockTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStockTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStockTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStockTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStockTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStockTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projectstockvaluationrule, i.e. the database table PRJ_STOCKVALUATIONRULE
	public static provideProjectStockValuationRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStockValuationRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectStockValuationRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectStockValuationRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectStockValuationRuleEntity>({
				dataServiceToken: lookups.BasicsSharedProjectStockValuationRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.projecttype, i.e. the database table PRJ_TYPE
	public static provideProjectTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedProjectTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProjectTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProjectTypeEntity>({
				dataServiceToken: lookups.BasicsSharedProjectTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.revenuerecognitionconfiguration, i.e. the database table PRR_CONFIGURATION
	public static provideRevenueRecognitionConfigurationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionConfigurationEntity>( {
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionConfigurationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRevenueRecognitionConfigurationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionConfigurationEntity>({
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionConfigurationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.revenuerecognitionmethod, i.e. the database table PRR_METHOD
	public static provideRevenueRecognitionMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRevenueRecognitionMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionMethodEntity>({
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.revenuerecognitionstatus, i.e. the database table PRR_STATUS
	public static provideRevenueRecognitionStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRevenueRecognitionStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusEntity>({
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.revenuerecognitionstatusrole, i.e. the database table PRR_STATUSROLE
	public static provideRevenueRecognitionStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRevenueRecognitionStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.revenuerecognitionstatusrule, i.e. the database table PRR_STATUSRULE
	public static provideRevenueRecognitionStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRevenueRecognitionStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.revenuerecognitionstatusworkflow, i.e. the database table PRR_STATUSWORKFLOW
	public static provideRevenueRecognitionStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRevenueRecognitionStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRevenueRecognitionStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedRevenueRecognitionStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitystate2external, i.e. the database table PSD_ACTIVITYSTATE2EXT
	public static provideActivityState2ExternalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityState2ExternalEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityState2ExternalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityState2ExternalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityState2ExternalEntity>({
				dataServiceToken: lookups.BasicsSharedActivityState2ExternalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitystate, i.e. the database table PSD_ACTIVITYSTATE
	public static provideActivityStateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStateEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityStateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityStateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStateEntity>({
				dataServiceToken: lookups.BasicsSharedActivityStateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitystatusrole, i.e. the database table PSD_ACTIVITYSTATEROLE
	public static provideActivityStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedActivityStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitystatusrule, i.e. the database table PSD_ACTIVITYSTATERULE
	public static provideActivityStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedActivityStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitystateworkflow, i.e. the database table PSD_ACTIVITYSTATEWORKFLOW
	public static provideActivityStateWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStateWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityStateWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityStateWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityStateWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedActivityStateWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitytype, i.e. the database table PSD_ACTIVITYTYPE
	public static provideActivityTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityTypeEntity>({
				dataServiceToken: lookups.BasicsSharedActivityTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.activitypresentation, i.e. the database table PSD_ACTPRESENTATION
	public static provideActivityPresentationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityPresentationEntity>( {
				dataServiceToken: lookups.BasicsSharedActivityPresentationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideActivityPresentationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeActivityPresentationEntity>({
				dataServiceToken: lookups.BasicsSharedActivityPresentationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.baselinespec, i.e. the database table PSD_BASELINESPEC
	public static provideBaselineSpecLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBaselineSpecEntity>( {
				dataServiceToken: lookups.BasicsSharedBaselineSpecLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideBaselineSpecReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeBaselineSpecEntity>({
				dataServiceToken: lookups.BasicsSharedBaselineSpecLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.constrainttype, i.e. the database table PSD_CONSTRAINTTYPE
	public static provideConstraintTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConstraintTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedConstraintTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideConstraintTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeConstraintTypeEntity>({
				dataServiceToken: lookups.BasicsSharedConstraintTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.eventtype, i.e. the database table PSD_EVENTTYPE
	public static provideEventTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEventTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedEventTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideEventTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeEventTypeEntity>({
				dataServiceToken: lookups.BasicsSharedEventTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.labelplacement, i.e. the database table PSD_LOBLABELPLACEMENT
	public static provideLabelPlacementLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLabelPlacementEntity>( {
				dataServiceToken: lookups.BasicsSharedLabelPlacementLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideLabelPlacementReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeLabelPlacementEntity>({
				dataServiceToken: lookups.BasicsSharedLabelPlacementLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.performancesheet, i.e. the database table PSD_PERFORMANCESHEET
	public static providePerformanceSheetLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePerformanceSheetEntity>( {
				dataServiceToken: lookups.BasicsSharedPerformanceSheetLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePerformanceSheetReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePerformanceSheetEntity>({
				dataServiceToken: lookups.BasicsSharedPerformanceSheetLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.progressreportmethod, i.e. the database table PSD_PROGRESSREPORTMETHOD
	public static provideProgressReportMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProgressReportMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedProgressReportMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideProgressReportMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeProgressReportMethodEntity>({
				dataServiceToken: lookups.BasicsSharedProgressReportMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.relationkind, i.e. the database table PSD_RELATIONKIND
	public static provideRelationKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRelationKindEntity>( {
				dataServiceToken: lookups.BasicsSharedRelationKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideRelationKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeRelationKindEntity>({
				dataServiceToken: lookups.BasicsSharedRelationKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulechartinterval, i.e. the database table PSD_SCHDLCHARTINTERVAL
	public static provideScheduleChartIntervalLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleChartIntervalEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleChartIntervalLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleChartIntervalReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleChartIntervalEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleChartIntervalLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.scheduleimportprop, i.e. the database table PSD_SCHEDULEIMPORTPROP
	public static provideScheduleImportPropLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleImportPropEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleImportPropLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleImportPropReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleImportPropEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleImportPropLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.scheduleimportconf, i.e. the database table PSD_SCHEDULEIMPORTCONF
	public static provideScheduleImportConfLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleImportConfEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleImportConfLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleImportConfReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleImportConfEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleImportConfLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulestatus, i.e. the database table PSD_SCHEDULESTATUS
	public static provideScheduleStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulestatusrole, i.e. the database table PSD_SCHEDULESTATUSROLE
	public static provideScheduleStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulestatusrule, i.e. the database table PSD_SCHEDULESTATUSRULE
	public static provideScheduleStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulestatusworkflow, i.e. the database table PSD_SCHEDULESTATUSWF
	public static provideScheduleStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.scheduletype, i.e. the database table PSD_SCHEDULETYPE
	public static provideScheduleTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleTypeEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.schedulemethod, i.e. the database table PSD_SCHEDULINGMETHOD
	public static provideScheduleMethodLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleMethodEntity>( {
				dataServiceToken: lookups.BasicsSharedScheduleMethodLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideScheduleMethodReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeScheduleMethodEntity>({
				dataServiceToken: lookups.BasicsSharedScheduleMethodLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.tasktype, i.e. the database table PSD_TASKTYPE
	public static provideTaskTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTaskTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTaskTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTaskTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTaskTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTaskTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtodetailstatus, i.e. the database table QTO_DETAIL_STATUS
	public static provideQtoDetailStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoDetailStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusEntity>({
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtodetailstatusrole, i.e. the database table QTO_DETAIL_STATUSROLE
	public static provideQtoDetailStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoDetailStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtodetailstatusrule, i.e. the database table QTO_DETAIL_STATUSRULE
	public static provideQtoDetailStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoDetailStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtodetailstatusworkflow, i.e. the database table QTO_DETAIL_STATUSWORKFLOW
	public static provideQtoDetailStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoDetailStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedQtoDetailStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtodetaildocumenttype, i.e. the database table QTO_DETAIL_DOCUMENTTYPE
	public static provideQtoDetailDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoDetailDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoDetailDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoDetailDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQtoDetailDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.formulatype, i.e. the database table QTO_FORMULA_TYPE
	public static provideFormulaTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormulaTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedFormulaTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideFormulaTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeFormulaTypeEntity>({
				dataServiceToken: lookups.BasicsSharedFormulaTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtolinetype, i.e. the database table QTO_LINETYPE
	public static provideQtoLineTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoLineTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoLineTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoLineTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoLineTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQtoLineTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtopurposetype, i.e. the database table QTO_PURPOSE_TYPE
	public static provideQtoPurposeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoPurposeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoPurposeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoPurposeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoPurposeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQtoPurposeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtosheetstatus, i.e. the database table QTO_SHEET_STATUS
	public static provideQtoSheetStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoSheetStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusEntity>({
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtosheetstatusrole, i.e. the database table QTO_SHEET_STATUSROLE
	public static provideQtoSheetStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoSheetStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtosheetstatusrule, i.e. the database table QTO_SHEET_STATUSRULE
	public static provideQtoSheetStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoSheetStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtosheetstatusworkflow, i.e. the database table QTO_SHEET_STATUSWORKFLOW
	public static provideQtoSheetStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoSheetStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoSheetStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedQtoSheetStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtotstatus, i.e. the database table QTO_STATUS
	public static provideQtoStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusEntity>({
				dataServiceToken: lookups.BasicsSharedQtoStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtostatusrole, i.e. the database table QTO_STATUSROLE
	public static provideQtoStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedQtoStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtostatusrule, i.e. the database table QTO_STATUSRULE
	public static provideQtoStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedQtoStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtostatusworkflow, i.e. the database table QTO_STATUSWORKFLOW
	public static provideQtoStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedQtoStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.qtotype, i.e. the database table QTO_TYPE
	public static provideQtoTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedQtoTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideQtoTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeQtoTypeEntity>({
				dataServiceToken: lookups.BasicsSharedQtoTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcedocumenttype, i.e. the database table RES_DOCUMENTTYPE
	public static provideResourceDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResourceDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcegroup, i.e. the database table RES_GROUP
	public static provideResourceGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceGroupEntity>({
				dataServiceToken: lookups.BasicsSharedResourceGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcekind, i.e. the database table RES_KIND
	public static provideResResourceKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResResourceKindEntity>( {
				dataServiceToken: lookups.BasicsSharedResResourceKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResResourceKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResResourceKindEntity>({
				dataServiceToken: lookups.BasicsSharedResResourceKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.planningboardfilter, i.e. the database table RES_PLANNINGBOARDFILTER
	public static providePlanningBoardFilterLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlanningBoardFilterEntity>( {
				dataServiceToken: lookups.BasicsSharedPlanningBoardFilterLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlanningBoardFilterReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlanningBoardFilterEntity>({
				dataServiceToken: lookups.BasicsSharedPlanningBoardFilterLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcerequisitiongroup, i.e. the database table RES_REQUISITIONGROUP
	public static provideResRequisitionGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionGroupEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resrequisitionresdate, i.e. the database table RES_REQUISITION_RESDATE
	public static provideResRequisitionResDateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionResDateEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionResDateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionResDateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionResDateEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionResDateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resrequisitiontype, i.e. the database table RES_REQUISITION_TYPE
	public static provideResRequisitionTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resrequisitionstatus, i.e. the database table RES_REQUISITIONSTATUS
	public static provideResRequisitionStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resrequisitionstatusrole, i.e. the database table RES_REQUISITIONSTATROLE
	public static provideResRequisitionStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resrequisitionstatusrule, i.e. the database table RES_REQUISITIONSTATRULE
	public static provideResRequisitionStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resrequisitionstatusworkflow, i.e. the database table RES_REQUISITIONSTATUSWFLOW
	public static provideResRequisitionStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcerequisitionpriority, i.e. the database table RES_REQUISITIONPRIORITY
	public static provideResRequisitionPriorityLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionPriorityEntity>( {
				dataServiceToken: lookups.BasicsSharedResRequisitionPriorityLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResRequisitionPriorityReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResRequisitionPriorityEntity>({
				dataServiceToken: lookups.BasicsSharedResRequisitionPriorityLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resreservationstatus, i.e. the database table RES_RESERVATIONSTATUS
	public static provideResReservationStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedResReservationStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResReservationStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusEntity>({
				dataServiceToken: lookups.BasicsSharedResReservationStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resreservationstatusrole, i.e. the database table RES_RESERVATIONSTATROLE
	public static provideResReservationStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedResReservationStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResReservationStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedResReservationStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resreservationstatusrule, i.e. the database table RES_RESERVATIONSTATRULE
	public static provideResReservationStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedResReservationStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResReservationStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedResReservationStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resreservationstatusworkflow, i.e. the database table RES_RESERVATIONSTATUSWFLOW
	public static provideResReservationStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedResReservationStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResReservationStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResReservationStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedResReservationStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcereservationtype, i.e. the database table RES_RESERVATIONTYPE
	public static provideResourceReservationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceReservationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceReservationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceReservationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceReservationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResourceReservationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourceparttype, i.e. the database table RES_RESOURCEPARTTYPE
	public static provideResourcePartTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourcePartTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResourcePartTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourcePartTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourcePartTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResourcePartTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourceprovidedskilldocumenttype, i.e. the database table RES_RESPROVSKILLDOCTYPE
	public static provideResourceProvidedSkillDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceProvidedSkillDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceProvidedSkillDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceProvidedSkillDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceProvidedSkillDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResourceProvidedSkillDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.reservationtype2workoperationtype, i.e. the database table RES_RSRVTNTYP2WRKPRTNTYP
	public static provideReservationType2WorkOperationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReservationType2WorkOperationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedReservationType2WorkOperationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideReservationType2WorkOperationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeReservationType2WorkOperationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedReservationType2WorkOperationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourceskilltype, i.e. the database table RES_SKILLTYPE
	public static provideResourceSkillTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceSkillTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceSkillTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceSkillTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceSkillTypeEntity>({
				dataServiceToken: lookups.BasicsSharedResourceSkillTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourceskillgroup, i.e. the database table RES_SKILLGROUP
	public static provideResourceSkillGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceSkillGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceSkillGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceSkillGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceSkillGroupEntity>({
				dataServiceToken: lookups.BasicsSharedResourceSkillGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.resourcestrafficlight, i.e. the database table RES_TRAFFICLIGHT
	public static provideResourceTrafficLightLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceTrafficLightEntity>( {
				dataServiceToken: lookups.BasicsSharedResourceTrafficLightLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideResourceTrafficLightReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeResourceTrafficLightEntity>({
				dataServiceToken: lookups.BasicsSharedResourceTrafficLightLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.selfbillingstatus, i.e. the database table SBH_STATUS
	public static provideSelfbillingStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSelfbillingStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusEntity>({
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.selfbillingstatusrole, i.e. the database table SBH_STATUSROLE
	public static provideSelfbillingStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSelfbillingStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.selfbillingstatusrule, i.e. the database table SBH_STATUSRULE
	public static provideSelfbillingStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSelfbillingStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.selfbillingstatusworkflow, i.e. the database table SBH_STATUSWORKFLOW
	public static provideSelfbillingStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSelfbillingStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSelfbillingStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedSelfbillingStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.salesadvancetype, i.e. the database table SLS_ADVANCETYPE
	public static provideSalesAdvanceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesAdvanceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedSalesAdvanceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSalesAdvanceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesAdvanceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedSalesAdvanceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.salesdocumenttype, i.e. the database table SLS_DOCUMENTTYPE
	public static provideSalesDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedSalesDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideSalesDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeSalesDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedSalesDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingcostgroup, i.e. the database table TKS_COSTGROUP
	public static provideTimekeepingCostGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingCostGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingCostGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingCostGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingCostGroupEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingCostGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingdurationmode, i.e. the database table TKS_DURATIONMODE
	public static provideTimekeepingDurationModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingDurationModeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingDurationModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingDurationModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingDurationModeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingDurationModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeearea, i.e. the database table TKS_EMPLOYEEAREA
	public static provideTimekeepingEmployeeAreaLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeAreaEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeAreaLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeAreaReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeAreaEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeAreaLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeecertificatetype, i.e. the database table TKS_EMPCERTIFICATETYPE
	public static provideTimekeepingEmployeeCertificateTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeCertificateTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeecertificatestatus, i.e. the database table TKS_EMPCERTFICATESTATUS
	public static provideTimekeepingEmployeeCertificateStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeCertificateStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeecertificatestatusrole, i.e. the database table TKS_EMPCERTSTATUSRULE
	public static provideTimekeepingEmployeeCertificateStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeCertificateStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeecertificatestatusrule, i.e. the database table TKS_EMPCERTSTATUSROLE
	public static provideTimekeepingEmployeeCertificateStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeCertificateStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeecertificatestatusworkflow, i.e. the database table TKS_EMPCERTSTATUSWRKFLW
	public static provideTimekeepingEmployeeCertificateStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeCertificateStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeecertificatedocumenttype, i.e. the database table TKS_EMPCERTDOCTYPE
	public static provideTimekeepingEmployeeCertificateDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeCertificateDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeCertificateDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeCertificateDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeedocumenttype, i.e. the database table TKS_EMPDOCUMENTTYPE
	public static provideTimekeepingEmployeeDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeestatus, i.e. the database table TKS_EMPLOYEESTATUS
	public static provideTimekeepingEmployeeStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeestatusrole, i.e. the database table TKS_EMPLOYEESTATUSROLE
	public static provideTimekeepingEmployeeStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeestatusrule, i.e. the database table TKS_EMPLOYEESTATUSRULE
	public static provideTimekeepingEmployeeStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeestatusworkflow, i.e. the database table TKS_EMPLOYEESTATUSWRKFLW
	public static provideTimekeepingEmployeeStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeesubarea, i.e. the database table TKS_EMPLOYEESUBAREA
	public static provideTimekeepingEmployeeSubAreaLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSubAreaEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSubAreaLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeSubAreaReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSubAreaEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSubAreaLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeegroup, i.e. the database table TKS_EMPLOYEEGROUP
	public static provideTimekeepingEmployeeGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeGroupEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeeskilldocumenttype, i.e. the database table TKS_EMPLOYEESKILLDOCTYPE
	public static provideTimekeepingEmployeeSkillDocumentTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillDocumentTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillDocumentTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeSkillDocumentTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillDocumentTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillDocumentTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeeskillstatus, i.e. the database table TKS_EMPSKILLSTATUS
	public static provideTimekeepingEmployeeSkillStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeSkillStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeeskillstatusrole, i.e. the database table TKS_EMPSKILLSTATUSROLE
	public static provideTimekeepingEmployeeSkillStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeSkillStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeeskillstatusrule, i.e. the database table TKS_EMPSKILLSTATUSRULE
	public static provideTimekeepingEmployeeSkillStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeSkillStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingemployeeskillstatusworkflow, i.e. the database table TKS_EMPSKILLSTATUSWRKFLW
	public static provideTimekeepingEmployeeSkillStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingEmployeeSkillStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingEmployeeSkillStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingEmployeeSkillStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.inputphasechainmode, i.e. the database table TKS_INPUTPHASECHAINMODE
	public static provideInputPhaseChainModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInputPhaseChainModeEntity>( {
				dataServiceToken: lookups.BasicsSharedInputPhaseChainModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideInputPhaseChainModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeInputPhaseChainModeEntity>({
				dataServiceToken: lookups.BasicsSharedInputPhaseChainModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepinggroup, i.e. the database table TKS_GROUP
	public static provideTimeKeepingGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeKeepingGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeKeepingGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeKeepingGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeKeepingGroupEntity>({
				dataServiceToken: lookups.BasicsSharedTimeKeepingGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plannedabsencestatus, i.e. the database table TKS_PLANNEDABSENCESTATUS
	public static providePlannedAbsenceStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlannedAbsenceStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusEntity>({
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plannedabsencestatusrole, i.e. the database table TKS_PLANNEDABSSTATUSROLE
	public static providePlannedAbsenceStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlannedAbsenceStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plannedabsencestatusrule, i.e. the database table TKS_PLANNEDABSSTATUSRULE
	public static providePlannedAbsenceStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlannedAbsenceStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.plannedabsencestatusworkflow, i.e. the database table TKS_PLANNEDABSSTATWRKFLW
	public static providePlannedAbsenceStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static providePlannedAbsenceStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizePlannedAbsenceStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedPlannedAbsenceStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingrecordingstatus, i.e. the database table TKS_RECORDINGSTATUS
	public static provideTimekeepingRecordingStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingRecordingStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingrecordingstatusrole, i.e. the database table TKS_RECORDINGSTATROLE
	public static provideTimekeepingRecordingStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingRecordingStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingrecordingstatusrule, i.e. the database table TKS_RECORDINGSTATRULE
	public static provideTimekeepingRecordingStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingRecordingStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingrecordingstatusworkflow, i.e. the database table TKS_RECORDINGSTATWRKFLW
	public static provideTimekeepingRecordingStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingRecordingStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRecordingStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingRecordingStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingreportstatus, i.e. the database table TKS_REPORTSTATUS
	public static provideTimekeepingReportStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingReportStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingreportstatusrole, i.e. the database table TKS_REPORTSTATUSROLE
	public static provideTimekeepingReportStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingReportStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingreportstatusrule, i.e. the database table TKS_REPORTSTATUSRULE
	public static provideTimekeepingReportStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingReportStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingreportstatusworkflow, i.e. the database table TKS_REPORTSTATUSWRKFLW
	public static provideTimekeepingReportStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingReportStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingReportStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingreportverificationtype, i.e. the database table TKS_REPORTVERIFTYPE
	public static provideTimekeepingReportVerificationTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportVerificationTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingReportVerificationTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingReportVerificationTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingReportVerificationTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingReportVerificationTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingresultstatus, i.e. the database table TKS_RESULTSTATUS
	public static provideTimekeepingResultStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingResultStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingresultstatusrole, i.e. the database table TKS_RESULTSTATUSROLE
	public static provideTimekeepingResultStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingResultStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingresultstatusrule, i.e. the database table TKS_RESULTSTATUSRULE
	public static provideTimekeepingResultStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingResultStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingresultstatusworkflow, i.e. the database table TKS_RESULTSTATUSWORKFLOW
	public static provideTimekeepingResultStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingResultStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingResultStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingResultStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingroundingconfigtype, i.e. the database table TKS_ROUNDINGCONFIGTYPE
	public static provideTimekeepingRoundingConfigTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRoundingConfigTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingRoundingConfigTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingRoundingConfigTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingRoundingConfigTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingRoundingConfigTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingperiodstatus, i.e. the database table TKS_PERIODSTATUS
	public static provideTimekeepingPeriodStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingPeriodStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingperiodstatusrole, i.e. the database table TKS_PERIODSTATUSROLE
	public static provideTimekeepingPeriodStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingPeriodStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingperiodstatusrule, i.e. the database table TKS_PERIODSTATUSRULE
	public static provideTimekeepingPeriodStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingPeriodStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingperiodstatusworkflow, i.e. the database table TKS_PERIODSTATUSWRKFLW
	public static provideTimekeepingPeriodStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingPeriodStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingPeriodStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingPeriodStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingprofessionalcategory, i.e. the database table TKS_PROFESSIONALCATEGORY
	public static provideTimeKeepingProfessionalCategoryLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeKeepingProfessionalCategoryEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeKeepingProfessionalCategoryLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeKeepingProfessionalCategoryReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeKeepingProfessionalCategoryEntity>({
				dataServiceToken: lookups.BasicsSharedTimeKeepingProfessionalCategoryLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsettlementstatus, i.e. the database table TKS_SETTLEMENTSTATUS
	public static provideTimekeepingSettlementStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSettlementStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsettlementstatusrole, i.e. the database table TKS_SETTLEMENTSTATUSROLE
	public static provideTimekeepingSettlementStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSettlementStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsheetsymbol, i.e. the database table TKS_SHEETSYMBOL
	public static provideTimekeepingSheetSymbolLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetSymbolEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetSymbolLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSheetSymbolReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetSymbolEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetSymbolLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsettlementstatusrule, i.e. the database table TKS_SETTLEMENTSTATUSRULE
	public static provideTimekeepingSettlementStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSettlementStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsettlementstatusworkflow, i.e. the database table TKS_SETTLEMENTSTATWRKFLW
	public static provideTimekeepingSettlementStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSettlementStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSettlementStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSettlementStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsheetstatus, i.e. the database table TKS_SHEETSTATUS
	public static provideTimekeepingSheetStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSheetStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsheetstatusrole, i.e. the database table TKS_SHEETSTATUSROLE
	public static provideTimekeepingSheetStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSheetStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsheetstatusrule, i.e. the database table TKS_SHEETSTATUSRULE
	public static provideTimekeepingSheetStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSheetStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsheetstatusworkflow, i.e. the database table TKS_SHEETSTATUSWRKFLW
	public static provideTimekeepingSheetStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSheetStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSheetStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSheetStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingshiftgroup, i.e. the database table TKS_SHIFTGROUP
	public static provideTimekeepingShiftGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingShiftGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingShiftGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingShiftGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingShiftGroupEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingShiftGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timekeepingsurchargetype, i.e. the database table TKS_SURCHARGETYPE
	public static provideTimekeepingSurchargeTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSurchargeTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimekeepingSurchargeTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimekeepingSurchargeTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimekeepingSurchargeTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimekeepingSurchargeTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timeallocationstatus, i.e. the database table TKS_TIMEALLOCSTATUS
	public static provideTimeAllocationStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeAllocationStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timeallocationstatusrole, i.e. the database table TKS_TIMEALLOCSTATUSROLE
	public static provideTimeAllocationStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeAllocationStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timeallocationstatusrule, i.e. the database table TKS_TIMEALLOCSTATUSRULE
	public static provideTimeAllocationStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeAllocationStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timeallocationstatusworkflow, i.e. the database table TKS_TIMEALLOCSTATWRKFLW
	public static provideTimeAllocationStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeAllocationStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeAllocationStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTimeAllocationStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timesymbolgroup, i.e. the database table TKS_TIMESYMBOLGROUP
	public static provideTimeSymbolGroupLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolGroupEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeSymbolGroupLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeSymbolGroupReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolGroupEntity>({
				dataServiceToken: lookups.BasicsSharedTimeSymbolGroupLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timesymboltype, i.e. the database table TKS_TIMESYMBOLTYPE
	public static provideTimeSymbolTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeSymbolTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeSymbolTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTimeSymbolTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timesymbolpresentation, i.e. the database table TKS_TIMESYMBOLUI
	public static provideTimeSymbolPresentationLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolPresentationEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeSymbolPresentationLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeSymbolPresentationReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolPresentationEntity>({
				dataServiceToken: lookups.BasicsSharedTimeSymbolPresentationLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.timesymboltrafficlight, i.e. the database table TKS_TRAFFICLIGHT
	public static provideTimeSymbolTrafficlightLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolTrafficlightEntity>( {
				dataServiceToken: lookups.BasicsSharedTimeSymbolTrafficlightLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTimeSymbolTrafficlightReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTimeSymbolTrafficlightEntity>({
				dataServiceToken: lookups.BasicsSharedTimeSymbolTrafficlightLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.tlssourcetype, i.e. the database table TLS_SOURCETYPE
	public static provideTranslationSourceTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTranslationSourceTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTranslationSourceTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTranslationSourceTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTranslationSourceTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTranslationSourceTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.tlssubject, i.e. the database table TLS_SUBJECT
	public static provideTranslationSubjectLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTranslationSubjectEntity>( {
				dataServiceToken: lookups.BasicsSharedTranslationSubjectLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTranslationSubjectReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTranslationSubjectEntity>({
				dataServiceToken: lookups.BasicsSharedTranslationSubjectLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportbundlestatus, i.e. the database table TRS_BUNDLE_STATUS
	public static provideTransportBundleStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportBundleStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportbundlestatusrole, i.e. the database table TRS_BUNDLE_STATUSROLE
	public static provideTransportBundleStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportBundleStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportbundlestatusrule, i.e. the database table TRS_BUNDLE_STATUSRULE
	public static provideTransportBundleStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportBundleStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportbundlestatusworkflow, i.e. the database table TRS_BUNDLE_STATUSWORKFLOW
	public static provideTransportBundleStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportBundleStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTransportBundleStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportbundletype, i.e. the database table TRS_BUNDLE_TYPE
	public static provideTransportBundleTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportBundleTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportBundleTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportBundleTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTransportBundleTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportgoodsontime, i.e. the database table TRS_GOODS_ONTIME
	public static provideTransportGoodsOnTimeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportGoodsOnTimeEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportGoodsOnTimeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportGoodsOnTimeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportGoodsOnTimeEntity>({
				dataServiceToken: lookups.BasicsSharedTransportGoodsOnTimeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportgoodsstate, i.e. the database table TRS_GOODS_STATE
	public static provideTransportGoodsStateLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportGoodsStateEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportGoodsStateLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportGoodsStateReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportGoodsStateEntity>({
				dataServiceToken: lookups.BasicsSharedTransportGoodsStateLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportgoodstype, i.e. the database table TRS_GOODS_TYPE
	public static provideTransportGoodsTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportGoodsTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportGoodsTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportGoodsTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportGoodsTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTransportGoodsTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.trspackagetatus, i.e. the database table TRS_PKG_STATUS
	public static provideTransportPackageStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportPackageStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.trspackagetatusrole, i.e. the database table TRS_PKG_STATUSROLE
	public static provideTransportPackageStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportPackageStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.trspackagetatusrule, i.e. the database table TRS_PKG_STATUSRULE
	public static provideTransportPackageStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportPackageStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.trspackagetatusworkflow, i.e. the database table TRS_PKG_STATUSWORKFLOW
	public static provideTransportPackageStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportPackageStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTransportPackageStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportpackagetype, i.e. the database table TRS_PKG_TYPE
	public static provideTransportPackageTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportPackageTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportPackageTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportPackageTypeEntity>({
				dataServiceToken: lookups.BasicsSharedTransportPackageTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrequisitionstatus, i.e. the database table TRS_REQ_STATUS
	public static provideTransportRequisitionStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRequisitionStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrequisitionstatusrole, i.e. the database table TRS_REQ_STATUSROLE
	public static provideTransportRequisitionStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRequisitionStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrequisitionstatusrule, i.e. the database table TRS_REQ_STATUSRULE
	public static provideTransportRequisitionStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRequisitionStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrequisitionstatusworkflow, i.e. the database table TRS_REQ_STATUSWORKFLOW
	public static provideTransportRequisitionStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRequisitionStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRequisitionStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRequisitionStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrtestatus, i.e. the database table TRS_RTE_STATUS
	public static provideTransportRteStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRteStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRteStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRteStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrtestatusrole, i.e. the database table TRS_RTE_STATUSROLE
	public static provideTransportRteStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRteStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRteStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRteStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrtestatusrule, i.e. the database table TRS_RTE_STATUSRULE
	public static provideTransportRteStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRteStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRteStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRteStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.transportrtestatusworkflow, i.e. the database table TRS_RTE_STATUSWORKFLOW
	public static provideTransportRteStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedTransportRteStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideTransportRteStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeTransportRteStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedTransportRteStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.wfeworkflowkind, i.e. the database table WFE_KIND
	public static provideWfeWorkflowKindLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWfeWorkflowKindEntity>( {
				dataServiceToken: lookups.BasicsSharedWfeWorkflowKindLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWfeWorkflowKindReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWfeWorkflowKindEntity>({
				dataServiceToken: lookups.BasicsSharedWfeWorkflowKindLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.wfeworkflowtype, i.e. the database table WFE_TYPE
	public static provideWfeWorkflowTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWfeWorkflowTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedWfeWorkflowTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWfeWorkflowTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWfeWorkflowTypeEntity>({
				dataServiceToken: lookups.BasicsSharedWfeWorkflowTypeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.workinprogressaccrualmode, i.e. the database table WIP_ACCRUALMODE
	public static provideWorkInProgressAccrualModeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressAccrualModeEntity>( {
				dataServiceToken: lookups.BasicsSharedWorkInProgressAccrualModeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkInProgressAccrualModeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressAccrualModeEntity>({
				dataServiceToken: lookups.BasicsSharedWorkInProgressAccrualModeLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.assembly2wicflag, i.e. the database table WIC_EST_ASSEMBLY2WIC_FLAG
	public static provideAssembly2WorkItemCatalogFlagLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAssembly2WorkItemCatalogFlagEntity>( {
				dataServiceToken: lookups.BasicsSharedAssembly2WorkItemCatalogFlagLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideAssembly2WorkItemCatalogFlagReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeAssembly2WorkItemCatalogFlagEntity>({
				dataServiceToken: lookups.BasicsSharedAssembly2WorkItemCatalogFlagLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.workinprogressstatus, i.e. the database table WIP_STATUS
	public static provideWorkInProgressStatusLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusEntity>( {
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkInProgressStatusReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusEntity>({
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.workinprogressstatusrole, i.e. the database table WIP_STATUSROLE
	public static provideWorkInProgressStatusRoleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusRoleEntity>( {
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusRoleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkInProgressStatusRoleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusRoleEntity>({
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusRoleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.workinprogressstatusrule, i.e. the database table WIP_STATUSRULE
	public static provideWorkInProgressStatusRuleLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusRuleEntity>( {
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusRuleLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkInProgressStatusRuleReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusRuleEntity>({
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusRuleLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.workinprogressstatusworkflow, i.e. the database table WIP_STATUSWORKFLOW
	public static provideWorkInProgressStatusWorkflowLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusWorkflowEntity>( {
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusWorkflowLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkInProgressStatusWorkflowReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressStatusWorkflowEntity>({
				dataServiceToken: lookups.BasicsSharedWorkInProgressStatusWorkflowLookupService,
				showClearButton: false
			})
		};
	}


	// Overload functions for identifier basics.customize.workinprogresstype, i.e. the database table WIP_TYPE
	public static provideWorkInProgressTypeLookupOverload< T extends object>(showClearBtn: boolean) : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressTypeEntity>( {
				dataServiceToken: lookups.BasicsSharedWorkInProgressTypeLookupService,
				showClearButton: showClearBtn
			})
		};
	}

	public static provideWorkInProgressTypeReadonlyLookupOverload< T extends object>() : TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions:  createLookup<T, entities.IBasicsCustomizeWorkInProgressTypeEntity>({
				dataServiceToken: lookups.BasicsSharedWorkInProgressTypeLookupService,
				showClearButton: false
			})
		};
	}
}
