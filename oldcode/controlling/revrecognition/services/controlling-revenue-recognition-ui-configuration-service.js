/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	var cloudCommonModule = 'cloud.common';
	/**
     * @ngdoc service
     * @name controllingRevenueRecognitionUILayout
     * @function
     * @requires
     *
     * @description
     * The UI configuration service for the module.
     */
	angular.module(moduleName).factory('controllingRevenueRecognitionUILayout', ['moment',
		function (moment) {

			return {
				fid: 'controlling.revenuerecognition.headerForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['prjprojectfk', 'companyyearfk', 'companyperiodfk','companyperiodfkstartdate', 'companyperiodfkenddate','prrstatusfk','basclerkresponsiblefk','userdefined1','userdefined2','userdefined3','userdefined4','userdefined5','commenttext','remark']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						baseGroup: {location: cloudCommonModule, identifier: 'entityBaseGroup', initial: 'Base Group'},
						PrjProjectFk: {location: moduleName, identifier: 'entityProjectFk', initial: 'Project'},
						CompanyYearFk: {location: moduleName, identifier: 'entityCompanyYearServiceFk', initial: 'Company Year Service'},
						CompanyPeriodFk: {location: moduleName, identifier: 'entityCompanyPeriod', initial: 'Reporting Period'},
						PrrStatusFk: {location: moduleName, identifier: 'entityPrrStatusFk', initial: 'Status'},
						BasClerkResponsibleFk: {location: moduleName, identifier: 'basClerkResponsibleFk', initial: 'Responsible'},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						UserDefined1: {'location': moduleName, identifier: 'userDefined1', initial: 'UserDefined1'},
						UserDefined2: {'location': moduleName, identifier: 'userDefined2', initial: 'UserDefined2'},
						UserDefined3: {'location': moduleName, identifier: 'userDefined3', initial: 'UserDefined3'},
						UserDefined4: {'location': moduleName, identifier: 'userDefined4', initial: 'UserDefined4'},
						UserDefined5: {'location': moduleName, identifier: 'userDefined5', initial: 'UserDefined5'},
						CompanyPeriodFkStartDate: {location: moduleName, identifier:'entityCompanyStartDate',initial:'Start Date'},
						CompanyPeriodFkEndDate: {location: moduleName, identifier:'entityCompanyEndDate',initial:'End Date'},
						HeaderDate: {'location': moduleName, identifier: 'headerDate', initial: 'Date'},
						Percentage: {'location': moduleName, identifier: 'percentage', initial: 'Percentage'},
						AmountTotal:{'location': moduleName, identifier: 'amountTotal', initial: 'Total'},
						Remark: {'location': cloudCommonModule, 'identifier': 'entityRemark', 'initial': 'Remark'}
					}
				},
				overloads: {
					prjprojectfk: {
						'navigator': {
							moduleName: 'project.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-project-lookup-dialog',
								'lookupOptions': {
									'filterKey': 'prj-by-company-filter',
									'showClearButton': false,
									'lookupType': 'PrcProject',
									'additionalColumns': true,
									'displayMember': 'ProjectNo',
									'descriptionMember': 'ProjectName',
									'addGridColumns': [
										{
											id: 'Name',
											field: 'ProjectName',
											name: 'Name',
											formatter: 'description',
											width: 150,
											name$tr$: 'cloud.common.entityName'
										}
									]
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcProject',
								'displayMember': 'ProjectNo'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-project-lookup-dialog',
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'showClearButton': false,
									'lookupType': 'PrcProject'
								}
							}
						}
					},
					companyyearfk:{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'controlling-revenue-recognition-company-year-combobox',
								'lookupOptions': {
									'filterKey': 'company-year-filter',
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'companyyear',
								'displayMember': 'TradingYear'
							},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'controlling-revenue-recognition-company-year-combobox',
							'options': {
								'filterKey': 'company-year-filter'
							}
						}
					},
					companyperiodfk:{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'controlling-revenue-recognition-company-period-combobox',
								'lookupOptions': {
									'filterKey': 'company-period-filter',
									'events': [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var startmoment = moment(args.selectedItem.StartDate);
											var endmoment = moment(args.selectedItem.EndDate);
											args.entity.CompanyPeriodFkStartDate = moment.utc(startmoment, 'L', false);
											args.entity.CompanyPeriodFkEndDate = moment.utc(endmoment, 'L', false);
										}
									}]
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'companyperiod',
								'displayMember': 'TradingPeriod'
							},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'controlling-revenue-recognition-company-period-combobox',
							'options': {
								'filterKey': 'company-period-filter',
								'events': [{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										var startmoment = moment(args.selectedItem.StartDate);
										var endmoment = moment(args.selectedItem.EndDate);
										args.entity.CompanyPeriodFkStartDate = moment.utc(startmoment, 'L', false);
										args.entity.CompanyPeriodFkEndDate = moment.utc(endmoment, 'L', false);
									}
								}]
							}
						}
					},
					companyperiodfkstartdate: {
						enableCache: true,
						readonly: true
					},
					companyperiodfkenddate: {
						enableCache: true,
						readonly: true
					},
					prrstatusfk: {
						readonly: true,
						grid: {
							editor: '',
							editorOptions: null,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RevenueRecognitionStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						detail: {
							type: 'directive',
							model: 'PrrStatusFk',
							directive: 'controlling-Revenue-Recognition-status-combobox',
							options: {
								readOnly: true
							}
						}
					},
					basclerkresponsiblefk:{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'clerk',
								'displayMember': 'Code'
							},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionField': 'ClerkReqDescription',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'ClerkReqCode',
									'showClearButton': true
								}
							}
						}
					}
				}
			};

		}
	]);
})(angular);
