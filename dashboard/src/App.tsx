import React, { useEffect, useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import axios from 'axios'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

const ButtonAppBar = (): JSX.Element => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CPU Metrics
          </Typography>
          <Button color="inherit"></Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

const App: React.FC = () => {
  const [data] = useState<{ labels: string[], datasets: Array<{ label: string, data: number[] }> } | null>(null)

  const [tableData, setTableData] = useState<any[]>([])

  const columns: GridColDef[] = [
    {
      field: 'clientId',
      headerName: 'Client ID',
      width: 500,
      editable: false
    },
    {
      field: '_time',
      headerName: 'Time',
      width: 400,
      editable: false
    },
    {
      field: '_value',
      headerName: 'CPU Usage',
      type: 'number',
      width: 200,
      editable: false
    }
  ]

  useEffect(() => {
    if (!data) {
      axios.get('http://localhost:3000/allData')
        .then(response => { setTableData(response.data.slice(-20)) })
        .catch(error => { console.error('Error fetching data', error) })
    }
  }, [data])

  return (
    <div>
      <ButtonAppBar />
      <Box sx={{ height: 400, width: '80%', margin: '0 auto', p: 3 }}>
          <DataGrid rows={tableData} columns={columns} getRowId={(id = 0) => id + Math.floor(Math.random() * 1000)} initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }} pageSizeOptions={[10]} />
        </Box>
    </div>
  )
}

export default App
