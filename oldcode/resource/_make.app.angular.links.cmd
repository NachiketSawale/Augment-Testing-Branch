@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink resource catalog
call :createSymLink resource certificate
call :createSymLink resource common
call :createSymLink resource componenttype
call :createSymLink resource enterprise
call :createSymLink resource equipment
call :createSymLink resource equipmentgroup
call :createSymLink resource maintenance
call :createSymLink resource master
call :createSymLink resource plantestimate
call :createSymLink resource plantpricing
call :createSymLink resource project
call :createSymLink resource requisition
call :createSymLink resource reservation
call :createSymLink resource skill
call :createSymLink resource type
call :createSymLink resource wot
call :createSymLink resource plantpricing

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
