import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  list: {
    minHeight: '500px',
    height: '50vh',
  },
  actionIcons: {
    width: '1rem',
    marginLeft: theme.spacing(1),
  },
  emailIcon: {
    width: '1.5rem',
  },
  even: {
    background: '#242424',
  },
}));

export const useStyles = () => styles();
