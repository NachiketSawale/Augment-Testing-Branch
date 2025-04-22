import {ColumnDef, FieldType} from '@libs/ui/common';
import {IEvaluationEntity} from '@libs/businesspartner/interfaces';

export const BusinesspartnerSharedEvaluationDefaultLayout = [
	{
		id: 'companyfk',
		model: 'CompanyFk',
		visible: true,
		label: {
			text: 'Company',
			key: 'cloud.common.entityCompany'
		},
		// type: FieldType.Lookup,
		// formatterOptions:{
		// 	type: FieldType.Lookup,
		// 	lookupOptions: createLookup({
		// 		dataServiceToken: BasicsCompanyLookupService,
		// 		showDescription: true,
		// 		descriptionMember: 'CompanyName'
		// 	})
		// }
	},
	{
		id: 'checked',
		model: 'Checked',
		visible: true,
		type: FieldType.Boolean,
		label: {
			text: 'Checked'
		}
	},
	{
		id: 'evaluationschemafk',
		model: 'EvaluationSchemaFk',
		label: {
			text: 'Evaluation Schema',
			key: 'businesspartner.main.entityEvaluationSchemaFk'
		},
		visible: true
	},
	{
		id: 'points',
		model: 'Points',
		label: {
			text: 'Result',
			key: 'businesspartner.main.entityPoints'
		},
		visible: true
	},
	{
		id: 'code',
		model: 'Code',
		label: {
			text: 'Code',
			key: 'cloud.common.entityCode'
		},
		visible: true
	},
	{
		id: 'evaluationdate',
		model: 'EvaluationDate',
		label: {
			text: 'Evaluation Date',
			key: 'businesspartner.main.entityEvaluationDate'
		},
		visible: true
	},
	{
		id: 'evalstatusfk',
		model: 'EvalStatusFk',
		label: {
			text: 'Evaluation Status',
			key: 'basics.customize.evaluationstatus'
		},
		visible: true
	},
	{
		id: 'validfrom',
		model: 'ValidFrom',
		label: {
			text: 'Valid From',
			key: 'businesspartner.main.entityValidFrom'
		},
		visible: true
	},
	{
		id: 'validto',
		model: 'ValidTo',
		label: {
			text: 'Valid To',
			key: 'businesspartner.main.entityValidTo'
		},
		visible: true
	},
	{
		id: 'subsidiaryfk',
		model: 'SubsidiaryFk',
		label: {
			text: 'Subsidiary',
			key: 'cloud.common.entitySubsidiary'
		},
		visible: true
	},
	{
		id: 'contact1fk',
		model: 'Contact1Fk',
		label: {
			text: 'Contact 1',
			key: 'businesspartner.main.entityContact1'
		},
		visible: true
	},
	{
		id: 'contact2fk',
		model: 'Contact2Fk',
		label: {
			text: 'Contact 2',
			key: 'businesspartner.main.entityContact2'
		},
		visible: true
	},
	{
		id: 'clerkprcfk',
		model: 'ClerkPrcFk',
		label: {
			text: 'Procurement Clerk',
			key: 'businesspartner.main.entityClerkPrc'
		},
		visible: true
	},
	{
		id: 'clerkreqfk',
		model: 'ClerkReqFk',
		label: {
			text: 'Requisition Owner',
			key: 'businesspartner.main.entityClerkReq'
		},
		visible: true
	},
	{
		id: 'remark',
		model: 'Remark',
		label: {
			text: 'Remarks',
			key: 'cloud.common.entityRemark'
		},
		visible: true
	},
	{
		id: 'remark2',
		model: 'Remark2',
		label: {
			text: 'Remarks2',
			key: 'cloud.common.entityRemark2'
		},
		visible: true
	},
	{
		id: 'projectfk',
		model: 'ProjectFk',
		label: {
			text: 'Project',
			key: 'cloud.common.entityProject'
		},
		visible: true
	},
	{
		id: 'qtnheaderfk',
		model: 'QtnHeaderFk',
		label: {
			text: 'Quotation',
			key: 'businesspartner.main.entityQuotation'
		},
		visible: true
	},
	{
		id: 'conheaderfk',
		model: 'ConHeaderFk',
		label: {
			text: 'Contract',
			key: 'businesspartner.main.entityContract'
		},
		visible: true
	},
	{
		id: 'invheaderfk',
		model: 'InvHeaderFk',
		label: {
			text: 'Invoice',
			key: 'businesspartner.main.entityInvoice'
		},
		visible: true
	},
	{
		id: 'userdefined1',
		model: 'UserDefined1',
		label: {
			text: 'User Defined 1',
			key: 'cloud.common.entityUserDefined',
			params: {'p_0': '1'}
		},
		visible: true

	},
	{
		id: 'userdefined2',
		model: 'UserDefined2',
		label: {
			text: 'User Defined 2',
			key: 'cloud.common.entityUserDefined',
			params: {'p_0': '2'}
		},
		visible: true
	},
	{
		id: 'userdefined3',
		model: 'UserDefined3',
		label: {
			text: 'User Defined 3',
			key: 'cloud.common.entityUserDefined',
			params: {'p_0': '3'}
		},
		visible: true
	},
	{
		id: 'userdefined4',
		model: 'UserDefined4',
		label: {
			text: 'User Defined 4',
			key: 'cloud.common.entityUserDefined',
			params: {'p_0': '4'}
		},
		visible: true
	},
	{
		id: 'userdefined5',
		model: 'UserDefined5',
		label: {
			text: 'User Defined 5',
			key: 'cloud.common.entityUserDefined',
			params: {'p_0': '5'}
		},
		visible: true
	},
	{
		id: 'description',
		model: 'Description',
		label: {
			text: 'Description',
			key: 'cloud.common.entityDescription'
		},
		visible: true,
		readonly: true
	}] as ColumnDef<IEvaluationEntity>[];