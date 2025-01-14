import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: theme.palette.custom.fonts.fontTwo,
    '& svg': {
      width: '16px',
      height: '16px',
      marginRight: theme.spacing(0.5),
    },
  },
  success: {
    '& .MuiSvgIcon-root': {
      fill: theme.palette.custom.results.pass,
    },
  },
  fail: {
    '& .MuiSvgIcon-root': {
      fill: theme.palette.custom.results.fail,
    },
  },
}));

export const useStyles = () => styles();
