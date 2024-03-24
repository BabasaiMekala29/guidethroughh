import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#757575',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        //   backgroundColor: theme.palette.common.black,
        backgroundColor: '#757575'
    },
}));