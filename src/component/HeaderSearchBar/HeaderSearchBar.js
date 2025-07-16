import { FilterList } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

import { Search, SearchIconWrapper, StyledInputBase } from "./style";

const HeaderSearchBar = ({ SearchStyle, onChange = () => {}, value, filter = true }) => {
  return (
    <Search sx={SearchStyle}>
      <SearchIconWrapper>
        <SearchIcon color="secondary" fontSize="large" />
      </SearchIconWrapper>
      <StyledInputBase value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search…" inputProps={{ "aria-label": "search" }} />
      {/* {filter && <FilterList />} */}
    </Search>
  );
};

export default HeaderSearchBar;
