/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { IDownloadInitialize } from '../../model/interface/download-initialize.interface';
import { IDownload } from '../../model/interface/download.interface';
import { ICheck } from '../../model/interface/check.interface';

import { ExportsResults } from '../../model/enum/exports-results.enum';
import { DownloadStateTypes } from '../../model/enum/download-state.enum';
import { DownloadActionState } from '../../model/enum/download-action-state.enum';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

/**
 * This component is for download page
 */
@Component({
	selector: 'webapihelp-main-download',
	templateUrl: './webapihelp-main-download.component.html',
	styleUrls: ['./webapihelp-main-download.component.scss'],
})
export class WebApiHelpMainDownloadComponent implements OnInit, OnDestroy {
	/**
	 * Download Stages for download button.
	 */
	private downloadState = DownloadActionState;

	/**
	 * Injection for WebApiHelp Service
	 */
	private webApiHelpService = inject(WebApiHelpMainService);

	/**
	 * Class name
	 */
	public className!: string;

	/**
	 * Style for show process stages
	 */
	public styleName!: object;

	/**
	 * Text message for download stages
	 */
	public text: string = this.downloadState.ProgressPercent;

	/**
	 * Subscription for authorize token.
	 */
	private authorizeSubscription$!: Subscription;

	/**
	 * Subscription for initialization.
	 */
	private initializeSubscription$!: Subscription;

	/**
	 * Subscription for download.
	 */
	private downloadSubscription$!: Subscription;

	/**
	 * Subscription for check token for download.
	 */
	private checkSubscription$!: Subscription;

	/**
	 * Enum object for download stages.
	 */
	private exportResults = ExportsResults;

	/**
	 * Enum for download states.
	 */
	public stateTypes = DownloadStateTypes;

	/**
	 * The security token.
	 */
	public securityToken!: string;

	public constructor() {
		this.showResult(this.downloadState.ProgressPercent_1, 1, this.exportResults.processing);
	}

	public ngOnInit() {
		this.showResult(this.downloadState.ProgressPercent_2, 2, this.exportResults.processing);
		this.exportDoc();
	}

	/**
	 * method to show download process and message in to the button
	 * @param { string } message Download message
	 * @param { number } progress Download progress
	 * @param { string } mType class name
	 */
	public showResult(message: string, progress: number, mType: string): void {
		this.className = mType;
		this.styleName = { left: '-' + (100 - progress) + '%' };
		this.text = message;
	}

	/**
	 * Subscribe the authorize token and from that initialize the download process
	 */
	public exportDoc(): void {
		this.showResult(this.downloadState.ProgressPercent_3, 1, this.exportResults.processing);
		this.authorizeSubscription$ = this.webApiHelpService.getAuthorizeToken().subscribe(
			(response: HttpResponse<string>) => {
				this.showResult(this.downloadState.ProgressPercent_1, 1, this.exportResults.processing);
				this.securityToken = response.body as string;
				this.initializeSubscription$ = this.webApiHelpService.getInitialize(this.securityToken).subscribe(
					(info: IDownloadInitialize) => {
						if (info.IsSuccess) {
							if (info.State.State === this.stateTypes.Ready) {
								this.startDownload(info['ExportToken']);
							} else {
								this.startCheck(info['ExportToken']);
							}
						} else {
							this.showResult(info.Message, 100, this.exportResults.failed);
						}
					},
					(error) => {
						this.showResult(this.downloadState.Canceled, 100, this.exportResults.failed);
					},
				);
			},
			(error) => {
				this.showResult(this.downloadState.Canceled, 100, this.exportResults.failed);
			},
		);
	}

	/**
	 * The subscription for download file
	 * @param { string } exportToken  Token for download file
	 */
	public startDownload(exportToken: string): void {
		this.authorizeSubscription$ = this.webApiHelpService.getAuthorizeToken().subscribe(
			(response: HttpResponse<string>) => {
				this.securityToken = response.body as string;
				this.downloadSubscription$ = this.webApiHelpService.getDownload(this.securityToken, exportToken).subscribe(
					(res: IDownload) => {
						if (res['Success']) {
							this.showResult(this.downloadState.Downloaded, 100, this.exportResults.complete);
							window.location.href = res['Url'];
						} else {
							this.showResult(res['Message'], 100, this.exportResults.failed);
						}
					},
					(error) => {
						this.showResult(this.downloadState.Canceled, 100, this.exportResults.failed);
					},
				);
			},
			(error) => {
				this.showResult(this.downloadState.Canceled, 100, this.exportResults.failed);
			},
		);
	}

	/**
	 * Subscription for check the token is valid and download other wise check again
	 * @param { string } exportToken Token for download file
	 */
	public startCheck(exportToken: string): void {
		this.checkSubscription$ = this.webApiHelpService.getCheck(exportToken).subscribe(
			(res: ICheck) => {
				switch (res.State) {
					case this.stateTypes.Unknown:
					case this.stateTypes.Processing:
						if (res.State === this.stateTypes.Processing) {
							const message = this.downloadState.Preparing + res.Progress.toFixed(2) + '% ...';
							this.showResult(message, res.Progress, this.exportResults.processing);
						}
						window.setTimeout(() => {
							this.startCheck(exportToken);
						}, 3000);
						break;
					case this.stateTypes.Ready:
						this.startDownload(exportToken);
						break;
					default:
						this.showResult(res.Message, 100, this.exportResults.failed);
						break;
				}
			},
			(error) => {
				throw new Error(error);
			},
		);
	}

	public ngOnDestroy() {
		this.authorizeSubscription$.unsubscribe();
		this.initializeSubscription$ ? this.initializeSubscription$.unsubscribe() : null;
		this.downloadSubscription$ ? this.downloadSubscription$.unsubscribe() : null;
		this.checkSubscription$ ? this.checkSubscription$.unsubscribe() : null;
	}
}
