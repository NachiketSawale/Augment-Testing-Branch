/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.annotation';

	/**
	 * @ngdoc service
	 * @name modelAnnotationUIConfigurationService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('modelAnnotationUIConfigurationService', modelAnnotationUIConfigurationService);

	modelAnnotationUIConfigurationService.$inject = ['_', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService', '$injector'];

	function modelAnnotationUIConfigurationService(_, basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService, $injector) {

		const modelAnnotationLookupConfig = {
			grid: {
				editor: 'lookup',
				editorOptions: {
					directive: 'model-annotation-lookup-dialog'
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'ModelAnnotation',
					displayMember: 'DescriptionInfo.Translated',
					version: 3
				},
				width: 100
			},
			detail: {
				type: 'directive',
				directive: 'model-annotation-lookup-dialog',
				options: {
					descriptionMember: 'DescriptionInfo.Translated'
				}
			}
		};

		let modelAnnotationDataService = null;

		function filterBySelectedAnnotationProject(item) {
			if (_.isInteger(item.ContextProjectId)) {
				return item.ContextProjectId;
			}

			if (!modelAnnotationDataService) {
				modelAnnotationDataService = $injector.get('modelAnnotationDataService');
			}


			const selAnnotation = modelAnnotationDataService.getSelected();
			return (selAnnotation && _.isInteger(selAnnotation.ProjectFk)) ? selAnnotation.ProjectFk : 0;
		}

		const service = {};



		const filters = [{
			key: 'model-annotation-defect-filter',
			serverKey: 'defect-header-filter',
			serverSide: true,
			fn: function (item) {
				return {
					ProjectFk: item.ProjectFk
				};
			}
		}, {
			key: 'model-annotation-hsqe-checklist-filter',
			serverSide: true,
			fn: item => 'PrjProjectFk == ' + (_.isInteger(item.ProjectFk) ? item.ProjectFk : 0)
		}, {
			key: 'model-annotation-info-request-filter',
			serverSide: true,
			serverKey: 'project-info-request-by-parent-entities-filter',
			fn: function (item) {
				return {
					ProjectFk: item.ProjectFk
				};
			}
		},{
			key: 'model-annotation-viewpoint-filter',
			serverSide: true,
			serverKey: 'model-viewpoint-filter',
			fn: function (item) {
				return {
					ProjectFk: item.ProjectFk
				};
			}
		}, {
			key: 'project-info-request-contact-by-bizpartner-filter',
			serverSide: true,
			serverKey: 'project-info-request-contact-by-bizpartner-filter',
			fn: function (item) {
				return {
					BusinessPartnerFk: item.BusinessPartnerFk
				};
			},
		},{
			key: 'model-stakeholder-subsidiary-filter',
			serverSide: true,
			serverKey: 'businesspartner-main-subsidiary-common-filter',
			fn: function (currentItem) {
				return {
					BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null
				};
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		service.getModelAnnotationLayout = function () {
			return {
				fid: 'model.annotation.modelAnnotationForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'contextGroup',
					attributes: ['projectfk', 'modelfk']
				}, {
					gid: 'baseGroup',
					attributes: ['rawtype', 'effectivecategoryfk', 'uuid', 'descriptioninfo', 'sorting', 'duedate', 'priorityfk', 'statusfk', 'color']
				}, {
					gid: 'linkageGroup',
					attributes: ['defectfk', 'inforequestfk', 'hsqchecklistfk', 'measurementfk'] //, 'viewpointfk'
				}, {
					gid: 'responsibilityGroup',
					attributes: ['clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'bpdcontactfk']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					rawtype: {
						grid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelAnnotationTypeIconService',
								acceptFalsyValues: true
							}
						},
						detail: {
							type: 'imageselect',
							options: {
								serviceName: 'modelAnnotationTypeIconService'
							}
						},
						readonly: true
					},
					color: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					},
					projectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						readonly: true
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectAllVersionedModelLookupDataService',
						enableCache: true,
						filter: item => _.isInteger(item.ProjectFk) ? item.ProjectFk : 0,
						readonly: true
					}),
					defectfk: {
						navigator: {
							moduleName: 'defect.main'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'defect-main-common-lookup-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'model-annotation-defect-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'DfmDefect',
								displayMember: 'Code'
							},
							bulkSupport: false
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'defect-main-common-lookup-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'model-annotation-defect-filter'
								}
							}
						},
						readonly: true
					},
					inforequestfk: {
						navigator: {
							moduleName: 'project.inforequest'
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-info-request-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'model-annotation-info-request-filter'
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-info-request-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'model-annotation-info-request-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectInfoRequest',
								displayMember: 'Code'
							}
						},
						readonly: true
					},
					hsqchecklistfk: {
						navigator: {
							moduleName: 'hsqe.checklist'
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'hsqe-checklist-header-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'model-annotation-hsqe-checklist-filter'
								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-checklist-header-lookup',
								lookupOptions: {
									filterKey: 'model-annotation-hsqe-checklist-filter'
								}
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CheckList',
								displayMember: 'Code'
							}
						}
					},
					viewpointfk: {
						navigator: {
							moduleName: 'model.main'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'viewpoint-main-common-lookup-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'model-annotation-viewpoint-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'VptViewpoint',
								displayMember: 'Code'
							},
							bulkSupport: false
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'viewpoint-main-common-lookup-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'model-annotation-viewpoint-filter'
								}
							}
						},
						readonly: true
					},
					measurementfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-measurement-lookup-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ModelMeasurement',
								displayMember: 'Value',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-measurement-lookup-dialog',
							options: {
								descriptionMember: 'Value',
							}
						},
						readonly: true
					},
					effectivecategoryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelAnnotationCategoryLookupPrefixLogicDataService',
						enableCache: true,
						filter: item => _.get(item, 'RawType') || 0,
						gridLess: true
					}),
					statusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.modelannotationstatus', null, {showIcon: true}),
					priorityfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.priority', 'Description'),
					clerkfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Description'
							}
						}
					},
					businesspartnerfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-business-partner-dialog',
							options: {
								initValueField: 'BusinesspartnerBpName1',
								showClearButton: true,
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-business-partner-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							}
						}
					},
					bpdcontactfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-filtered-contact-combobox',
							options: {
								initValueField: 'FamilyName',
								showClearButton: true,
								filterKey: 'project-info-request-contact-by-bizpartner-filter'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-filtered-contact-combobox',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'project-info-request-contact-by-bizpartner-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'FamilyName'
							},
						}
					},
					subsidiaryfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-subsidiary-lookup',
							options: {
								initValueField: 'SubsidiaryAddress',
								showClearButton: true,
								displayMember: 'AddressLine',
								filterKey: 'model-stakeholder-subsidiary-filter'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									showClearButton: true,
									displayMember: 'AddressLine',
									filterKey: 'model-stakeholder-subsidiary-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							}
						}
					},
				}
			};
		};

		service.getReferenceLayout = function () {
			return {
				fid: 'model.annotation.referenceForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['referencetypefk', 'fromannotationfk', 'toannotationfk']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					referencetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelannotationreferencetype', 'Description'),
					fromannotationfk: modelAnnotationLookupConfig,
					toannotationfk: modelAnnotationLookupConfig
				}
			};
		};

		service.getObjectLinkLayout = function () {
			return {
				fid: 'model.annotation.objectLinkForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['linkkind', 'isimportant']
				}, {
					gid: 'linkageGroup',
					attributes: ['modelfk', 'objectfk', 'projectfk', 'objectsetfk']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					linkkind: {
						grid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelAnnotationObjectLinkTypeIconService',
								acceptFalsyValues: true
							}
						},
						detail: {
							type: 'imageselect',
							options: {
								serviceName: 'modelAnnotationObjectLinkTypeIconService'
							}
						},
						readonly: true
					},
					objectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-main-object-lookup-dialog',
								pKeyMaps: [{fkMember: 'ModelFk', pkMember: 'ModelFk'}],
								lookupOptions: {
									filterKey: 'model-main-object-by-model-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ModelObject',
								displayMember: 'Description',
								version: 3,
								pKeyMaps: [{fkMember: 'ModelFk', pkMember: 'ModelFk'}]
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-annotation-lookup-dialog',
							options: {
								descriptionMember: 'DescriptionInfo',
								pKeyMaps: [{fkMember: 'ModelFk', pkMember: 'ModelFk'}],
								lookupOptions: {
									filterKey: 'model-main-object-by-model-filter'
								}
							}
						}
					},
					projectfk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						readonly: true
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectVersionedModelLookupDataService',
						enableCache: true,
						filter: filterBySelectedAnnotationProject
					}),
					objectsetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectSetLookupDataService',
						enableCache: true,
						filter: filterBySelectedAnnotationProject,
						additionalColumns: true
					})
				}
			};
		};

		service.getCameraLayout = function () {
			return {
				fid: 'model.annotation.cameraForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'isorthographic', 'showinviewer', 'uuid', 'contextmodelid']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					isorthographic: {
						readonly: true
					},
					contextmodelid: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectVersionedModelLookupDataService',
						enableCache: true,
						filter: filterBySelectedAnnotationProject,
						readonly: true
					})
				}
			};
		};

		service.getDocumentLayout = function () {
			return {
				fid: 'model.annotation.documentForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'basdocumenttypefk', 'annotationdocumenttypefk', 'documentdate', 'originfilename', 'uuid']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					basdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.basDocumenttype'),
					annotationdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelannotationdocumenttype'),
					originfilename: {
						readonly: true
					}
				}
			};
		};

		service.getMarkerLayout = function () {
			return {
				fid: 'model.annotation.markerForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'markershapefk', 'color', 'contextmodelid', 'posx', 'posy', 'posz', 'camerafk','showinviewer']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					contextmodelid: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectVersionedModelLookupDataService',
						enableCache: true,
						filter: filterBySelectedAnnotationProject,
						readonly: true
					}),
					markershapefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelmarkershape'),
					color: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					},
					posx: {
						readonly: true
					},
					posy: {
						readonly: true
					},
					posz: {
						readonly: true
					},
					camerafk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'modelAnnotationCameraLookupDataService',
						enableCache: true,
						filter: item => _.get(item, 'AnnotationFk') || 0,
					})
				}
			};
		};

		return service;
	}
})(angular);
