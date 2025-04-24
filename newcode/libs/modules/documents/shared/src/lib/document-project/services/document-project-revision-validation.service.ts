/*
 * Copyright(c) RIB Software GmbH
 */

import { inject} from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IDocumentRevisionEntity} from '../../model/entities/document-revision-entity.interface';
import { DocumentProjectRevisionDataService } from './document-project-revision-data.service';

/**
 * document project revision validation service
 */

export class DocumentProjectRevisionValidationService extends BaseValidationService<IDocumentRevisionEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(DocumentProjectRevisionDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IDocumentRevisionEntity> {
		return {
			Description: this.commonValidation,
			CommentText:this.commonValidation,
			BarCode:this.commonValidation

		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IDocumentRevisionEntity> {
		return this.dataService;
	}

	protected commonValidation(info: ValidationInfo<IDocumentRevisionEntity>):ValidationResult {
		this.triggerLeadingServiceModifyItem();
		return this.validationUtils.createSuccessObject();
	}

	protected triggerLeadingServiceModifyItem():void {
		//todo: how to set the lead header as modifier to make the save button as red color
		//const leadingService = this.dataService.getParentService().parentDataService;
		// if(leadingService !== undefined){
		// 	//if only change the project document information then not need to save the header
		// 	//when click the save button in header container just trigger to save the document action
		// 	var parentState = platformModuleStateService.state(parentService.getModule());
		// 	if(parentState && parentState.modifications){
		// 		parentState.modifications.EntitiesCount += 1;
		// 	}
		// }
	}

}