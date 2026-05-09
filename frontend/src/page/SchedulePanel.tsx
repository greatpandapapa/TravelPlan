import {useState} from 'react';
import Box from '@mui/material/Box';
import { plan } from '../lib/Plan';
import {useWindowSize} from '../lib/useWindowsSize';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridRow,
} from '@mui/x-data-grid';

import {StripedDataGrid} from '../component/CustomMui';
import { IScheduleRows } from '../typings/data_json';
import {EditScheduleModal} from './ScheduleModal';
import {ISchedule} from '../typings/data_json';
import {cmText,cmNum,cmBool,cmGridCol} from '../lib/Common';

type ScheduleGridProps = {
  mode: string;
}

/**
 * スケジュールGrid
 */
export function ScheduleGrid(props:ScheduleGridProps) {
  const [, height] = useWindowSize(); // widthは使ってないので省略
  const initialRows: GridRowsProp = plan.getScheduleRows(); 
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // 編集終了ボタンの処理
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  /*
  // 編集開始ボタンの処理
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };*/

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
    if (editedRow !== undefined) {
      let new_id = plan.addSchedule(editedRow.id);
      const initialRows: GridRowsProp = plan.getScheduleRows(); 
      setRows(initialRows);
      setRowModesModel({ ...rowModesModel, [new_id]: { mode: GridRowModes.Edit } });
    }
  };

  // スケジュールデータの更新
  const processRowUpdate = (newRow: GridRowModel) => {   
    // 古い情報を取得
    let i;
    for(i=0;i<rows.length;i++) {
      if (rows[i].id === newRow.id) {
        break;
      }
    }
    let oldRow = rows[i] as IScheduleRows;
    // end_timeとstay_minutesのどちらが更新されているかを確認し、
    // end_timeが更新されていたらend_timeからstay_minutesを算出してセットする
    if (newRow.end_time !== oldRow.end_time && newRow.stay_minutes === oldRow.stay_minutes) {
      let stime = dayjs(newRow.start_time,"H:mm");
      let etime = dayjs(newRow.end_time,"H:mm");
      // etimeの方が遅ければ24時間経過と考える
      if (stime > etime) {
        etime = etime.add(1,"d");
      }
      let m:number = etime.diff(stime,"m");
      newRow.stay_minutes = m;
    }

    plan.updateSchedule(newRow as object)
    const initialRows: GridRowsProp = plan.getScheduleRows(); 
    setRows(initialRows);
    for(i=0;i<initialRows.length;i++) {
      if (initialRows[i].id === newRow.id) {
        break;
      }
    }
    // DataGridの譲歩を更新
    const updatedRow = { ...initialRows[i], isNew: false };
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Editモードならeditableをtrueにする 
  let enable_editable:boolean;
  enable_editable = cmBool(true,false);

  const [schedule,setSchedule] = useState<ISchedule>(plan.getNewSchedule());

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // Modelのリスト更新
  const updateList = () => {
    setRows(plan.getTableRows());
  }
  // Modelのフォームを更新
  const updateForm = (dest:object) => {
    setSchedule(dest as ISchedule);
  }
  // Modelのデータ更新
  const saveData = () => {
    plan.updateSchedule(schedule);
    updateList();
    handleClose();
  };

  // モバイルで有効なフィールド
  const enable_mobile_fields: string[] = ["dayn",'start_time_auto','start_time','stay_minutes','name','actions'];
  // 列の定義
  const full_columns: GridColDef[] = [
    {
      field: 'id', 
      headerName: 'ID', 
      width: 40, 
      editable: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'dayn',
      headerName: '日付',
      type: 'string',
      width: cmNum(120,100),
      align: 'left',
      headerAlign: 'center',
      editable: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'start_time_auto',
      headerName: '連結',
      type: 'singleSelect',
      width: 50,
      align: 'left',
      headerAlign: 'center',
      editable: enable_editable,
      disableColumnMenu: true,
      valueOptions: plan.getAutoValueOptions(),
      sortable: false,
    },
    {
      field: 'start_time',
      headerName: cmText('開始時刻','開始'),
      type: 'string',
      width: cmNum(80,70),
      align: 'center',
      headerAlign: 'center',
      editable: enable_editable,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'end_time',
      headerName: '終了時刻',
      type: 'string',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      editable: enable_editable,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'stay_minutes',
      headerName: cmText('滞在時間','滞在'),
      type: 'number',
      width: cmNum(80,50),
      align: 'right',
      headerAlign: 'center',
      editable: enable_editable,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'tz_ajust',
      headerName: 'TZ',
      type: 'number',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      editable: enable_editable,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'type',
      headerName: '種類',
      width: 100,
      editable: enable_editable,
      type: 'singleSelect',
      valueOptions: plan.getTypeValueOptions,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'name',
      headerName: '予定',
      width: cmNum(220,100),
      editable: enable_editable,
      type: 'string',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'dest_id',
      headerName: '行先',
      width: 200,
      editable: enable_editable,
      type: 'singleSelect',
      valueOptions: plan.getDestinationValueOptions(),
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'fee',
      headerName: '費用',
      width: 100,
      headerAlign: 'center',
      editable: enable_editable,
      type: 'number',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'currency',
      headerName: '通貨',
      width: 80,
      editable: enable_editable,
      headerAlign: 'center',
      type: 'singleSelect',
      valueOptions: plan.getCurrencyValueOptions(),
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: cmNum(100,80),
      cellClassName: 'actions',
      disableColumnMenu: true,
      sortable: false,
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
              onClick={()=>{
                setSchedule(plan.getSchedule(id as number));
                handleOpen();
              }}
              //onClick={handleEditClick(id)}
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

  // 列の定義を代入
  let columns: GridColDef[] = cmGridCol(full_columns,enable_mobile_fields);

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
        marginY: "5px" 
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
        sx={{margin:0}}
      />
      <EditScheduleModal 
        open={open}
        handleClose={handleClose} 
        updateForm={updateForm}
        saveData={saveData}
        schedule={schedule}
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
