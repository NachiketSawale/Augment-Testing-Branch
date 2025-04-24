/**
 * Created by uestuenel on 23.11.2016.
 * Used for Save Project Document Action Editor
 */

(function (angular) {
	'use strict';

	angular.module('basics.workflow').directive('basicsWorkflowRadioListContainer', basicsWorkflowRadioListContainer);

	basicsWorkflowRadioListContainer.$inject = ['$compile', 'basicsWorkflowSaveProjectDocument'];

	function basicsWorkflowRadioListContainer($compile, basicsWorkflowSaveProjectDocument) {
		return {
			restrict: 'AE',
			scope: true,
			link: function (scope, elem) {

				var parameters = basicsWorkflowSaveProjectDocument;

				var radioButtonInputs = _.filter(parameters, 'editorMode');

				var containerTemplate = [];

				var getLookupTemplate = function (keyname) {

					var lookupTemplate;
					switch (keyname) {
						case 'docTypeId':
							lookupTemplate = '<div data-basics-lookupdata-table-document-type-combobox data-ng-model="input.docTypeSelect" data-config="input.selectConfig" class="fullwidth" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'prjDocTypeId':
							lookupTemplate = '<div data-domain-control data-domain="select" data-options="selectOptionsPrjDocId" data-model="input.prjDocTypeSelect" data-config="input.selectConfig" data-entity="input.lookupPrjDocTypeUrl" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'projectId':
							lookupTemplate = '<div data-basics-lookup-data-project-project-dialog data-ng-model="input.projectselect" data-config="input.selectConfig" data-options="lookupOptions" class="fullwidth" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'bpId':
							lookupTemplate = '<div business-partner-main-business-partner-dialog class="fullwidth" ng-model="input.bpSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'certificateId':
							lookupTemplate = '<div businesspartner-certificate-certificate-type-combobox class="fullwidth" ng-model="input.certificateSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'structureId':
							lookupTemplate = '<div basics-procurementstructure-structure-dialog class="fullwidth" ng-model="input.structureSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'materialCtId':
							lookupTemplate = '<div basics-material-material-catalog-lookup class="fullwidth" ng-model="input.materialCtSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'packageId':
							lookupTemplate = '<div data-procurement-common-package-lookup class="fullwidth" ng-model="input.packageSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'rfqId':
							lookupTemplate = '<div data-procurement-rfq-header-dialog class="fullwidth" ng-model="input.rfqSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'qtnId':
							lookupTemplate = '<div data-procurement-quote-header-lookup class="fullwidth" ng-model="input.qtnSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'conId':
							lookupTemplate = '<div data-prc-con-header-dialog class="fullwidth" ng-model="input.conSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'pesId':
							lookupTemplate = '<div data-procurement-invoice-pes-lookup class="fullwidth" ng-model="input.pesSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'invId':
							lookupTemplate = '<div data-procurement-invoice-header-dialog class="fullwidth" ng-model="input.invSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'scheduleId':
							lookupTemplate = '<div data-domain-control data-domain="select" data-options="selectSchedule" data-config="configProcjectId" data-model="input.scheduleSelect" data-entity="input.projectselect" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'activityId':
							lookupTemplate = '<div scheduling-activity-template-lookup-dialog class="fullwidth" ng-model="input.activitySelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'estId':
							lookupTemplate = '<div data-domain-control data-domain="select" data-options="selectEstimate" data-config="configProcjectId" data-model="input.estSelect" data-entity="input.projectselect" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'reqId':
							lookupTemplate = '<div data-procurement-requisition-lookup-dialog class="fullwidth" ng-model="input.reqSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'infoRequestId':
							lookupTemplate = '<div data-domain-control data-domain="select" data-options="selectInformation" data-config="configProcjectId" data-model="input.infoRequestSelect" data-entity="input.projectselect" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'controlUnitId':
							lookupTemplate = '<div basics-master-data-context-controlling-unit-lookup class="fullwidth" ng-model="input.controlUnitSelect" data-config="input.selectConfig" data-options="lookupOptions"disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'locationId':
							lookupTemplate = '<div basics-lookupdata-prj-location-dialog class="fullwidth" ng-model="input.locationSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'rubricCategoryId':
							lookupTemplate = '<div basics-lookupdata-rubric-category-combo-box class="fullwidth" ng-model="input.rubricCategorySelect" data-config="input.selectConfig" data-options="lookupOptionsRubricCategory" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'qtoId':
							lookupTemplate = '<div data-qto-header-dialog class="fullwidth" ng-model="input.qtoSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'ppsItemId':
							lookupTemplate = '<div productionplanning-item-item-lookup-dialog class="fullwidth" ng-model="input.ppsItemSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'trsRouteId':
							lookupTemplate = '<div transportplanning-transport-route-lookup class="fullwidth" ng-model="input.trsRouteSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'dispatchHeaderId':
							lookupTemplate = '<div logistic-dispatching-header-paging-lookup class="fullwidth" ng-model="input.dispatchHeaderSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'lgmJobId':
							lookupTemplate = '<div logistic-job-paging-lookup class="fullwidth" ng-model="input.lgmJobSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'salesBidId':
							lookupTemplate = '<div sales-bid-bid-dialog class="fullwidth" ng-model="input.salesBidSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'salesOrderId':
							lookupTemplate = '<div sales-common-contract-dialog class="fullwidth" ng-model="input.salesOrderSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'salesWipId':
							lookupTemplate = '<div sales-common-wip-dialog class="fullwidth" ng-model="input.salesWipSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						case 'salesBillId':
							lookupTemplate = '<div sales-common-bill-dialog class="fullwidth" ng-model="input.salesBillSelect" data-config="input.selectConfig" data-options="lookupOptions" disabled="codeMirrorOptions.readOnly"></div>';
							break;
						default:
							lookupTemplate = '';
					}
					return lookupTemplate;
				};

				angular.forEach(radioButtonInputs, function (value, key) {

					var controlTemplate = '<div class="radiolist-container">' +
						'<div class="radio spaceToUp pull-left">' +
						'<label><input type="radio" name="radioGroup' + key + '" ng-model="$$radioModel$$" ng-value="1" ng-disabled="readonly">' +
						'{{"basics.workflow.modalDialogs.defaultRadio" | translate }} </label>' +
						'</div>' +
						'<div class="radio spaceToUp pull-left margin-left-ld">' +
						'<label><input type="radio" name="radioGroup' + key + '" ng-model="$$radioModel$$" ng-value="2" ng-disabled="readonly">' +
						'{{"basics.workflow.modalDialogs.expertRadio" | translate }}</label>' +
						'</div>' +
						'</div>' +
						'<div class="platform-form-group" data-ng-show="$$radioModel$$ === 1">' +
						'<div class="platform-form-row">' +
						'<label class="platform-form-label">{{ "basics.workflow.action.customEditor.' + value.translateKey1 + '" | translate }}</label>' +
						'<div class="platform-form-col">' +
						'$$lookupDomain$$' +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="platform-form-group" data-ng-show="$$radioModel$$ === 2">' +
						'<div class="platform-form-row">' +
						'<label class="platform-form-label">{{"basics.workflow.action.customEditor.' + value.translateKey2 + '" | translate }}</label> ' +
						'<div class="platform-form-col">' +
						'<div data-script-editor-directive data-ng-model="$$mirrorKey$$" data-options="codeMirrorOptions"></div>' +
						'</div>' +
						'</div>' +
						'</div>';

					controlTemplate = controlTemplate.replace(/\$\$radioModel\$\$/g, 'input.' + value.editorModeKey)
						.replace(/\$\$lookupKey\$\$/g, 'input.' + value.key2)
						.replace(/\$\$mirrorKey\$\$/g, 'input.' + value.key)
						.replace(/\$\$lookupDomain\$\$/g, getLookupTemplate(value.key));

					containerTemplate.push(controlTemplate);
				});

				var template = containerTemplate.join('');
				var content = $compile(template)(scope);

				//elem.append(content);
				elem.replaceWith(content);
			}
		};
	}
})(angular);
