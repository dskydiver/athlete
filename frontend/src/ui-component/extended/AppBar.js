import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    AppBar as MuiAppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    Link,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    useScrollTrigger
} from '@mui/material';

// project imports
import Logo from 'ui-component/Logo';

// assets
import { IconLogout, IconKey, IconForms } from '@tabler/icons';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from "../../hooks/useAuth";

// elevation scroll
function ElevationScroll({ children, window }) {
    const theme = useTheme();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window
    });
    const darkBorder = theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.grey[200];

    return React.cloneElement(children, {
        elevation: trigger ? 2 : 0,
        style: {
            backgroundColor: theme.palette.background.default,
            borderBottom: trigger ? 'none' : '1px solid',
            borderColor: trigger ? '' : darkBorder,
            color: theme.palette.text.dark
        }
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.node,
    window: PropTypes.object
};

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

const AppBar = ({ ...others }) => {
    const { isLoggedIn, logout } = useAuth();
    const [drawerToggle, setDrawerToggle] = React.useState(false);
    /** Method called on multiple components with different event types */
    const drawerToggler = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerToggle(open);
    };

    return (
      <ElevationScroll {...others}>
          <MuiAppBar>
              <Container>
                  <Toolbar>
                      <Typography component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                          <Logo />
                      </Typography>
                      <Stack direction="row" sx={{ display: { xs: 'none', sm: 'block' } }} spacing={2}>
                          {
                              !isLoggedIn ? (
                                <Button
                                  component={RouterLink}
                                  to="/login"
                                  disableElevation
                                  variant="contained"
                                  color="secondary"
                                >
                                    Login
                                </Button>
                              ) : (
                                <>
                                    <Button
                                      component={RouterLink}
                                      to="/main"
                                      disableElevation
                                      variant="contained"
                                      color="secondary"
                                    >
                                        Profile Registration
                                    </Button>
                                    <Button
                                      onClick={logout}
                                      disableElevation
                                      variant="outlined"
                                      color="secondary"
                                    >
                                        Logout
                                    </Button>
                                </>
                              )
                          }
                      </Stack>
                      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                          <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
                              <MenuIcon />
                          </IconButton>
                          <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
                              {drawerToggle && (
                                <Box
                                  sx={{ width: 'auto' }}
                                  role="presentation"
                                  onClick={drawerToggler(false)}
                                  onKeyDown={drawerToggler(false)}
                                >
                                    <List>
                                        {
                                            !isLoggedIn ? (
                                              <Link style={{ textDecoration: 'none' }} href="/login" target="_blank">
                                                  <ListItemButton component="a">
                                                      <ListItemIcon>
                                                          <IconKey />
                                                      </ListItemIcon>
                                                      <ListItemText primary="Login" />
                                                  </ListItemButton>
                                              </Link>
                                            ) : (
                                              <>
                                                  <Link
                                                    style={{ textDecoration: 'none' }}
                                                    href="/main"
                                                  >
                                                      <ListItemButton component="a">
                                                          <ListItemIcon>
                                                              <IconForms />
                                                          </ListItemIcon>
                                                          <ListItemText primary="Profile Registration" />
                                                      </ListItemButton>
                                                  </Link>
                                                  <ListItemButton component="a" onClick={logout}>
                                                      <ListItemIcon>
                                                          <IconLogout />
                                                      </ListItemIcon>
                                                      <ListItemText primary="Logout" />
                                                  </ListItemButton>
                                              </>
                                            )
                                        }
                                    </List>
                                </Box>
                              )}
                          </Drawer>
                      </Box>
                  </Toolbar>
              </Container>
          </MuiAppBar>
      </ElevationScroll>
    );
};

export default AppBar;
