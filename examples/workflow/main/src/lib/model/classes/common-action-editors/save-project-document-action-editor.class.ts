/*
 * Copyright(c) RIB Software GmbH
 */

import { ICodemirrorEditorOptions, CodemirrorLanguageModes, FieldType } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ActionEditorBase } from './action-editor-base.class';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { SaveProjectDocumentActionParams } from '../../enum/actions/save-project-document-action-editor-params.enum';
import {
	BasicsSharedCertificateTypeLookupService,
	BasicsSharedDocumentTypeLookupService,
	BasicsSharedMaterialCatalogLookupService,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedProjectDocumentCategoryLookupService,
	BasicsSharedProjectDocumentStatusLookupService,
	BasicsSharedProjectDocumentTypeLookupService, BasicsSharedRubricCategoryLookupService
} from '@libs/basics/shared';
import { ProjectLocationLookupService, ProjectSharedLookupService } from '@libs/project/shared';
import {
	ProcurementPackageLookupService,
	ProcurementShareContractLookupService,
	ProcurementShareInvoiceLookupService, ProcurementSharePesLookupService,
	ProcurementShareQuoteLookupService,
	ProcurementShareReqLookupService, ProcurementShareRfqLookupService,
} from '@libs/procurement/shared';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';
import { PpsItemLookupService } from '@libs/productionplanning/shared';
import { WorkflowPlaceholderLookup } from '../../../services/workflow-lookup/action-editors/workflow-placeholder-lookup.service';

/**
 * Configuration class for Save Project Document action editor.
 */
export class SaveProjectDocumentActionEditor extends ActionEditorBase {

	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);

		const editorOptions = {
			enableLineNumbers: false,
			languageMode: CodemirrorLanguageModes.JavaScript,
			multiline: false,
			readOnly: false,
			enableBorder: true
		};

		this.showOutputGroup = false;

		this.createField(FieldType.Lookup, SaveProjectDocumentActionParams.Status, ParameterType.Input, 'basics.workflow.action.customEditor.status', {} as ICodemirrorEditorOptions, BasicsSharedProjectDocumentStatusLookupService);
		this.createField(FieldType.Lookup, SaveProjectDocumentActionParams.Category, ParameterType.Input, 'basics.workflow.action.customEditor.category', {} as ICodemirrorEditorOptions, BasicsSharedProjectDocumentCategoryLookupService);
		this.createField(FieldType.Comment, SaveProjectDocumentActionParams.BarCode, ParameterType.Input, 'basics.workflow.action.customEditor.barCode', editorOptions);
		this.createField(FieldType.Comment, SaveProjectDocumentActionParams.Description, ParameterType.Input, 'basics.workflow.action.customEditor.description', editorOptions);
		this.createField(FieldType.Comment, SaveProjectDocumentActionParams.Comment, ParameterType.Input, 'basics.workflow.action.customEditor.comment', editorOptions);
		this.createField(FieldType.Comment, SaveProjectDocumentActionParams.Revision, ParameterType.Input, 'basics.workflow.action.customEditor.revision', editorOptions);
		this.createField(FieldType.Comment, SaveProjectDocumentActionParams.DocId, ParameterType.Input, 'basics.workflow.action.customEditor.docId', editorOptions);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.DocTypeId, ParameterType.Input, 'basics.workflow.action.customEditor.docType', BasicsSharedDocumentTypeLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.PrjDocTypeId, ParameterType.Input, 'basics.workflow.action.customEditor.prjDocType', BasicsSharedProjectDocumentTypeLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.RubricCategoryId, ParameterType.Input, 'basics.workflow.action.customEditor.rubricCategory', BasicsSharedRubricCategoryLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.BusinessPartnerId, ParameterType.Input, 'basics.workflow.action.customEditor.bp', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.ProjectId, ParameterType.Input, 'basics.workflow.action.customEditor.project', ProjectSharedLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.ESTId, ParameterType.Input, 'basics.workflow.action.customEditor.est', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.ScheduleId, ParameterType.Input, 'basics.workflow.action.customEditor.schedule', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.ActivityId, ParameterType.Input, 'basics.workflow.action.customEditor.activity', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.InfoRequestId, ParameterType.Input, 'basics.workflow.action.customEditor.infoRequest', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.CertificateId, ParameterType.Input, 'basics.workflow.action.customEditor.certificate', BasicsSharedCertificateTypeLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.StructureId, ParameterType.Input, 'basics.workflow.action.customEditor.structure', BasicsSharedProcurementStructureLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.MaterialCatalogId, ParameterType.Input, 'basics.workflow.action.customEditor.materialCatalog', BasicsSharedMaterialCatalogLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.PackageId, ParameterType.Input, 'basics.workflow.action.customEditor.package', ProcurementPackageLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.RFQId, ParameterType.Input, 'basics.workflow.action.customEditor.rfq', ProcurementShareRfqLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.QTNId, ParameterType.Input, 'basics.workflow.action.customEditor.qtn', ProcurementShareQuoteLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.CONId, ParameterType.Input, 'basics.workflow.action.customEditor.con', ProcurementShareContractLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.PESId, ParameterType.Input, 'basics.workflow.action.customEditor.pes', ProcurementSharePesLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.INVId, ParameterType.Input, 'basics.workflow.action.customEditor.inv', ProcurementShareInvoiceLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.REQId, ParameterType.Input, 'basics.workflow.action.customEditor.req', ProcurementShareReqLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.ControllUnitId, ParameterType.Input, 'basics.workflow.action.customEditor.controlUnit', ControllingSharedControllingUnitLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.LocationId, ParameterType.Input, 'basics.workflow.action.customEditor.location', ProjectLocationLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.QTOId, ParameterType.Input, 'basics.workflow.action.customEditor.qto', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.PpsItemId, ParameterType.Input, 'basics.workflow.action.customEditor.ppsItem', PpsItemLookupService);
		this.createLookupEditorMode(SaveProjectDocumentActionParams.TrsRouteId, ParameterType.Input, 'basics.workflow.action.customEditor.trsRoute', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.DispatchHeaderId, ParameterType.Input, 'basics.workflow.action.customEditor.dispatchHeader', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.LgmJobId, ParameterType.Input, 'basics.workflow.action.customEditor.lgmJob', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.SalesBidId, ParameterType.Input, 'basics.workflow.action.customEditor.salesBid', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.SalesOrderId, ParameterType.Input, 'basics.workflow.action.customEditor.salesOrder', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.SalesWipId, ParameterType.Input, 'basics.workflow.action.customEditor.salesWip', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
		this.createLookupEditorMode(SaveProjectDocumentActionParams.SalesBillId, ParameterType.Input, 'basics.workflow.action.customEditor.salesBill', WorkflowPlaceholderLookup);//ToDo needs appropriate lookup, only placeholder at the moment
	}
}