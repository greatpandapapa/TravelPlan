import {useState,ChangeEvent,ReactElement,SyntheticEvent} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { plan } from '../lib/Plan';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {useWindowSize} from '../lib/useWindowsSize';
import { Link } from 'react-router-dom';

import {
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridEventListener,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
  GridRow,
  GridRowModes,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { IBringItem } from '../typings/data_json';
import {StripedDataGrid} from '../component/CustomMui';

// Propsの型
type BringItemGridProps = {
  updateList: () => void;
  BringItemRows: object[];
}

export function BringItemGrid(props:BringItemGridProps) {
  const [width, height] = useWindowSize();

  const rows: GridRowsProp = props.BringItemRows; 
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // 編集終了ボタンの処理
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
    props.updateList();
  };

  // 編集開始ボタンの処理
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // 編集保存ボタンの処理
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    props.updateList();
  };

  // 削除ボタンの処理
  const handleDeleteClick = (id: GridRowId) => () => {
    plan.delBringItem(id as number);
    props.updateList();
  };

  // 編集キャンセルボタン
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  /**
   * 編集データのアップデート処理
   */
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    
    plan.updateBringItem(newRow as object)
    props.updateList();

    return updatedRow;
  };

  /**
   * 行のモード変更
   */
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100, 
      editable: false 
    },
    {
      field: 'name',
      headerName: '名前',
      type: 'string',
      width: 400,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'type',
      headerName: '種類',
      type: 'singleSelect',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      valueOptions: plan.getBringItemTypeValueOptions(),
    },
    {
      field: 'memo',
      headerName: '備考',
      type: 'string',
      width: 200,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'checked',
      headerName: 'チェック',
      type: 'boolean',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      editable: true,
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
          ];
        }
      },
    },
  ];

  return (
    <Box
      sx={{
        height: height-180,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
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
            rowHeight={35}
        />
    </Box>
  );
}

/**
 * 持ち物パネル
 */
export function BringItemPanel() {
  const [BringItemRows,setBringItemRows] = useState<object[]>(plan.getBringItemRows());

  // リスト更新
  const updateList = () => {
    setBringItemRows(plan.getBringItemRows());
  }

  // 持ち物を追加
  const addClickHandler = () => {
    const item = plan.getNewBringItem();
    plan.updateBringItem(item);
    updateList();
  }

  return (
    <div>
      <Box sx={{display: 'flex',flexDirection: 'row',m:0, p:0,marginY: "10px" }}>
        <Box sx={{m:0, p:0}}>
        <Button onClick={addClickHandler} fullWidth><AddIcon></AddIcon>追加</Button>
        </Box>
      </Box>
      <BringItemGrid BringItemRows={BringItemRows} updateList={updateList}></BringItemGrid>
    </div>
  );
}

export default BringItemPanel;
