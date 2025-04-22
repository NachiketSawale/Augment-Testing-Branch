import { InjectionToken, Type } from '@angular/core';
import { SqlActionEditor } from '../model/classes/common-action-editors/sql-action-editor.class';
import { ExternalSqlActionEditor } from '../model/classes/common-action-editors/external-sql-action-editor.class';
import { CommonActionEditorComponent } from '../components/action-editors/common-action-editor/common-action-editor.component';
import { ScriptActionEditor } from '../model/classes/common-action-editors/script-action-editor.class';
import { SampleActionEditorComponent } from '../components/action-editors/custom-editors/sample-custom-action-editor/sample-custom-action-editor.component';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { WorkflowClientAction, IWorkflowAction } from '@libs/workflow/interfaces';
import { UserInputActionEditorComponent } from '../components/action-editors/custom-editors/user-input-action-editor/user-input-action-editor.component';
import { MailActionEditor } from '../model/classes/common-action-editors/mail-action-editor.class';
import { SqlActionFirstObjectEditor } from '../model/classes/common-action-editors/sql-action-first-object-editor.class';
import { SqlActionToCsvEditor } from '../model/classes/common-action-editors/sql-action-to-csv-editor.class';
import { ChangeStatusEditor } from '../model/classes/common-action-editors/change-status-editor.class';
import { ReportClientActionEditor } from '../model/classes/common-action-editors/report-client-action-editor.class';
import { StoredProcedureActionEditor } from '../model/classes/common-action-editors/stored-procedure-acton-editor.class';
import { ExtendedUserActionEditor } from '../model/classes/common-action-editors/extended-user-action-editor.class';
import { DocumentClientActionEditor } from '../model/classes/common-action-editors/document-client-action.class';
import { PortalReviewBidderInvitationEmailActionEditor } from '../model/classes/common-action-editors/portal-review-bidder-invitation-email-action-editor.class';
import { StartWorkflowActionEditor } from '../model/classes/common-action-editors/start-workflow-action-editor.class';
import { StartWorkflowForEveryIdActionEditor } from '../model/classes/common-action-editors/start-workflow-for-every-id-action-editor.class';
import { IWorkflowActionEditor } from '../model/interfaces/workflow-action-editor.interface';
import { SaveTextToNewFileActionEditor } from '../model/classes/common-action-editors/save-text-to-new-file-action.class';
import { EntityDataActionEditor } from '../model/classes/common-action-editors/entity-data-action-editor.class';
import { GetTextFromDocumentActionEditor } from '../model/classes/common-action-editors/get-text-from-document-action-editor.class';
import { TakeoverBoqEditor } from '../model/classes/common-action-editors/takeover-boq-action-editor.class';
import { SaveModelObjectsEditor } from '../model/classes/common-action-editors/save-model-objects-action-editor.class';
import { IncludeModelObjectAttributesActionEditor } from '../model/classes/common-action-editors/include-model-object-attributes-action-editor.class';
import { RecalculateBoqValuesActionEditor } from '../model/classes/common-action-editors/recalculate-boq-values-action-editor.class';
import { GoToActionEditor } from '../model/classes/common-action-editors/go-to-action-editor.class';
import { GetEntityActionEditor } from '../model/classes/common-action-editors/get-entity-action-editor.class';
import { CreateEntityActionEditor } from '../model/classes/common-action-editors/create-entity-action-editor.class';
import { SaveEntityActionEditor } from '../model/classes/common-action-editors/save-entity-action-editor.class';
import { GetProjectDocumentActionEditor } from '../model/classes/common-action-editors/get-project-document-action-editor.class';
import { SaveProjectDocumentActionEditor } from '../model/classes/common-action-editors/save-project-document-action-editor.class';
import { UserformActionEditor } from '../model/classes/common-action-editors/userform-action-editor.class';
import { SoapActionEditor } from '../model/classes/common-action-editors/soap-action-editor.class';
import { ReportMailActionEditor } from '../model/classes/common-action-editors/report-mail-action.editor';
import { ClerkFromProcurementstructureActionEditor } from '../model/classes/common-action-editors/clerk-from-procurementstructure-action-editor.class';
import { GetCharacteristicActionEditor } from '../model/classes/common-action-editors/get-characteristic-action-editor.class';
import { GetClerkFromProjectActionEditor } from '../model/classes/common-action-editors/get-clerk-from-project-action-editor.class';
import { ModifyModelObjectAttributesActionEditor } from '../model/classes/common-action-editors/modify-model-object-attributes-action-editor.class';
import { GetAuthenticationTokenActionEditor } from '../model/classes/common-action-editors/gets-a-authentication-token-action-editor.class';
import { MaterialForecastActionEditor } from '../model/classes/common-action-editors/material-forecast-action-editor.class';
import { SendCalenderEventActionEditor } from '../model/classes/common-action-editors/send-calender-event-action-editor.class';
import { AiActionEditor } from '../model/classes/common-action-editors/ai-action-editor.class';
import { GetTextAssemblyActionEditor } from '../model/classes/common-action-editors/get-text-assembly-action-editor.class';
import { ReportActionEditor } from '../model/classes/common-action-editors/report-action-editor.class';
import { SyncMaterialCatalogFromYwtoActionEditor } from '../model/classes/common-action-editors/sync-material-catalog-from-ywto-action-editor.class';
import { CheckVatNoActionEditor } from '../model/classes/common-action-editors/check-vat-no-action-editor.class';
import { ProcessBusinessPartnerUpdateRequestActionEditor } from '../model/classes/common-action-editors/process-business-partner-update-request-action-editor.class';
import { SendTeamsMessageActionEditor } from '../model/classes/common-action-editors/send-teams-message-action-editor.class';
import { CreatePesActionEditor } from '../model/classes/common-action-editors/create-pes-action-editor.class';
import { StartApproverWorkflowActionEditor } from '../model/classes/common-action-editors/start-approver-workflow-action-editor.class';
import { SetAddressGeoLocationActionEditor } from '../model/classes/common-action-editors/set-address-geo-location-action-editor.class';
import { CreateContractFromQuoteActionEditor } from '../model/classes/common-action-editors/create-contract-from-quote-action-editor.class';
import { RecalculateProcurementActionEditor } from '../model/classes/common-action-editors/recalculate-procurement-action-editor.class';
import { CreateCallOffOrChangeOrderActionEditor } from '../model/classes/common-action-editors/create-call-off-or-change-order-action-editor.class';
import { DeleteProjectDocumentsActionEditor } from '../model/classes/common-action-editors/delete-project-documents-action-editor.class';
import { UpdateContractTransactionActionEditor } from '../model/classes/common-action-editors/update-contract-transaction-action-editor.class';
import { ProcessInventoryActionEditor } from '../model/classes/common-action-editors/process-inventory-action-editor.class';
import { ChangeContractOfInvoiceActionEditor } from '../model/classes/common-action-editors/change-contract-of-invoice-action-editor.class';
import { AutoGenerateTransactionActionEditor } from '../model/classes/common-action-editors/auto-generate-transaction-action-editor.class';
import { ValidateChainedInvoicesActionEditor } from '../model/classes/common-action-editors/validate-chained-invoices-action-editor.class';
import { UpdateInvoiceTransactionAssetActionEditor } from '../model/classes/common-action-editors/update-invoice-transaction-asset-action-editor.class';
import { UpdateInvoiceTransactionActionEditor } from '../model/classes/common-action-editors/update-invoice-transaction-action-editor.class';
import { UpdateInvoiceHeaderActionEditor } from '../model/classes/common-action-editors/update-invoice-header-action-editor.class';
import { UpdateInvoiceGeneralsActionEditor } from '../model/classes/common-action-editors/update-invoice-generals-action-editor.class';
import { RecalculateInvoiceActionEditor } from '../model/classes/common-action-editors/recalculate-invoice-action-editor.class';
import { ForwardPeriousTotalsActionEditor } from '../model/classes/common-action-editors/forward-perious-totals-action-editor.class';
import { UpdatePesTransactionActionEditor } from '../model/classes/common-action-editors/update-pes-transaction-action-editor.class';
import { CreateQuotesFromRfqActionEditor } from '../model/classes/common-action-editors/create-quotes-from-rfq-action-editor.class';
import { CreateRfqFromRequisitionActionEditor } from '../model/classes/common-action-editors/create-rfq-from-requisition-action-editor.class';
import { GetDocumentsByRfqIdActionEditor } from '../model/classes/common-action-editors/get-documents-by-rfq-id-action-editor.class';

export type CustomActionEditors = SampleActionEditorComponent | UserInputActionEditorComponent;
export type ActionEditor = CustomActionEditors | CommonActionEditorComponent;

/**
 * Injection token to pass ui addons to child components
 */
export const UI_ADDON_TOKEN = new InjectionToken<IContainerUiAddOns>('uiAddons');

/**
 * Injection token to pass selected action reference to child components
 */
export const PARAMETERS_TOKEN = new InjectionToken<IWorkflowAction>('parameters');

/**
 * Contains a map of action id to the corresponding custom action editor component.
 * The custom action editor component must be added into CustomActionEditors type first.
 */
export const CUSTOM_ACTION_EDITOR_ID_MAP: Iterable<[string, Type<ActionEditor>]> = [
	//['409ed310344011e5a151feff819cdc9f', SampleActionEditorComponent],  - Example
	['00000000000000000000000000000000', UserInputActionEditorComponent]
];

/**
 * Contains a map of action ids to the corresponding common action editor configuration classes.
 */
export const ACTION_EDITOR_FORM_CONFIG_MAP: Iterable<[string, Type<IWorkflowActionEditor>]> = [
	['6f3a49b7c1b94448886a868625829e4d', SqlActionEditor],
	['409ed310344011e5a151feff819cdc9f', ScriptActionEditor],
	['a4efd9866b2b424b9e37f5f681d58bd8', MailActionEditor],
	['ece96a96aab44036af3dafcf20fc4f3d', ReportMailActionEditor],
	['a2082812f7b8422db526933444f33d13', SqlActionFirstObjectEditor],
	['8cd6fa38085740d08131015776f47839', SqlActionToCsvEditor],
	['8e393c360beb4b8aa73cf8a37bd77021', ExternalSqlActionEditor],
	['8d7dfd76344211e5a151feff819cdc9f', StoredProcedureActionEditor],
	['5F6E595C0BF6412694D9C40AD66621DF', ChangeStatusEditor],
	[WorkflowClientAction.Report, ReportClientActionEditor],
	[WorkflowClientAction.ExtendedUserInput, ExtendedUserActionEditor],
	['000090ce354a11ebadc10242ac120002', DocumentClientActionEditor],
	['b9a051030fa2493bb6b0427e172e7fc9', StartWorkflowActionEditor],
	[WorkflowClientAction.PortalReviewBidder, PortalReviewBidderInvitationEmailActionEditor],
	['66244F94145044F4BAD64BD81DFA07BC', StartWorkflowForEveryIdActionEditor],
	['E0000000000000000000000000000000', GoToActionEditor],
	['61fb887694ff4817883324dd6f17b2d5', SaveTextToNewFileActionEditor],
	['08e899fe92774337b2a652d59d142d40', EntityDataActionEditor],
	['0456E92770564C849F21CB5928F60947', TakeoverBoqEditor],
	['9be217e409c045fcaeddbcba84e6a98b', GetTextFromDocumentActionEditor],
	['FC41170F3C194DC3A7C3849EE42895E2', RecalculateBoqValuesActionEditor],
	['7fd3d8bc9e77497399849816d295e615', GetEntityActionEditor],
	['2aa3606385474ad48ca61bc9aea21d05', CreateEntityActionEditor],
	['80a2d342d3d346d585c0fce47379d556', SaveEntityActionEditor],
	['07f733f94735448b828a4461e8c44dc9', IncludeModelObjectAttributesActionEditor],
	['81b913cfd9284eb5a88752c5387e090a', GetProjectDocumentActionEditor],
	['be5efbabcdc048be8ea3e1dbd222a803', SaveProjectDocumentActionEditor],
	[WorkflowClientAction.UserForm, UserformActionEditor],
	['a70b38d0a3ae4bcdb8cef3e2ed17acaa', SoapActionEditor],
	['8c9811780086406d98085cf191a2637b', ClerkFromProcurementstructureActionEditor],
	['85bd807fc5084f2885fd0be84b8c8ba4', GetCharacteristicActionEditor],
	['8140be2cef4d4735ae7d756f66a13003', SaveModelObjectsEditor],
	['0415b6308da9432e982b880c8348cc87', ModifyModelObjectAttributesActionEditor],
	['31fe96461fcb4067b188074320727245', GetClerkFromProjectActionEditor],
	['7a1198bff0c3446da0306ed5d37868ed', GetAuthenticationTokenActionEditor],
	['4f81f5d331ac4985aed5dc15833f23a0', GetTextAssemblyActionEditor],
	['55E8E41A9C5141C59B2575BFBFF8A5E1', SendCalenderEventActionEditor],
	['99FA8660D2334D6591B78244FE4AAB19', MaterialForecastActionEditor],
	['74FC8C56284C4307817B866A35479E79', SyncMaterialCatalogFromYwtoActionEditor],
	['7babb1069b434937ab6237787f4c2e21', ReportActionEditor],
	['87309a1b6aed493da3fe9721085f2c23', AiActionEditor],
	['103c0d6f9fee412fb3669748694d5748', ProcessBusinessPartnerUpdateRequestActionEditor],
	['ffbafa91d4fe41d4b14458464fbbe50', SendTeamsMessageActionEditor],
	['eda68800d6fc426581c7fe22d1086612', StartApproverWorkflowActionEditor],
	['4c85f957772d481aa1f05d1983682e3a', CheckVatNoActionEditor],
	['47db6eef5fdc42ea90928a46353c9b67', SetAddressGeoLocationActionEditor],
	['EC38244EA8E14DA7850397985B4DD82D', CreatePesActionEditor],
	['a4e4d462b90046889400229cdad90625', CreateContractFromQuoteActionEditor],
	['60e28279360042f3a265824ace85a9a8', RecalculateProcurementActionEditor],
	['37109a1b6aff493da3549721085f2c97', CreateCallOffOrChangeOrderActionEditor],
	['1ea698f85e4a49bb9f7f5c5c9e388d82', DeleteProjectDocumentsActionEditor],
	['8A2984FB22C846ED81EF17D278E7E326', UpdateContractTransactionActionEditor],
	['16ACC6190D504F0A9C4E018A95025E93', ProcessInventoryActionEditor],
	['C4CD18FDF24D4D9E91041B3D1D28101E', ChangeContractOfInvoiceActionEditor],
	['742D86B4ACF64FC3910D8FA6F2F9B629', AutoGenerateTransactionActionEditor],
	['06A27878255F422B94E68D873FB8EDB1', ValidateChainedInvoicesActionEditor],
	['4606C537F0264631BEDDBCE364B2AC89', UpdateInvoiceTransactionAssetActionEditor],
	['7FC4A02272094A0EBB2AB073CFB84180', UpdateInvoiceTransactionActionEditor],
	['3B105BA2F1FB4CAA880EE5DEA3FB2A85', UpdateInvoiceHeaderActionEditor],
	['cec61873cc424cc6aa644ce36ecbeb1f', UpdateInvoiceGeneralsActionEditor],
	['47D529D5FE644BBA8403DFB48E901815', RecalculateInvoiceActionEditor],
	['947CBAE4D5984E029A97CB99A2099A56', ForwardPeriousTotalsActionEditor],
	['2EFD2DE747C94A48B52C90CBCFEF045F', UpdatePesTransactionActionEditor],
	['1793c3336a5f4eda88ecdd12a87db7e6', CreateQuotesFromRfqActionEditor],
	['016f7966f0ae456b91581c28102c34af', CreateRfqFromRequisitionActionEditor],
	['385997bd2e1a4a7e8954c2d35adab1d5', GetDocumentsByRfqIdActionEditor],
];