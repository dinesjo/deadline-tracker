import {
  Dropdown,
  ListItem,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function UserDropdown({ profile, setProfile, setUser }) {
  const login = useGoogleLogin({
    onSuccess: (response) => setUser(response),
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <Dropdown>
      <MenuButton variant="plain">
        {profile && profile.picture ? (
          <img
            src={profile.picture}
            alt="profile"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <FaUser />
        )}
      </MenuButton>
      <Menu variant="plain">
        {profile ? (
          <>
            <ListItem
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Typography level="title-sm">{profile.name}</Typography>
              <Typography level="body-sm">{profile.email}</Typography>
            </ListItem>
            <MenuItem
              color="danger"
              onClick={() => {
                googleLogout();
                setProfile(null);
              }}
            >
              <ListItemDecorator>
                <FaSignOutAlt />
              </ListItemDecorator>
              Log Out
            </MenuItem>
          </>
        ) : (
          <MenuItem color="primary" onClick={() => login()}>
            <ListItemDecorator>
              <FaSignInAlt />
            </ListItemDecorator>
            Sign In
          </MenuItem>
        )}
      </Menu>
    </Dropdown>
  );
}
