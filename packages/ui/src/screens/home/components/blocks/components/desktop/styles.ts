import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
    '& a': {
      color: theme.palette.custom.fonts.highlight,
    },
  },
  table: {
    '& .MuiTableBody-root': {
      '& .MuiTableCell-root': {
        whiteSpace: 'nowrap',
      },
    },
  },
}));

export const useStyles = () => styles();
