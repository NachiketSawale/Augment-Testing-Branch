(function (angular) {
	'use strict';
	var modulename = 'cloud.desktop';
	angular.module(modulename).directive('cloudDesktopAboutDbVerTable',
		[function () {
			return {
				restrict: 'A',
				scope: true,
				template: function (/* elem, attrs */) {
					return '<table class="table table-default margin-none" style="border-bottom: 0;"><tr><th colspan="7" class="font-bold">Installed Version Info</th></tr>' +
						'<tr><th scope="col">Id</th><th scope="col">BuildNr</th>' +
						'<th scope="col">Module</th><th scope="col">BuildOrder</th>' +
						'<th scope="col">Inserted</th><th scope="col">Version</th>' +
						'<th scope="col">Who</th><tr data-ng-repeat="row in systemInfo.buildRecords">' +
						// ' <tr data-cloud-desktop-about-db-ver-row data-row="{{row}}" >' +
						'<td>{{row.id}}</td>' + '<td>{{row.buildNr}}</td>' + '<td>{{row.module}}</td>' +
						'<td>{{row.buildOrder}}</td>' + '<td ng-bind="row.insertedfmt"></td>' + '<td>{{row.version}}</td>' + '<td>{{row.whoIsr}}</td>' +
						'</tr>' +
						'</table>';
				}
			};
		}
		]
	);
	angular.module(modulename).directive('cloudDesktopAboutAddComponentsVersionTable',
		[function () {
			return {
				restrict: 'A',
				scope: true,
				template: function (/* elem, attrs */) {
					return '<table class="table table-default margin-none" style="border-bottom: 0;"><tr><th colspan="7" class="font-bold">Additional Components</th></tr>' +
						'<tr><th scope="col">Components</th><th scope="col">BuildNr</th><th scope="col">BuildDate</th><th scope="col">Info</th>'+
						'<tr data-ng-repeat="row in systemInfo.otherComponentsRecords">' +
						'<td>{{row.componentName}}</td><td>{{row.buildNr}}</td><td>{{row.buildDate}}</td><td>{{row.additionalInfo}}</td>' +
						'</tr>' +
						'</table>';
				}
			};
		}
		]
	);

	angular.module(modulename).directive('cloudDesktopAboutDbVerServer',
		[function () {
			return {
				restrict: 'A',
				scope: true,
				template: function (/* elem, attrs */) {
					return '<table class="table table-default margin-none" style="border-bottom: 0;"> <tr><th colspan="2" class="font-bold">Web/Database Server Info</th></tr>' +
						'<tr><td>WebServername:</td><td>{{systemInfo.nodeMachineName}}</td></tr>' +
						'<tr><td>Servername:</td><td>{{systemInfo.databaseServerName}}</td></tr>' +
						'<tr><td>Addition Info:</td><td>{{systemInfo.databaseServerVersion}}</td></tr>' +
						// '<tr><td>Services Url:</td><td>{{systemInfo.servicesUrl}}</td></tr>' +
						'</table>';
				}
			};
		}
		]
	);

	angular.module(modulename).directive('cloudDesktopAboutQrCodes',
		['$translate', function ($translate) {
			return {
				restrict: 'A',
				scope: true,
				link: function (scope) {
					scope.titleClientUrl = $translate.instant('cloud.desktop.aboutdialog.titleClientUrl');
					scope.titleServerUrl = $translate.instant('cloud.desktop.aboutdialog.titleServerUrl');
					scope.titleServicesUrl = $translate.instant('cloud.desktop.aboutdialog.titleServicesUrl');
					scope.titleMobileSolution = $translate.instant('cloud.desktop.aboutdialog.titleMobileSolution');
					scope.descriptionMobileSolution = $translate.instant('cloud.desktop.aboutdialog.descriptionMobileSolution');
				},
				template: function () {
					return '<div class="font-bold">{{titleMobileSolution}}</div>' +
						'<div class="margin-bottom-ld">{{descriptionMobileSolution}}<br></div>' +
						'<div class="flex-box margin-bottom-ld">' +

						'<div class="flex-element" style="padding: 3px;">' +
						'<cloud-desktop-qr-code data-version="5" data-size="80" data-error-correction-level="M" data="{{systemInfo.serverUrl}}" ></cloud-desktop-qr-code>' +
						'<div class="margin-top-ld">{{titleServerUrl}}</div>' +
						'</div>' +

						'<div class="flex-element" style="padding: 3px;">' +
						'<cloud-desktop-qr-code version="5" size="80" error-correction-level="M" data="{{systemInfo.clientUrl}}" ></cloud-desktop-qr-code>' +
						'<div class="margin-top-ld">{{titleClientUrl}}</div>' +
						'</div>' +

						'<div class="flex-element" style="padding: 3px;">' +
						'<cloud-desktop-qr-code version="5" size="80" error-correction-level="M" data="{{systemInfo.servicesUrl}}" ></cloud-desktop-qr-code>' +
						'<div class="margin-top-ld">{{titleServicesUrl}}</div>' +
						'</div>' +

						'</div>';
				}
			};
		}
		]
	);
})(angular);
