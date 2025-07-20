import {useState,useCallback,memo} from 'react';
import Box from '@mui/material/Box';
import { plan } from '../lib/Plan';
import {useWindowSize} from '../lib/useWindowsSize';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
  GridRow,
  GridRowProps,
  GridRenderCellParams,
  GridRowParams,
  GridApi
} from '@mui/x-data-grid';

import {StripedDataGrid, StripedDataGridByGroup} from '../component/CustomMui';

type ScheduleGridProps = {
  mode: string;
}

/**
 * スケジュールGrid
 */
export function ScheduleGrid(props:ScheduleGridProps) {
  const [width, height] = useWindowSize();
  const initialRows: GridRowsProp = plan.getScheduleRows(); 
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // 編集終了ボタンの処理
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // 編集開始ボタンの処理
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // 編集保存ボタンの処理
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    const initialRows: GridRowsProp = plan.getScheduleRows(); 
    setRows(initialRows);
  };

  // 削除ボタンの処理
  const handleDeleteClick = (id: GridRowId) => () => {
    plan.delSchedule(id as number);
    const initialRows: GridRowsProp = plan.getScheduleRows(); 
    setRows(initialRows);
  };

  // 編集キャンセルボタン
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // 追加ボタン
  const handleAddClick = (id: GridRowId) => () => {
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow != undefined) {
      let new_id = plan.addSchedule(editedRow.id);
      const initialRows: GridRowsProp = plan.getScheduleRows(); 
      setRows(initialRows);
      setRowModesModel({ ...rowModesModel, [new_id]: { mode: GridRowModes.Edit } });
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    
    plan.updateSchedule(newRow as object)
    const initialRows: GridRowsProp = plan.getScheduleRows(); 
    setRows(initialRows);

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Editモードならeditableをtrueにする 
  let enable_editable:boolean;
  enable_editable = true;

  // 列の定義
  const columns: GridColDef[] = [
    {
      field: 'id', 
      headerName: 'ID', 
      width: 80, 
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'dayn',
      headerName: '日付',
      type: 'string',
      width: 160,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'start_time_auto',
      headerName: '連結',
      type: 'singleSelect',
      width: 90,
      align: 'left',
      headerAlign: 'left',
      editable: enable_editable,
      disableColumnMenu: true,
      valueOptions: plan.getAutoValueOptions(),
    },
    {
      field: 'start_time',
      headerName: '開始時刻',
      type: 'string',
      width: 145,
      align: 'left',
      headerAlign: 'left',
      editable: enable_editable,
    },
    {
      field: 'stay_minutes',
      headerName: '滞在時間',
      type: 'number',
      width: 145,
      align: 'left',
      headerAlign: 'left',
      editable: enable_editable,
    },
    {
      field: 'type',
      headerName: '種類',
      width: 120,
      editable: enable_editable,
      type: 'singleSelect',
      valueOptions: plan.getTypeValueOptions,
    },
    {
      field: 'name',
      headerName: '予定',
      width: 180,
      editable: enable_editable,
      type: 'string',
    },
    {
      field: 'dest_id',
      headerName: '行先',
      width: 180,
      editable: enable_editable,
      type: 'singleSelect',
      valueOptions: plan.getDestinationValueOptions(),
    },
    {
      field: 'memo',
      headerName: '備考',
      width: 100,
      editable: enable_editable,
      disableColumnMenu: true,
      type: 'string'
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<AddIcon />}
              label="Add"
              onClick={handleAddClick(id)}
              color="inherit"
            />,
          ];
        }
      },
    }
  ];

  let slots = {
//    toolbar: EditToolbar as GridSlots['toolbar'],
    row: GridRow 
  };
  let slotProps = {
    toolbar: { setRows, setRowModesModel },
  };

  return (
    <Box
      sx={{
        height: height-140,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        marginY: "10px" 
      }}
      >
      <StripedDataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={slots}
        slotProps={slotProps}
        rowHeight={35}
      />
    </Box>
  );
}

/**
 * スケジュール編集パネル
 */
export function ScheduleEditPanel() {
  return (
      <div>
          <ScheduleGrid mode="edit"></ScheduleGrid>
      </div>
  );
}
