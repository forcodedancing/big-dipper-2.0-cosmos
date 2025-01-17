import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.layout,
    display: 'grid',
    gridTemplateRows: 'auto',
    gridGap: theme.spacing(1),
    '& a': {
      color: theme.palette.custom.fonts.highlight,
    },
    [theme.breakpoints.up('lg')]: {
      gridGap: theme.spacing(2),
    },
  },
}));

export const useStyles = () => styles();
