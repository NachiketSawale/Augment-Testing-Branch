@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink productionplanning item
call :createSymLink productionplanning common
call :createSymLink productionplanning eventconfiguration
call :createSymLink productionplanning productionset
call :createSymLink productionplanning ppsmaterial
call :createSymLink productionplanning mounting
call :createSymLink productionplanning configuration
call :createSymLink productionplanning report
call :createSymLink productionplanning activity
call :createSymLink productionplanning accounting
call :createSymLink productionplanning engineering
call :createSymLink productionplanning drawing
call :createSymLink productionplanning producttemplate
call :createSymLink productionplanning product
call :createSymLink productionplanning header
call :createSymLink productionplanning cadimportconfig
call :createSymLink productionplanning cadimport
call :createSymLink productionplanning fabricationunit
call :createSymLink productionplanning processconfiguration
call :createSymLink productionplanning formwork
call :createSymLink productionplanning strandpattern
call :createSymLink productionplanning drawingtype
call :createSymLink productionplanning formulaconfiguration
call :createSymLink productionplanning formworktype
call :createSymLink productionplanning productionplace
call :createSymLink productionplanning ppscostcodes

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
	rmdir %link%
	if exist %link% (
		echo It's not a link, delete folder delete %link%
		rmdir /s /q %link%
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
mklink /j %link% %target%
echo.


goto :eof
