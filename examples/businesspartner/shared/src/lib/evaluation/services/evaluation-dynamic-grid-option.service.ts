import {inject, Injectable} from '@angular/core';
import {EvaluationClerkType, TEvaluationClerkInfo} from '@libs/businesspartner/interfaces';
import {PlatformTranslateService} from '@libs/platform/common';
import {EvaluationCommonService} from './evaluation-common.service';

@Injectable({
	providedIn: 'root'
})
export class EvaluationDynamicGridOptionService {
	private evalGroupDataHasRead = true;
	private evalDocumentHasRead = true;
	private evalClerkHasRead?: boolean | null = true;

	private readonly translate = inject(PlatformTranslateService);
	private readonly commonService = inject(EvaluationCommonService);

	public constructor() {
	}

	public getClerkInfo(clerkType: EvaluationClerkType | null, hasRead?: boolean | null): TEvaluationClerkInfo {
		const containerCommonTitle = this.translate.instant('businesspartner.main.screenEvaluationClerkDataContainerCommonTitle').text;
		const split = ' - ';
		clerkType = clerkType ?? EvaluationClerkType.EVAL;

		let containerUUID = '2902e129fa9c4c2d9e3f8cd1bfa6b7d8';
		let containerTitle = containerCommonTitle + split + this.translate.instant('businesspartner.main.entityEvaluation').text;
		let permissionName = 'EVALCLERK';
		let tempHasRead = hasRead !== null && this.commonService.isDefined(hasRead) ? hasRead : this.evalClerkHasRead;

		// var serviceName = 'evaluationClerkService';
		// var validationName = 'evaluationClerkValidationService';
		// var uiStandardName = 'evaluationClerkUIStandardService';
		// var controller = 'businessPartnerEvaluationClerkGridController';
		// var url = globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-common-clerk-grid-view.html';
		// var tempDenyTemplate = globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-common-clerk-empty-view.html';
		// var denyController = 'businessPartnerEvaluationClerkEmptyController';
		//
		if (clerkType === EvaluationClerkType.EVAL) {
			this.evalClerkHasRead = tempHasRead;
		} else if (clerkType === EvaluationClerkType.GROUP) {
			containerUUID = '7fdae404c0164283a7f0ffc8a5fcbf01';
			containerTitle = containerCommonTitle + split + this.translate.instant('businesspartner.main.scrrenEvaluationClerkContainerSubTitle.evalGroupData').text;
			permissionName = 'EVALGROUPCLERK';
			tempHasRead = hasRead;

			// serviceName = 'evaluationGroupClerkService';
			// validationName = 'evaluationGroupClerkValidationService';
			// uiStandardName = 'evaluationGroupClerkUIStandardService';
		} else if (clerkType === EvaluationClerkType.SUBGROUP) {
			containerUUID = 'ccdb79b7bba44c808e1173e1385554fa';
			containerTitle = containerCommonTitle + split + this.translate.instant('businesspartner.main.scrrenEvaluationClerkContainerSubTitle.evalSubGroupData').text;
			permissionName = 'EVALSUBGROUPCLERK';
			tempHasRead = hasRead;

			// serviceName = 'evaluationGroupClerkService';
			// validationName = 'evaluationGroupClerkValidationService';
			// uiStandardName = 'evaluationGroupClerkUIStandardService';
		} else if (clerkType !== EvaluationClerkType.EVAL) {
			throw new Error('clerkType ' + clerkType + ' is not defined.');
		}

		return {
			name: 'clerk',
			containerUUID: containerUUID,
			containerTitle: containerTitle,
			permissionName: permissionName,
			hasRead: tempHasRead,
			// serviceName: serviceName,
			// validationName: validationName,
			// uiStandardName: uiStandardName,
			// controller: controller,
			// url: url,
			// denyTemplate: tempDenyTemplate,
			// denyController: denyController
		};
	}

	public getEvalGroupInfo(hasRead: boolean) {
		this.evalGroupDataHasRead = hasRead !== null && this.commonService.isDefined(hasRead) ? hasRead : this.evalGroupDataHasRead;
		return {
			name: 'evalGroup',
			controller: 'businessPartnerEvaluationGroupDataController',
			permissionName: 'EVALGROUP',
			hasRead: this.evalGroupDataHasRead,
			// url: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-group-data-view.html',
			// denyTemplate: denyTemplate,
			// denyController: ''
		};
	}

	public getEvalDocumentInfo(hasRead: boolean) {
		this.evalDocumentHasRead = hasRead !== null && this.commonService.isDefined(hasRead) ? hasRead : this.evalDocumentHasRead;
		return {
			name: 'evalDocument',
			controller: 'businessPartnerEvaluationDocumentDataController',
			permissionName: 'EVAL',
			hasRead: this.evalDocumentHasRead,
			// url: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-document-data-view.html',
			// denyTemplate: denyTemplate,
			// denyController: ''
		};
	}

	public getEvalItemInfo(hasRead: boolean) {
		return {
			name: 'evalItem',
			controller: 'businessPartnerEvaluationItemDataController',
			permissionName: 'EVALITEM',
			hasRead: hasRead,
			// url: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-item-data-view.html',
			// denyTemplate: denyTemplate,
			// denyController: ''
		};
	}

	public reset() {
		this.evalGroupDataHasRead = true;
		this.evalDocumentHasRead = true;
		this.evalClerkHasRead = true;
	}
}
