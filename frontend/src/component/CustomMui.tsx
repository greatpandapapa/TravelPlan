import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid, gridClasses,DataGridProps } from '@mui/x-data-grid';
import TableCell from '@mui/material/TableCell';
import { Link } from '@mui/material';

export function getBgColor(mode:string) {
  if (mode === "odd") {
    return '#f8f8ff';
  } else {
    return '#fffaff';
  }
}

const StripedGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: getBgColor('odd'),
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: getBgColor('even'),
  }
}));
  
export function StripedDataGrid(props:DataGridProps) {  
  return (
    <StripedGrid 
      {...props}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
    />
  );
}

export function StripedDataGridByGroup(props:DataGridProps) {  
  return (
    <StripedGrid 
      {...props}
      getRowClassName={(params) =>
        params.row.grp_id % 2 === 0 ? 'even' : 'odd'
      }
    />
  );
}

export const SlimTableCell = styled(TableCell)({
  padding: 0,
  margin: 4,
  paddingLeft: 8,
  paddingRight: 8,
})

type AddressMapLinkProps = {
  address: string;
};

/**
 * 住所をGoogleMapのリンクにする
 */
export const AddressMapLink = ((props:AddressMapLinkProps)=>{
    let url = "https://www.google.com/maps/place/"+encodeURIComponent(props.address);
    return (<Link target="_blank" href={url}>{props.address}</Link>);
});

type ImageLinkProps = {
  url: string;
};

/**
 * 住所をGoogleMapのリンクにする
 */
export const ImageLink = ((props:ImageLinkProps)=>{
    let url = props.url;
    return (<img  width="400" src={url} alt="image"/>);
});
