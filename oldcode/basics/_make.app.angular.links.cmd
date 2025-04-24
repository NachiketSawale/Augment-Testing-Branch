@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Debug" set config=Debug.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink basics common
call :createSymLink basics bank
call :createSymLink basics clerk
call :createSymLink basics company
call :createSymLink basics country
call :createSymLink basics docu
call :createSymLink basics payment
call :createSymLink basics costcodes
call :createSymLink basics costgroups
call :createSymLink basics lookupdata		
call :createSymLink basics customize
call :createSymLink basics userform	
call :createSymLink basics unit
call :createSymLink basics currency
call :createSymLink basics characteristic
call :createSymLink basics assetmaster
call :createSymLink basics procurementstructure
call :createSymLink basics materialcatalog
call :createSymLink basics material
call :createSymLink basics materiallookup
call :createSymLink basics dependentdata
call :createSymLink basics masterdata
call :createSymLink basics config
call :createSymLink basics reporting
call :createSymLink basics workflow
call :createSymLink basics workflowAdministration
call :createSymLink basics workflowTask
call :createSymLink basics export
call :createSymLink basics billingschema
call :createSymLink basics textmodules
call :createSymLink basics pricecondition
call :createSymLink basics import
call :createSymLink basics indextable
call :createSymLink basics procurementconfiguration
call :createSymLink basics audittrail
call :createSymLink basics site
call :createSymLink basics controllingcostcodes
call :createSymLink basics regioncatalog
call :createSymLink basics accountingjournals
call :createSymLink basics riskregister
call :createSymLink basics efbsheets
call :createSymLink basics taxcode
call :createSymLink basics biplusdesigner
call :createSymLink basics salestaxcode
call :createSymLink basics meeting

echo symbolic link done ...

echo.  >>mklink.log

if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%.%submodul%"
:: set target="%myself%\%submodul%"
::echo mklink /j %link% %target%
@echo off
if exist %link% (
	::echo delete %link%
	rmdir %link%  >>mklink.log
	if exist %link% (
		echo It's not a link, delete folder delete %link%
		rmdir /s /q %link% >>mklink.log
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%.%submodul%"
set target="%myself%\%submodul%"

call :removeSymLink %1 %2

::echo mklink /j %link% %target%
mklink /j %link% %target%  >>mklink.log
echo.  >>mklink.log


goto :eof
