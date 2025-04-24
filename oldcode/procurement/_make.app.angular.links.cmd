@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink procurement common
call :createSymLink procurement ticketsystem
call :createSymLink procurement package
call :createSymLink procurement requisition
call :createSymLink procurement rfq
call :createSymLink procurement quote
call :createSymLink procurement pricecomparison
call :createSymLink procurement contract
call :createSymLink procurement pes
call :createSymLink procurement invoice
call :createSymLink procurement txinterface
call :createSymLink procurement stock
call :createSymLink procurement inventory
call :createSymLink procurement orderproposals


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
