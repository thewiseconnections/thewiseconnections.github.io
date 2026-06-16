Attribute VB_Name = "UniversityAutoUpdate"
' Excel desktop auto-update for University tab
'
' SETUP:
' 1. Open the workbook in Excel
' 2. Press Alt+F11 (VBA editor)
' 3. Insert → Module, paste this code
' 4. Save workbook as .xlsm (macro-enabled)
' 5. In VBA editor, double-click "List" sheet under Microsoft Excel Objects
' 6. Paste the ListSheetChange procedure below into that sheet module
'
' Or run UpdateUniqueUniversities manually from Macros.

Public Sub UpdateUniqueUniversities()
    Dim listWs As Worksheet
    Dim uniWs As Worksheet
    Dim lastRow As Long
    Dim r As Long
    Dim cellVal As String
    Dim dict As Object
    Dim key As Variant
    Dim outRow As Long
    Dim arr() As String
    Dim i As Long
    Dim j As Long
    Dim tmp As String

    Set listWs = ThisWorkbook.Worksheets("List")
    On Error Resume Next
    Set uniWs = ThisWorkbook.Worksheets("University")
    On Error GoTo 0
    If uniWs Is Nothing Then
        Set uniWs = ThisWorkbook.Worksheets.Add(After:=listWs)
        uniWs.Name = "University"
    End If

    lastRow = listWs.Cells(listWs.Rows.Count, "D").End(xlUp).Row
    Set dict = CreateObject("Scripting.Dictionary")

    For r = 2 To lastRow
        cellVal = Trim(CStr(listWs.Cells(r, 4).Value))
        If Len(cellVal) > 0 Then
            If Not dict.Exists(LCase(cellVal)) Then
                dict.Add LCase(cellVal), cellVal
            End If
        End If
    Next r

    ReDim arr(0 To dict.Count - 1)
    i = 0
    For Each key In dict.Keys
        arr(i) = dict(key)
        i = i + 1
    Next key

    ' Simple sort
    For i = LBound(arr) To UBound(arr) - 1
        For j = i + 1 To UBound(arr)
            If StrComp(arr(i), arr(j), vbTextCompare) > 0 Then
                tmp = arr(i)
                arr(i) = arr(j)
                arr(j) = tmp
            End If
        Next j
    Next i

    uniWs.Cells.Clear
    uniWs.Range("A1").Value = "University"
    outRow = 2
    For i = LBound(arr) To UBound(arr)
        uniWs.Cells(outRow, 1).Value = arr(i)
        outRow = outRow + 1
    Next i
End Sub

' --- Paste this into the List sheet module (not standard module) ---
' Private Sub Worksheet_Change(ByVal Target As Range)
'     On Error GoTo CleanUp
'     If Not Intersect(Target, Me.Range("D:D")) Is Nothing Then
'         Application.EnableEvents = False
'         UpdateUniqueUniversities
'     End If
' CleanUp:
'     Application.EnableEvents = True
' End Sub
