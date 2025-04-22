/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit, Type } from '@angular/core';
import { UiBusinessBaseEntityTranslationIssueService } from '../../../services/ui-business-base-entity-translation-issue.service';
import { ITranslationIssue } from '../../../model/translation-issue.interface';
import { ObsoleteEnglishTranslationIssueComponent } from '../obsolete-english-translation/obsolete-english-translation-issue.component';
import { Translatable } from '@libs/platform/common';

@Component({
	templateUrl: './issue-dialog-body.component.html',
	styleUrl: './issue-dialog-body.component.css'
})
export class IssueDialogBodyComponent implements OnInit{
	/**
	 * Flag hasIssue
	 */
	public hasIssue = true;

	/**
	 * Text to display when no issue is found
	 */
	public noIssueDescription: Translatable = {key: 'ui.business-base.translationIssueDialog.notifications.noIssue'};

	/**
	 * The component for current issue
	 */
	public issueComponent!: Type<unknown>;

	private currentIssue?: ITranslationIssue;
	private translationIssueService = inject(UiBusinessBaseEntityTranslationIssueService);
	private readonly englishTranslationIssueGuid = 'ccd81a8d96dc4bb6b222ef1858d79876';

	/**
	 * On Init
	 */
	public ngOnInit(): void {
		this.currentIssue = this.translationIssueService.getCurrentTranslationIssue();
		this.hasIssue =  this.currentIssue !== undefined;
		if(this.hasIssue) {
			if(this.currentIssue?.IssueGuid === this.englishTranslationIssueGuid) {
				this.issueComponent = ObsoleteEnglishTranslationIssueComponent;
			}
		}
	}
}