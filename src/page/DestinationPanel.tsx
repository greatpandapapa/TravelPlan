import {useState,ChangeEvent,ReactElement,SyntheticEvent} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { plan } from '../lib/Plan';
import AddIcon from '@mui/icons-material/Add';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import {useWindowSize} from '../lib/useWindowsSize';
import { Link } from 'react-router-dom';

import {
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import { IDestination } from '../typings/data_json';
import {StripedDataGrid} from '../component/CustomMui';

// Propsの型
type DestinationGridProps = {
  updateList: () => void;
  destinationRows: object[];
}

export function DestinationGrid(props:DestinationGridProps) {
  const [width, height] = useWindowSize();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [destination,setDestination] = useState<IDestination>(plan.getNewDestination());

  const rows: GridRowsProp = props.destinationRows; 

  const handleDeleteClick = (id: GridRowId) => () => {
    plan.delDestination(id as number);
    props.updateList();
    //    setRows(rows.filter((row) => row.id !== id));
  };

  // フォームを更新
  const updateForm = (dest:object) => {
    setDestination(dest as IDestination);
  }

  // 登録開始
  const saveData = () => {
    plan.updateDestination(destination);
    props.updateList();
    handleClose();
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80, 
      editable: false },
    {
      field: 'type',
      headerName: '種類',
      width: 120,
      type: 'singleSelect',
      valueOptions: plan.getTypeValueOptions,
    },
    {
      field: 'name',
      headerName: '名前',
      type: 'string',
      width: 250,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'address',
      headerName: '住所',
      type: 'string',
      width: 250,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'tel_number',
      headerName: 'TEL',
      type: 'string',
      width: 120,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'reservation',
      headerName: '予約',
      type: 'string',
      width: 120,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'reservation_url',
      headerName: '予約サイト',
      type: 'string',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({id}) => {
        const row = rows.find(row => row.id === id);
        if (row == undefined || row.reservation_url == "") {
          return (<></>);
        } else {
          let site:string = row.reservation_site;
          if (site == "") {
            site = "予約サイト";
          }
          return (<Link target="_blank" to={`${row.reservation_url}`}>{site}</Link>)
        }
      }
    },
    {
      field: 'url',
      headerName: '情報源',
      type: 'string',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({id}) => {
        const row = rows.find(row => row.id === id);
        if (row == undefined || row.url == "") {
          return (<></>);
        } else {
          let source:string = row.source;
          if (source == "") {
            source = "情報源";
          }
          return (<Link target="_blank" to={`${row.url}`}>{source}</Link>)
        }
      }
    },
    {
      field: 'url2',
      headerName: '参考',
      type: 'string',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          ((params.value != "")) && (
            <Link target="_blank" to={`${params.value}`}>参考</Link>
          )
        )
      }
    },
    {
      field: 'map_url',
      headerName: '地図',
      type: 'string',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          ((params.value != "")) && (
            <Link target="_blank" to={`${params.value}`}>MAP</Link>
          )
        )
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={()=>{
              setDestination(plan.getDestination(id as number));
              handleOpen();
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
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
        rowHeight={35}
      />
      <EditDestinationModal 
        open={open}
        handleClose={handleClose} 
        updateForm={updateForm}
        saveData={saveData}
        destination={destination}
      >
      </EditDestinationModal>
    </Box>
  );
}

// Propsの型
type EditDestinationGridProps = {
  open: boolean;
  updateForm: (dest:IDestination) => void;
  saveData: () => void;
  handleClose: () => void;
  destination: IDestination;
  children?: never[];
}

/**
 * 編集モーダル
 */
export function EditDestinationModal(props:EditDestinationGridProps) {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 620,
    height: 560,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 12,
    p: 2,
  };


  let typeOptions:ReactElement[]=[];
  plan.getTypeValueOptions().map((opt)=>{
    typeOptions.push(<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>);
  });

  interface IOptions {
    value: string,
    label: string
  }

  return (
      <Modal
        open={props.open}
        onClose={props.handleClose}
      >
        <Box component="form" sx={style}>
            <Grid container spacing={0.5} justifyContent="center" alignItems="center">
              <AppBar position="static" color="secondary">
                登録
              </AppBar>
              <Grid item xs={12}>
                <TextField id="type" name="type" label="タイプ" size="small" select sx={{width:200}} value={props.destination.type}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,type:event.target.value});
                }}>
                 {typeOptions}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField id="name" name="name" label="名称" size="small" sx={{width:600}} value={props.destination.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,name:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField id="address" name="address" label="住所" size="small" sx={{width:600}} value={props.destination.address}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,address:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField id="tel_number" name="tel_number" label="TEL" size="small" sx={{width:300}}
                value={props.destination.tel_number}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,tel_number:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField id="reservation" name="reservation" label="予約番号" size="small" sx={{width:300}}
                value={props.destination.reservation}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,reservation:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField id="reservation_site" name="reservation_site" label="予約サイト" size="small"
                 value={props.destination.reservation_site}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,reservation_site:event.target.value});
                }}>
                </TextField>
                </Grid>
                <Grid item xs={9}>
                <TextField id="reservation_url" name="reservation_url" label="予約URL" size="small" sx={{width:450}} type="url"
                value={props.destination.reservation_url}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,reservation_url:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField id="fee" name="fee" label="金額" size="small" type="number" value={props.destination.fee}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,fee:(event.target.value as unknown)as number});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField id="currency" name="currency" label="通貨" size="small" sx={{width:200}}
                  value={props.destination.currency} select
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    props.updateForm({...props.destination,currency:event.target.value});
                  }}>
                  <MenuItem key="Yen" value="Yen">円</MenuItem>
                  <MenuItem key="Dollar" value="Dollar">ドル</MenuItem>
                  <MenuItem key="Euro" value="Euro">ユーロ</MenuItem>
                  <MenuItem key="Local" value="Local">現地通貨</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField id="pay" name="pay" label="支払い" size="small" sx={{width:100}}
                  value={props.destination.pay} select
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    props.updateForm({...props.destination,pay:event.target.value});
                  }}>
                  <MenuItem key="Total" value="Total">総額</MenuItem>
                  <MenuItem key="Every" value="Every">個別</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField id="source" name="source" label="情報源" size="small" value={props.destination.source}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,source:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={9}>
                <TextField id="url" name="url" label="情報源URL" size="small" sx={{width:450}} type="url"
                  value={props.destination.url}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    props.updateForm({...props.destination,url:event.target.value});
                  }}>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField id="url2" name="url2" label="参考URL" size="small" sx={{width:600}}
                value={props.destination.url2}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,url2:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField id="map_url" name="map_url" label="地図URL" size="small" sx={{width:600}}
                value={props.destination.map_url}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,map_url:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField id="memo" name="memo" label="備考" size="small" sx={{width:600}} multiline rows={2}
                value={props.destination.memo}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  props.updateForm({...props.destination,memo:event.target.value});
                }}>
                </TextField>
              </Grid>
              <Grid item xs={2}>
              <Typography>定休日</Typography> 
              </Grid>
              <Grid item xs={10}>
                <FormGroup row={true}>
                <Typography>
                  <FormControlLabel 
                    checked={props.destination.hd_mon} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_mon:checked});
                    }}
                    control={<Checkbox size="small"/>} label="月" />
                  <FormControlLabel 
                    checked={props.destination.hd_tue} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_tue:checked});
                    }}
                    control={<Checkbox size="small"/>} label="火" />
                  <FormControlLabel 
                    checked={props.destination.hd_wed} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_wed:checked});
                    }}
                    control={<Checkbox size="small"/>} label="水" />
                  <FormControlLabel 
                    checked={props.destination.hd_thu} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_thu:checked});
                    }}
                    control={<Checkbox size="small"/>} label="木" />
                  <FormControlLabel 
                    checked={props.destination.hd_fri} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_fri:checked});
                    }}
                    control={<Checkbox size="small"/>} label="金" />
                  <FormControlLabel 
                    checked={props.destination.hd_sat} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_sat:checked});
                    }}
                    control={<Checkbox size="small"/>} label="土" />
                  <FormControlLabel 
                    checked={props.destination.hd_sun} 
                    onChange={(event: SyntheticEvent,checked:boolean) => {
                      props.updateForm({...props.destination,hd_sun:checked});
                    }}
                    control={<Checkbox size="small"/>} label="日" />
                </Typography>
                </FormGroup>
              </Grid>
            </Grid>
            <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
            <Button onClick={props.saveData} variant="outlined">OK</Button>
        </Box>
      </Modal>
    );
}

/**
 * 目的パネル
 */
export function DestinationPanel() {
  const [destination,setDestination] = useState<IDestination>(plan.getNewDestination());
  const [destinationRows,setDestinationRows] = useState<object[]>(plan.getDestinationRows());
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // リスト更新
  const updateList = () => {
    setDestinationRows(plan.getDestinationRows());
  }

  // 目的地を追加
  const addClickHandler = () => {
    setDestination(plan.getNewDestination());
    handleOpen();
  }

  // フォームを更新
  const updateForm = (dest:object) => {
    setDestination(dest as IDestination);
  }

  // 登録開始
  const saveData = () => {
    plan.updateDestination(destination);
    updateList();
    handleClose();
  };

  return (
    <div>
      <Box sx={{display: 'flex',flexDirection: 'row',m:0, p:0,marginY: "10px" }}>
        <Box sx={{m:0, p:0}}>
        <Button onClick={addClickHandler} fullWidth><AddIcon></AddIcon>追加</Button>
        </Box>
        <EditDestinationModal 
          open={open}
          handleClose={handleClose} 
          updateForm={updateForm}
          saveData={saveData}
          destination={destination}
        >
        </EditDestinationModal>
      </Box>
      <DestinationGrid destinationRows={destinationRows} updateList={updateList}></DestinationGrid>
    </div>
  );
}

export default DestinationPanel;
