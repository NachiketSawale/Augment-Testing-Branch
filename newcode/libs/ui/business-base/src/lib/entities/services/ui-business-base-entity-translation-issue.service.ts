/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ITranslationIssue } from '../model/translation-issue.interface';
import { Observable } from 'rxjs';
import { ITranslationIssueResolveParam } from '../model/translation-issue-resolve-param.interface';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ITranslationIssueHistoryParam } from '../model/translation-issue-history-param.interface';
import { ITranslationIssueHistory } from '../model/translation-issue-history.interface';
import { ITranslationIssueParam } from '../model/translation-issue-param.interface';

@Injectable({
	providedIn: 'root'
})
export class UiBusinessBaseEntityTranslationIssueService {

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private currentIssue?: ITranslationIssue | undefined;
	private currentIssueHistory: ITranslationIssueHistory[] = [];

	/**
	 * Gets the translation issue of a specific description property from server
	 * @param issuesParam
	 */
	public getTranslationIssues(issuesParam: ITranslationIssueParam): Observable<ITranslationIssue[]> {
		return this.http.get<ITranslationIssue[]>(this.configService.webApiBaseUrl + 'cloud/common/translationissue/getIssues', {params: issuesParam});
	}

	/**
	 * Sets the currentIssue
	 * @param currentIssue
	 */
	public setCurrentTranslationIssues(currentIssue: ITranslationIssue | undefined): void {
		this.currentIssue = currentIssue;
	}

	/**
	 * Gets the currentIssue
	 */
	public getCurrentTranslationIssue() {
		return this.currentIssue;
	}

	/**
	 * Resolve a particular translation issue
	 * @param resolveIssueParam
	 */
	public resolveIssue(resolveIssueParam: ITranslationIssueResolveParam): Observable<boolean> {
		return this.http.post<boolean>(this.configService.webApiBaseUrl + 'cloud/common/translationissue/performAction', resolveIssueParam);
	}

	/**
	 * Gets the issue history from the server
	 * @param issueHistoryParam
	 */
	public getIssueHistory(issueHistoryParam: ITranslationIssueHistoryParam): Observable<ITranslationIssueHistory[]> {
		return this.http.post<ITranslationIssueHistory[]>(this.configService.webApiBaseUrl + 'cloud/common/translationissue/getHistory', issueHistoryParam);
	}

	/**
	 * Sets the currentIssueHistory
	 * @param history
	 */
	public setCurrentTranslationIssueHistory(history: ITranslationIssueHistory[]) {
		this.currentIssueHistory = history;
	}

	/**
	 * Gets the currentIssueHistory
	 */
	public getCurrentTranslationIssueHistory() {
		return this.currentIssueHistory;
	}
}